# Documentation Technique – Solimouv' PWA

## Stack technique

| Couche | Technologie | Raison du choix |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR/SSG natif, SEO parfait, Vercel-first |
| Langage | TypeScript | Robustesse, typage des données Supabase |
| Styles | Tailwind CSS v4 + CSS Variables | Charte graphique custom, responsive rapide |
| Base de données | Supabase (PostgreSQL) | BaaS gratuit, Auth, Realtime, Storage |
| Hébergement | Vercel | Intégration Next.js native, déploiement CI/CD auto |
| Versioning | Git Flow | Branches feature/* isolées, traçabilité |

## Architecture du projet

```
solimouv-pwa/
├── src/
│   ├── app/                     # App Router Next.js
│   │   ├── page.tsx             # Accueil
│   │   ├── a-propos/page.tsx    # À Propos
│   │   ├── programme/page.tsx   # Programme & Ateliers
│   │   ├── partenaires/page.tsx # Partenaires
│   │   ├── contact/page.tsx     # Contact
│   │   ├── carte/page.tsx       # Carte Live
│   │   ├── layout.tsx           # Layout racine (metadata PWA, Open Graph)
│   │   ├── globals.css          # Charte graphique (CSS variables)
│   │   ├── sitemap.ts           # Sitemap XML dynamique
│   │   └── robots.ts            # robots.txt
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Navigation responsive
│   │   │   └── Footer.tsx       # Footer avec liens
│   │   ├── ContactForm.tsx      # Formulaire contact RGPD
│   │   └── PWARegister.tsx      # Enregistrement service worker
│   ├── lib/supabase/
│   │   ├── client.ts            # Client navigateur
│   │   └── server.ts            # Client serveur (SSR)
│   └── types/index.ts           # Types TypeScript partagés
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker (cache + push)
│   └── icons/                   # Icônes PWA (à générer)
└── documentation/
    ├── chat.md                  # Journal de développement
    └── technical.md             # Ce fichier
```

## Charte graphique

### Palette de couleurs
| Variable CSS | Valeur | Usage |
|---|---|---|
| `--color-noir` | `#000814` | Fond hero, header, texte principal |
| `--color-blanc` | `#fffcf9` | Fond page, texte sur fond sombre |
| `--color-bleu-fonce` | `#013bb8` | CTA primaire, accents |
| `--color-bleu-clair` | `#47c3f6` | Pictos, liens, programme Exilé |
| `--color-rose` | `#ff9cd0` | Programme Féminin, accents |
| `--color-jaune` | `#ffe96e` | Chiffres clés, stats |
| `--color-orange` | `#ff4400` | CTA urgence (Soutenir, complet) |

### Typographie
- **Titres** : Righteous (Google Fonts) – `font-family: var(--font-titre)`
- **Texte courant** : Lexend (Google Fonts) – `font-family: var(--font-texte)`

## PWA

La PWA est configurée avec :
- `manifest.json` : icônes, couleurs, display standalone
- `sw.js` : service worker avec stratégie cache-first + push notifications
- `PWARegister.tsx` : composant client qui enregistre le SW au démarrage
- Métadonnées `viewport` et `appleWebApp` dans `layout.tsx`

**Pour générer les icônes** : utiliser [pwa-asset-generator](https://github.com/elegantapp/pwa-asset-generator)
```bash
npx pwa-asset-generator logo.svg public/icons --manifest public/manifest.json
```

## Supabase – Configuration

### Variables d'environnement
Copier `.env.local.example` en `.env.local` et renseigner :
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Tables prévues
```sql
-- Ateliers du programme
CREATE TABLE ateliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  association TEXT,
  lieu TEXT,
  horaire_debut TIMESTAMPTZ,
  horaire_fin TIMESTAMPTZ,
  capacite INT DEFAULT 20,
  inscrits INT DEFAULT 0,
  programme TEXT CHECK (programme IN ('exile','feminin','apa','insertion','general')),
  image_url TEXT
);

-- Partenaires
CREATE TABLE partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  site_url TEXT,
  type TEXT CHECK (type IN ('association','institutionnel','sponsor'))
);

-- Dons (Brique A)
CREATE TABLE dons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  montant INT NOT NULL,
  message TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## SEO

- `layout.tsx` : Open Graph, Twitter Card, manifest link, apple-web-app
- `sitemap.ts` : sitemap XML dynamique (Next.js API)
- `robots.ts` : robots.txt (Next.js API)
- Structure sémantique : `<header>`, `<main>`, `<section aria-label>`, `<article>`, `<nav aria-label>`, `<footer>`
- Titres hiérarchiques respectés (h1 → h6)

## Déploiement Vercel

1. Importer le repo GitHub dans Vercel
2. Framework : Next.js (détection automatique)
3. Variables d'environnement : renseigner SUPABASE_URL, SUPABASE_ANON_KEY
4. `NEXT_PUBLIC_BASE_URL=https://votre-domaine.vercel.app`
5. Deploy !

## Git Flow

```
main                   → Production stable (tags v0.1, v0.2, v1.0)
develop                → Intégration des features
feature/nom-feature    → Une feature = une branche
hotfix/nom-fix         → Correctif urgent sur main
release/vX.X           → Branche de release (tests avant merge main)
```

**Règles :**
- `feature/*` branch depuis `develop`, merge dans `develop` en no-fast-forward
- `hotfix/*` branch depuis `main`, merge dans `main` ET `develop`
- `release/*` branch depuis `develop`, merge dans `main` et `develop`
