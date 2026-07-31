/* ══════════════════════════════════════════════════════════════════════════════
   MAIN.JS - Scripts JavaScript du portfolio
   RANDRIANOME Mercia
   
   Ce fichier contient :
   - Menu mobile (burger)
   - Effet de la navigation au scroll
   - Animation d'apparition des éléments
══════════════════════════════════════════════════════════════════════════════ */


/* ==============================================================================
   1. MENU MOBILE (BURGER)
   ==============================================================================
   
   Quand on clique sur le burger :
   - Le menu s'ouvre (classe "actif" ajoutée)
   - Re-cliquer le ferme (classe "actif" retirée)
*/

// Sélectionne les éléments du DOM
const navBurger = document.querySelector('.nav-burger');
const navLiens = document.querySelector('.nav-liens');

// Si le burger existe (il n'existe que sur mobile)
if (navBurger) {
    
    // Au clic sur le burger
    navBurger.addEventListener('click', function() {
        // Toggle = ajoute la classe si elle n'existe pas, la retire sinon
        navLiens.classList.toggle('actif');
        navBurger.classList.toggle('actif');
    });
}

// Ferme le menu quand on clique sur un lien
const tousLesLiens = document.querySelectorAll('.nav-liens a');

tousLesLiens.forEach(function(lien) {
    lien.addEventListener('click', function() {
        navLiens.classList.remove('actif');
        navBurger.classList.remove('actif');
    });
});


/* ==============================================================================
   2. NAVIGATION - EFFET AU SCROLL
   ==============================================================================
   
   Quand on scroll vers le bas :
   - La navigation devient plus compacte
   - Le fond devient plus opaque
*/



/* ==============================================================================
   3. ANIMATION D'APPARITION AU SCROLL
   ==============================================================================
   
   Les cartes apparaissent avec une animation quand elles entrent dans l'écran.
   Utilise l'Intersection Observer API (moderne et performant).
*/

// Options de l'observer
const optionsObserver = {
    threshold: 0.1,                    // Déclenche quand 10% de l'élément est visible
    rootMargin: '0px 0px -50px 0px'    // Déclenche un peu avant que l'élément soit visible
};

// Création de l'observer
const observer = new IntersectionObserver(function(entries) {
    
    entries.forEach(function(entry) {
        // Si l'élément est visible
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
    
}, optionsObserver);

// Sélectionne tous les éléments à animer
const elementsAAnimer = document.querySelectorAll('.service-carte, .projet-carte');

// Applique le style initial et observe chaque élément
elementsAAnimer.forEach(function(element) {
    // Style initial (invisible et décalé vers le bas)
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Commence à observer l'élément
    observer.observe(element);
});

/* ==============================================================================
   4. COORDONNÉES PROTÉGÉES
   ==============================================================================

   L'email et le téléphone ne sont pas écrits en clair dans le HTML : ils sont
   encodés en base64 dans des attributs data, et reconstruits ici au chargement.
   Les robots à spam qui lisent le code source ne récupèrent donc rien.
*/

(function () {
    // Décode une chaîne base64
    function lire(valeur) {
        try {
            return atob(valeur);
        } catch (e) {
            return '';
        }
    }

    // Email : href mailto + texte affiché
    document.querySelectorAll('.js-mail').forEach(function (a) {
        const mail = lire(a.getAttribute('data-m'));
        if (!mail) return;
        a.href = 'mailto:' + mail;
        a.textContent = mail;
    });

    // Téléphone : href tel + numéro affiché au format lisible
    document.querySelectorAll('.js-tel').forEach(function (a) {
        const numero = lire(a.getAttribute('data-t'));
        const affiche = lire(a.getAttribute('data-a'));
        if (!numero) return;
        a.href = 'tel:' + numero;
        a.textContent = affiche || numero;
    });

})();


// Ajoute les styles pour les éléments visibles
const styleAnimation = document.createElement('style');
styleAnimation.textContent = `
    .service-carte.visible,
    .projet-carte.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleAnimation);