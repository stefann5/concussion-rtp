package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.model.facts.ParentCategory;
import com.ftn.sbnz.model.template.AllowedActivityTemplate;
import com.ftn.sbnz.model.template.MinStepDwellTemplate;
import com.ftn.sbnz.model.template.RedFlagSeverityTemplate;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.Message;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KnowledgeService {

    private final KieServices kieServices;
    private KieContainer container;
    private final Map<String, KieSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Athlete> athletes = new ConcurrentHashMap<>();

    @Autowired
    public KnowledgeService(KieServices kieServices) {
        this.kieServices = kieServices;
    }

    @PostConstruct
    public void init() {
        this.container = buildContainer();
    }

    private KieContainer buildContainer() {
        try {
            KieFileSystem kfs = kieServices.newKieFileSystem();

            kfs.write("src/main/resources/META-INF/kmodule.xml", readClasspath("/META-INF/kmodule.xml"));

            String[] drlPaths = {
                    "rules/cep/ExertionPattern.drl",
                    "rules/cep/PersistingSymptoms.drl",
                    "rules/fc/ProgressionDecision.drl",
                    "rules/fc/ActivityValidation.drl",
                    "rules/fc/ActivityCategory.drl",
                    "rules/fc/ReadinessQuery.drl"
            };
            for (String path : drlPaths) {
                kfs.write("src/main/resources/" + path, readClasspath("/" + path));
            }

            String dwellDrl = compileTemplate("/templates/MinStepDwell.drt", "/templates/MinStepDwell.csv",
                    this::parseDwellRow);
            String redFlagDrl = compileTemplate("/templates/RedFlagSeverity.drt", "/templates/RedFlagSeverity.csv",
                    this::parseRedFlagRow);
            String allowedDrl = compileTemplate("/templates/AllowedActivity.drt", "/templates/AllowedActivity.csv",
                    this::parseAllowedRow);

            kfs.write("src/main/resources/rules/templates/MinStepDwell.drl", dwellDrl);
            kfs.write("src/main/resources/rules/templates/RedFlagSeverity.drl", redFlagDrl);
            kfs.write("src/main/resources/rules/templates/AllowedActivity.drl", allowedDrl);

            KieBuilder builder = kieServices.newKieBuilder(kfs).buildAll();
            if (builder.getResults().hasMessages(Message.Level.ERROR)) {
                throw new RuntimeException("KIE build errors: " + builder.getResults().getMessages());
            }
            return kieServices.newKieContainer(kieServices.getRepository().getDefaultReleaseId());
        } catch (IOException e) {
            throw new RuntimeException("Failed to build knowledge base", e);
        }
    }

    private <T> String compileTemplate(String drtPath, String csvPath, RowParser<T> parser) throws IOException {
        try (InputStream drtStream = getClass().getResourceAsStream(drtPath);
             BufferedReader r = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(csvPath), StandardCharsets.UTF_8))) {
            List<T> data = new ArrayList<>();
            String line;
            boolean first = true;
            while ((line = r.readLine()) != null) {
                if (line.isBlank()) continue;
                if (first) { first = false; continue; }
                String[] cols = line.split(",");
                data.add(parser.parse(cols));
            }
            ObjectDataCompiler compiler = new ObjectDataCompiler();
            return compiler.compile(data, drtStream);
        }
    }

    private MinStepDwellTemplate parseDwellRow(String[] c) {
        return new MinStepDwellTemplate(c[0].trim(), c[1].trim(), c[2].trim(), Integer.parseInt(c[3].trim()));
    }

    private RedFlagSeverityTemplate parseRedFlagRow(String[] c) {
        return new RedFlagSeverityTemplate(c[0].trim(), c[1].trim(), Integer.parseInt(c[2].trim()), c[3].trim());
    }

    private AllowedActivityTemplate parseAllowedRow(String[] c) {
        return new AllowedActivityTemplate(Integer.parseInt(c[0].trim()), c[1].trim(), c[2].trim());
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

    @FunctionalInterface
    private interface RowParser<T> { T parse(String[] cols); }

    public KieContainer getContainer() {
        return container;
    }

    public KieSession getSessionFor(String athleteId) {
        return sessions.computeIfAbsent(athleteId, this::createSessionFor);
    }

    private KieSession createSessionFor(String athleteId) {
        KieSession session = container.newKieSession();
        seedActivityTree(session);
        Athlete athlete = athletes.get(athleteId);
        if (athlete != null) {
            session.insert(athlete);
            session.fireAllRules();
        }
        return session;
    }

    private void seedActivityTree(KieSession session) {
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
        for (ParentCategory pc : tree) session.insert(pc);
    }

    public void registerAthlete(Athlete athlete) {
        athletes.put(athlete.getId(), athlete);
        KieSession existing = sessions.remove(athlete.getId());
        if (existing != null) existing.dispose();
        getSessionFor(athlete.getId());
    }

    public Athlete getAthlete(String id) {
        return athletes.get(id);
    }

    public List<Athlete> listAthletes() {
        return new ArrayList<>(athletes.values());
    }

    @PreDestroy
    public void disposeAll() {
        sessions.values().forEach(KieSession::dispose);
        sessions.clear();
    }
}
