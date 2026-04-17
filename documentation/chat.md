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

---

## 17 avril 2026 – Login + Profil

### Problème identifié
La table `profiles` Supabase avait des colonnes différentes de celles utilisées dans le code :
- DB : `prenom`, `tranche_age`, `centres_interet`, `besoins_accessibilite`
- Code : `pseudo`, `pronouns`, `pratique`, `besoin`, `accessibilite`
→ L'inscription échouait silencieusement (colonnes inexistantes).

### Ce que j'ai fait

**Migration Supabase (`fix_profiles_columns`)**
- Ajout des colonnes manquantes dans `profiles` : `pseudo`, `email`, `pronouns`, `pratique`, `besoin`, `accessibilite text[]`
- Renommage de `besoins_accessibilite` → `besoins_accessibilite_legacy` (conservation des données)
- Mise à jour du trigger `handle_new_user` pour insérer aussi `pseudo` depuis les métadonnées auth

**Nouvelle page `/connexion`**
- `src/app/connexion/page.tsx` : page Next.js avec metadata
- `src/components/ConnexionClient.tsx` : formulaire email/password, `supabase.auth.signInWithPassword()`, gestion erreurs (mauvais identifiants, email non confirmé), redirection vers `/profil`

**Header mis à jour**
- Lien "Se connecter" ajouté dans le menu mobile drawer (`/connexion`)

### État
- Inscription : crée un compte auth + profil en DB ✅
- Connexion : formulaire complet sur `/connexion` ✅
- Profil : lit depuis Supabase (fallback localStorage) ✅
- Colonnes DB alignées avec le code ✅

**Bugs corrigés :**
- Trigger `handle_new_user` : `SET search_path = public` ajouté (SECURITY DEFINER ne trouve pas `profiles` sinon)
- RLS policies `profiles` : récursion infinie corrigée via fonction `get_my_role()` SECURITY DEFINER

**Page profil enrichie (17 avril) :**
- Section "Mon compte" : email, date d'inscription, préférences notifications
- Section "Ce qui me fait du bien" : pratique + besoin
- Section "Mes besoins spécifiques" : accessibilité
- Section "Mes activités recommandées" : 4 activités selon profil
- Section "Mes participations" : checkins du jour J avec paliers débloqués
- Badges pronoms + rôle (admin/super_admin)
- Bouton "Se déconnecter" (Supabase signOut → redirect /)
