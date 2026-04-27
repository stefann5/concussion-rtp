# SBNZ — Predlog projekta

## Sistem za vođenje sportiste kroz protokol povratka igri posle potresa mozga

---

## 1. Članovi tima

- Stefan Nikolić SV5-2022

---

## 2. Motivacija

Potres mozga je jedna od najčešćih sportskih povreda. Procenjuje se da se godišnje u svetu desi 1.6–3.8 miliona sportskih potresa, a mnogi ostaju neprijavljeni. Ključni problem nije sama povreda, već **prerano vraćanje na trening i takmičenje** — ponovljeni potres pre potpunog oporavka višestruko povećava rizik od **sindroma drugog udarca** (second impact syndrome), produženog post-potresnog sindroma i **hronične traumatske encefalopatije** (CTE — chronic traumatic encephalopathy).

Međunarodna stručna grupa za potres mozga u sportu (CISG — Concussion in Sport Group) izdala je **Amsterdam 2022 konsenzus** koji propisuje strogo strukturisan šestostepeni **protokol stepenovanog povratka igri** (u literaturi poznat kao GRTP — Graduated Return to Play) sa jasnim uslovima za prelazak između koraka, faktorima rizika i razlozima za hitnu medicinsku reakciju.

U praksi, sprovođenje protokola zavisi od individualne procene sportskog lekara koji često nije svakodnevno dostupan, dok atletski treneri i sportisti samostalno donose odluke koje zahtevaju **ulančano zaključivanje nad istorijom simptoma, vremenskim prozorima i individualnim faktorima**. Greške nastaju kada simptom prođe neopaženo, kada se ne prepozna obrazac izazivanja simptoma vežbom, ili kada se ne uzme u obzir prethodna istorija potresa.

Cilj projekta je da se Amsterdam 2022 protokol prevede u sistem baziran na pravilima koji svakodnevno prati simptome sportiste, automatski donosi preporuke o napredovanju ili vraćanju unazad u protokolu, prepoznaje znakove koji nalažu hitnu reakciju, i pruža lekaru jasno objašnjenje (lanac dokaza) iza svake odluke.

---

## 3. Pregled problema i pregled literature

### 3.1 Domen problema

Sportski potres mozga karakterišu prolazni neurokognitivni, telesni i emocionalni simptomi koji se ocenjuju standardizovanim alatima **SCAT6** i **Child SCAT6** (SCAT — Sport Concussion Assessment Tool, 6. izdanje; optimalno za prvih 72 sata posle povrede) i **SCOAT6** / **Child SCOAT6** (SCOAT — Sport Concussion Office Assessment Tool, za procene u ordinaciji od 72h naviše). Klinički put oporavka organizovan je u šest koraka:

1. **Aktivnosti ograničene simptomima** (Symptom-limited activity) — svakodnevne aktivnosti koje ne pogoršavaju simptome (npr. hodanje)
2. **Aerobna vežba** (Aerobic exercise) — 2A: lagani napor (do ~55% maksimalne srčane frekvence — maxHR); 2B: umereni napor (do ~70% maxHR), uz mogući lagani trening sa opterećenjem
3. **Vežbe specifične za sport** (Sport-specific exercise) — sportske vežbe van timskog okruženja, bez aktivnosti sa rizikom udarca u glavu (ako vežbe specifične za sport nose taj rizik, **odobrenje lekara** je potrebno već pre Koraka 3)
4. **Trening bez kontakta** (Non-contact training drills) — složeniji trening visokog intenziteta, uključivanje u timski rad
5. **Pun kontaktni trening** (Full-contact practice) — normalne trenažne aktivnosti
6. **Povratak igri** (Return to sport) — normalna takmičarska igra

Minimum između koraka je **24 sata** za sve uzraste. Koraci 4–6 (i Korak 3 ako uključuje rizik od udarca u glavu) zahtevaju **odobrenje lekara** i potpuno povlačenje simptoma povezanih sa povredom (uključujući odsustvo simptoma tokom i posle fizičkog napora). Ako se tokom **Koraka 1–3** javi pogoršanje veće od "blagog i kratkotrajnog" (porast >2 poena na skali 0–10 ili trajanje duže od 1 sata), sportista **zaustavlja vežbu i ponovo pokušava isti korak sledećeg dana**. Ako se tokom **Koraka 4–6** jave simptomi povezani sa potresom, sportista **se vraća na Korak 3** dok se ne potvrdi pun nestanak simptoma uz napor, pre nego što ponovo uđe u aktivnosti sa rizikom udaraca.

### 3.2 Postojeća rešenja

U praksi se Amsterdam 2022 protokol najčešće sprovodi kroz tri klase alata:

