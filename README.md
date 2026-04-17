# Solimouv' — PWA Festival du Sport Inclusif

> Application web progressive pour le festival **Solimouv'** organisé par **Up Sport!** à Paris.  
> Développée dans le cadre d'un hackathon M1 — livrée le 18 avril 2026.

**Production :** [hackaton-no-code.vercel.app](https://hackaton-no-code.vercel.app)  
**GitHub :** [MatteoOliveira/HackatonNoCode](https://github.com/MatteoOliveira/HackatonNoCode)

---

## Présentation

Solimouv' est le festival du sport inclusif qui réunit **13 associations parisiennes** pour une journée de sport gratuite, accessible à toutes et tous — familles, seniors, personnes en situation de handicap, personnes réfugiées, communauté LGBTQIA+.

Cette PWA permet aux participants de :

- Découvrir le programme des ateliers sportifs et s'y inscrire
- Créer un profil personnalisé (sport matcher inclusif)
- Gérer ses inscriptions aux ateliers depuis son profil
- Contacter l'équipe organisatrice
- Accéder au plan interactif du festival

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| **Next.js** | 16 (App Router + TypeScript) | Framework fullstack |
| **Tailwind CSS** | v4 | Styles utilitaires |
| **Supabase** | — | BDD PostgreSQL, Auth, Storage, RLS |
| **Make (Integromat)** | — | Automatisation : email de bienvenue déclenché par Supabase |
| **Vercel** | — | Hébergement + CI/CD automatique |
| **PWA** | — | manifest.json + service worker offline |

---

## Installation locale

### Prérequis

- Node.js 18+
- npm 9+
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/MatteoOliveira/HackatonNoCode.git
cd HackatonNoCode/solimouv-pwa

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement (voir section ci-dessous)
cp .env.local.example .env.local
# → éditer .env.local avec vos clés

# 4. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:3000**

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Supabase — obligatoire
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique
```

| Variable | Description | Obligatoire | Où la trouver |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | ✅ | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anonyme Supabase | ✅ | Supabase → Settings → API → `anon` key |

> ⚠️ Ne jamais committer `.env.local`. Il est ignoré par `.gitignore`.

---

## Accès et configurations du projet

### Supabase

| Paramètre | Valeur |
|---|---|
| **Project URL** | `https://gqjuqqnpefewqvxxqvfj.supabase.co` |
| **Anon Key (publique)** | Disponible dans Supabase → Settings → API → `anon` |
| **Publishable Key** | Disponible dans Supabase → Settings → API → `default` |
| **Service Role Key** | ⚠️ Secrète — Supabase → Settings → API → `service_role` (ne jamais exposer côté client) |

### Make (Integromat)

| Paramètre | Valeur |
|---|---|
| **Scénario** | `Solimouv - Nouvelles inscriptions` |
| **Déclencheur** | Supabase → table `profiles` (nouvelles lignes) |
| **Action 1** | Gmail → envoi email de bienvenue à l'utilisateur |
| **Blueprint importable** | [`make-blueprint.json`](./make-blueprint.json) |
| **Connexion Supabase requise** | Project URL + Service Role Key |
| **Connexion Gmail requise** | Compte Google de l'équipe |

> Pour configurer Make : importer `make-blueprint.json` → connecter Supabase + Gmail → activer le scénario.

### Google OAuth

| Paramètre | Valeur |
|---|---|
| **Provider** | Google (via Supabase Auth) |
| **Redirect URI** | `https://gqjuqqnpefewqvxxqvfj.supabase.co/auth/v1/callback` |
| **Configuration** | Google Cloud Console → OAuth 2.0 → Client ID + Secret → Supabase → Authentication → Providers → Google |

### Vercel

| Paramètre | Valeur |
|---|---|
| **URL production** | `https://hackaton-no-code.vercel.app` |
| **Déploiement** | Automatique à chaque push sur `main` |
| **Variables d'env** | Configurer dans Vercel → Settings → Environment Variables |

---

## Architecture base de données (Supabase)

```
auth.users                   ← Comptes (email ou Google OAuth)
public.profiles              ← Profils étendus (pseudo, préférences, rôle)
public.sports                ← Catalogue des sports
public.associations          ← Associations partenaires
public.ateliers              ← Ateliers du programme
public.sport_associations    ← Relation sport ↔ association
public.atelier_registrations ← Inscriptions user ↔ atelier
public.inscriptions          ← Profil sportif onboarding
public.checkins              ← Scan QR le jour J
public.messages_contact      ← Messages formulaire contact
public.config                ← Configuration (date festival, etc.)
```

Toutes les tables sont protégées par **Row Level Security (RLS)**.  
Migrations SQL dans [`supabase/migrations/`](./supabase/migrations/).

---

## Architecture Make — Automatisations

### Scénario : Solimouv - Nouvelles inscriptions

```
[Supabase] Watch new row in "profiles"
        ↓
[Gmail] Send welcome email → user.email
```

**Déclencheur :** Make surveille la table `profiles` en temps réel.  
Dès qu'un nouvel utilisateur s'inscrit (email ou Google OAuth), le scénario se déclenche automatiquement.

**Email envoyé :**
- **À :** `{{email}}` de la nouvelle ligne
- **Sujet :** `Bienvenue sur Solimouv', {{pseudo}} !`
- **Corps :** Message HTML de bienvenue au festival

**Blueprint :** Le fichier [`make-blueprint.json`](./make-blueprint.json) contient l'export complet du scénario. Il peut être importé directement dans Make via **3 points → Import Blueprint**.

---

## Pages

| Route | Description | Auth requise |
|---|---|---|
| `/` | Accueil — Hero, countdown, CTA | Non |
| `/programme` | Ateliers sportifs + modal inscription | Non |
| `/partenaires` | Associations partenaires | Non |
| `/contact` | Formulaire de contact + FAQ | Non |
| `/a-propos` | Présentation Up Sport! | Non |
| `/carte` | Plan interactif du festival | Non |
| `/inscription` | Onboarding 6 étapes (profil sportif) | Non |
| `/connexion` | Login email/password ou Google OAuth | Non |
| `/profil` | Profil utilisateur + inscriptions | Oui |
| `/admin` | Dashboard CRUD admin | Admin |

---

## Fonctionnalités

### Utilisateurs
- ✅ Inscription email/mot de passe (onboarding 6 étapes)
- ✅ Connexion/inscription **Google OAuth**
- ✅ Profil personnalisé (pronoms, pratique, accessibilité)
- ✅ Édition du profil inline sans rechargement
- ✅ Inscription et désinscription aux ateliers

### Programme
- ✅ Cartes ateliers avec image, citation, hashtags
- ✅ Modal détails : horaires, lieu, capacité, inscrits temps réel
- ✅ Inscription avec gestion des places

### Administration (`/admin`)
- ✅ Gestion des programmes (CRUD, upload image, liste inscrits)
- ✅ Gestion des partenaires (CRUD, badge, image)
- ✅ Gestion de l'événement (date countdown, lieu)
- ✅ Gestion des utilisateurs (recherche, rôles)

### Sécurité
- ✅ Headers HTTP (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- ✅ Server Action + validation serveur + honeypot (formulaire contact)
- ✅ RLS avec contraintes côté DB
- ✅ Rôles : `user` / `admin` / `super_admin`

---

## Déploiement sur Vercel

```bash
# Lier le projet
vercel link --project votre-projet

# Ajouter les variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Déployer
vercel --prod
```

Le déploiement est aussi automatique à chaque push sur `main`.

---

## Scripts

```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build production
npm run start    # Serveur production local
npm run lint     # Linting ESLint
```

---

## Structure du projet

```
solimouv-pwa/
├── public/
│   ├── manifest.json        # Config PWA
│   ├── sw.js                # Service Worker
│   ├── images/              # Images statiques
│   └── icons/               # Icônes PWA (72→512px)
├── src/
│   ├── app/                 # Pages (App Router Next.js)
│   │   ├── actions/         # Server Actions
│   │   ├── admin/           # Dashboard admin
│   │   ├── auth/callback/   # Callback OAuth
│   │   └── ...              # Pages publiques
│   ├── components/          # Composants React
│   │   ├── layout/          # Header, Footer
│   │   └── onboarding/      # Parcours inscription 6 étapes
│   ├── lib/
│   │   ├── supabase/        # Clients Supabase (client + server)
│   │   └── make.ts          # Utilitaire webhook Make (legacy)
│   └── types/               # Types TypeScript
├── supabase/
│   └── migrations/          # Migrations SQL
├── documentation/
│   ├── chat.md              # Journal de développement
│   └── technical.md         # Architecture technique détaillée
├── make-blueprint.json      # Export scénario Make importable
└── next.config.ts           # Config Next.js + headers sécurité
```

---

## Charte graphique

| Couleur | Hex | Usage |
|---|---|---|
| Noir | `#000814` | Texte principal |
| Blanc | `#fffcf9` | Fond page |
| Bleu foncé | `#013bb8` | CTA, liens |
| Bleu clair | `#47c3f6` | Déco |
| Rose | `#FF9CD0` | Logo, boutons, tags |
| Jaune | `#ffe96e` | Badges |
| Orange | `#FF4400` | Apostrophe logo, titres, alertes |

**Typographies :** Righteous (titres) + Lexend (corps) — Google Fonts

---

## Documentation

- [`documentation/chat.md`](./documentation/chat.md) — Journal de développement session par session
- [`documentation/technical.md`](./documentation/technical.md) — Architecture technique détaillée
- [`make-blueprint.json`](./make-blueprint.json) — Export scénario Make (importable directement)

---

## Client

**Up Sport!** — Association sportive parisienne engagée pour l'inclusion  
🌐 [unispourlesport.paris](https://www.unispourlesport.paris/)  
📍 Centre Sportif Charles Moureu, Paris 13e  
📱 [@solimouv.festival](https://www.instagram.com/solimouv.festival/)
