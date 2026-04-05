/* ─────────────────────────────────────────
   DONNÉES
───────────────────────────────────────── */
const SKILLS = [
  { id: 'illustrator', name: 'Illustrator',   src: 'assets/icons/illustrator.png' },
  { id: 'photoshop',   name: 'Photoshop',     src: 'assets/icons/photoshop.png' },
  { id: 'afterfx',     name: 'After Effects', src: 'assets/icons/aftereffects.png' },
  { id: 'canva',       name: 'Canva',         src: 'assets/icons/canva.png' },
  { id: 'indesign',    name: 'InDesign',      src: 'assets/icons/indesign.png' },
  { id: 'premiere',    name: 'Premiere Pro',  src: 'assets/icons/premierepro.png' },
  { id: 'css',         name: 'CSS',           src: 'assets/icons/css.png' },
  { id: 'js',          name: 'JavaScript',    src: 'assets/icons/Javascript-png.png' },
  { id: 'prestashop',  name: 'PrestaShop',    src: 'assets/icons/prestashop.png' },
];

const CATEGORIES = [
  {
    name: 'Mes outils', sub: 'Touche pour explorer',
    tools: SKILLS.map(s => s.id),
    images: [],
  },
  {
    name: 'Logo', sub: 'Identité visuelle',
    tools: ['illustrator', 'photoshop', 'canva'],
    images: [
      'assets/images/projets/logo-flora.webp',
      'assets/images/projets/jaozafy-saveur.png',
      'assets/images/projets/la-perruche.png',
      'assets/images/projets/tiazazalogo (1).svg',
      'assets/images/projets/tiazazalogo (4).svg',
      'assets/images/projets/tiazazalogo (6).svg',
    ],
  },
  {
    name: 'Affiche', sub: 'Communication visuelle',
    tools: ['illustrator', 'photoshop', 'indesign', 'canva'],
    images: [
      'assets/images/projets/Affiche-Tiazaza.png',
      'assets/images/projets/faites-le-mur.webp',
      'assets/images/projets/flyer.png',
      'assets/images/projets/sticker-cartable.png',
      'assets/images/projets/projet-marketing-ecole.png',
    ],
  },
  {
    name: 'Carte de visite', sub: 'Print & identité',
    tools: ['illustrator', 'indesign', 'canva'],
    images: [
      'assets/images/projets/cartevisite.png',
      'assets/images/projets/mam-tiazaza.png',
      'assets/images/projets/mamtiazaza.png',
    ],
  },
  {
    name: 'Vidéo & Motion', sub: 'Animation & montage',
    tools: ['afterfx', 'premiere'],
    images: [
      'assets/images/projets/slide-1.png',
      'assets/images/projets/slide-2.png',
      'assets/images/projets/slide-3.png',
      'assets/images/projets/slide-4.png',
    ],
  },
  {
    name: 'Web & E-commerce', sub: 'Développement front',
    tools: ['css', 'js', 'prestashop'],
    images: [
      'assets/images/projets/lavitry.jpg',
      'assets/images/projets/page-1.png',
      'assets/images/projets/page-2.png',
      'assets/images/projets/conseil-maintenance-client.png',
    ],
  },
];

const MAX_IMG = 6;

/* ─────────────────────────────────────────
   ÉTAT GLOBAL
───────────────────────────────────────── */
let catIndex  = 0;
let orbiting  = true;
let ringAngle = 0;
let rafId     = null;
// nodes[id] = { wrapper, card, tx, ty }
// tx/ty = dernier offset orbital stocké pour figer en douceur
let nodes     = {};
let projSlots = [];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getRadius() {
  const scene = document.getElementById('scene');
  const s = Math.min(scene.offsetWidth, scene.offsetHeight);
  return Math.min(s * 0.30, 235);
}

// Petite couronne intérieure pour les actifs
function activePositions(count) {
  const r = Math.min(getRadius() * 0.50, 140);
  return Array.from({ length: count }, (_, i) => {
    const θ = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: r * Math.cos(θ), y: r * Math.sin(θ) };
  });
}

/* ─────────────────────────────────────────
   BOUCLE D'ORBITE
   – position : left/top fixés à 50%/50%
   – mouvement : uniquement via transform translate
   – tx/ty stockés dans nodes pour le freeze
───────────────────────────────────────── */
function tick() {
  ringAngle += 0.0022; // ~45 s par tour à 60 fps
  const R = getRadius();

  SKILLS.forEach((skill, i) => {
    const node = nodes[skill.id];
    if (node.pinned) return;

    const θ  = ringAngle + (i / SKILLS.length) * Math.PI * 2;
    const tx = R * Math.cos(θ);
    const ty = R * Math.sin(θ);

    // Mémoriser pour le freeze
    node.tx = tx;
    node.ty = ty;

    node.wrapper.style.transition = 'none';
    node.wrapper.style.transform  =
      `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`;
    node.wrapper.style.opacity = '0.9';
  });

  rafId = requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   INITIALISATION
───────────────────────────────────────── */
function init() {
  const scene   = document.getElementById('scene');
  const overlay = document.getElementById('overlay');
  const dotsEl  = document.getElementById('nav-dots');

  /* ── Skill cards ── */
  SKILLS.forEach((skill) => {
    const wrapper = document.createElement('div');
    wrapper.className    = 'skill-wrapper';
    // Position de référence = centre de scène
    wrapper.style.left   = '50%';
    wrapper.style.top    = '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';

    const card  = document.createElement('div');
    card.className = 'skill-card';

    const img   = document.createElement('img');
    img.src = skill.src;
    img.alt = skill.name;

    const label = document.createElement('span');
    label.textContent = skill.name;

    card.appendChild(img);
    card.appendChild(label);
    wrapper.appendChild(card);
    scene.insertBefore(wrapper, overlay);

    nodes[skill.id] = { wrapper, card, tx: 0, ty: 0, pinned: false };
  });

  /* ── Slots images projets ── */
  for (let i = 0; i < MAX_IMG; i++) {
    const wrapper = document.createElement('div');
    wrapper.className    = 'proj-wrapper';
    wrapper.style.left   = '50%';
    wrapper.style.top    = '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';

    const card  = document.createElement('div');
    card.className = 'proj-card';

    const imgEl = document.createElement('img');
    imgEl.alt = 'projet';
    card.appendChild(imgEl);
    wrapper.appendChild(card);
    scene.insertBefore(wrapper, overlay);

    wrapper.addEventListener('click', e => {
      e.stopPropagation();
      if (imgEl.src && imgEl.src !== window.location.href) openLightbox(imgEl.src);
    });

    projSlots.push({ wrapper, imgEl });
  }

  /* ── Nav dots ── */
  CATEGORIES.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(dot);
  });

  rafId = requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   MISE À JOUR DE LA SCÈNE (au clic)
