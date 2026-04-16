import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "À Propos – Up Sport! & Solimouv'",
  description:
    "Découvrez Up Sport!, association fondée en 2016 qui rend le sport accessible à tous. L'histoire, les valeurs et la vision du festival Solimouv'.",
};

const TIMELINE = [
  { annee: "2016", event: "Création d'Up Sport! à Paris, pour rendre le sport accessible à tous" },
  { annee: "2018", event: "Lancement du programme public exilé – le sport comme outil d'intégration" },
  { annee: "2020", event: "Développement du programme APA (Activité Physique Adaptée)" },
  { annee: "2022", event: "250 personnes accompagnées par semaine, 30+ séances hebdomadaires" },
  { annee: "2025", event: "1ère édition du festival Solimouv' – 500 participants, 13 associations" },
  { annee: "2026", event: "2ème édition Solimouv' – plus grand, plus inclusif, plus fort" },
];

const VALEURS = [
  { label: "Solidarité", color: "var(--color-bleu-clair)", description: "S'entraider, partager, avancer ensemble" },
  { label: "Mixité", color: "var(--color-rose)", description: "Accueillir toutes les origines, genres, générations" },
  { label: "Citoyenneté", color: "var(--color-jaune)", description: "Le sport comme école du vivre-ensemble" },
  { label: "Bienveillance", color: "var(--color-orange)", description: "Un espace safe et inclusif pour tous" },
];

export default function AProposPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          className="py-24 px-4 text-center"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="À propos d'Up Sport!"
        >
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ color: "var(--color-blanc)" }}>
            À Propos
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-80" style={{ color: "var(--color-bleu-clair)" }}>
            Up Sport! & le festival Solimouv'
          </p>
        </section>

        {/* L'association */}
        <section className="py-20 px-4" aria-label="L'association Up Sport!">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl mb-6" style={{ color: "var(--color-noir)" }}>
              Up Sport!
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg leading-relaxed opacity-80 mb-4">
                  Up Sport! est une association sportive parisienne fondée en <strong>2016</strong>,
                  œuvrant auprès des personnes en situation de vulnérabilité sociale. Sa mission :
                  rendre le sport accessible à toutes et tous, quels que soient le genre,
                  l&apos;origine sociale ou géographique, le parcours de vie.
                </p>
                <p className="leading-relaxed opacity-80">
                  L&apos;association accompagne en moyenne{" "}
                  <strong style={{ color: "var(--color-bleu-fonce)" }}>250 personnes par semaine</strong>{" "}
                  à travers une trentaine de séances hebdomadaires.
                </p>
                <a
                  href="https://www.unispourlesport.paris/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 px-6 py-3 rounded-full font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--color-bleu-fonce)", color: "var(--color-blanc)" }}
                >
                  Visiter le site d&apos;Up Sport!
                </a>
              </div>
              <div className="space-y-4">
                {[
                  { label: "250", sublabel: "personnes accompagnées / semaine" },
                  { label: "30+", sublabel: "séances hebdomadaires" },
                  { label: "4", sublabel: "programmes structurants" },
                  { label: "2016", sublabel: "année de création" },
                ].map((s) => (
                  <div
                    key={s.sublabel}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: "var(--color-noir)" }}
                  >
                    <span
                      className="text-3xl"
                      style={{ fontFamily: "var(--font-titre)", color: "var(--color-jaune)" }}
                    >
                      {s.label}
                    </span>
                    <span className="text-sm opacity-70" style={{ color: "var(--color-blanc)" }}>
                      {s.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section
          className="py-20 px-4"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Nos valeurs"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl text-center mb-12" style={{ color: "var(--color-blanc)" }}>
              Nos valeurs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {VALEURS.map((v) => (
                <div
                  key={v.label}
                  className="p-6 rounded-2xl text-center"
                  style={{ backgroundColor: v.color }}
                >
                  <h3
                    className="text-xl mb-2"
                    style={{ color: "var(--color-noir)", fontFamily: "var(--font-titre)" }}
                  >
                    {v.label}
                  </h3>
                  <p className="text-sm opacity-80" style={{ color: "var(--color-noir)" }}>
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chronologie */}
        <section className="py-20 px-4" aria-label="Chronologie de l'association">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-12 text-center" style={{ color: "var(--color-noir)" }}>
              Notre histoire
            </h2>
            <ol className="relative border-l-2" style={{ borderColor: "var(--color-bleu-fonce)" }}>
              {TIMELINE.map((item, i) => (
                <li key={i} className="mb-10 ml-6">
                  <span
                    className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: "var(--color-bleu-fonce)",
                      color: "var(--color-blanc)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <time
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--color-bleu-fonce)" }}
                  >
                    {item.annee}
                  </time>
                  <p className="opacity-80">{item.event}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Solimouv festival */}
        <section
          className="py-20 px-4"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="Le festival Solimouv'"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl mb-6" style={{ color: "var(--color-blanc)" }}>
              Le festival Solimouv&apos;
            </h2>
            <p className="text-lg leading-relaxed opacity-80 mb-8 max-w-2xl mx-auto" style={{ color: "var(--color-blanc)" }}>
              Solimouv&apos; est le festival du sport pour tous, organisé par Up Sport! et un collectif
              d&apos;associations parisiennes. La 1ère édition (12 juillet 2025, Centre Sportif Charles Moureu)
              a rassemblé plus de 500 participants, 13 associations partenaires et une quarantaine de bénévoles.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { pct: "92%", label: "souhaitent revenir" },
                { pct: "85%", label: "ont découvert de nouvelles asso" },
                { pct: "78%", label: "sentiment d'inclusion renforcé" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-4xl mb-1"
                    style={{ fontFamily: "var(--font-titre)", color: "var(--color-jaune)" }}
                  >
                    {s.pct}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: "var(--color-blanc)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/programme"
              className="inline-block px-8 py-4 rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-orange)", color: "var(--color-blanc)" }}
            >
              Voir le programme 2026
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
