"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/storage";
import { TH } from "@/lib/labels";
import type { CoachReview } from "@/lib/types";

const DEFAULT: CoachReview = {
  validated: false,
  approvedFoodPlan: false,
  intensity: "keep",
  mealPortionAdjustment: "",
  addHyrox: false,
  addRecoverySession: false,
  hiddenGem: "",
  safetyWarning: "",
  note: "",
};

export default function CoachPanel() {
  const [review, setReview] = useState<CoachReview>(DEFAULT);

  useEffect(() => {
    setReview({ ...DEFAULT, ...(store.getCoach() ?? {}) });
  }, []);

  function update<K extends keyof CoachReview>(k: K, v: CoachReview[K]) {
    setReview((r) => {
      const next = { ...r, [k]: v };
      store.setCoach(next);
      return next;
    });
  }

  const canValidate = review.approvedFoodPlan && review.note.trim().length > 0;

  function validate() {
    if (!canValidate) return;
    const next = { ...review, validated: true };
    store.setCoach(next);
    setReview(next);
  }

  function unvalidate() {
    const next = { ...review, validated: false };
    store.setCoach(next);
    setReview(next);
  }

  return (
    <section
      className={`relative rounded-3xl p-5 sm:p-7 shadow-soft border-2 transition-colors ${
        review.validated
          ? "border-wellness-500 bg-gradient-to-br from-wellness-50 via-white to-wellness-50"
          : "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50"
      }`}
    >
      <div className="absolute -top-3 left-5 sm:left-7">
        <div className="badge bg-sky-600 text-white shadow-soft text-[11px]">
          Human-in-the-loop · Coach + AI validation
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-3 mt-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-wellness-200 text-xl font-bold text-wellness-700">
            C
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold">Certified coach review</h2>
            <p className="text-sm text-wellness-700/85 mt-1 leading-relaxed">
              The AI drafts the journey. A coach reviews food balance, movement intensity, safety checks,
              provider fit, and recovery load before the demo plan is marked validated.
            </p>
          </div>
        </div>
        {review.validated ? (
          <div className="badge bg-wellness-600 text-white shadow-soft text-sm shrink-0">
            ✓ Certified Coach + AI Validated
          </div>
        ) : (
          <div className="badge bg-amber-500 text-white shadow-soft text-sm shrink-0 animate-pulse-ring">
            Review pending
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">EAT WELL · food review</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => update("approvedFoodPlan", !review.approvedFoodPlan)}
            className={`text-left rounded-xl border px-3 py-2.5 text-sm transition ${
              review.approvedFoodPlan
                ? "border-wellness-500 bg-wellness-50 text-wellness-800 font-semibold"
                : "border-wellness-200 bg-white"
            }`}
          >
            {review.approvedFoodPlan ? "Food plan reviewed" : "Review food plan"}
          </button>
          <input
            className="input"
            placeholder="Meal adjustment, e.g. mild spice, smaller sticky-rice portion"
            value={review.mealPortionAdjustment}
            onChange={(e) => update("mealPortionAdjustment", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">MOVE WELL · intensity review</div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {(["lighter", "keep", "harder"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update("intensity", opt)}
              className={`chip cursor-pointer ${
                review.intensity === opt ? "!bg-wellness-600 !text-white !border-wellness-600" : ""
              }`}
            >
              {TH.intensity[opt]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => update("addHyrox", !review.addHyrox)}
            className={`chip cursor-pointer ${
              review.addHyrox ? "!bg-sky-600 !text-white !border-sky-600" : ""
            }`}
          >
            {review.addHyrox ? "✓ " : "+ "}HYROX-style option
          </button>
          <button
            type="button"
            onClick={() => update("addRecoverySession", !review.addRecoverySession)}
            className={`chip cursor-pointer ${
              review.addRecoverySession ? "!bg-sky-600 !text-white !border-sky-600" : ""
            }`}
          >
            {review.addRecoverySession ? "✓ " : "+ "}Recovery session
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">REST DEEPLY · local experience</div>
        <input
          className="input mt-3"
          placeholder="Add hidden gem, e.g. quiet tea garden outside peak hours"
          value={review.hiddenGem}
          onChange={(e) => update("hiddenGem", e.target.value)}
        />
      </div>

      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
        <div className="text-xs tracking-widest font-semibold text-amber-700">SAFETY · warning + coach note</div>
        <input
          className="input mt-3"
          placeholder="Safety note, e.g. avoid warm soak if symptoms or medical caution apply"
          value={review.safetyWarning}
          onChange={(e) => update("safetyWarning", e.target.value)}
        />
        <textarea
          className="input mt-3 min-h-[80px]"
          placeholder="Required coach note for validation"
          value={review.note}
          onChange={(e) => update("note", e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-3 flex-wrap items-center">
        {review.validated ? (
          <button className="btn-secondary" onClick={unvalidate}>Remove validation</button>
        ) : (
          <button
            className={`btn-amber text-base ${canValidate ? "" : "opacity-50 cursor-not-allowed"}`}
            onClick={validate}
            disabled={!canValidate}
          >
            Mark as Coach Validated
          </button>
        )}
        <span className="text-xs text-wellness-700/80">
          Required: food review + coach note. RaiWell = AI planning + human validation.
        </span>
      </div>
    </section>
  );
}
