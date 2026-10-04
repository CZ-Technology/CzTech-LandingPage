/* CZ Tech · a descida até o ponto */
(() => {
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
/* o ajuste "reduzir movimento" do sistema não desliga as animações do site (decisão de marca); só o layout estático do hero usa a media query de verdade, em GATES e STACK_MQ */
const reduceMQ = { matches: false, addEventListener() {} };
window.__czOk = true;
const { config, cases, score } = window.CZ;

/* ---------- Rolagem no celular: leva o conteúdo novo para dentro da tela, abaixo do menu ---------- */
const MOBILE_MQ = matchMedia('(max-width: 720px)');
function scrollToEl(el, gap = 12) {
  const nv = document.getElementById('nav');
  const top = el.getBoundingClientRect().top + scrollY - (nv ? nv.offsetHeight + 10 : 0) - gap;
  scrollTo({ top: Math.max(0, top), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
}
function ensureInView(el, force) {                          // só rola se o topo do elemento saiu da tela
  const nv = document.getElementById('nav'), edge = nv ? nv.offsetHeight + 16 : 70;
  const r = el.getBoundingClientRect();
  if (force || r.top < edge || r.top > innerHeight * .6) scrollToEl(el);
}

/* ---------- WhatsApp ---------- */
const waUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.mensagem)}`;
$$('.js-wa').forEach(a => { a.href = waUrl; a.target = '_blank'; a.rel = 'noopener'; });

/* ---------- Divisão do texto do hero (gerador com semente) ---------- */
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
$$('.band .split').forEach((el, n) => {
  const text = el.textContent.trim(), r = rng(7 + n * 31);
  const words = text.split(' ');
  const build = () => words.map((w, i) => `<span class="w" style="--th:${(i / words.length * .5 + r() * .05).toFixed(3)}">${w}</span>`).join(' ');
  el.innerHTML = `<span class="sr">${text}</span>` + (el.classList.contains('blur')
    ? `<span class="soft" aria-hidden="true">${text}</span><span class="sharp" aria-hidden="true">${text}</span>`
    : `<span aria-hidden="true">${build()}</span>`);
});

/* ---------- Hero: estado ---------- */
const hero = $('.hero'), stage = $('#stage'), video = $('#heroVideo');
const cue = $('#cue');
const bands = $$('.band').map((el, i, all) => ({
  el, a: +el.dataset.a, b: +el.dataset.b, first: i === 0, last: i === all.length - 1, op: -1, k: -1, ks: -1, kb: -1
}));
let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true, scrubOn = false, loadK = 0;

function heroProgress() {
  const r = hero.getBoundingClientRect();
  return clamp(-r.top / (hero.offsetHeight - innerHeight));
}

/* o logo 3D: camadas empilhadas em profundidade, girando sozinho */
const logoWrap = $('#logoWrap'), logos = $$('.cz3d');
(function buildLogo() {
  const N = 20, D = 0.0093;
  let html = '';
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const fill = i === N - 1 ? '#5BA6FF' : i === N - 2 ? '#2F7DE1'
      : `rgb(${Math.round(18 + 24 * t)},${Math.round(64 + 56 * t)},${Math.round(150 + 80 * t)})`;
    html += `<svg viewBox="0 0 522 254" style="transform:translateZ(calc(var(--W)*${((t - .5) * N * D).toFixed(4)}))"><use href="#cz" fill="${fill}"/></svg>`;
  }
  logos.forEach(el => { el.innerHTML = html; });
})();

/* o giro roda em JS, não em CSS: nenhum ajuste de acessibilidade do sistema o desliga. Só para quando a aba está escondida ou o logo fora da tela. */
const spin = { t0: performance.now(), on: new Set(logos), id: 0 };
function spinFrame(now) {
  const bob = Math.sin((now - spin.t0) / 6000 * Math.PI * 2) * 1.5;
  const tfOsc = `translate3d(0,${bob.toFixed(2)}%,0) rotateX(-12deg) rotateY(${(Math.sin((now - spin.t0) / 5200 * Math.PI * 2) * 35).toFixed(2)}deg)`;   // gira sempre, também com movimento reduzido (decisão de marca)
  spin.on.forEach(el => { el.style.transform = tfOsc; });
  spin.id = document.hidden || !spin.on.size ? 0 : requestAnimationFrame(spinFrame);
}
const spinKick = () => { if (!spin.id && !document.hidden && spin.on.size) spin.id = requestAnimationFrame(spinFrame); };
const spinIO = new IntersectionObserver(es => {
  es.forEach(e => { e.isIntersecting ? spin.on.add(e.target) : spin.on.delete(e.target); });
  spinKick();
});
logos.forEach(el => spinIO.observe(el));
document.addEventListener('visibilitychange', spinKick);
spinFrame(performance.now());

/* ---------- Mapa topográfico: luz que segue o cursor, pontos que reagem, toque que ondula ----------
   Tudo em JS (Pointer Events + rAF + Web Animations): vale para mouse, toque e caneta, em qualquer navegador e sistema,
   e não é desligado por ajustes de animação do sistema. Sem cursor por 2,5 s, a luz passeia sozinha pelo mapa. */
const maps = $$('.worldmap').map(el => ({
  el, lit: $('.wm-lit', el), litTopo: $('.wm-lit .wm-topo', el), glow: $('.wm-glow', el), pins: $$('.wm-pin', el).map(p => ({ p, x: 0, y: 0, k: 0, label: $('.wm-label', p) })),
  x: .5, y: .5, tx: .5, ty: .5, px: 0, py: 0
}));
maps.forEach(m => $$('.wm-ring', m.el).forEach((r, i) => {
  if (r.animate) r.animate([{ transform: 'scale(.6)', opacity: 1 }, { transform: 'scale(3.4)', opacity: 0 }], { duration: 3200, iterations: Infinity, delay: -i * 700, easing: 'ease-out' });
}));
function sizeMaps() { maps.forEach(m => { m.litTopo.style.width = m.el.offsetWidth + 'px'; m.litTopo.style.height = m.el.offsetHeight + 'px'; }); }
sizeMaps(); addEventListener('resize', sizeMaps);
let lastPtr = -1e9, mapRaf = 0, mapOn = true;
function mapTarget(m, cx, cy) {
  const r = m.el.getBoundingClientRect();
  m.tx = (cx - r.left) / r.width; m.ty = (cy - r.top) / r.height;
}
function mapFrame(now) {
  const dt = Math.min(64, now - (mapFrame.t || now)); mapFrame.t = now;
  const idle = now - lastPtr > 2500;
  maps.forEach(m => {
    if (!m.el.getClientRects().length) return;
    if (idle) {                                              // passeio automático: curva de Lissajous sobre o mapa
      m.tx = .5 + .34 * Math.sin(now / 4300 + 1) + .08 * Math.sin(now / 1700);
      m.ty = .5 + .26 * Math.cos(now / 3600);
    }
    const ease = 1 - Math.pow(1 - .3, dt / 16.667);
    m.x += (m.tx - m.x) * ease; m.y += (m.ty - m.y) * ease;
    const w = m.el.offsetWidth, h = m.el.offsetHeight;
    if (m.sw !== w) { m.sw = w; m.litTopo.style.width = w + 'px'; m.litTopo.style.height = h + 'px'; }
    const lx = m.x * w - 320, ly = m.y * h - 320;                 // só transform: a janela de luz e o conteúdo se movem sem repintar
    m.lit.style.transform = 'translate3d(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px,0)';
    m.litTopo.style.transform = 'translate3d(' + (-lx).toFixed(1) + 'px,' + (-ly).toFixed(1) + 'px,0)';
    m.glow.style.transform = 'translate3d(' + (m.x * w - 320).toFixed(1) + 'px,' + (m.y * h - 320).toFixed(1) + 'px,0)';
    m.px += ((m.x - .5) * -26 - m.px) * ease * .5; m.py += ((m.y - .5) * -16 - m.py) * ease * .5;
    m.el.style.transform = 'translate3d(' + m.px.toFixed(2) + 'px,' + m.py.toFixed(2) + 'px,0)';
    m.pins.forEach(o => {
      const pr = o.p.offsetLeft, pt = o.p.offsetTop;
      const d = Math.hypot(pr - m.x * w, pt - m.y * h), k = clamp(1 - d / 230);
      o.k += (k - o.k) * Math.min(1, ease * .8);
      o.p.style.transform = 'scale(' + (1 + o.k * 1.1).toFixed(3) + ')';
      if (o.label) o.label.style.opacity = MOBILE_MQ.matches && m.el.closest('.hero-static') ? 1 : clamp((o.k - .25) * 3).toFixed(2);
    });
  });
  mapRaf = mapOn && !document.hidden ? requestAnimationFrame(mapFrame) : 0;
}
const mapKick = () => { if (!mapRaf && mapOn && !document.hidden) mapRaf = requestAnimationFrame(mapFrame); };
const heroEl = $('.hero');
heroEl.addEventListener('pointermove', e => { lastPtr = performance.now(); maps.forEach(m => mapTarget(m, e.clientX, e.clientY)); });
heroEl.addEventListener('pointerdown', e => {                // toque ou clique: uma onda sai do ponto
  lastPtr = performance.now();
  maps.forEach(m => {
    if (!m.el.getClientRects().length) return;
    mapTarget(m, e.clientX, e.clientY);
    const r = m.el.getBoundingClientRect(), s = document.createElement('i');
    s.className = 'wm-ripple'; s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    m.el.appendChild(s);
    if (s.animate) s.animate([{ transform: 'scale(1)', opacity: .9 }, { transform: 'scale(22)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => s.remove();
    else s.remove();
  });
});
new IntersectionObserver(([e]) => { mapOn = e.isIntersecting; mapKick(); }).observe(heroEl);
document.addEventListener('visibilitychange', mapKick);
mapKick();

const wmWrap = $('#wmWrap');
let lastLayer = '';
function renderLayers(p) {
  const key = p.toFixed(4);
  if (key === lastLayer) return;
  lastLayer = key;
  wmWrap.style.transform = `translate3d(${(-p * 4).toFixed(2)}%,0,0) scale(${(1.02 + p * .22).toFixed(4)})`;   // o mapa desliza e se aproxima devagar
  const behindText = 1 - smoothstep(p, .62, .8);
  logoWrap.style.opacity = (.62 + .38 * (1 - behindText)).toFixed(3);
  const sc = 1.08 - .26 * smoothstep(p, .05, .5) - .06 * smoothstep(p, .7, 1);
  logoWrap.style.transform = `translate3d(0,${(smoothstep(p, .62, .85) * 15).toFixed(2)}vh,0) scale(${sc.toFixed(4)})`;
}

function updateBands(p) {
  for (const b of bands) {
    const f = Math.min(.02, (b.b - b.a) / 3);
    const inO = b.first ? 1 : smoothstep(p, b.a, b.a + f);
    const outO = b.last ? 1 : 1 - smoothstep(p, b.b - f, b.b);
    const op = +(inO * outO).toFixed(3);
    const ramp = +b.el.dataset.ramp || Math.min(.025, (b.b - b.a) * .35);
    let k = clamp((p - b.a) / ramp);
    if (b.first) k = Math.max(k, loadK);
    if (op !== b.op) { b.op = op; b.el.style.opacity = op; b.el.classList.toggle('live', op > .5); }
    if (Math.abs(k - b.k) > .008 || (k === 1 && b.k !== 1)) { b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
    if (b.last) {
      const ks = +clamp((k - .66) * 4).toFixed(3), kb = +clamp((k - .78) * 5).toFixed(3);
      if (ks !== b.ks) { b.ks = ks; b.el.style.setProperty('--ks', ks); }
      if (kb !== b.kb) { b.kb = kb; b.el.style.setProperty('--kb', kb); }
    }
  }
  cue.classList.toggle('gone', p > .04);
}

function tick(now) {
  const dt = Math.min(100, now - (lastTick || now));
  lastTick = now;
  shown += (target - shown) * (1 - Math.pow(1 - .16, dt / 16.667));
  if (Math.abs(target - shown) < .0005) { shown = target; rafId = null; lastTick = 0; }
  else rafId = requestAnimationFrame(tick);
  if (videoOn) requestSeek(shown * video.duration); else renderLayers(shown);
  updateBands(shown);
}
function onScroll() {
  target = heroProgress();
  if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
}
new IntersectionObserver(([e]) => { heroOnScreen = e.isIntersecting; if (heroOnScreen) onScroll(); }).observe(hero);

/* rampa de abertura da faixa 1: montada no carregamento */
function openBandOne() {
  const t0 = performance.now();
  const step = now => {
    loadK = clamp((now - t0) / 1400);
    updateBands(shown);
    if (loadK < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Vídeo de scrub (liga quando config.video = true) ---------- */
let videoOn = false, seekBusy = false, pendingTime = null, heroInit = false;
function requestSeek(t) {
  if (!video.duration) return;
  if (seekBusy) { pendingTime = t; return; }
  seekBusy = true;
  video.currentTime = t;
}
video.addEventListener('seeked', () => { seekBusy = false; if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); } });
video.addEventListener('error', () => { seekBusy = false; pendingTime = null; failVideo(); });

async function loadHeroBlob() {
  const ring = $('.ring', cue);
  const ctrl = new AbortController();
  let watchdog = setTimeout(() => ctrl.abort(), 20000);
  const res = await fetch('assets/hero-scrub.mp4', { priority: 'low', signal: ctrl.signal });
  if (!res.ok) throw new Error('sem vídeo');
  const total = Number(res.headers.get('Content-Length')) || config.videoBytes;
  const reader = res.body.getReader(), chunks = [];
  let got = 0, lastRing = 0;
  ring.style.setProperty('--ld', 126);
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    clearTimeout(watchdog); watchdog = setTimeout(() => ctrl.abort(), 20000);
    chunks.push(value); got += value.length;
    const frac = Math.min(1, got / total), now = performance.now();
    if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
  }
  clearTimeout(watchdog);
  ring.style.setProperty('--ld', 0);
  video.src = URL.createObjectURL(new Blob(chunks));
  video.load();
  video.addEventListener('canplay', () => {
    videoOn = true;
    requestSeek(heroProgress() * video.duration);
    stage.classList.add('video-ready');
  }, { once: true });
}
function failVideo() { videoOn = false; stage.classList.remove('video-ready'); renderLayers(shown); }
function initHeroOnce() {
  if (heroInit) return; heroInit = true;
  openBandOne();
  if (config.video) loadHeroBlob().catch(failVideo);
}

/* ---------- Os cinco portões do hero estático (idênticos ao CSS) ---------- */
const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)'
];
const MQLS = GATES.map(q => matchMedia(q));
function enableScrub() {
  if (scrubOn) return; scrubOn = true;
  initHeroOnce();
  addEventListener('scroll', onScroll, { passive: true });
  bands.forEach(b => { b.op = b.k = b.ks = b.kb = -1; });
  lastLayer = '';
  shown = target = heroProgress();
  if (!videoOn) renderLayers(shown);
  updateBands(shown);
  onScroll();
}
function disableScrub() {
  if (!scrubOn) return; scrubOn = false;
  removeEventListener('scroll', onScroll);
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
}
function applyHeroMode() { MQLS.some(m => m.matches) ? disableScrub() : enableScrub(); }
MQLS.forEach(m => m.addEventListener('change', applyHeroMode));

/* ---------- Contadores ---------- */
function countTo(el, to, dur = 1600) {
  const suf = el.dataset.suf || '', t0 = performance.now();
  const from = +(el.dataset.cur || 0), token = (el._ct = (el._ct || 0) + 1);   // anda do valor atual; uma contagem nova cancela a anterior
  el.dataset.cur = to;
  if (reduceMQ.matches) { el.textContent = to.toLocaleString('pt-BR') + suf; return; }
  let last = '';
  const step = now => {
    if (el._ct !== token) return;
    const p = clamp((now - t0) / dur), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    const s = v.toLocaleString('pt-BR') + suf;
    if (s !== last) { last = s; el.textContent = s; }
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Entradas ---------- */
function onEnter(el, fn, threshold = .2) {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { fn(el); return; }          // sem o observador, mostra tudo na hora
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), { threshold, rootMargin: '0px 0px -6% 0px' });
  io.observe(el);
}

/* Igual ao onEnter, mas sem soltar o elemento: entra de novo toda vez que ele volta para a tela.
   enter roda quando aparece (th = parte visível); leave roda quando sai por completo, para o efeito poder recomeçar. */
function watch(el, enter, leave, th = .2) {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { enter(el); return; }
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) { if (leave) leave(e.target); return; }
    if (e.intersectionRatio >= th || e.intersectionRect.height >= innerHeight * .5) enter(e.target);
  }), { threshold: [0, th], rootMargin: '0px 0px -6% 0px' }).observe(el);
}

/* Entrada dos cards e ícones: Web Animations API. Não depende de transition do CSS, então nenhum bloqueio
   (movimento reduzido, economia de energia, regras de extensão) a desliga. Se animate() não existir,
   cai na transição normal do CSS; se nada rodar, o plano de segurança abaixo mostra o conteúdo. */
const REVEAL_KF = {
  'in-up': [{ opacity: 0, transform: 'translateY(44px) scale(.96)' }, { opacity: 1, transform: 'none' }],
  'in-rise': [{ opacity: 0, transform: 'translateY(60px)' }, { opacity: 1, transform: 'none' }],
  'in-scale': [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }]
};
function playReveal(t) {
  if (t.classList.contains('in')) return;
  const kind = Object.keys(REVEAL_KF).find(k => t.classList.contains(k));
  const delay = (+t.style.getPropertyValue('--d') || 0) * 130;
  const prev = t.style.transition;
  const icons = $$('.mf-count, .ex-av, .step-n, .tl-node', t).filter(i => i.closest('.in-up') === t);
  const blur = t.classList.contains('blur-in') ? [$('.soft', t), $('.sharp', t)] : null;
  if (typeof t.animate === 'function') {
    t.style.transition = 'none';
    const done = () => { t.style.transition = prev; };
    if (kind) t.animate(REVEAL_KF[kind], { duration: kind === 'in-up' ? 1000 : 1200, delay, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }).onfinish = done;
    else done();
    icons.forEach(i => {
      const p = i.style.transition; i.style.transition = 'none';
      i.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 700, delay: delay + 300, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }).onfinish = () => { i.style.transition = p; };
    });
    if (blur && blur[0] && blur[1]) {
      blur.forEach(b => { b.style.transition = 'none'; });
      blur[0].animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1200, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' });
      blur[1].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }).onfinish = () => blur.forEach(b => { b.style.transition = ''; });
    }
  }
  t.classList.add('in');
  clearTimeout(t._doneT);
  t._doneT = setTimeout(() => t.classList.add('done'), 1400);   // aposenta o atraso de escalonamento
}
/* volta o card ao estado escondido quando ele sai da tela, para a entrada tocar de novo no retorno */
function resetReveal(t) {
  if (!t.classList.contains('in')) return;
  clearTimeout(t._doneT);
  if (typeof t.getAnimations === 'function') [t, ...$$('*', t)].forEach(n => n.getAnimations().forEach(a => { if (a.effect && a.effect.getTiming().fill === 'backwards') a.cancel(); }));
  t.classList.remove('in', 'done');
}

function reveals() {
  /* cards do mesmo grupo entram um depois do outro */
  ['.mf-cards', '.ex-grid', '.case-grid', '.climb', '.qa', '.tl', '.cd-stats'].forEach(sel => $$(sel).forEach(g => {
    $$(':scope > .in-up', g).forEach((el, i) => { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i); });
  }));
  $$('.in-up, .in-rise, .in-scale, .blur-in').forEach(el => watch(el, playReveal, resetReveal, .15));
  /* plano de segurança: se o observador falhar (extensão, navegador antigo), o que já está na tela aparece */
  setInterval(() => {
    $$('.in-up:not(.in), .in-rise:not(.in), .in-scale:not(.in), .blur-in:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * .88 && r.bottom > 0) playReveal(el);
    });
  }, 1500);
  const tl = $('#tl');
  if (tl) {
    const items = [...tl.querySelectorAll('.tl-item')], upd = () => {
      const r = tl.getBoundingClientRect(), mid = innerHeight * .6;
      const p = clamp((mid - r.top) / r.height);
      tl.style.setProperty('--tp', p.toFixed(3));
      items.forEach(it => it.classList.toggle('lit', it.getBoundingClientRect().top + it.offsetHeight / 2 < mid));
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
  $$('.rows').forEach(el => watch(el, t => t.classList.add('in'), t => t.classList.remove('in'), .1));
  $$('[data-count]').forEach(el => watch(el, t => countTo(t, +t.dataset.count), t => { t._ct = (t._ct || 0) + 1; t.dataset.cur = 0; t.textContent = '0' + (t.dataset.suf || ''); }, .5));
  cardLoop('#cardRank', ranking, 4000, rankReset);
  cardLoop('#cardGmn', buildGmn, 3400, gmnReset);
  cardLoop('#cardLp', lpPlay, 2600);
}

/* ---------- Demo 01: subindo no ranking ---------- */
const rankOrder = ['a', 'b', 'c', 'you'];
const placeRank = () => rankOrder.forEach((id, i) => { $(`#rank [data-id="${id}"]`).style.transform = `translateY(${i * 44}px)`; });
placeRank();
function rankFinal() {
  rankOrder.splice(0, 4, 'you', 'a', 'b', 'c'); placeRank();
  $('#youMeta').textContent = '4,9 ★ · 128';
  $('#rank .you').classList.add('win'); $('#pinYou').classList.add('win');
  $('.sim-map').classList.add('go'); $('.radar').classList.add('on');
}
let rankTok = 0;
function rankReset() {
  rankTok++;
  rankOrder.splice(0, 4, 'a', 'b', 'c', 'you'); placeRank();
  $('#youMeta').textContent = '3,9 ★ · 9';
  $('#rank .you').classList.remove('win'); $('#pinYou').classList.remove('win'); $('.radar').classList.remove('on');
  $('.sim-map').classList.remove('go');
}
function ranking(card) {
  if (reduceMQ.matches) return rankFinal();
  rankReset();
  void card.offsetWidth;
  const tok = rankTok;
  $('.sim-map', card).classList.add('go');
  const meta = ['4,3 ★ · 18', '4,6 ★ · 47', '4,9 ★ · 128'];
  let step = 0;
  const tickR = () => {
    if (tok !== rankTok) return;
    const i = rankOrder.indexOf('you');
    if (i <= 0) return;
    [rankOrder[i - 1], rankOrder[i]] = [rankOrder[i], rankOrder[i - 1]];
    placeRank();
    $('#youMeta').textContent = meta[step];
    if (++step < 3) return setTimeout(tickR, 900);
    $('#rank .you').classList.add('win'); $('#pinYou').classList.add('win'); $('.radar', card).classList.add('on');
  };
  setTimeout(tickR, 1100);
}

/* ---------- Demo 03: landing page ---------- */
function lpPlay(card) {
  const ease = 'cubic-bezier(.23,1,.32,1)';
  $$('.lp-hero, .lp-blocks i, .lp-btn', card).forEach((el, k) => el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: k * 150, easing: ease, fill: 'backwards' }));
  const t = $('.lp-toast', card);
  if (t) t.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 1300, easing: ease, fill: 'backwards' });
}