1. **Papirni i digitalizovani SCAT/SCOAT obrasci** — zvanični obrasci CISG-a koje lekar popunjava ručno (na papiru ili u mobilnoj aplikaciji). Služe kao strukturisana lista pitanja i polja, ne kao sistem odlučivanja.
2. **Statički vodiči kroz protokol** — PDF ili web stranice koje opisuju 6 koraka i propisane minimume; sportista ili lekar ih ručno prati i ručno odlučuje o prelasku između koraka.
3. **Dnevnici simptoma** — opšte aplikacije za praćenje koje sportista popunjava svakodnevno; obično prikazuju vremenske grafikone ali ne donose preporuke.

Ovo su **alati za prikupljanje i prikaz podataka**, ne sistemi za zaključivanje. Sportista ili lekar i dalje sami treba da:

- Spoje istoriju simptoma kroz više dana i prepoznaju da li postoji obrazac (npr. da se pogoršanje pojavljuje baš pri pokušaju vežbe više dana zaredom)
- Uzmu u obzir CISG faktore rizika (istorija prethodnih potresa, migrena, poteškoće u učenju, problemi sa snom) i njihov efekat na očekivani oporavak
- Donesu odluku o prelasku ili vraćanju koraka i opravdaju je
- Prepoznaju kombinacije znakova koji nalažu hitnu reakciju i razgraniče ih od običnog pogoršanja

Što više sportista lekar prati, što su slučajevi složeniji (ponovljena povreda, prateća stanja), to su ove ručne odluke podložnije propustima i nedoslednosti između lekara.

### 3.3 Prednost predloženog rešenja

Predloženi sistem **dopunjuje** postojeću klasu alata tako što dodaje sloj automatskog zaključivanja iznad ulaznih obrazaca:

- **Zaključuje nad tokom događaja** (dnevni unos simptoma, pokušaji vežbi, prelazni trenuci) i prepoznaje obrasce kroz vreme koje statički prikaz ne može
- **Prevodi pravila Amsterdam 2022 dogovora** (uslove za napredovanje, blago i kratkotrajno pogoršanje, znakove za hitnu reakciju) u računarski izvršiva pravila, tako da svaki korak protokola ima eksplicitno proverljiv izraz
- **Sistematski uzima u obzir CISG faktore rizika** i istoriju prethodnih potresa kroz parametrizovane šablone pravila
- **Za svaku odluku gradi lanac dokaza** (zahvaljujući unazadnom ulančavanju) koji lekar može pregledati i, ako se ne slaže, umešati se i ručno potvrditi ili odbiti preporuku

Sistem pri tome **ne zamenjuje SCAT/SCOAT obrasce** — naprotiv, oni su mu glavni ulaz; samo dodaje rezonovanje povrh njih.

### 3.4 Reference

1. Patricios JS, Schneider KJ, Dvorak J, et al. *Consensus statement on concussion in sport: the 6th International Conference on Concussion in Sport — Amsterdam, October 2022.* British Journal of Sports Medicine, 2023;57:695–711.
2. Echemendia RJ, Burma JS, Bruce JM, et al. *Acute evaluation of sport-related concussion and implications for the Sport Concussion Assessment Tool (SCAT6) for adults, adolescents and children: a systematic review.* British Journal of Sports Medicine, 2023.
3. Patricios JS, Schneider GM, van Iersel J, et al. *Beyond acute assessment to office management: a systematic review informing the development of a Sport Concussion Office Assessment Tool (SCOAT6) for adults and children.* British Journal of Sports Medicine, 2023.
4. Putukian M, Purcell L, Schneider K, et al. *Clinical recovery from concussion: return to school and sport: a systematic review and meta-analysis.* British Journal of Sports Medicine, 2023.
5. Leddy JJ, Burma JS, Toomey CM, et al. *Rest and exercise early after sport-related concussion: a systematic review and meta-analysis.* British Journal of Sports Medicine, 2023.
6. CDC HEADS UP. *Concussion in Youth Sports — Clinical Resources.* Centers for Disease Control and Prevention, dostupno na cdc.gov/headsup.

---

## 4. Metodologija rada

### 4.1 Ulazi u sistem

**Profil sportiste (statične činjenice)**:
- Lični podaci: id, godine, pol
- Sportski profil: sport, pozicija, nivo takmičenja
- Istorija povreda: lista prethodnih potresa sa datumima i trajanjem oporavka
- CISG faktori rizika: migrena, ADHD (poremećaj pažnje sa hiperaktivnošću), anksioznost, poteškoće u učenju, prethodna istorija mentalnog zdravlja
- Individualni početni nivo simptoma (npr. hroničan blagi tinitus 1/6) — koristi se kao referenca da se ne broje hronični simptomi kao novi

