export type TravelDuration = "1 day" | "2 days" | "3 days";

export type WellnessGoal =
  | "stress recovery"
  | "better sleep"
  | "weight management"
  | "healthy lifestyle reset"
  | "active fitness trip"
  | "stress recovery and better sleep"
  | "stress recovery, better sleep, and healthier lifestyle reset";

export type FitnessLevel = "beginner" | "moderate" | "active";

// LEGACY field kept for backward intake compatibility (single dropdown)
export type FoodPreference =
  | "normal"
  | "vegetarian"
  | "high protein"
  | "low sugar"
  | "local healthy Thai food";

export type SleepQuality = "poor" | "average" | "good";
export type Budget = "low" | "medium" | "premium" | "medium-premium";

export type TravelStyle =
  | "nature"
  | "cafe"
  | "temple"
  | "walking"
  | "slow living"
  | "active adventure";

export type FoodInterest =
  | "local northern food"
  | "high protein"
  | "plant-forward"
  | "low sugar"
  | "fermented/local probiotic"
  | "chef/coach curated"
  | "surprise local food";

export type MovementPreference =
  | "light walking"
  | "mobility/stretching"
  | "gym training"
  | "HYROX-style"
  | "trail running"
  | "natural movement"
  | "fun social sport"
  | "recovery session";

export type TravelMood =
  | "quiet/private"
  | "nature recovery"
  | "local village"
  | "slow living cafe"
  | "historical/cultural"
  | "digital detox"
  | "hidden gem"
  | "low-crowd route";

export type PrivacyPreference =
  | "ok with popular"
  | "prefer quiet"
  | "strongly avoid crowds";

export type Season =
  | "rainy"
  | "late rainy / early winter"
  | "winter"
  | "hot"
  | "not sure";

export type RiskSensitivity =
  | "avoid PM2.5"
  | "avoid water risk"
  | "avoid crowds"
  | "avoid intense"
  | "medical/nutrition caution";

export interface UserProfile {
  name: string;
  age: number;
  travelDuration: TravelDuration;
  wellnessGoal: WellnessGoal;
  fitnessLevel: FitnessLevel;
  foodPreference: FoodPreference;
  healthConstraints: string;
  stressLevel: number; // 1-10
  sleepQuality: SleepQuality;
  budget: Budget;
  travelStyle: TravelStyle[];

  // NEW
  foodInterests: FoodInterest[];
  movementPreferences: MovementPreference[];
  travelMoods: TravelMood[];
  privacyPreference: PrivacyPreference;
  season: Season;
  riskSensitivities: RiskSensitivity[];
}

export interface DayItinerary {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface PlanItem {
  text: string;
  reason?: string;
  href?: string;
  hrefLabel?: string;
}

export interface WellnessPlan {
  summary: string;
  itinerary: DayItinerary[];
  foodJourney: PlanItem[];
  movementPlan: PlanItem[];
  peacefulTravelRoute: PlanItem[];
  localExperiences: PlanItem[];
  coachNotes: PlanItem[];
  environmentalSafety: PlanItem[];
  communityImpact: PlanItem[];
  dailyNudges: PlanItem[];
  reasoning: string;
  personalizationFactors?: string[];
  generationSource?: "openai-kb" | "openai" | "mock";
  planType?: string;
  riskLevel?: string;
  missingInfoToVerify?: string[];
  localWellnessNetwork?: PlanItem[];
}

export interface CoachReview {
  validated: boolean;
  approvedFoodPlan: boolean;
  intensity: "lighter" | "keep" | "harder";
  mealPortionAdjustment: string;
  addHyrox: boolean;
  addRecoverySession: boolean;
  addPm25Fallback: boolean;
  markNeedsVerification: boolean;
  hiddenGem: string;
  safetyWarning: string;
  note: string;
}

export interface DailyCheckIn {
  sleepHours: number;
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  completionPercent: number; // 0-100
  pain: string;
}

export interface AdaptiveRecommendation {
  headline: string;
  adjustments: string[];
  alerts: string[];
}
