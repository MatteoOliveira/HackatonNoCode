import Link from "next/link";

const FOOTER_LINKS = [
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </svg>
    ),
  },
  {
    href: "/a-propos",
    label: "À propos",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    href: "/programme",
    label: "Programme",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p
          className="text-lg font-bold mb-0.5"
          style={{ color: "var(--color-orange)", fontFamily: "var(--font-titre)" }}
        >
          Up Sport!
        </p>
        <p className="text-sm opacity-60 mb-6" style={{ color: "var(--color-noir)" }}>
          Tactical Radical Benevolence
        </p>

        <nav aria-label="Liens du pied de page">
          <ul className="space-y-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-noir)" }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-8 text-xs opacity-40" style={{ color: "var(--color-noir)" }}>
          © 2024 Up Sport! - Tactical Radical Benevolence
        </p>
      </div>
    </footer>
  );
}