**Početno stanje povrede (statične činjenice, postavljaju se u trenutku povrede)**:
- Datum i vreme povrede
- Način nastanka (kontakt sa drugim sportistom, pad, oprema)
- Gubitak svesti (LOC — Loss of Consciousness, u sekundama)
- Posttraumatska amnezija (PTA — Post-Traumatic Amnesia, u minutima)
- Rezultat SCAT procene sa terena
- Znakovi koji nalažu hitnu reakciju prisutni na početku

**Dnevni unosi (događaji)**:
- `SymptomReportedEvent` — 22 SCAT6 simptoma sa ocenom 0–6, sa vremenskom oznakom (direktno mapira SCAT6 simptom skalu)
- `ExertionAttemptEvent` — koju aktivnost je sportista probao tog dana i na kom intenzitetu
- `SymptomDuringExertionEvent` — oznaka da li se simptom javio baš tokom vežbe (mapira SCAT6 polje *"Do your symptoms get worse with physical activity?"*)

**Prelazni događaji**:
- `StepAdvancementEvent` — odluka o prelasku na sledeći korak
- `MedicalClearanceEvent` — odobrenje lekara (uslov pre Koraka sa rizikom udaraca u glavu)

**Klinička merenja (povremena, na kliničim posetama)**:
- `ObjectiveTestEvent` — rezultati objektivnih testova sa SCAT6 i SCOAT6 obrazaca koje lekar ili atletski trener unosi po proceni:
  - **mBESS** (Modified Balance Error Scoring System — modifikovani sistem ocenjivanja grešaka pri balansu; broj grešaka, SCAT6 Step 4)
  - **Timed Tandem Gait** i **Dual Task Gait** (vreme u sekundama, SCAT6 Step 4)
  - **VOMS** (Vestibular/Ocular Motor Screening — vestibularno-okularno motorni skrining, SCOAT6)

### 4.2 Izlazi sistema

**Za sportistu**:
- Trenutni korak protokola
- Lista dozvoljenih aktivnosti za danas
- Lista zabranjenih aktivnosti (izričito)
- Kretanje simptoma kroz vreme (grafikon)
- Procenjeni najraniji datum povratka na sport

**Za lekara / atletskog trenera**:
- Trenutni alarm o znaku za hitnu reakciju
- Preporuka napredovanja / vraćanja unazad sa objašnjenjem (lanac dokaza iz unazadnog ulančavanja)
- Oznaka uključenog izmenjenog podprotokola (pedijatrijski, indikacija za cervikovestibularnu rehabilitaciju, perzistentni simptomi, ponovljeni potres — individualizovana procena)
- Tabla svih sportista pod nadzorom sa filtriranjem po riziku
- Izveštaj o pridržavanju protokola od strane sportiste

**Sistemski izlazi**:
- Zapisnik (audit log) svih odluka sa lancem pravila koja su se okidala
- Brojčani izveštaji (broj sportista po koracima, prosečno vreme oporavka, raspodela po sportovima)

### 4.3 Baza znanja

**Šta sistem treba da zna**:

1. **Strukturu Amsterdam 2022 protokola stepenovanog povratka igri (GRTP)**: 6 koraka, dozvoljene aktivnosti po koraku, minimum 24h između koraka, uslovi koji zahtevaju odobrenje lekara pre koraka sa rizikom udaraca u glavu (Koraci 4–6, plus Korak 3 ako vežbe specifične za sport nose taj rizik).
2. **Listu znakova koji nalažu trenutno udaljavanje sa terena i hitnu medicinsku procenu** (po Amsterdam 2022 i CRT6 — Concussion Recognition Tool 6): gubitak svesti ili sumnja na isti, konvulzije, ukočenost (tonic posturing), poremećaj koordinacije (ataksija), problem sa balansom, konfuzija, promene ponašanja, amnezija; plus tradicionalni razlozi za hitnu pomoć (pogoršanje glavobolje, ponovljeno povraćanje, slabost ili utrnulost ruku/nogu, otežan govor, povećana konfuzija ili uznemirenost).
3. **CISG faktore koji mogu produžiti oporavak** (izričito navedeni u Amsterdam 2022 kao faktori rizika): istorija prethodnih potresa, migrena ili druge glavobolje, anksioznost, depresija, poteškoće u učenju ili ADHD, problemi sa snom u prvih 10 dana posle povrede. Dogovor za sportiste sa ponovljenim potresima preporučuje **individualizovanu procenu** lekara, bez fiksnog brojčanog praga; sistem ovo prevodi u parametrizovana proširena pravila (npr. obavezna dodatna procena lekara pre Koraka 4) održiva kroz tabele šablona.
4. **Definicije iz Amsterdam 2022** za stanja simptoma:
   - *Blago i kratkotrajno pogoršanje* (mild and brief exacerbation): porast simptoma ≤2 poena na skali 0–10 i trajanje <1h tokom napora — **tolerisan**, nije razlog za zaustavljanje
   - *Povlačenje simptoma u mirovanju* (symptom resolution at rest): simptomi povezani sa povredom su nestali kad sportista miruje
   - *Potpuno povlačenje simptoma* (complete symptom resolution): nema simptoma ni u mirovanju ni posle najjačeg fizičkog ili misaonog napora
