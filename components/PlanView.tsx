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
                    <span className="reason-tag">⚙ ปรับเพื่อคุณ · {it.reason}</span>
                  </div>
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-wellness-100 bg-gradient-to-br from-wellness-50 via-white to-sky-50 p-5 sm:p-8 shadow-soft">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Pill>📍 เชียงราย</Pill>
              <Pill>🎯 {thGoal(profile.wellnessGoal)}</Pill>
              <Pill>🏃 {TH.fitnessLevel[profile.fitnessLevel]}</Pill>
              <Pill>🛏 นอน {TH.sleep[profile.sleepQuality]}</Pill>
              <Pill>😮‍💨 เครียด {profile.stressLevel}/10</Pill>
              <Pill>🤫 {TH.privacy[profile.privacyPreference]}</Pill>
              <Pill>🌦 {TH.season[profile.season]}</Pill>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
              ทริป Wellness ของ {profile.name || "คุณ"}
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
              ✓ Certified Coach + AI Validated
            </div>
          ) : (
            <div className="badge bg-amber-100 text-amber-800 text-sm shrink-0">รอการตรวจสอบจากโค้ช</div>
          )}
        </div>

        {plan.personalizationFactors && plan.personalizationFactors.length > 0 && (
          <div className="mt-5 pt-5 border-t border-wellness-100">
            <div className="text-[11px] font-semibold tracking-widest text-wellness-700/70">
              🧠 CHIANG RAI INTELLIGENCE LAYER · ปรับจาก {plan.personalizationFactors.length} ปัจจัย
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
        coach.addRecoverySession) ? (
        <div className="card bg-sky-50/50 border-sky-100">
          <div className="section-title">📝 บันทึกจากโค้ช</div>
          <ul className="mt-2 text-sm text-wellness-900/85 space-y-1.5">
            <li><strong>ความเข้มข้น:</strong> {TH.intensity[coach.intensity]}</li>
            {coach.approvedFoodPlan && <li><strong>✓ อนุมัติแผนอาหารแล้ว</strong></li>}
            {coach.mealPortionAdjustment && <li><strong>ปรับมื้อ:</strong> {coach.mealPortionAdjustment}</li>}
            {coach.addHyrox && <li><strong>+ เพิ่ม HYROX option</strong></li>}
            {coach.addRecoverySession && <li><strong>+ เพิ่ม Recovery session</strong></li>}
            {coach.hiddenGem && <li><strong>Hidden gem แนะนำ:</strong> {coach.hiddenGem}</li>}
            {coach.note && <li><strong>คำแนะนำ:</strong> {coach.note}</li>}
            {coach.safetyWarning && <li><strong>⚠ คำเตือนความปลอดภัย:</strong> {coach.safetyWarning}</li>}
          </ul>
        </div>
      ) : null}

      {/* Itinerary */}
      <section>
        <div className="section-title mb-3">📅 ตารางทริปแบบวันต่อวัน</div>
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
                  <div className="text-xs font-semibold text-wellness-700">🌅 เช้า</div>
                  <div className="mt-0.5">{d.morning}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wellness-700">☀️ บ่าย</div>
                  <div className="mt-0.5">{d.afternoon}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-wellness-700">🌙 เย็น</div>
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
          title="🧑‍⚕️ Coach Notes (AI suggestions)"
          badge="ตรวจสอบโดยโค้ช"
          items={plan.coachNotes}
        />
        <ListCard
          title="🛡 Environmental & Safety Considerations"
          badge="ข้อพิจารณาวางแผน"
          items={plan.environmentalSafety}
        />
        <ListCard
          title="🤝 Community Impact"
          badge="LOCAL IMPACT"
          items={plan.communityImpact}
        />
      </section>

      {/* Daily nudges */}
      <section>
        <ListCard title="✨ Daily Nudges" items={plan.dailyNudges} />
      </section>

      {/* Reasoning */}
      <section className="card bg-gradient-to-br from-wellness-50 to-white">
        <div className="section-title">🤖 ทำไม AI เลือกแผนนี้ให้คุณ</div>
        <p className="mt-2 text-sm text-wellness-900/85 leading-relaxed">{plan.reasoning}</p>
      </section>

      {/* Medical safety disclaimer */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
        <strong>⚠ ข้อจำกัดความรับผิดชอบ:</strong> RaiWell AI ไม่ใช่เครื่องมือวินิจฉัยทางการแพทย์
        เป็นการสนับสนุนการวางแผนไลฟ์สไตล์และสุขภาพทั่วไป — หากมีโรคประจำตัว ยา การตั้งครรภ์
        ประวัติ eating disorder หรือคำแนะนำจากแพทย์ <strong>คำแนะนำของแพทย์มาก่อนเสมอ</strong>
      </section>
    </div>
  );
}
