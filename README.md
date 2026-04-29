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
- Za prikaz **liste konkretnih dozvoljenih vežbi** na sportistinom trenutnom koraku (i za retrospektivnu validaciju aktivnosti koju je sportista zabeležio kroz `ExertionAttemptEvent`) pokreće se **rekurzivni BC upit** `isInCategory` nad stablom kategorija aktivnosti — sa neograničenom promenljivom na poziciji aktivnosti engine kroz unifikaciju nabraja sve listove stabla koji pripadaju dozvoljenoj top-level kategoriji za korak, varijabilne dubine, sa putom kroz stablo kao objašnjenjem.
- Na pitanje *"da li je sportista spreman za sledeći korak?"* pokreće se **običan upit** koji proverava ravnu konjunkciju uslova (vreme dwell-a, odsustvo flag-ova, prisustvo medical clearance-a).
- Upiti (queries) se takođe koriste za izveštajne ekrane (ko ima perzistentne simptome, ko je spreman za napredovanje danas, ko ima indikaciju za cervikovestibularnu rehabilitaciju).

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
10. **Lekar pita kroz interfejs**: "Da li Marko može sutra na Korak 4?" → pokreće se **običan upit** `isReadyToAdvance(aid="marko", targetStep=4)` koji proverava ravnu konjunkciju uslova za prelazak `currentStep → currentStep + 1`:
    - `currentStep == 3` i `targetStep == 4` ✓
    - 24h dwell na trenutnom koraku ✓ (Marko je na Koraku 3 od dana 4)
    - Odsustvo `ExertionIntoleranceFlag` ✗ (CEP pravilo iz koraka 3 ovog primera ga je upravo ubacilo)
    - Odsustvo `RedFlagAlert` ✓
    - Odsustvo `SymptomReportedEvent` iznad praga u poslednja 24h ✗
    - Prisustvo `MedicalClearanceEvent` ✗ (Korak 4 ima rizik udaraca, zahteva clearance — nedostaje)
    - **Rezultat**: NE. Eksplikacija nabraja koje uslove sportista nije ispunio (3 nisu zadovoljena) i šta sportista treba da uradi (sačeka da se simptomi povuku, dobije clearance lekara).
11. **UI prikazuje Marku listu konkretnih vežbi dozvoljenih za sutrašnji pokušaj Koraka 3** → pokreće se **rekurzivni BC upit nad stablom aktivnosti** sa **neograničenom promenljivom**. Sistem ne mora unapred da materijalizuje svaku konkretnu vežbu po koraku u `ConcreteActivityPrescription` — umesto toga drži:
    - Hijerarhiju kategorija aktivnosti (`ParentCategory` činjenice): npr. `INDIVIDUAL_PASSING_DRILL` ⊂ `BALL_DRILLS` ⊂ `SPORT_SPECIFIC_NO_CONTACT` ⊂ `EXERCISE`
    - Listu top-level dozvoljenih kategorija po koraku (`AllowedActivity`): Korak 3 dozvoljava `SPORT_SPECIFIC_NO_CONTACT`
    - Rekurzivni upit `isInCategory(?activity, SPORT_SPECIFIC_NO_CONTACT)` koji enumeriše sve listove stabla pod tom kategorijom

    Trag rekurzije za enumeraciju vežbi pod `SPORT_SPECIFIC_NO_CONTACT`:
    - Direktna deca kategorije u stablu: `RUNNING_DRILLS`, `BALL_DRILLS`
    - Spuštanje u `RUNNING_DRILLS` → daje listove `LINEAR_RUNNING`, `CHANGE_OF_DIRECTION`
    - Spuštanje u `BALL_DRILLS` → daje list `INDIVIDUAL_PASSING_DRILL`
    - Engine kroz unifikaciju vraća rezultat: `[LINEAR_RUNNING, CHANGE_OF_DIRECTION, INDIVIDUAL_PASSING_DRILL]` — UI ovo prikazuje Marku kao listu dozvoljenih vežbi za sutra
    - `FULL_CONTACT_TACKLE` se ne pojavljuje u rezultatu jer pripada `CONTACT` grani, koja **nije** u listi `AllowedActivity` za Korak 3

    Ista rekurzivna definicija upita se kasnije koristi i za **retrospektivnu validaciju**: kad Marko zabeleži `ExertionAttemptEvent(activity=X)`, pravilo `BlockActivityNotInAllowedCategory` poziva `isInCategory(X, allowedCategory)` (sad sa vezanom aktivnošću) i ubacuje `ActivityBlockedAlert` ako rekurzija nigde ne potvrdi pripadnost.
