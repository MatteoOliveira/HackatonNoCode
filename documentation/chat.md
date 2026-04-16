# Chat – Journal de développement

## 16 avril 2026 – Session Hackathon

### Contexte
Hackathon Solimouv' – Up Sport! – PWA de communication pour le festival du sport inclusif.

### Ce que j'ai fait

**Initialisation du projet**
- Création d'un projet Next.js 16 avec TypeScript, Tailwind CSS, App Router, src-dir
- Installation des dépendances : `@supabase/supabase-js`, `@supabase/ssr`, `next-pwa`
- Configuration Git avec le git flow demandé : `main` → `develop` → branches `feature/*`

**Charte graphique (feature/design-system)**
- Configuration `globals.css` avec les variables CSS de la palette Solimouv (noir #000814, blanc #fffcf9, bleu foncé #013bb8, bleu clair #47c3f6, rose #ff9cd0, jaune #ffe96e, orange #ff4400)
- Fonts Google : Righteous (titres) + Lexend (texte courant)
- Composants `Header` et `Footer` responsives (mobile hamburger menu)
- PWA : `manifest.json` + service worker `sw.js` (cache statique + push notifications)
- Composant `PWARegister` client pour enregistrement du SW
- Types TypeScript : `Atelier`, `Partenaire`, `Don`, `Quiz`, `SportMatch`, `ContactFormData`
- Clients Supabase : `client.ts` (browser) et `server.ts` (SSR avec cookies)

**Pages créées**

| Branche | Page | Description |
|---|---|---|
| `feature/home-page` | `/` | Hero animé, chiffres clés, grille programmes, CTA don, flux RS |
| `feature/about-page` | `/a-propos` | Histoire Up Sport!, chronologie timeline, 4 valeurs, stats Solimouv |
| `feature/programme-page` | `/programme` | Liste ateliers avec jauge places, filtres par programme, infos pratiques |
| `feature/partenaires-page` | `/partenaires` | Logothèque asso + institutionnels, CTA devenir partenaire |
| `feature/contact-page` | `/contact` | Formulaire RGPD-conforme, FAQ accordéon, coordonnées |
| `feature/carte-live` | `/carte` | Carte SVG interactive, marqueurs stands, légende, infos accès |
| `feature/seo-sitemap` | `/sitemap.xml` `/robots.txt` | SEO : sitemap dynamique, robots, Open Graph |

**Architecture Git Flow**
```
main (v0.1 à venir)
  └── develop
        ├── feature/design-system ✅ merged
        ├── feature/home-page ✅ merged
        ├── feature/about-page ✅ merged
        ├── feature/programme-page ✅ merged
        ├── feature/partenaires-page ✅ merged
        ├── feature/contact-page ✅ merged
        ├── feature/carte-live ✅ merged
        └── feature/seo-sitemap ✅ merged
```

**Intégration maquette (feature/integration-home)**
- Header : logo Solimouv' orange, icône user SVG, hamburger animé avec drawer mobile
- Hero : badge rose "Ouvert à tous·tes", titre bleu foncé Righteous 4xl, blob rose décoratif top-right
- Composant `HeroImage` (client) : affiche photo ou fallback emoji si image absente
- Composant `Countdown` (client) : compte à rebours live vers le 11 juillet 2026, blocs roses
- CTA orange plein-largeur "Rejoignez le terrain !"
- 2 boutons grid bleu bordure : "Nos partenaires" + "Nos défis !"
- Footer : fond gris clair, "Up Sport!" orange, liens avec icônes SVG

### Prochaines étapes
- [ ] Branche `feature/supabase-integration` : connexion DB réelle, tables, RLS
- [ ] Branche `feature/admin-dashboard` : CRUD quiz, gestion programme (Brique E)
- [ ] Branche `feature/sport-matcher` : questionnaire matching sportif (Brique G)
- [ ] Branche `feature/don-cagnotte` : formulaire don + barre progression (Brique A)
- [ ] Publier le repo GitHub et déployer sur Vercel
- [ ] Configurer les variables d'environnement Supabase