/* Cada demo dentro de celular repete enquanto o card está na tela, com pausa entre as voltas, e zera ao sair */
function cardLoop(sel, run, dur, reset) {
  watch($(sel), card => {
    clearTimeout(card._lt);
    const go = () => { run(card); card._lt = setTimeout(go, dur + PHONE_PAUSE); };
    go();
  }, card => { clearTimeout(card._lt); if (reset) reset(card); }, .45);
}

/* ---------- Demo 02: perfil se montando ---------- */
function gmnFinal() { const g = $('#gmn'); for (let i = 1; i <= 5; i++) g.classList.add('s' + i); $('#gMeter').style.transform = 'scaleX(1)'; $('#gPct').textContent = '100%'; $('#gmnCount').textContent = '212'; }
let gmnTok = 0;
function gmnReset() {
  gmnTok++;
  const g = $('#gmn');
  for (let i = 1; i <= 5; i++) g.classList.remove('s' + i);
  $('#gMeter').style.transform = 'scaleX(0)'; $('#gPct').textContent = '0%';
  const c = $('#gmnCount'); c._ct = (c._ct || 0) + 1; c.dataset.cur = 0; c.textContent = '0';
}
function buildGmn() {
  if (reduceMQ.matches) return gmnFinal();
  gmnReset();
  const tok = gmnTok;
  const g = $('#gmn');
  let s = 0;
  const step = () => {
    if (tok !== gmnTok) return;
    g.classList.add('s' + ++s);
    $('#gMeter').style.transform = `scaleX(${s / 5})`;
    $('#gPct').textContent = s * 20 + '%';
    if (s === 2) { const c = $('#gmnCount'); c.dataset.suf = ''; countTo(c, 212, 1200); }
    if (s < 5) setTimeout(step, 550);
  };
  setTimeout(step, 400);
}

