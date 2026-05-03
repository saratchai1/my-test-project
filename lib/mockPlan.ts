import type { PlanItem, UserProfile, WellnessPlan } from "./types";

function dayCount(d: UserProfile["travelDuration"]): number {
  if (d === "1 day") return 1;
  if (d === "3 days") return 3;
  return 2;
}

function R(text: string, reason?: string): PlanItem {
  return reason ? { text, reason } : { text };
}

const ALL_DAYS = [
  {
    day: "Day 1 — Arrival and nervous-system reset",
    morning:
      "Easy arrival walk around Singha Park lake for 30-45 minutes at a conversational pace, followed by slow breathing and a quiet tea break.",
    afternoon:
      "Local northern lunch: nam prik ong, seasonal steamed vegetables, river fish or tofu, and a mindful portion of sticky rice. Rest for one hour at a slow-living cafe near the Kok River.",
    evening:
      "Gentle mobility flow for 15-20 minutes, warm foot soak if appropriate, screen-light wind-down, and a 22:00 sleep window.",
  },
  {
    day: "Day 2 — Calm movement and local culture",
    morning:
      "Visit Choui Fong tea fields before 08:00 to avoid crowds. Add a short coach-led HYROX-style option only if readiness feels good, using RPE 5-6/10.",
    afternoon:
      "Tai Lue or Akha-inspired meal with low-spice options, then a forest-bathing walk near Khun Korn only after checking rain, water level, and trail conditions.",
    evening:
      "Recovery session: light stretching, legs-up-the-wall, herbal tea, and a short reflection on three moments that felt calm.",
  },
  {
    day: "Day 3 — Integration before returning home",
    morning:
      "Reflective walk around Chiang Rai old city before peak hours, paired with 10 minutes of shoulder and hip mobility.",
    afternoon:
      "Community food experience with seasonal vegetables, grilled herbs, and a local host conversation about culture and food context.",
    evening:
      "Quiet sunset cafe, digital-detox hour, and a five-point habit plan for returning home.",
  },
];

