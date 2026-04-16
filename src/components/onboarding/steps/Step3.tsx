import type { StepProps } from "../types";
import StepImage from "../StepImage";
import OptionCard from "../OptionCard";

const OPTIONS = [
  {
    value: "equipe",
    title: "En équipe",
    subtitle: "(pour partager et se motiver ensemble)",
    iconBg: "var(--color-rose)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "solo",
    title: "En solo",
    subtitle: "(pour avancer à mon propre rythme)",
    iconBg: "var(--color-bleu-fonce)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Step3({ data, update }: StepProps) {
  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        Comment te sens-tu le plus à l&apos;aise pour pratiquer&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-6" style={{ color: "var(--color-noir)" }}>
        Peu importe ton choix, nos coachs veillent à ce que chacun·e trouve sa place
        en toute sécurité.
      </p>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Mode de pratique">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            iconBg={opt.iconBg}
            icon={opt.icon}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={data.pratique === opt.value}
            onSelect={() => update({ pratique: opt.value })}
          />
        ))}
      </div>
    </div>
  );
}
