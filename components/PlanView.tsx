"use client";

import { TH, thGoal } from "@/lib/labels";
import type { CoachReview, PlanItem, UserProfile, WellnessPlan } from "@/lib/types";

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

function asItem(it: string | PlanItem): PlanItem {
  return typeof it === "string" ? { text: it } : it;
}

function ListCard({
  title,
  badge,
  items,
  accentClass,
}: {
  title: string;
  badge?: string;
  items: (string | PlanItem)[];
  accentClass?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`card ${accentClass ?? ""}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="section-title">{title}</div>
        {badge && <span className="badge bg-wellness-100 text-wellness-700 text-[10px]">{badge}</span>}
      </div>
      <ul className="mt-3 space-y-3 text-sm text-wellness-900/85">
        {items.map((raw, i) => {
          const it = asItem(raw);
          return (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
              <div className="flex-1">
                <div>{it.text}</div>
                {it.reason && (
                  <div className="mt-1.5">
                    <span className="reason-tag">Why this fits · {it.reason}</span>
                  </div>
                )}
                {it.href && (
                  <a
                    href={it.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex rounded-full border border-wellness-200 bg-white px-3 py-1 text-xs font-semibold text-wellness-700 hover:bg-wellness-50"
                  >
                    {it.hrefLabel ?? "View profile"}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PillarBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function PlanView({
  profile,
  plan,
  coach,
}: {
  profile: UserProfile;
  plan: WellnessPlan;
  coach: CoachReview | null;
}) {
  const userFactors = [
    `Goal: ${thGoal(profile.wellnessGoal)}`,
    `Fitness: ${TH.fitnessLevel[profile.fitnessLevel]}`,
    `Sleep: ${TH.sleep[profile.sleepQuality]}`,
    `Stress: ${profile.stressLevel}/10`,
    `Food: ${profile.foodPreference}`,
    `Privacy: ${TH.privacy[profile.privacyPreference]}`,
  ];
  const localFactors = [
    `Pilot location: Chiang Rai`,
    `Season: ${TH.season[profile.season]}`,
    `Travel style: ${profile.travelStyle.map((s) => TH.travelStyle[s]).join(", ")}`,
    `Mood: ${profile.travelMoods.map((m) => TH.travelMood[m]).join(", ")}`,
    `Budget: ${TH.budget[profile.budget]}`,
  ];
  const safetyChecks = [
    ...(profile.riskSensitivities.length ? profile.riskSensitivities.map((r) => TH.risk[r]) : ["No special risk preference selected"]),
    "Use RPE and readiness checks instead of fixed performance targets",
    "Treat environmental notes as planning checks, not live verified data",
  ];
  const coachReviewItems = [
    "Food balance and spice/allergy fit",
    "Movement intensity and recovery load",
    "Provider availability and local safety conditions",
    "Any symptoms or medical concerns before travel",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-wellness-100 bg-gradient-to-br from-wellness-50 via-white to-sky-50 p-5 sm:p-8 shadow-soft">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Pill>Chiang Rai</Pill>
              <Pill>🎯 {thGoal(profile.wellnessGoal)}</Pill>
              <Pill>🏃 {TH.fitnessLevel[profile.fitnessLevel]}</Pill>
              <Pill>Sleep: {TH.sleep[profile.sleepQuality]}</Pill>
              <Pill>Stress: {profile.stressLevel}/10</Pill>
              <Pill>🤫 {TH.privacy[profile.privacyPreference]}</Pill>
              <Pill>🌦 {TH.season[profile.season]}</Pill>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
              {profile.name || "Your"}'s wellness journey
            </h1>
            <p className="mt-2 text-wellness-900/80 max-w-2xl leading-relaxed">{plan.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <PillarBadge icon="🍃" label="Eat Well" color="bg-wellness-100 text-wellness-800" />
              <PillarBadge icon="🏃" label="Move Well" color="bg-sky-100 text-sky-700" />
              <PillarBadge icon="🌙" label="Rest Deeply" color="bg-amber-100 text-amber-800" />
              <PillarBadge icon="🤝" label="Local Impact" color="bg-emerald-100 text-emerald-800" />
            </div>
          </div>
          {coach?.validated ? (
            <div className="badge bg-wellness-600 text-white shadow-soft text-sm shrink-0">
              ✓ Coach Roi + AI Validated
            </div>
          ) : (
            <div className="badge bg-amber-100 text-amber-800 text-sm shrink-0">Coach Roi review pending</div>
          )}
        </div>

        {(plan.planType || plan.riskLevel) && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plan.planType && (
              <div className="rounded-2xl border border-wellness-100 bg-white p-3">
                <div className="text-[10px] font-semibold tracking-widest text-wellness-700/70">PLAN TYPE</div>
                <div className="mt-1 text-sm font-semibold text-wellness-900">{plan.planType.replaceAll("_", " ")}</div>
              </div>
            )}
            {plan.riskLevel && (
              <div className="rounded-2xl border border-amber-100 bg-white p-3">
                <div className="text-[10px] font-semibold tracking-widest text-amber-700/70">RISK LEVEL</div>
                <div className="mt-1 text-sm font-semibold text-wellness-900">{plan.riskLevel}</div>
              </div>
            )}
          </div>
        )}

        {plan.personalizationFactors && plan.personalizationFactors.length > 0 && (
          <div className="mt-5 pt-5 border-t border-wellness-100">
            <div className="text-[11px] font-semibold tracking-widest text-wellness-700/70">
              CHIANG RAI INTELLIGENCE LAYER · {plan.personalizationFactors.length} personalization factors
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {plan.personalizationFactors.map((f, i) => (
                <span
                  key={i}
                  className="text-[11px] rounded-md bg-white border border-wellness-200 px-2 py-0.5 text-wellness-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Coach annotations summary */}
      {coach &&
      (coach.note ||
        coach.mealPortionAdjustment ||
        coach.safetyWarning ||
        coach.hiddenGem ||
        coach.addHyrox ||
        coach.addRecoverySession ||
        coach.addPm25Fallback ||
        coach.markNeedsVerification) ? (
        <div className="card bg-sky-50/50 border-sky-100">
          <div className="section-title">Coach Roi notes</div>
          <ul className="mt-2 text-sm text-wellness-900/85 space-y-1.5">
            <li><strong>Intensity:</strong> {TH.intensity[coach.intensity]}</li>
            {coach.approvedFoodPlan && <li><strong>Food plan reviewed</strong></li>}
            {coach.mealPortionAdjustment && <li><strong>Meal adjustment:</strong> {coach.mealPortionAdjustment}</li>}
            {coach.addHyrox && <li><strong>+ HYROX-style option</strong></li>}
            {coach.addRecoverySession && <li><strong>+ Recovery session</strong></li>}
            {coach.addPm25Fallback && <li><strong>+ PM2.5 indoor fallback</strong></li>}
            {coach.markNeedsVerification && <li><strong>Needs local verification before booking</strong></li>}
            {coach.hiddenGem && <li><strong>Suggested hidden gem:</strong> {coach.hiddenGem}</li>}
            {coach.note && <li><strong>Coach Roi note:</strong> {coach.note}</li>}
            {coach.safetyWarning && <li><strong>Safety note:</strong> {coach.safetyWarning}</li>}
          </ul>
        </div>
      ) : null}

      <section className="card border-sky-200 bg-gradient-to-br from-sky-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="section-title">Why this recommendation?</div>
          <span className="badge bg-sky-100 text-sky-700">Explainable AI demo</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {[
            ["User factors used", userFactors],
            ["Local/context factors used", localFactors],
            ["Safety checks", safetyChecks],
            ["Coach Roi review needed", coachReviewItems],
          ].map(([title, items]) => (
            <div key={title as string} className="rounded-2xl border border-sky-100 bg-white p-4">
              <div className="text-xs font-semibold tracking-widest text-sky-700">{title as string}</div>
              <ul className="mt-2 space-y-1.5 text-xs text-wellness-900/80">
                {(items as string[]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section>
        <div className="section-title mb-3">Day-by-day itinerary</div>
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          {plan.itinerary.map((d, i) => (
            <div key={i} className="card">
              <div className="text-xs text-wellness-600 font-semibold tracking-widest">
                {d.day.split("—")[0]?.trim()}
              </div>
              <div className="text-base font-semibold mt-1">
                {d.day.includes("—") ? d.day.split("—").slice(1).join("—").trim() : d.day}
              </div>
              <div className="mt-3 space-y-3 text-sm text-wellness-900/85">
                <div>
                  <div className="text-xs font-semibold text-wellness-700">Morning</div>
                  <div className="mt-0.5">{d.morning}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wellness-700">Afternoon</div>
                  <div className="mt-0.5">{d.afternoon}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wellness-700">Evening</div>
                  <div className="mt-0.5">{d.evening}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three pillar sections */}
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <ListCard
          title="🍃 Food Journey"
          badge="EAT WELL"
          items={plan.foodJourney}
        />
        <ListCard
          title="🏃 Movement Plan"
          badge="MOVE WELL"
          items={plan.movementPlan}
        />
        <ListCard
          title="🌙 Peaceful Travel Route"
          badge="REST DEEPLY"
          items={plan.peacefulTravelRoute}
        />
      </section>

      {/* Local + safety + community */}
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ListCard
          title="💎 Local Experience / Hidden Gem"
          items={plan.localExperiences}
        />
        <ListCard
          title="Coach Roi Notes (AI suggestions)"
          badge="Coach Roi review"
          items={plan.coachNotes}
        />
        <ListCard
          title="🛡 Environmental & Safety Considerations"
          badge="planning checks"
          items={plan.environmentalSafety}
        />
        <ListCard
          title="🤝 Community Impact"
          badge="LOCAL IMPACT"
          items={plan.communityImpact}
        />
        {plan.localWellnessNetwork && (
          <ListCard
            title="Local Wellness Network"
            badge="KB providers"
            items={plan.localWellnessNetwork}
          />
        )}
      </section>

      {/* Daily nudges */}
      <section>
        <ListCard title="✨ Daily Nudges" items={plan.dailyNudges} />
      </section>

      {/* Reasoning */}
      <section className="card bg-gradient-to-br from-wellness-50 to-white">
        <div className="section-title">AI reasoning</div>
        <p className="mt-2 text-sm text-wellness-900/85 leading-relaxed">{plan.reasoning}</p>
      </section>

      {/* Medical safety disclaimer */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
        <strong>Safety disclaimer:</strong> RaiWell AI is not a medical diagnosis tool. It supports general
        lifestyle and wellness planning only. If users have medical symptoms, medications, pregnancy, eating
        disorder history, or clinical advice from a qualified professional, professional guidance comes first.
        Movement and nutrition suggestions should be reviewed by Coach Roi during this MVP demo. This does not replace
        qualified healthcare professionals when symptoms or medical concerns appear.
      </section>
    </div>
  );
}
