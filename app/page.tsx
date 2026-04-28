"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoUser } from "@/lib/demoUser";
import { store } from "@/lib/storage";

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
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-wellness-100 bg-gradient-to-br from-wellness-50 via-white to-sky-50 p-6 sm:p-14 shadow-soft">
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-wellness-200/40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl animate-float-slow" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="max-w-2xl">
            <span className="badge bg-white border border-wellness-200 text-wellness-800 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-wellness-500 animate-pulse" />
              พื้นที่นำร่อง · เชียงราย · พร้อมขยายสู่เมืองอื่น
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]">
              RaiWell <span className="bg-gradient-to-r from-wellness-600 to-sky-500 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-wellness-700 font-medium">
              Personalized Chiang Rai Wellness Journey
            </p>

            <p className="mt-5 text-2xl sm:text-3xl font-semibold leading-tight text-wellness-900">
              <span className="text-wellness-700">Eat well.</span>{" "}
              <span className="text-sky-700">Move well.</span>{" "}
              <span className="text-amber-700">Rest deeply</span>{" "}
              <span className="text-wellness-900">in Chiang Rai.</span>
            </p>

            <p className="mt-5 text-wellness-900/75 leading-relaxed">
              RaiWell AI ผสาน <strong>ภูมิปัญญาอาหารท้องถิ่น</strong> · <strong>การเคลื่อนไหวที่นำโดยโค้ช</strong> ·
              และ <strong>การท่องเที่ยวเชียงรายแบบเงียบสงบ</strong> เป็นทริป Wellness เฉพาะบุคคลเพื่อสุขภาพเชิงป้องกัน
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              <button onClick={loadDemo} className="btn-primary text-base">
                ▶ ลองเดโมใน 60 วินาที
              </button>
              <Link href="/intake" className="btn-secondary">สร้างทริปของฉัน</Link>
              <Link href="/demo" className="btn-secondary">โหมดกรรมการ</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-wellness-700/70">
              <span className="chip">✓ ไม่ต้องสมัครสมาชิก</span>
              <span className="chip">✓ มีโค้ชจริงตรวจสอบ</span>
              <span className="chip">✓ เน้นชุมชนท้องถิ่น</span>
            </div>
          </div>

          {/* Hero card mockup */}
          <div className="relative hidden lg:block">
            <div className="card border-wellness-200 shadow-soft -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between gap-2">
                <div className="badge bg-wellness-100 text-wellness-800">📍 เชียงราย · 2 วัน</div>
                <div className="badge bg-wellness-600 text-white animate-pulse-ring text-[10px]">✓ Coach + AI Validated</div>
              </div>
              <div className="mt-3 text-base font-semibold">มายา · 35 · เครียด 8/10</div>
              <div className="mt-1 text-xs text-wellness-700/80">รีเซ็ตไลฟ์สไตล์ · เลี่ยงคนเยอะ · ปลายฝน</div>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                <span className="chip text-[10px]">🍃 Eat</span>
                <span className="chip text-[10px]">🏃 Move</span>
                <span className="chip text-[10px]">🌙 Rest</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>เช้า</strong> · ไร่ชาฉุยฟง (ก่อน 8:00 เลี่ยงคน)</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>บ่าย</strong> · HYROX 12 นาที + Tai Lue lunch</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-wellness-500 shrink-0" />
                  <span><strong>เย็น</strong> · บ่อน้ำพุร้อนส่วนตัว · ลงนอน 22:00</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-wellness-100 text-[11px] text-wellness-700/70 italic">
                "ลดพริก · เลี่ยง PM2.5 · เลือกเส้นทางคนน้อยตามคุณ"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { n: "$1.2T", l: "Global Wellness Tourism (2024)" },
          { n: "Top 5", l: "ประเทศไทยใน Wellness Tourism โลก" },
          { n: "60s", l: "AI สร้างทริปเฉพาะคุณ" },
          { n: "100%", l: "ทุกแผนตรวจสอบโดยโค้ช" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-wellness-100 bg-white p-4 shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-wellness-700">{s.n}</div>
            <div className="text-[11px] sm:text-xs text-wellness-700/70 mt-1 leading-tight">{s.l}</div>
          </div>
        ))}
      </section>

      {/* 3 Pillars */}
      <section>
        <div className="text-center mb-6">
          <div className="badge bg-wellness-100 text-wellness-800">3 PILLARS</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">3 เสาหลักของ RaiWell</h2>
          <p className="mt-2 text-wellness-700/80 text-sm sm:text-base">อาหาร · การเคลื่อนไหว · การท่องเที่ยวเงียบสงบ</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Pillar 1: Food */}
          <div className="rounded-3xl border-2 border-wellness-200 bg-gradient-to-br from-wellness-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🍃</div>
              <div className="badge bg-wellness-600 text-white text-[10px]">EAT WELL</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Local Food Intelligence</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              RaiWell ไม่ตัดสินอาหารว่าดีหรือไม่ดี แต่ช่วยเข้าใจ <strong>พอร์ชั่น สมดุล ฤดูกาล วัตถุดิบท้องถิ่น และบริบทวัฒนธรรม</strong>
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>ผักเหนือตามฤดู · อาหารหมักท้องถิ่น</li>
              <li>น้ำพริก + ผัก + โปรตีนสมดุล</li>
              <li>ข้าวเหนียวกับ portion awareness</li>
              <li>อาหารชาติพันธุ์ Akha / Tai Lue / Shan / Karen</li>
              <li>ประสบการณ์อาหารท้องถิ่นแบบเซอร์ไพรส์</li>
            </ul>
          </div>

          {/* Pillar 2: Movement */}
          <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🏃</div>
              <div className="badge bg-sky-600 text-white text-[10px]">MOVE WELL</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Movement & Exercise</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              ทั้ง <strong>structured training</strong> และ <strong>fun movement</strong> ปรับตามฟิตเนส การนอน ความเครียด อาการเจ็บปวด และระยะเวลาทริป
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>โค้ชนำเทรนยิม + HYROX-style functional</li>
              <li>Mobility · Recovery · Trail prep</li>
              <li>Natural movement · เดินเส้นทางเงียบ</li>
              <li>กีฬาสนุกแบบกลุ่ม · racket sports</li>
              <li>Hotel gym activation พร้อมเทรนเนอร์</li>
            </ul>
          </div>

          {/* Pillar 3: Travel */}
          <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-3xl">🌙</div>
              <div className="badge bg-amber-500 text-white text-[10px]">REST DEEPLY</div>
            </div>
            <h3 className="mt-3 text-lg font-semibold">Peaceful Chiang Rai Travel</h3>
            <p className="mt-2 text-sm text-wellness-900/80 leading-relaxed">
              เราขาย <strong>ความสงบ ความเป็นส่วนตัว และการฟื้นฟูจิตใจ</strong> ไม่ใช่แค่เช็กลิสต์สถานที่
            </p>
            <ul className="mt-3 text-xs text-wellness-700 space-y-1 list-disc pl-4">
              <li>เส้นทางท้องถิ่นเงียบ · คาเฟ่ Slow Living</li>
              <li>นาขั้นบันได · บ่อน้ำพุร้อน · น้ำตก</li>
              <li>เมืองเก่า · กำแพงโบราณ · หมู่บ้านชุมชน</li>
              <li>เส้นทางคนน้อย · privacy-aware itinerary</li>
              <li>Mental detox · Digital detox</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Chiang Rai */}
      <section className="rounded-3xl border border-wellness-100 bg-white p-6 sm:p-10 shadow-soft">
        <div className="text-center mb-6">
          <div className="badge bg-wellness-100 text-wellness-800">WHY CHIANG RAI?</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">ทำไมเลือกเชียงรายเป็นพื้นที่นำร่อง</h2>
          <p className="mt-2 text-wellness-700/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ไม่ใช่เพราะ "ดีที่สุด" — แต่เป็น <strong>พื้นที่ที่เหมาะสำหรับ Wellness ที่เงียบ ส่วนตัว และเชื่อมโยงท้องถิ่น</strong>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { i: "💸", t: "ค่าใช้จ่ายต่ำกว่า · จังหวะช้ากว่า", d: "เป็นจุดหมาย Wellness ที่ราคาเข้าถึงได้และไม่เร่งรีบ" },
            { i: "🏡", t: "ไลฟ์สไตล์เหนือ + การต้อนรับท้องถิ่น", d: "มีวัฒนธรรมการต้อนรับและจังหวะชีวิตที่จริงใจ" },
            { i: "🌿", t: "ท่องเที่ยวธรรมชาติเงียบสงบ", d: "ภูเขา ป่า ไร่ชา แม่น้ำ ที่ไม่แออัด" },
            { i: "🤫", t: "คนน้อยกว่าจุดหมายหลัก", d: "เลี่ยงนักท่องเที่ยวจำนวนมาก เลือกความเงียบได้" },
            { i: "🍲", t: "วัฒนธรรมอาหารตามฤดู", d: "ผัก สมุนไพร และเมนูเหนือตามฤดูที่หลากหลาย" },
            { i: "💻", t: "Wellness + Digital Nomad ศักยภาพสูง", d: "เหมาะกับการทำงานระยะไกลคู่กับการพักฟื้น" },
            { i: "🤝", t: "เชื่อมตรงกับไกด์/ชุมชนท้องถิ่นได้", d: "โอกาสกระจายรายได้สู่ผู้ให้บริการขนาดเล็ก" },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-wellness-100 bg-white p-4 hover:shadow-soft transition">
              <div className="text-2xl">{p.i}</div>
              <div className="mt-2 text-sm font-semibold text-wellness-800">{p.t}</div>
              <div className="mt-1 text-xs text-wellness-900/75 leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-wellness-700/70 italic text-center">
          เชียงรายเป็น <strong>"พื้นที่นำร่องที่แข็งแกร่งสำหรับ wellness ที่เงียบ ส่วนตัว และเฉพาะบุคคล"</strong> · ไม่ใช่การประกาศว่าดีที่สุด
        </p>
      </section>

      {/* Comparison */}
      <section>
        <div className="text-center mb-6">
          <div className="badge bg-amber-100 text-amber-800">เราต่างจากแอปท่องเที่ยวอย่างไร</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">ไม่ใช่แอปท่องเที่ยวทั่วไป</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-wellness-100 bg-white p-5 sm:p-6">
            <div className="text-xs font-semibold tracking-widest text-wellness-700/60">แอปท่องเที่ยวทั่วไป</div>
            <ul className="mt-3 space-y-2 text-sm text-wellness-900/70">
              <li className="flex gap-2"><span>✗</span> เช็กลิสต์ที่เที่ยวยอดฮิต · แออัด</li>
              <li className="flex gap-2"><span>✗</span> เหมารวม ไม่ดูสุขภาพรายบุคคล</li>
              <li className="flex gap-2"><span>✗</span> ไม่มีผู้เชี่ยวชาญตรวจสอบ</li>
              <li className="flex gap-2"><span>✗</span> ไม่ปรับตามสภาพร่างกายรายวัน</li>
              <li className="flex gap-2"><span>✗</span> ไม่สนใจชุมชนท้องถิ่น</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-wellness-500 bg-gradient-to-br from-wellness-50 to-white p-5 sm:p-6 shadow-soft">
            <div className="text-xs font-semibold tracking-widest text-wellness-700">RaiWell AI</div>
            <ul className="mt-3 space-y-2 text-sm text-wellness-900">
              <li className="flex gap-2"><span className="text-wellness-600 font-bold">✓</span> 3 เสาหลัก: Eat · Move · Rest</li>
              <li className="flex gap-2"><span className="text-wellness-600 font-bold">✓</span> เฉพาะบุคคลจาก 12+ ปัจจัย</li>
              <li className="flex gap-2"><span className="text-wellness-600 font-bold">✓</span> โค้ชจริง + AI Validated</li>
              <li className="flex gap-2"><span className="text-wellness-600 font-bold">✓</span> เช็กอินรายวัน · AI ปรับเรียลไทม์</li>
              <li className="flex gap-2"><span className="text-wellness-600 font-bold">✓</span> รายได้ตรงสู่ชุมชนท้องถิ่น</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chiang Rai Intelligence Layer */}
      <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-wellness-50 p-6 sm:p-10 shadow-soft">
        <div className="text-center mb-6">
          <div className="badge bg-sky-600 text-white">🧠 CHIANG RAI INTELLIGENCE LAYER</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">ทำไมแอปนี้ต้องใช้ AI</h2>
          <p className="mt-3 text-wellness-900/80 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            <em>"Traditional software can list places. <strong>RaiWell AI reasons across wellness, season, safety, movement, food, privacy, and local context.</strong>"</em>
          </p>
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {[
            "🎯 เป้าหมายสุขภาพ",
            "🍃 ความสนใจอาหาร",
            "🏃 ความพร้อมเคลื่อนไหว",
            "🛏 การนอน + ความเครียด",
            "🌦 ฤดูกาล",
            "💨 ความไวต่อ PM2.5",
            "💧 ความปลอดภัยน้ำ/พื้นที่",
            "🤫 ความชอบเรื่องคนเยอะ",
            "🤝 ผู้ให้บริการท้องถิ่น",
            "👩‍⚕️ การตรวจสอบโดยโค้ช",
            "⚡ พลังงานรายวัน",
            "🌡 ความไม่แน่นอนของอากาศ",
          ].map((f) => (
            <div key={f} className="rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs sm:text-sm text-wellness-800 shadow-soft">
              {f}
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-wellness-700/80 text-center">
          AI ไม่ได้แค่แนะนำสถานที่ — มัน <strong>ใช้เหตุผล</strong> ผสานปัจจัยทั้งหมดเหล่านี้พร้อมกัน
        </p>
      </section>

      {/* Vision quote */}
      <section className="rounded-3xl border border-wellness-200 bg-gradient-to-br from-wellness-700 to-wellness-800 p-6 sm:p-10 text-white shadow-soft">
        <div className="text-5xl sm:text-7xl font-serif leading-none opacity-50">"</div>
        <p className="-mt-2 sm:-mt-4 text-xl sm:text-2xl font-medium leading-snug max-w-3xl">
          เราไม่ได้สร้างแอปท่องเที่ยวทั่วไป เรากำลังสร้าง <span className="underline decoration-wellness-300 decoration-4 underline-offset-4">AI Layer สำหรับ Wellness ที่จริงของเชียงราย</span>
        </p>
        <div className="mt-5 text-sm text-white/70">— วิสัยทัศน์ของ RaiWell AI</div>
      </section>

      {/* Final CTA */}
      <section className="rounded-3xl border border-wellness-100 bg-white p-6 sm:p-10 text-center shadow-soft">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">พร้อมลองด้วยตัวเอง?</h2>
        <p className="mt-2 text-wellness-700/80">โหลดมายา (พนักงานออฟฟิศกรุงเทพ) แล้วดูทริปเชียงราย AI ใน 60 วินาที</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={loadDemo} className="btn-primary text-base">▶ เริ่มเดโมเลย</button>
          <Link href="/demo" className="btn-secondary">โหมดกรรมการ (สคริปต์ 7 ขั้นตอน)</Link>
        </div>
      </section>
    </div>
  );
}
