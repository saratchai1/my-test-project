"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { demoUser, emptyUser } from "@/lib/demoUser";
import { store } from "@/lib/storage";
import { TH } from "@/lib/labels";
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
  UserProfile,
  WellnessGoal,
} from "@/lib/types";

const TRAVEL_DURATIONS: TravelDuration[] = ["1 day", "2 days", "3 days"];
const GOALS: WellnessGoal[] = [
  "stress recovery",
  "better sleep",
  "weight management",
  "healthy lifestyle reset",
  "active fitness trip",
  "stress recovery and better sleep",
  "stress recovery, better sleep, and healthier lifestyle reset",
];
const FITNESS_LEVELS: FitnessLevel[] = ["beginner", "moderate", "active"];
const FOODS: FoodPreference[] = [
  "normal",
  "vegetarian",
  "high protein",
  "low sugar",
  "local healthy Thai food",
];
const SLEEP_QUALITY: SleepQuality[] = ["poor", "average", "good"];
const BUDGETS: Budget[] = ["low", "medium", "medium-premium", "premium"];
const TRAVEL_STYLES: TravelStyle[] = [
  "nature",
  "cafe",
  "temple",
  "walking",
  "slow living",
  "active adventure",
];

const FOOD_INTERESTS: FoodInterest[] = [
  "local northern food",
  "high protein",
  "plant-forward",
  "low sugar",
  "fermented/local probiotic",
  "chef/coach curated",
  "surprise local food",
];
const MOVEMENT_PREFS: MovementPreference[] = [
  "light walking",
  "mobility/stretching",
  "gym training",
  "HYROX-style",
  "trail running",
  "natural movement",
  "fun social sport",
  "recovery session",
];
const TRAVEL_MOODS: TravelMood[] = [
  "quiet/private",
  "nature recovery",
  "local village",
  "slow living cafe",
  "historical/cultural",
  "digital detox",
  "hidden gem",
  "low-crowd route",
];
const PRIVACY_PREFS: PrivacyPreference[] = [
  "ok with popular",
  "prefer quiet",
  "strongly avoid crowds",
];
const SEASONS: Season[] = ["rainy", "late rainy / early winter", "winter", "hot", "not sure"];
const RISKS: RiskSensitivity[] = [
  "avoid PM2.5",
  "avoid water risk",
  "avoid crowds",
  "avoid intense",
  "medical/nutrition caution",
];

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="card">Loading...</div>}>
      <IntakeInner />
    </Suspense>
  );
}

function IntakeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [profile, setProfile] = useState<UserProfile>(emptyUser);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = store.getProfile();
    if (params.get("demo") === "1") {
      setProfile(demoUser);
      return;
    }
    if (stored) {
      // Merge stored with emptyUser to handle older localStorage missing new fields
      setProfile({ ...emptyUser, ...stored });
    }
  }, [params]);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function toggle<T>(key: keyof UserProfile, val: T) {
    setProfile((p) => {
      const arr = (p[key] as unknown as T[]) ?? [];
      const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
      return { ...p, [key]: next as never };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    store.setProfile(profile);
    // Clear old plan + coach so new submission generates fresh
    store.clearPlan();
    store.clearCoach();
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profile),
      });
      const plan = await res.json();
      store.setPlan(plan);
      router.push("/plan");
    } catch {
      router.push("/plan");
    } finally {
      setSubmitting(false);
    }
  }

  function ChipGroup<T extends string>({
    options,
    selected,
    onToggle,
    labelMap,
  }: {
    options: T[];
    selected: T[];
    onToggle: (v: T) => void;
    labelMap: Record<T, string>;
  }) {
    return (
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`chip cursor-pointer ${
              selected.includes(o) ? "!bg-wellness-600 !text-white !border-wellness-600" : ""
            }`}
          >
            {labelMap[o]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Your wellness profile</h1>
            <p className="text-sm text-wellness-700/80 mt-1">
              RaiWell uses these inputs to design a Chiang Rai journey across Eat Well, Move Well, and Rest Deeply.
            </p>
          </div>
          <button type="button" className="btn-secondary !py-2 !px-4" onClick={() => setProfile(demoUser)}>
            Load Demo User
          </button>
        </div>

        {/* Section: Basic */}
        <fieldset className="space-y-4">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            Basic profile
          </legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Example: Maya"
                required
              />
            </div>
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                min={16}
                max={90}
                className="input"
                value={profile.age}
                onChange={(e) => update("age", Number(e.target.value || 0))}
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Travel duration</label>
              <select
                className="input"
                value={profile.travelDuration}
                onChange={(e) => update("travelDuration", e.target.value as TravelDuration)}
              >
                {TRAVEL_DURATIONS.map((t) => (
                  <option key={t} value={t}>{TH.travelDuration[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Wellness goal</label>
              <select
                className="input"
                value={profile.wellnessGoal}
                onChange={(e) => update("wellnessGoal", e.target.value as WellnessGoal)}
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>{TH.goal[g] ?? g}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Section: Body */}
        <fieldset className="space-y-4 pt-2 border-t border-wellness-100">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            Body readiness and sleep
          </legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fitness level</label>
              <ChipGroup
                options={FITNESS_LEVELS}
                selected={[profile.fitnessLevel]}
                onToggle={(v) => update("fitnessLevel", v as FitnessLevel)}
                labelMap={TH.fitnessLevel}
              />
            </div>
            <div>
              <label className="label">Sleep quality</label>
              <ChipGroup
                options={SLEEP_QUALITY}
                selected={[profile.sleepQuality]}
                onToggle={(v) => update("sleepQuality", v as SleepQuality)}
                labelMap={TH.sleep}
              />
            </div>
          </div>
          <div>
            <label className="label">
              Stress level: <span className="text-wellness-600">{profile.stressLevel}/10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={profile.stressLevel}
              onChange={(e) => update("stressLevel", Number(e.target.value))}
              className="w-full accent-wellness-600"
            />
          </div>
          <div>
            <label className="label">Health constraints / allergies / professional cautions</label>
            <input
              className="input"
              value={profile.healthConstraints}
              onChange={(e) => update("healthConstraints", e.target.value)}
              placeholder="Example: avoids very spicy food, nut allergy, medication, professional advice"
            />
          </div>
        </fieldset>

        {/* Section: Eat Well */}
        <fieldset className="space-y-4 pt-2 border-t border-wellness-100">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            EAT WELL — food interests
          </legend>
          <div>
            <label className="label">Main food preference</label>
            <select
              className="input"
              value={profile.foodPreference}
              onChange={(e) => update("foodPreference", e.target.value as FoodPreference)}
            >
              {FOODS.map((f) => (
                <option key={f} value={f}>{TH.food[f]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Local food interests (select multiple)</label>
            <ChipGroup
              options={FOOD_INTERESTS}
              selected={profile.foodInterests}
              onToggle={(v) => toggle("foodInterests", v)}
              labelMap={TH.foodInterest}
            />
          </div>
        </fieldset>

        {/* Section: Move Well */}
        <fieldset className="space-y-4 pt-2 border-t border-wellness-100">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            MOVE WELL — movement preferences
          </legend>
          <div>
            <label className="label">Movement styles (select multiple)</label>
            <ChipGroup
              options={MOVEMENT_PREFS}
              selected={profile.movementPreferences}
              onToggle={(v) => toggle("movementPreferences", v)}
              labelMap={TH.movement}
            />
          </div>
        </fieldset>

        {/* Section: Rest Deeply / Travel */}
        <fieldset className="space-y-4 pt-2 border-t border-wellness-100">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            REST DEEPLY — peaceful travel style
          </legend>
          <div>
            <label className="label">Trip mood (select multiple)</label>
            <ChipGroup
              options={TRAVEL_MOODS}
              selected={profile.travelMoods}
              onToggle={(v) => toggle("travelMoods", v)}
              labelMap={TH.travelMood}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Crowd preference</label>
              <ChipGroup
                options={PRIVACY_PREFS}
                selected={[profile.privacyPreference]}
                onToggle={(v) => update("privacyPreference", v as PrivacyPreference)}
                labelMap={TH.privacy}
              />
            </div>
            <div>
              <label className="label">Travel season</label>
              <select
                className="input"
                value={profile.season}
                onChange={(e) => update("season", e.target.value as Season)}
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{TH.season[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Additional travel style</label>
            <ChipGroup
              options={TRAVEL_STYLES}
              selected={profile.travelStyle}
              onToggle={(v) => toggle("travelStyle", v)}
              labelMap={TH.travelStyle}
            />
          </div>
        </fieldset>

        {/* Section: Risk + Budget */}
        <fieldset className="space-y-4 pt-2 border-t border-wellness-100">
          <legend className="text-xs tracking-widest font-semibold text-wellness-700">
            Risk preferences and budget
          </legend>
          <div>
            <label className="label">Risks to avoid (select multiple)</label>
            <ChipGroup
              options={RISKS}
              selected={profile.riskSensitivities}
              onToggle={(v) => toggle("riskSensitivities", v)}
              labelMap={TH.risk}
            />
          </div>
          <div>
            <label className="label">Budget</label>
            <ChipGroup
              options={BUDGETS}
              selected={[profile.budget]}
              onToggle={(v) => update("budget", v as Budget)}
              labelMap={TH.budget}
            />
          </div>
        </fieldset>

        <div className="pt-4 flex gap-3 flex-wrap border-t border-wellness-100">
          <button className="btn-primary text-base" disabled={submitting}>
            {submitting ? "Generating your plan..." : "Generate AI wellness plan"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setProfile(emptyUser)}>
            Reset
          </button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="card">
          <div className="badge bg-wellness-100 text-wellness-700">Demo profile</div>
          <h3 className="mt-2 font-semibold">Maya · 35 · Bangkok</h3>
          <p className="text-sm text-wellness-900/80 mt-2 leading-relaxed">
            A stressed office worker with poor sleep who wants a 2-day Chiang Rai reset.
            She likes mild northern food, quiet places, walking, and HYROX-style functional movement.
          </p>
          <button className="btn-secondary mt-3 w-full" onClick={() => setProfile(demoUser)}>
            Load Maya
          </button>
        </div>
        <div className="card bg-wellness-50/60">
          <div className="section-title text-base">RaiWell pillars</div>
          <ul className="mt-2 text-sm text-wellness-900/80 space-y-1.5 list-disc pl-4">
            <li><strong>Eat Well</strong> — local food context, balance, portion awareness</li>
            <li><strong>Move Well</strong> — walking, mobility, Coach Roi-led optional training validation</li>
            <li><strong>Rest Deeply</strong> — quiet routes, recovery, low-crowd travel</li>
            <li><strong>Coach Roi Validated</strong> — single-coach human-in-the-loop review</li>
            <li><strong>Local Impact</strong> — matched local providers</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
