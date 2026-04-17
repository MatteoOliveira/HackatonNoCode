"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ContactForm";

const FAQ = [
  {
    q: "Comment participer au festival ?",
    r: "L'entrée au festival Solimouv' est gratuite et ouverte à tous ! Rendez-vous au Centre Sportif Charles Moureu le jour J. Certains ateliers nécessitent une inscription préalable.",
  },
  {
    q: "Comment devenir bénévole ?",
    r: "Nous recrutons des bénévoles quelques semaines avant l'événement. Utilise le formulaire ci-dessus pour nous contacter.",
  },
  {
    q: "Puis-je amener des enfants ?",
    r: "Absolument ! Le festival est pensé pour être familial. Des ateliers spécifiques sont prévus pour les plus jeunes et les familles.",
  },
  {
    q: "Comment devenir une association partenaire ?",
    r: "Contacte-nous via le formulaire. Notre équipe te répondra dans les 48h avec toutes les informations.",
  },
  {
    q: "L'évènement est il accessible aux PMR ?",
    r: "Oui, le Centre Sportif Charles Moureu est entièrement accessible aux personnes à mobilité réduite. Des ateliers adaptés sont également proposés.",
  },
];

function FAQItem({ q, r }: { q: string; r: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden border-2 transition-colors"
      style={{ borderColor: open ? "var(--color-bleu-fonce)" : "#e5e7eb" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium pr-4" style={{ color: "var(--color-noir)" }}>
          {q}
        </span>
        <span
          className="shrink-0 text-xl font-light transition-transform duration-200"
          style={{
            color: "var(--color-bleu-fonce)",
            transform: open ? "rotate(45deg)" : "none",
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed opacity-60" style={{ color: "var(--color-noir)" }}>
          {r}
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto w-full px-4 pb-16" style={{ backgroundColor: "var(--color-blanc)" }}>

        {/* Hero */}
        <section className="pt-8 pb-8">
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}
          >
            On est là pour<br />t&apos;écouter
          </h1>
          <p className="text-base leading-relaxed opacity-70" style={{ color: "var(--color-noir)" }}>
            Une question, un besoin ou juste envie de nous saluer ?
            Écris-nous, on te répondra avec plaisir.
          </p>
        </section>

        {/* Formulaire */}
        <section className="mb-10">
          <ContactForm />
        </section>

        {/* FAQ */}
        <section>
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--color-noir)" }}
          >
            Les questions fréquentes (FAQ)
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <FAQItem key={item.q} q={item.q} r={item.r} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
