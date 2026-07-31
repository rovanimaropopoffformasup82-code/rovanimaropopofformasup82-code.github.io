# Portfolio - Mercia RANDRIANOME

E-portfolio de Mercia RANDRIANOME, conceptrice designer UI. Sites web, conception visuelle, SEO et accessibilité.

En ligne : https://portfolio-mercia.ikala-ni.fr

## 1. Présentation

Portfolio professionnel présentant des projets réels livrés en production (sites WordPress, WooCommerce et MODX), des travaux de conception visuelle et des projets de développement. Le contenu est réparti en six pages : Accueil, Réalisations, Fiche projet, À propos, CV et Contact.

C'est un portfolio vivant : il est enrichi à chaque nouveau projet terminé.

## 2. Stack et choix techniques

- HTML, CSS et JavaScript natifs. Aucun framework, aucune librairie non indispensable.
- Deux polices auto-hébergées en woff2 : Playfair Display (titres) et Inter (corps), avec `font-display: swap`.
- Palette sombre noir et or : fond `#0d0d0d`, accent or `#c9a84c`.

### Éco-conception

- Images en WebP, avec `loading="lazy"` et dimensions explicites. Conversion via `tools/to-webp.py`.
- Polices auto-hébergées : aucun appel à un CDN tiers.
- Aucune vidéo en lecture automatique, aucun traceur superflu.
- Objectif : moins de 1 Mo et moins de 25 requêtes par page.

### Accessibilité (RGAA 4.1 / WCAG 2.1 AA)

- HTML sémantique, landmarks, lien d'évitement en début de page.
- Navigation clavier complète, focus visible jamais supprimé.
- Textes alternatifs, labels explicites sur tous les champs.
- Filtre des projets annoncé aux lecteurs d'écran (`aria-pressed` et région live).
- Respect strict de `prefers-reduced-motion` : toutes les animations sont neutralisées.
- Aucune information transmise par la seule couleur.

### SEO

- Meta title et description par page, Open Graph, JSON-LD `Person`.
- `sitemap.xml` et `robots.txt`.

## 3. Arborescence

```
.
├── index.html                 Accueil
├── realisations.html          Catalogue des projets (filtre)
├── apropos.html               À propos et parcours
├── cv.html                    CV (imprimable, PDF)
├── contact.html               Contact (formulaire)
├── sitemap.xml
├── robots.txt
├── css/
│   ├── style.css              Styles globaux, variables, navigation, footer
│   ├── fiche.css              Mise en page des fiches projet
│   ├── contact.css
│   └── ...
├── js/
│   └── main.js                Menu mobile
├── projets/                   Fiches projet détaillées
│   ├── handipro31.html
│   ├── mam-tiazaza.html
│   ├── jaozafy-saveur.html
│   ├── salon-de-the-champetre.html
│   └── co-co.html
├── assets/
│   ├── fonts/                 Polices woff2 auto-hébergées
│   ├── images/                Visuels (WebP)
│   └── cv/Mercia-CV.pdf
└── tools/
    ├── to-webp.py             Convertisseur d'images en WebP
    └── convertir-webp.bat     Glisser-déposer pour convertir
```

## 4. Lancement en local

Le site est statique. Ouvrir un serveur local à la racine du projet :

```
python -m http.server 8777
```

Puis ouvrir http://localhost:8777 dans le navigateur.

Pour convertir des images en WebP : glisser une image ou un dossier sur `tools/convertir-webp.bat`, ou lancer `python tools/to-webp.py chemin`.

## 5. Déploiement

### o2switch (production actuelle)

Une seule commande met tout à jour :

```
git push
```

Elle envoie les commits sur GitHub **et** sur le dépôt hébergé chez o2switch. Ce second envoi déclenche automatiquement le déploiement décrit dans `.cpanel.yml` : un `rsync` copie les fichiers du site dans `/home/wami9481/Portfolio-Mercia.ikala-ni.fr/`, en imposant les permissions Unix (dossiers 755, fichiers 644) et en excluant tout ce qui ne doit pas être public.

Adresse en ligne : `portfolio-mercia.ikala-ni.fr`

**Prérequis côté serveur, déjà en place :**

- l'adresse IP de la connexion est autorisée dans cPanel > Autorisation SSH (port 22)
- la clé publique `id_ed25519_o2switch` est importée et autorisée dans cPanel > Accès SSH
- le dépôt `/home/wami9481/repositories/portfolio-mercia` est créé dans Git Version Control, branche `main`

**Si un jour `git push` répond « connection timed out » :** c'est presque toujours l'adresse IP de la box qui a changé. Il suffit de la remettre à jour dans cPanel > Autorisation SSH.

### GitHub Pages (alternative)

Le site étant entièrement statique, il peut aussi être publié sur GitHub Pages : activer Pages sur la branche `main` dans les réglages du dépôt. Le formulaire de contact (FormSubmit) fonctionne dans les deux cas.

## 6. Ma manière de travailler

- Je pilote, l'assistant exécute. Je décide de la direction, je valide chaque étape.
- Économie de tokens : réponses courtes, on répond exactement à ce qui est demandé, sans suggestion non sollicitée.
- Jamais de quantité différente de ce qui est demandé. Si le nombre n'est pas précisé, on demande avant de produire.
- Retour honnête plutôt que validation de complaisance. Je préfère qu'on me dise ce qui ne va pas.
- Un fichier `CLAUDE.md` à la racine de chaque projet : un mot-clé déclencheur, lecture du contexte, puis attente d'instruction.
- Travail par étapes courtes et validées, un commit par intention, messages de commit explicites.
- Respect mutuel dans la collaboration, humaine comme assistée.
