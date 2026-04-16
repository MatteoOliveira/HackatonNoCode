import type { StepProps } from "../types";
import StepImage from "../StepImage";
import OptionCard from "../OptionCard";

const OPTIONS = [
  {
    value: "mobilite",
    title: "Mobilité réduite",
    iconBg: "var(--color-bleu-fonce)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <circle cx="12" cy="4" r="1.5" />
        <path d="M8.5 10h7l-1 6H9.5L8.5 10z" />
        <path d="M9.5 16l-1.5 4h8l-1.5-4" />
        <path d="M8 10L6.5 7" />
      </svg>
    ),
  },
  {
    value: "surdite",
    title: "Surdité ou malentendance",
    iconBg: "var(--color-rose)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.73 4.27a8 8 0 0 0-11.31 11.31" />
        <path d="M9 9a3 3 0 0 1 5.12-2.12" />
        <path d="M10.5 15.5c-.31.47-.7.85-1.13 1.13C8.2 17.5 7 18.5 7 20a2 2 0 0 0 4 0" />
        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "cecite",
    title: "Cécité ou malvoyance",
    iconBg: "var(--color-jaune)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--color-noir)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
  },
  {
    value: "aucun",
    title: "Je n'ai pas de besoin spécifique pour mes déplacements",
    iconBg: "var(--color-orange)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
];

export default function Step5({ data, update }: StepProps) {
  function toggle(val: string) {
    const current = data.accessibilite;

    if (val === "aucun") {
      update({ accessibilite: current.includes("aucun") ? [] : ["aucun"] });
      return;
    }

    const withoutAucun = current.filter((v) => v !== "aucun");
    if (withoutAucun.includes(val)) {
      update({ accessibilite: withoutAucun.filter((v) => v !== val) });
    } else {
      update({ accessibilite: [...withoutAucun, val] });
    }
  }

  return (
    <div>
      <StepImage
        src="/images/onboarding-access.jpg"
        alt="Icônes d'accessibilité"
        fallbackBg="#e8d5c4"
        fallbackEmoji="♿"
      />

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        As-tu besoin d&apos;un coup de pouce particulier pour participer&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-6" style={{ color: "var(--color-noir)" }}>
        Sélectionne les éléments qui t&apos;aideront à vivre la meilleure expérience
        possible avec nous.
      </p>

      <div className="flex flex-col gap-3" role="group" aria-label="Besoins d'accessibilité">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            iconBg={opt.iconBg}
            icon={opt.icon}
            title={opt.title}
            selected={data.accessibilite.includes(opt.value)}
            onSelect={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