/* ---------- Palcos com pino (celular e movimento reduzido ficam sem pino, idêntico ao CSS) ---------- */
const STACK_MQ = matchMedia('(max-width: 720px)');
const pinned = () => !STACK_MQ.matches;

/* abas: setas do teclado movem entre as abas */
function tabKeys(list) {
  list.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = $$('.ftab', list), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); n.click(); e.preventDefault();
  });
}

/* ---------- A escolha: o palco das 5 etapas ---------- */
const jSec = $('#jornada'), jBar = $('#jBar');
const jBars = $$('#jFunnel .j-bar'), jInfos = $$('#jStage .j-i'), jScreens = $$('#jStage .jp-s');
let jStep = -1, lastJ = '', jSeen = false, typeTimer = null;
const BIZ = ['café', 'dentista', 'advogado', 'academia', 'mecânico', 'padaria'];
let bizI = 0;
function typeSearch(done) {
  const el = $('#jType'), biz = BIZ[bizI++ % BIZ.length], text = biz + ' perto de mim';
  const sugg = $$('#jStage .jp-sugg li');
  sugg.forEach((li, i) => { li.textContent = [text, 'qual o melhor ' + biz + ' em Londrina', biz + ' aberto agora', biz + ' avaliações'][i]; });
  clearTimeout(typeTimer);
  if (reduceMQ.matches) { el.textContent = text; return; }
  let n = 0;
  el.textContent = '';
  sugg.forEach((li, i) => li.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 1000 + text.length * 85 + i * 140, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
  const step = () => {
    el.textContent = text.slice(0, ++n);
    if (n < text.length) typeTimer = setTimeout(step, 60 + Math.random() * 50);
    else if (done) done();
  };
  typeTimer = setTimeout(step, 350);
}

/* Telas do celular da jornada: cada uma repete sozinha, com uns segundos de pausa entre as voltas */
const PHONE_PAUSE = 3500;
const PHONE_ITEMS = ['.jp-pin', '.jp-list li', '.jp-prof', '.jp-photos i', '.jp-review', '.jp-actions span', '.jp-wa', '.jp-cal i', '.jp-booked', '.jp-month'];
let jVisible = false, loopTimer = null;
function playPhone(screen) {
  $$(PHONE_ITEMS.join(','), screen).forEach((el, k) => {
    const rot = el.classList.contains('jp-pin') ? 'rotate(-45deg) ' : '';
    el.animate([{ opacity: 0, transform: rot + (rot ? 'scale(0)' : 'translateY(12px) scale(.96)') }, { opacity: 1, transform: rot ? 'rotate(-45deg) scale(1)' : 'none' }],
      { duration: 600, delay: k * 110, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'backwards' });
  });
  const tap = $('.jp-tap', screen);                       // o toque do dedo volta junto com a volta da tela
  if (tap) tap.animate([{ transform: 'translate(30px,-90px)', opacity: 0 }, { opacity: 1, transform: 'none', offset: .45 }, { transform: 'scale(.7)', offset: .6 }, { transform: 'scale(1.4)', opacity: 0 }], { duration: 2000, delay: 900, easing: 'ease-in-out' });
  return 600 + $$(PHONE_ITEMS.join(','), screen).length * 110 + (tap ? 2900 : 0);
}
function stopLoop() { clearTimeout(loopTimer); clearTimeout(typeTimer); }
function runScreen() {
  stopLoop();
  if (!jVisible || jStep < 0) return;
  const again = () => { loopTimer = setTimeout(runScreen, PHONE_PAUSE); };
  if (jStep === 0) typeSearch(again);
  else loopTimer = setTimeout(runScreen, playPhone(jScreens[jStep]) + PHONE_PAUSE);
}
function setStep(i) {
  if (i === jStep) return;
  jStep = i;
  jBars.forEach((c, n) => { c.classList.toggle('shown', n <= i || !pinned()); c.classList.toggle('on', n === i); c.setAttribute('aria-current', n === i); });
  jInfos.forEach(el => el.classList.toggle('on', +el.dataset.step === i));
  jScreens.forEach(el => el.classList.toggle('on', +el.dataset.step === i));
  if (jSeen) runScreen();
}
function journeyScroll() {
  if (!pinned()) return;
  const r = jSec.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const p = clamp(-r.top / (r.height - innerHeight));
  const key = p.toFixed(3);
  if (key === lastJ) return;
  lastJ = key;
  jBar.style.transform = `scaleX(${key})`;
  setStep(Math.min(4, Math.floor(p * 5)));
}
function journeyMode() {                                    // sem pino: o funil já aparece completo e as barras trocam por toque
  jStep = -1;
  if (pinned()) { lastJ = ''; journeyScroll(); if (jStep < 0) setStep(0); }
  else { setStep(0); jBars.forEach(c => c.classList.add('shown')); }
}
jBars.forEach((c, i) => c.addEventListener('click', () => {
  if (!pinned()) { setStep(i); const d = $('#jStage .j-detail'); if (d) ensureInView(d); return; }
  const top = jSec.getBoundingClientRect().top + scrollY;   // com pino, a barra leva o scroll até a etapa
  scrollTo({ top: top + (i + .5) / 5 * (jSec.offsetHeight - innerHeight), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
}));
watch(jSec, () => { jSeen = jVisible = true; runScreen(); }, () => { jVisible = false; stopLoop(); }, 0);

/* ---------- Resultados: o palco que abre ---------- */
const rPin = $('#rPin'), rStage = $('#rStage'), rHead = $('#rHead'), rSides = $$('#rStage .r-side');
const rMarker = $('#rMarker'), rTag = $('#rTag'), rMainV = $('#rMainV');
const SERIE = [34, 52, 89, 131, 164, 212];   // série de exemplo
let lastR = '', grown = false, lastTag = '', lastTagAt = 0, rShift = null;
function valueAt(m) {
  const x = m * (SERIE.length - 1), i = Math.min(SERIE.length - 2, Math.floor(x)), f = x - i;
  return Math.floor(((SERIE[i] + (SERIE[i + 1] - SERIE[i]) * f) / SERIE[0] - 1) * 100);
}
function setMarker(m, now) {
  rMarker.style.setProperty('--mx', m.toFixed(4));
  const s = '+' + valueAt(m) + '%';
  if (s !== lastTag && (now - lastTagAt > 100 || m === 1)) { lastTag = s; lastTagAt = now; rTag.textContent = s; rMainV.textContent = s; }
}
function resultsScroll(now = performance.now()) {
  if (!pinned()) return;
  const r = rPin.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const p = clamp(-r.top / (r.height - innerHeight));
  const key = p.toFixed(3);
  if (key === lastR) return;
  lastR = key;
  const z = smoothstep(p, .45, .82);                       // a câmera se afasta
  setMarker(smoothstep(p, .02, .42), now);                 // antes, a linha corre pelo gráfico
  if (rShift === null) rShift = rStage.offsetTop + rStage.offsetHeight / 2 - innerHeight / 2;   // centraliza o card no zoom
  rStage.style.transform = `translate3d(0,${(-rShift * (1 - z)).toFixed(1)}px,0) scale(${(1.75 - .75 * z).toFixed(4)})`;
  rStage.style.setProperty('--bg', z.toFixed(3));
  const side = smoothstep(p, .55, .85).toFixed(3);
  rSides.forEach(s => { s.style.opacity = side; });
  rHead.style.opacity = smoothstep(p, .62, .9).toFixed(3);
  if (!grown && z > .5) { grown = true; rStage.classList.add('grown'); }
  else if (grown && z < .2) { grown = false; rStage.classList.remove('grown'); }
}
function animateMarker() {
  if (reduceMQ.matches) return setMarker(1, Infinity);
  const t0 = performance.now();
  const step = now => { const t = clamp((now - t0) / 1800); setMarker(1 - Math.pow(1 - t, 3), now); if (t < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function resultsUnpinned() {                                 // sem pino: tudo no lugar, a linha corre na entrada
  rStage.style.transform = ''; rStage.style.removeProperty('--bg');
  rSides.forEach(s => { s.style.opacity = ''; });
  rHead.style.opacity = '';
  onEnter(rStage, () => { grown = true; rStage.classList.add('grown'); animateMarker(); }, .25);
}

/* ---------- Score Google: o palco do diagnóstico (o momento interativo) ---------- */
function scoreStage() {
  const Q = score.perguntas, ans = Array(Q.length).fill(null), autoDone = new Set();
  const ORDER = ['basicos', 'atualizacao', 'gatilhos'], LABELS = ['Sim', 'Em parte', 'Não'];
  const tabs = $$('#sStage .ftab'), box = $('#sQuestions');
  let cur = 'basicos';
  const idxOf = pilar => Q.map((q, i) => (q.pilar === pilar ? i : -1)).filter(i => i >= 0);
  const pts = i => (ans[i] == null ? 0 : Q[i].pontos[ans[i]]);
  const total = () => Q.reduce((s, q, i) => s + pts(i), 0);
  const answered = () => ans.filter(a => a != null).length;
  const faixa = v => score.faixas.find(f => v <= f.ate);

  $('#sPillars').innerHTML = ORDER.map(k => `<div class="sp" data-p="${k}"><span>${score.pilares[k][0]}<b>0 / ${score.pilares[k][1]}</b></span><div><i></i></div></div>`).join('');

  function render(pilar, animate = true) {
    cur = pilar;
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.pilar === pilar));
    box.innerHTML = idxOf(pilar).map(i => {
      const q = Q[i], a = ans[i];
      return `<div class="qb" data-i="${i}">
        <div class="qb-top"><small>${String(i + 1).padStart(2, '0')}</small><h3 title="${q.titulo}">${q.curto}</h3></div>
        <div class="chips" role="group" aria-label="${q.titulo}">${LABELS.map((l, k) => `<button class="chip-opt" data-k="${k}" aria-pressed="${a === k}">${l}</button>`).join('')}</div>
        <p class="qb-note">${a == null ? (q.dica || 'Escolha a opção que mais combina com o perfil hoje.') : q.opcoes[a]}</p>
      </div>`;
    }).join('');
    if (animate) { box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap'); }
    updateNext();
  }
  function updateNext() {
    const next = $('#sNext'), pos = ORDER.indexOf(cur);
    next.textContent = pos < 2 ? 'Próxima Etapa →' : 'Ver Diagnóstico →';
    next.classList.toggle('pulse', idxOf(cur).every(i => ans[i] != null));
  }
  function update() {
    const v = Math.round(total()), n = answered(), f = faixa(v);
    countTo($('#gVal'), v, 700);
    $('#sMini').textContent = v;
    const meter = $('.s-meter');
    meter.style.setProperty('--s', (v / 1000).toFixed(4));
    meter.classList.remove('bump'); void meter.offsetWidth; meter.classList.add('bump');
    ORDER.forEach(k => {
      const ids = idxOf(k), s = ids.reduce((acc, i) => acc + pts(i), 0), done = ids.filter(i => ans[i] != null).length;
      const row = $(`#sPillars .sp[data-p="${k}"]`);
      $('b', row).textContent = `${Math.round(s)} / ${score.pilares[k][1]}`;
      $('i', row).style.transform = `scaleX(${Math.min(1, s / score.pilares[k][1]).toFixed(3)})`;
      const chip = $(`#sStage .ftab i[data-for="${k}"]`);
      chip.textContent = `${done}/${ids.length}`;
      chip.classList.toggle('full', done === ids.length);
    });
    const left = Q.length - n;
    if (left) {
      $('#vKicker').textContent = `Faltam ${left} ${left === 1 ? 'resposta rápida' : 'respostas rápidas'}`;
      $('#vTitle').textContent = n ? 'O score já está se mexendo.' : 'O resultado da sua auditoria aparecerá aqui.';
      $('#vText').textContent = 'Responda ao questionário para ver o status da sua ficha e identificar as falhas que estão custando clientes à sua empresa.';
      $('#vCta').hidden = true;
    } else {
      $('#vKicker').innerHTML = `Diagnóstico <span class="status" style="background:${f.cor}">${f.status}</span>`;
      $('#vTitle').textContent = f.titulo;
      $('#vText').textContent = f.texto;
      $('#vCta').hidden = false;
    }
    updateNext();
  }
  box.addEventListener('click', e => {
    const b = e.target.closest('.chip-opt'); if (!b) return;
    const qb = b.closest('.qb'), i = +qb.dataset.i, k = +b.dataset.k;
    ans[i] = k;
    $$('.chip-opt', qb).forEach(c => c.setAttribute('aria-pressed', c === b));
    $('.qb-note', qb).textContent = Q[i].opcoes[k];
    update();
    const pos = ORDER.indexOf(cur);                          // completou a área: passa para a próxima sozinho
    if (pos < 2 && idxOf(cur).every(x => ans[x] != null) && !autoDone.has(cur)) { autoDone.add(cur); setTimeout(() => { render(ORDER[pos + 1]); showTab(); toStage(false); }, 700); }
  });
  const toStage = force => { if (MOBILE_MQ.matches) ensureInView($('#sStage'), force); };
  const showTab = () => { const t = tabs.find(x => x.getAttribute('aria-selected') === 'true'); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMQ.matches ? 'auto' : 'smooth' }); };
  tabs.forEach(t => t.addEventListener('click', () => { if (t.dataset.pilar !== cur) { render(t.dataset.pilar); showTab(); toStage(false); } }));
  tabKeys($('#sStage .ftabs'));
  $('#sNext').addEventListener('click', () => {
    const pos = ORDER.indexOf(cur);
    if (pos < 2) { render(ORDER[pos + 1]); showTab(); toStage(true); }
    else $('#sVerdict').scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth', block: 'center' });
  });
  $('#qReset').addEventListener('click', () => { ans.fill(null); autoDone.clear(); render('basicos'); update(); });
  render('basicos', false);
  update();
}

/* ---------- O pin assinatura ---------- */
const pin = $('#pin'), pinLabel = $('#pinLabel');
const darkSecs = new Set();
const pinIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const n = e.target.dataset.pin;
  if (pinLabel.textContent === n) return;
  pinLabel.textContent = n;
  pin.classList.toggle('dark', darkSecs.has(n));
  pin.classList.remove('flash'); void pin.offsetWidth; pin.classList.add('flash');
}), { rootMargin: '-45% 0px -45% 0px' });
$$('[data-pin]').forEach(s => pinIO.observe(s));

