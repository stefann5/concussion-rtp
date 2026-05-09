# Build & Run

Multi-module Maven backend (model + kjar + service) and Angular frontend.

## Prerequisites
- JDK 17+
- Maven 3.9+
- Node 22+ / npm 10+

## Backend

```cmd
mvn -N install
cd model && mvn install -DskipTests
cd ../kjar && mvn install -DskipTests
cd ../service && mvn spring-boot:run
```

Service listens on `http://localhost:8080`.

## Frontend

```cmd
cd frontend
npm install
npm start
```

Dev server on `http://localhost:4200`.

## REST endpoints

- `GET /api/athletes` — roster
- `POST /api/athletes` — register
- `GET /api/athletes/{id}/dashboard` — full state with derived facts
- `GET /api/athletes/{id}/allowed-activities` — recursive BC query
- `GET /api/athletes/{id}/ready-to-advance?targetStep=N` — flat conjunction query
- `POST /api/events/symptom` — SCAT6 symptom report
- `POST /api/events/exertion-attempt` — activity attempt
- `POST /api/events/symptom-during-exertion` — exacerbation
- `POST /api/events/step-advancement` — manual step move
- `POST /api/events/medical-clearance` — physician clearance
- `POST /api/events/objective-test` — mBESS / VOMS / etc
- `GET /api/reports/athletes-by-step`
- `GET /api/reports/risk-summary`
