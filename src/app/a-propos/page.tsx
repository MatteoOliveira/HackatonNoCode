import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "À propos – Solimouv'",
  description:
    "Solimouv, festival du sport inclusif organisé par Up Sport et ses associations partenaires au Centre Sportif Charles Moureu, Paris 13e.",
};

const OBJECTIFS = [
  "Encourager l'inclusion par le sport en brisant les barrières sociales, culturelles et physiques, et rendre l'Activité Physique et Sportive accessible à tous, quels que soient l'âge, le niveau, le genre ou la condition physique.",
  "Créer du lien en favorisant la rencontre entre différents publics et acteurs engagés, et démontrer que le sport peut être un puissant outil de bien-être, d'émancipation et de cohésion sociale.",
  "Mettre en lumière les associations et projets solidaires qui œuvrent, au quotidien, pour un sport plus accessible et plus représentatif de la diversité de notre société.",
];

const ENGAGEMENTS = [
  "Promouvoir une accessibilité universelle à la pratique sportive",
  "Favoriser la mixité sociale et intergénérationnelle",
  "Soutenir l'inclusion des personnes en situation de handicap",
  "Promouvoir la tolérance envers tous les parcours",
  "Lutter contre toutes les formes de discrimination",
  "Sensibiliser aux bienfaits du mouvement sur la santé, le bien-être et l'épanouissement",
];

const STATS_MOBILISATION = [
  { valeur: "500+", label: "participant·e·s réunis sur un week-end" },
  { valeur: "40",   label: "bénévoles mobilisés, formés et engagés le jour J" },
  { valeur: "15",   label: "associations et fondations partenaires" },
];

const STATS_RESULTATS = [
  { pct: "73 %", label: "ont exprimé un sentiment renforcé d'inclusion et de bienveillance" },
  { pct: "85 %", label: "ont découvert une nouvelle discipline ou une nouvelle association" },
  { pct: "92 %", label: "se sont déclarés prêts à revenir pour une prochaine édition" },
];

