import type { PlanItem, UserProfile, WellnessPlan } from "./types";

function dayCount(d: UserProfile["travelDuration"]): number {
  if (d === "1 day") return 1;
  if (d === "3 days") return 3;
  return 2;
}

function R(text: string, reason?: string, href?: string, hrefLabel?: string): PlanItem {
  return { text, ...(reason ? { reason } : {}), ...(href ? { href, hrefLabel } : {}) };
}

const ALL_DAYS = [
  {
    day: "Day 1 — Arrival and nervous-system reset",
    morning:
      "Easy arrival walk around Singha Park lake for 30-45 minutes at a conversational pace, followed by slow breathing and a quiet tea break.",
    afternoon:
      "Coach Roi-reviewed local northern lunch pattern at Ma Long Der or Lu Lum: mild spice, protein + vegetables + mindful sticky-rice portion. Rest for one hour at Horizon Cafe or another quiet cafe near the Kok River.",
    evening:
      "Gentle mobility flow for 15-20 minutes, warm foot soak if appropriate, screen-light wind-down, and a 22:00 sleep window.",
  },
  {
    day: "Day 2 — Calm movement and local culture",
    morning:
      "If outdoor conditions are suitable, visit Choui Fong tea fields before 08:00 to avoid crowds. If PM2.5, rain, or readiness suggests an indoor option, use coach-led HYROX-inspired functional training at Le Méridien Chiang Rai Fitness, scaled to RPE 5-6/10 with Coach Roi review.",
    afternoon:
      "Tai Lue or Akha-inspired local experience such as Hak Akha, Ban Lorcha, or Ban Pang Ha only with booking verification. If trails are safe, add a short nature recovery walk near Khun Korn; otherwise choose cafe or spa recovery.",
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
  const recoveryFirst = profile.stressLevel >= 8 || poorSleep || avoidIntense;

  const foodJourney: PlanItem[] = [
    R(
      "Coach Roi should choose actual dishes from local northern restaurants such as Ma Long Der, Lu Lum, Bhirom/Singha Park, or Phu Lae Pier based on spice, sodium, oil, and protein fit.",
      "Food database + Coach Roi review"
    ),
    R(
      "Use the pattern: mild northern flavors + protein option + vegetables/herbs + mindful sticky-rice portion + less-sweet drink.",
      "Northern food high-protein mild-spice pattern"
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
          "Use mobility, stretching, breathing, and light walking as the default. Do not use HIIT, long trail runs, or competition-style training while sleep/stress signals are poor.",
          poorSleep ? "Recovery-first rule" : "User prefers avoiding intensity"
        )
      : wantsHyrox && (isActive || profile.fitnessLevel === "moderate")
      ? R(
          "Coach-led HYROX-inspired functional training at Le Méridien Chiang Rai Fitness for 30-45 minutes. For Maya-style readiness, use a scaled version capped at moderate intensity, RPE 5-6/10, with Coach Roi review, warm-up, screening, cooldown, and hydration.",
          "Coach-confirmed indoor movement option"
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
      "Choui Fong tea fields before 08:00 for a quieter walk between tea rows and a slow tea ritual. Skip or shorten this if PM2.5 is elevated.",
      strongAvoidCrowds ? "Strong crowd avoidance" : "Low-crowd route"
    ),
    R(
      "Singha Park lake path for simple, flat, low-pressure movement and nature exposure.",
      "Nature + easy walking"
    ),
    R(
      "Quiet cafe recovery route: Horizon Cafe, Treeside, Gravity, Wood Lover, Agape, or Ing Doi, selected after checking crowd level and indoor/semi-indoor seating.",
      profile.travelMoods.includes("digital detox") ? "Digital detox + cafe KB" : "Quiet pause + cafe KB"
    ),
    R(
      "Private hot-spring or warm-soak option only if comfortable and appropriate; avoid if symptoms, pregnancy, or medical caution applies.",
      "Recovery option + Coach Roi caution"
    ),
    R(
      "Old city morning walk before peak hours for quiet cultural context without crowd pressure.",
      "Historical + low-crowd"
    ),
    profile.travelMoods.includes("local village")
      ? R(
          "Community visit through a verified local guide: Hak Akha, Ban Lorcha, Ban Pang Ha, Sridonchai Tai Lue, Chiang Saen CBT, or Pha Mi coffee/farming route after booking checks.",
          "Local village interest"
        )
      : R("Kok River low-crowd walking route with flexible timing."),
    preferQuiet
      ? R("Avoid famous attractions at peak hours; use early morning or late afternoon windows.", "Privacy preference")
      : R("Use off-peak timing for popular places."),
  ];

  const localExperiences: PlanItem[] = [
    R(
      "Tai Lue / Akha / community-hosted experience after booking verification, chosen from Hak Akha, Ban Lorcha, Ban Pang Ha, Sridonchai Tai Lue, Chiang Saen CBT, or Pha Mi route.",
      "Community hidden gem database"
    ),
    R(
      "Seasonal vegetable walk and cooking conversation with a local host, adjusted for weather and availability.",
      "Seasonal local context"
    ),
    R(
      "Quiet cafe hidden gem candidate such as Wood Lover, Agape, Ing Doi, Treeside, or Gravity, selected by low-crowd timing rather than photos alone.",
      "Quiet/private preference"
    ),
    R(
      "Recovery walk and tea ceremony with a small local provider.",
      "Mental reset"
    ),
    R(
      "One flexible hidden gem selected after checking weather, traffic, current operation, booking need, group size, and language support.",
      "Adaptive local routing"
    ),
  ];

  const coachNotes: PlanItem[] = [
    R(
      `Stress ${profile.stressLevel}/10 and sleep ${profile.sleepQuality}: Coach Roi should confirm a lighter starting load.`,
      "Stress + sleep flag"
    ),
    R(
      "Review food balance, spice level, allergies, and comfort with unfamiliar local foods.",
      "Food safety review"
    ),
    wantsHyrox
      ? R(
          "Before HYROX-inspired functional training at Le Méridien Chiang Rai Fitness, Coach Roi should confirm readiness, scaling, warm-up, cooldown, hydration, and recovery needs. Do not present this as official HYROX training.",
          "Coach Roi confirmation + safety wording"
        )
      : R("Confirm that walking and mobility volume fits current energy and travel fatigue."),
    R(
      "Confirm route feasibility: do not combine long waterfall trail, intense training, too many destinations, or late-night itinerary on the same recovery-first day.",
      "Route feasibility check"
    ),
  ];

  const env: PlanItem[] = [];
  if (hasPM25 || profile.season === "hot" || profile.season === "late rainy / early winter") {
    env.push(
      R(
        "PM2.5 can vary by season in northern Thailand. Check local air quality before outdoor movement; if elevated, use Le Méridien Chiang Rai Fitness for indoor mobility or scaled Coach Roi-reviewed training.",
        "PM2.5 fallback rule"
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
        "Rainy or late-rainy season needs indoor backups: Le Méridien Chiang Rai Fitness, hotel gym mobility, quiet cafe journaling, spa recovery, or indoor cultural stop.",
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
    R("Use one verified local guide or community host per trip where possible.", "Local guide/community income"),
    R("Favor owner-operated restaurants and cafes such as local northern food stops and quiet cafe recovery routes.", "Small business support"),
    R("Include one community-hosted food or cultural learning experience when available and verified.", "Direct community value"),
    R("Use Coach Roi as the single coach validator for movement scaling, recovery load, and readiness checks.", "Coach Roi validation"),
    R("RaiWell Network reduces middlemen by matching travelers directly with vetted providers.", "Platform model"),
  ];

  const dailyNudges: PlanItem[] = [
    hasPM25 ? R("Check PM2.5 before outdoor movement; move indoors if air quality is not suitable.", "PM2.5 daily nudge") : undefined,
    R("Get a few minutes of morning light after waking when weather allows."),
    R("Pause before meals and choose a comfortable portion rather than following strict diet rules."),
    R("Set a 30-minute phone-off window before bed.", poorSleep ? "Sleep support" : undefined),
    stressed
      ? R("Use three rounds of longer exhale breathing when stress feels high.", `Stress ${profile.stressLevel}/10`)
      : R("Take two slow sips of water before each main activity."),
    R("Take a short easy walk after dinner if it feels comfortable."),
  ].filter(Boolean) as PlanItem[];

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

  const reasoning = `This ${days}-day Chiang Rai wellness journey for ${profile.name || "the traveler"} is shaped by ${personalizationFactors.length} factors. Because stress is ${profile.stressLevel}/10 and sleep is ${profile.sleepQuality}, the plan starts with recovery-first logic: low-pressure movement, fewer stops, quiet routes, and Coach Roi-reviewed intensity before performance. Food recommendations follow local northern food patterns, balance, spice preference, protein, vegetables, and portion awareness without medical claims. Movement uses RPE and readiness rather than fixed heart-rate targets. Environmental notes are planning checks for PM2.5, rain, water conditions, mountains, crowds, and booking feasibility.`;

  const summary = `A ${days}-day Chiang Rai wellness journey for ${profile.name || "you"} across Eat Well, Move Well, Rest Deeply, Coach Roi review, and local impact.`;

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
    generationSource: "mock",
    planType: recoveryFirst ? "recovery_first" : "balanced_reset",
    riskLevel: profile.stressLevel >= 8 || poorSleep || hasPM25 || hasWaterRisk ? "medium" : "low",
    missingInfoToVerify: [
      "Current opening hours and booking slots",
      "Crowd level and quiet seating",
      "Specific menu/spice/protein fit",
      "Trail, rain, water, and PM2.5 conditions",
    ],
    localWellnessNetwork: [
      R(
        "Coach Roi · certified fitness and nutrition coach for movement scaling and wellness validation",
        "Only coach in this MVP; validates intensity, readiness, warm-up, cooldown, food balance, and safety boundaries",
        "https://raiwellteamprofile.netlify.app/coach-roi-profile",
        "View Coach Roi profile"
      ),
      R(
        "Le Méridien Chiang Rai Fitness · indoor movement location",
        "Coach Roi-confirmed facility for gym-based exercise and HYROX-inspired functional training"
      ),
      R(
        "Local food/cafe/community/spa support options",
        "Local support options, not coaches; Coach Roi should verify fit before booking"
      ),
    ],
  };
}
