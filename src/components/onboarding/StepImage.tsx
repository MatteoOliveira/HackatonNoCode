"use client";

import Image from "next/image";
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
      className="w-full rounded-2xl overflow-hidden mb-6 relative"
      style={{ aspectRatio: "4/3" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-5xl"
        style={{ backgroundColor: fallbackBg }}
        aria-hidden="true"
      >
        {fallbackEmoji}
      </div>
      {!error && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover relative z-10"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
