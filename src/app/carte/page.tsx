import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Carte Live – Solimouv'",
  description:
    "Retrouvez votre chemin au festival Solimouv' grâce à la carte interactive. Stands, ateliers, accueil, buvette – tout est indiqué.",
};

const STANDS = [
  { id: "accueil", label: "Accueil", emoji: "🏁", x: 45, y: 10, color: "var(--color-bleu-fonce)" },
  { id: "buvette", label: "Buvette", emoji: "🥤", x: 75, y: 20, color: "var(--color-orange)" },
  { id: "secours", label: "Premiers secours", emoji: "🚑", x: 15, y: 20, color: "var(--color-rose)" },
  { id: "exile", label: "Zone Exilé", emoji: "🌍", x: 20, y: 50, color: "var(--color-bleu-clair)" },
  { id: "feminin", label: "Zone Féminin", emoji: "♀️", x: 50, y: 40, color: "var(--color-rose)" },
  { id: "apa", label: "Zone APA", emoji: "♿", x: 75, y: 55, color: "var(--color-jaune)" },
  { id: "insertion", label: "Zone Insertion", emoji: "💼", x: 35, y: 70, color: "var(--color-orange)" },
  { id: "scene", label: "Scène principale", emoji: "🎤", x: 50, y: 80, color: "var(--color-bleu-fonce)" },
  { id: "wc", label: "Toilettes", emoji: "🚻", x: 85, y: 75, color: "#9ca3af" },
  { id: "parking", label: "Accès PMR", emoji: "🅿️", x: 10, y: 85, color: "#9ca3af" },
];

export default function CarteLivePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          className="py-24 px-4 text-center"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Carte du festival"
        >
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ color: "var(--color-blanc)" }}>
            Carte Live
          </h1>
          <p className="text-xl opacity-70 max-w-xl mx-auto" style={{ color: "var(--color-bleu-clair)" }}>
            Retrouvez-vous facilement au festival
          </p>
        </section>

        {/* Carte SVG */}
        <section className="py-16 px-4" aria-label="Carte interactive du festival">
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: "var(--color-bleu-fonce)",
                backgroundColor: "#e8f5e9",
                paddingBottom: "66%",
              }}
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                role="img"
                aria-label="Plan du Centre Sportif Charles Moureu"
              >
                {/* Terrain extérieur A */}
                <rect x="5" y="35" width="35" height="25" rx="1" fill="#c8e6c9" stroke="#4caf50" strokeWidth="0.5" />
                <text x="22.5" y="47" textAnchor="middle" fontSize="2.5" fill="#2e7d32">
                  Terrain ext. A
                </text>

                {/* Terrain extérieur B */}
                <rect x="60" y="35" width="35" height="25" rx="1" fill="#c8e6c9" stroke="#4caf50" strokeWidth="0.5" />
                <text x="77.5" y="47" textAnchor="middle" fontSize="2.5" fill="#2e7d32">
                  Terrain ext. B
                </text>

                {/* Salle couverte */}
                <rect x="30" y="55" width="40" height="20" rx="1" fill="#bbdefb" stroke="#1976d2" strokeWidth="0.5" />
                <text x="50" y="65" textAnchor="middle" fontSize="2.5" fill="#0d47a1">
                  Salle couverte
                </text>

                {/* Espace vert */}
                <ellipse cx="50" cy="25" rx="15" ry="10" fill="#dcedc8" stroke="#8bc34a" strokeWidth="0.5" />
                <text x="50" y="25" textAnchor="middle" fontSize="2.5" fill="#33691e">
                  Espace vert
                </text>

                {/* Allée principale */}
                <rect x="45" y="0" width="10" height="35" fill="#e0e0e0" />
                <rect x="0" y="62" width="100" height="6" fill="#e0e0e0" />

                {/* Marqueurs stands */}
                {STANDS.map((stand) => (
                  <g key={stand.id} transform={`translate(${stand.x}, ${stand.y})`}>
                    <circle r="3.5" fill={stand.color} opacity="0.9" />
                    <text textAnchor="middle" y="6" fontSize="2.2" fill={stand.color} fontWeight="bold">
                      {stand.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Légende */}
            <div
              className="mt-6 p-5 rounded-xl"
              style={{ backgroundColor: "var(--color-noir)" }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-blanc)" }}>
                Légende
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STANDS.map((stand) => (
                  <div key={stand.id} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stand.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm" style={{ color: "var(--color-blanc)" }}>
                      {stand.emoji} {stand.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Infos accès */}
        <section
          className="py-16 px-4"
          style={{ backgroundColor: "var(--color-bleu-fonce)" }}
          aria-label="Comment venir"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl mb-8 text-center" style={{ color: "var(--color-blanc)" }}>
              Comment venir
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "🚇",
                  titre: "Métro",
                  detail: "Ligne 5 – Station Nationale ou Chevaleret",
                },
                {
                  icon: "🚌",
                  titre: "Bus",
                  detail: "Lignes 27, 47, 83 – Arrêt Nationale",
                },
                {
                  icon: "🚲",
                  titre: "Vélo",
                  detail: "Stations Vélib' à proximité. Parking vélos sur site.",
                },
                {
                  icon: "♿",
                  titre: "Accessibilité PMR",
                  detail: "Site entièrement accessible. Parking PMR disponible.",
                },
              ].map((info) => (
                <div
                  key={info.titre}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="text-3xl mb-2">{info.icon}</div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--color-jaune)" }}>
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
