"use client";

import Image from "next/image";
import { useState } from "react";

interface Partenaire {
  id: string;
  nom: string;
  badge: string;
  description: string;
  tags: string[];
  iconBg: string;
  iconEmoji: string;
  imageFallbackBg: string;
  imageFallbackEmoji: string;
  imageAlt: string;
}

export default function PartenaireCard({ partenaire: p }: { partenaire: Partenaire }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="mb-6 mx-4 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "#fff" }}>
      {/* ── Photo ── */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ backgroundColor: p.imageFallbackBg }}
          aria-hidden="true"
        >
          {p.imageFallbackEmoji}
        </div>
        {!imgError && (
          <Image
            src={`/images/partenaire-${p.id}.jpg`}
            alt={p.imageAlt}
            fill
            className="object-cover relative z-10"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="p-4">
        {/* Nom + badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: "var(--color-bleu-fonce)" }}
          >
            {p.nom}
          </h2>
          <span
            className="shrink-0 text-xs font-medium px-3 py-1 rounded-full mt-0.5"
            style={{
              backgroundColor: "var(--color-rose)",
              color: "var(--color-blanc)",
              whiteSpace: "nowrap",
            }}
          >
            {p.badge}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 opacity-70"
          style={{ color: "var(--color-noir)" }}
        >
          {p.description}
        </p>

        {/* Tags + icône */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--color-orange)",
                  color: "var(--color-blanc)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Icône ronde */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: p.iconBg }}
            aria-hidden="true"
          >
            {p.iconEmoji}
          </div>
        </div>
      </div>
    </article>
  );
}