/* ---------- Menu do celular ---------- */
const menuBtn = $('#menuBtn'), navMenu = $('#navMenu');
let menuOpen = false;
function setMenu(open, back = true) {
  menuOpen = open;
  navMenu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  if (open) { $('a', navMenu).focus(); $('#nav').classList.remove('hide'); }
  else if (back) menuBtn.focus();
}
menuBtn.addEventListener('click', () => setMenu(!menuOpen));
navMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false, false); });
document.addEventListener('keydown', e => {
  if (!menuOpen) return;
  if (e.key === 'Escape') { setMenu(false); return; }
  if (e.key !== 'Tab') return;                              // o foco fica preso entre o botão e os links
  const items = [menuBtn, ...$$('a', navMenu)], i = items.indexOf(document.activeElement);
  const n = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
  items[n].focus(); e.preventDefault();
});
document.addEventListener('pointerdown', e => { if (menuOpen && !e.target.closest('#nav')) setMenu(false, false); });
MOBILE_MQ.addEventListener('change', () => { if (menuOpen && !MOBILE_MQ.matches) setMenu(false, false); });

/* ---------- Carrosséis do celular: indicador de posição ---------- */
function carousel(scroller, itemSel, host, cls) {
  if (!scroller || !host) return;
  const items = $$(itemSel, scroller);
  const dots = document.createElement('div');
  dots.className = 'dots ' + cls;
  dots.innerHTML = items.map((_, i) => '<button type="button" aria-label="Ir para o item ' + (i + 1) + ' de ' + items.length + '"></button>').join('');
  host.appendChild(dots);
  const bs = $$('button', dots);
  let cur = -1;
  const mark = () => {
    const mid = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0, d = Infinity;
    items.forEach((it, i) => { const x = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (x < d) { d = x; best = i; } });
    if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4) best = items.length - 1;
    if (best === cur) return;
    cur = best;
    bs.forEach((b, i) => b.setAttribute('aria-current', i === best));
  };
  bs.forEach((b, i) => b.addEventListener('click', () => {
    const it = items[i];
    scroller.scrollTo({ left: it.offsetLeft - (scroller.clientWidth - it.offsetWidth) / 2, behavior: reduceMQ.matches ? 'auto' : 'smooth' });
  }));
  scroller.addEventListener('scroll', mark, { passive: true });
  addEventListener('resize', mark);
  mark();

  /* passa sozinho, devagar: anima o scrollLeft em JS (o snap fica desligado só durante o movimento) */
  let visible = false, busy = false, idleUntil = 0, raf = 0;
  const glide = (to, dur = 1600) => {
    const from = scroller.scrollLeft, t0 = performance.now();
    busy = true; scroller.style.scrollSnapType = 'none';
    const step = now => {
      const p = clamp((now - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      scroller.scrollLeft = from + (to - from) * e;
      if (p < 1 && busy) raf = requestAnimationFrame(step);
      else { busy = false; scroller.style.scrollSnapType = ''; }
    };
    raf = requestAnimationFrame(step);
  };
  const touch = () => { idleUntil = performance.now() + 9000; if (busy) { busy = false; cancelAnimationFrame(raf); scroller.style.scrollSnapType = ''; } };
  ['pointerdown', 'touchstart', 'wheel'].forEach(ev => scroller.addEventListener(ev, touch, { passive: true }));
  bs.forEach(b => b.addEventListener('click', touch));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .6 }).observe(scroller);
  setInterval(() => {
    if (!visible || busy || document.hidden || performance.now() < idleUntil) return;
    if (scroller.scrollWidth <= scroller.clientWidth + 8) return;       // não é carrossel nesta largura
    const nx = (cur + 1) % items.length, it = items[nx];
    glide(nx === 0 ? 0 : it.offsetLeft - (scroller.clientWidth - it.offsetWidth) / 2);
  }, 3200);
}
carousel($('.ex-grid'), '.ex', $('.ex-stage'), 'dots-720');
carousel($('#rStage'), '.r-card', $('#rStage').parentElement, 'dots-720');
carousel($('.mf-cards'), '.mf-c', $('.mf-stage'), 'dots-560');

