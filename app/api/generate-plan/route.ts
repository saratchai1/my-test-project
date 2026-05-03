import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { buildMockPlan } from "@/lib/mockPlan";
import type { DayItinerary, PlanItem, UserProfile, WellnessPlan } from "@/lib/types";

export const runtime = "nodejs";

type KnowledgeFoodItem = {
  meal_time: string;
  recommendation: string;
  why_it_fits: string;
  portion_note: string;
  safety_note: string;
  source_pattern_id: string;
};

type KnowledgeMovementItem = {
  activity_id: string;
  activity: string;
  duration_minutes: number;
  intensity: string;
  rpe: string;
  why_it_fits: string;
  downgrade_if: string[];
  coach_review_required: boolean;
};

type KnowledgeRouteItem = {
  place_id: string;
  place_name: string;
  duration_minutes: number;
  crowd_level: string;
  why_it_fits: string;
  verification_status: string;
};

type KnowledgeExperienceItem = {
  place_id: string;
  name: string;
  reason: string;
  community_impact: string;
  verification_status: string;
};

type KnowledgeProviderItem = {
  provider_id: string;
  provider_type: string;
  experience_name: string;
  pillar: string;
  verification_status: string;
};

type KnowledgePlan = {
  wellness_summary: string;
  plan_type: "recovery_first" | "balanced_reset" | "active_reset" | "conservative_general_wellness";
  risk_level: "low" | "medium" | "high";
  food_journey: KnowledgeFoodItem[];
  movement_plan: KnowledgeMovementItem[];
  peaceful_travel_route: KnowledgeRouteItem[];
  local_experience_hidden_gem: KnowledgeExperienceItem[];
  local_wellness_network: KnowledgeProviderItem[];
  coach_notes: string[];
  safety_considerations: string[];
  community_impact: string;
  daily_nudges: string[];
  missing_info_to_verify: string[];
};

const KNOWLEDGE_FILES = [
  "prompt_policy.md",
  "wellness_rules.json",
  "safety_rules.json",
  "food_patterns.json",
  "movement_library.json",
  "chiangrai_places.json",
  "local_wellness_network.json",
  "route_feasibility.json",
  "coach_review_checklist.json",
  "output_schema.json",
] as const;

const OUTPUT_JSON_SCHEMA = {
  name: "raiwell_knowledge_base_plan",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "wellness_summary",
      "plan_type",
      "risk_level",
      "food_journey",
      "movement_plan",
      "peaceful_travel_route",
      "local_experience_hidden_gem",
      "local_wellness_network",
      "coach_notes",
      "safety_considerations",
      "community_impact",
      "daily_nudges",
      "missing_info_to_verify",
    ],
    properties: {
      wellness_summary: { type: "string" },
      plan_type: {
        type: "string",
        enum: ["recovery_first", "balanced_reset", "active_reset", "conservative_general_wellness"],
      },
      risk_level: { type: "string", enum: ["low", "medium", "high"] },
      food_journey: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["meal_time", "recommendation", "why_it_fits", "portion_note", "safety_note", "source_pattern_id"],
          properties: {
            meal_time: { type: "string" },
            recommendation: { type: "string" },
            why_it_fits: { type: "string" },
            portion_note: { type: "string" },
            safety_note: { type: "string" },
            source_pattern_id: { type: "string" },
          },
        },
      },
      movement_plan: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "activity_id",
            "activity",
            "duration_minutes",
            "intensity",
            "rpe",
            "why_it_fits",
            "downgrade_if",
            "coach_review_required",
          ],
          properties: {
            activity_id: { type: "string" },
            activity: { type: "string" },
            duration_minutes: { type: "number" },
            intensity: { type: "string" },
            rpe: { type: "string" },
            why_it_fits: { type: "string" },
            downgrade_if: { type: "array", items: { type: "string" } },
            coach_review_required: { type: "boolean" },
          },
        },
      },
      peaceful_travel_route: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["place_id", "place_name", "duration_minutes", "crowd_level", "why_it_fits", "verification_status"],
          properties: {
            place_id: { type: "string" },
            place_name: { type: "string" },
            duration_minutes: { type: "number" },
            crowd_level: { type: "string" },
            why_it_fits: { type: "string" },
            verification_status: { type: "string" },
          },
        },
      },
      local_experience_hidden_gem: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["place_id", "name", "reason", "community_impact", "verification_status"],
          properties: {
            place_id: { type: "string" },
            name: { type: "string" },
            reason: { type: "string" },
            community_impact: { type: "string" },
            verification_status: { type: "string" },
          },
        },
      },
      local_wellness_network: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["provider_id", "provider_type", "experience_name", "pillar", "verification_status"],
          properties: {
            provider_id: { type: "string" },
            provider_type: { type: "string" },
            experience_name: { type: "string" },
            pillar: { type: "string" },
            verification_status: { type: "string" },
          },
        },
      },
      coach_notes: { type: "array", items: { type: "string" } },
      safety_considerations: { type: "array", items: { type: "string" } },
      community_impact: { type: "string" },
      daily_nudges: { type: "array", items: { type: "string" } },
      missing_info_to_verify: { type: "array", items: { type: "string" } },
    },
  },
} as const;