/* ── Blocs réutilisables ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-bold mb-3"
      style={{ color: "var(--color-noir)" }}
    >
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-4 opacity-70" style={{ color: "var(--color-noir)" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-6 h-px" style={{ backgroundColor: "#e5e7eb" }} />;
}

export default function AProposPage() {
  return (
    <>
      <Header />

      <main
        className="max-w-2xl mx-auto w-full px-4 pt-8 pb-16"
        style={{ backgroundColor: "var(--color-blanc)" }}
      >
        {/* ── Titre ── */}
        <h1
          className="text-4xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-titre)", color: "var(--color-orange)" }}
        >
          À propos de nous
        </h1>

        {/* ── Intro ── */}
        <Paragraph>
          Solimouv, festival du sport inclusif et pour tous, s&apos;inscrit pleinement dans
          la continuité des actions menées par Up Sport et par toutes les associations qui
          nous ont rejoint sur le projet. L&apos;évènement aura lieu à nouveau au Centre
          Sportif Charles Moureu dans le 13<sup>e</sup> arrondissement de Paris.
        </Paragraph>
        <Paragraph>
          Convaincu que le sport doit être un droit, le collectif d&apos;associations a pour
          ambition de faire de Solimouv une journée inclusive, festive et fédératrice où
          bénévoles, visiteurs et associations se retrouvent autour d&apos;une vision commune :
          faire du sport un levier de cohésion sociale et de transformation positive.
        </Paragraph>
        <Paragraph>
          Pensé comme un espace ouvert à toutes et tous — minorités, personnes LGBTQIA+,
          seniors, jeunes, personnes en situation de handicap, personnes exilées, familles
          et publics éloignés de la pratique sportive — le festival incarne les valeurs
          fondatrices de l&apos;organisation : inclusion, diversité, solidarité et accès universel
          à l&apos;Activité Physique et Sportive.
        </Paragraph>
        <Paragraph>
          Solimouv&apos; donne ainsi une visibilité aux initiatives locales et entretient l&apos;élan
          initié par les Jeux de Paris, afin que leur héritage social et inclusif perdure
          dans le temps.
        </Paragraph>

        <Divider />

        {/* ── Tables rondes ── */}
        <SectionTitle>Tables rondes</SectionTitle>
        <Paragraph>
          Pour cette nouvelle édition, le festival est complété par une série de tables
          rondes qui se dérouleront entre le 17 avril et le 5 juin, veille du festival.
          Celles-ci réuniront enseignants chercheurs, acteurs de terrain, collectivités
          territoriales, experts, décideurs publics et privés pour débattre des enjeux
          « sport &amp; vulnérabilités ».
        </Paragraph>

        <Divider />

        {/* ── Ambition ── */}
        <p
          className="text-xs font-bold tracking-widest mb-4 uppercase"
          style={{ color: "var(--color-orange)" }}
        >
          L&apos;ambition du festival
        </p>

        {/* Objectifs */}
        <SectionTitle>🎯 Nos objectifs</SectionTitle>
        <ul className="mb-6 space-y-3">
          {OBJECTIFS.map((obj, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-orange)" }}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
                {obj}
              </p>
            </li>
          ))}
        </ul>

        {/* Engagements */}
        <SectionTitle>🤝 Nos engagements</SectionTitle>
        <ul className="mb-6 space-y-2">
          {ENGAGEMENTS.map((eng, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-bleu-fonce)" }}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
                {eng}
              </p>
            </li>
          ))}
        </ul>

        <Paragraph>
          Solimouv fédère un collectif de 15 associations et fondations engagées sur des
          thématiques complémentaires liées à la lutte contre les discriminations et à
          l&apos;accès au sport pour tous.
        </Paragraph>

        <Divider />

        {/* ── Impact ── */}
        <SectionTitle>✊ Notre impact</SectionTitle>
        <p className="text-xs opacity-50 mb-5" style={{ color: "var(--color-noir)" }}>
          Les chiffres ci-dessous correspondent à la première édition du festival, organisée
          en 2025 au Centre Sportif Charles Moureu.
        </p>

        {/* Mobilisation */}
        <h3 className="text-base font-bold mb-3" style={{ color: "var(--color-noir)" }}>
          Une mobilisation forte
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS_MOBILISATION.map((s) => (
            <div
              key={s.valeur}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: "var(--color-bleu-fonce)" }}
            >
              <p
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-titre)", color: "var(--color-jaune)" }}
              >
                {s.valeur}
              </p>
              <p className="text-xs leading-tight opacity-80" style={{ color: "var(--color-blanc)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Public diversifié */}
        <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-noir)" }}>
          Un public réellement diversifié
        </h3>
        <Paragraph>
          Familles, promeneurs du samedi, jeunes, seniors, personnes en situation de
          précarité, réfugié·e·s, personnes LGBTQIA+, personnes en situation de handicap
          physique ou mental : l&apos;ensemble des publics visés était représenté, dans un cadre
          bienveillant et sans distinction.
        </Paragraph>

        {/* Résultats mesurables */}
        <h3 className="text-base font-bold mb-3" style={{ color: "var(--color-noir)" }}>
          Des résultats mesurables
        </h3>
        <div className="space-y-3 mb-6">
          {STATS_RESULTATS.map((s) => (
            <div
              key={s.pct}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <span
                className="text-2xl font-bold shrink-0"
                style={{ fontFamily: "var(--font-titre)", color: "var(--color-orange)" }}
              >
                {s.pct}
              </span>
              <p className="text-sm leading-snug opacity-70" style={{ color: "var(--color-noir)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <Paragraph>
          Ces résultats confirment que Solimouv répond à un besoin réel : créer un espace
          où la pratique sportive devient un vecteur de rencontre, de visibilité et de
          transformation sociale.
        </Paragraph>

        {/* Note programme */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{ backgroundColor: "var(--color-jaune)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--color-noir)" }}>
            🎉 Le planning des activités sportives sera accessible prochainement !
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
