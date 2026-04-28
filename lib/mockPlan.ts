import type { PlanItem, UserProfile, WellnessPlan } from "./types";

function dayCount(d: UserProfile["travelDuration"]): number {
  if (d === "1 day") return 1;
  if (d === "3 days") return 3;
  return 2;
}

const ALL_DAYS = [
  {
    day: "วันที่ 1 — มาถึงและรีเซ็ต",
    morning:
      "เดินเบาๆ รอบทะเลสาบสิงห์ปาร์ค (45 นาที) เส้นทางคนน้อยตอนเช้า ฝึกหายใจ 4-7-8 เพื่อปรับระบบประสาทให้สงบ",
    afternoon:
      "มื้อเที่ยงแบบล้านนาออร์แกนิก: น้ำพริกอ่อง + ผักลวกตามฤดู + ปลาแม่น้ำนึ่ง + ข้าวเหนียวพอประมาณ พักผ่อนหนึ่งชั่วโมงที่คาเฟ่ Slow-living ริมน้ำกก",
    evening:
      "Mobility flow 20 นาที + แช่เท้าน้ำสมุนไพรไทยอุดมแมกนีเซียมที่บูทีคใกล้แม่ฟ้าหลวง ปิดไฟภายใน 22:00 น.",
  },
  {
    day: "วันที่ 2 — ฟื้นฟูและเคลื่อนไหวอย่างมีจังหวะ",
    morning:
      "ขึ้นไร่ชาฉุยฟงเส้นทางคนน้อย (เลือกเวลาก่อน 8:00) เดินสมาธิ 30 นาที แล้วทดสอบ Functional Fit สั้นๆ HYROX-style 12 นาที (กับโค้ช)",
    afternoon:
      "อาหารกลุ่มชาติพันธุ์ Tai Lue / Akha — สลัดเครื่องในผัก + ไข่ต้ม + ขนมจีนน้ำเงี้ยวรสกลาง อาบป่าที่เส้นทางน้ำตกขุนกรณ์ (ตรวจระดับน้ำก่อน)",
    evening:
      "อบไอน้ำสลับน้ำเย็น ยืดเหยียด 15 นาที ดื่มชาคาโมมายล์-เตยหอม จดบันทึก 3 สิ่งที่ทำให้ใจสงบในวันนี้",
  },
  {
    day: "วันที่ 3 — บูรณาการและพากลับบ้าน",
    morning:
      "เดินไตร่ตรองที่กำแพงเมืองเก่าเชียงราย (Old City) ก่อนนักท่องเที่ยวมาถึง Mobility 20 นาทีหันหน้าสู่แม่น้ำ",
    afternoon:
      "คลาสทำอาหารกับเชฟท้องถิ่น: ยำหัวปลี + ไก่ย่างสมุนไพรน้อยพริก + ข้าวกล้อง พบเกษตรกรผู้ปลูกผักออร์แกนิก",
    evening:
      "ขับรถสั้นไปคาเฟ่วิวเงียบเพื่อชมพระอาทิตย์ตกแบบดิจิทัลดีท็อกซ์ จัดแผนนิสัย 5 ข้อกลับไปทำที่บ้าน",
  },
];

function R(text: string, reason?: string): PlanItem {
  return reason ? { text, reason } : { text };
}

