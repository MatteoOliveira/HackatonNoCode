import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-auto py-12 px-4"
      style={{ backgroundColor: "var(--color-noir)", color: "var(--color-blanc)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2
            className="text-2xl mb-2"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-clair)" }}
          >
            Solimouv&apos;
          </h2>
          <p className="text-sm opacity-70">
            Le festival du sport inclusif organisé par Up Sport!
          </p>
        </div>

        <nav aria-label="Liens rapides">
          <h3 className="font-semibold mb-3" style={{ color: "var(--color-jaune)" }}>
            Liens rapides
          </h3>
          <ul className="space-y-2 text-sm opacity-80">
            {[
              { href: "/a-propos", label: "À Propos" },
              { href: "/programme", label: "Programme" },
              { href: "/partenaires", label: "Partenaires" },
              { href: "/contact", label: "Contact" },
              { href: "/carte", label: "Carte Live" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-semibold mb-3" style={{ color: "var(--color-jaune)" }}>
            Réseaux sociaux
          </h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <a
                href="https://www.instagram.com/solimouv.festival/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
              >
                Instagram Solimouv&apos;
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/unispourlesport/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
              >
                Instagram Up Sport!
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/UpSport.UNis/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-50">
        <p>© 2025 Up Sport! – Festival Solimouv'. Tous droits réservés.</p>
        <p className="mt-1">
          <Link href="/mentions-legales" className="hover:opacity-100">
            Mentions légales
          </Link>{" "}
          ·{" "}
          <Link href="/confidentialite" className="hover:opacity-100">
            Politique de confidentialité
          </Link>
        </p>
      </div>
    </footer>
  );
}
