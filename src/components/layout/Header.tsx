"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/programme", label: "Programme" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Avatar icon */}
          <Link href="/profil" aria-label="Mon profil">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="15" stroke="var(--color-orange)" strokeWidth="2" fill="none" />
              <circle cx="16" cy="13" r="5" fill="var(--color-orange)" />
              <path
                d="M6 27c0-5.523 4.477-10 10-10s10 4.477 10 10"
                stroke="var(--color-orange)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-orange)" }}
          >
            Solimouv&apos;
          </Link>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-1"
          >
            <span
              className="block w-6 h-0.5 transition-all"
              style={{
                backgroundColor: "var(--color-noir)",
                transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all"
              style={{
                backgroundColor: "var(--color-noir)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all"
              style={{
                backgroundColor: "var(--color-noir)",
                transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Menu mobile drawer */}
      {menuOpen && (
        <nav
          className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 max-w-2xl mx-auto"
          aria-label="Navigation principale"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-2 rounded-lg text-base font-medium transition-colors"
              style={{
                color: pathname === link.href ? "var(--color-orange)" : "var(--color-noir)",
                backgroundColor: pathname === link.href ? "#fff5f0" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/soutenir"
            onClick={() => setMenuOpen(false)}
            className="mt-3 py-3 rounded-xl text-center font-semibold"
            style={{ backgroundColor: "var(--color-orange)", color: "var(--color-blanc)" }}
          >
            Soutenir →
          </Link>
        </nav>
      )}
    </header>
  );
}
