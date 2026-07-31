/* ═══════════════════════════════════════════════════════════════
   OUTILS — orbite de catégories
   Le nom de la catégorie reste au centre ; ses outils tournent
   autour. On change de catégorie en fondu (auto + clic + clavier).
═══════════════════════════════════════════════════════════════ */

const TOOLS = {
  figma: 'Figma', illustrator: 'Illustrator', indesign: 'InDesign', canva: 'Canva',
  html5: 'HTML', css: 'CSS', javascript: 'JavaScript', react: 'React',
  wordpress: 'WordPress', woocommerce: 'WooCommerce', modx: 'MODX',
  claude: 'Claude Code', gemini: 'Gemini', git: 'Git', filezilla: 'FileZilla',
};

const CATS = [
  { name: 'Conception Visuelle', sub: 'Design et identité', tools: ['figma', 'illustrator', 'indesign', 'canva'] },
  { name: 'Développement Web<br>et E-commerce', sub: 'Sites, boutiques, intégration', tools: ['html5', 'css', 'javascript', 'react', 'wordpress', 'woocommerce', 'modx'] },
  { name: 'Outils et IA', sub: 'Workflow et assistance', tools: ['claude', 'gemini', 'git', 'filezilla'] },
];

const icon = id => `assets/icons/tools/${id}.svg`;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 600px)').matches;

let idx = 0, angle = 0, raf = null, timer = null, tiles = [], hovering = false;

const scene  = document.getElementById('scene');
const orbit  = document.getElementById('orbit');
const center = document.querySelector('.tools-center');
const nameEl = document.getElementById('cat-name');
const subEl  = document.getElementById('cat-sub');
const dotsEl = document.getElementById('dots');
const ring   = document.getElementById('ringline');

function radius() {
  const w = scene.offsetWidth, h = scene.offsetHeight;
  const byMin = Math.min(w, h) * 0.42;   // taille de base
  const byW = w / 2 - 82;                 // marge pour tuile + nom (horizontal)
  const byH = h / 2 - 72;                 // marge pour tuile + nom (vertical)
  return Math.max(70, Math.min(byMin, 300, byW, byH));
}
function sizeRing() {
  const d = radius() * 2;
  ring.style.width = d + 'px';
  ring.style.height = d + 'px';
}

function buildDots() {
  CATS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'tools-dot' + (i === 0 ? ' active' : '');
    b.type = 'button';
    b.setAttribute('aria-label', 'Catégorie : ' + c.name);
    b.addEventListener('click', () => go(i));
    dotsEl.appendChild(b);
  });
}
function updateDots() {
  [...dotsEl.children].forEach((d, i) => d.classList.toggle('active', i === idx));
}

function clearTiles() {
  tiles.forEach(t => {
    const el = t.el;
    const tileEl = el.querySelector('.tool-tile');
    el.style.transitionDelay = '0s';
    if (tileEl) {
      tileEl.style.transitionDelay = '0s';
      tileEl.style.transform = 'translate(-50%, -50%) scale(0.4)';
    }
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  });
  tiles = [];
}
function buildTiles() {
  const cat = CATS[idx];
  cat.tools.forEach((id, i) => {
    const base = (i / cat.tools.length) * Math.PI * 2 - Math.PI / 2;
    const el = document.createElement('div');
    el.className = 'tool';
    el.style.opacity = '0';
    el.innerHTML =
      `<div class="tool-tile"><img src="${icon(id)}" alt="${TOOLS[id]}"></div>` +
      `<span class="tool-label">${TOOLS[id]}</span>`;
    orbit.appendChild(el);
    const tileEl = el.querySelector('.tool-tile');
    tileEl.style.transform = 'translate(-50%, -50%) scale(0.4)';
    tiles.push({ el, base });

    // Révélation fiable (sans rAF) + légère cascade
    void el.offsetWidth;
    const delay = (i * 0.05) + 's';
    el.style.transitionDelay = delay;
    tileEl.style.transitionDelay = delay;
    el.style.opacity = '1';
    tileEl.style.transform = 'translate(-50%, -50%) scale(1)';

    // Retire le transform inline une fois l'entrée finie, pour laisser le survol agir
    setTimeout(() => {
      tileEl.style.transform = '';
      tileEl.style.transitionDelay = '';
      el.style.transitionDelay = '';
    }, 650 + i * 50);
  });
  place();
}
function place() {
  const R = radius();
  tiles.forEach(t => {
    const a = t.base + angle;
    const x = R * Math.cos(a);
    const y = R * Math.sin(a);
    t.el.style.transform = `translate(${x}px, ${y}px)`;
  });
}
function loop() {
  angle += 0.0016;
  place();
  raf = requestAnimationFrame(loop);
}

function go(i) {
  const target = ((i % CATS.length) + CATS.length) % CATS.length;
  if (target === idx) return;
  idx = target;
  center.classList.add('swapping');
  clearTiles();
  updateDots();
  setTimeout(() => {
    nameEl.innerHTML = CATS[idx].name;
    subEl.textContent  = CATS[idx].sub;
    center.classList.remove('swapping');
    buildTiles();
  }, 350);
  restartTimer();
}
function next() { go(idx + 1); }
function prev() { go(idx - 1); }

function restartTimer() {
  if (reduce || hovering || isMobile()) return;
  clearInterval(timer);
  timer = setInterval(next, 5200);
}

/* Pause au survol : la rotation et le défilement s'arrêtent pour
   laisser lire les noms d'outils, puis reprennent à la sortie. */
function pause() {
  hovering = true;
  if (raf) { cancelAnimationFrame(raf); raf = null; }
  clearInterval(timer);
}
function resume() {
  hovering = false;
  if (reduce) return;
  if (!raf) raf = requestAnimationFrame(loop);
  restartTimer();
}

function init() {
  sizeRing();
  buildDots();
  nameEl.innerHTML = CATS[0].name;
  subEl.textContent  = CATS[0].sub;
  buildTiles();

  if (!reduce && !isMobile()) {
    raf = requestAnimationFrame(loop);
    restartTimer();
  }

  window.addEventListener('resize', () => { sizeRing(); place(); });
  scene.addEventListener('mouseenter', pause);
  scene.addEventListener('mouseleave', resume);
  scene.addEventListener('click', e => {
    if (e.target.closest('.tools-dot')) return;
    next();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') prev();
  });
}

init();
