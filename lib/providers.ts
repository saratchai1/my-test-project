import type { UserProfile, WellnessPlan } from "./types";

export type ProviderType =
  | "local guide"
  | "local food host"
  | "coach"
  | "quiet cafe"
  | "wellness-friendly hotel";

export type Provider = {
  name: string;
  type: ProviderType;
  location: string;
  tags: string[];
  safetyNotes: string;
  availabilityStatus: "available" | "limited" | "requires confirmation";
  whyItMatchesUser: string;
};

export const localProviders: Provider[] = [
  {
    name: "Nont Calm Trails",
    type: "local guide",
    location: "Khun Korn waterfall route / Kok River quiet paths",
    tags: ["low-crowd route", "nature recovery", "slow walking", "local guide"],
    safetyNotes: "Check rain, trail surface, water level, and visibility before departure.",
    availabilityStatus: "available",
    whyItMatchesUser: "Good fit for a traveler who wants quiet nature and a low-pressure reset.",
  },
  {
    name: "Saengda Seasonal Table",
    type: "local food host",
    location: "Tai Lue home kitchen, Mae Chan area",
    tags: ["local northern food", "not too spicy", "seasonal vegetables", "cultural food"],
    safetyNotes: "Confirm allergies, spice level, and food preferences before meal prep.",
    availabilityStatus: "requires confirmation",
    whyItMatchesUser: "Matches local healthy Thai food preferences while keeping spice level gentle.",
  },
  {
    name: "Coach Roi",
    type: "coach",
    location: "Le Méridien Chiang Rai Fitness / coach-led validation",
    tags: ["HYROX-style", "mobility", "RPE-based", "coach-led movement"],
    safetyNotes: "Coach Roi validates movement readiness, intensity, warm-up, cooldown, and recovery needs.",
    availabilityStatus: "available",
    whyItMatchesUser: "Coach Roi is the single coach validator for the RaiWell MVP.",
  },
  {
    name: "Aoy Tea Garden Slow Cafe",
    type: "quiet cafe",
    location: "Small tea garden outside main tourist hours",
    tags: ["slow living cafe", "digital detox", "quiet/private", "tea ceremony"],
    safetyNotes: "Confirm opening hours and avoid peak tourist times.",
    availabilityStatus: "requires confirmation",
    whyItMatchesUser: "Fits the need for privacy, quiet time, and slow-living cafe breaks.",
  },
  {
    name: "River Rest Wellness Stay",
    type: "wellness-friendly hotel",
    location: "Kok River area, Chiang Rai",
    tags: ["quiet room", "light gym", "sleep-friendly", "recovery base"],
    safetyNotes: "Confirm room quietness, gym access, and transport time before booking.",
    availabilityStatus: "limited",
    whyItMatchesUser: "Works as a calm base for walking, coach sessions, and evening recovery.",
  },
];

function scoreProvider(provider: Provider, profile: UserProfile, plan: WellnessPlan): number {
  const haystack = [
    profile.foodInterests.join(" "),
    profile.movementPreferences.join(" "),
    profile.travelMoods.join(" "),
    profile.travelStyle.join(" "),
    profile.privacyPreference,
    profile.healthConstraints,
    plan.summary,
    plan.reasoning,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  provider.tags.forEach((tag) => {
    if (haystack.includes(tag.toLowerCase())) score += 2;
  });
  if (profile.privacyPreference !== "ok with popular" && provider.tags.some((t) => t.includes("quiet") || t.includes("low-crowd"))) {
    score += 2;
  }
  if (profile.sleepQuality === "poor" && provider.tags.some((t) => t.includes("recovery") || t.includes("sleep"))) {
    score += 2;
  }
  if (profile.stressLevel >= 7 && provider.tags.some((t) => t.includes("nature") || t.includes("breathwork") || t.includes("slow"))) {
    score += 2;
  }
  return score;
}

export function matchProviders(profile: UserProfile, plan: WellnessPlan): Provider[] {
  return [...localProviders]
    .sort((a, b) => scoreProvider(b, profile, plan) - scoreProvider(a, profile, plan))
    .slice(0, 6);
}
