import type { AdaptiveRecommendation, DailyCheckIn } from "./types";

export function buildAdaptive(c: DailyCheckIn): AdaptiveRecommendation {
  const adjustments: string[] = [];
  const alerts: string[] = [];

  if (c.sleepHours < 6) {
    adjustments.push("Reduce today into recovery mode: replace high-intensity work with an easy nature walk.");
    adjustments.push("Add a 20-minute afternoon recovery block: legs-up-the-wall, gentle stretching, and slow breathing.");
  } else if (c.sleepHours >= 8 && c.energyLevel >= 7) {
    adjustments.push("Energy looks steady: add a light mobility or strength block at RPE 4-5/10 if it feels good.");
  }

  if (c.stressLevel >= 7) {
    adjustments.push("Choose a quiet forest or tea-field pause and a short breathing practice before the next activity.");
    adjustments.push("Swap a busy evening stop for a slow-living cafe or early wind-down.");
  }

  if (c.energyLevel <= 4) {
    adjustments.push("Lower the day load: walking and gentle mobility are enough.");
  }

  if (c.completionPercent < 50) {
    adjustments.push("The plan was probably too full today. Reduce tomorrow's schedule by about one-third.");
  } else if (c.completionPercent >= 90) {
    adjustments.push("Plan completion is strong. Keep the same structure and add only a small optional quiet reward.");
  }

  const painText = (c.pain || "").trim();
  const lower = painText.toLowerCase();
  const isNone = !painText || lower === "none" || lower === "no" || painText === "-";
  if (painText && !isNone) {
    alerts.push(
      `You reported discomfort: "${painText}". Choose lighter activity. If symptoms are severe, persistent, unusual, or worsening, consult a qualified healthcare professional.`
    );
    adjustments.push("Replace strenuous movement with gentle mobility, restorative yoga, or a short flat walk.");
  }

  if (adjustments.length === 0) {
    adjustments.push("You are in a steady zone. Keep the current plan and protect the evening recovery window.");
  }

  const headline =
    alerts.length > 0
      ? "Adaptive plan: recovery-first with professional caution"
      : c.stressLevel >= 7 || c.sleepHours < 6
      ? "Adaptive plan: recovery mode"
      : c.energyLevel >= 7
      ? "Adaptive plan: light green signal"
      : "Adaptive plan: small adjustment for today's readiness";

  return { headline, adjustments, alerts };
}
