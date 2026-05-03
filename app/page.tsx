"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoUser } from "@/lib/demoUser";
import { store } from "@/lib/storage";

const stats = [
  {
    n: "$894B",
    l: "Global wellness tourism spending in 2024",
    source: "GWI",
  },
  {
    n: "#15",
    l: "Thailand ranked globally in wellness tourism spending; strong growth potential",
    source: "GWI country ranking",
  },
  {
    n: "60s",
    l: "Demo-ready AI wellness journey generation",
    source: "MVP demo metric",
  },
  {
    n: "Coach",
    l: "Coach-reviewed demo plans",
    source: "Human-in-the-loop model",
  },
];

const checklist = [
  "Load Demo User: Maya, 35, stress recovery and better sleep",
  "Generate the AI wellness plan for Chiang Rai",
  "Show Eat Well, Move Well, Rest Deeply itinerary",
  "Open coach review, add note, and mark validated",
  "Complete daily check-in and show adaptive recommendation",
  "Close with Chiang Rai pilot -> Thailand wellness tourism scale",
];

export default function LandingPage() {
  const router = useRouter();

  function loadDemo() {
    store.setProfile(demoUser);
    store.clearPlan();
    store.clearCoach();
    router.push("/intake?demo=1");
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-wellness-100 bg-gradient-to-br from-wellness-50 via-white to-sky-50 p-6 sm:p-14 shadow-soft">
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-wellness-200/40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl animate-float-slow" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="max-w-2xl">
            <span className="badge bg-white border border-wellness-200 text-wellness-800 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-wellness-500 animate-pulse" />
              Chiang Rai pilot · built to scale across Thailand
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]">
              RaiWell <span className="bg-gradient-to-r from-wellness-600 to-sky-500 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-wellness-700 font-medium">
              The AI layer for personalized wellness tourism.
            </p>

            <p className="mt-5 text-2xl sm:text-3xl font-semibold leading-tight text-wellness-900">
              <span className="text-wellness-700">Eat well.</span>{" "}
              <span className="text-sky-700">Move well.</span>{" "}
              <span className="text-amber-700">Rest deeply</span>{" "}
              <span className="text-wellness-900">in Chiang Rai.</span>
            </p>

            <p className="mt-5 text-wellness-900/75 leading-relaxed">
              RaiWell AI combines local food context, coach-led movement, peaceful travel design,
              provider matching, and daily adaptation into one personalized wellness journey.
              It supports general lifestyle planning and keeps coach validation in the loop.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              <button onClick={loadDemo} className="btn-primary text-base">
                Load Demo User
              </button>
              <Link href="/intake" className="btn-secondary">Create my journey</Link>
              <Link href="/demo" className="btn-secondary">Judge mode</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-wellness-700/70">
              <span className="chip">No sign-up needed</span>
              <span className="chip">Coach review layer</span>
              <span className="chip">Local provider network</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="card border-wellness-200 shadow-soft -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between gap-2">
                <div className="badge bg-wellness-100 text-wellness-800">Chiang Rai · 2 days</div>
                <div className="badge bg-wellness-600 text-white animate-pulse-ring text-[10px]">Coach + AI Validated</div>
              </div>
              <div className="mt-3 text-base font-semibold">Maya · 35 · stress 8/10</div>
              <div className="mt-1 text-xs text-wellness-700/80">Lifestyle reset · low-crowd route · late rainy season</div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                <span className="chip text-[10px]">Eat</span>
                <span className="chip text-[10px]">Move</span>
                <span className="chip text-[10px]">Rest</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>Morning</strong> · Choui Fong tea fields before 08:00</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>Afternoon</strong> · RPE-based movement + Tai Lue lunch</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>Evening</strong> · recovery session · sleep wind-down</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-wellness-100 text-[11px] text-wellness-700/70 italic">
                "Mild spice · PM2.5 planning check · low-crowd local route"
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-wellness-100 bg-white p-4 shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-wellness-700">{s.n}</div>
            <div className="text-[11px] sm:text-xs text-wellness-700/70 mt-1 leading-tight">{s.l}</div>
            <div className="mt-2 text-[10px] text-sky-700 bg-sky-50 border border-sky-100 inline-flex rounded-md px-2 py-0.5">
              Source: {s.source}
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="text-center mb-6">
          <div className="badge bg-wellness-100 text-wellness-800">3 PILLARS</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">What RaiWell personalizes</h2>
          <p className="mt-2 text-wellness-700/80 text-sm sm:text-base">Food context · movement readiness · peaceful local travel</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border-2 border-wellness-200 bg-gradient-to-br from-wellness-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🍃</div>
              <div className="badge bg-wellness-600 text-white text-[10px]">EAT WELL</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Local Food Intelligence</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              RaiWell explains food through balance, portions, seasonality, preferences, and culture without medical claims.
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>Seasonal northern vegetables and mild-spice options</li>
              <li>Portion awareness for sticky rice and local dishes</li>
              <li>Akha / Tai Lue / Shan / Karen food context</li>
              <li>Coach review for allergies, comfort, and balance</li>
            </ul>
          </div>

          <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🏃</div>
              <div className="badge bg-sky-600 text-white text-[10px]">MOVE WELL</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Movement Readiness</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              Movement is adapted with RPE, sleep, stress, energy, discomfort, and coach validation.
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>Walking, mobility, recovery, and optional HYROX-style blocks</li>
              <li>No fixed heart-rate targets or medical promises</li>
              <li>Lower intensity when sleep or stress signals are poor</li>
              <li>Stop and seek qualified help for unusual symptoms</li>
            </ul>
          </div>

          <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🌙</div>
              <div className="badge bg-amber-500 text-white text-[10px]">REST DEEPLY</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Peaceful Chiang Rai Travel</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              RaiWell sells quiet, privacy, recovery rhythm, and local connection, not a crowded checklist.
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>Low-crowd tea fields, riverside walks, and slow cafes</li>
              <li>Weather, PM2.5, water, crowd, and visibility checks</li>
              <li>Matched local guides, hosts, coaches, and stays</li>
              <li>Chiang Rai pilot with Thailand-scale potential</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-wellness-100 bg-white p-6 sm:p-10 shadow-soft">
        <div className="text-center mb-6">
          <div className="badge bg-wellness-100 text-wellness-800">WHY CHIANG RAI?</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">A strong pilot for quiet wellness tourism</h2>
          <p className="mt-2 text-wellness-700/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Chiang Rai is a practical pilot for calm, privacy-aware, local-provider-led wellness journeys.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Lower-pressure pace", d: "A calmer alternative to mass-tourism itineraries." },
            { t: "Local food culture", d: "Seasonal northern food and community-hosted meals." },
            { t: "Nature recovery", d: "Tea fields, rivers, forests, and easy walking routes." },
            { t: "Low-crowd potential", d: "Better fit for stress recovery and privacy preferences." },
            { t: "Provider network", d: "Local guides, coaches, cafes, hosts, and stays can be matched." },
            { t: "Scalable model", d: "The same AI layer can extend to other Thai wellness destinations." },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-wellness-100 bg-white p-4 hover:shadow-soft transition">
              <div className="text-sm font-semibold text-wellness-800">{p.t}</div>
              <div className="mt-1 text-xs text-wellness-900/75 leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-wellness-50 p-6 sm:p-10 shadow-soft">
        <div className="text-center mb-6">
          <div className="badge bg-sky-600 text-white">CHIANG RAI INTELLIGENCE LAYER</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">Why this needs AI</h2>
          <p className="mt-3 text-wellness-900/80 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            Traditional software can list places. RaiWell reasons across wellness goals, sleep, stress,
            movement readiness, food preferences, safety checks, local providers, and daily check-ins.
          </p>
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {[
            "Wellness goal",
            "Food preferences",
            "Movement readiness",
            "Sleep + stress",
            "Season",
            "PM2.5 sensitivity",
            "Water/route caution",
            "Crowd preference",
            "Local provider fit",
            "Coach review",
            "Daily energy",
            "Weather uncertainty",
          ].map((f) => (
            <div key={f} className="rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs sm:text-sm text-wellness-800 shadow-soft">
              {f}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-wellness-100 bg-white p-6 sm:p-10 shadow-soft">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="badge bg-amber-100 text-amber-800">2-MINUTE JUDGE CHECKLIST</div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">Demo path</h2>
          </div>
          <Link href="/demo" className="btn-secondary">Open scripted judge mode</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checklist.map((item, i) => (
            <div key={item} className="rounded-2xl border border-wellness-100 bg-wellness-50/50 p-4">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-wellness-600 text-white text-xs font-bold">
                {i + 1}
              </div>
              <div className="mt-2 text-sm font-medium text-wellness-900">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-wellness-200 bg-gradient-to-br from-wellness-700 to-wellness-800 p-6 sm:p-10 text-white shadow-soft">
        <div className="text-xs tracking-widest text-wellness-200 font-semibold">ONE-SENTENCE POSITIONING</div>
        <p className="mt-3 text-xl sm:text-2xl font-medium leading-snug max-w-3xl">
          We are not building a travel app. We are building the AI layer for Thailand's wellness tourism.
        </p>
      </section>

      <section className="rounded-3xl border border-wellness-100 bg-white p-6 sm:p-10 text-center shadow-soft">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to try the live demo?</h2>
        <p className="mt-2 text-wellness-700/80">Load Maya and generate a Chiang Rai wellness plan in under a minute.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={loadDemo} className="btn-primary text-base">Start live demo</button>
          <Link href="/demo" className="btn-secondary">Judge mode</Link>
        </div>
      </section>
    </div>
  );
}
