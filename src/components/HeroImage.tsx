"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroImage() {
  const [error, setError] = useState(false);

  return (
    <div className="w-full rounded-2xl overflow-hidden aspect-[4/3] relative">
      {error ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
        >
          <div className="text-center px-6">
            <p className="text-6xl mb-3">🏃‍♀️⚽🏀</p>
            <p
              className="text-sm font-medium opacity-70"
              style={{ color: "var(--color-blanc)" }}
            >
              Sport pour tous · Inclusivité · Partage
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Fond visible avant chargement */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          >
            <div className="text-center px-6">
              <p className="text-6xl mb-3">🏃‍♀️⚽🏀</p>
              <p
                className="text-sm font-medium opacity-70"
                style={{ color: "var(--color-blanc)" }}
              >
                Sport pour tous · Inclusivité · Partage
              </p>
            </div>
          </div>
          <Image
            src="/images/hero-sports.jpg"
            alt="Groupe de sportifs de toutes disciplines réunis pour Solimouv'"
            fill
            className="object-cover relative z-10"
            priority
            onError={() => setError(true)}
          />
        </>
      )}
    </div>
  );
}
