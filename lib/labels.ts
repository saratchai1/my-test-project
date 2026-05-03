import type {
  Budget,
  FitnessLevel,
  FoodInterest,
  FoodPreference,
  MovementPreference,
  PrivacyPreference,
  RiskSensitivity,
  Season,
  SleepQuality,
  TravelDuration,
  TravelMood,
  TravelStyle,
  WellnessGoal,
} from "./types";

export const TH = {
  travelDuration: {
    "1 day": "1 day",
    "2 days": "2 days",
    "3 days": "3 days",
  } as Record<TravelDuration, string>,

  fitnessLevel: {
    beginner: "Beginner",
    moderate: "Moderate",
    active: "Active",
  } as Record<FitnessLevel, string>,

  food: {
    normal: "Flexible",
    vegetarian: "Vegetarian",
    "high protein": "Higher protein",
    "low sugar": "Lower added sugar",
    "local healthy Thai food": "Local healthy Thai food",
  } as Record<FoodPreference, string>,

  sleep: {
    poor: "Poor",
    average: "Average",
    good: "Good",
  } as Record<SleepQuality, string>,

  budget: {
    low: "Low",
    medium: "Medium",
    premium: "Premium",
    "medium-premium": "Medium-premium",
  } as Record<Budget, string>,

  travelStyle: {
    nature: "Nature",
    cafe: "Cafe",
    temple: "Temple",
    walking: "Walking",
    "slow living": "Slow Living",
    "active adventure": "Active adventure",
  } as Record<TravelStyle, string>,

  goal: {
    "stress recovery": "Stress recovery",
    "better sleep": "Better sleep",
    "weight management": "Weight management support",
    "healthy lifestyle reset": "Healthy lifestyle reset",
    "active fitness trip": "Active fitness trip",
    "stress recovery and better sleep": "Stress recovery and better sleep",
    "stress recovery, better sleep, and healthier lifestyle reset":
      "Stress recovery, better sleep, and healthier lifestyle reset",
  } as Record<WellnessGoal, string>,

  intensity: {
    lighter: "Lighter",
    keep: "Keep",
    harder: "A little more active",
  } as Record<"lighter" | "keep" | "harder", string>,

  foodInterest: {
    "local northern food": "Local northern food",
    "high protein": "Higher protein",
    "plant-forward": "Plant-forward",
    "low sugar": "Lower added sugar",
    "fermented/local probiotic": "Fermented local food",
    "chef/coach curated": "Chef/coach curated",
    "surprise local food": "Surprise local food",
  } as Record<FoodInterest, string>,

  movement: {
    "light walking": "Light walking",
    "mobility/stretching": "Mobility / stretching",
    "gym training": "Gym training",
    "HYROX-style": "HYROX functional",
    "trail running": "Trail running",
    "natural movement": "Natural movement",
    "fun social sport": "Fun social sport",
    "recovery session": "Recovery session",
  } as Record<MovementPreference, string>,

  travelMood: {
    "quiet/private": "Quiet / private",
    "nature recovery": "Nature recovery",
    "local village": "Local village",
    "slow living cafe": "Slow-living cafe",
    "historical/cultural": "Historical / cultural",
    "digital detox": "Digital detox",
    "hidden gem": "Hidden Gem",
    "low-crowd route": "Low-crowd route",
  } as Record<TravelMood, string>,

  privacy: {
    "ok with popular": "Popular places are okay",
    "prefer quiet": "Prefer quiet places",
    "strongly avoid crowds": "Strongly avoid crowds",
  } as Record<PrivacyPreference, string>,

  season: {
    rainy: "Rainy season",
    "late rainy / early winter": "Late rainy / early winter",
    winter: "Winter",
    hot: "Hot season",
    "not sure": "Not sure",
  } as Record<Season, string>,

  risk: {
    "avoid PM2.5": "Avoid PM2.5 exposure",
    "avoid water risk": "Avoid water-risk areas",
    "avoid crowds": "Avoid crowds",
    "avoid intense": "Avoid intense activity",
    "medical/nutrition caution": "Medical/nutrition caution",
  } as Record<RiskSensitivity, string>,
};

export function thGoal(g: string) {
  return (TH.goal as Record<string, string>)[g] ?? g;
}
