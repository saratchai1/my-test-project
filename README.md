# RaiWell AI

**RaiWell AI is the AI layer for personalized wellness tourism in Thailand.**

We are not building a generic travel planner. RaiWell AI creates personalized wellness journeys by combining AI-generated planning, local Chiang Rai context, coach validation, daily check-ins, and local provider matching.

Market framing used in the demo:

- **$894B global wellness tourism spending in 2024 (GWI)**
- **Thailand ranked #15 globally in wellness tourism spending; strong growth potential**

## Problem

Wellness travel is often sold as a list of places: spas, cafes, viewpoints, temples, hotels, and tourist attractions. That is not enough for travelers who want stress recovery, better sleep, sustainable movement, local food context, and a slower rhythm.

Current travel tools usually miss:

- Personal wellness goals
- Sleep, stress, and daily readiness
- Food preferences and cultural food context
- Privacy and crowd preferences
- Seasonal and environmental planning checks
- Coach validation before a plan is trusted
- Local community impact

## Solution

RaiWell AI turns a user profile into a Chiang Rai wellness journey across three pillars:

- **Eat Well**: local food context, portion awareness, spice preference, cultural learning
- **Move Well**: walking, mobility, recovery, optional coach-led movement, RPE-based guidance
- **Rest Deeply**: quiet routes, slow cafes, nature recovery, low-crowd scheduling

The plan is then reviewed through a **certified coach validation panel** and adapted through a **daily check-in**.

## Target Users

- Urban professionals seeking a short stress-recovery trip
- Travelers who want a quieter wellness experience instead of mass tourism
- Digital nomads who need recovery, focus, and local routines
- Wellness hotels, local guides, coaches, cafes, and food hosts looking for better matching
- Tourism operators who want scalable personalization without losing human validation

## Key Features

- Demo user intake with Maya, a 35-year-old Bangkok office worker
- AI-generated Chiang Rai itinerary
- Food, movement, peaceful travel, local experience, community impact, and safety sections
- "Why this recommendation?" explainability panel
- Certified coach review panel
- Daily check-in with adaptive recommendation
- Mock local provider dataset and matching
- Judge demo mode with a 2-minute script
- OpenAI API support with mock fallback when no API key exists

## AI Architecture

RaiWell uses a simple MVP architecture designed for hackathon clarity:

1. **User profile intake**
   - Goal, duration, fitness, food preference, sleep quality, stress, budget, travel style, season, privacy, and risk preferences.

2. **Plan generation API**
   - `POST /api/generate-plan`
   - Uses OpenAI when `OPENAI_API_KEY` exists.
   - Falls back to `lib/mockPlan.ts` when no key exists or the API fails.
   - The UI shows whether the plan came from OpenAI or the mock fallback.

3. **Safety prompt and conservative rules**
   - No diagnosis.
   - No treatment or cure claims.
   - No guaranteed weight-loss or medical outcomes.
   - Movement uses RPE and readiness checks instead of fixed heart-rate targets.

4. **Explainability**
   - The plan shows user factors, local/context factors, safety checks, and coach review items.

5. **Human validation**
   - The coach panel requires food review and a coach note before validation.

6. **Daily adaptation**
   - The check-in adapts next-step recommendations based on sleep, energy, stress, completion, and discomfort.

## Safety and Non-Medical Disclaimer

RaiWell AI is not a medical diagnosis tool. It supports general lifestyle and wellness planning. Users with medical symptoms should consult qualified healthcare professionals.

RaiWell AI does not:

- Diagnose disease
- Treat disease
- Claim to cure disease
- Guarantee weight loss
- Replace doctors, dietitians, physical therapists, or other qualified healthcare professionals

RaiWell AI does:

- Support general wellness planning
- Encourage coach validation
- Use conservative movement language
- Treat environmental notes as planning checks, not live verified data
- Recommend professional consultation when symptoms appear

## Local Impact Model

The MVP includes a mock local provider dataset in `lib/providers.ts`:

- Local guide
- Local food host
- Movement coach
- Recovery coach
- Quiet cafe
- Wellness-friendly hotel

Each provider includes:

- Name
- Type
- Location
- Tags
- Safety notes
- Availability status
- Why it matches the user

The `LocalWellnessNetwork` component renders providers matched to the generated plan and user profile. This shows how RaiWell can route demand toward local businesses and community-based wellness providers.

## Demo Flow

1. Start on the landing page.
2. Click **Load Demo User**.
3. Review Maya's profile and generate the AI wellness plan.
4. Show the personalized Chiang Rai itinerary.
5. Open the coach review panel.
6. Review food, add a coach note, and mark the plan as Coach Validated.
7. Complete the daily check-in.
8. Show the adaptive recommendation.
9. Close with the impact story: Chiang Rai pilot, Thailand-scale wellness tourism AI layer.

There is also a scripted judge page at `/demo`.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local state and localStorage for demo persistence
- API route for AI generation
- OpenAI API when `OPENAI_API_KEY` exists
- Mock fallback when no API key exists

## Setup Instructions

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Environment Variables

The app works without environment variables because it has a mock fallback.

Optional `.env.local`:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is missing, the app returns a realistic profile-aware mock plan and labels it as a mock fallback demo plan.

## Limitations

- Provider data is mocked for the hackathon MVP.
- Environmental checks are planning prompts, not live verified data.
- Coach validation is a demo workflow, not a credential verification system.
- No booking, payment, map routing, or real provider availability is implemented yet.
- The OpenAI output is schema-guided but not fully validated with a runtime schema library.
- The MVP focuses on Chiang Rai and demonstrates how the model can scale.

## Roadmap

- Real provider onboarding and credential verification
- Live availability and booking handoff
- Weather, AQI, route, and seasonal data integrations
- Runtime schema validation for generated plans
- Coach dashboard and provider operations tools
- Multilingual traveler experience
- Expansion to other Thai wellness destinations such as Nan, Pai, Mae Hong Son, Koh Lanta, and Koh Tao
- Community impact reporting and transparent revenue routing
