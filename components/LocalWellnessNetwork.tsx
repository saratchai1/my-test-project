"use client";

type Card = {
  icon: string;
  name: string;
  purpose: string;
  duration: string;
  crowd: "ต่ำ" | "ปานกลาง" | "สูง";
  impact: string;
};

const CARDS: Card[] = [
  {
    icon: "🌿",
    name: "พี่นนท์ · ไกด์เส้นทางธรรมชาติเงียบ",
    purpose: "เดินรับธรรมชาติ + Mental recovery",
    duration: "3 ชม.",
    crowd: "ต่ำ",
    impact: "รายได้ตรงสู่ไกด์ท้องถิ่น",
  },
  {
    icon: "🍲",
    name: "ป้าแสงดา · เชฟอาหารเหนือตามฤดู",
    purpose: "อาหาร Tai Lue + ผักจากสวนหลังบ้าน",
    duration: "1.5 ชม.",
    crowd: "ต่ำ",
    impact: "100% รายได้สู่ครัวเรือน",
  },
  {
    icon: "🏋️",
    name: "โค้ชเอิร์ธ · HYROX-style Functional",
    purpose: "Coach-led training + recovery",
    duration: "60 นาที",
    crowd: "ต่ำ",
    impact: "เทรนเนอร์ในเมืองเชียงราย",
  },
  {
    icon: "🚶",
    name: "Recovery Walk · Digital Detox Route",
    purpose: "เดินเงียบ + ปิดมือถือ",
    duration: "90 นาที",
    crowd: "ต่ำ",
    impact: "เส้นทางที่ดูแลโดยชุมชน",
  },
  {
    icon: "☕",
    name: "ไร่ชาพี่อ้อย · Slow Cafe ส่วนตัว",
    purpose: "Tea ceremony + พักใจ",
    duration: "2 ชม.",
    crowd: "ต่ำ",
    impact: "ธุรกิจขนาดเล็กในชุมชน",
  },
  {
    icon: "🧘",
    name: "ครูฝน · Yin Yoga + Breathwork",
    purpose: "Recovery + นอนดี",
    duration: "75 นาที",
    crowd: "ต่ำ",
    impact: "ครูท้องถิ่น · ไม่ผ่านตัวกลาง",
  },
];

function CrowdPill({ level }: { level: Card["crowd"] }) {
  const color =
    level === "ต่ำ"
      ? "bg-wellness-100 text-wellness-800"
      : level === "ปานกลาง"
      ? "bg-amber-100 text-amber-800"
      : "bg-rose-100 text-rose-800";
  return <span className={`badge ${color}`}>คนเยอะ: {level}</span>;
}

export default function LocalWellnessNetwork() {
  return (
    <section className="card border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="badge bg-emerald-100 text-emerald-800">🤝 LOCAL WELLNESS NETWORK · MOCK</div>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">เครือข่ายผู้ให้บริการท้องถิ่น</h2>
          <p className="text-sm text-wellness-700/85 mt-1 max-w-2xl leading-relaxed">
            RaiWell เชื่อมนักท่องเที่ยวกับไกด์ท้องถิ่น เชฟ เทรนเนอร์ และคาเฟ่ขนาดเล็กที่ผ่านการยืนยัน
            — รายได้ตรง ลดตัวกลาง สนับสนุนชุมชนเชียงราย
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <div key={i} className="rounded-2xl border border-wellness-100 bg-white p-4 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="text-2xl">{c.icon}</div>
              <CrowdPill level={c.crowd} />
            </div>
            <div className="mt-2 font-semibold text-sm leading-snug">{c.name}</div>
            <div className="mt-1 text-xs text-wellness-700/80 leading-relaxed">{c.purpose}</div>
            <div className="mt-3 pt-3 border-t border-wellness-100 flex items-center justify-between text-[11px] text-wellness-700/70">
              <span>⏱ {c.duration}</span>
              <span>🤝 {c.impact}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-900 leading-relaxed">
        <strong>เวอร์ชันถัดไป:</strong> RaiWell จะเชื่อมนักท่องเที่ยวกับไกด์ท้องถิ่นและผู้ให้บริการ Wellness ที่ผ่านการยืนยันโดยตรง
        — ลดตัวกลางและกระจายรายได้สู่ชุมชนได้ดียิ่งขึ้น
      </div>
    </section>
  );
}