/* ---------- Scroll geral ---------- */
const nav = $('#nav'), wa = $('.wa-float');
let lastY = scrollY, ticking = false, navHidden = false, waShown = false, pinOn = false;
function pageScroll() {
  ticking = false;
  const y = scrollY, heroEnd = hero.offsetHeight - innerHeight * .5;
  const hide = y > lastY && y > 300 && !menuOpen;
  if (hide !== navHidden) { navHidden = hide; nav.classList.toggle('hide', hide); }
  const show = y > heroEnd;
  if (show !== waShown) { waShown = show; wa.classList.toggle('show', show); }
  if (show !== pinOn) { pinOn = show; pin.classList.toggle('on', show); }
  lastY = y;
  journeyScroll();
  resultsScroll();
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(pageScroll); } }, { passive: true });
addEventListener('resize', () => { lastJ = lastR = ''; rShift = null; pageScroll(); if (scrubOn) onScroll(); });
STACK_MQ.addEventListener('change', () => { lastJ = lastR = ''; journeyMode(); if (pinned()) pageScroll(); else resultsUnpinned(); });



/* ---------- Cases reais: cada card abre o resultado do próprio cliente ---------- */
(function caseStage() {
  const box = $('#caseDetail'), btns = $$('.case-card');
  if (!box || !cases) return;
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  function render(i) {
    const k = cases[i];
    if (!k) return;
    btns.forEach((b, n) => { b.classList.toggle('sel', n === i); b.setAttribute('aria-pressed', n === i); });
    const max = k.barras ? Math.max(...k.barras.dados.map(d => d[1])) : 1;
    box.innerHTML =
      '<div class="cd-shot"><img src="' + esc(k.img) + '" alt="Perfil de ' + esc(k.nome) + ' no Google" width="420" height="854"></div>' +
      '<div class="cd-body"><p class="label">' + esc(k.tag) + '</p><h3>' + esc(k.titulo) + '</h3><p class="cd-text">' + esc(k.texto) + '</p>' +
      '<div class="cd-stats">' + k.stats.map(s => '<div><b>' + esc(s.v) + '</b><span>' + esc(s.l) + '</span></div>').join('') + '</div>' +
      (k.barras ? '<div class="cd-bars"><p>' + esc(k.barras.titulo) + '</p><div>' + k.barras.dados.map(d => '<figure><b>' + d[1] + '</b><i style="--h:' + (d[1] / max).toFixed(3) + '"></i><span>' + esc(d[0]) + '</span></figure>').join('') + '</div></div>' : '') +
      (k.nota ? '<p class="cd-note">' + esc(k.nota) + '</p>' : '') + '</div>';
  }
  btns.forEach((b, i) => b.addEventListener('click', () => {
    render(i);
    if (MOBILE_MQ.matches) scrollToEl(box); else box.scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth', block: 'nearest' });
  }));
  render(0);
})();


