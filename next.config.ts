import type { NextConfig } from "next";

const SUPABASE_URL = "https://gqjuqqnpefewqvxxqvfj.supabase.co";

// Content Security Policy — adapté Next.js 16 + Supabase + Google Fonts + PWA
const CSP = [
  "default-src 'self'",
  // Next.js inline scripts (hydration) + Service Worker
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind inline styles + Google Fonts CSS
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  // Polices Google
  "font-src 'self' https://fonts.gstatic.com",
  // Images : site + Supabase Storage + data URIs + blob (aperçus upload)
  `img-src 'self' ${SUPABASE_URL} data: blob:`,
  // Requêtes API + Supabase Realtime (WebSocket)
  `connect-src 'self' ${SUPABASE_URL} wss://${new URL(SUPABASE_URL).hostname}`,
  // Service Worker + manifest PWA
  "worker-src 'self'",
  "manifest-src 'self'",
  // Empêche l'intégration dans des iframes externes
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Toutes les pages
        source: "/(.*)",
        headers: [
          // Anti-clickjacking
          { key: "X-Frame-Options",        value: "DENY" },
          // Bloque le MIME sniffing (lecture de fichiers comme scripts)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Protection XSS navigateurs legacy
          { key: "X-XSS-Protection",       value: "1; mode=block" },
          // Limite les infos de navigation transmises en referrer
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          // Désactive fonctionnalités sensibles inutilisées
          { key: "Permissions-Policy",      value: "geolocation=(), microphone=(), camera=(), payment=(), usb=()" },
          // Force HTTPS pour 1 an (HSTS)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // CSP
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      // Service Worker : jamais mis en cache, scope complet
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type",          value: "application/javascript; charset=utf-8" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Cache-Control",          value: "no-cache, no-store, must-revalidate" },
        ],
      },
      // Manifest PWA : cache court
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type",  value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
