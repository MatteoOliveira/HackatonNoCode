"use client";

import { useEffect, useState } from "react";

const FESTIVAL_DATE = new Date("2026-07-11T09:00:00");

function getTimeLeft() {
  const diff = FESTIVAL_DATE.getTime() - Date.now();
  if (diff <= 0) return { jours: 0, heures: 0, min: 0, sec: 0 };
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    min: Math.floor((diff / (1000 * 60)) % 60),
    sec: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ children }: { children: number }) {
  return <>{String(children).padStart(2, "0")}</>;
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { val: time.jours, label: "Jours" },
    { val: time.heures, label: "Heures" },
    { val: time.min, label: "Min" },
  ];

  return (
    <div
      className="rounded-2xl p-5 mx-4 relative overflow-hidden"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {/* Déco bleue en bas à droite */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-30"
        style={{ backgroundColor: "var(--color-bleu-clair)" }}
        aria-hidden="true"
      />

      <p
        className="text-xs font-bold tracking-widest mb-4"
        style={{ color: "var(--color-noir)" }}
      >
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
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: "var(--color-blanc)" }}
              >
                {b.label}
              </span>
            </div>
            {i < blocks.length - 1 && (
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--color-rose)" }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
