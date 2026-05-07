# IEAT AI-Enhanced Digital Twin for Infrastructure Asset Management

Production-quality MVP web application for the Industrial Estate Authority of Thailand (IEAT / กนอ.) to manage infrastructure assets through an AI-enhanced digital twin.

## Business Objective

The system transforms a normal GIS dashboard into a decision-support platform for engineering and investment planning. It helps IEAT answer which assets exist, where they are, which assets are high-risk, what to inspect first, which renewal plan gives the best benefit under a limited budget, and what may happen during heavy rain, pump failure, pipe leakage, blockage, or wastewater overload.

Key Thai operating concepts:

- เปลี่ยนจากการซ่อมเมื่อเสีย ไปสู่การบำรุงรักษาเชิงป้องกันและคาดการณ์ล่วงหน้า
- จากการตรวจทุกจุด สู่การตรวจจุดที่มีความเสี่ยงและผลกระทบสูงที่สุด
- เลือกแผนซ่อมบำรุงที่ให้ผลลดความเสี่ยงสูงสุดภายใต้งบประมาณจำกัด
- Digital Twin ไม่ได้เป็นเพียงแผนที่แสดงข้อมูล แต่เป็นระบบช่วยตัดสินใจเชิงวิศวกรรมและการลงทุน

## Screenshots

Screenshots placeholder:

- Dashboard
- Digital Twin Map
- Asset Registry
- Risk Intelligence
- AI Maintenance Plan
- Scenario Simulation

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Lucide React
- Recharts
- React Leaflet with OpenStreetMap tiles
- Prisma ORM
- SQLite
- Zod
- Vitest

No paid map API key is required.

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Share A Demo

For a quick public demo, use Vercel. This project includes a seeded SQLite demo database at `prisma/dev.db`; on Vercel the app copies it to `/tmp` at runtime so API routes can read and perform temporary demo writes. Those writes are ephemeral and are not a production database.

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default framework preset: Next.js.
4. Build command: `npm run build`
5. Install command: `npm install`
6. Add environment variable: `DATABASE_URL=file:./dev.db`
7. Deploy.

For production, replace SQLite with a hosted database such as Neon Postgres, Supabase Postgres, Turso, or another managed database. That is the right path if multiple users need persistent plans, scenarios, and work orders.

If you prefer `db push` during prototype work:

```bash
npx prisma db push
npm run seed
npm run dev
```

`npm run seed` also initializes the local SQLite schema from `prisma/init-db.sql` before inserting deterministic demo data, so the MVP remains runnable even if Prisma's native migration engine has issues on a non-LTS local Node runtime.

## Main Routes

- `/` executive dashboard
- `/map` interactive GIS digital twin
- `/assets` asset registry
- `/assets/[id]` asset detail digital twin view
- `/risk` AI risk intelligence
- `/maintenance-plan` budget optimization and renewal planning
- `/work-orders` Kanban work order tracking
- `/scenarios` scenario simulation
- `/hydraulic-simulation` mock hydraulic engineering dashboard
- `/reports` management reports
- `/settings` configuration

## Seed Data

The seed creates deterministic mock Thai context data for:

- นิคมอุตสาหกรรมมาบตาพุด
- นิคมอุตสาหกรรมบางปู
- นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี

Each estate includes pipe networks, pump stations, pumps, WWTP assets, manholes, valves, canals, retention ponds, sensors, historical readings, incidents, risk assessments, maintenance plans, and work orders.

## Risk Score

`lib/risk-engine.ts` calculates deterministic risk from:

- Age
- Material
- Incident history
- Hydraulic stress from capacity and sensor thresholds
- Environmental exposure
- Criticality
- Maintenance history

Formula:

```text
totalRiskScore = 0.6 * probabilityScore + 0.4 * consequenceScore
```

Risk levels are Low, Moderate, High, and Critical with Thai recommendations.

## Maintenance Optimization

`lib/optimization-engine.ts` generates candidate actions for high-risk assets, estimates cost and benefit, sorts by benefit-cost ratio and criticality, then selects actions until the budget is exhausted. It also returns Pareto curve data for cost vs expected risk reduction.

## Scenario Simulation

`lib/hydraulic-simulation-engine.ts` is an MVP deterministic simulator, not a real hydraulic solver. It covers:

- Heavy rain
- Pump failure
- Pipe leakage
- Pipe blockage
- Wastewater overload
- Combined stress

Outputs include impact score, risk level, affected zones, critical assets, cost impact, recommended actions, and an operational checklist in Thai.

## API Routes

- `GET /api/assets`
- `GET /api/assets/[id]`
- `POST /api/risk-score/recalculate`
- `GET /api/sensors`
- `GET /api/sensor-readings`
- `GET /api/incidents`
- `POST /api/maintenance-plan/generate`
- `POST /api/maintenance-plan/save`
- `GET /api/work-orders`
- `POST /api/work-orders`
- `PATCH /api/work-orders/[id]`
- `POST /api/scenarios/run`
- `GET /api/reports/asset-health`
- `GET /api/reports/high-risk`
- `GET /api/reports/maintenance-budget`

## Tests

```bash
npm test
```

Covered:

- Old pipe with leakage history has higher risk than a new pipe.
- Budget optimizer does not exceed budget.
- Critical assets are prioritized.
- Heavy rain scenario produces higher flood risk as rainfall increases.

## Future Enhancements

- Integration with SCADA
- Integration with IoT sensors
- Integration with hydraulic model software such as EPANET / SWMM
- Integration with BIM / 3D model
- Mobile inspection app
- AI model trained on real maintenance history
- Computer vision from CCTV pipe inspection
- Integration with ERP / CMMS
- Role-based access control
- PDF report generation
- Real-time WebSocket data pipeline
