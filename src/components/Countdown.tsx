"use client";

import { useEffect, useState } from "react";

const FALLBACK_DATE = new Date("2026-07-11T09:00:00");

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { jours: 0, heures: 0, min: 0, sec: 0 };
  return {
    jours:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    min:    Math.floor((diff / (1000 * 60)) % 60),
    sec:    Math.floor((diff / 1000) % 60),
  };
}

function Pad({ children }: { children: number }) {
  return <>{String(children).padStart(2, "0")}</>;
}

interface Props {
  festivalDate?: string | null;
}

export default function Countdown({ festivalDate }: Props) {
  const target = festivalDate ? new Date(festivalDate) : FALLBACK_DATE;
  const resolvedDate = isNaN(target.getTime()) ? FALLBACK_DATE : target;

  const [time, setTime] = useState(() => getTimeLeft(resolvedDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(resolvedDate)), 1000);
    return () => clearInterval(id);
  }, [resolvedDate]);

  const blocks = [
    { val: time.jours,  label: "Jours" },
    { val: time.heures, label: "Heures" },
    { val: time.min,    label: "Min" },
  ];

  return (
    <div
      className="rounded-2xl p-5 mx-4 relative overflow-hidden"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div
        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-30"
        style={{ backgroundColor: "var(--color-bleu-clair)" }}
        aria-hidden="true"
      />

      <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-noir)" }}>
        PROCHAIN RASSEMBLEMENT
      </p>

      <div className="flex items-center gap-2">
        {blocks.map((b, i) => (
          <div key={b.label} className="flex items-center gap-2">
            <div
              className="flex flex-col items-center justify-center rounded-xl px-5 py-3 min-w-[72px]"
              style={{ backgroundColor: "var(--color-rose)" }}
            >
              <span
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: "var(--font-titre)", color: "var(--color-blanc)" }}
              >
                <Pad>{b.val}</Pad>
              </span>
              <span className="text-xs mt-1 font-medium" style={{ color: "var(--color-blanc)" }}>
                {b.label}
              </span>
            </div>
            {i < blocks.length - 1 && (
              <span className="text-2xl font-bold" style={{ color: "var(--color-rose)" }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
