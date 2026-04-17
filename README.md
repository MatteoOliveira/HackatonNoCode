# Solimouv' — PWA Festival du Sport Inclusif

> Application web progressive pour le festival **Solimouv'** organisé par **Up Sport!** à Paris.  
> Développée dans le cadre d'un hackathon M1 — livrée le 18 avril 2026.

**Production :** [hackaton-no-code.vercel.app](https://hackaton-no-code.vercel.app)  
**GitHub :** [MatteoOliveira/HackatonNoCode](https://github.com/MatteoOliveira/HackatonNoCode)

---

## Présentation

Solimouv' est un festival du sport inclusif qui réunit des associations sportives parisiennes pour proposer des ateliers ouverts à tous, sans jugement, avec bienveillance. Cette PWA permet aux participants de :

- Découvrir le programme des ateliers sportifs et s'y inscrire
- Créer un profil personnalisé (sport matcher inclusif)
- Gérer ses inscriptions aux ateliers depuis son profil
- Contacter l'équipe organisatrice
- Accéder au plan interactif du festival

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 16** (App Router + TypeScript) | Framework fullstack |
| **Tailwind CSS v4** | Styles utilitaires |
| **Supabase** | BDD PostgreSQL, Auth, Storage, RLS |
| **Vercel** | Hébergement + CI/CD |
| **PWA** | manifest.json + service worker |

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

# 3. Configurer les variables d'environnement
```

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

```bash
# 4. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:3000**

---

## Variables d'environnement

| Variable | Description | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anonyme Supabase | ✅ |

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

## Google OAuth — Configuration

1. [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 Client ID
2. Authorized redirect URI : `https://[ref].supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → Google
4. Supabase → URL Configuration → Site URL + Redirect URLs

---

## Déploiement sur Vercel

```bash
# Lier le projet
vercel link --project votre-projet

# Ajouter les variables
echo "https://..." | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "eyJ..."      | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Déployer
vercel --prod
```

---

## Git Flow

```
main         → Production (stable, déployé sur Vercel)
develop      → Branche d'intégration
feature/*    → Développement par fonctionnalité
```

---

## Charte graphique

| Couleur | Hex | Usage |
|---|---|---|
| Noir | `#000814` | Texte principal |
| Blanc | `#fffcf9` | Fond page |
| Bleu foncé | `#013bb8` | CTA, liens |
| Bleu clair | `#47c3f6` | Déco |
| Rose | `#ff9cd0` | Boutons, tags |
| Jaune | `#ffe96e` | Badges |
| Orange | `#ff4400` | Titres, alertes |

**Typographies :** Righteous (titres) + Lexend (corps) — Google Fonts

---

## Scripts

```bash
npm run dev      # Serveur de développement
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
│   │   └── onboarding/      # Parcours inscription
│   ├── lib/supabase/        # Clients Supabase
│   └── types/               # Types TypeScript
├── documentation/
│   ├── chat.md              # Journal de développement
│   └── technical.md         # Architecture technique
└── next.config.ts           # Config Next.js + sécurité
```

---

## Documentation

- [`documentation/chat.md`](./documentation/chat.md) — Journal de développement session par session
- [`documentation/technical.md`](./documentation/technical.md) — Architecture technique détaillée

---

## Client

**Up Sport!** — Association sportive parisienne engagée pour l'inclusion  
🌐 [unispourlesport.paris](https://www.unispourlesport.paris/)  
📍 Centre Sportif Charles Moureu, Paris 13e  
📱 [@solimouv.festival](https://www.instagram.com/solimouv.festival/)
