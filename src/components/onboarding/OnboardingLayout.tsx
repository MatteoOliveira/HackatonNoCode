"use client";

import { useRouter } from "next/navigation";

interface Props {
  step: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  step,
  total,
  onBack,
  onNext,
  nextLabel = "Suivant",
  nextDisabled = false,
  children,
}: Props) {
  return (
    <div
      className="min-h-screen flex flex-col max-w-2xl mx-auto w-full"
      style={{ backgroundColor: "var(--color-blanc)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          aria-label="Retour"
          className="text-xl leading-none p-1"
          style={{ color: "var(--color-rose)" }}
        >
          ←
        </button>
        <span
          className="text-lg"
          style={{ fontFamily: "var(--font-titre)", color: "var(--color-rose)" }}
        >
          Onboarding
        </span>
        <div className="w-7" aria-hidden="true" />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1 px-4 pb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < step ? "var(--color-rose)" : "#d1d5db",
            }}
          />
        ))}
        <span className="ml-2 text-xs font-medium opacity-40 shrink-0">
          {step}/{total}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28 px-4">{children}</div>

      {/* Sticky bottom button */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{ backgroundColor: "var(--color-blanc)" }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full py-4 rounded-full text-base font-bold transition-opacity flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--color-rose)",
              color: "var(--color-blanc)",
              opacity: nextDisabled ? 0.5 : 1,
            }}
          >
            {nextLabel}
            {nextLabel === "Suivant" && (
              <span aria-hidden="true">→</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