5. **Pragove za pojačanu brigu (iz Amsterdam 2022 i pratećih sistematskih pregleda)**:
   - **>10 dana** vrtoglavica / bol u vratu / glavobolja → indikacija za **cervikovestibularnu rehabilitaciju**
   - **2–4 nedelje** ako simptomi traju, pogoršavaju se ili ne idu na bolje → **višestruka procena (SCOAT6) i upućivanje na rehabilitaciju**
   - **>4 nedelje** = zvanična definicija **"perzistentnih simptoma"** (persisting symptoms; ista za decu, adolescente i odrasle, glasanje stručne grupe 92.9% slaganja)
6. **Razvrstavanje sportova po nivou kontakta**: kontaktni i sportovi sa rizikom sudara (svih 6 koraka), nekontaktni (Koraci 4–5 mogu biti smanjeni jer nema rizika udarca u glavu), pedijatrija (potpuni povratak učenju — RTL, Return to Learn — pre potpunog povratka sportu — RTS, Return to Sport; povratak školi ima prioritet).

**Kako se baza znanja popunjava**:

- **Stalni deo** (protokol, pragovi, faktori rizika) je na početku učitan iz početnih (seed) podataka i može se održavati kroz lekarski (administratorski) interfejs.
- **Promenljivi deo** (profili sportista, događaji) popunjava se kroz REST programski interfejs (REST API): sportista i klinika unose podatke kroz korisnički interfejs (frontend).
- **Šabloni** (templates) za parametrizovana pravila (minimum dana po kombinaciji sport+godine, zabranjene aktivnosti po koraku) održavaju se kroz administratorski panel u tabelarnom obliku koji generiše DRL (Drools Rule Language — Drools jezik pravila) pravila.

**Kako se baza znanja koristi**:

- Pri svakom dnevnom unosu okida se lanac pravila unaprednog ulančavanja (FC — Forward Chaining) koja izvode kretanje simptoma, ažuriraju stanje napredovanja (ProgressionStatus) i daju preporuku koraka (StepRecommendation).
- Sesija obrade kompleksnih događaja (CEP — Complex Event Processing) paralelno gleda tok događaja i okida pravila za prepoznavanje obrazaca (povratak pogoršanja iznad blagog praga, obrazac netolerancije napora, perzistentni simptomi u prozorima 10 dana / 4 nedelje, klaster ponovljenih potresa za individualizovanu procenu).
- Na zahtev lekara (klikom na "Da li je sportista spreman za sledeći korak?") pokreće se sesija unazadnog ulančavanja (BC — Backward Chaining) koja rekurzivno proverava sve podciljeve.
- Upiti (queries) se koriste za izveštajne ekrane (ko ima perzistentne simptome, ko je spreman za napredovanje danas, ko ima indikaciju za cervikovestibularnu rehabilitaciju).

### 4.4 Konkretan primer zaključivanja, korak po korak

**Početno stanje**:
- Sportista: Marko, 19 godina, ragbi (kontaktni sport), prvi potres
- Trenutni datum: dan 5 posle povrede
- Trenutni korak: **Korak 3** (vežbe specifične za sport, bez kontakta)
- Uključeni faktori: nema

**Dan 5 unos**:
- 09:00: SymptomReportedEvent — glavobolja 1, vrtoglavica 0, magla u glavi 0, san 1; sve unutar početnog nivoa
- 14:00: ExertionAttemptEvent — vežbe specifične za sport (dozvoljene za Korak 3)
- 14:30: SymptomDuringExertionEvent — glavobolja porasla sa 1 na 4 (porast +3), vrtoglavica sa 0 na 2 (porast +2)

**Trag zaključivanja**:

