# Solimouv' PWA

PWA de communication pour le festival du sport inclusif **Solimouv'** organisé par **Up Sport!** à Paris.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (charte graphique custom)
- **Supabase** (base de données, auth, realtime)
- **Vercel** (hébergement, CI/CD)
- **PWA** (manifest + service worker)

## Lancer en local

```bash
# 1. Cloner le repo
git clone https://github.com/[org]/solimouv-pwa
cd solimouv-pwa

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
cp .env.local.example .env.local
# Renseigner SUPABASE_URL et SUPABASE_ANON_KEY

# 4. Lancer le serveur de dev
npm run dev
```

L'application est disponible sur http://localhost:3000

## Pages

| URL | Description |
|---|---|
| `/` | Accueil – Hero, chiffres clés, programmes, CTA |
| `/a-propos` | À Propos – Up Sport!, chronologie, valeurs |
| `/programme` | Programme – Ateliers avec jauge places, filtres |
| `/partenaires` | Partenaires – Associations et institutionnels |
| `/contact` | Contact – Formulaire + FAQ |
| `/carte` | Carte Live – Plan SVG interactif du festival |
| `/soutenir` | Soutenir – Campagne de don (en cours) |

## Déploiement Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. Ajouter les variables d'environnement Supabase
3. Ajouter `NEXT_PUBLIC_BASE_URL` = votre domaine Vercel
4. Deploy automatique à chaque push sur `main`

## Git Flow

```
main         → Production (tags vX.X)
develop      → Intégration
feature/*    → Développement par feature
hotfix/*     → Correctifs urgents
release/*    → Préparation release
```

## Documentation

- [`documentation/chat.md`](./documentation/chat.md) – Journal de développement
- [`documentation/technical.md`](./documentation/technical.md) – Architecture technique

## Charte graphique

| Couleur | Hex | Usage |
|---|---|---|
| Noir | `#000814` | Fond, texte |
| Blanc | `#fffcf9` | Fond page |
| Bleu foncé | `#013bb8` | CTA, accents |
| Bleu clair | `#47c3f6` | Pictos, liens |
| Rose | `#ff9cd0` | Programme féminin |
| Jaune | `#ffe96e` | Chiffres clés |
| Orange | `#ff4400` | CTA urgence, alertes |

Typographies : **Righteous** (titres) + **Lexend** (texte)

## Client

**Up Sport!** – Association sportive parisienne – [unispourlesport.paris](https://www.unispourlesport.paris/)
