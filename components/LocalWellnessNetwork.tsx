"use client";

import type { UserProfile, WellnessPlan } from "@/lib/types";

export default function LocalWellnessNetwork({
  plan,
}: {
  profile: UserProfile;
  plan: WellnessPlan;
}) {
  const networkItems = plan.localWellnessNetwork ?? [];

  return (
    <section className="card border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="badge bg-emerald-100 text-emerald-800">LOCAL WELLNESS NETWORK</div>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">Coach Roi + local support options</h2>
          <p className="text-sm text-wellness-700/85 mt-1 max-w-2xl leading-relaxed">
            Coach Roi is the only coach currently in the RaiWell demo. He validates movement intensity,
            HYROX-inspired functional training, readiness, warm-up, cooldown, and recovery needs. Other entries
            are local places or support options, not coaches.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {networkItems.map((item) => (
          <div key={item.text} className="rounded-2xl border border-wellness-100 bg-white p-4 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold tracking-widest text-emerald-700">
                  {item.href ? "COACH" : "LOCAL OPTION"}
                </div>
                <div className="mt-1 font-semibold text-sm leading-snug">{item.text}</div>
              </div>
              <span className="badge bg-wellness-100 text-wellness-800">
                {item.href ? "verified" : "support"}
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-[11px] leading-relaxed text-emerald-900">
              <strong>Role:</strong> {item.reason}
            </div>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-full border border-wellness-200 bg-white px-3 py-1.5 text-xs font-semibold text-wellness-700 hover:bg-wellness-50"
              >
                {item.hrefLabel ?? "View profile"}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-white border border-emerald-100 p-3 text-xs text-emerald-900 leading-relaxed">
        <strong>Next version:</strong> verified local places, booking handoff, Coach Roi-approved substitutions,
        and transparent community revenue tracking.
      </div>
    </section>
  );
}
