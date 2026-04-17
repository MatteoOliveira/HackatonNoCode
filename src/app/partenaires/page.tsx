import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PartenaireCard from "@/components/PartenaireCard";
import { createClient } from "@/lib/supabase/server";
import type { PartenaireData } from "@/types/partenaire";

export type { PartenaireData };

export const metadata: Metadata = {
  title: "Nos Partenaires – Solimouv'",
  description: "Nos partenaires s'engagent au quotidien pour rendre le sport accessible à tous·tes.",
};

export default async function PartenairesPage() {
  let partenaires: PartenaireData[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("associations")
      .select("id, nom, description, badge, tags, icon, image_url, couleur_theme")
      .eq("actif", true)
      .order("ordre_affichage");
    if (data) partenaires = data as PartenaireData[];
  } catch {}

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto w-full" style={{ backgroundColor: "var(--color-blanc)" }}>

        <section className="px-4 pt-8 pb-6">
          <h1 className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Seul·e on avance,<br />ensemble on<br />s&apos;éclate&nbsp;!
          </h1>
          <p className="text-base leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            Nos partenaires s&apos;engagent au quotidien pour rendre le sport accessible à
            tous·tes, sans jugement et avec bienveillance.
          </p>
        </section>

        <section className="pb-10 px-4 flex flex-col gap-5">
          {partenaires.length === 0 ? (
            <div className="text-center py-12 opacity-50 text-sm" style={{ color: "var(--color-noir)" }}>
              Aucun partenaire disponible pour le moment.
            </div>
          ) : partenaires.map((p) => (
            <PartenaireCard key={p.id} partenaire={p} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
