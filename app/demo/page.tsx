"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoUser } from "@/lib/demoUser";
import { store } from "@/lib/storage";

type Step = {
  title: string;
  body: string;
  takeaway: string;
  time: string;
  cta?: { label: string; href: string };
};

const STEPS: Step[] = [
  {
    title: "1. Problem",
    body: "Wellness travel is still generic. Most tools recommend popular places, but they do not reason across stress, sleep, movement readiness, food preferences, privacy, local context, and safety checks.",
    takeaway: "Wellness tourism lacks a personalization layer",
    time: "15 sec",
  },
  {
    title: "2. Insight",
    body: "Chiang Rai's wellness value is not only scenic nature. It is calm, privacy, seasonal food culture, slower rhythm, quiet routes, and local providers that mass tourism often misses.",
    takeaway: "Chiang Rai = calm + local + private",
    time: "15 sec",
  },
  {
    title: "3. User: Maya",
    body: "Maya is 35, stressed 8/10, sleeping poorly, and wants a 2-day reset in Chiang Rai. She likes mild local Thai food, quiet places, cafes, walking, nature, and optional HYROX-style movement.",
    takeaway: "A concrete user, not a generic tourist",
    time: "15 sec",
    cta: { label: "Load Maya", href: "/intake?demo=1" },
  },
  {
    title: "4. AI journey across 3 pillars",
    body: "RaiWell AI designs Eat Well, Move Well, and Rest Deeply recommendations. Coach Roi has locally confirmed that Le Méridien Chiang Rai Fitness can support coach-led gym and HYROX-inspired functional training sessions. RaiWell AI uses this as a verified indoor movement option, especially when PM2.5, rain, or user readiness makes outdoor exercise less suitable.",
    takeaway: "Not a chatbot; an AI reasoning layer",
    time: "30 sec",
    cta: { label: "Open Maya's plan", href: "/plan" },
  },
  {
    title: "5. Coach Roi review",
    body: "Human-in-the-loop is the core differentiator. Coach Roi reviews food balance, movement intensity, recovery load, provider fit, and safety notes before the demo plan is marked Coach Roi + AI Validated.",
    takeaway: "AI draft + Coach Roi validation",
    time: "20 sec",
    cta: { label: "Open coach panel", href: "/plan#coach" },
  },
  {
    title: "6. Local impact",
    body: "The plan connects Maya to local guides, food hosts, quiet cafes, wellness-friendly stays, and Coach Roi as the single coach validator. The model can reduce middlemen and support community-based wellness tourism.",
    takeaway: "Tourism + local economy + wellness",
    time: "15 sec",
    cta: { label: "See local network", href: "/plan#network" },
  },
  {
    title: "7. Scale",
    body: "GWI reports $894B global wellness tourism spending in 2024. Thailand ranked #15 globally in wellness tourism spending, with strong growth potential. RaiWell starts in Chiang Rai and can expand to other Thai wellness destinations.",
    takeaway: "Chiang Rai pilot -> Thailand-scale AI layer",
    time: "10 sec",
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const progress = ((i + 1) / STEPS.length) * 100;

  function jumpToCTA(href: string) {
    if (href.startsWith("/intake")) {
      store.setProfile(demoUser);
      store.clearPlan();
      store.clearCoach();
    }
    router.push(href);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-wellness-100 bg-gradient-to-br from-wellness-50 via-white to-sky-50 p-5 sm:p-8 shadow-soft">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="badge bg-wellness-600 text-white">Judge demo mode</div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">RaiWell AI in 2 minutes</h1>
            <p className="mt-2 text-wellness-900/80 max-w-2xl text-sm sm:text-base leading-relaxed">
              Seven short beats. Use the green button when a step should jump to the live product screen.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-wellness-700/70">Progress</div>
            <div className="text-2xl font-bold text-wellness-700">{i + 1}/{STEPS.length}</div>
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-wellness-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-wellness-500 to-wellness-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="card border-2 border-wellness-200 shadow-soft">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs tracking-widest text-wellness-600 font-semibold">
            Step {i + 1} of {STEPS.length} · {step.time}
          </div>
          <div className="badge bg-wellness-100 text-wellness-800">{step.takeaway}</div>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold leading-tight">{step.title}</h2>
        <p className="mt-3 text-wellness-900/85 leading-relaxed sm:text-lg">{step.body}</p>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {step.cta && (
            <button className="btn-primary text-base" onClick={() => jumpToCTA(step.cta!.href)}>
              {step.cta.label}
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => setI((p) => Math.max(0, p - 1))}
            disabled={i === 0}
          >
            Back
          </button>
          <button
            className="btn-secondary"
            onClick={() => setI((p) => Math.min(STEPS.length - 1, p + 1))}
            disabled={i === STEPS.length - 1}
          >
            Next
          </button>
          {i === STEPS.length - 1 && (
            <button className="btn-secondary" onClick={() => setI(0)}>Restart</button>
          )}
        </div>
      </section>

      <section className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {STEPS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`text-left rounded-2xl border p-3 sm:p-4 transition ${
              idx === i
                ? "border-wellness-600 bg-wellness-50 shadow-soft"
                : idx < i
                ? "border-wellness-200 bg-white opacity-70"
                : "border-wellness-100 bg-white hover:bg-wellness-50/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  idx <= i ? "bg-wellness-600 text-white" : "bg-wellness-100 text-wellness-700"
                }`}
              >
                {idx < i ? "✓" : idx + 1}
              </span>
              <span className="text-[10px] text-wellness-700/60">{s.time}</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold mt-2 leading-tight">{s.title}</div>
          </button>
        ))}
      </section>

      <section className="rounded-3xl border border-wellness-200 bg-gradient-to-br from-wellness-700 to-wellness-800 p-6 sm:p-8 text-white shadow-soft">
        <div className="text-xs tracking-widest text-wellness-200 font-semibold">The sentence judges should remember</div>
        <p className="mt-3 text-xl sm:text-2xl font-medium leading-snug">
          We are not building a travel app. We are building the AI layer for Thailand's wellness tourism.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link className="btn-primary !bg-white !text-wellness-800 hover:!bg-wellness-50" href="/intake?demo=1">Start live demo</Link>
          <Link className="btn-secondary !bg-transparent !text-white !border-white/40 hover:!bg-white/10" href="/plan">Jump to AI plan</Link>
        </div>
      </section>
    </div>
  );
}
