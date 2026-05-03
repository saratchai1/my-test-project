"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/storage";
import type { CoachReview } from "@/lib/types";

export default function CoachStickyBanner() {
  const [review, setReview] = useState<CoachReview | null>(null);

  useEffect(() => {
    setReview(store.getCoach());
    const id = setInterval(() => {
      const c = store.getCoach();
      setReview((prev) => (JSON.stringify(prev) === JSON.stringify(c) ? prev : c));
    }, 500);
    return () => clearInterval(id);
  }, []);

  function scrollToCoach() {
    const el = document.getElementById("coach");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (review?.validated) {
    return (
      <div className="sticky top-[56px] z-20 -mx-4 sm:-mx-5 mb-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <div className="rounded-xl bg-gradient-to-r from-wellness-600 to-wellness-700 text-white px-4 py-2.5 shadow-soft flex items-center gap-3 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 font-bold">✓</span>
            <span className="font-semibold">Reviewed by Coach Roi</span>
            <span className="hidden sm:inline text-white/80">- demo plan marked validated</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[56px] z-20 -mx-4 sm:-mx-5 mb-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2.5 shadow-soft flex items-center justify-between gap-3 animate-pulse-ring">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-950/15 font-bold">!</span>
            <span className="font-semibold">Coach Roi review pending</span>
            <span className="hidden md:inline text-amber-950/80">- the only coach in this MVP</span>
          </div>
          <button
            onClick={scrollToCoach}
            className="rounded-full bg-amber-950 text-white px-3 py-1 text-xs font-semibold hover:bg-amber-900 whitespace-nowrap"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
