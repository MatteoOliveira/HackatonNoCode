import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Programme & Ateliers – Solimouv'",
  description:
    "Découvrez le programme complet du festival Solimouv' : ateliers sportifs, initiations, stands d'information. Filtrez par programme, horaire ou type d'activité.",
};

const ATELIERS = [
  {
    id: "a1",
    titre: "Initiation au Basket fauteuil",
    horaire: "10h00 – 11h30",
    association: "Handisport Paris",
    lieu: "Terrain extérieur A",
    programme: "apa" as const,
    places: 12,
    inscrits: 7,
    description: "Découverte du basket en fauteuil roulant, accessible à tous, valide ou non.",
  },
  {
    id: "a2",
    titre: "Zumba pour toutes",
    horaire: "11h00 – 12h00",
    association: "Femmes & Sport",
    lieu: "Salle couverte B",
    programme: "feminin" as const,
    places: 20,
    inscrits: 18,
    description: "Atelier de danse cardio dans une ambiance bienveillante et joyeuse.",
  },
  {
    id: "a3",
    titre: "Football & integration",
    horaire: "14h00 – 15h30",
    association: "Foot Solidaire Paris",
    lieu: "Terrain extérieur B",
    programme: "exile" as const,
    places: 16,
    inscrits: 12,
    description: "Le football comme outil de lien social et d'intégration pour les personnes exilées.",
  },
  {
    id: "a4",
    titre: "Yoga & bien-être",
    horaire: "09h00 – 10h00",
    association: "Bien-être pour Tous",
    lieu: "Espace vert C",
    programme: "insertion" as const,
    places: 15,
    inscrits: 8,
    description: "Séance de yoga accessible, travail sur la confiance en soi et la pleine conscience.",
  },
  {
    id: "a5",
    titre: "Escalade adaptée",
    horaire: "13h00 – 14h30",
    association: "Grimper Ensemble",
    lieu: "Mur d'escalade",
    programme: "apa" as const,
    places: 8,
    inscrits: 8,
    description: "Initiation à l'escalade en salle, avec encadrement adapté à toutes les situations.",
  },
  {
    id: "a6",
    titre: "Boxe éducative",
    horaire: "15h00 – 16h30",
    association: "Box'n'Sport",
    lieu: "Salle couverte A",
    programme: "insertion" as const,
    places: 12,
    inscrits: 5,
    description: "La boxe comme discipline de développement personnel et d'insertion.",
  },
];

const PROGRAMME_COLORS: Record<string, string> = {
  apa: "var(--color-jaune)",
  feminin: "var(--color-rose)",
  exile: "var(--color-bleu-clair)",
  insertion: "var(--color-orange)",
};

const PROGRAMME_LABELS: Record<string, string> = {
  apa: "Activité Physique Adaptée",
  feminin: "Public féminin",
  exile: "Public exilé",
  insertion: "Insertion professionnelle",
};

export default function ProgrammePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          className="py-24 px-4 text-center"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Programme du festival"
        >
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ color: "var(--color-blanc)" }}>
            Programme & Ateliers
          </h1>
          <p className="text-xl opacity-70 max-w-xl mx-auto" style={{ color: "var(--color-bleu-clair)" }}>
            Une journée de sport, de partage et de découverte
          </p>
        </section>

        {/* Légende programmes */}
        <section className="py-8 px-4 border-b" aria-label="Légende des programmes">
          <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
            {Object.entries(PROGRAMME_LABELS).map(([key, label]) => (
              <a
                key={key}
                href={`#${key}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-opacity hover:opacity-80"
                style={{
                  borderColor: PROGRAMME_COLORS[key],
                  color: "var(--color-noir)",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PROGRAMME_COLORS[key] }}
                  aria-hidden="true"
                />
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* Liste des ateliers */}
        <section className="py-16 px-4" aria-label="Liste des ateliers">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl mb-8 text-center" style={{ color: "var(--color-noir)" }}>
              Les ateliers du festival
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {ATELIERS.map((atelier) => {
                const pct = Math.round((atelier.inscrits / atelier.places) * 100);
                const complet = pct >= 100;
                const presque = pct >= 80 && !complet;

                return (
                  <article
                    key={atelier.id}
                    id={atelier.programme}
                    className="rounded-2xl overflow-hidden border"
                    style={{ borderColor: PROGRAMME_COLORS[atelier.programme] }}
                  >
                    <div
                      className="px-4 py-2 flex items-center gap-2 text-xs font-semibold"
                      style={{
                        backgroundColor: PROGRAMME_COLORS[atelier.programme],
                        color: "var(--color-noir)",
                      }}
                    >
                      <span>{PROGRAMME_LABELS[atelier.programme]}</span>
                      {complet && <span className="ml-auto">COMPLET</span>}
                      {presque && <span className="ml-auto">Presque complet</span>}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl mb-1" style={{ color: "var(--color-noir)" }}>
                        {atelier.titre}
                      </h3>
                      <p className="text-sm opacity-60 mb-3">{atelier.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm opacity-70 mb-4">
                        <span>🕐 {atelier.horaire}</span>
                        <span>📍 {atelier.lieu}</span>
                        <span>🏛️ {atelier.association}</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 opacity-60">
                          <span>Places restantes</span>
                          <span>
                            {atelier.inscrits}/{atelier.places}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: complet
                                ? "var(--color-orange)"
                                : presque
                                ? "var(--color-jaune)"
                                : PROGRAMME_COLORS[atelier.programme],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Informations pratiques */}
        <section
          className="py-16 px-4"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="Informations pratiques"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl mb-8" style={{ color: "var(--color-blanc)" }}>
              Informations pratiques
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: "📅", titre: "Date", detail: "Juillet 2026" },
                { icon: "📍", titre: "Lieu", detail: "Centre Sportif Charles Moureu, Paris 13e" },
                { icon: "⏰", titre: "Horaires", detail: "9h00 – 18h00" },
              ].map((info) => (
                <div key={info.titre} className="p-4">
                  <div className="text-4xl mb-2">{info.icon}</div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--color-jaune)" }}
                  >
                    {info.titre}
                  </h3>
                  <p className="text-sm opacity-80" style={{ color: "var(--color-blanc)" }}>
                    {info.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