12. **Provera znakova za hitnu reakciju**: pravilo `RedFlagEmergency` se ne okida (nema povraćanja, gubitka svesti, neuroloških znakova) → nema alarma za hitnu pomoć
13. **Ažuriranje procene povratka igri**: Upit `estimateEarliestReturn` preračunava — sa zaustavljanjem na Koraku 3, najraniji potpuni povratak igri je pomeren za >1 dan, ali je još uvek u okviru tipičnih ~19.8 dana (medijana iz CISG sistematskog pregleda)

### 4.5 Primeri složenih pravila

Pravila su opisana u prozi (kao "ako-onda" izrazi nad činjenicama i događajima u radnoj memoriji). Konkretni DRL kod biće implementiran u izvršnoj fazi projekta.

#### Pravilo 1 — Obrazac netolerancije napora (CEP sa accumulate funkcijom)

**Ako** se za sportistu u kliznom prozoru od **48 sati** pojave **2 ili više** događaja `SymptomDuringExertionEvent` (simptom prijavljen tokom napora) sa porastom simptoma iznad praga, **i** sportista još nema aktivnu oznaku `ExertionIntoleranceFlag`, **onda** sistem ubacuje činjenicu `ExertionIntoleranceFlag(sportista, razlog)` koja kasnije utiče na odluku o napredovanju.

Ovo je primer **CEP** pravila koje koristi:
- vremenski klizni prozor (`over window:time(48h)`)
- agregatnu funkciju **accumulate** sa `count` nad podskupom događaja u prozoru
- `not` uslov da spreči ponovno okidanje pravila kad je oznaka već prisutna

#### Pravilo 2 — Povratak simptoma posle prelaska koraka (CEP sa vremenskim operatorom)

**Ako** sportista pređe na sledeći korak (`StepAdvancementEvent`), **i** unutar **24 sata** posle tog prelaska prijavi simptom čiji je nivo iznad njegovog početnog nivoa (`SymptomReportedEvent`), **onda** sistem ubacuje činjenicu `RegressTrigger(sportista, razlog)`.

Ovo pravilo koristi Drools vremenski operator `after[0s, 24h]` koji povezuje dva događaja iz stream-a po vremenskoj relaciji. Salience pravila je viša od standardnih FC pravila tako da se okida pre opštih pravila o napredovanju.

#### Pravilo 3 — Familija pravila po koraku, sportu i uzrastu (šabloni)

Pravila kojih ima više instanci sa istom strukturom a različitim parametrima izvedena su kao **šabloni** (Drools rule templates). Tri familije takvih pravila opisane su u **sekciji 6**: minimum boravka u koraku (`MinStepDwell`), dozvoljene aktivnosti po koraku (`AllowedActivity`), i nivoi ozbiljnosti znakova za hitnu reakciju (`RedFlagSeverity`).

#### Pravilo 4 — Odluka o vraćanju koraka (FC sa više nivoa, Amsterdam 2022 logika)

Amsterdam 2022 razlikuje setback na **Koracima 1–3** od onog na **Koracima 4–6**. Sistem to izražava kroz dva odvojena pravila iz iste agenda grupe `phase-decision`:

- **Setback na Koracima 1–3**: ako je sportistin trenutni korak između 1 i 3, **i** postoji `RegressTrigger` ili `ExertionIntoleranceFlag` za njega, **onda** sistem ostavlja `currentStep` nepromenjen, ubacuje `ProtocolLockEvent` na 24 sata sa razlogom `STOP_AND_RETRY_SAME_STEP`, i upisuje stavku u zapisnik.

- **Setback na Koracima 4–6**: ako je sportistin trenutni korak između 4 i 6 sa istim okidačima, **onda** sistem postavlja `currentStep = 3`, ažurira `stepEnteredAt` na trenutni datum, ubacuje `ProtocolLockEvent` na 24 sata sa razlogom `REGRESS_TO_STEP_3`, i upisuje regres u zapisnik.

Ova dva pravila su **četvrti nivo lanca FC zaključivanja** koji počinje u Pravilu 1 (CEP detekcija obrasca) → izvedena činjenica → status napredovanja → odluka o koraku → konkretna preporuka aktivnosti (Pravilo 5 nivoa FC izvođenja).

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

- **Enumeracija za UI** (primarno): kad korisnički interfejs treba da prikaže sportisti listu konkretnih vežbi za njegov trenutni korak, pozove se upit sa neograničenom promenljivom `isInCategory(?activity, allowedCategory)` za svaku top-level kategoriju iz `AllowedActivity` za taj korak. Engine kroz unifikaciju nabraja sve listove stabla koji pripadaju toj kategoriji i vraća ih kao listu — bez potrebe da `MaterializeConcreteActivity` unapred raspakuje stotine listova u `ConcreteActivityPrescription`.
- **Retrospektivna validacija** (sekundarno): kad sportista zabeleži `ExertionAttemptEvent(activity=X)`, obično pravilo `BlockActivityNotInAllowedCategory` prelazi listu `AllowedActivity` za njegov korak S i za svaku stavku poziva `isInCategory(X, allowedCategory)` sa vezanom aktivnošću. Ako bilo koja od provera vrati DA, aktivnost je bila dozvoljena; inače se ubacuje `ActivityBlockedAlert`.

