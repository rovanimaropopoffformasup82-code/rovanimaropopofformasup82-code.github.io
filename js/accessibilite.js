/* ══════════════════════════════════════════════════════════════════════
   RÉGLAGES D'ACCESSIBILITÉ
   Portfolio Mercia RANDRIANOME

   Ce script construit lui-même le bouton et le panneau, il suffit donc de
   l'appeler dans une page pour que le réglage y soit disponible.

   Les préférences sont enregistrées dans le navigateur du visiteur
   (localStorage) : elles le suivent de page en page et d'une visite à
   l'autre, sans compte ni cookie envoyé au serveur.
   ══════════════════════════════════════════════════════════════════════ */

(function () {
  var CLE = 'mercia-a11y';
  var racine = document.documentElement;

  // Réglages disponibles. "taille" a trois niveaux, les autres sont des oui/non.
  var etat = { taille: 0, contraste: false, liens: false, animations: false };

  // ── Lecture et écriture des préférences ──────────────────────────────
  function charger() {
    try {
      var enregistre = JSON.parse(localStorage.getItem(CLE) || '{}');
      Object.keys(etat).forEach(function (k) {
        if (k in enregistre) etat[k] = enregistre[k];
      });
    } catch (e) {
      /* stockage indisponible : on reste sur les valeurs par défaut */
    }
  }

  function enregistrer() {
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
    } catch (e) {}
  }

  // ── Application à la page ────────────────────────────────────────────
  function appliquer() {
    racine.classList.remove('a11y-texte-1', 'a11y-texte-2');
    if (etat.taille > 0) racine.classList.add('a11y-texte-' + etat.taille);
    racine.classList.toggle('a11y-contraste', !!etat.contraste);
    racine.classList.toggle('a11y-liens', !!etat.liens);
    racine.classList.toggle('a11y-anim-off', !!etat.animations);
  }

  // ── Construction de l'interface ──────────────────────────────────────
  function interrupteur(libelle, cle) {
    var ligne = document.createElement('div');
    ligne.className = 'a11y-ligne';

    var texte = document.createElement('span');
    texte.id = 'a11y-lbl-' + cle;
    texte.textContent = libelle;

    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'a11y-switch';
    bouton.setAttribute('aria-pressed', etat[cle] ? 'true' : 'false');
    bouton.setAttribute('aria-labelledby', texte.id);

    bouton.addEventListener('click', function () {
      etat[cle] = !etat[cle];
      bouton.setAttribute('aria-pressed', etat[cle] ? 'true' : 'false');
      appliquer();
      enregistrer();
    });

    ligne.appendChild(texte);
    ligne.appendChild(bouton);
    return ligne;
  }

  function construire() {
    // Bouton flottant : le pictogramme universel d'accessibilité
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'a11y-btn';
    btn.id = 'a11y-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'a11y-panneau');
    btn.setAttribute('aria-label', "Réglages d'accessibilité");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<circle cx="12" cy="3.6" r="2.1"/>' +
      '<path d="M20.2 6.4c-2.6.8-5.4 1.2-8.2 1.2s-5.6-.4-8.2-1.2a1.15 1.15 0 1 0-.7 2.2c1.9.6 3.9 1 5.9 1.2v2.5L6.4 20a1.15 1.15 0 0 0 2.1.9L12 14.6l3.5 6.3a1.15 1.15 0 0 0 2.1-.9L15 12.3V9.8c2-.2 4-.6 5.9-1.2a1.15 1.15 0 1 0-.7-2.2z"/>' +
      '</svg>';

    // Panneau
    var panneau = document.createElement('div');
    panneau.className = 'a11y-panneau';
    panneau.id = 'a11y-panneau';
    panneau.hidden = true;
    panneau.setAttribute('role', 'group');
    panneau.setAttribute('aria-label', "Réglages d'accessibilité");

    var titre = document.createElement('h2');
    titre.textContent = 'Confort de lecture';
    panneau.appendChild(titre);

    // Taille du texte : trois niveaux, normal, grand, très grand
    var ligneTaille = document.createElement('div');
    ligneTaille.className = 'a11y-ligne';
    var libTaille = document.createElement('span');
    libTaille.id = 'a11y-lbl-taille';
    libTaille.textContent = 'Taille du texte';
    var btnTaille = document.createElement('button');
    btnTaille.type = 'button';
    btnTaille.className = 'a11y-reinit';
    btnTaille.style.width = 'auto';
    btnTaille.style.margin = '0';
    btnTaille.style.padding = '0.35rem 0.9rem';
    btnTaille.setAttribute('aria-labelledby', 'a11y-lbl-taille');

    function nomTaille() {
      return ['Normale', 'Grande', 'Très grande'][etat.taille];
    }
    btnTaille.textContent = nomTaille();
    btnTaille.addEventListener('click', function () {
      etat.taille = (etat.taille + 1) % 3;
      btnTaille.textContent = nomTaille();
      appliquer();
      enregistrer();
    });
    ligneTaille.appendChild(libTaille);
    ligneTaille.appendChild(btnTaille);
    panneau.appendChild(ligneTaille);

    panneau.appendChild(interrupteur('Contraste renforcé', 'contraste'));
    panneau.appendChild(interrupteur('Souligner les liens', 'liens'));
    panneau.appendChild(interrupteur('Couper les animations', 'animations'));

    var reinit = document.createElement('button');
    reinit.type = 'button';
    reinit.className = 'a11y-reinit';
    reinit.textContent = 'Tout réinitialiser';
    reinit.addEventListener('click', function () {
      etat = { taille: 0, contraste: false, liens: false, animations: false };
      appliquer();
      enregistrer();
      panneau.querySelectorAll('.a11y-switch').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
      btnTaille.textContent = nomTaille();
    });
    panneau.appendChild(reinit);

    // Ouverture et fermeture
    function ouvrir(ouvert) {
      panneau.hidden = !ouvert;
      btn.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      if (ouvert) panneau.querySelector('button').focus();
    }
    btn.addEventListener('click', function () {
      ouvrir(panneau.hidden);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panneau.hidden) {
        ouvrir(false);
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (panneau.hidden) return;
      if (!panneau.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        ouvrir(false);
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(panneau);
  }

  charger();
  appliquer();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', construire);
  } else {
    construire();
  }
})();
