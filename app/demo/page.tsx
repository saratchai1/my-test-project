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
    title: "1. ปัญหา",
    body: "Wellness Tourism ทุกวันนี้ยัง 'เหมารวม' แอปแนะนำที่เที่ยวยอดฮิต แออัด ไม่เข้าใจความเครียด การนอน หรือฟิตเนสรายบุคคล นักท่องเที่ยวกลับบ้านพร้อมความเหนื่อย ไม่ใช่การเปลี่ยนแปลง",
    takeaway: "Wellness Tourism ขาด Personalization Layer",
    time: "15 วินาที",
  },
  {
    title: "2. Insight",
    body: "Wellness ที่จริงของเชียงรายไม่ใช่แค่ธรรมชาติสวย — มันคือ ความสงบ ความเป็นส่วนตัว วัฒนธรรมอาหารตามฤดู ไลฟ์สไตล์ที่เน้นการเคลื่อนไหว และเส้นทางท้องถิ่นเงียบๆ ที่ mass tourism มักมองข้าม",
    takeaway: "Chiang Rai = calm + local + private",
    time: "15 วินาที",
  },
  {
    title: "3. ผู้ใช้: มายา",
    body: "มายา อายุ 35 พนักงานออฟฟิศกรุงเทพ เครียด 8/10 นอนไม่ดี ต้องการมาเชียงราย 2 วัน เพื่อ Reset — ชอบที่เงียบ เลี่ยงคนเยอะ สนใจ HYROX functional + อาหารเหนือไม่เผ็ดมาก",
    takeaway: "ผู้ใช้จริง · ปัญหาจริง · ตลาดจริง",
    time: "15 วินาที",
    cta: { label: "โหลดมายาเป็นผู้ใช้ตัวอย่าง", href: "/intake?demo=1" },
  },
  {
    title: "4. AI สร้างทริปข้าม 3 เสาหลัก",
    body: "RaiWell AI ออกแบบทริปครบ Eat Well · Move Well · Rest Deeply — ปรับ 12+ ปัจจัย: อาหารเหนือ + พอร์ชั่น, HYROX-style ที่โค้ชยืนยัน, เส้นทางคนน้อย, ฤดูปลายฝน, PM2.5, น้ำเสี่ยง — ทุกข้อมีเหตุผล",
    takeaway: "ไม่ใช่ chatbot — เป็น AI ใช้เหตุผลข้ามมิติ",
    time: "30 วินาที",
    cta: { label: "เปิดแผน AI ของมายา", href: "/plan" },
  },
  {
    title: "5. โค้ชตรวจสอบ ⭐",
    body: "Human-in-the-loop คือ differentiator หลัก — โค้ชโภชนาการ + ฟิตเนสที่ได้รับการรับรองตรวจ สมดุลอาหาร, พอร์ชั่น, ความเข้มข้น, เพิ่ม HYROX/Recovery, hidden gem, คำเตือน — แล้วประทับ Coach + AI Validated",
    takeaway: "AI ทั่วไป = chatbot · RaiWell = AI + โค้ชจริง",
    time: "20 วินาที",
    cta: { label: "เปิดหน้าโค้ช (เลื่อนลง)", href: "/plan#coach" },
  },
  {
    title: "6. Local Impact",
    body: "แผนเชื่อมมายากับ ไกด์ท้องถิ่น เชฟชาติพันธุ์ Tai Lue โค้ช HYROX คาเฟ่ขนาดเล็ก และเส้นทางเงียบ — รายได้ตรง ลดตัวกลาง สร้าง Community-Based Wellness Tourism จริง",
    takeaway: "Tourism + Local Economy + Wellness ในแอปเดียว",
    time: "15 วินาที",
    cta: { label: "ดู Local Wellness Network", href: "/plan#network" },
  },
  {
    title: "7. สเกล: เชียงราย → ทั้งประเทศไทย",
    body: "เริ่มที่เชียงรายเป็นพื้นที่นำร่อง — ประเทศไทยเป็น Top 5 Wellness Tourism ระดับโลก ($1.2T market) RaiWell AI ขยายโมเดลนี้ไปจุดหมาย Wellness อื่นของไทยได้: ปาย, แม่ฮ่องสอน, น่าน, เกาะลันตา, เกาะเต่า",
    takeaway: "AI Layer สำหรับ Wellness Tourism ทั้งประเทศ",
    time: "10 วินาที",
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
            <div className="badge bg-wellness-600 text-white">⏱ โหมดเดโมสำหรับกรรมการ</div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">RaiWell AI ใน 2 นาที</h1>
            <p className="mt-2 text-wellness-900/80 max-w-2xl text-sm sm:text-base leading-relaxed">
              7 ขั้นตอน · รวม 2 นาที · กดปุ่มสีเขียวเพื่อกระโดดไปหน้าจริง
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-wellness-700/70">ความคืบหน้า</div>
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
            ขั้นตอนที่ {i + 1} จาก {STEPS.length} · {step.time}
          </div>
          <div className="badge bg-wellness-100 text-wellness-800">💡 {step.takeaway}</div>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold leading-tight">{step.title}</h2>
        <p className="mt-3 text-wellness-900/85 leading-relaxed sm:text-lg">{step.body}</p>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {step.cta && (
            <button className="btn-primary text-base" onClick={() => jumpToCTA(step.cta!.href)}>
              {step.cta.label} →
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => setI((p) => Math.max(0, p - 1))}
            disabled={i === 0}
          >
            ← ย้อนกลับ
          </button>
          <button
            className="btn-secondary"
            onClick={() => setI((p) => Math.min(STEPS.length - 1, p + 1))}
            disabled={i === STEPS.length - 1}
          >
            ถัดไป →
          </button>
          {i === STEPS.length - 1 && (
            <button className="btn-secondary" onClick={() => setI(0)}>↺ เริ่มใหม่</button>
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
        <div className="text-xs tracking-widest text-wellness-200 font-semibold">ประโยคพิตช์เดียวที่ต้องจำ</div>
        <p className="mt-3 text-xl sm:text-2xl font-medium leading-snug">
          เราไม่ได้สร้างแอปท่องเที่ยวทั่วไป เรากำลังสร้าง <span className="underline decoration-wellness-300 decoration-4 underline-offset-4">AI Layer สำหรับ Wellness ที่จริงของเชียงราย</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link className="btn-primary !bg-white !text-wellness-800 hover:!bg-wellness-50" href="/intake?demo=1">▶ เริ่มเดโมสด</Link>
          <Link className="btn-secondary !bg-transparent !text-white !border-white/40 hover:!bg-white/10" href="/plan">ข้ามไปดูแผน AI</Link>
        </div>
      </section>
    </div>
  );
}