**Šta dobijamo**:
- `AllowedActivity` tabela u sekciji 6.2 ostaje mala — ~6 top-level kategorija (jedna ili dve po koraku); konkretne vežbe rekurzija raspakuje iz stabla po potrebi
- Dodavanje nove specifične vežbe (npr. `KETTLEBELL_SWING ⊂ LIGHT_RESISTANCE`) je dodavanje **jednog `ParentCategory` reda** u seed; sva pravila po koraku automatski je počinju razumeti
- Dubina stabla varira (neke vežbe imaju 4 nivoa nadređenih, neke 2) — rekurzija prirodno prati tu varijaciju
- Eksplikacija odluke prati put rekurzije: *"`INDIVIDUAL_PASSING_DRILL` je dozvoljen jer je u kategoriji `BALL_DRILLS` ⊂ `SPORT_SPECIFIC_NO_CONTACT`, što je dozvoljena kategorija za Korak 3"*



#### Pravilo 5b — Spremnost za sledeći korak (običan upit)

Pitanje *"da li je sportista spreman da pređe iz trenutnog koraka u sledeći?"* je **konjunkcija ravnih uslova** koja se može izraziti kao standardni Drools upit:

```
isReadyToAdvance(athleteId, targetStep) = TRUE  ako i samo ako:

  - sportista je trenutno na (targetStep - 1)
  - vreme provedeno na trenutnom koraku ≥ MinStepDwellRule za njegov profil
  - nema aktivnih ExertionIntoleranceFlag
  - nema aktivnih RedFlagAlert
  - nema SymptomReportedEvent iznad praga u poslednja 24 sata
  - ako je targetStep ∈ {3 sa rizikom udaraca, 4, 5, 6}: postoji MedicalClearanceEvent
```

Rezultat upita je DA/NE plus lista uslova koji nisu zadovoljeni (eksplikacija). Svi uslovi su direktne pretrage radne memorije za istog sportistu i ravan zadati prag — standardni Drools query mehanizam direktno rešava ovu konjunkciju.

#### Pravilo 6 — Znak za hitnu reakciju sa dinamičkim salience prioritetom

**Ako** se u prijavljenom simptomu (`SymptomReportedEvent`) detektuje neki od znakova za hitnu reakciju (gubitak svesti, konvulzije, ponovljeno povraćanje, slabost ekstremiteta...), **onda** sistem ubacuje `EmergencyAlert` i `ProtocolFreezeEvent` koji zaustavlja dalje napredovanje dok lekar ne potvrdi.

**Salience** ovog pravila se računa **dinamički** na osnovu broja kritičnih znakova: pravilo sa više detektovanih kritičnih znakova ima viši prioritet i okida se pre. Ovaj mehanizam je detaljnije razrađen kroz šablon `RedFlagSeverity` (sekcija 6.3) gde svaki tip znaka dobija različitu osnovnu salience vrednost po nivou ozbiljnosti.

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

Šablon je u Drools-u definisan u `.drt` fajlu (rule template) sa parametrima u zaglavlju, a konkretne instance pravila se generišu iz prateće CSV ili Excel tabele. Svaki red tabele postaje jedno konkretno pravilo. CSV tabele su date u svakom potpoglavlju jer su one podaci (a ne kod) i čine glavni sadržaj koji opisuje šta sistem zna.

### 6.1 Šablon `MinStepDwell` — minimum boravka u koraku

**Svrha**: Amsterdam 2022 propisuje minimum 24h između koraka kao standard, ali takođe poziva na "individualizovanu procenu" za sportiste sa ponovljenim potresima i pominje produžen oporavak kod određenih CISG faktora rizika. Šablon dozvoljava ustanovi da konfiguriše duži minimum za određene podgrupe **bez izmene koda pravila**.

**Logika šablona**: za svaki sportista čiji se profil poklapa sa kombinacijom (uzrast, nivo kontakta sporta, oznaka istorije potresa), ako još nema postavljen `MinStepDwellRule`, sistem ubacuje činjenicu `MinStepDwellRule(sportista, minimumSati)` koja kasnije utiče na proveru spremnosti za napredovanje.

**Parametri**: `ageGroup`, `contactLevel`, `historyFlag`, `minHours`.

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

10 redova → 10 pravila sa različitim prioritetima izvršavanja. Novi znakovi mogu biti dodati u CSV bez izmene koda; takođe, ako buduća verzija konsenzusa promeni klasifikaciju ozbiljnosti, to je ponovo izmena tabele a ne pravila.
