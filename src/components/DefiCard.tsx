"use client";

import Image from "next/image";
import { useState } from "react";

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "en-équipe":            { bg: "var(--color-bleu-fonce)", color: "#fff" },
  "solo":                 { bg: "var(--color-bleu-fonce)", color: "#fff" },
  "handisport":           { bg: "var(--color-rose)",       color: "#fff" },
  "intense":              { bg: "var(--color-rose)",       color: "#fff" },
  "calme":                { bg: "var(--color-orange)",     color: "#fff" },
  "handisport-compatible":{ bg: "var(--color-rose)",       color: "#fff" },
};

interface Defi {
  id: string;
  nom: string;
  quote: string;
  tags: string[];
  imageFallbackBg: string;
  imageFallbackEmoji: string;
  imageAlt: string;
}

export default function DefiCard({ defi: d }: { defi: Defi }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="mx-4 mb-5 rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
    >
      {/* Photo */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ backgroundColor: d.imageFallbackBg }}
          aria-hidden="true"
        >
          {d.imageFallbackEmoji}
        </div>
        {!imgError && (
          <Image
            src={`/images/defi-${d.id}.jpg`}
            alt={d.imageAlt}
            fill
            className="object-cover relative z-10"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "var(--color-noir)" }}
        >
          {d.nom}
        </h2>

        <p
          className="text-sm leading-relaxed mb-4 opacity-60"
          style={{ color: "var(--color-noir)" }}
        >
          &ldquo;{d.quote}&rdquo;
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {d.tags.map((tag) => {
            const style = TAG_COLORS[tag] ?? { bg: "var(--color-bleu-fonce)", color: "#fff" };
            return (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: style.bg, color: style.color }}
              >
                #{tag}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}
