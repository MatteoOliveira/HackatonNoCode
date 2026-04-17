"use client";

import { useState } from "react";
import type { PartenaireData } from "@/types/partenaire";

const TAG_COLORS = [
  { bg: "var(--color-bleu-fonce)", color: "#fff" },
  { bg: "var(--color-orange)",     color: "#fff" },
  { bg: "var(--color-rose)",       color: "#fff" },
];

export default function PartenaireCard({ partenaire: p }: { partenaire: PartenaireData }) {
  const [imgErr, setImgErr] = useState(false);
  const initial = p.nom[0]?.toUpperCase() ?? "?";
  const tags = p.tags ?? [];

  return (
    <article
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
    >
      {/* ── Image ── */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "16/9", backgroundColor: p.couleur_theme ?? "var(--color-bleu-fonce)" }}
      >
        {/* Fallback coloré */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl" aria-hidden="true">
          {p.icon ?? "🤝"}
        </div>

        {p.image_url && !imgErr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image_url}
            alt={p.nom}
            onError={() => setImgErr(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
            }}
          />
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="p-4 flex flex-col gap-3">

        {/* Nom + badge */}
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: "var(--color-noir)" }}
          >
            {p.nom}
          </h2>
          {p.badge && (
            <span
              className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full mt-0.5 whitespace-nowrap"
              style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}
            >
              {p.badge}
            </span>
          )}
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            {p.description}
          </p>
        )}

        {/* Tags + icône */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => {
              const style = TAG_COLORS[i % TAG_COLORS.length];
              return (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  #{tag.replace(/^#/, "")}
                </span>
              );
            })}
          </div>

          {/* Icône ronde */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: p.couleur_theme ?? "var(--color-bleu-fonce)" }}
            aria-hidden="true"
          >
            {p.icon ?? initial}
          </div>
        </div>
      </div>
    </article>
  );
}
