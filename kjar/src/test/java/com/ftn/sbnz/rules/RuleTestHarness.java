package com.ftn.sbnz.rules;

import com.ftn.sbnz.model.facts.ParentCategory;
import com.ftn.sbnz.model.template.AllowedActivityTemplate;
import com.ftn.sbnz.model.template.MinStepDwellTemplate;
import com.ftn.sbnz.model.template.RedFlagSeverityTemplate;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.Message;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.KieSessionConfiguration;
import org.kie.api.runtime.conf.ClockTypeOption;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public final class RuleTestHarness {

    private static final String KMODULE_XML = "" +
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kmodule xmlns=\"http://www.drools.org/xsd/kmodule\">" +
            "  <kbase name=\"testKbase\" packages=\"rules.cep,rules.fc,rules.templates\" " +
            "         eventProcessingMode=\"stream\" default=\"true\">" +
            "    <ksession name=\"testKsession\" type=\"stateful\" clockType=\"pseudo\" default=\"true\"/>" +
            "  </kbase>" +
            "</kmodule>";

    private static final String[] DRL_PATHS = {
            "rules/cep/ExertionPattern.drl",
            "rules/cep/PersistingSymptoms.drl",
            "rules/fc/ProgressionDecision.drl",
            "rules/fc/ActivityValidation.drl",
            "rules/fc/ActivityCategory.drl",
            "rules/fc/ReadinessQuery.drl",
            "rules/fc/IndividualizedAssessment.drl",
            "rules/fc/MedicalClearance.drl"
    };

    private final KieContainer container;

    public RuleTestHarness() {
        try {
            this.container = buildContainer();
        } catch (IOException e) {
            throw new IllegalStateException("Failed to build test KIE container", e);
        }
    }

    public KieSession newSession() {
        KieSessionConfiguration cfg = KieServices.Factory.get().newKieSessionConfiguration();
        cfg.setOption(ClockTypeOption.get("pseudo"));
        KieSession s = container.newKieSession("testKsession", cfg);
        seedActivityTree(s);
        return s;
    }

    private KieContainer buildContainer() throws IOException {
        KieServices ks = KieServices.Factory.get();
        KieFileSystem kfs = ks.newKieFileSystem();

        kfs.write("src/main/resources/META-INF/kmodule.xml", KMODULE_XML);

        for (String path : DRL_PATHS) {
            kfs.write("src/main/resources/" + path, readClasspath("/" + path));
        }

        kfs.write("src/main/resources/rules/templates/MinStepDwell.drl",
                compileTemplate("/templates/MinStepDwell.drt", "/templates/MinStepDwell.csv",
                        c -> new MinStepDwellTemplate(c[0].trim(), c[1].trim(), Integer.parseInt(c[2].trim()))));
        kfs.write("src/main/resources/rules/templates/AllowedActivity.drl",
                compileTemplate("/templates/AllowedActivity.drt", "/templates/AllowedActivity.csv",
                        c -> new AllowedActivityTemplate(Integer.parseInt(c[0].trim()), c[1].trim(), c[2].trim())));
        kfs.write("src/main/resources/rules/templates/RedFlagSeverity.drl",
                compileTemplate("/templates/RedFlagSeverity.drt", "/templates/RedFlagSeverity.csv",
                        c -> new RedFlagSeverityTemplate(c[0].trim(), c[1].trim(), Integer.parseInt(c[2].trim()), c[3].trim())));

        KieBuilder builder = ks.newKieBuilder(kfs).buildAll();
        if (builder.getResults().hasMessages(Message.Level.ERROR)) {
            throw new IllegalStateException("KIE build errors: " + builder.getResults().getMessages());
        }
        return ks.newKieContainer(ks.getRepository().getDefaultReleaseId());
    }

    @FunctionalInterface
    private interface RowParser<T> { T parse(String[] cols); }

    private <T> String compileTemplate(String drtPath, String csvPath, RowParser<T> parser) throws IOException {
        String csv = readClasspath(csvPath);
        try (InputStream drtStream = getClass().getResourceAsStream(drtPath);
             BufferedReader r = new BufferedReader(new StringReader(csv))) {
            List<T> data = new ArrayList<>();
            String line;
            boolean firstLine = true;
            while ((line = r.readLine()) != null) {
                if (line.isBlank()) continue;
                if (firstLine) { firstLine = false; continue; }
                data.add(parser.parse(line.split(",")));
            }
            return new ObjectDataCompiler().compile(data, drtStream);
        }
    }

    private String readClasspath(String path) throws IOException {
        try (InputStream is = getClass().getResourceAsStream(path);
             BufferedReader r = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = r.readLine()) != null) sb.append(line).append('\n');
            return sb.toString();
        }
    }

    private void seedActivityTree(KieSession s) {
        ParentCategory[] tree = {
                new ParentCategory("WALKING", "SYMPTOM_LIMITED_DAILY"),
                new ParentCategory("HOUSEHOLD_CHORES", "SYMPTOM_LIMITED_DAILY"),
                new ParentCategory("SYMPTOM_LIMITED_DAILY", "EXERCISE"),

                new ParentCategory("STATIONARY_BIKE", "LIGHT_AEROBIC"),
                new ParentCategory("EASY_WALK", "LIGHT_AEROBIC"),
                new ParentCategory("LIGHT_AEROBIC", "AEROBIC"),

                new ParentCategory("JOGGING", "MODERATE_AEROBIC"),
                new ParentCategory("ELLIPTICAL", "MODERATE_AEROBIC"),
                new ParentCategory("MODERATE_AEROBIC", "AEROBIC"),
                new ParentCategory("AEROBIC", "EXERCISE"),

                new ParentCategory("BODYWEIGHT_BASIC", "LIGHT_RESISTANCE"),
                new ParentCategory("LIGHT_RESISTANCE", "RESISTANCE"),
                new ParentCategory("RESISTANCE", "EXERCISE"),

                new ParentCategory("LINEAR_RUNNING", "RUNNING_DRILLS"),
                new ParentCategory("CHANGE_OF_DIRECTION", "RUNNING_DRILLS"),
                new ParentCategory("RUNNING_DRILLS", "SPORT_SPECIFIC_NO_CONTACT"),
                new ParentCategory("INDIVIDUAL_PASSING_DRILL", "BALL_DRILLS"),
                new ParentCategory("INDIVIDUAL_SHOOTING_DRILL", "BALL_DRILLS"),
                new ParentCategory("BALL_DRILLS", "SPORT_SPECIFIC_NO_CONTACT"),
                new ParentCategory("SPORT_SPECIFIC_NO_CONTACT", "EXERCISE"),

                new ParentCategory("TEAM_PASSING", "NON_CONTACT_TEAM_TRAINING"),
                new ParentCategory("TEAM_TACTICS", "NON_CONTACT_TEAM_TRAINING"),
                new ParentCategory("NON_CONTACT_TEAM_TRAINING", "EXERCISE"),

                new ParentCategory("FULL_CONTACT_TACKLE", "FULL_CONTACT_PRACTICE"),
                new ParentCategory("FULL_CONTACT_SCRIMMAGE", "FULL_CONTACT_PRACTICE"),
                new ParentCategory("FULL_CONTACT_PRACTICE", "CONTACT"),
                new ParentCategory("COMPETITIVE_PLAY", "CONTACT"),
                new ParentCategory("CONTACT", "EXERCISE")
        };
        for (ParentCategory pc : tree) s.insert(pc);
    }
}