async function loadKnowledgeBase(): Promise<string> {
  const base = path.join(process.cwd(), "raiwell_ai_knowledge_base");
  const chunks = await Promise.all(
    KNOWLEDGE_FILES.map(async (file) => {
      const text = await readFile(path.join(base, file), "utf8");
      return `\n--- FILE: ${file} ---\n${text.trim()}`;
    })
  );
  return chunks.join("\n");
}

function dayCount(d: UserProfile["travelDuration"]): number {
  if (d === "1 day") return 1;
  if (d === "3 days") return 3;
  return 2;
}

function item(text: string, reason?: string, href?: string, hrefLabel?: string): PlanItem {
  return { text, ...(reason ? { reason } : {}), ...(href ? { href, hrefLabel } : {}) };
}

function pick<T>(arr: T[], index: number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[index % arr.length];
}

function buildUiItinerary(plan: KnowledgePlan, profile: UserProfile): DayItinerary[] {
  return Array.from({ length: dayCount(profile.travelDuration) }, (_, index) => {
    const route = pick(plan.peaceful_travel_route, index);
    const food = pick(plan.food_journey, index);
    const movement = pick(plan.movement_plan, index);
    const hidden = pick(plan.local_experience_hidden_gem, index);
    const nudge = pick(plan.daily_nudges, index);

    return {
      day: `Day ${index + 1} — ${index === 0 ? "Recovery-first arrival" : "Adaptive Chiang Rai reset"}`,
      morning: route
        ? `${route.place_name} for about ${route.duration_minutes} minutes. Crowd level: ${route.crowd_level}. ${route.why_it_fits}`
        : "Start with a quiet, low-crowd Chiang Rai route that needs local verification.",
      afternoon: [
        food ? `${food.meal_time}: ${food.recommendation} Portion note: ${food.portion_note}` : undefined,
        hidden ? `Local experience: ${hidden.name}. ${hidden.reason}` : undefined,
      ]
        .filter(Boolean)
        .join(" "),
      evening: [
        movement
          ? `${movement.activity} for ${movement.duration_minutes} minutes at ${movement.rpe}. Downgrade if: ${movement.downgrade_if.join(", ")}.`
          : undefined,
        nudge ? `Daily nudge: ${nudge}` : undefined,
      ]
        .filter(Boolean)
        .join(" "),
    };
  });
}

function needsScaledMovement(profile: UserProfile): boolean {
  return (
    profile.stressLevel >= 8 ||
    profile.sleepQuality === "poor" ||
    profile.riskSensitivities.includes("medical/nutrition caution")
  );
}

function cleanVerification(status: string): string {
  const lower = status.toLowerCase();
  if (lower.includes("coach-confirmed")) return "coach-confirmed";
  if (lower.includes("source-backed")) return "locally curated candidate";
  if (lower.includes("needs")) return "to be confirmed by local team";
  return status;
}

function coachRoiProfileItem(): PlanItem {
  return item(
    "Coach Roi · certified fitness and nutrition coach for movement scaling and wellness validation",
    "Validates intensity, warm-up, cooldown, movement readiness, and recovery needs",
    "https://raiwellteamprofile.netlify.app/coach-roi-profile",
    "View Coach Roi profile"
  );
}

function isAllowedNetworkSupport(provider: KnowledgeProviderItem): boolean {
  if (provider.provider_id === "coach_roi") return false;
  return (
    provider.provider_id === "le_meridien_chiang_rai_fitness_coach_session" ||
    provider.experience_name.toLowerCase().includes("le méridien") ||
    provider.experience_name.toLowerCase().includes("le meridien") ||
    !provider.provider_type.toLowerCase().includes("coach")
  );
}

