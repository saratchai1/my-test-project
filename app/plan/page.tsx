"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/storage";
import { buildMockPlan } from "@/lib/mockPlan";
import { demoUser } from "@/lib/demoUser";
import type { CoachReview, UserProfile, WellnessPlan } from "@/lib/types";
import PlanView from "@/components/PlanView";
import CoachPanel from "@/components/CoachPanel";
import CheckIn from "@/components/CheckIn";
import CoachStickyBanner from "@/components/CoachStickyBanner";
import LocalWellnessNetwork from "@/components/LocalWellnessNetwork";

export default function PlanPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [coach, setCoach] = useState<CoachReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = store.getProfile() ?? demoUser;
    const existing = store.getPlan();
    setProfile(p);
    if (existing) {
      setPlan(existing);
      setCoach(store.getCoach());
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(p),
        });
        const generated = (await res.json()) as WellnessPlan;
        store.setPlan(generated);
        setPlan(generated);
      } catch {
        const fallback = buildMockPlan(p);
        store.setPlan(fallback);
        setPlan(fallback);
      } finally {
        setCoach(store.getCoach());
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const c = store.getCoach();
      setCoach((prev) => (JSON.stringify(prev) === JSON.stringify(c) ? prev : c));
    }, 500);
    return () => clearInterval(id);
  }, []);

  if (loading || !profile || !plan) {
    return (
      <div className="card text-center py-16">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-wellness-100 text-wellness-600 text-2xl animate-pulse">R</div>
        <div className="mt-4 text-lg font-semibold text-wellness-800">Building your Chiang Rai wellness journey...</div>
        <p className="text-sm text-wellness-700/80 mt-2">Personalizing food, movement, recovery, local context, and safety checks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <CoachStickyBanner />

      <div className="flex items-center gap-2 text-sm text-wellness-700/80 flex-wrap">
        <Link href="/intake" className="underline-offset-2 hover:underline">Edit profile</Link>
        <span>·</span>
        <Link href="/demo" className="underline-offset-2 hover:underline">Judge demo mode</Link>
        <span>·</span>
        <a href="#coach" className="underline-offset-2 hover:underline text-amber-700 font-semibold">Coach Roi review</a>
        <span>·</span>
        <a href="#network" className="underline-offset-2 hover:underline">Local network</a>
        <span>·</span>
        <a href="#checkin" className="underline-offset-2 hover:underline">Daily check-in</a>
      </div>

      <PlanView profile={profile} plan={plan} coach={coach} />

      <div id="coach" className="scroll-mt-32">
        <CoachPanel />
      </div>

      <div id="network" className="scroll-mt-32">
        <LocalWellnessNetwork profile={profile} plan={plan} />
      </div>

      <div id="checkin" className="scroll-mt-32">
        <CheckIn />
      </div>
    </div>
  );
}