/* ---------- Modo escuro ---------- */
(function theme() {
  const btn = $('#themeBtn'), root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
  const apply = d => {
    d ? root.setAttribute('data-theme', 'dark') : root.removeAttribute('data-theme');
    btn.setAttribute('aria-pressed', d);
    if (meta) meta.setAttribute('content', d ? '#030A16' : '#061430');
  };
  apply(root.getAttribute('data-theme') === 'dark');
  btn.addEventListener('click', () => {
    const d = root.getAttribute('data-theme') !== 'dark';
    apply(d);
    try { localStorage.setItem('cz-theme', d ? 'dark' : 'light'); } catch (e) {}
  });
})();

/* ---------- Pausa em aba escondida ---------- */
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* ---------- Movimento reduzido, ao vivo nas duas direções ---------- */
function pinToFinalStates() {
  $$('.in-up, .in-rise, .in-scale, .blur-in').forEach(e => e.classList.add('in', 'done'));
  $$('.rows, .card, .ex').forEach(e => e.classList.add('in'));
  $$('[data-count]').forEach(e => { e.textContent = (+e.dataset.count).toLocaleString('pt-BR') + (e.dataset.suf || ''); });
  rankFinal(); gmnFinal();
  grown = true; rStage.classList.add('grown'); setMarker(1, Infinity);
  $('#jType').textContent = 'café perto de mim';
}
reduceMQ.addEventListener('change', e => { if (e.matches) pinToFinalStates(); applyHeroMode(); });

/* ---------- Início ---------- */
$$('.blur-in').forEach(el => {                               // cópia suave (desfoque estático) + cópia nítida
  const t = el.textContent;
  el.innerHTML = `<span class="soft" aria-hidden="true">${t}</span><span class="sharp">${t}</span>`;
});
reveals();
journeyMode();
scoreStage();
if (!pinned()) resultsUnpinned();
if (reduceMQ.matches) pinToFinalStates();
applyHeroMode();
pageScroll();
})();