function adaptKnowledgePlan(plan: KnowledgePlan, profile: UserProfile): WellnessPlan {
  const personalizationFactors = [
    `Plan type: ${plan.plan_type}`,
    `Risk level: ${plan.risk_level}`,
    `Profile goal: ${profile.wellnessGoal}`,
    `Stress: ${profile.stressLevel}/10`,
    `Sleep: ${profile.sleepQuality}`,
    `Fitness: ${profile.fitnessLevel}`,
    `Knowledge base files: ${KNOWLEDGE_FILES.length}`,
  ];

  return {
    summary: plan.wellness_summary,
    itinerary: buildUiItinerary(plan, profile),
    foodJourney: plan.food_journey.map((f) =>
      item(
        `${f.meal_time}: ${f.recommendation} Portion: ${f.portion_note} Safety: ${f.safety_note}`,
        f.why_it_fits
      )
    ),
    movementPlan: plan.movement_plan.map((m) => {
      const scaledNote =
        m.activity.toLowerCase().includes("hyrox") && needsScaledMovement(profile)
          ? " Use a scaled version, capped at moderate intensity, with Coach Roi review."
          : "";
      return item(
        `${m.activity} · ${m.duration_minutes} min · ${m.intensity} · ${m.rpe}${
          m.coach_review_required ? " · Coach Roi review required" : ""
        }.${scaledNote}`,
        m.why_it_fits
      );
    }),
    peacefulTravelRoute: plan.peaceful_travel_route.map((r) =>
      item(
        `${r.place_name} · ${r.duration_minutes} min · crowd: ${r.crowd_level} · ${cleanVerification(r.verification_status)}`,
        r.why_it_fits
      )
    ),
    localExperiences: plan.local_experience_hidden_gem.map((e) =>
      item(
        `${e.name} · ${cleanVerification(e.verification_status)}`,
        `${e.reason} · ${e.community_impact}`
      )
    ),
    coachNotes: plan.coach_notes.map((note) => item(note)),
    environmentalSafety: [
      ...plan.safety_considerations.map((note) => item(note)),
      item(
        "Before the trip, the RaiWell team will confirm opening hours, booking slots, crowd level, and food spice preferences with local providers.",
        "Demo readiness check"
      ),
    ],
    communityImpact: [item(plan.community_impact)],
    dailyNudges: plan.daily_nudges.map((note) => item(note)),
    reasoning:
      "Generated from the local RaiWell knowledge base only. The model was instructed to recommend only catalogued Chiang Rai places/providers and to label unknown details as needing verification.",
    personalizationFactors,
    generationSource: "openai-kb",
    planType: plan.plan_type,
    riskLevel: plan.risk_level,
    missingInfoToVerify: plan.missing_info_to_verify,
    localWellnessNetwork: [
      coachRoiProfileItem(),
      ...plan.local_wellness_network
        .filter(isAllowedNetworkSupport)
        .map((p) =>
          item(
            `${p.experience_name} · ${p.provider_type}`,
            `${
              p.provider_id === "le_meridien_chiang_rai_fitness_coach_session"
                ? "Coach Roi validates this indoor movement option"
                : "Local support option, not a coach"
            } · ${cleanVerification(p.verification_status)}`
          )
        ),
    ],
  };
}

function isKnowledgePlan(value: unknown): value is KnowledgePlan {
  const plan = value as Partial<KnowledgePlan>;
  return Boolean(
    plan &&
      typeof plan === "object" &&
      typeof plan.wellness_summary === "string" &&
      Array.isArray(plan.food_journey) &&
      Array.isArray(plan.movement_plan) &&
      Array.isArray(plan.peaceful_travel_route) &&
      Array.isArray(plan.coach_notes) &&
      Array.isArray(plan.safety_considerations)
  );
}

async function generateWithOpenAI(profile: UserProfile): Promise<WellnessPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const knowledgeBase = await loadKnowledgeBase();
  const userPrompt = `Generate a RaiWell AI plan using only the provided knowledge base and return output following output_schema.json.

User profile:
${JSON.stringify(profile, null, 2)}

Provided knowledge base:
${knowledgeBase}

Important:
- Use only information in the knowledge base above.
- Coach Roi is the only coach in the current RaiWell demo. Do not invent or name any other coach.
- Recommend only places from chiangrai_places.json and providers from local_wellness_network.json.
- If any useful detail is not in the knowledge base, put it in missing_info_to_verify.
- Return only JSON that matches output_schema.json.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.35,
        response_format: {
          type: "json_schema",
          json_schema: OUTPUT_JSON_SCHEMA,
        },
        messages: [
          {
            role: "system",
            content:
              "You are RaiWell AI. Follow the provided knowledge base exactly. Coach Roi is the only coach in the current RaiWell demo; do not invent or name any other coach. Do not use outside facts, invented partnerships, medical claims, opening hours, prices, contacts, or uncatalogued places. If unknown, mark it as needing verification. Use the wording HYROX-inspired functional training only; never call Le Méridien Chiang Rai Fitness an official HYROX center or official HYROX training.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!isKnowledgePlan(parsed)) return null;
    return adaptKnowledgePlan(parsed, profile);
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
