"use client";

import { matchProviders } from "@/lib/providers";
import type { Provider } from "@/lib/providers";
import type { UserProfile, WellnessPlan } from "@/lib/types";

function typeLabel(type: Provider["type"]) {
  return type
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function AvailabilityPill({ status }: { status: Provider["availabilityStatus"] }) {
  const color =
    status === "available"
      ? "bg-wellness-100 text-wellness-800"
      : status === "limited"
      ? "bg-amber-100 text-amber-800"
      : "bg-sky-100 text-sky-700";
  return <span className={`badge ${color}`}>{status}</span>;
}

export default function LocalWellnessNetwork({
  profile,
  plan,
}: {
  profile: UserProfile;
  plan: WellnessPlan;
}) {
  const providers = matchProviders(profile, plan);

  return (
    <section className="card border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="badge bg-emerald-100 text-emerald-800">LOCAL WELLNESS NETWORK</div>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">Matched Chiang Rai providers</h2>
          <p className="text-sm text-wellness-700/85 mt-1 max-w-2xl leading-relaxed">
            RaiWell connects the plan to local guides, food hosts, movement coaches, recovery practitioners,
            quiet cafes, and wellness-friendly stays. This is a mock dataset for the MVP, designed to show how
            community-based wellness tourism can reduce middlemen and route value to local providers.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <div key={provider.name} className="rounded-2xl border border-wellness-100 bg-white p-4 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold tracking-widest text-emerald-700">
                  {typeLabel(provider.type)}
                </div>
                <div className="mt-1 font-semibold text-sm leading-snug">{provider.name}</div>
              </div>
              <AvailabilityPill status={provider.availabilityStatus} />
            </div>
            <div className="mt-2 text-xs text-wellness-700/80 leading-relaxed">{provider.location}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {provider.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-md border border-wellness-100 bg-wellness-50 px-2 py-0.5 text-[10px] text-wellness-700">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-[11px] leading-relaxed text-emerald-900">
              <strong>Why it matches:</strong> {provider.whyItMatchesUser}
            </div>
            <div className="mt-2 rounded-xl bg-amber-50 border border-amber-100 p-2.5 text-[11px] leading-relaxed text-amber-900">
              <strong>Safety check:</strong> {provider.safetyNotes}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-white border border-emerald-100 p-3 text-xs text-emerald-900 leading-relaxed">
        <strong>Next version:</strong> live availability, verified provider credentials, coach-approved substitutions,
        booking handoff, and transparent community revenue tracking.
      </div>
    </section>
  );
}
