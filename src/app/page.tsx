import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PWARegister from "@/components/PWARegister";
import Countdown from "@/components/Countdown";
import HeroImage from "@/components/HeroImage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Solimouv' – Le festival du sport pour tous",
  description:
    "Parce que le mouvement est un droit. Rejoignez notre communauté inclusive pour bouger, partager et vous réapproprier l'espace sportif en toute bienveillance.",
};

export default async function HomePage() {
  let festivalDate: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("config")
      .select("value")
      .eq("key", "date_festival")
      .single();
    if (data?.value) festivalDate = data.value as string;
  } catch {}
  return (
    <>
      <PWARegister />
      <Header />

      <main className="max-w-2xl mx-auto w-full">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative px-4 pt-8 pb-6 overflow-hidden"
          style={{ backgroundColor: "var(--color-blanc)" }}
          aria-label="Présentation du festival"
        >
          {/* Blob rose décoratif haut-droite */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, var(--color-rose), transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Badge "Ouvert à tous·tes" */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: "var(--color-rose)", color: "var(--color-blanc)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
              Ouvert à tous tes — Gratuit · Paris · 6 juin 2026
            </span>
          </div>

          {/* Titre principal */}
          <h1
            className="text-4xl leading-tight mb-5"
            style={{
              fontFamily: "var(--font-titre)",
              color: "var(--color-bleu-fonce)",
            }}
          >
            Le festival du sport inclusif où chacun.e est à sa place
          </h1>

          {/* Sous-titre */}
          <p
            className="text-base leading-relaxed mb-6 opacity-80"
            style={{ color: "var(--color-noir)" }}
          >
            Parce que le mouvement est un droit. Solimouv&apos; réunit 13 associations parisiennes pour une journée de sport gratuite, accessible à toutes et tous — familles, seniors, personnes en situation de handicap, personnes réfugiées, communauté LGBTQIA+. Ici, personne ne demande ce que tu sais déjà faire, seulement ce que tu as envie de découvrir.
          </p>

          {/* Image hero */}
          <HeroImage />
        </section>

        {/* ── COUNTDOWN ────────────────────────────────────────── */}
        <section className="py-6" aria-label="Compte à rebours avant le festival">
          <Countdown festivalDate={festivalDate} />
        </section>

        {/* ── CTA PRINCIPAL ────────────────────────────────────── */}
        <section className="px-4 pb-6" aria-label="Rejoindre le festival">
          <Link
            href="/inscription"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-lg font-bold transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--color-orange)",
              color: "var(--color-blanc)",
            }}
          >
            Rejoignez le terrain !
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* ── BOUTONS SECONDAIRES ──────────────────────────────── */}
        <section className="px-4 pb-10" aria-label="Navigation secondaire">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/partenaires"
              className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 font-semibold transition-colors active:scale-95"
              style={{
                borderColor: "var(--color-bleu-fonce)",
                color: "var(--color-bleu-fonce)",
                backgroundColor: "var(--color-blanc)",
              }}
            >
              {/* Handshake icon */}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                <path d="M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3.02 0L12 11l.11.5a2.13 2.13 0 0 0 3.02 0h0a2.13 2.13 0 0 0 0-3L12 5.36z" />
              </svg>
              Nos partenaires
            </Link>

            <Link
              href="/programme"
              className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 font-semibold transition-colors active:scale-95"
              style={{
                borderColor: "var(--color-bleu-fonce)",
                color: "var(--color-bleu-fonce)",
                backgroundColor: "var(--color-blanc)",
              }}
            >
              {/* Trophy icon */}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
              Nos défis !
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