1. **Nivo 1 (FC)**: Iz unosa simptoma izvedeno: `symptomDelta = +5 total`, `maxSingleSymptomDelta = +3`. Po Amsterdam 2022 definiciji, "mild and brief exacerbation" je porast ≤2 poena na skali 0–10 — Markov porast od +3 prelazi prag, pa se izvodi činjenica `MoreThanMildExacerbation(athleteId="marko", symptom="headache", delta=3)`
2. **CEP (obrada događaja u vremenu)**: Pravilo `SymptomRecurrenceAfterAdvance` se ne okida (poslednji `StepAdvancementEvent` je bio dan 4, izvan prozora od 24h)
3. **CEP + accumulate**: Pravilo `ExertionIntolerancePattern` gleda accumulate nad `SymptomDuringExertionEvent` u prozoru od 48h sa porastom iznad praga. Otkrivena 2 takva događaja zaredom → ubacuje `ExertionIntoleranceFlag(athleteId="marko")`
4. **Nivo 2 (FC)**: Pravilo `ComputeSymptomTrend` gleda poslednja 3 dana → `SymptomTrend(athleteId="marko", trend=WORSENING_WITH_PROVOCATION)`
5. **Nivo 3 (FC)**: Pravilo `DetermineProgressionStatus` gleda `SymptomTrend + ExertionIntoleranceFlag + MoreThanMildExacerbation` → ubacuje `ProgressionStatus(athleteId="marko", status=STOP_TODAY_RETRY_TOMORROW)`. **Marko je na Koraku 3**, pa se po Amsterdam 2022 logici za Korake 1–3 ne vraća unazad — zaustavlja vežbu i pokušava **isti** Korak 3 sledećeg dana
6. **Nivo 4 (FC)**: Pravilo `StepRecommendation` prevodi status u akciju → `StepRecommendation(athleteId="marko", action=HOLD, currentStep=3, retryAfterHours=24)`
7. **Instanca šablona**: Tabelarno pravilo `MinDaysBetweenSteps(sportContact=CONTACT, ageGroup=ADULT)` potvrđuje minimum od 24h pre sledećeg pokušaja
8. **Nivo 5 (FC)**: Pravilo `MaterializeConcreteActivity` generiše dva recepta:
   - `ConcreteActivityPrescription(athleteId="marko", date=day5_remainder, allowedActivities=[REST], blockedActivities=[ANY_EXERCISE], note="Stop today after setback")` — za ostatak dana 5
   - `ConcreteActivityPrescription(athleteId="marko", date=day6, allowedActivities=[SPORT_SPECIFIC_DRILLS_NO_HEAD_IMPACT, RUNNING, CHANGE_OF_DIRECTION_DRILLS, INDIVIDUAL_TRAINING_DRILLS], blockedActivities=[TEAM_DRILLS, CONTACT_DRILLS, COMPETITIVE_PLAY], note="Retry Step 3 — sport-specific training away from team environment, no head impact")` — za sutrašnji pokušaj istog Koraka 3 (po Amsterdam 2022 Tabeli 2)
9. **Promena stanja sportiste**: pravilo ne menja `athlete.currentStep` (ostaje 3), ali ubacuje `ProtocolLockEvent(athleteId="marko", lockUntilHours=24, reason="STOP_AND_RETRY")`
10. **Lekar pita kroz interfejs**: "Da li Marko može sutra na Korak 4?" → pokreće se **BC**:
    - Cilj: `readyForAdvance(athleteId="marko", targetStep=4)`
    - Podciljevi: `minTimeAtCurrentStep(24h) ∧ symptomFreeAtRest ∧ exertionTolerated ∧ noRedFlags ∧ medicalClearancePresent` (Korak 4 zahteva odobrenje lekara jer ima rizik udaraca)
    - `exertionTolerated` se ocenjuje na osnovu sutrašnjeg pokušaja Koraka 3
    - BC vraća: **NE** — eksplikacija pokazuje da `exertionTolerated` nije zadovoljen (postoji aktivan `ExertionIntoleranceFlag`) i da `medicalClearancePresent` nije zadovoljen (nema `MedicalClearanceEvent`-a u istoriji)
11. **Provera znakova za hitnu reakciju**: pravilo `RedFlagEmergency` se ne okida (nema povraćanja, gubitka svesti, neuroloških znakova) → nema alarma za hitnu pomoć
12. **Ažuriranje procene povratka igri**: Upit `estimateEarliestReturn` preračunava — sa zaustavljanjem na Koraku 3, najraniji potpuni povratak igri je pomeren za >1 dan, ali je još uvek u okviru tipičnih ~19.8 dana (medijana iz CISG sistematskog pregleda)

### 4.5 Primeri složenih pravila

#### Pravilo 1 — CEP sa accumulate (obrazac netolerancije napora)

```drl
rule "Exertion intolerance pattern over 48h"
when
    $athlete : Athlete( $aid : id )
    $count : Number( intValue >= 2 ) from accumulate(
        $e : SymptomDuringExertionEvent( athleteId == $aid )
            over window:time(48h),
        count($e)
    )
    not ExertionIntoleranceFlag( athleteId == $aid )
then
    insert(new ExertionIntoleranceFlag($aid, "2+ provoked symptoms in 48h"));
end
```

