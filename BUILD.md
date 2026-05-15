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

## Demo accounts

The backend seeds three accounts on startup:

| Username | Password | Role | What they see |
|---|---|---|---|
| `doctor` | `doctor` | DOCTOR | Roster, athlete dashboards, advancement, clearance, audit, reports |
| `trainer` | `trainer` | DOCTOR | Same as doctor |
| `admin` | `admin` | ADMIN | Everything plus the template editor |

Athlete accounts are provisioned at registration time (a doctor fills the optional username/password fields on the Register page). An athlete sees only their own protocol page — symptom intake, exertion logging, allowed activities, symptom timeline chart, estimated earliest return.

## REST endpoints

All endpoints except `/api/auth/**` require a `Authorization: Bearer <jwt>` header.

### Auth
- `POST /api/auth/login` — `{username, password}` → `{token, role, athleteId, displayName}`
- `POST /api/auth/register-athlete-account` — provision athlete login

### Athletes (DOCTOR/ADMIN; ATHLETE limited to own id)
- `GET /api/athletes` — roster
- `POST /api/athletes` — register (DOCTOR/ADMIN)
- `GET /api/athletes/{id}` — profile
- `GET /api/athletes/{id}/dashboard` — full state with derived facts, individualized assessment
- `GET /api/athletes/{id}/symptom-history` — chart data
- `GET /api/athletes/{id}/estimated-return` — estimateEarliestReturn
- `GET /api/athletes/{id}/allowed-activities` — recursive BC enumeration
- `GET /api/athletes/{id}/ready-to-advance?targetStep=N` — readiness conjunction (DOCTOR/ADMIN)

### Events
- `POST /api/events/symptom`
- `POST /api/events/exertion-attempt`
- `POST /api/events/symptom-during-exertion`
- `POST /api/events/step-advancement` (DOCTOR/ADMIN)
- `POST /api/events/medical-clearance` (DOCTOR)
- `POST /api/events/objective-test` (DOCTOR)

### Reports (DOCTOR/ADMIN)
- `GET /api/reports/athletes-by-step`
- `GET /api/reports/by-sport`
- `GET /api/reports/avg-recovery-days`
- `GET /api/reports/risk-summary`
- `GET /api/reports/adherence/{id}`

### Audit (DOCTOR/ADMIN)
- `GET /api/audit` — all decisions
- `GET /api/audit/{athleteId}` — per-athlete

### Admin templates (ADMIN)
- `GET /api/admin/templates` — list editable templates
- `GET /api/admin/templates/{name}` — current CSV
- `PUT /api/admin/templates/{name}` — update CSV; rebuilds knowledge base immediately
