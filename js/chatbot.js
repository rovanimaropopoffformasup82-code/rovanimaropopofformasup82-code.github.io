(function () {
  'use strict';

  /* ── Base de connaissance ── */
  var KB = [
    {
      tags: ['bonjour','salut','hello','coucou','bonsoir','hi','hey'],
      rep: "Bonjour ! Je suis l'assistante virtuelle de Mercia.\nComment puis-je vous aider ?"
    },
    {
      tags: ['qui','suis','mercia','presente','elle','profil','parcours'],
      rep: "Je suis Mercia RANDRIANOME, Designer UI & Intégratrice Web basée à Moissac (82).\nJe crée des sites WordPress qui travaillent pour vous — de la maquette à la mise en ligne."
    },
    {
      tags: ['competence','maitrise','sais','outil','logiciel','techno','savoir'],
      rep: "Mes compétences :\n• WordPress / Elementor — Maîtrisé (85%)\n• Figma — Maîtrisé (75%)\n• HTML / CSS — Maîtrisé (70%)\n• Illustrator — Maîtrisé (65%)\n• Canva, Prestashop, JavaScript"
    },
    {
      tags: ['projet','realisation','site','portfolio','travail','cree','realise','creation'],
      rep: "Mes réalisations :\n• jaozafysaveur.fr — Boutique e-commerce WordPress\n• mamtiazaza.fr — Site vitrine professionnel\n• co-co-shop.netlify.app — Site e-commerce\n• Ce portfolio — HTML/CSS/JS vanilla"
    },
    {
      tags: ['tarif','prix','cout','devis','combien','budget','facturation'],
      rep: "Mes tarifs :\n• Site WordPress 5 pages → 350 €\n• Refonte visuelle 1 page → 90 €\n• Maquette UI Figma (3 pages) → 120 €\n• Correction bug → 45 €\n\nContactez-moi pour un devis sur mesure !"
    },
    {
      tags: ['delai','temps','duree','rapide','vite','livraison'],
      rep: "Mes délais :\n• Site WordPress 5 pages → 5 jours\n• Refonte 1 page → 2 jours\n• Maquette Figma → 3 jours\n• Correction bug → 24h"
    },
    {
      tags: ['contact','joindre','email','message','ecrire','parler','vous joindre'],
      rep: "Rendez-vous sur la page Contact ou sur LinkedIn.\nJe réponds généralement dans la journée !"
    },
    {
      tags: ['disponible','libre','freelance','mission','embauche','recrutement','collaboration'],
      rep: "Oui, je suis disponible pour des missions freelance et des collaborations !\nDécrivez-moi votre projet, même imparfaitement — on trouvera une solution."
    },
    {
      tags: ['wordpress','elementor','woocommerce','cms'],
      rep: "WordPress est ma spécialité ! Je crée des sites vitrines et boutiques e-commerce avec Elementor — toujours livrés avec une documentation de maintenance."
    },
    {
      tags: ['figma','maquette','design','ui','ux','prototype','wireframe'],
      rep: "Je travaille sur Figma avant chaque intégration. La maquette vous permet de valider le design avant de coder — zéro mauvaise surprise."
    },
    {
      tags: ['illustrator','logo','identite','visuelle','graphique','charte'],
      rep: "Je crée des logos et identités visuelles sur Adobe Illustrator — déclinaisons, affiche, carte de visite, flyer. Tout cohérent."
    },
    {
      tags: ['localisation','ville','ou','moissac','sud-ouest','tarn','france','region'],
      rep: "Je suis basée à Moissac (82), dans le Tarn-et-Garonne. Je travaille à distance pour toute la France."
    },
    {
      tags: ['malt','plateforme','tjm','jour'],
      rep: "Je suis sur Malt en portage salarial — pas de SIRET requis. Mon TJM est de 200 €/jour."
    },
    {
      tags: ['merci','super','parfait','nickel','top','genial','cool'],
      rep: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions."
    },
    {
      tags: ['au revoir','bye','bonne journee','ciao','a bientot'],
      rep: "À bientôt ! N'hésitez pas à revenir. 🖤"
    }
  ];

  var DEFAULT_REP = "Je ne suis pas sûre de comprendre. Vous pouvez me demander :\nmes compétences, mes projets, mes tarifs, mes délais ou comment me contacter !";

  var SUGGESTIONS = ['Mes compétences', 'Mes projets', 'Mes tarifs', 'Me contacter'];

  /* ── Normalisation texte ── */
  function normalize(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/['']/g, ' ');
  }

  function findReply(input) {
    var text = normalize(input);
    for (var i = 0; i < KB.length; i++) {
      var item = KB[i];
      for (var j = 0; j < item.tags.length; j++) {
        if (text.indexOf(normalize(item.tags[j])) !== -1) return item.rep;
      }
    }
    return DEFAULT_REP;
  }

  /* ── Construction du widget ── */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildWidget() {
    var sugs = SUGGESTIONS.map(function(s) {
      return '<button class="cb-sug">' + escHtml(s) + '</button>';
    }).join('');

    var div = document.createElement('div');
    div.innerHTML =
      '<div class="cb-panel" id="cb-panel">' +
        '<div class="cb-header">' +
          '<div class="cb-avatar" id="cb-avatar">' +
            '<video id="cb-vid-hd" autoplay loop muted playsinline>' +
              '<source src="assets/video/mercia-bot.mp4" type="video/mp4">' +
            '</video>' +
            '<div class="cb-avatar-fallback" id="cb-fallback">M.</div>' +
          '</div>' +
          '<div class="cb-header-info">' +
            '<div class="cb-name">Mercia</div>' +
            '<div class="cb-status"><span class="cb-dot"></span>En ligne</div>' +
          '</div>' +
          '<button class="cb-close" id="cb-close" aria-label="Fermer">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
              '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="cb-messages" id="cb-messages"></div>' +
        '<div class="cb-suggestions" id="cb-suggestions">' + sugs + '</div>' +
        '<div class="cb-form">' +
          '<input class="cb-input" id="cb-input" type="text" placeholder="Posez votre question…" autocomplete="off" maxlength="200">' +
          '<button class="cb-send" id="cb-send" aria-label="Envoyer">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" stroke-width="2.5">' +
              '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="cb-btn" id="cb-btn" aria-label="Discuter avec Mercia">' +
        '<video id="cb-vid-btn" autoplay loop muted playsinline>' +
          '<source src="assets/video/mercia-bot.mp4" type="video/mp4">' +
        '</video>' +
        '<div class="cb-btn-icon" id="cb-btn-icon">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" stroke-width="2">' +
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
          '</svg>' +
        '</div>' +
      '</button>';
    document.body.appendChild(div);
  }

  /* ── Messages ── */
  function addMsg(text, who) {
    var msgs = document.getElementById('cb-messages');
    var d = document.createElement('div');
    d.className = 'cb-msg ' + who;
    d.innerHTML = '<div class="cb-bubble">' + escHtml(text) + '</div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('cb-messages');
    var d = document.createElement('div');
    d.className = 'cb-msg bot';
    d.id = 'cb-typing-row';
    d.innerHTML = '<div class="cb-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function reply(input) {
    var sugs = document.getElementById('cb-suggestions');
    if (sugs) sugs.style.display = 'none';
    addMsg(input, 'user');
    var typing = showTyping();
    var delay = 600 + Math.floor(Math.random() * 500);
    setTimeout(function () {
      typing.parentNode && typing.parentNode.removeChild(typing);
      addMsg(findReply(input), 'bot');
    }, delay);
  }

  /* ── Initialisation ── */
  function init() {
    buildWidget();

    var panel   = document.getElementById('cb-panel');
    var btn     = document.getElementById('cb-btn');
    var close   = document.getElementById('cb-close');
    var input   = document.getElementById('cb-input');
    var send    = document.getElementById('cb-send');
    var vidHd   = document.getElementById('cb-vid-hd');
    var vidBtn  = document.getElementById('cb-vid-btn');
    var fallback= document.getElementById('cb-fallback');
    var btnIcon = document.getElementById('cb-btn-icon');

    /* Fallback si la vidéo n'existe pas encore */
    function handleVidError() {
      if (vidHd) vidHd.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
      if (vidBtn) vidBtn.style.display = 'none';
      if (btnIcon) btnIcon.style.display = 'flex';
    }
    if (vidHd)  vidHd.addEventListener('error',  handleVidError);
    if (vidBtn) vidBtn.addEventListener('error',  handleVidError);
    /* Si la vidéo ne charge pas du tout (src vide ou 404) */
    if (vidHd) {
      vidHd.load();
      setTimeout(function() {
        if (vidHd.readyState === 0) handleVidError();
      }, 1500);
    }

    /* Ouvrir / fermer */
    btn.addEventListener('click', function () {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        var msgs = document.getElementById('cb-messages');
        if (msgs && msgs.children.length === 0) {
          setTimeout(function () {
            addMsg("Bonjour ! Je suis l'assistante virtuelle de Mercia.\nComment puis-je vous aider ?", 'bot');
          }, 280);
        }
        setTimeout(function () { input.focus(); }, 320);
      }
    });
    close.addEventListener('click', function () { panel.classList.remove('open'); });

    /* Envoi */
    function doSend() {
      var val = input.value.trim();
      if (val) { reply(val); input.value = ''; }
    }
    send.addEventListener('click', doSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSend();
    });

    /* Suggestions rapides */
    var sugs = document.getElementById('cb-suggestions');
    if (sugs) {
      sugs.querySelectorAll('.cb-sug').forEach(function (b) {
        b.addEventListener('click', function () { reply(b.textContent); });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
