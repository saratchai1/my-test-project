"use client";

import { useEffect, useState } from "react";
import { buildAdaptive } from "@/lib/adapt";
import { store } from "@/lib/storage";
import type { AdaptiveRecommendation, DailyCheckIn } from "@/lib/types";

const DEFAULT: DailyCheckIn = {
  sleepHours: 6,
  energyLevel: 6,
  stressLevel: 5,
  completionPercent: 70,
  pain: "",
};

export default function CheckIn() {
  const [c, setC] = useState<DailyCheckIn>(DEFAULT);
  const [rec, setRec] = useState<AdaptiveRecommendation | null>(null);

  useEffect(() => {
    const saved = store.getCheckIn();
    if (saved) {
      setC(saved);
      setRec(buildAdaptive(saved));
    }
  }, []);

  function update<K extends keyof DailyCheckIn>(k: K, v: DailyCheckIn[K]) {
    setC((p) => ({ ...p, [k]: v }));
  }

  function submit() {
    store.setCheckIn(c);
    setRec(buildAdaptive(c));
  }

  return (
    <section className="card">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="badge bg-sky-100 text-sky-600">Adaptive AI</div>
          <h2 className="mt-2 text-xl font-semibold">Daily check-in</h2>
          <p className="text-sm text-wellness-700/80 mt-1 leading-relaxed">
            Tell RaiWell how today felt. The next recommendation adapts to sleep, energy, stress, completion, and discomfort.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Sleep: <span className="text-wellness-600">{c.sleepHours} hours</span></label>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={c.sleepHours}
            onChange={(e) => update("sleepHours", Number(e.target.value))}
            className="w-full accent-wellness-600"
          />
        </div>
        <div>
          <label className="label">Energy: <span className="text-wellness-600">{c.energyLevel}/10</span></label>
          <input
            type="range"
            min={1}
            max={10}
            value={c.energyLevel}
            onChange={(e) => update("energyLevel", Number(e.target.value))}
            className="w-full accent-wellness-600"
          />
        </div>
        <div>
          <label className="label">Stress: <span className="text-wellness-600">{c.stressLevel}/10</span></label>
          <input
            type="range"
            min={1}
            max={10}
            value={c.stressLevel}
            onChange={(e) => update("stressLevel", Number(e.target.value))}
            className="w-full accent-wellness-600"
          />
        </div>
        <div>
          <label className="label">Plan completed: <span className="text-wellness-600">{c.completionPercent}%</span></label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={c.completionPercent}
            onChange={(e) => update("completionPercent", Number(e.target.value))}
            className="w-full accent-wellness-600"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="label">Any pain, discomfort, or unusual symptoms?</label>
        <input
          className="input"
          placeholder="Example: mild knee discomfort after walking, or 'none'"
          value={c.pain}
          onChange={(e) => update("pain", e.target.value)}
        />
      </div>

      <div className="mt-5">
        <button className="btn-primary" onClick={submit}>
          Generate adaptive recommendation
        </button>
      </div>

      {rec && (
        <div className="mt-6 rounded-2xl border border-wellness-200 bg-wellness-50 p-5">
          <div className="text-sm font-semibold text-wellness-800">{rec.headline}</div>
          {rec.alerts.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {rec.alerts.map((a, i) => (
                <li key={i} className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  {a}
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-3 space-y-1.5 list-disc pl-5 text-sm text-wellness-900/85">
            {rec.adjustments.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-wellness-700/75 leading-relaxed">
            This is general wellness guidance only. It is not medical diagnosis or treatment advice.
          </p>
        </div>
      )}
    </section>
  );
}
