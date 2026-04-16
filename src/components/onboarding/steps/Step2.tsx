import type { StepProps } from "../types";
import StepImage from "../StepImage";

const PRONOUNS = [
  { value: "iel", label: "iel" },
  { value: "elle", label: "elle" },
  { value: "il", label: "il" },
  { value: "neutre", label: "neutre" },
];

export default function Step2({ data, update }: StepProps) {
  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        Quels pronoms utilises-tu&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-7" style={{ color: "var(--color-noir)" }}>
        Pour qu&apos;on puisse s&apos;adresser à toi de la meilleure façon.
      </p>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        role="group"
        aria-label="Choix de pronoms"
      >
        {PRONOUNS.slice(0, 3).map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => update({ pronouns: p.value })}
            aria-pressed={data.pronouns === p.value}
            className="py-4 rounded-2xl text-base font-medium transition-all"
            style={{
              backgroundColor:
                data.pronouns === p.value ? "var(--color-bleu-fonce)" : "#f0f0f0",
              color:
                data.pronouns === p.value ? "var(--color-blanc)" : "var(--color-noir)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Neutre centré */}
      <div className="flex justify-center mt-3">
        <button
          type="button"
          onClick={() => update({ pronouns: "neutre" })}
          aria-pressed={data.pronouns === "neutre"}
          className="px-12 py-4 rounded-2xl text-base font-medium transition-all"
          style={{
            backgroundColor:
              data.pronouns === "neutre" ? "var(--color-bleu-fonce)" : "#f0f0f0",
            color:
              data.pronouns === "neutre" ? "var(--color-blanc)" : "var(--color-noir)",
          }}
        >
          neutre
        </button>
      </div>
    </div>
  );
}
