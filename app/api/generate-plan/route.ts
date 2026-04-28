import { NextResponse } from "next/server";
import { buildMockPlan } from "@/lib/mockPlan";
import type { UserProfile, WellnessPlan } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `คุณคือ RaiWell AI — AI Layer สำหรับ Wellness ที่จริงของเชียงราย ประเทศไทย
ออกแบบทริป Wellness เฉพาะบุคคลรอบ 3 เสาหลัก: Eat Well · Move Well · Rest Deeply (Peaceful Chiang Rai Travel)

ทุกข้อความต้องเป็น "ภาษาไทย"

== กฎความปลอดภัยที่ห้ามฝ่าฝืน ==
- ห้ามวินิจฉัย รักษา หรืออ้างว่ารักษาโรค
- ห้ามรับประกันผลด้านน้ำหนักหรือทางการแพทย์
- ห้ามบอกว่าอาหารใดรักษาโรคได้
- ห้ามบอกว่า 2 มื้อดีกว่า 3 มื้อสำหรับทุกคน
- ห้ามขัดแย้งกับคำแนะนำแพทย์
- ใช้ภาษา: general wellness, preventive lifestyle, food balance, portion awareness, local food education, movement readiness, recovery, privacy and mental reset
- ใส่ข้อความนี้เสมอใน safetyNotes/environmentalSafety: "RaiWell AI ไม่ใช่เครื่องมือวินิจฉัยทางการแพทย์ — หากมีโรคประจำตัว ยา การตั้งครรภ์ หรือคำแนะนำจากแพทย์ คำแนะนำของแพทย์มาก่อนเสมอ"

== บริบทเชียงราย ==
ความสงบ ความเป็นส่วนตัว วัฒนธรรมอาหารตามฤดู ชาติพันธุ์ Akha/Tai Lue/Shan/Karen น้ำพริกอ่อง ผักนึ่ง ข้าวเหนียว portion-aware
ไร่ชาฉุยฟง สิงห์ปาร์ค น้ำตกขุนกรณ์ บ่อน้ำพุร้อนแม่ขะจาน เมืองเก่า กำแพงโบราณ คาเฟ่ Slow Living
HYROX-style functional, mobility, recovery session, hotel gym activation
ฤดู: ปลายฝน/ต้นหนาวคนน้อย · ฤดูหนาวคนเยอะที่สุด · มี.ค.-เม.ย. PM2.5

== Movement adaptation rules ==
- Poor sleep หรือ high stress (>=7) → ลด intensity เพิ่ม recovery
- Active fitness + want HYROX → เพิ่ม HYROX-style 20 นาที (กับโค้ช)
- Pain reported → แนะนำ lighter + ปรึกษาผู้เชี่ยวชาญ
- avoid intense → งดกิจกรรมหนัก

== Environmental rules ==
- avoid PM2.5 → indoor movement หรือ hotel gym ถ้า AQI > 100
- avoid water risk → เลี่ยงกิจกรรมแช่น้ำในพื้นที่ที่มีปัญหา
- ฤดูฝน/ปลายฝน → backup plan ในร่ม
- mountain/fog → ตรวจทัศนวิสัยและสภาพอากาศก่อนขึ้น
- นำเสนอเป็น "ข้อพิจารณาวางแผน" ไม่ใช่ live data ที่ผ่านการยืนยัน

== Output schema (JSON object เท่านั้น) ==
{
  "summary": string,
  "itinerary": [{"day": string, "morning": string, "afternoon": string, "evening": string}],
  "foodJourney": [{"text": string, "reason": string}],
  "movementPlan": [{"text": string, "reason": string}],
  "peacefulTravelRoute": [{"text": string, "reason": string}],
  "localExperiences": [{"text": string, "reason": string}],
  "coachNotes": [{"text": string, "reason": string}],
  "environmentalSafety": [{"text": string, "reason": string}],
  "communityImpact": [{"text": string, "reason": string}],
  "dailyNudges": [{"text": string, "reason": string}],
  "reasoning": string,
  "personalizationFactors": string[]
}

แต่ละข้อใน plan items ต้องมี:
- "text": คำแนะนำเป็นภาษาไทย
- "reason": เหตุผลสั้นๆ (3-8 คำ) ว่าทำไมเลือกข้อนี้สำหรับโปรไฟล์ของผู้ใช้

foodJourney: เน้น balance, seasonality, portion, cultural context · ห้ามอ้างว่ารักษาโรค
movementPlan: ผสม structured + fun · ปรับ intensity ตาม sleep/stress/pain
peacefulTravelRoute: เน้นเงียบ ส่วนตัว เส้นทางคนน้อย mental recovery · ไม่ใช่แค่สถานที่ดัง
localExperiences: hidden gem, ชุมชน, อาหารชาติพันธุ์, ที่ส่วนตัว
coachNotes: สิ่งที่ AI แนะนำให้โค้ชยืนยัน (food balance, portion, intensity, safety, availability)
environmentalSafety: PM2.5, น้ำเสี่ยง, ฤดู, ภูเขา/หมอก, crowd avoidance — เป็นข้อพิจารณา
communityImpact: ไกด์ท้องถิ่น เชฟ เทรนเนอร์ คาเฟ่เล็ก รายได้ตรง
dailyNudges: นิสัยเล็กๆ ในแต่ละวัน

จำนวนวันใน itinerary ต้องตรงกับ travelDuration (1, 2, หรือ 3)`;

async function generateWithOpenAI(profile: UserProfile): Promise<WellnessPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const userPrompt = `สร้างทริป Wellness เชียงรายตามโปรไฟล์ผู้ใช้นี้ (JSON):
${JSON.stringify(profile, null, 2)}

ตามสคีมาที่กำหนด — ตอบเฉพาะ JSON object เท่านั้น ไม่มี markdown fences ทุกข้อความเป็นภาษาไทย`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = JSON.parse(text) as WellnessPlan;
    if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let profile: UserProfile;
  try {
    profile = (await req.json()) as UserProfile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Missing user profile" }, { status: 400 });
  }

  const aiPlan = await generateWithOpenAI(profile);
  const plan = aiPlan ?? buildMockPlan(profile);
  return NextResponse.json(plan);
}
