import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartenaireCard from "@/components/PartenaireCard";

export const metadata: Metadata = {
  title: "Nos Partenaires – Solimouv'",
  description:
    "Nos partenaires s'engagent au quotidien pour rendre le sport accessible à tous·tes, sans jugement et avec bienveillance.",
};

const PARTENAIRES = [
  {
    id: "p1",
    nom: "Paname Wheelchair Basket",
    badge: "Expert handisport",
    description:
      "Spécialistes de la glisse urbaine, cette équipe vous ouvre ses portes pour découvrir le basket sous un nouvel angle. Leur priorité : que le matériel ne soit jamais un frein à votre envie de jouer.",
    tags: ["#InclusionMoteur", "#EspritDequipe"],
    iconBg: "var(--color-orange)",
    iconEmoji: "🏀",
    imageFallbackBg: "#1a3a5c",
    imageFallbackEmoji: "🏀",
    imageAlt: "Joueurs de basket en fauteuil roulant",
  },
  {
    id: "p2",
    nom: "Yoga pour Tous·tes",
    badge: "Santé mentale & bien-être",
    description:
      "Un collectif de professeur·es formé·es à l'accueil des corps et des esprits fatigués. Ils et elles adaptent chaque posture pour que le yoga soit un refuge, pas un défi physique.",
    tags: ["#SafeSpace", "#Douceur"],
    iconBg: "var(--color-bleu-fonce)",
    iconEmoji: "🧘",
    imageFallbackBg: "#2d4a3e",
    imageFallbackEmoji: "🧘",
    imageAlt: "Personne pratiquant le yoga",
  },
  {
    id: "p3",
    nom: "Foot Sans Frontières",
    badge: "Accueil des personnes exilées",
    description:
      "Plus qu'un club de foot, c'est une famille d'accueil. On y parle toutes les langues et on y partage surtout le plaisir de se retrouver autour d'un ballon, sans jugement de niveau.",
    tags: ["#Solidarité", "#Multiculturel"],
    iconBg: "var(--color-orange)",
    iconEmoji: "⚽",
    imageFallbackBg: "#1e3a1e",
    imageFallbackEmoji: "⚽",
    imageAlt: "Joueurs de football sur le terrain",
  },
  {
    id: "p4",
    nom: "Les Randonneurs Solidaires",
    badge: "accessibilité urbaine",
    description:
      "Ils connaissent les recoins calmes de Paris comme personne. Cette association propose des parcours sans obstacles, pensés pour discuter, respirer et rompre l'isolement.",
    tags: ["#PleinAir", "#Accessibilité"],
    iconBg: "var(--color-bleu-fonce)",
    iconEmoji: "🥾",
    imageFallbackBg: "#2a4a20",
    imageFallbackEmoji: "🏔️",
    imageAlt: "Groupe de randonneurs en montagne",
  },
];

export default function PartenairesPage() {
  return (
    <>
      <Header />

      <main
        className="max-w-2xl mx-auto w-full"
        style={{ backgroundColor: "var(--color-blanc)" }}
      >
        {/* ── Hero ── */}
        <section className="px-4 pt-8 pb-6" aria-label="Présentation des partenaires">
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}
          >
            Seul·e on avance,<br />
            ensemble on<br />
            s&apos;éclate&nbsp;!
          </h1>
          <p className="text-base leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            Nos partenaires s&apos;engagent au quotidien pour rendre le sport accessible à
            tous·tes, sans jugement et avec bienveillance.
          </p>
        </section>

        {/* ── Liste des partenaires ── */}
        <section className="pb-10" aria-label="Nos associations partenaires">
          {PARTENAIRES.map((p) => (
            <PartenaireCard key={p.id} partenaire={p} />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