#### Pravilo 2 — CEP sa vremenskim operatorom (povratak simptoma posle prelaska koraka)

```drl
rule "Symptom recurrence within 24h after step advancement"
salience 50
when
    $advance : StepAdvancementEvent( $aid : athleteId )
    $symptom : SymptomReportedEvent(
        athleteId == $aid,
        totalScore > baseline,
        this after[0s, 24h] $advance
    )
    $athlete : Athlete( id == $aid )
then
    insert(new RegressTrigger($aid, "Symptom recurrence post-advance"));
end
```

#### Pravilo 3 — Šablon (kratak primer, detaljnije u sekciji 5)

Pravila kojih ima više instanci sa istom strukturom a različitim parametrima izvedena su kao šabloni. Detaljan opis i CSV tabele su u sekciji **6. Šabloni**. Kratak primer:

```drl
rule "Min days @{ageGroup} @{contactLevel}"
when
    $athlete : Athlete( ageGroup == "@{ageGroup}",
                        sportContactLevel == "@{contactLevel}" )
then
    insert(new MinStepDwellRule($athlete.getId(), @{minDays}));
end
```

#### Pravilo 4 — FC sa više nivoa (odluka o nazadovanju, prema Amsterdam 2022 logici)

Amsterdam 2022 pravi razliku između setbacks na **Koracima 1–3** (sportista zaustavlja vežbu i pokušava **isti** korak sledećeg dana) i **Koracima 4–6** (sportista se **vraća na Korak 3**). Sistem to izražava kroz dva odvojena pravila:

```drl
rule "Hold and retry next day on setback during Steps 1-3"
agenda-group "phase-decision"
when
    $athlete : Athlete( $aid : id, $step : currentStep,
                       eval($step >= 1 && $step <= 3) )
    ( RegressTrigger( athleteId == $aid )
      or
      ExertionIntoleranceFlag( athleteId == $aid ) )
then
    // Korak ostaje isti, ali se sledeći pokušaj odlaže za 24h
    insert(new ProtocolLockEvent($aid, 24, "STOP_AND_RETRY_SAME_STEP"));
    insert(new AuditEntry($aid, "Hold at Step " + $step + ", retry next day"));
end

rule "Regress to Step 3 on setback during Steps 4-6"
agenda-group "phase-decision"
when
    $athlete : Athlete( $aid : id, $step : currentStep,
                       eval($step >= 4 && $step <= 6) )
    ( RegressTrigger( athleteId == $aid )
      or
      ExertionIntoleranceFlag( athleteId == $aid ) )
then
    modify($athlete) {
        setCurrentStep(3),
        setStepEnteredAt(new Date())
    }
    insert(new ProtocolLockEvent($aid, 24, "REGRESS_TO_STEP_3"));
    insert(new AuditEntry($aid, "Regressed from Step " + $step + " to Step 3"));
end
```

#### Pravilo 5 — Unazadnog ulančavanje (BC) — upit o spremnosti

```drl
query "readyForAdvance" (String aid)
    Athlete( id == aid, $step : currentStep, $entered : stepEnteredAt )
    $minDays : MinStepDwellRule( athleteId == aid )
    eval( hoursSince($entered) >= $minDays.getMinDays() )
    symptomFreeForHours( aid, $minDays.getMinDays(); )
    not ExertionIntoleranceFlag( athleteId == aid )
    not RedFlagAlert( athleteId == aid )
end

query "symptomFreeForHours" (String aid, int hours)
    not SymptomReportedEvent(
        athleteId == aid,
        totalScore > baseline,
        this after[0s, hours.h] now()
    )
end
```

#### Pravilo 6 — Znak za hitnu reakciju sa dinamičkim prioritetom (salience)

```drl
rule "Red flag emergency alert"
salience ( $criticalCount * 1000 )
when
    $event : SymptomReportedEvent(
        $aid : athleteId,
        $criticalCount : criticalSymptomCount > 0
    )
then
    insert(new EmergencyAlert($aid, $event.getOccurredAt(), "Red flag detected"));
    insert(new ProtocolFreezeEvent($aid));
end
```

---

## 5. Arhitektura

### 5.1 Tehnologije

- **Serverska aplikacija**: Spring Boot (Java 17+)
- **Pravila**: Drools 8.x, organizovan kao odvojen Maven `kjar` modul
- **Korisnički interfejs**: Angular (ili React, biranje konačnog pre prve odbrane)
- **Baza**: PostgreSQL (entiteti) + radna memorija KIE sesija (događaji u memoriji)
- **Sastavljanje projekta**: Maven sa više modula

### 5.2 Modulna arhitektura

