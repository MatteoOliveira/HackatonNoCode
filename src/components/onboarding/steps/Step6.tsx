import type { OnboardingData } from "../types";
import StepImage from "../StepImage";

interface Props {
  data: OnboardingData;
}

const ALL_ACTIVITIES = [
  { id: "yoga",       label: "Yoga",        emoji: "🧘", bg: "#fce4ec" },
  { id: "basket",     label: "Basket",      emoji: "🏀", bg: "#e8eaf6" },
  { id: "danse",      label: "Danse",       emoji: "🎵", bg: "#fce4ec" },
  { id: "athletisme", label: "Athlétisme",  emoji: "🏃", bg: "#fce4ec" },
  { id: "natation",   label: "Natation",    emoji: "🏊", bg: "#e3f2fd" },
  { id: "boxe",       label: "Boxe",        emoji: "🥊", bg: "#fff3e0" },
  { id: "escalade",   label: "Escalade",    emoji: "🧗", bg: "#e8f5e9" },
  { id: "zumba",      label: "Zumba",       emoji: "💃", bg: "#fce4ec" },
];

function getRecommendations(data: OnboardingData) {
  const { pratique, besoin } = data;
  if (besoin === "depenser" && pratique === "equipe")
    return ["basket", "zumba", "boxe", "athletisme"];
  if (besoin === "depenser" && pratique === "solo")
    return ["athletisme", "escalade", "boxe", "natation"];
  if (besoin === "ressourcer" && pratique === "equipe")
    return ["yoga", "danse", "zumba", "natation"];
  return ["yoga", "danse", "basket", "athletisme"];
}

export default function Step6({ data }: Props) {
  const recommended = getRecommendations(data);
  const activities = ALL_ACTIVITIES.filter((a) => recommended.includes(a.id));

  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-noir)" }}>
        Mes prochaines rencontres
      </h2>

      <p className="text-sm font-medium mb-2" style={{ color: "var(--color-bleu-fonce)" }}>
        Voici les activités qui correspondent à tes envies de calme et d&apos;autonomie.
      </p>

      <p className="text-sm leading-relaxed mb-6 opacity-50" style={{ color: "var(--color-noir)" }}>
        Parce que chaque parcours est unique, nous avons sélectionné pour toi ces activités
        où tu pourras t&apos;épanouir en toute sérénité. Tu restes libre de tout essayer,
        à ton rythme.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl shadow-sm"
            style={{ backgroundColor: "#fff" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: act.bg }}
              aria-hidden="true"
            >
              {act.emoji}
            </div>
            <p className="text-sm font-medium text-center" style={{ color: "var(--color-noir)" }}>
              {act.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
