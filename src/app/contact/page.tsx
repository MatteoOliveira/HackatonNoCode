import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact – Solimouv'",
  description:
    "Contactez l'équipe de Solimouv' et d'Up Sport! pour toute question sur le festival, un partenariat ou pour rejoindre l'aventure.",
};

const FAQ = [
  {
    q: "Comment participer au festival ?",
    r: "L'entrée au festival Solimouv' est gratuite et ouverte à tous ! Rendez-vous au Centre Sportif Charles Moureu le jour J. Certains ateliers nécessitent une inscription préalable.",
  },
  {
    q: "Comment devenir bénévole ?",
    r: "Nous recrutons des bénévoles quelques semaines avant l'événement. Utilisez le formulaire ci-dessous en sélectionnant le sujet 'Bénévolat' pour nous contacter.",
  },
  {
    q: "Puis-je amener des enfants ?",
    r: "Absolument ! Le festival est pensé pour être familial. Des ateliers spécifiques sont prévus pour les plus jeunes et les familles.",
  },
  {
    q: "Comment devenir association partenaire ?",
    r: "Contactez-nous via le formulaire en sélectionnant 'Partenariat'. Notre équipe vous répondra dans les 48h avec toutes les informations.",
  },
  {
    q: "Le festival est-il accessible aux PMR ?",
    r: "Oui, le Centre Sportif Charles Moureu est entièrement accessible aux personnes à mobilité réduite. Des ateliers adaptés sont également proposés.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          className="py-24 px-4 text-center"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Nous contacter"
        >
          <h1 className="text-5xl sm:text-6xl mb-4" style={{ color: "var(--color-blanc)" }}>
            Contact
          </h1>
          <p className="text-xl opacity-70 max-w-xl mx-auto" style={{ color: "var(--color-bleu-clair)" }}>
            Une question ? Une idée ? On est là !
          </p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <section aria-label="Formulaire de contact">
            <h2 className="text-3xl mb-6" style={{ color: "var(--color-noir)" }}>
              Nous écrire
            </h2>
            <ContactForm />
          </section>

          {/* FAQ */}
          <section aria-label="Questions fréquentes">
            <h2 className="text-3xl mb-6" style={{ color: "var(--color-noir)" }}>
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <details
                  key={i}
                  className="rounded-xl border overflow-hidden group"
                  style={{ borderColor: "var(--color-bleu-fonce)" }}
                >
                  <summary
                    className="px-5 py-4 cursor-pointer font-medium list-none flex items-center justify-between"
                    style={{ color: "var(--color-noir)" }}
                  >
                    <span>{item.q}</span>
                    <span
                      className="ml-4 text-lg group-open:rotate-45 transition-transform duration-200"
                      style={{ color: "var(--color-bleu-fonce)" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm opacity-70">{item.r}</div>
                </details>
              ))}
            </div>

            {/* Infos de contact directes */}
            <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: "var(--color-bleu-fonce)" }}>
              <h3 className="text-xl mb-4" style={{ color: "var(--color-blanc)" }}>
                Coordonnées directes
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: "var(--color-blanc)" }}>
                <li className="flex items-center gap-3 opacity-80">
                  <span>🌐</span>
                  <a
                    href="https://www.unispourlesport.paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-100"
                  >
                    www.unispourlesport.paris
                  </a>
                </li>
                <li className="flex items-center gap-3 opacity-80">
                  <span>📍</span>
                  <span>Centre Sportif Charles Moureu, Paris 13e</span>
                </li>
                <li className="flex items-center gap-3 opacity-80">
                  <span>📱</span>
                  <a href="https://www.instagram.com/solimouv.festival/" target="_blank" rel="noopener noreferrer" className="underline">
                    @solimouv.festival
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
