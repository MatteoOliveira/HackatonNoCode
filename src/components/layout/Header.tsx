"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/programme", label: "Programme" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/carte", label: "Carte Live" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "var(--color-noir)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-clair)" }}
          >
            Solimouv&apos;
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  color:
                    pathname === link.href
                      ? "var(--color-bleu-clair)"
                      : "var(--color-blanc)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/soutenir"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-orange)",
                color: "var(--color-blanc)",
              }}
            >
              Soutenir
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded"
            style={{ color: "var(--color-blanc)" }}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5" />
            <span className="block w-6 h-0.5 bg-current mb-1.5" />
            <span className="block w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{ backgroundColor: "var(--color-noir)" }}
          aria-label="Navigation mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-2 border-b"
              style={{
                color:
                  pathname === link.href
                    ? "var(--color-bleu-clair)"
                    : "var(--color-blanc)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/soutenir"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-2 rounded-full text-sm font-semibold text-center"
            style={{
              backgroundColor: "var(--color-orange)",
              color: "var(--color-blanc)",
            }}
          >
            Soutenir
          </Link>
        </nav>
      )}
    </header>
  );
}
