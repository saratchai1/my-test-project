import type { UserProfile } from "./types";

export const demoUser: UserProfile = {
  name: "Maya",
  age: 35,
  travelDuration: "2 days",
  wellnessGoal: "stress recovery, better sleep, and healthier lifestyle reset",
  fitnessLevel: "moderate",
  foodPreference: "local healthy Thai food",
  healthConstraints: "No serious condition; avoids very spicy food; office worker from Bangkok",
  stressLevel: 8,
  sleepQuality: "poor",
  budget: "medium-premium",
  travelStyle: ["nature", "slow living", "cafe", "walking"],

  foodInterests: ["local northern food", "high protein"],
  movementPreferences: ["mobility/stretching", "light walking", "HYROX-style"],
  travelMoods: ["quiet/private", "nature recovery", "slow living cafe", "hidden gem"],
  privacyPreference: "strongly avoid crowds",
  season: "late rainy / early winter",
  riskSensitivities: ["avoid PM2.5", "avoid water risk", "avoid crowds"],
};

export const emptyUser: UserProfile = {
  name: "",
  age: 30,
  travelDuration: "2 days",
  wellnessGoal: "stress recovery",
  fitnessLevel: "moderate",
  foodPreference: "local healthy Thai food",
  healthConstraints: "",
  stressLevel: 5,
  sleepQuality: "average",
  budget: "medium",
  travelStyle: ["nature", "walking"],

  foodInterests: ["local northern food"],
  movementPreferences: ["light walking", "mobility/stretching"],
  travelMoods: ["nature recovery", "slow living cafe"],
  privacyPreference: "prefer quiet",
  season: "not sure",
  riskSensitivities: [],
};
