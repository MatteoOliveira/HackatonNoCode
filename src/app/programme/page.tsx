import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DefiCard from "@/components/DefiCard";

export const metadata: Metadata = {
  title: "Nos Défis – Solimouv'",
  description:
    "Découvrez nos activités inclusives, conçues pour s'adapter à vous et non l'inverse. Basket-fauteuil, yoga, football solidaire et bien plus.",
};

const DEFIS = [
  {
    id: "basket-fauteuil",
    nom: "Basket-Fauteuil",
    quote:
      "Le parquet est à vous ! Que vous soyez expert·e ou débutant·e, l'esprit d'équipe et le plaisir de la glisse sont les seules règles ici.",
    tags: ["en-équipe", "handisport", "intense"],
    imageFallbackBg: "#1a3a5c",
    imageFallbackEmoji: "🏀",
    imageAlt: "Joueurs de basket en fauteuil roulant sur le terrain",
  },
  {
    id: "yoga-meditation",
    nom: "Yoga Doux & Méditation",
    quote:
      "Un moment rien qu'à vous pour retrouver le calme. Ici, on ne cherche pas la performance, mais simplement à écouter ce que votre corps a à vous dire aujourd'hui.",
    tags: ["solo", "calme", "handisport-compatible"],
    imageFallbackBg: "#2d4a3e",
    imageFallbackEmoji: "🧘",
    imageAlt: "Personne en position de méditation",
  },
  {
    id: "football-solidaire",
    nom: "Football Solidaire",
    quote:
      "Peu importe votre niveau ou vos chaussures, rejoignez la partie ! Le terrain est un espace de rencontre où le respect et l'entraide passent avant le score.",
    tags: ["en-équipe", "intense"],
    imageFallbackBg: "#1e3a1e",
    imageFallbackEmoji: "⚽",
    imageAlt: "Joueurs de football sur le terrain",
  },
];

export default function ProgrammePage() {
  return (
    <>
      <Header />

      <main
        className="max-w-2xl mx-auto w-full"
        style={{ backgroundColor: "var(--color-blanc)" }}
      >
        {/* ── Hero ── */}
        <section className="px-4 pt-8 pb-6" aria-label="Nos défis et activités">
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-orange)" }}
          >
            À chacun·e son<br />mouvement
          </h1>
          <p
            className="text-base leading-relaxed opacity-70"
            style={{ color: "var(--color-noir)" }}
          >
            Découvrez nos activités inclusives, conçues pour s&apos;adapter à vous et
            non l&apos;inverse.
          </p>
        </section>

        {/* ── Cartes activités ── */}
        <section className="pb-10" aria-label="Liste des activités">
          {DEFIS.map((d) => (
            <DefiCard key={d.id} defi={d} />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
