import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgrammeList, { type AtelierCard } from "@/components/ProgrammeList";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nos Défis – Solimouv'",
  description: "Découvrez nos activités inclusives, conçues pour s'adapter à vous et non l'inverse.",
};

export default async function ProgrammePage() {
  let ateliers: AtelierCard[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("ateliers")
      .select(`
        id, titre, description, quote, image_url, tags,
        horaire_debut, horaire_fin, lieu, capacite_max, code_stand,
        sport:sport_id(nom, image_url, tags),
        association:association_id(nom)
      `)
      .eq("actif", true)
      .order("horaire_debut");
    if (data) ateliers = data as unknown as AtelierCard[];
  } catch {}

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto w-full" style={{ backgroundColor: "var(--color-blanc)" }}>
        <section className="px-4 pt-8 pb-6">
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "var(--font-titre)", color: "var(--color-orange)" }}>
            À chacun·e son<br />mouvement
          </h1>
          <p className="text-base leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            Découvrez nos activités inclusives, conçues pour s&apos;adapter à vous et non l&apos;inverse.
          </p>
        </section>

        <section className="pb-10 px-4">
          <ProgrammeList ateliers={ateliers} />
        </section>
      </main>
      <Footer />
    </>
  );
}
