import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Solimouv' – Le festival du sport pour tous",
  description:
    "Venez célébrer le sport inclusif avec nous ! Initiations, ateliers, rencontres... Le festival Solimouv' rassemble familles, jeunes, seniors, personnes réfugiées et tous ceux qui aiment le sport.",
};

const CHIFFRES_CLES = [
  { valeur: "500+", label: "participants à l'édition 1" },
  { valeur: "13", label: "associations partenaires" },
  { valeur: "92%", label: "veulent revenir l'année prochaine" },
  { valeur: "250", label: "personnes accompagnées chaque semaine" },
];

const PROGRAMMES = [
  {
    slug: "exile",
    label: "Public exilé",
    color: "var(--color-bleu-clair)",
    description: "Le sport comme vecteur d'intégration et de lien social",
  },
  {
    slug: "feminin",
    label: "Public féminin",
    color: "var(--color-rose)",
    description: "L'accès au sport pour toutes les femmes, sans exception",
  },
  {
    slug: "apa",
    label: "Activité Physique Adaptée",
    color: "var(--color-jaune)",
    description: "Des pratiques adaptées à chaque corps et situation",
  },
  {
    slug: "insertion",
    label: "Insertion professionnelle",
    color: "var(--color-orange)",
    description: "Le sport comme levier vers l'emploi et la confiance en soi",
  },
];

export default function HomePage() {
  return (
    <>
      <PWARegister />
      <Header />

      <main>
        {/* Hero */}
        <section
          className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Présentation du festival"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10"
              style={{ backgroundColor: "var(--color-bleu-clair)" }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
              style={{ backgroundColor: "var(--color-rose)" }}
            />
          </div>

          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{
              backgroundColor: "var(--color-bleu-fonce)",
              color: "var(--color-bleu-clair)",
            }}
          >
            2ème édition – 2026
          </span>

          <h1
            className="text-5xl sm:text-7xl lg:text-8xl mb-6 leading-tight"
            style={{ color: "var(--color-blanc)" }}
          >
            Solimouv&apos;
          </h1>

          <p
            className="text-xl sm:text-2xl font-light max-w-2xl mb-4"
            style={{ color: "var(--color-bleu-clair)" }}
          >
            Le festival du sport pour tous
          </p>

          <p
            className="text-base sm:text-lg max-w-xl mb-10 opacity-80"
            style={{ color: "var(--color-blanc)" }}
          >
            Un événement inclusif organisé par Up Sport! qui réunit familles,
            jeunes, seniors, personnes réfugiées et tous les amoureux du sport.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programme"
              className="px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--color-orange)",
                color: "var(--color-blanc)",
              }}
            >
              Voir le programme
            </Link>
            <Link
              href="/a-propos"
              className="px-8 py-4 rounded-full text-lg font-semibold border-2 transition-transform hover:scale-105"
              style={{
                borderColor: "var(--color-blanc)",
                color: "var(--color-blanc)",
              }}
            >
              Découvrir l&apos;asso
            </Link>
          </div>

          <div className="mt-16 text-sm opacity-50" style={{ color: "var(--color-blanc)" }}>
            Centre Sportif Charles Moureu · Paris 13e
          </div>
        </section>

        {/* Chiffres clés */}
        <section
          className="py-16 px-4"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="Chiffres clés"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {CHIFFRES_CLES.map((c) => (
              <div key={c.label}>
                <p
                  className="text-4xl sm:text-5xl mb-2"
                  style={{ fontFamily: "var(--font-titre)", color: "var(--color-jaune)" }}
                >
                  {c.valeur}
                </p>
                <p className="text-sm opacity-80" style={{ color: "var(--color-blanc)" }}>
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Programmes */}
        <section className="py-20 px-4" aria-label="Nos programmes">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl text-center mb-4" style={{ color: "var(--color-noir)" }}>
              Nos programmes
            </h2>
            <p className="text-center opacity-60 mb-12 max-w-xl mx-auto">
              Up Sport! accompagne 250 personnes par semaine à travers 4 programmes structurants.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROGRAMMES.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programme#${p.slug}`}
                  className="group p-6 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ borderColor: p.color, backgroundColor: "var(--color-blanc)" }}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-4"
                    style={{ backgroundColor: p.color }}
                    aria-hidden="true"
                  />
                  <h3 className="text-lg mb-2 group-hover:underline" style={{ color: "var(--color-noir)" }}>
                    {p.label}
                  </h3>
                  <p className="text-sm opacity-60">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Soutenir */}
        <section
          className="py-20 px-4"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Soutenir le festival"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl mb-4" style={{ color: "var(--color-blanc)" }}>
              Soutenez Solimouv&apos;
            </h2>
            <p className="opacity-70 mb-8" style={{ color: "var(--color-blanc)" }}>
              Chaque contribution aide Up Sport! à organiser un festival encore plus grand
              et à accompagner davantage de personnes vers le sport.
            </p>
            <Link
              href="/soutenir"
              className="inline-block px-10 py-4 rounded-full text-xl font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--color-orange)", color: "var(--color-blanc)" }}
            >
              Faire un don
            </Link>
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="py-16 px-4" aria-label="Suivre sur les réseaux">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl mb-4" style={{ color: "var(--color-noir)" }}>
              Suivez l&apos;aventure
            </h2>
            <p className="opacity-60 mb-8">
              Restez informés des dernières actualités de Solimouv&apos; et d&apos;Up Sport!
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="https://www.instagram.com/solimouv.festival/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--color-rose)", color: "var(--color-noir)" }}
              >
                @solimouv.festival
              </a>
              <a
                href="https://www.instagram.com/unispourlesport/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--color-bleu-clair)", color: "var(--color-noir)" }}
              >
                @unispourlesport
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
