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

  function validate() {
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
          🧑‍⚕️ Human-in-the-loop · Coach + AI Validation
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-3 mt-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-wellness-200 text-2xl">
            👩‍⚕️
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold">การตรวจสอบโดยโค้ชผู้เชี่ยวชาญ</h2>
            <p className="text-sm text-wellness-700/85 mt-1 leading-relaxed">
              AI สร้างทริปเฉพาะบุคคล · โค้ชตรวจสอบ <strong>สมดุลอาหาร ความเข้มข้น และความปลอดภัยจริง</strong>
            </p>
          </div>
        </div>
        {review.validated ? (
          <div className="badge bg-wellness-600 text-white shadow-soft text-sm shrink-0">
            ✓ Certified Coach + AI Validated
          </div>
        ) : (
          <div className="badge bg-amber-500 text-white shadow-soft text-sm shrink-0 animate-pulse-ring">
            ⏳ รอการตรวจสอบ
          </div>
        )}
      </div>

      {/* EAT WELL · review food */}
      <div className="mt-6 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">🍃 EAT WELL · ตรวจสอบอาหาร</div>
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
            {review.approvedFoodPlan ? "✓ อนุมัติแผนอาหารแล้ว" : "อนุมัติแผนอาหาร"}
          </button>
          <input
            className="input"
            placeholder="ปรับพอร์ชั่นมื้อ (เช่น ลดข้าวเหนียวเหลือ 1/3 กำมือ)"
            value={review.mealPortionAdjustment}
            onChange={(e) => update("mealPortionAdjustment", e.target.value)}
          />
        </div>
      </div>

      {/* MOVE WELL · review intensity */}
      <div className="mt-3 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">🏃 MOVE WELL · ปรับความเข้มข้น</div>
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

      {/* REST DEEPLY · hidden gem */}
      <div className="mt-3 rounded-2xl border border-wellness-100 bg-white/60 p-4">
        <div className="text-xs tracking-widest font-semibold text-wellness-700">🌙 REST DEEPLY · ประสบการณ์ท้องถิ่น</div>
        <input
          className="input mt-3"
          placeholder="เพิ่ม Hidden gem (เช่น คาเฟ่ในไร่ชาเล็กของพี่อ้อยที่ห้วยน้ำริน)"
          value={review.hiddenGem}
          onChange={(e) => update("hiddenGem", e.target.value)}
        />
      </div>

      {/* SAFETY · safety + note */}
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
        <div className="text-xs tracking-widest font-semibold text-amber-700">🛡 SAFETY · คำเตือน + บันทึก</div>
        <input
          className="input mt-3"
          placeholder="คำเตือนความปลอดภัย (เช่น งดบ่อน้ำพุร้อนถ้ามีปัญหาความดัน)"
          value={review.safetyWarning}
          onChange={(e) => update("safetyWarning", e.target.value)}
        />
        <textarea
          className="input mt-3 min-h-[80px]"
          placeholder="บันทึกจากโค้ช (เช่น เน้นการฟื้นฟูระบบประสาทพาราซิมพาเทติก เริ่มที่ความเข้มข้นเบา)…"
          value={review.note}
          onChange={(e) => update("note", e.target.value)}
        />
      </div>

      {/* CTA */}
      <div className="mt-6 flex gap-3 flex-wrap items-center">
        {review.validated ? (
          <button className="btn-secondary" onClick={unvalidate}>↺ ยกเลิกการรับรอง</button>
        ) : (
          <button className="btn-amber text-base" onClick={validate}>
            ✓ Mark as Coach Validated
          </button>
        )}
        <span className="text-xs text-wellness-700/80">
          AI ทั่วไป = chatbot · RaiWell = AI + โค้ชจริง · นี่คือ <strong>differentiator หลัก</strong>
        </span>
      </div>
    </section>
  );
}
