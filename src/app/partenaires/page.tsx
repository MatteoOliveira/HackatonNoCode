import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nos Partenaires – Solimouv'",
  description: "Nos partenaires s'engagent au quotidien pour rendre le sport accessible à tous·tes.",
};

export default async function PartenairesPage() {
  let associations: {
    id: string; nom: string; description?: string;
    site_web?: string; contact_email?: string;
    couleur_theme: string; actif: boolean;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("associations")
      .select("id, nom, description, site_web, contact_email, couleur_theme, actif")
      .eq("actif", true)
      .order("ordre_affichage");
    if (data) associations = data as typeof associations;
  } catch {}

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto w-full" style={{ backgroundColor: "var(--color-blanc)" }}>

        <section className="px-4 pt-8 pb-6">
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Seul·e on avance,<br />ensemble on<br />s&apos;éclate&nbsp;!
          </h1>
          <p className="text-base leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            Nos partenaires s&apos;engagent au quotidien pour rendre le sport accessible à tous·tes.
          </p>
        </section>

        <section className="pb-10 px-4 flex flex-col gap-5">
          {associations.length === 0 ? (
            <div className="text-center py-12 opacity-50 text-sm" style={{ color: "var(--color-noir)" }}>
              Aucun partenaire disponible pour le moment.
            </div>
          ) : associations.map((a) => {
            const initial = a.nom[0]?.toUpperCase() ?? "?";
            return (
              <article
                key={a.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
              >
                {/* Bandeau coloré */}
                <div
                  className="flex items-center gap-3 px-4 py-4"
                  style={{ backgroundColor: a.couleur_theme ?? "var(--color-bleu-fonce)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "var(--font-titre)" }}
                  >
                    {initial}
                  </div>
                  <h2 className="text-lg font-bold leading-tight flex-1" style={{ color: "#fff" }}>
                    {a.nom}
                  </h2>
                </div>

                {/* Contenu */}
                <div className="px-4 py-3 flex flex-col gap-3">
                  {a.description && (
                    <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
                      {a.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {a.site_web && (
                      <a
                        href={a.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "var(--color-bleu-fonce)", color: "#fff" }}
                      >
                        🌐 Site web
                      </a>
                    )}
                    {a.contact_email && (
                      <a
                        href={`mailto:${a.contact_email}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "#f0f0f0", color: "var(--color-noir)" }}
                      >
                        ✉️ {a.contact_email}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
