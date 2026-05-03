import { NextResponse } from "next/server";
import { buildMockPlan } from "@/lib/mockPlan";
import type { UserProfile, WellnessPlan } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are RaiWell AI, the AI layer for personalized wellness tourism in Chiang Rai, Thailand.
Design a general wellness journey around 3 pillars: Eat Well, Move Well, and Rest Deeply.

All output must be in English.

Safety rules:
- Do not diagnose disease.
- Do not claim to treat or cure disease.
- Do not guarantee weight loss or any medical outcome.
- Do not say a food cures, treats, or prevents disease.
- Do not conflict with professional medical advice.
- Use conservative language: general wellness planning, lifestyle support, portion awareness, movement readiness, RPE, recovery, privacy, local context, coach review.
- Avoid fixed heart-rate targets. Use RPE and readiness checks.
- Always include this disclaimer in environmentalSafety: "RaiWell AI is not a medical diagnosis tool. It supports general lifestyle and wellness planning. Users with medical symptoms should consult qualified healthcare professionals."

Chiang Rai context:
- Calm, privacy, local seasonal food culture, Akha/Tai Lue/Shan/Karen food context.
- Choui Fong tea fields, Singha Park, Khun Korn waterfall, Mae Kachan hot spring, old city, Kok River, slow-living cafes.
- HYROX-style movement can appear only as coach-led, optional, and RPE-based.
- Seasonal and environmental checks: PM2.5, rain, water conditions, mountain/fog visibility, crowd timing.
- Present environmental notes as planning considerations, not live verified data.

Output schema: JSON object only.
{
  "summary": string,
  "itinerary": [{"day": string, "morning": string, "afternoon": string, "evening": string}],
  "foodJourney": [{"text": string, "reason": string}],
  "movementPlan": [{"text": string, "reason": string}],
  "peacefulTravelRoute": [{"text": string, "reason": string}],
  "localExperiences": [{"text": string, "reason": string}],
  "coachNotes": [{"text": string, "reason": string}],
  "environmentalSafety": [{"text": string, "reason": string}],
  "communityImpact": [{"text": string, "reason": string}],
  "dailyNudges": [{"text": string, "reason": string}],
  "reasoning": string,
  "personalizationFactors": string[]
}

Each plan item must include text and a short reason.
The itinerary day count must match travelDuration: 1 day, 2 days, or 3 days.`;

async function generateWithOpenAI(profile: UserProfile): Promise<WellnessPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const userPrompt = `Create a Chiang Rai wellness journey for this user profile:
${JSON.stringify(profile, null, 2)}

Return only a JSON object matching the schema.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = JSON.parse(text) as WellnessPlan;
    if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) return null;
    return { ...parsed, generationSource: "openai" };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let profile: UserProfile;
  try {
    profile = (await req.json()) as UserProfile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Missing user profile" }, { status: 400 });
  }

  const aiPlan = await generateWithOpenAI(profile);
  const plan = aiPlan ?? { ...buildMockPlan(profile), generationSource: "mock" as const };
  return NextResponse.json(plan);
}
