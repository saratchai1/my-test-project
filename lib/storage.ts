"use client";

import type { CoachReview, DailyCheckIn, UserProfile, WellnessPlan } from "./types";

const KEYS = {
  profile: "raiwell.profile",
  plan: "raiwell.plan",
  coach: "raiwell.coach",
  checkin: "raiwell.checkin",
} as const;

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const store = {
  getProfile: () => safeGet<UserProfile>(KEYS.profile),
  setProfile: (p: UserProfile) => safeSet(KEYS.profile, p),
  getPlan: () => safeGet<WellnessPlan>(KEYS.plan),
  setPlan: (p: WellnessPlan) => safeSet(KEYS.plan, p),
  clearPlan: () => safeRemove(KEYS.plan),
  getCoach: () => safeGet<CoachReview>(KEYS.coach),
  setCoach: (c: CoachReview) => safeSet(KEYS.coach, c),
  clearCoach: () => safeRemove(KEYS.coach),
  getCheckIn: () => safeGet<DailyCheckIn>(KEYS.checkin),
  setCheckIn: (c: DailyCheckIn) => safeSet(KEYS.checkin, c),
  clearAll: () => {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  },
};
