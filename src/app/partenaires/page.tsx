import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Partenaires – Solimouv'",
  description:
    "Découvrez les associations et partenaires qui font de Solimouv' un festival unique. Rejoignez l'écosystème et devenez partenaire du festival du sport inclusif.",
};

const PARTENAIRES = [
  {
    id: "p1",
    nom: "Handisport Paris",
    type: "association" as const,
    description: "Sport adapté pour les personnes en situation de handicap moteur",
    site: "https://www.handisport.org",
    couleur: "var(--color-bleu-clair)",
  },
  {
    id: "p2",
    nom: "Femmes & Sport",
    type: "association" as const,
    description: "Promotion de l'activité physique pour toutes les femmes",
    site: "#",
    couleur: "var(--color-rose)",
  },
  {
    id: "p3",
    nom: "Foot Solidaire Paris",
    type: "association" as const,
    description: "Football comme vecteur d'intégration et de lien social",
    site: "#",
    couleur: "var(--color-jaune)",
  },
  {
    id: "p4",
    nom: "Grimper Ensemble",
    type: "association" as const,
    description: "Escalade adaptée et inclusive pour tous les profils",
    site: "#",
    couleur: "var(--color-orange)",
  },
  {
    id: "p5",
    nom: "Bien-être pour Tous",
    type: "association" as const,
    description: "Yoga, méditation et bien-être pour les publics vulnérables",
    site: "#",
    couleur: "var(--color-bleu-clair)",
  },
  {
    id: "p6",
    nom: "Mairie de Paris 13e",
    type: "institutionnel" as const,
    description: "Soutien institutionnel et mise à disposition des infrastructures",
    site: "https://www.paris.fr",
    couleur: "var(--color-bleu-fonce)",
  },
];

const TYPE_LABELS: Record<string, string> = {
  association: "Association",
  institutionnel: "Institutionnel",
  sponsor: "Sponsor",
};

export default function PartenairesPage() {
  const associations = PARTENAIRES.filter((p) => p.type === "association");
  const institutionnels = PARTENAIRES.filter((p) => p.type === "institutionnel");

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          className="py-24 px-4 text-center"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="Nos partenaires"
        >
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ color: "var(--color-blanc)" }}>
            Partenaires
          </h1>
          <p className="text-xl opacity-70 max-w-xl mx-auto" style={{ color: "var(--color-bleu-clair)" }}>
            Un collectif d&apos;associations unies autour du sport inclusif
          </p>
        </section>

        {/* Associations partenaires */}
        <section className="py-20 px-4" aria-label="Associations partenaires">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl mb-2 text-center" style={{ color: "var(--color-noir)" }}>
              Associations partenaires
            </h2>
            <p className="text-center opacity-60 mb-10">
              13 associations lors de la 1ère édition, et elles grandissent à chaque édition
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {associations.map((p) => (
                <article
                  key={p.id}
                  className="p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    borderColor: p.couleur,
                    backgroundColor: "var(--color-blanc)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: p.couleur }}
                      aria-hidden="true"
                    >
                      🏅
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--color-noir)",
                        color: "var(--color-blanc)",
                      }}
                    >
                      {TYPE_LABELS[p.type]}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2" style={{ color: "var(--color-noir)" }}>
                    {p.nom}
                  </h3>
                  <p className="text-sm opacity-60 mb-4">{p.description}</p>
                  {p.site !== "#" && (
                    <a
                      href={p.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: p.couleur }}
                    >
                      Visiter le site →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Institutionnels */}
        {institutionnels.length > 0 && (
          <section
            className="py-16 px-4"
            style={{ backgroundColor: "var(--color-noir)" }}
            aria-label="Partenaires institutionnels"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl mb-8 text-center" style={{ color: "var(--color-blanc)" }}>
                Soutiens institutionnels
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {institutionnels.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <h3 className="text-xl mb-2" style={{ color: "var(--color-blanc)" }}>
                      {p.nom}
                    </h3>
                    <p className="text-sm opacity-60 mb-3" style={{ color: "var(--color-blanc)" }}>
                      {p.description}
                    </p>
                    {p.site !== "#" && (
                      <a
                        href={p.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium"
                        style={{ color: "var(--color-bleu-clair)" }}
                      >
                        Visiter le site →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Devenir partenaire */}
        <section className="py-20 px-4" aria-label="Devenir partenaire">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl mb-4" style={{ color: "var(--color-noir)" }}>
              Rejoignez l&apos;aventure
            </h2>
            <p className="text-lg opacity-70 mb-4 max-w-xl mx-auto">
              Vous êtes une association, une institution ou une entreprise engagée dans
              le sport inclusif ? Devenez partenaire de Solimouv&apos; !
            </p>
            <p className="opacity-50 mb-8 text-sm">
              En devenant partenaire, vous contribuez directement à rendre le sport
              accessible à des milliers de personnes.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 rounded-full text-xl font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--color-bleu-fonce)", color: "var(--color-blanc)" }}
            >
              Devenir partenaire
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
