"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  fallbackBg?: string;
  fallbackEmoji?: string;
}

export default function StepImage({
  src,
  alt,
  fallbackBg = "var(--color-bleu-fonce)",
  fallbackEmoji = "🏸",
}: Props) {
  const [error, setError] = useState(false);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden mb-6"
      style={{ aspectRatio: "4/3", position: "relative" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-5xl"
        style={{ backgroundColor: fallbackBg }}
        aria-hidden="true"
      >
        {fallbackEmoji}
      </div>
      {!error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