───────────────────────────────────────── */
function updateScene() {
  const cat = CATEGORIES[catIndex];

  /* ── Arrêt de l'orbite au premier clic ── */
  if (orbiting) {
    orbiting = false;
    cancelAnimationFrame(rafId);
  }

  /* ── Titre ── */
  const nameEl = document.getElementById('cat-name');
  const subEl  = document.getElementById('cat-sub');
  const hintEl = document.getElementById('hint-text');

  nameEl.classList.add('fade-out');
  subEl.classList.add('fade-out');
  setTimeout(() => {
    nameEl.textContent = cat.name;
    subEl.textContent  = cat.sub;
    hintEl.style.opacity = catIndex === 0 ? '1' : '0';
    nameEl.classList.remove('fade-out');
    subEl.classList.remove('fade-out');
  }, 280);

  /* ── Nav dots ── */
  document.querySelectorAll('.nav-dot').forEach((d, i) =>
    d.classList.toggle('active', i === catIndex)
  );

  /* ── Skill cards ── */
  const activePosArr = activePositions(cat.tools.length);
  let activeIdx = 0;

  SKILLS.forEach((skill) => {
    const node = nodes[skill.id];
    const { wrapper } = node;
    const isActive = cat.tools.includes(skill.id);

    if (isActive) {
      node.pinned = true;
      wrapper.classList.add('active');
      wrapper.classList.remove('dormant');

      const pos = activePosArr[activeIdx++];
      // 1. Activer la transition
      wrapper.classList.add('transitioning');
      // 2. Forcer un reflow pour que le navigateur enregistre l'état courant
      void wrapper.offsetHeight;
      // 3. Appliquer le nouvel état — transition animera depuis la position d'orbite
      wrapper.style.transform =
        `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(1.55)`;
      wrapper.style.opacity = '1';

    } else {
      node.pinned = false;
      wrapper.classList.remove('active');
      wrapper.classList.add('dormant');

      // Figer à la position d'orbite actuelle, juste réduit
      const { tx, ty } = node;
      wrapper.classList.add('transitioning');
      void wrapper.offsetHeight;
      wrapper.style.transform =
        `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.6)`;
      wrapper.style.opacity = '0.38';
    }
  });

  /* ── Images projets ── */
  const imgs = cat.images.slice(0, MAX_IMG);
  const R    = getRadius();

  projSlots.forEach((slot, i) => {
    if (i < imgs.length) {
      const θ  = (i / imgs.length) * Math.PI * 2 + Math.PI / imgs.length;
      const rr = R * 0.72 + (i % 2 === 0 ? R * 0.28 : R * 0.14);
      const tx = rr * Math.cos(θ);
      const ty = rr * Math.sin(θ);

      setTimeout(() => {
        slot.imgEl.src = imgs[i];
        slot.wrapper.style.transition = 'none';
        slot.wrapper.style.transform  =
          `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.7)`;
        slot.wrapper.style.opacity = '0';

        requestAnimationFrame(() => {
          slot.wrapper.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
          slot.wrapper.style.transform  =
            `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`;
          slot.wrapper.classList.add('visible');
        });
      }, 140 + i * 110);

    } else {
      slot.wrapper.style.transition = 'opacity 0.7s ease';
      slot.wrapper.classList.remove('visible');
      slot.wrapper.style.opacity = '0';
      setTimeout(() => { slot.imgEl.src = ''; }, 750);
    }
  });
}

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function goNext() {
  catIndex = (catIndex + 1) % CATEGORIES.length;
  updateScene();
}
function goPrev() {
  catIndex = (catIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
  updateScene();
}

document.getElementById('scene').addEventListener('click', goNext);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') goNext();
  if (e.key === 'ArrowLeft') goPrev();
});

let tx0 = 0, ty0 = 0;
document.addEventListener('touchstart', e => {
  tx0 = e.touches[0].clientX;
  ty0 = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx0;
  const dy = e.changedTouches[0].clientY - ty0;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40)
    dx < 0 ? goNext() : goPrev();
}, { passive: true });

/* ─────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  setTimeout(() => { lbImg.src = ''; }, 300);
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-bg').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ─────────────────────────────────────────
   LANCEMENT
───────────────────────────────────────── */
init();
