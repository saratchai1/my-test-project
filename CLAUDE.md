# CLAUDE.md

## Project Name

RaiWell AI

## Product Positioning

RaiWell AI is not a generic travel planner. It is the AI layer for personalized wellness tourism.

Core sentence:
“We are not building a travel app. We are building the AI layer for Thailand’s wellness tourism.”

## Product Concept

RaiWell AI creates personalized wellness journeys by combining:

- AI-generated planning
- nutrition
- movement
- recovery
- local Chiang Rai travel
- certified coach validation

## Hackathon Goal

Build a working MVP that judges can understand in 2–3 minutes.

The MVP must clearly show:

1. User profile intake
2. AI-generated personalized wellness journey
3. Certified coach validation
4. Daily check-in and adaptive recommendation
5. Chiang Rai pilot with Thailand-scale potential

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- API route for AI generation
- localStorage or local state for demo data
- OpenAI API if OPENAI_API_KEY exists
- Mock fallback if no API key exists

## Design Direction

- Premium wellness startup feel
- Clean white layout
- Soft green / blue accents
- Rounded cards
- Mobile responsive
- Clear judge demo flow
- Avoid clutter

## Safety Rules

Do not:

- diagnose disease
- claim to treat disease
- claim to cure disease
- guarantee weight loss
- replace healthcare professionals

Use:

- preventive wellness
- lifestyle support
- general wellness planning
- coach validation
- professional consultation when symptoms appear

Required disclaimer:
“RaiWell AI is not a medical diagnosis tool. It supports general lifestyle and wellness planning. Users with medical symptoms should consult qualified healthcare professionals.”

## Demo User

Use this default demo user:

Name: Maya
Age: 35
Travel duration: 2 days
Goal: stress recovery and better sleep
Fitness level: moderate
Food preference: local healthy Thai food
Health constraints: no serious condition, avoids very spicy food
Stress level: 8
Sleep quality: poor
Budget: medium
Travel style: nature, slow living, cafe, walking

## Required Demo Flow

1. Start at landing page
2. Click Load Demo User
3. Generate AI wellness plan
4. Show Chiang Rai personalized itinerary
5. Open coach review panel
6. Add coach note and mark as Coach Validated
7. Complete daily check-in
8. Show adaptive recommendation
9. End with impact: Chiang Rai pilot can scale to Thailand wellness tourism

## Build Rules

Before final response, always run:

```bash
npm run build
```
