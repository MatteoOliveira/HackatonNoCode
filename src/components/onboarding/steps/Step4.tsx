import type { StepProps } from "../types";
import StepImage from "../StepImage";
import OptionCard from "../OptionCard";

const OPTIONS = [
  {
    value: "depenser",
    title: "Se dépenser",
    subtitle: "(cardio, intensité, dépassement de soi)",
    iconBg: "var(--color-orange)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    value: "ressourcer",
    title: "Je recherche avant tout le calme et la douceur",
    subtitle: "(respiration, bien-être, sérénité)",
    iconBg: "var(--color-bleu-fonce)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5s3.5-4 4-6.5c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 0 1-7 7z" />
      </svg>
    ),
  },
];

export default function Step4({ data, update }: StepProps) {
  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        De quoi ton corps a t&apos;il besoin en ce moment&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-6" style={{ color: "var(--color-noir)" }}>
        Toutes nos séances sont adaptables. Tu peux changer d&apos;avis à tout moment
        selon ta forme du jour.
      </p>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Besoin du corps">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            iconBg={opt.iconBg}
            icon={opt.icon}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={data.besoin === opt.value}
            onSelect={() => update({ besoin: opt.value })}
          />
        ))}
      </div>
    </div>
  );
}
