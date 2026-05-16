# SBNZ — Predlog projekta

## Sistem za vođenje sportiste kroz protokol povratka igri posle potresa mozga

---

## Sadržaj

- [1. Članovi tima](#1-članovi-tima)
- [2. Motivacija](#2-motivacija)
- [3. Pregled problema i pregled literature](#3-pregled-problema-i-pregled-literature)
  - [3.1 Domen problema](#31-domen-problema)
  - [3.2 Postojeća rešenja](#32-postojeća-rešenja)
  - [3.3 Prednost predloženog rešenja](#33-prednost-predloženog-rešenja)
  - [3.4 Reference](#34-reference)
- [4. Metodologija rada](#4-metodologija-rada)
  - [4.1 Ulazi u sistem](#41-ulazi-u-sistem)
  - [4.2 Izlazi sistema](#42-izlazi-sistema)
  - [4.3 Baza znanja](#43-baza-znanja)
  - [4.4 Konkretan primer zaključivanja, korak po korak](#44-konkretan-primer-zaključivanja-korak-po-korak)
  - [4.5 Primeri složenih pravila](#45-primeri-složenih-pravila)
    - [Pravilo 1 — Obrazac netolerancije napora (CEP sa accumulate funkcijom)](#pravilo-1--obrazac-netolerancije-napora-cep-sa-accumulate-funkcijom)
    - [Pravilo 2 — Povratak simptoma posle prelaska koraka (CEP, povezivanje dva događaja)](#pravilo-2--povratak-simptoma-posle-prelaska-koraka-cep-povezivanje-dva-događaja)
    - [Pravilo 3 — Familije pravila izvedene iz tabela (šabloni)](#pravilo-3--familije-pravila-izvedene-iz-tabela-šabloni)
    - [Pravilo 4 — Odluka o vraćanju koraka (FC sa više nivoa, Amsterdam 2022 logika)](#pravilo-4--odluka-o-vraćanju-koraka-fc-sa-više-nivoa-amsterdam-2022-logika)
    - [Pravilo 5 — Provera dozvoljenosti aktivnosti (BC — rekurzivni upit nad stablom kategorija aktivnosti)](#pravilo-5--provera-dozvoljenosti-aktivnosti-bc--rekurzivni-upit-nad-stablom-kategorija-aktivnosti)
    - [Pravilo 5b — Spremnost za sledeći korak](#pravilo-5b--spremnost-za-sledeći-korak-običan-bc-upit)
    - [Pravilo 6 — Znakovi za hitnu reakciju sa salience prioritetom](#pravilo-6--znakovi-za-hitnu-reakciju-sa-salience-prioritetom)
- [5. Arhitektura](#5-arhitektura)
  - [5.1 Tehnologije](#51-tehnologije)
  - [5.2 Modulna arhitektura](#52-modulna-arhitektura)
  - [5.3 KIE sesija](#53-kie-sesija-kie--knowledge-is-everything-drools-eko-sistem)
- [6. Šabloni (templates)](#6-šabloni-templates)
  - [6.1 Šablon `MinStepDwell` — minimum boravka u koraku](#61-šablon-minstepdwell--minimum-boravka-u-koraku)
  - [6.2 Šablon `AllowedActivity` — dozvoljene top-level kategorije aktivnosti po koraku](#62-šablon-allowedactivity--dozvoljene-top-level-kategorije-aktivnosti-po-koraku)
  - [6.3 Šablon `RedFlagSeverity` — nivoi ozbiljnosti znakova za hitnu reakciju](#63-šablon-redflagseverity--nivoi-ozbiljnosti-znakova-za-hitnu-reakciju)

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

**Početno stanje povrede (postavlja se pri registraciji sportiste)**:
- `injuryAt` — datum i vreme povrede (`LocalDateTime`); osnov za sve "vreme od povrede" pragove (10 dana, 4 nedelje)
- `currentStep` — početni korak protokola (1 za novu povredu, ili viši ako se sportista već nalazi u toku oporavka)
- `stepEnteredAt` — vreme ulaska u trenutni korak; osnov za dwell proveru u `readyToAdvance` upitu
- Znakovi koji nalažu hitnu reakciju se mapiraju na `SymptomReportedEvent` sa flag-tipovima iz `RedFlagType` enuma (LOSS_OF_CONSCIOUSNESS, SEIZURE, …); odgovarajuća template-generisana pravila iz `RedFlagSeverity` šablona okidaju `EmergencyAlert` činjenice
- Detaljni klinički podaci sa terena (npr. trajanje gubitka svesti u sekundama, posttraumatska amnezija u minutima) **nisu** modelirani u trenutnoj verziji — ako su prisutni, ulaze kao `ObjectiveTestEvent(testType, value)` događaji koje lekar ručno unosi

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

**Za sportistu** (athlete dashboard):
- Trenutni korak protokola sa imenom (npr. "Step 3 — Sport-specific exercise")
- Lista konkretnih dozvoljenih aktivnosti za trenutni korak, generisana rekurzivnim BC upitom nad stablom `ParentCategory` činjenica
- `ActivityBlockedAlert` ako sportista pokuša da zabeleži aktivnost van dozvoljene kategorije za njegov korak — reaktivno upozorenje
- Grafikon kretanja simptoma kroz vreme po pojedinačnim SCAT6 simptomima
- Procenjeni najraniji datum povratka na sport (`estimateEarliestReturn` Java metoda koja računa preostalo vreme po koracima i njihovim minimum dwell-ovima)
- Status spremnosti za sledeći korak sa eksplicitnom listom nezadovoljenih uslova ako nije spreman

**Za lekara / atletskog trenera** (reports + per-athlete dashboard):
- Trenutni `EmergencyAlert` činjenice za sportistu (crveni baner u UI-ju)
- `StepRecommendation` činjenice (HOLD/REGRESS) sa eksplanacijom koja prati `ProgressionStatusFact` razlog
- Tabela "risk summary" — po sportisti broj aktivnih: alert-a, ExertionIntoleranceFlag-ova, perzistentnih simptoma, cervikovestibularnih indikacija, individualizovane procene
- Raspodela sportista po koracima i po sportu na reports stranici
- Izveštaj o pridržavanju protokola po sportisti (`/api/reports/adherence/{id}` — broj dana sa unetim simptomima vs dani od povrede)

**Sistemski izlazi**:
- Zapisnik (audit log) svih odluka sa listom pravila koja su se okidala i činjenica koje su ubačene, dostupan kroz `/api/audit/{athleteId}` (`AuditService` kači `AgendaEventListener` na svaku sesiju)
- Brojčani izveštaji (broj sportista po koracima, raspodela po sportovima) preko `/api/reports/*`

### 4.3 Baza znanja

**Šta sistem treba da zna**:

1. **Strukturu Amsterdam 2022 protokola stepenovanog povratka igri (GRTP)**: 6 koraka, dozvoljene aktivnosti po koraku, minimum 24h između koraka, uslovi koji zahtevaju odobrenje lekara pre koraka sa rizikom udaraca u glavu (Koraci 4–6, plus Korak 3 ako vežbe specifične za sport nose taj rizik).
2. **Listu znakova koji nalažu trenutno udaljavanje sa terena i hitnu medicinsku procenu** (po Amsterdam 2022 i CRT6 — Concussion Recognition Tool 6): gubitak svesti ili sumnja na isti, konvulzije, ukočenost (tonic posturing), poremećaj koordinacije (ataksija), problem sa balansom, konfuzija, promene ponašanja, amnezija; plus tradicionalni razlozi za hitnu pomoć (pogoršanje glavobolje, ponovljeno povraćanje, slabost ili utrnulost ruku/nogu, otežan govor, povećana konfuzija ili uznemirenost).
3. **CISG faktore koji mogu produžiti oporavak** (izričito navedeni u Amsterdam 2022 kao faktori rizika): istorija prethodnih potresa, migrena ili druge glavobolje, anksioznost, depresija, poteškoće u učenju ili ADHD, problemi sa snom u prvih 10 dana posle povrede. Dogovor za sportiste sa ponovljenim potresima preporučuje **individualizovanu procenu** lekara, bez fiksnog brojčanog praga; sistem ovo prevodi u dva pravila u [IndividualizedAssessment.drl](kjar/src/main/resources/rules/fc/IndividualizedAssessment.drl):
   - `"Repeated concussion requires individualized assessment before contact phases"` — okida se kad `historyFlag == MULTIPLE` i sportista je na koraku ≥3, ubacuje `IndividualizedAssessmentRequired` činjenicu sa porukom
   - `"CISG risk factor cluster lengthens recovery"` — okida se kad bilo koji CISG faktor (migrena, ADHD, anksioznost, poteškoće u učenju) postoji u profilu, ubacuje istu vrstu činjenice sa razlogom koji počinje "CISG"
   
   Ova zastava je **informaciona** — prikazuje se lekaru na dashbord-u kao podsetnik za dodatni pregled, ali ne blokira automatski napredovanje. Dodatno, [`Athlete.recurrenceWindowHours()`](model/src/main/java/com/ftn/sbnz/model/domain/Athlete.java) i `dwellBonusHours()` metode skaliraju vremenske prozore i minimum boravka po koraku na osnovu broja CISG faktora (0/1/≥2 faktora → standardni/produženi/dvostruko produženi prozor).
4. **Definicije iz Amsterdam 2022** za stanja simptoma:
   - *Blago i kratkotrajno pogoršanje* (mild and brief exacerbation): porast simptoma ≤2 poena na skali 0–10 i trajanje <1h tokom napora — **tolerisan**, nije razlog za zaustavljanje
   - *Povlačenje simptoma u mirovanju* (symptom resolution at rest): simptomi povezani sa povredom su nestali kad sportista miruje
   - *Potpuno povlačenje simptoma* (complete symptom resolution): nema simptoma ni u mirovanju ni posle najjačeg fizičkog ili misaonog napora
5. **Pragove za pojačanu brigu (iz Amsterdam 2022 i pratećih sistematskih pregleda)**:
   - **>10 dana** vrtoglavica / bol u vratu / glavobolja → indikacija za **cervikovestibularnu rehabilitaciju**
   - **2–4 nedelje** ako simptomi traju, pogoršavaju se ili ne idu na bolje → **višestruka procena (SCOAT6) i upućivanje na rehabilitaciju**
   - **>4 nedelje** = zvanična definicija **"perzistentnih simptoma"** (persisting symptoms; ista za decu, adolescente i odrasle, glasanje stručne grupe 92.9% slaganja)
6. **Razvrstavanje sportova po nivou kontakta**: kontaktni i sportovi sa rizikom sudara (svih 6 koraka), nekontaktni (Koraci 4–5 mogu biti smanjeni jer nema rizika udarca u glavu).

**Kako se baza znanja popunjava**:

- **Stalni deo** (protokol, pragovi, faktori rizika) je na početku učitan iz početnih (seed) podataka i može se održavati kroz lekarski (administratorski) interfejs.
- **Promenljivi deo** (profili sportista, događaji) popunjava se kroz REST programski interfejs (REST API): sportista i klinika unose podatke kroz korisnički interfejs (frontend).
- **Šabloni** (templates) za parametrizovana pravila održavaju se kroz administratorski panel u tabelarnom obliku koji generiše DRL (Drools Rule Language) pravila. Tri šablona su u sistemu:
  - `MinStepDwell` — minimum sati po kombinaciji `(contactLevel, historyFlag)`
  - `AllowedActivity` — dozvoljene top-level kategorije po koraku (allow-list pristup)
  - `RedFlagSeverity` — nivo ozbiljnosti i salience za svaki tip znaka za hitnu reakciju
  
  Administrator menja CSV redove kroz `POST /api/admin/templates/{name}` što okida `KnowledgeService.updateTemplateCsv` — sve KIE sesije se disponuju, KieContainer se ponovo gradi, sesije po sportisti se ponovo prave iz keširanih profila.

**Kako se baza znanja koristi**:

- Pri svakom dnevnom unosu (event insert + `fireAllRules()` u `ProtocolService`) okida se trostepeni lanac pravila unaprednog ulančavanja (FC — Forward Chaining): Nivo 1 izvodi setback signale (`MoreThanMildExacerbation`, `ExertionIntoleranceFlag`, `RegressTrigger`), Nivo 2 klasifikator izvodi `ProgressionStatusFact`, Nivo 3 akcija izvodi `StepRecommendation` + `ProtocolLockEvent` + opcionalni `modify` athlete fact-a.
- U istoj sesiji se izvršavaju i CEP pravila (Complex Event Processing) koja koriste `@Role(EVENT)` činjenice, `over window:time(...)` klizne prozore i `accumulate` agregacije:
  - **`ExertionPattern.drl`**: pravilo `"Exertion intolerance pattern"` (accumulate u 48h prozoru sa pragom ≥2) plus parno pravilo za retrakciju zastavice kad prozor padne ispod praga; pravilo `"More than mild exacerbation during exertion"` (filter na pojedinačni event); pravilo `"Symptom recurrence after step advancement"` (povezivanje dva događaja kroz eval aritmetiku timestamp-ova).
  - **`PersistingSymptoms.drl`**: pravila za 10-dnevnu indikaciju za cervikovestibularnu rehabilitaciju i 4-nedeljnu zastavicu perzistentnih simptoma, oba koriste `eval` poređenje između event timestamp-a i `Athlete.injuryAt` polja.
- Pravila za individualizovanu procenu (`IndividualizedAssessment.drl`) okidaju se na osnovu statičnog profila sportiste (`historyFlag == MULTIPLE` ili CISG cluster faktora) — to su čista FC pravila bez vremenske dimenzije.
- Za prikaz **liste konkretnih dozvoljenih vežbi** na sportistinom trenutnom koraku pokreće se **rekurzivni BC upit** `isInCategory` nad stablom `ParentCategory` činjenica — Java kod ([`ProtocolService.allowedActivitiesForCurrentStep`](service/src/main/java/com/ftn/sbnz/service/service/ProtocolService.java)) zove `getQueryResults("athleteAllowedActivities", aid, Variable.v)` i engine kroz unifikaciju nabraja sve listove stabla koji pripadaju dozvoljenoj top-level kategoriji za korak.
- Ista rekurzivna definicija upita se koristi u **check režimu** unutar pravila `"Block activity not in allowed category for current step"` (`ActivityValidation.drl`) — oba argumenta su vezana, upit vraća yes/no.
- Na pitanje *"da li je sportista spreman za sledeći korak?"* pokreće se BC upit `readyToAdvance` u `ReadinessQuery.drl` — ravna konjunkcija uslova (currentStep == targetStep-1, dwell ≥ MinStepDwellRule + dwellBonusHours, odsustvo `ExertionIntoleranceFlag`/`EmergencyAlert`/pre-pragovskih bumpova, prisustvo `MedicalClearanceEvent` za korake ≥4). Upit vraća 1 red ako su svi uslovi zadovoljeni, 0 inače; Java omotač u `ProtocolService.readyToAdvance` zatim eksplicitno iterira preko istih uslova da napravi listu nezadovoljenih za eksplanaciju.
- Upiti se takođe koriste za izveštajne ekrane preko endpoint-a `/api/reports/...` koji čitaju činjenice iz sesije po sportisti.

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

1. **Nivo 1 (FC)**: Pravilo `"More than mild exacerbation during exertion"` u [ExertionPattern.drl](kjar/src/main/resources/rules/cep/ExertionPattern.drl) gleda dolazni `SymptomDuringExertionEvent`. Markov porast glavobolje od +3 prelazi prag `delta > 2 || durationMinutes > 60`, pa se izvodi činjenica `MoreThanMildExacerbation(athleteId="marko", symptom="HEADACHE", delta=3, durationMinutes=40)`.
2. **CEP + accumulate (paralelno na Nivou 1)**: Pravilo `"Exertion intolerance pattern"` gleda accumulate nad `SymptomDuringExertionEvent` u kliznom prozoru `over window:time(48h)` sa porastom iznad praga. Detektovana 2 takva događaja unutar prozora → ubacuje `ExertionIntoleranceFlag(athleteId="marko")`.
3. **CEP (povezivanje dva događaja)**: Pravilo `"Symptom recurrence after step advancement"` se **ne okida** — poslednji `StepAdvancementEvent` je bio izvan prozora `recurrenceWindowHours()` koji za Marka iznosi 24h (nema CISG faktora).
4. **Nivo 2 (FC)**: Pravilo `"Determine status STOP_AND_RETRY at steps 1-3"` iz agenda grupe `phase-decision` ([ProgressionDecision.drl](kjar/src/main/resources/rules/fc/ProgressionDecision.drl)) gleda `Athlete(currentStep ∈ [1,3])` + disjunkciju `(ExertionIntoleranceFlag or RegressTrigger or MoreThanMildExacerbation)`. Prvi i treći signal su prisutni → ubacuje `ProgressionStatusFact(athleteId="marko", status=STOP_TODAY_RETRY_TOMORROW)`. Marko je na Koraku 3, pa Amsterdam 2022 logika za Korake 1–3 nalaže da ne vraća unazad — zaustavlja vežbu i pokušava **isti** Korak 3 sledećeg dana.
5. **Nivo 3 (FC)**: Pravilo `"Recommend HOLD on current step (steps 1-3)"` u istoj agenda grupi, sa `salience -10` da se okine **posle** klasifikatora u istom ciklusu, prevodi status u akciju → ubacuje `StepRecommendation(athleteId="marko", action=STOP_AND_RETRY, currentStep=3, recommendedStep=3, retryAfterHours=24)` i `ProtocolLockEvent(athleteId="marko", lockUntilHours=24, reason="STOP_AND_RETRY_SAME_STEP")`. Athlete fakat se **ne menja** za setback na Koracima 1–3 (`currentStep` ostaje 3).
6. **Instanca šablona** (paralelno, već prisutno iz inicijalizacije sesije): tabelarno pravilo iz `MinStepDwell` šablona za kombinaciju `(CONTACT, NONE)` je već ubacilo `MinStepDwellRule(marko, 24)` u radnu memoriju. Ova činjenica nije deo lanca uzročnosti za HOLD preporuku ali jeste preduslov za sledeću proveru spremnosti.
7. **Lekar pita kroz interfejs**: "Da li Marko može sutra na Korak 4?" → pokreće se **BC upit** `readyToAdvance(aid="marko", targetStep=4)` ([ReadinessQuery.drl](kjar/src/main/resources/rules/fc/ReadinessQuery.drl)) koji proverava ravnu konjunkciju uslova:
   - `Athlete(id == aid, currentStep == targetStep - 1)` ✓ (Marko je na 3, cilj je 4)
   - 24h dwell prošlo ✓ (Marko je na Koraku 3 od dana 4)
   - Odsustvo `ExertionIntoleranceFlag` ✗ (CEP pravilo iz koraka 2 ovog primera ga je upravo ubacilo)
   - Odsustvo `EmergencyAlert` ✓
   - Odsustvo `SymptomDuringExertionEvent` iznad praga ✗ (oba bumpa iz današnje sesije su još uvek u radnoj memoriji)
   - Za `targetStep ≥ 4`: postoji `MedicalClearanceEvent(clearanceForStep >= targetStep)` ✗ (nema clearance-a)
   - **Rezultat**: upit ne vraća red. Java omotač u `ProtocolService.readyToAdvance` zatim iterira preko istih uslova da napravi listu nezadovoljenih (`missing`) i vraća strukturu `{ready: false, unmetConditions: [...]}`.
8. **UI prikazuje Marku listu konkretnih vežbi dozvoljenih za sutrašnji pokušaj Koraka 3** → endpoint `GET /api/athletes/{id}/allowed-activities` poziva BC upit `athleteAllowedActivities(aid, ?activity)` sa neograničenom promenljivom (`Variable.v`). Upit zglobi `Athlete + AllowedActivity(step=3) + isInCategory(?activity, allowedCategory)`. Sistem ne materijalizuje konkretne vežbe unapred — drži:
   - Hijerarhiju kategorija aktivnosti (`ParentCategory` činjenice), seed-ovanu u [`KnowledgeService.seedActivityTree`](service/src/main/java/com/ftn/sbnz/service/service/KnowledgeService.java): npr. `INDIVIDUAL_PASSING_DRILL` ⊂ `BALL_DRILLS` ⊂ `SPORT_SPECIFIC_NO_CONTACT` ⊂ `EXERCISE`
   - Listu top-level dozvoljenih kategorija po koraku (`AllowedActivity`), seed-ovanu kroz šablon: Korak 3 dozvoljava `SPORT_SPECIFIC_NO_CONTACT`
   - Rekurzivni upit `isInCategory(activity, category)` koji se okida sa unbound `activity` i enumeriše sve listove stabla pod tom kategorijom

   Trag rekurzije za enumeraciju pod `SPORT_SPECIFIC_NO_CONTACT`:
   - Direktna deca: `RUNNING_DRILLS`, `BALL_DRILLS` (matchuju bazni slučaj)
   - Spuštanje u `RUNNING_DRILLS` → listovi `LINEAR_RUNNING`, `CHANGE_OF_DIRECTION`
   - Spuštanje u `BALL_DRILLS` → listovi `INDIVIDUAL_PASSING_DRILL`, `INDIVIDUAL_SHOOTING_DRILL`
   - Engine kroz unifikaciju vraća sve (uključujući intermediate čvorove jer pravilo `isInCategory` ima i bazni `or` slučaj). UI prikazuje listu Marku.
   - `FULL_CONTACT_TACKLE` se ne pojavljuje jer pripada `CONTACT` grani, koja nije u listi `AllowedActivity` za Korak 3

   Ista rekurzivna definicija upita se koristi i u režimu **provere** (oba argumenta vezana): pravilo `"Block activity not in allowed category for current step"` u [ActivityValidation.drl](kjar/src/main/resources/rules/fc/ActivityValidation.drl) zove `isInCategory($act, $cat;)` unutar `not` guard-a — ako rekurzija nigde ne potvrdi pripadnost, ubacuje `ActivityBlockedAlert`.
9. **Provera znakova za hitnu reakciju**: ni jedno od 10 generisanih pravila iz šablona `RedFlagSeverity` (npr. `"RedFlag 1 LOSS_OF_CONSCIOUSNESS"`) se ne okida — Marko nije prijavio nijedan od crvenih simptoma sa nivoom > 0.
10. **Procena povratka igri**: Java metoda `ProtocolService.estimateEarliestReturn` (nije Drools upit) iterira preko preostalih koraka i njihovih `MinStepDwellRule` minimuma plus `dwellBonusHours()` iz CISG profila, i vraća procenu najranijeg datuma povratka. Sa zaustavljanjem na Koraku 3, procena se pomera za >1 dan u odnosu na najbolji scenario.

### 4.5 Primeri složenih pravila

Pravila su opisana u prozi (kao "ako-onda" izrazi nad činjenicama i događajima u radnoj memoriji). Konkretni DRL kod biće implementiran u izvršnoj fazi projekta.

#### Pravilo 1 — Obrazac netolerancije napora (CEP sa accumulate funkcijom)

**Ako** se za sportistu u kliznom prozoru od **48 sati** pojave **2 ili više** događaja `SymptomDuringExertionEvent` sa porastom iznad praga (`delta > 2 || durationMinutes > 60`, definicija "mild and brief exacerbation" iz Amsterdam 2022), **i** sportista još nema aktivnu oznaku `ExertionIntoleranceFlag`, **onda** sistem ubacuje činjenicu `ExertionIntoleranceFlag(sportista, razlog)` koja kasnije utiče na odluku o napredovanju.

Ovo je primer **CEP** pravila koje koristi:
- vremenski klizni prozor (`over window:time(48h)`)
- agregatnu funkciju **accumulate** sa `count` nad podskupom događaja u prozoru
- `not` uslov da spreči ponovno okidanje pravila kad je oznaka već prisutna

**Parno pravilo za retrakciju** u istom fajlu ([ExertionPattern.drl](kjar/src/main/resources/rules/cep/ExertionPattern.drl)) — `"Clear exertion intolerance when 48h window no longer holds the pattern"` — koristi isti accumulate sa **inverznim pragom** (`Number(intValue < 2)`) i okida `retract($flag)` kad događaji ispadnu iz prozora. Tako se zastavica ne ponaša kao trajna oznaka već kao **funkcija stanja kliznog prozora**: insertuje se kad count ≥ 2, brisanjem kad count padne na 0 ili 1, sa mogućnošću ponovnog insert-a kad novi događaji opet pređu prag.

#### Pravilo 2 — Povratak simptoma posle prelaska koraka (CEP, povezivanje dva događaja)

**Ako** sportista pređe na sledeći korak (`StepAdvancementEvent`), **i** unutar prozora `recurrenceWindowHours()` (24/36/48h u zavisnosti od broja CISG faktora rizika sportiste) posle tog prelaska prijavi simptom čiji je nivo iznad njegovog početnog nivoa (`SymptomReportedEvent`), **onda** sistem ubacuje činjenicu `RegressTrigger(sportista, razlog)`.

Implementacija u [ExertionPattern.drl](kjar/src/main/resources/rules/cep/ExertionPattern.drl) koristi `eval()` aritmetiku nad timestamp-ovima dva događaja:

```drl
eval($sr.getTimestamp().getTime() >= $adv.getTimestamp().getTime())
eval($sr.getTimestamp().getTime() - $adv.getTimestamp().getTime() <= (long) $window * 60L*60L*1000L)
```

Razlog za `eval` umesto Drools `after[0s, Xh]` operatora je što dužina prozora **varira po sportisti** (poziv metode na fact-u `$a.recurrenceWindowHours()`), pa parametri operatora ne mogu biti statički. Salience je default (0); poredak okidanja u ciklusu se ne kontroliše ovim pravilom.

#### Pravilo 3 — Familije pravila izvedene iz tabela (šabloni)

Pravila kojih ima više instanci sa istom strukturom a različitim parametrima izvedena su kao **šabloni** (Drools rule templates). Tri familije takvih pravila opisane su u **sekciji 6**: minimum boravka u koraku po profilu sportiste (`MinStepDwell`, parametri `contactLevel × historyFlag`), dozvoljene top-level kategorije aktivnosti po koraku (`AllowedActivity`, parametar `step`), i nivoi ozbiljnosti znakova za hitnu reakciju (`RedFlagSeverity`, parametri `flagType × severity × salience × actionType`).

#### Pravilo 4 — Odluka o vraćanju koraka (FC sa više nivoa, Amsterdam 2022 logika)

Amsterdam 2022 razlikuje setback na **Koracima 1–3** od onog na **Koracima 4–6**. Sistem to izražava kroz dva odvojena pravila iz iste agenda grupe `phase-decision`:

- **Setback na Koracima 1–3**: ako je sportistin trenutni korak između 1 i 3, **i** postoji `ExertionIntoleranceFlag`, `RegressTrigger` ili `MoreThanMildExacerbation` za njega, klasifikator (`"Determine status STOP_AND_RETRY at steps 1-3"`) ubacuje `ProgressionStatusFact(STOP_TODAY_RETRY_TOMORROW)`. Akciono pravilo (`"Recommend HOLD on current step (steps 1-3)"`, sa `salience -10` da se okine posle klasifikatora u istom ciklusu) ubacuje `StepRecommendation(action=STOP_AND_RETRY, currentStep=cur, recommendedStep=cur, retryAfterHours=24)` i `ProtocolLockEvent(lockUntilHours=24, reason="STOP_AND_RETRY_SAME_STEP")`. Athlete fakat se **ne menja**.

- **Setback na Koracima 4–6**: analogno preko klasifikatora `"Determine status REGRESS at steps 4-6"` koji ubacuje `ProgressionStatusFact(REGRESS_TO_STEP_3)`, i akcionog pravila `"Recommend REGRESS to step 3 (steps 4-6)"` koje ubacuje `StepRecommendation(action=REGRESS, recommendedStep=3, retryAfterHours=24)`, `ProtocolLockEvent(reason="REGRESS_TO_STEP_3")`, i okida `modify($a) { setCurrentStep(3) }` da se `Athlete.currentStep` ažurira u radnoj memoriji (što reaktivira sva pravila koja zavise od trenutnog koraka).

Ova četiri pravila iz iste agenda grupe `phase-decision` (sa `auto-focus true`) čine **drugi i treći nivo trostepenog FC lanca**: Nivo 1 izvodi setback signale (`MoreThanMildExacerbation`, `ExertionIntoleranceFlag`, `RegressTrigger`) → Nivo 2 klasifikator izvodi `ProgressionStatusFact` → Nivo 3 akcija izvodi `StepRecommendation` + `ProtocolLockEvent` + opcionalni `modify` na athlete fact-u.

#### Pravilo 5 — Provera dozvoljenosti aktivnosti (BC — rekurzivni upit nad stablom kategorija aktivnosti)

Aktivnosti koje sportista može da izvodi formiraju **stablo kategorija**: korenska kategorija je `EXERCISE`, podkategorije su tipovi vežbi (`AEROBIC`, `RESISTANCE`, `SPORT_SPECIFIC_NO_CONTACT`, `CONTACT`...), a listovi su konkretne vežbe (`WALKING`, `STATIONARY_BIKE`, `INDIVIDUAL_PASSING_DRILL`, `FULL_CONTACT_TACKLE`...).

Stablo se opisuje činjenicama `ParentCategory(child, parent)` koje se inicijalno učitavaju u radnu memoriju iz seed konfiguracije:

```
ParentCategory(WALKING,                    LIGHT_AEROBIC)
ParentCategory(STATIONARY_BIKE,            LIGHT_AEROBIC)
ParentCategory(LIGHT_AEROBIC,              AEROBIC)
ParentCategory(JOGGING,                    MODERATE_AEROBIC)
ParentCategory(MODERATE_AEROBIC,           AEROBIC)
ParentCategory(AEROBIC,                    EXERCISE)
ParentCategory(BODYWEIGHT_BASIC,           LIGHT_RESISTANCE)
ParentCategory(LIGHT_RESISTANCE,           RESISTANCE)
ParentCategory(RESISTANCE,                 EXERCISE)
ParentCategory(LINEAR_RUNNING,             RUNNING_DRILLS)
ParentCategory(CHANGE_OF_DIRECTION,        RUNNING_DRILLS)
ParentCategory(INDIVIDUAL_PASSING_DRILL,   BALL_DRILLS)
ParentCategory(RUNNING_DRILLS,             SPORT_SPECIFIC_NO_CONTACT)
ParentCategory(BALL_DRILLS,                SPORT_SPECIFIC_NO_CONTACT)
ParentCategory(SPORT_SPECIFIC_NO_CONTACT,  EXERCISE)
ParentCategory(NON_CONTACT_TEAM_TRAINING,  EXERCISE)
ParentCategory(FULL_CONTACT_TACKLE,        FULL_CONTACT_PRACTICE)
ParentCategory(FULL_CONTACT_PRACTICE,      CONTACT)
ParentCategory(COMPETITIVE_PLAY,           CONTACT)
ParentCategory(CONTACT,                    EXERCISE)
```

Sistem zatim drži ravnu **listu top-level dozvoljenih kategorija po koraku** u činjenicama `AllowedActivity(step, category)` (sekcija 6.2). Korak 3 dozvoljava samo `SPORT_SPECIFIC_NO_CONTACT` kao top-level kategoriju.

Rekurzivni upit `isInCategory(activity, category)`:

```drl
query isInCategory(String activity, String category)
    // Direktan poklop: aktivnost je odmah dete kategorije
    ParentCategory(activity, category;)
    or
    // Rekurzivni slučaj: postoji posrednik koji je dete kategorije,
    //                   a aktivnost je u tom posredniku (rekurzivno)
    (
        ParentCategory($intermediate, category;)
        and isInCategory(activity, $intermediate;)
    )
end
```

Upit se koristi u dva režima:

- **Enumeracija za UI** (primarno): kad korisnički interfejs treba da prikaže sportisti listu konkretnih vežbi za njegov trenutni korak, Java kod ([`ProtocolService.allowedActivitiesForCurrentStep`](service/src/main/java/com/ftn/sbnz/service/service/ProtocolService.java)) zove `s.getQueryResults("athleteAllowedActivities", aid, Variable.v)` — upit `athleteAllowedActivities` u [ReadinessQuery.drl](kjar/src/main/resources/rules/fc/ReadinessQuery.drl) interno poziva `isInCategory(activity, $cat;)` sa unbound prvim argumentom. Engine kroz unifikaciju nabraja sve listove stabla pod dozvoljenim top-level kategorijama za korak i vraća ih kao listu. Konkretne vežbe se ne materijalizuju unapred — rekurzija ih raspakuje iz stabla po potrebi.
- **Retrospektivna validacija** (sekundarno): kad sportista zabeleži `ExertionAttemptEvent(activity=X)`, pravilo `"Block activity not in allowed category for current step"` u [ActivityValidation.drl](kjar/src/main/resources/rules/fc/ActivityValidation.drl) prelazi listu `AllowedActivity` za njegov korak i za svaku stavku poziva `isInCategory($act, $cat;)` sa **oba argumenta vezana** — unutar `not` guard-a. Ako rekurzija nigde ne potvrdi pripadnost, ubacuje se `ActivityBlockedAlert`.

**Šta dobijamo**:
- `AllowedActivity` tabela u sekciji 6.2 ostaje mala — ~6 top-level kategorija (jedna ili dve po koraku); konkretne vežbe rekurzija raspakuje iz stabla po potrebi
- Dodavanje nove specifične vežbe (npr. `KETTLEBELL_SWING ⊂ LIGHT_RESISTANCE`) je dodavanje **jednog `ParentCategory` reda** u seed; sva pravila po koraku automatski je počinju razumeti
- Dubina stabla varira (neke vežbe imaju 4 nivoa nadređenih, neke 2) — rekurzija prirodno prati tu varijaciju
- Eksplikacija odluke prati put rekurzije: *"`INDIVIDUAL_PASSING_DRILL` je dozvoljen jer je u kategoriji `BALL_DRILLS` ⊂ `SPORT_SPECIFIC_NO_CONTACT`, što je dozvoljena kategorija za Korak 3"*



#### Pravilo 5b — Spremnost za sledeći korak (običan BC upit)

Pitanje *"da li je sportista spreman da pređe iz trenutnog koraka u sledeći?"* je **konjunkcija ravnih uslova** izražena kao Drools `query readyToAdvance(String aid, int targetStep)` u [ReadinessQuery.drl](kjar/src/main/resources/rules/fc/ReadinessQuery.drl):

```
readyToAdvance(aid, targetStep) vraća 1 red ako i samo ako:

  - Athlete(id == aid, currentStep == targetStep - 1, stepEnteredAt != null)
  - postoji MinStepDwellRule(athleteId == aid, $minH: minHours)
  - vreme od stepEnteredAt do sada ≥ $minH + Athlete.dwellBonusHours()
  - nema ExertionIntoleranceFlag(athleteId == aid)
  - nema EmergencyAlert(athleteId == aid)
  - nema SymptomDuringExertionEvent(athleteId == aid, delta > 2 || durationMinutes > 60)
  - ako je targetStep ≥ 4: postoji MedicalClearanceEvent(athleteId == aid, clearanceForStep >= targetStep)
```

Java omotač u `ProtocolService.readyToAdvance` zove `s.getQueryResults("readyToAdvance", aid, targetStep)` i proverava `res.iterator().hasNext()` za boolean odgovor. Ako nije spreman, Java kod zatim eksplicitno iterira preko istih uslova da napravi `missing` listu — to nije ono što upit vraća, već eksplanacija koju Java naknadno gradi za UI prikaz.

#### Pravilo 6 — Znakovi za hitnu reakciju sa salience prioritetom

**Ako** se u prijavljenom simptomu (`SymptomReportedEvent`) detektuje neki od 10 znakova za hitnu reakciju iz Amsterdam 2022 / CRT6 (gubitak svesti, konvulzije, ponovljeno povraćanje, slabost ekstremiteta, vidljiva deformacija lobanje, dvoslike, jaka glavobolja, pogoršanje svesti, bol u vratu, uznemirenost), **onda** odgovarajuće template-generisano pravilo (`"RedFlag N FLAG_TYPE"`) ubacuje `EmergencyAlert(athleteId, flagType, severity, actionType, message, insertedAt)`.

`EmergencyAlert` se zatim koristi kao **blokirajuća činjenica** u BC upitu `readyToAdvance` (preko `not EmergencyAlert(athleteId == aid)` klauzule), čime sprečava napredovanje na sledeći korak dok je alert aktivan.

**Salience** svakog generisanog pravila dolazi iz CSV reda (`salienceLevel` kolona u `RedFlagSeverity.csv`): kritični znakovi (gubitak svesti, konvulzije, deformacija lobanje) imaju salience 10000 i okidaju se pre svih ostalih pravila, dok bol u vratu i uznemirenost imaju salience 6000. Ovo nije "dinamička salience po runtime stanju" već **parametrizovana salience kroz template** — vrednost je deo CSV podataka i može se izmeniti bez dodirivanja koda pravila.

**Brisanje alert-a kroz medical clearance**: pravilo `"Medical clearance retracts pre-clearance emergency alerts"` u [MedicalClearance.drl](kjar/src/main/resources/rules/fc/MedicalClearance.drl) — ako lekar zabeleži `MedicalClearanceEvent` sa timestamp-om kasnijim od `EmergencyAlert.insertedAt`, sistem retraktuje alert i okidajući `SymptomReportedEvent` da template ne bi odmah ponovo okinuo isti alert.

---

## 5. Arhitektura

### 5.1 Tehnologije

- **Serverska aplikacija**: Spring Boot 3.2.5 (Java 17)
- **Pravila**: Drools 8.44.0.Final, organizovan kao odvojen Maven `kjar` modul
- **Korisnički interfejs**: Angular 20 sa PrimeNG komponentama i Tailwind CSS-om
- **Stanje**: u memoriji — `ConcurrentHashMap` u `KnowledgeService` čuva profile sportista, `KieSession` po sportisti drži događaje + izvedene činjenice, audit log se vodi u memoriji. Demo podaci se učitavaju kroz `DemoAthleteSeed` pri pokretanju aplikacije.
- **Sastavljanje projekta**: Maven sa više modula
- **Autentifikacija**: JWT (HS256), tri uloge (DOCTOR, ADMIN, ATHLETE), preusmeravanje na `/login` u Angular ruter-u

### 5.2 Modulna arhitektura

```
sbnz-concussion/                  # parent POM
├── model/                        # POJO klase (Plain Old Java Object)
│   └── src/main/java/com/ftn/sbnz/model/
│       ├── domain/               # Athlete, RiskFactors, PreviousConcussion
│       ├── events/               # SymptomReportedEvent, SymptomDuringExertionEvent,
│       │                         #   ExertionAttemptEvent, StepAdvancementEvent,
│       │                         #   MedicalClearanceEvent, ObjectiveTestEvent
│       ├── facts/                # MoreThanMildExacerbation, ExertionIntoleranceFlag,
│       │                         #   RegressTrigger, ProgressionStatusFact,
│       │                         #   StepRecommendation, ProtocolLockEvent,
│       │                         #   EmergencyAlert, ActivityBlockedAlert,
│       │                         #   AllowedActivity, ParentCategory, MinStepDwellRule,
│       │                         #   PersistingSymptomsFlag,
│       │                         #   CervicovestibularRehabIndication,
│       │                         #   IndividualizedAssessmentRequired
│       ├── enums/                # ActionType, ContactLevel, HistoryFlag, Sex,
│       │                         #   ProgressionStatus, RedFlagType, Severity, SymptomType
│       └── template/             # DTO klase za parsiranje template CSV redova
├── kjar/                         # Drools .drl pravila, .drt šabloni + CSV
│   ├── src/main/resources/
│   │   ├── META-INF/kmodule.xml  # jedan kbase "mainKbase", stream mod, realtime clock
│   │   ├── rules/cep/            # CEP pravila (event role, sliding windows)
│   │   │   ├── ExertionPattern.drl       # MoreThanMild + accumulate + retraction
│   │   │   │                             #   + StepAdvancement recurrence
│   │   │   └── PersistingSymptoms.drl    # 10d cervicovestibular + 4w persisting
│   │   ├── rules/fc/             # FC pravila i BC upiti (sve u istom paketu)
│   │   │   ├── ProgressionDecision.drl   # klasifikator + akcija, agenda-group
│   │   │   ├── IndividualizedAssessment.drl
│   │   │   ├── ActivityValidation.drl    # koristi isInCategory query u check režimu
│   │   │   ├── ActivityCategory.drl      # rekurzivni BC upit isInCategory
│   │   │   ├── ReadinessQuery.drl        # readyToAdvance + athleteAllowedActivities
│   │   │   └── MedicalClearance.drl      # clearance retraktuje pre-clearance alerte
│   │   └── templates/                    # .drt + .csv parovi
│   │       ├── MinStepDwell.{drt,csv}
│   │       ├── AllowedActivity.{drt,csv}
│   │       └── RedFlagSeverity.{drt,csv}
│   └── src/test/java/com/ftn/sbnz/rules/  # JUnit 5 testovi nad rule mehanizmima
├── service/                      # Spring Boot aplikacija
│   └── src/main/java/com/ftn/sbnz/service/
│       ├── Application.java
│       ├── config/DroolsConfig.java
│       ├── auth/                 # JwtFilter, JwtUtil, SecurityConfig, UserStore
│       ├── controller/           # REST krajnje tačke (Athlete, Event, Report, Audit)
│       ├── admin/                # TemplateController (CSV hot-swap)
│       ├── audit/                # AuditService, AuditController (zapisnik okidanja)
│       ├── service/
│       │   ├── KnowledgeService  # gradi KieContainer iz KieFileSystem-a, kompiluje
│       │   │                     #   šablone runtime, drži KieSession po sportisti
│       │   └── ProtocolService   # omotač za sve event insert + fireAllRules pozive,
│       │                         #   queryFacts skeniranja, readyToAdvance Java logika
│       └── seed/DemoAthleteSeed  # ubacuje 3 demo sportista pri pokretanju aplikacije
└── frontend/                     # Angular 20 SPA (PrimeNG + Tailwind)
    └── src/app/pages/            # login, register, dashboard, athlete, reports, admin
```

Glavni razlog što su POJO klase u **odvojenom `model` modulu** a ne unutar `kjar`-a: i `kjar` (pravila zavise od fact klasa) i `service` (REST controller-i zavise od fact klasa) zavise od POJO-ova. Da su POJO-ovi u kjar-u, `service` bi morao da zavisi od kjar-a, što stvara cikličnu ili nezdravu zavisnost.

Sva pravila — uključujući BC upite — su u jedinstvenom paketu `rules.fc` (plus `rules.cep` za CEP-fleksibilna pravila i `rules.templates` za generisana template pravila). Ne postoji odvojen `rules/bc/` folder.

### 5.3 KIE sesija (KIE — Knowledge Is Everything, Drools eko-sistem)

Sistem koristi **jednu `KieSession` po sportisti** (lazy-instancirana iz `KieContainer`-a u [`KnowledgeService.getSessionFor`](service/src/main/java/com/ftn/sbnz/service/service/KnowledgeService.java)). Sesija je:

- **Stateful** (`type="stateful"`) — drži kompletnu radnu memoriju za tog sportistu: profil, događaje, izvedene činjenice, lock-ove, preporuke.
- **Stream mod** (`eventProcessingMode="stream"`) — neophodno za sliding window-e i temporal operatore koje koristi `ExertionPattern.drl`.
- **Realtime clock** (`clockType="realtime"`) u produkciji; test harness override-uje na `pseudo` clock da bi se vreme moglo deterministički ubrzati u testovima sliding window-a.

CEP, FC i BC mehanizmi se izvršavaju u **istoj sesiji** — pravila iz `rules.cep` paketa rade na event fact-ovima sa @Timestamp, pravila iz `rules.fc` na izvedenim fact-ovima, a BC upiti se zovu iz Java koda direktno na toj istoj sesiji preko `s.getQueryResults(...)`. Nema odvojene "BC stateless" sesije.

Razlog za jednu sesiju po sportisti (umesto jedne globalne): izolacija + odsustvo potrebe da svaki pattern u svakom pravilu filtrira po `athleteId`. Cena je linearno više memorije sa brojem sportista, što je za ovaj domen prihvatljivo (red veličine desetina-stotina sportista po klinici).

Konfiguracija (kompletna):
```xml
<kbase name="mainKbase" packages="rules.cep,rules.fc,rules.templates"
       eventProcessingMode="stream" default="true">
    <ksession name="mainKsession" type="stateful" clockType="realtime" default="true"/>
</kbase>
```

---

## 6. Šabloni (templates)

U sistemu se šabloni koriste za tri familije pravila gde Amsterdam 2022 dogovor (i njegove sistemske ekstenzije) prirodno traže parametrizaciju.

Šablon je u Drools-u definisan u `.drt` fajlu (rule template) sa parametrima u zaglavlju, a konkretne instance pravila se generišu iz prateće CSV ili Excel tabele. Svaki red tabele postaje jedno konkretno pravilo. CSV tabele su date u svakom potpoglavlju jer su one podaci (a ne kod) i čine glavni sadržaj koji opisuje šta sistem zna.

### 6.1 Šablon `MinStepDwell` — minimum boravka u koraku

**Svrha**: Amsterdam 2022 propisuje minimum 24h između koraka kao standard, ali takođe poziva na "individualizovanu procenu" za sportiste sa ponovljenim potresima i pominje produžen oporavak kod određenih CISG faktora rizika. Šablon dozvoljava ustanovi da konfiguriše duži minimum za određene podgrupe **bez izmene koda pravila**.

**Logika šablona**: za svaki sportista čiji se profil poklapa sa kombinacijom (nivo kontakta sporta, oznaka istorije potresa), ako još nema postavljen `MinStepDwellRule`, sistem ubacuje činjenicu `MinStepDwellRule(sportista, minimumSati)` koja kasnije utiče na proveru spremnosti za napredovanje.

**Parametri**: `contactLevel`, `historyFlag`, `minHours`.

**`MinStepDwell.csv`** (osnovna konfiguracija po Amsterdam 2022):
```
contactLevel, historyFlag, minHours
CONTACT,      NONE,        24
CONTACT,      SINGLE,      24
CONTACT,      MULTIPLE,    48
NONCONTACT,   NONE,        24
NONCONTACT,   SINGLE,      24
NONCONTACT,   MULTIPLE,    36
```

Tabela ima 6 redova → generiše se 6 konkretnih pravila iz jednog šablona. Ako lekar odluči da uvede 72h minimum za kontaktni sport sa ponovljenim potresom (što neke ustanove primenjuju kao opreznu praksu iznad konsenzusa), to je promena jednog broja u CSV-u — ne treba diranje koda.

### 6.2 Šablon `AllowedActivity` — dozvoljene top-level kategorije aktivnosti po koraku

**Svrha**: Amsterdam 2022 Tabela 2 pozitivno opisuje šta je dozvoljeno na svakom koraku (npr. Korak 3: *"Sport-specific training away from the team environment (eg, running, change of direction and/or individual training drills away from the team environment). No activities at risk of head impact."*). Sistem koristi **allow-list** pristup nad **top-level kategorijama**: za svaki korak postoji nekoliko dozvoljenih kategorija; konkretne vežbe iz tih kategorija se utvrđuju **rekurzivnim BC upitom `isInCategory`** nad stablom `ParentCategory` činjenica (vidi sekciju 4.5 Pravilo 5).

**Logika šablona**: za svaku kombinaciju (korak, kategorija, citat izvora), sistem inicijalno ubacuje činjenicu `AllowedActivity(korak, kategorija, izvor)` u radnu memoriju.

**Parametri**: `step`, `allowedCategory`, `sourceCitation`.

**`AllowedActivity.csv`** (mapira Amsterdam 2022 Tabelu 2):
```
step, allowedCategory,            sourceCitation
1,    SYMPTOM_LIMITED_DAILY,      Amsterdam 2022 Table 2 Step 1
2,    LIGHT_AEROBIC,              Amsterdam 2022 Table 2 Step 2A
2,    MODERATE_AEROBIC,           Amsterdam 2022 Table 2 Step 2B
2,    LIGHT_RESISTANCE,           Amsterdam 2022 Table 2 Step 2B
3,    SPORT_SPECIFIC_NO_CONTACT,  Amsterdam 2022 Table 2 Step 3
4,    NON_CONTACT_TEAM_TRAINING,  Amsterdam 2022 Table 2 Step 4
5,    FULL_CONTACT_PRACTICE,      Amsterdam 2022 Table 2 Step 5
6,    COMPETITIVE_PLAY,           Amsterdam 2022 Table 2 Step 6
```

8 redova → 8 činjenica `AllowedActivity`, svaka sa direktnom referencom na paragraf konsenzusa.

**Prateće pravilo blokade**: **ako** sportista zabeleži `ExertionAttemptEvent(activity=X)` dok je na koraku S, **i** ne postoji nijedna `AllowedActivity(S, allowedCategory)` takva da `isInCategory(X, allowedCategory)` rekurzivno vrati DA, **onda** sistem ubacuje `ActivityBlockedAlert` sa porukom koji korak je u toku, da aktivnost ne pripada nijednoj dozvoljenoj kategoriji za taj korak, i predlogom najbliže dozvoljene alternative.

Ova kombinacija (8 činjenica + ~20 `ParentCategory` činjenica + 1 obično pravilo + 1 rekurzivni BC upit) obezbeđuje:
- Sigurnost: aktivnost van stabla je automatski blokirana po default-u
- Proširivost: dodavanje nove vežbe je jedan red u stablu kategorija; `AllowedActivity` matrica ostaje ista
- Smislenost rekurzije: BC stvarno radi posao — obilazak stabla varijabilne dubine

### 6.3 Šablon `RedFlagSeverity` — nivoi ozbiljnosti znakova za hitnu reakciju

**Svrha**: Lista znakova za hitnu reakciju iz Amsterdam 2022 / CRT6 ima različite nivoe ozbiljnosti — neki znakovi (npr. gubitak svesti, konvulzije) zahtevaju trenutni transport u bolnicu, drugi (npr. blago povraćanje, otežana koncentracija) zahtevaju procenu lekara unutar nekoliko sati. Šablon mapira svaki znak na nivo akcije i **salience prioritet pravila**.

**Logika šablona**: za svaki tip znaka generiše se posebno pravilo sa salience vrednošću koja proistekne iz nivoa ozbiljnosti. **Ako** se u prijavljenom simptomu pojavi taj znak, **onda** sistem ubacuje `EmergencyAlert(sportista, tipZnaka, nivoOzbiljnosti, tipAkcije)`. Pravila sa višom salience vrednošću se izvršavaju pre, što garantuje da kritični znakovi blokiraju protokol pre nego što obrade niže prioritetna pravila.

**Parametri**: `flagType`, `severity`, `salienceLevel`, `actionType`.

**`RedFlagSeverity.csv`** (nivoi po CRT6 / Amsterdam 2022 Box 1):
```
flagType,                    severity,  salienceLevel, actionType
LOSS_OF_CONSCIOUSNESS,       CRITICAL,  10000,         IMMEDIATE_TRANSPORT
SEIZURE,                     CRITICAL,  10000,         IMMEDIATE_TRANSPORT
DETERIORATING_CONSCIOUSNESS, CRITICAL,  10000,         IMMEDIATE_TRANSPORT
WEAKNESS_IN_LIMBS,           CRITICAL,   9000,         IMMEDIATE_TRANSPORT
VISIBLE_SKULL_DEFORMITY,     CRITICAL,  10000,         IMMEDIATE_TRANSPORT
SEVERE_HEADACHE,             HIGH,       8000,         URGENT_MEDICAL_EVAL
REPEATED_VOMITING,           HIGH,       8000,         URGENT_MEDICAL_EVAL
DOUBLE_VISION,               HIGH,       7000,         URGENT_MEDICAL_EVAL
NECK_PAIN,                   MEDIUM,     6000,         MEDICAL_EVAL_24H
AGITATION,                   MEDIUM,     6000,         MEDICAL_EVAL_24H
```

10 redova → 10 generisanih pravila (`"RedFlag 1 LOSS_OF_CONSCIOUSNESS"`, `"RedFlag 2 SEIZURE"`, …) sa različitim prioritetima izvršavanja. Vrednosti `flagType` direktno mapiraju imena iz `RedFlagType` enum-a. Novi znakovi se dodaju u CSV bez izmene koda; ako buduća verzija konsenzusa promeni klasifikaciju ozbiljnosti ili salience-a, to je takođe izmena tabele a ne pravila.