```
sbnz-concussion/
├── kjar/                 # POJO klase (Plain Old Java Object — obične Java klase
│   │                     #   za činjenice i događaje) + DRL pravila + šabloni
│   ├── src/main/java/    # SymptomReportedEvent, Athlete, RegressTrigger ...
│   └── src/main/resources/
│       ├── rules/cep/    # CEP pravila (STREAM kbase — obrada događaja u vremenu)
│       ├── rules/fc/     # FC pravila (CLOUD kbase — bez vremenske dimenzije)
│       ├── rules/bc/     # BC pravila (upiti za unazadno ulančavanje)
│       └── templates/    # .drt + .csv šabloni
├── app/                  # Spring Boot aplikacija
│   ├── controller/       # REST krajnje tačke
│   ├── service/          # Povezivanje sa Drools-om, upravljanje KIE sesijama
│   └── repository/       # JPA spremišta (Java Persistence API)
└── frontend/             # Angular jednostranična aplikacija (SPA — Single Page Application)
```

### 5.3 KIE sesije (KIE — Knowledge Is Everything, Drools eko-sistem)

- **CEP sesija sa stanjem** sa STREAM modom obrade događaja i realnim časovnikom — drži tok događaja sportista
- **Standardna sesija sa stanjem po sportisti** — drži profil, trenutni korak i ostale činjenice; koristi se za FC pravila i odluke o napredovanju
- **Sesija bez stanja** — koristi se za BC upite i izveštajne upite

---

## 6. Šabloni (templates)

U sistemu se šabloni koriste za tri familije pravila gde Amsterdam 2022 dogovor (i njegove sistemske ekstenzije) prirodno traže parametrizaciju.

### 6.1 Šablon `MinStepDwell` — minimum boravka u koraku

**Svrha**: Amsterdam 2022 propisuje minimum 24h između koraka kao standard, ali takođe poziva na "individualizovanu procenu" za sportiste sa ponovljenim potresima i pominje produžen oporavak kod određenih CISG faktora rizika. Ovaj šablon dozvoljava ustanovi da konfiguriše duži minimum za određene podgrupe **bez izmene koda pravila**.

**`MinStepDwell.drt`**:
```drl
template header
ageGroup
contactLevel
historyFlag
minHours

template "MinStepDwell"
rule "Min step dwell @{ageGroup} @{contactLevel} @{historyFlag}"
when
    $athlete : Athlete( ageGroup == "@{ageGroup}",
                        sportContactLevel == "@{contactLevel}",
                        historyFlag == "@{historyFlag}" )
    not MinStepDwellRule( athleteId == $athlete.id )
then
    insert(new MinStepDwellRule($athlete.getId(), @{minHours}));
end
end template
```

**`MinStepDwell.csv`** (osnovna konfiguracija po Amsterdam 2022):
```
ageGroup,    contactLevel, historyFlag, minHours
ADULT,       CONTACT,      NONE,        24
ADULT,       CONTACT,      MULTIPLE,    24
ADULT,       NONCONTACT,   NONE,        24
ADULT,       NONCONTACT,   MULTIPLE,    24
PEDIATRIC,   CONTACT,      NONE,        24
PEDIATRIC,   CONTACT,      MULTIPLE,    24
PEDIATRIC,   NONCONTACT,   NONE,        24
```

Tabela ima 7 redova → generiše se 7 konkretnih pravila iz jednog šablona. Ako lekar odluči da uvede 48h minimum za pedijatriju sa ponovljenim potresom (što neke ustanove primenjuju kao opreznu praksu iznad konsenzusa), to je promena jednog broja u CSV-u — ne treba diranje koda.

### 6.2 Šablon `AllowedActivity` — dozvoljene aktivnosti po koraku

**Svrha**: Amsterdam 2022 Tabela 2 pozitivno opisuje šta je dozvoljeno na svakom koraku (npr. Korak 3: *"Sport-specific training away from the team environment (eg, running, change of direction and/or individual training drills away from the team environment). No activities at risk of head impact."*). Sistem koristi **allow-list** pristup: za svaki korak postoji izričita lista dozvoljenih aktivnosti, a sve ostalo je po default-u zabranjeno.

**`AllowedActivity.drt`**:
```drl
template header
step
activityType
sourceCitation

template "AllowedActivity"
rule "Allow @{activityType} on Step @{step}"
when
    eval(true) // šablon samo seedi činjenicu AllowedActivity, bez okidanja na event
then
    insert(new AllowedActivity(@{step}, "@{activityType}", "@{sourceCitation}"));
end
end template
```

