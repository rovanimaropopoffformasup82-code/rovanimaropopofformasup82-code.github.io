# CLAUDE.md - E-Portfolio Mercia

Mot-clé déclencheur : **portfolio**
Quand Mercia tape "portfolio", lire ce fichier, prendre le contexte, puis attendre l'instruction.

## Nature du projet

Vrai CV-portfolio professionnel, vivant : enrichi à chaque projet terminé.
Positionnement : professionnelle junior fraîchement diplômée, PAS étudiante.
Aucun vocabulaire scolaire (projet de formation, exercice, TP, note obtenue).

## Identité

- RANDRIANOME Rovanimaro El-Mercia, appelée Mercia
- Conceptrice Designer UI, titre RNCP35634 obtenu juillet 2026 (Formasup82, Montauban)
- Basée à Moissac (82), freelance et poste. TJM cible 200 euros/jour

## Direction visuelle

- Noir et or : fond `#0d0d0d`, accent or `#c9a84c`
- Titres : Playfair Display. Corps : une sans-serif lisible. Polices auto-hébergées woff2, `font-display: swap`, deux familles max.
- Sobre, beaucoup de respiration, animations discrètes (max 400 ms, aucune boucle).

## Structure des pages

Accueil | À propos et parcours | Projets | Fiche projet | CV | Contact

## Les sites vitrines (coeur du portfolio) - 5 cartes

En tête de l'accueil ET en tête de Projets, format plus large que les autres.
1. MAM Tiazaza - mamtiazaza.fr - WordPress vitrine + Espace Parents, staging, SEO (clics 6 à 30, impressions 14 à 73, PageSpeed 52 à 75)
2. HandiPro31 - www.handipro31.fr - refonte V2 MODX Revolution, charte, accessibilité, SEO technique, RGPD
3. Jaozafy Saveur - jaozafysaveur.fr - WooCommerce épices, logo/identité, PayPal + WooPayments, livraison FR/BE/LU/CH
4. Salon de Thé Champêtre - the-champetre.fr - WordPress, projet de groupe
5. Co&Co - co-co-shop.netlify.app - site d'entraînement (présenté comme tel)

Projets secondaires : Quiz React 227 questions, BrainQuest (PWA), Simulateur de réseaux sociaux.

## Filtre Projets (JS)

Exactement trois libellés : `Tous les projets` | `Développement Site Web` | `Conception Visuelle`
Annoncé aux lecteurs d'écran : `aria-pressed` + région live.

## Décisions verrouillées (session 2026-07-24)

- Chatbot retiré, remplacé par bouton WhatsApp flottant.
- mesoutils.html retirée de la nav (fichier conservé, pas supprimé).
- Captures sites : réelles via Chrome, dans cadres stylés.
- Déploiement actuel o2switch via .cpanel.yml (le brief mentionne GitHub Pages pour le README).

## Terminologie imposée

- « Développement Site Web », jamais « Dev »
- « Conception Visuelle », jamais « Design UI »

## Règles de rédaction

Première personne, humain, direct, factuel. Junior assumé, sans excuse ni survente.
Interdits : emojis, tiret long/cadratin, formules à odeur d'IA, superlatifs creux.
Séparateurs autorisés : `-` ou `|` uniquement.
Ne rien inventer : aucun chiffre/client/compétence hors brief. Si une info manque, demander.

## Exigences techniques

- Responsive mobile-first, points de rupture 360 / 768 / 1024 / 1440. Pas de scroll horizontal, cibles tactiles 44 px.
- Écoconception : HTML/CSS/JS natifs, images WebP/AVIF + lazy + dimensions + srcset. Budget < 1 Mo et < 25 requêtes par page.
- Accessibilité RGAA 4.1 / WCAG 2.1 AA : contraste 4.5:1, sémantique, skip-link, focus visible, `prefers-reduced-motion`.
- SEO : meta title/description, Open Graph, JSON-LD Person, sitemap.xml, robots.txt. Cible Lighthouse 95+.

## Méthode de travail

Mercia pilote, l'assistant exécute. Étapes courtes validées. Un commit par intention.
Ne rien supprimer ni renommer sans validation. Avancer page par page, montrer, attendre validation.
Économie de tokens : répondre exactement à ce qui est demandé, sans suggestion non sollicitée.
Retour honnête plutôt que validation de complaisance.