export function buildMockPlan(profile: UserProfile): WellnessPlan {
  const days = dayCount(profile.travelDuration);
  const itinerary = ALL_DAYS.slice(0, days);

  const stressed = profile.stressLevel >= 7;
  const poorSleep = profile.sleepQuality === "poor";
  const isActive = profile.fitnessLevel === "active";
  const isBeginner = profile.fitnessLevel === "beginner";
  const avoidSpicy =
    profile.healthConstraints?.toLowerCase().includes("เผ็ด") ||
    profile.healthConstraints?.toLowerCase().includes("spicy");

  const wantsHyrox = profile.movementPreferences.includes("HYROX-style");
  const wantsTrail = profile.movementPreferences.includes("trail running");
  const wantsRecovery = profile.movementPreferences.includes("recovery session");
  const wantsFun = profile.movementPreferences.includes("fun social sport");
  const wantsSurprise = profile.foodInterests.includes("surprise local food");
  const wantsFermented = profile.foodInterests.includes("fermented/local probiotic");
  const wantsPlant = profile.foodInterests.includes("plant-forward");
  const wantsHighProtein = profile.foodInterests.includes("high protein");

  const strongAvoidCrowds = profile.privacyPreference === "strongly avoid crowds";
  const preferQuiet = profile.privacyPreference !== "ok with popular";
  const hasPM25 = profile.riskSensitivities.includes("avoid PM2.5");
  const hasWaterRisk = profile.riskSensitivities.includes("avoid water risk");
  const avoidIntense = profile.riskSensitivities.includes("avoid intense");

  // ============ FOOD JOURNEY ============
  const foodJourney: PlanItem[] = [
    R(
      "เริ่มมื้อด้วยน้ำพริกอ่อง + ผักนึ่งตามฤดู (กระถิน, ผักกาด, ฟักทอง) — เน้นสมดุลผัก-โปรตีน-คาร์บ",
      "วัฒนธรรมอาหารเหนือ + เน้นสมดุลพอร์ชั่น"
    ),
    wantsFermented
      ? R(
          "ลองอาหารหมักท้องถิ่น: ถั่วเน่า, ผักดอง, น้ำหมักมะม่วง — ปริมาณน้อยเพื่อสนับสนุนสุขภาพลำไส้ตามภูมิปัญญาท้องถิ่น",
          "อาหารหมัก / โปรไบโอติก"
        )
      : R(
          "ผักดองเล็กน้อยข้างมื้อ (แตงกวาดอง, ผักกาดดอง) — ใช้เป็นเครื่องเคียงเพื่อความสมดุล",
          "ภูมิปัญญาอาหารเหนือ"
        ),
    wantsHighProtein
      ? R(
          "โปรตีนต่อมื้อ: ปลาน้ำจืด, ไก่ย่างสมุนไพร, ไข่ต้ม, เต้าหู้ — เน้น 25–35 กรัม/มื้อ",
          "อาหาร: โปรตีนสูง"
        )
      : R("โปรตีนปานกลาง: ปลา/ไข่/เต้าหู้ ขนาดเท่าฝ่ามือ"),
    wantsPlant
      ? R(
          "เพิ่มผักท้องถิ่นต่อมื้อ: ผักหวานป่า, ดอกแค, มะเขือเปราะ ใช้น้ำมันน้อย",
          "อาหาร: เน้นพืช"
        )
      : R("เพิ่มผักท้องถิ่นต่อมื้อให้ครอบคลุมครึ่งจาน"),
    R(
      "ข้าวเหนียวเป็น 'อาหารวัฒนธรรม' — แนะนำพอร์ชั่นประมาณ 1/2 กำมือต่อมื้อ ทานพร้อมโปรตีนและผัก เพื่อชะลอน้ำตาล",
      "Portion awareness ตามวัฒนธรรม"
    ),
    R(
      "ลองความหลากหลายของอาหารชาติพันธุ์: Akha, Tai Lue, Shan, Karen — เป็นการเรียนรู้วัฒนธรรมผ่านอาหาร",
      "Local food education"
    ),
    avoidSpicy
      ? R(
          "หมายเหตุร้านอาหาร: สั่ง 'ไม่เผ็ด / เผ็ดน้อย' ทุกมื้อ — เลือกเมนูเหนือที่รสกลมกล่อมเช่น แกงฮังเล, น้ำเงี้ยว",
          `ข้อจำกัด: ${profile.healthConstraints}`
        )
      : R("สั่งรสกลาง แชร์เมนูหลายอย่างเพื่อความหลากหลายของสารอาหาร"),
    wantsSurprise
      ? R(
          "🎁 อาหารเซอร์ไพรส์ 1 มื้อ — เชฟท้องถิ่นจะเลือกเมนูตามฤดูและวัตถุดิบในวัน (ไม่บอกล่วงหน้า)",
          "อาหารท้องถิ่นแบบเซอร์ไพรส์"
        )
      : R("ดื่มน้ำ 2.5–3 ลิตร เติมเกลือสีชมพู + มะนาวเล็กน้อย"),
  ];

  // ============ MOVEMENT PLAN ============
  const movementPlan: PlanItem[] = [
    R(
      "เดิน Zone-2 ในธรรมชาติ 30–45 นาที/วัน (ชีพจรเป้าหมาย 110–125 ครั้ง/นาที)",
      `ระดับฟิตเนส: ${profile.fitnessLevel}`
    ),
    avoidIntense || (poorSleep && !isActive)
      ? R(
          "งดออกกำลังหนัก เปลี่ยนเป็นโยคะหยินเบาๆ 15 นาทีก่อนนอน",
          poorSleep ? "นอนไม่ดี — ลดความเข้มข้น" : "ผู้ใช้เลือกเลี่ยงกิจกรรมหนัก"
        )
      : wantsHyrox && (isActive || profile.fitnessLevel === "moderate")
      ? R(
          "HYROX-style functional 20 นาที (กับโค้ช): sled push เบา, sandbag carry, wall ball, run 200m × 3 รอบ",
          "ผู้ใช้ชอบ HYROX + ฟิตเนสรับได้"
        )
      : isActive
      ? R("Zone-2 ยาว 45 นาที + 15 นาที strength bodyweight")
      : isBeginner
      ? R("ยืดเหยียด + เดินสำรวจรอบที่พัก 15 นาที สลับวัน", "ระดับฟิตเนส: เริ่มต้น")
      : R("Bodyweight circuit 15 นาที — squat / hinge / push / pull"),
    wantsTrail && !poorSleep
      ? R(
          "เตรียมความพร้อมเทรล: เดินขึ้น-ลงเนิน 25 นาที ขุนกรณ์ trail (ตรวจสภาพอากาศก่อน)",
          "ผู้ใช้ชอบ trail running"
        )
      : R("Mobility: ท่าสะโพก + อกบน 10 นาที/เช้า ทุกวัน"),
    wantsFun
      ? R(
          "กิจกรรมสนุกแบบกลุ่ม: Spike ball / racket sports เบาๆ 20 นาที (ทางเลือก)",
          "ผู้ใช้ชอบกีฬาสังสรรค์"
        )
      : R("เดินหลังอาหารเย็น 8–10 นาที ช่วยย่อยและลดความเครียด"),
    wantsRecovery || stressed
      ? R(
          "Recovery session 30 นาที: foam rolling + breathwork 5-5-7 + leg-up-the-wall",
          stressed ? `ความเครียด ${profile.stressLevel}/10` : "ผู้ใช้ขอ Recovery"
        )
      : R("Mobility ก่อนนอน 5 นาที"),
    R(
      "Hotel gym activation: หากที่พักมียิม เปิดเซสชั่นกับเทรนเนอร์ 30 นาที (สำรองได้ที่ฟรอนต์)",
      "ใช้ทรัพยากรโรงแรม"
    ),
  ];

  // ============ PEACEFUL TRAVEL ROUTE ============
  const peacefulTravelRoute: PlanItem[] = [
    R(
      "ไร่ชาฉุยฟง — แนะนำมาก่อน 8:00 น. เพื่อหลีกเลี่ยงนักท่องเที่ยว เดินช้าๆ ระหว่างแถวชา หายใจช้า",
      strongAvoidCrowds ? "เลี่ยงคนเยอะ" : "เส้นทางเงียบ"
    ),
    R(
      "สิงห์ปาร์ค ทางเดินรอบทะเลสาบ — เส้นทางเดินธรรมชาติเรียบ 4 กม. ดีสำหรับ Zone-2",
      "เน้นสุขภาพจิต + เดินเบา"
    ),
    R(
      "คาเฟ่ Slow-living ริมแม่น้ำกก — ชั่วโมงอ่านหนังสือ ปิด Wi-Fi เพื่อ digital detox",
      profile.travelMoods.includes("digital detox") ? "Digital Detox" : "พื้นที่เงียบ"
    ),
    R(
      "บ่อน้ำพุร้อนแม่ขะจาน (เลือกบ่อส่วนตัว) — แช่ 15 นาทีก่อนเข้านอน ช่วยคลายกล้ามเนื้อ",
      "บ่อน้ำพุร้อน + privacy"
    ),
    R(
      "ขั้นบันไดนาขั้นบันไดบ้านป่าบงงาม — มุมที่นักท่องเที่ยวยังน้อย",
      "Hidden Gem · Rice terraces"
    ),
    R(
      "กำแพงเมืองเก่าเชียงราย (Old City) — เดินเช้าก่อนนักท่องเที่ยว จิบกาแฟท้องถิ่น",
      "Historical · low-crowd"
    ),
    profile.travelMoods.includes("local village")
      ? R(
          "หมู่บ้านชาติพันธุ์ Akha / Tai Lue — เยี่ยมแบบเคารพชุมชน ผ่านไกด์ท้องถิ่นที่ได้รับความเห็นชอบ",
          "ชุมชนท้องถิ่น"
        )
      : R("เส้นทางเดินริมน้ำกก 2 กม. — เงียบ ไม่ค่อยมีคน"),
    preferQuiet
      ? R("งดวัดดังในชั่วโมง peak — ถ้าจะไป ไปก่อน 7:30 น. ที่วัดร่องเสือเต้น",
          "เลือก privacy เป็นหลัก")
      : R("เลือกเวลานอกชั่วโมง peak สำหรับสถานที่ยอดนิยม"),
  ];

  // ============ LOCAL EXPERIENCE / HIDDEN GEM ============
  const localExperiences: PlanItem[] = [
    R(
      "อาหารกลุ่มชาติพันธุ์ Tai Lue ที่บ้านในชุมชน — มื้อบ้าน-คน-ชา จัดโดยครอบครัวท้องถิ่น (ผ่าน RaiWell network)",
      "Hidden Gem · Local food"
    ),
    R(
      "เดินเก็บผักป่ากับชาวบ้าน 1 ชั่วโมง แล้วทำอาหารร่วมกัน (ตามฤดู)",
      "Seasonal · Community-led"
    ),
    R(
      "คาเฟ่ในไร่ชาส่วนตัว — เปิดเฉพาะนัดล่วงหน้า ไม่อยู่ในแอป map ทั่วไป",
      "Quiet · Private"
    ),
    R(
      "Recovery walk + tea ceremony กับเจ้าของไร่ชาขนาดเล็ก",
      "Mental recovery"
    ),
    R(
      "ชวนเซอร์ไพรส์: 1 ประสบการณ์ที่จะไม่เปิดเผยล่วงหน้า — โค้ชเลือกตามวันและสภาพอากาศ",
      "Surprise — เพิ่มความตื่นเต้น"
    ),
  ];

  // ============ COACH NOTES (AI suggestions for the coach) ============
  const coachNotes: PlanItem[] = [
    R(
      `ความเครียด ${profile.stressLevel}/10 และนอน ${profile.sleepQuality} — ขอให้โค้ชยืนยันว่าเริ่มที่ความเข้มข้น 'เบา' ก่อน`,
      "Stress + Sleep flag"
    ),
    R(
      "ตรวจสอบสมดุลอาหาร: ผัก 1/2 จาน, โปรตีน 1/4 จาน, คาร์บ 1/4 จาน, ข้าวเหนียว ≤ 1/2 กำมือ/มื้อ",
      "Food balance check"
    ),
    wantsHyrox
      ? R("ก่อน HYROX-style ให้ทดสอบ heart rate และ mobility 5 นาที — หยุดทันทีถ้าหายใจไม่ทัน",
          "Movement intensity safety")
      : R("Movement เริ่มต้นที่ Zone-2 — ขอให้โค้ชยืนยันชีพจรเป้าหมายก่อนเริ่ม"),
    R(
      "Meal timing: มื้อสุดท้ายไม่ดึกกว่า 19:00 น. เพื่อสนับสนุนการนอน",
      "Meal timing"
    ),
    R(
      "Hidden gem ที่แนะนำ: คาเฟ่ในไร่ชาส่วนตัว + Tai Lue home meal — ขอให้โค้ชยืนยันความพร้อมของผู้ให้บริการ",
      "Local availability check"
    ),
  ];

  // ============ ENVIRONMENTAL & SAFETY CONSIDERATIONS ============
  const env: PlanItem[] = [];
  if (hasPM25 || profile.season === "hot" || profile.season === "late rainy / early winter") {
    env.push(
      R(
        "🟡 PM2.5 ในเชียงรายอาจสูงในบางช่วง (โดยเฉพาะ ก.พ.–เม.ย.) — เช็กค่าทุกเช้า ถ้า AQI > 100 ย้ายการเคลื่อนไหวเข้ายิมโรงแรม",
        "ข้อมูลตามแผน — ตรวจสอบจริงก่อนเดินทาง"
      )
    );
  }
  if (hasWaterRisk) {
    env.push(
      R(
        "🟡 พื้นที่ปลายน้ำกก/แม่กกบางช่วงอาจมีปัญหาคุณภาพน้ำตามฤดู — เลี่ยงกิจกรรมแช่น้ำ และเลือกร้านอาหารที่ใช้น้ำดื่มกรอง",
        "ข้อจำกัด: เลี่ยงพื้นที่น้ำไม่ปลอดภัย"
      )
    );
  }
  if (profile.season === "rainy" || profile.season === "late rainy / early winter") {
    env.push(
      R(
        "🌧️ ฤดูฝน/ปลายฝน: เตรียมแผนสำรองในร่ม (โรงแรมยิม, ห้องสมุดท้องถิ่น) สำหรับ 2 ใน 3 ของกิจกรรมกลางแจ้ง",
        `ฤดู: ${profile.season}`
      )
    );
  }
  if (profile.travelMoods.includes("nature recovery") || wantsTrail) {
    env.push(
      R(
        "ภูเขา/หมอก: ตรวจทัศนวิสัยและสภาพถนนทุกเช้าก่อนขึ้นเขา ถ้าหมอกจัด เลื่อนเป็นช่วงสาย",
        "Mountain/fog safety"
      )
    );
  }
  if (strongAvoidCrowds) {
    env.push(
      R(
        "เลือกเวลาเดินทางก่อน 8:00 น. หรือหลัง 16:00 น. สำหรับสถานที่ทุกแห่ง",
        "Privacy: เลี่ยงคนเยอะมาก"
      )
    );
  }
  env.push(
    R(
      "RaiWell แสดงข้อมูลเหล่านี้เป็น 'ข้อพิจารณาวางแผน' ไม่ใช่ live data ที่ผ่านการยืนยัน — ให้ตรวจสอบจริงก่อนเดินทาง",
      "ความโปร่งใส"
    )
  );

  // ============ COMMUNITY IMPACT ============
  const communityImpact: PlanItem[] = [
    R(
      "ใช้ไกด์ท้องถิ่นที่ได้รับการยืนยัน 1 คนต่อทริป — รายได้ตรงสู่ชุมชน",
      "Local guide direct"
    ),
    R(
      "เลือกร้านอาหารและคาเฟ่ขนาดเล็กที่ดำเนินงานโดยเจ้าของท้องถิ่น 70%+",
      "Small business support"
    ),
    R(
      "1 มื้อต่อทริปเป็นมื้อบ้านชาติพันธุ์ — รายได้ 100% ไปครัวเรือน",
      "Direct income · Cultural exchange"
    ),
    R(
      "Trainer ท้องถิ่นสำหรับ HYROX/recovery session — สร้างอาชีพในเมือง",
      "Local trainer"
    ),
    R(
      "RaiWell Network: ลดตัวกลาง เชื่อมนักท่องเที่ยวกับผู้ให้บริการในชุมชนโดยตรง",
      "Less middlemen"
    ),
  ];

  // ============ DAILY NUDGES ============
  const dailyNudges: PlanItem[] = [
    R("รับแสงแดดเช้าเข้าตา 5 นาที — anchor นาฬิกาชีวิต"),
    R("ทานผักก่อน ทานข้าวทีหลัง — ชะลอการขึ้นน้ำตาล"),
    R("เปิดโหมดเครื่องบิน 30 นาทีก่อนเข้านอน",
      poorSleep ? "เน้นคุณภาพการนอน" : undefined),
    stressed
      ? R("เครียด: หายใจออก 2 เท่าของหายใจเข้า × 3 รอบ", `ความเครียด ${profile.stressLevel}/10`)
      : R("จิบน้ำช้าๆ 2 อึกก่อนทุกมื้อ"),
    R("เดินหลังอาหาร 8 นาที — ก็ได้ผล"),
  ];

  const personalizationFactors = [
    `อายุ ${profile.age}`,
    `ฟิตเนส ${profile.fitnessLevel}`,
    `เครียด ${profile.stressLevel}/10`,
    `นอน ${profile.sleepQuality}`,
    `อาหาร ${profile.foodInterests.join(", ") || profile.foodPreference}`,
    `งบ ${profile.budget}`,
    `ฤดู ${profile.season}`,
    `Privacy ${profile.privacyPreference}`,
    ...(profile.movementPreferences.length ? [`Movement ${profile.movementPreferences.join(", ")}`] : []),
    ...(profile.travelMoods.length ? [`Mood ${profile.travelMoods.join(", ")}`] : []),
    ...(profile.riskSensitivities.length ? [`Risk ${profile.riskSensitivities.join(", ")}`] : []),
    ...(profile.healthConstraints ? [`ข้อจำกัด: ${profile.healthConstraints}`] : []),
  ];

  const reasoning = `ทริปเชียงราย ${days} วันสำหรับ ${profile.name || "คุณ"} (อายุ ${
    profile.age
  }, ฟิตเนส: ${profile.fitnessLevel}) ปรับตาม ${personalizationFactors.length} ปัจจัย — เริ่มที่ความเข้มข้นเบาเพราะความเครียด ${
    profile.stressLevel
  }/10 และคุณภาพการนอน ${
    profile.sleepQuality
  } เลือกเส้นทางเงียบและคนน้อยตาม Privacy: ${profile.privacyPreference} อาหารเน้นวัฒนธรรมเหนือ + balance พอร์ชั่น (ไม่ใช่ข้อกำหนด diet) Movement ผสมระหว่างเดิน Zone-2 และ ${
    wantsHyrox ? "HYROX-style functional ที่โค้ชยืนยันแล้ว" : "mobility/walking"
  } พิจารณาฤดู (${profile.season}) และความเสี่ยงสิ่งแวดล้อมที่คุณระบุ — แผนนี้เป็นการสนับสนุนไลฟ์สไตล์เชิงป้องกัน ออกแบบให้โค้ชผู้เชี่ยวชาญตรวจสอบสมดุลอาหาร ความเข้มข้น และความปลอดภัยก่อนใช้จริง`;

  const summary = `ทริป Wellness เชียงราย ${days} วัน · Eat Well · Move Well · Rest Deeply · ${
    profile.name || "คุณ"
  } (เครียด ${profile.stressLevel}/10, นอน ${profile.sleepQuality}, ${profile.privacyPreference})`;

  return {
    summary,
    itinerary,
    foodJourney,
    movementPlan,
    peacefulTravelRoute,
    localExperiences,
    coachNotes,
    environmentalSafety: env,
    communityImpact,
    dailyNudges,
    reasoning,
    personalizationFactors,
  };
}