export function buildMockPlan(profile: UserProfile): WellnessPlan {
  const days = dayCount(profile.travelDuration);
  const itinerary = ALL_DAYS.slice(0, days);

  const stressed = profile.stressLevel >= 7;
  const poorSleep = profile.sleepQuality === "poor";
  const isActive = profile.fitnessLevel === "active";
  const isBeginner = profile.fitnessLevel === "beginner";
  const avoidSpicy =
    profile.healthConstraints?.toLowerCase().includes("spicy") ||
    profile.healthConstraints?.toLowerCase().includes("เผ็ด");

  const wantsHyrox = profile.movementPreferences.includes("HYROX-style");
  const wantsTrail = profile.movementPreferences.includes("trail running");
  const wantsRecovery = profile.movementPreferences.includes("recovery session");
  const wantsFun = profile.movementPreferences.includes("fun social sport");
  const wantsSurprise = profile.foodInterests.includes("surprise local food");
  const wantsFermented = profile.foodInterests.includes("fermented/local probiotic");
  const wantsPlant = profile.foodInterests.includes("plant-forward");
  const wantsHighProtein = profile.foodInterests.includes("high protein");

  const strongAvoidCrowds = profile.privacyPreference === "strongly avoid crowds";
  const preferQuiet = profile.privacyPreference !== "ok with popular";
  const hasPM25 = profile.riskSensitivities.includes("avoid PM2.5");
  const hasWaterRisk = profile.riskSensitivities.includes("avoid water risk");
  const avoidIntense = profile.riskSensitivities.includes("avoid intense");

  const foodJourney: PlanItem[] = [
    R(
      "Start meals with nam prik ong, seasonal steamed vegetables, and a palm-sized protein option. Keep sticky rice mindful rather than restrictive.",
      "Local northern food + portion awareness"
    ),
    wantsFermented
      ? R(
          "Try a small serving of local fermented food as a cultural food experience, while confirming comfort and preferences first.",
          "Fermented local food interest"
        )
      : R(
          "Use pickled vegetables or herbs as small side dishes for variety, not as a medical or therapeutic claim.",
          "Local food education"
        ),
    wantsHighProtein
      ? R(
          "Prioritize familiar protein options such as fish, chicken, eggs, tofu, or legumes at each main meal.",
          "Higher-protein preference"
        )
      : R("Include a moderate protein option at each main meal for satiety and balance."),
    wantsPlant
      ? R(
          "Add more local vegetables such as pumpkin, eggplant, morning glory, and seasonal greens with lighter cooking methods.",
          "Plant-forward preference"
        )
      : R("Aim for vegetables to take up about half the plate when possible."),
    avoidSpicy
      ? R(
          "Ask every host or restaurant for mild spice. Choose rounded northern flavors rather than very spicy dishes.",
          `Constraint: ${profile.healthConstraints}`
        )
      : R("Choose medium spice and share several dishes for variety and cultural context."),
    wantsSurprise
      ? R(
          "Add one surprise local meal selected by a verified host based on seasonal ingredients and stated food preferences.",
          "Surprise local food"
        )
      : R("Hydrate regularly and avoid over-scheduling meals around travel time."),
    R(
      "Nutrition guidance is general wellness support only. It does not diagnose, treat, cure, or replace professional dietary advice.",
      "Safety wording"
    ),
  ];

  const movementPlan: PlanItem[] = [
    R(
      "Walk in nature for 30-45 minutes at an easy conversational pace, using RPE 3-4/10.",
      `Fitness level: ${profile.fitnessLevel}`
    ),
    avoidIntense || (poorSleep && !isActive)
      ? R(
          "Skip high-intensity training today. Choose gentle stretching, mobility, or an easy walk instead.",
          poorSleep ? "Poor sleep — reduce intensity" : "User prefers avoiding intensity"
        )
      : wantsHyrox && (isActive || profile.fitnessLevel === "moderate")
      ? R(
          "Optional coach-led HYROX-style functional block for 12-20 minutes at RPE 5-6/10, stopping early if form or comfort drops.",
          "HYROX interest + moderate readiness"
        )
      : isActive
      ? R("Add a light strength circuit at RPE 5/10 if sleep and energy feel good.")
      : isBeginner
      ? R("Use short mobility breaks and easy walks around the accommodation.", "Beginner-friendly movement")
      : R("Use a short bodyweight circuit only if energy feels steady."),
    wantsTrail && !poorSleep
      ? R(
          "Trail preparation should stay light and weather-dependent. Confirm terrain, footwear, visibility, and rain before starting.",
          "Trail interest + safety check"
        )
      : R("Morning mobility: hips, upper back, calves, and easy breathing for 10 minutes."),
    wantsFun
      ? R(
          "Optional fun social sport for 20 minutes, kept playful rather than competitive.",
          "Fun social movement"
        )
      : R("Take an easy 8-10 minute walk after dinner if it feels comfortable."),
    wantsRecovery || stressed
      ? R(
          "Recovery session: foam rolling, gentle breathwork, and legs-up-the-wall for 20-30 minutes.",
          stressed ? `Stress ${profile.stressLevel}/10` : "Recovery preference"
        )
      : R("Keep a 5-minute mobility wind-down before bed."),
    R(
      "Movement guidance is general wellness support. Pain, dizziness, chest symptoms, or unusual discomfort should stop the session and prompt qualified help.",
      "Movement safety"
    ),
  ];

  const peacefulTravelRoute: PlanItem[] = [
    R(
      "Choui Fong tea fields before 08:00 for a quieter walk between tea rows and a slow tea ritual.",
      strongAvoidCrowds ? "Strong crowd avoidance" : "Low-crowd route"
    ),
    R(
      "Singha Park lake path for simple, flat, low-pressure movement and nature exposure.",
      "Nature + easy walking"
    ),
    R(
      "Slow-living cafe near the Kok River for reading, journaling, and a short digital-detox block.",
      profile.travelMoods.includes("digital detox") ? "Digital detox" : "Quiet pause"
    ),
    R(
      "Private hot-spring or warm-soak option only if comfortable and appropriate; avoid if symptoms, pregnancy, or medical caution applies.",
      "Recovery option + coach caution"
    ),
    R(
      "Old city morning walk before peak hours for quiet cultural context without crowd pressure.",
      "Historical + low-crowd"
    ),
    profile.travelMoods.includes("local village")
      ? R(
          "Community visit through a verified local guide, with respect for host consent, timing, and cultural boundaries.",
          "Local village interest"
        )
      : R("Kok River low-crowd walking route with flexible timing."),
    preferQuiet
      ? R("Avoid famous attractions at peak hours; use early morning or late afternoon windows.", "Privacy preference")
      : R("Use off-peak timing for popular places."),
  ];

  const localExperiences: PlanItem[] = [
    R(
      "Tai Lue home meal hosted by a local family through a verified network.",
      "Local food + community income"
    ),
    R(
      "Seasonal vegetable walk and cooking conversation with a local host, adjusted for weather and availability.",
      "Seasonal local context"
    ),
    R(
      "Private tea-garden cafe visit by appointment, chosen for low crowd density.",
      "Quiet/private preference"
    ),
    R(
      "Recovery walk and tea ceremony with a small local provider.",
      "Mental reset"
    ),
    R(
      "One flexible hidden gem selected after checking weather, traffic, and provider availability.",
      "Adaptive local routing"
    ),
  ];

  const coachNotes: PlanItem[] = [
    R(
      `Stress ${profile.stressLevel}/10 and sleep ${profile.sleepQuality}: coach should confirm a lighter starting load.`,
      "Stress + sleep flag"
    ),
    R(
      "Review food balance, spice level, allergies, and comfort with unfamiliar local foods.",
      "Food safety review"
    ),
    wantsHyrox
      ? R(
          "Before HYROX-style movement, use RPE, movement screening, and form checks. Keep intensity optional.",
          "Movement readiness"
        )
      : R("Confirm that walking and mobility volume fits current energy and travel fatigue."),
    R(
      "Confirm provider availability, transport time, weather backup, and crowd timing.",
      "Local availability check"
    ),
  ];

  const env: PlanItem[] = [];
  if (hasPM25 || profile.season === "hot" || profile.season === "late rainy / early winter") {
    env.push(
      R(
        "PM2.5 can vary by season in northern Thailand. Check local air quality before outdoor movement and move indoors if conditions are poor.",
        "Environmental planning check"
      )
    );
  }
  if (hasWaterRisk) {
    env.push(
      R(
        "Avoid water-based activities when water quality, rain, or river conditions are uncertain.",
        "Water-risk preference"
      )
    );
  }
  if (profile.season === "rainy" || profile.season === "late rainy / early winter") {
    env.push(
      R(
        "Rainy or late-rainy season needs indoor backups such as hotel gym mobility, cafe journaling, or coach-led recovery.",
        `Season: ${profile.season}`
      )
    );
  }
  if (profile.travelMoods.includes("nature recovery") || wantsTrail) {
    env.push(
      R(
        "Mountain and fog conditions should be checked before any higher-elevation route.",
        "Visibility safety"
      )
    );
  }
  if (strongAvoidCrowds) {
    env.push(
      R(
        "Use early morning or late afternoon windows for all popular spots.",
        "Strong crowd avoidance"
      )
    );
  }
  env.push(
    R(
      "These are planning considerations, not live verified data. Recheck conditions before travel.",
      "Transparency"
    )
  );

  const communityImpact: PlanItem[] = [
    R("Use one verified local guide per trip where possible.", "Local guide income"),
    R("Favor owner-operated restaurants and cafes for most meals.", "Small business support"),
    R("Include one community-hosted food experience when available.", "Direct community value"),
    R("Book local movement or recovery coaches for optional sessions.", "Local wellness jobs"),
    R("RaiWell Network reduces middlemen by matching travelers directly with vetted providers.", "Platform model"),
  ];

  const dailyNudges: PlanItem[] = [
    R("Get a few minutes of morning light after waking when weather allows."),
    R("Pause before meals and choose a comfortable portion rather than following strict diet rules."),
    R("Set a 30-minute phone-off window before bed.", poorSleep ? "Sleep support" : undefined),
    stressed
      ? R("Use three rounds of longer exhale breathing when stress feels high.", `Stress ${profile.stressLevel}/10`)
      : R("Take two slow sips of water before each main activity."),
    R("Take a short easy walk after dinner if it feels comfortable."),
  ];

  const personalizationFactors = [
    `Age ${profile.age}`,
    `Fitness ${profile.fitnessLevel}`,
    `Stress ${profile.stressLevel}/10`,
    `Sleep ${profile.sleepQuality}`,
    `Food ${profile.foodInterests.join(", ") || profile.foodPreference}`,
    `Budget ${profile.budget}`,
    `Season ${profile.season}`,
    `Privacy ${profile.privacyPreference}`,
    ...(profile.movementPreferences.length ? [`Movement ${profile.movementPreferences.join(", ")}`] : []),
    ...(profile.travelMoods.length ? [`Mood ${profile.travelMoods.join(", ")}`] : []),
    ...(profile.riskSensitivities.length ? [`Risk ${profile.riskSensitivities.join(", ")}`] : []),
    ...(profile.healthConstraints ? [`Constraints: ${profile.healthConstraints}`] : []),
  ];

  const reasoning = `This ${days}-day Chiang Rai wellness journey for ${profile.name || "the traveler"} is shaped by ${personalizationFactors.length} factors. Because stress is ${profile.stressLevel}/10 and sleep is ${profile.sleepQuality}, the plan starts with low-pressure movement, recovery space, quiet routes, and coach-reviewed intensity. Food recommendations focus on local culture, balance, spice preference, and portion awareness without medical claims. Movement uses RPE and readiness rather than fixed heart-rate targets. Environmental notes are planning checks for air quality, rain, water conditions, mountains, and crowds, and should be confirmed before travel.`;

  const summary = `A ${days}-day Chiang Rai wellness journey for ${profile.name || "you"} across Eat Well, Move Well, Rest Deeply, coach review, and local impact.`;

  return {
    summary,
    itinerary,
    foodJourney,
    movementPlan,
    peacefulTravelRoute,
    localExperiences,
    coachNotes,
    environmentalSafety: env,
    communityImpact,
    dailyNudges,
    reasoning,
    personalizationFactors,
  };
}
