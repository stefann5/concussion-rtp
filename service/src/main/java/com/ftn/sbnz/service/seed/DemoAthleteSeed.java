package com.ftn.sbnz.service.seed;

import com.ftn.sbnz.model.auth.Role;
import com.ftn.sbnz.model.auth.User;
import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.model.domain.PreviousConcussion;
import com.ftn.sbnz.model.domain.RiskFactors;
import com.ftn.sbnz.model.enums.AgeGroup;
import com.ftn.sbnz.model.enums.ContactLevel;
import com.ftn.sbnz.model.enums.HistoryFlag;
import com.ftn.sbnz.model.enums.Sex;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.service.auth.UserStore;
import com.ftn.sbnz.service.service.KnowledgeService;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Component
public class DemoAthleteSeed {

    private final KnowledgeService knowledge;
    private final ProtocolService protocol;
    private final UserStore userStore;
    private final PasswordEncoder encoder;

    public DemoAthleteSeed(KnowledgeService knowledge, ProtocolService protocol,
                           UserStore userStore, PasswordEncoder encoder) {
        this.knowledge = knowledge;
        this.protocol = protocol;
        this.userStore = userStore;
        this.encoder = encoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (!knowledge.listAthletes().isEmpty()) return;

        Athlete marko = build("ath_marko", "Marko Jovanović", 19, Sex.MALE, "rugby",
                "flanker", "club", ContactLevel.CONTACT, AgeGroup.ADULT, HistoryFlag.NONE,
                3, LocalDateTime.now().minusDays(5));
        knowledge.registerAthlete(marko);
        userStore.register(new User("marko", encoder.encode("marko"), Role.ATHLETE, marko.getName(), marko.getId()));
        protocol.reportSymptom(new SymptomReportedEvent(marko.getId(), "HEADACHE", 1,
                Date.from(LocalDateTime.now().minusDays(2).atZone(java.time.ZoneId.systemDefault()).toInstant())));
        protocol.reportSymptomDuringExertion(new SymptomDuringExertionEvent(marko.getId(), "HEADACHE", 3, 40,
                Date.from(LocalDateTime.now().minusHours(3).atZone(java.time.ZoneId.systemDefault()).toInstant())));

        Athlete sara = build("ath_sara", "Sara Marković", 15, Sex.FEMALE, "soccer",
                "midfielder", "school", ContactLevel.CONTACT, AgeGroup.PEDIATRIC, HistoryFlag.SINGLE,
                2, LocalDateTime.now().minusDays(8));
        sara.getRiskFactors().setMigraine(true);
        sara.getPreviousConcussions().add(new PreviousConcussion(LocalDate.now().minusYears(1), 18));
        knowledge.registerAthlete(sara);
        userStore.register(new User("sara", encoder.encode("sara"), Role.ATHLETE, sara.getName(), sara.getId()));
        protocol.reportSymptom(new SymptomReportedEvent(sara.getId(), "DIZZINESS", 2,
                Date.from(LocalDateTime.now().minusDays(1).atZone(java.time.ZoneId.systemDefault()).toInstant())));

        Athlete luka = build("ath_luka", "Luka Đorđević", 24, Sex.MALE, "basketball",
                "guard", "professional", ContactLevel.NONCONTACT, AgeGroup.ADULT, HistoryFlag.MULTIPLE,
                5, LocalDateTime.now().minusDays(14));
        luka.getRiskFactors().setAnxiety(true);
        luka.getPreviousConcussions().add(new PreviousConcussion(LocalDate.now().minusYears(2), 21));
        luka.getPreviousConcussions().add(new PreviousConcussion(LocalDate.now().minusMonths(8), 28));
        knowledge.registerAthlete(luka);
        userStore.register(new User("luka", encoder.encode("luka"), Role.ATHLETE, luka.getName(), luka.getId()));
    }

    private Athlete build(String id, String name, int age, Sex sex, String sport,
                          String position, String level, ContactLevel contact,
                          AgeGroup ageGroup, HistoryFlag history, int step, LocalDateTime injury) {
        Athlete a = new Athlete();
        a.setId(id);
        a.setName(name);
        a.setAge(age);
        a.setSex(sex);
        a.setSport(sport);
        a.setPosition(position);
        a.setCompetitionLevel(level);
        a.setContactLevel(contact);
        a.setAgeGroup(ageGroup);
        a.setHistoryFlag(history);
        a.setRiskFactors(new RiskFactors());
        a.setCurrentStep(step);
        a.setStepEnteredAt(injury.plusDays(step - 1));
        a.setInjuryAt(injury);
        return a;
    }
}