**`AllowedActivity.csv`** (mapira Amsterdam 2022 Tabelu 2):
```
step, activityType,                       sourceCitation
1,    SYMPTOM_LIMITED_DAILY_LIVING,       Amsterdam 2022 Table 2 Step 1
2,    WALKING,                            Amsterdam 2022 Table 2 Step 2A
2,    STATIONARY_BIKE,                    Amsterdam 2022 Table 2 Step 2A
2,    LIGHT_RESISTANCE_TRAINING,          Amsterdam 2022 Table 2 Step 2B
3,    SPORT_SPECIFIC_DRILLS_NO_IMPACT,    Amsterdam 2022 Table 2 Step 3
3,    RUNNING,                            Amsterdam 2022 Table 2 Step 3
3,    CHANGE_OF_DIRECTION_DRILLS,         Amsterdam 2022 Table 2 Step 3
3,    INDIVIDUAL_TRAINING_DRILLS,         Amsterdam 2022 Table 2 Step 3
4,    TEAM_TRAINING_DRILLS,               Amsterdam 2022 Table 2 Step 4
4,    HIGH_INTENSITY_NONCONTACT,          Amsterdam 2022 Table 2 Step 4
5,    FULL_CONTACT_PRACTICE,              Amsterdam 2022 Table 2 Step 5
6,    NORMAL_GAME_PLAY,                   Amsterdam 2022 Table 2 Step 6
```

12 redova → generiše se 12 činjenica `AllowedActivity` u radnoj memoriji, svaka sa direktnom referencom na paragraf konsenzusa (koristi se i kao objašnjenje koje sistem prikazuje sportisti).

**Prateće podrazumevano pravilo blokade** (nije šablon, jedno pravilo) hvata pokušaje aktivnosti van allow-liste:

```drl
rule "Block any activity not on allow-list for current step"
agenda-group "activity-validation"
when
    $attempt : ExertionAttemptEvent(
        $aid : athleteId,
        $activity : activityType
    )
    Athlete(id == $aid, $step : currentStep)
    not AllowedActivity(step == $step, activityType == $activity)
then
    insert(new ActivityBlockedAlert($aid, $activity,
        "Activity '" + $activity + "' is not allowed on Step " + $step
        + " per Amsterdam 2022 Table 2"));
end
```

Ovo jedno pravilo + 12 činjenica iz šablona zamenjuje ono što bi inače zahtevalo eksplicitno enumerisanje svake (korak, zabranjena aktivnost) kombinacije (>20 redova), uz dodatnu sigurnosnu garanciju — ako sportista upiše aktivnost koja nije anticipirana u tabeli, sistem je odbija po default-u umesto da je propusti.

### 6.3 Šablon `RedFlagSeverity` — nivoi ozbiljnosti znakova za hitnu reakciju

**Svrha**: Lista crvenih zastava iz Amsterdam 2022 / CRT6 ima različite nivoe ozbiljnosti — neki znakovi (npr. gubitak svesti, konvulzije) zahtevaju trenutni transport u bolnicu, drugi (npr. blago povraćanje, otežana koncentracija) zahtevaju procenu lekara unutar nekoliko sati. Šablon mapira svaki znak na nivo akcije i salience prioritet pravila.

**`RedFlagSeverity.drt`**:
```drl
template header
flagType
severity
salienceLevel
actionType

template "RedFlagSeverity"
rule "Red flag @{flagType}"
salience @{salienceLevel}
when
    $event : SymptomReportedEvent(
        $aid : athleteId,
        @{flagType} == true
    )
then
    insert(new EmergencyAlert($aid, "@{flagType}",
        "@{severity}", "@{actionType}"));
end
end template
```

**`RedFlagSeverity.csv`** (nivoi po CRT6 / Amsterdam 2022 Box 1):
```
flagType,                  severity,  salienceLevel, actionType
lossOfConsciousness,       CRITICAL,  10000,         IMMEDIATE_TRANSPORT
seizure,                   CRITICAL,  10000,         IMMEDIATE_TRANSPORT
deterioratingConsciousness,CRITICAL,  10000,         IMMEDIATE_TRANSPORT
weaknessInLimbs,           CRITICAL,   9000,         IMMEDIATE_TRANSPORT
visibleSkullDeformity,     CRITICAL,  10000,         IMMEDIATE_TRANSPORT
severeHeadache,            HIGH,       8000,         URGENT_MEDICAL_EVAL
repeatedVomiting,          HIGH,       8000,         URGENT_MEDICAL_EVAL
doubleVision,              HIGH,       7000,         URGENT_MEDICAL_EVAL
neckPain,                  MEDIUM,     6000,         MEDICAL_EVAL_24H
agitation,                 MEDIUM,     6000,         MEDICAL_EVAL_24H
```

10 redova → generiše se 10 pravila sa različitim prioritetima izvršavanja. Novi znakovi mogu biti dodati u CSV bez izmene koda; takođe, ako buduća verzija konsenzusa promeni klasifikaciju ozbiljnosti, to je ponovo izmena tabele a ne pravila.
