import { config, stats, cases, score } from "./data.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- WhatsApp ---------- */
const waUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.mensagem)}`;
$$(".js-wa").forEach(a => { a.href = waUrl; a.target = "_blank"; a.rel = "noopener"; });

/* ---------- Intro: CZ piscando ---------- */
function intro() {
  const el = $("#intro");
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    el.classList.add("out");
    document.body.classList.remove("is-intro");
    document.body.classList.add("ready");
    typeSearch();
    setTimeout(() => el.remove(), 1300);
  };
  if (reduce) return done();
  requestAnimationFrame(() => el.classList.add("on"));
  setTimeout(done, 2300);
  el.addEventListener("click", done, { once: true });
}

/* ---------- Contador ---------- */
function countTo(el, to, pre = "", suf = "", dur = 1400) {
  const from = parseFloat(el.dataset.cur || 0), t0 = performance.now();
  const step = now => {
    const p = clamp((now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + Math.round(from + (to - from) * e).toLocaleString("pt-BR") + suf;
    if (p < 1) requestAnimationFrame(step); else el.dataset.cur = to;
  };
  requestAnimationFrame(step);
}

function onEnter(el, fn, threshold = .25) {
  if (!el) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
  }), { threshold, rootMargin: "0px 0px -8% 0px" });
  io.observe(el);
}

/* ---------- Hero: busca digitando ---------- */
function typeSearch() {
  const typed = $("#typed"), text = "dentista perto de mim";
  let i = 0;
  const type = () => {
    typed.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 55 + Math.random() * 60);
    else countTo($("#chipCalls"), 210, "+", "%", 1800);
  };
  setTimeout(type, 700);
}

/* ---------- Demo 01: clínica sobe no ranking ---------- */
function ranking(card) {
  const list = $("#simList"), order = ["a", "b", "c", "you"];
  const place = () => order.forEach((id, i) => { $(`[data-id="${id}"]`, list).style.transform = `translateY(${i * 50}px)`; });
  place();
  $("#simMap").classList.add("go");
  const meta = ["4,3 ★ · 18", "4,6 ★ · 47", "4,9 ★ · 128"];
  let step = 0;
  const tick = () => {
    const idx = order.indexOf("you");
    [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
    place();
    $("#youMeta").textContent = meta[step];
    if (++step < 3) return setTimeout(tick, 900);
    $(".you", list).classList.add("win");
    $("#pinYou").classList.add("win");
    $(".radar", card).classList.add("on");
  };
  setTimeout(tick, 1200);
}
// posiciona a lista antes de animar
(() => ["a", "b", "c", "you"].forEach((id, i) => { $(`#simList [data-id="${id}"]`).style.transform = `translateY(${i * 50}px)`; }))();

/* ---------- Demo 02: perfil sendo montado ---------- */
function buildGmn() {
  const el = $("#gmnBuild"), meter = $("#gbMeter"), pct = $("#gbPct");
  let s = 0;
  const tick = () => {
    el.classList.add("s" + ++s);
    meter.style.width = pct.textContent = s * 20 + "%";
    if (s === 2) countTo($(".count", el), 212);
    if (s < 5) setTimeout(tick, 550);
  };
  setTimeout(tick, 400);
}

/* ---------- Reveals ---------- */
function reveals() {
  $$(".rv, .card, .rows, .case-list, .num").forEach(el => onEnter(el, t => t.classList.add("in"), .15));
  $$(".count").forEach(el => onEnter(el, t => countTo(t, +t.dataset.to)));
  onEnter($("#realBars"), t => t.classList.add("in"));
  const cards = $$(".demo .card");
  onEnter(cards[0], ranking, .4);
  onEnter(cards[1], buildGmn, .4);
}

/* ---------- Em números ---------- */
function numbers() {
  $("#numList").innerHTML = stats.map(s =>
    `<div class="num"><b data-to="${s.valor}" data-pre="${s.prefixo || ""}" data-suf="${s.sufixo}">${s.prefixo || ""}0${s.sufixo}</b>
      <span>${s.rotulo}<small>${s.texto}</small></span></div>`).join("");
  $$("#numList b").forEach(b => onEnter(b, t => countTo(t, +t.dataset.to, t.dataset.pre, t.dataset.suf, 1800), .5));
}

/* ---------- Colagem do hero em parallax ---------- */
function collage() {
  const pieces = $$(".piece"), hero = $("#hero");
  return () => {
    const y = scrollY;
    if (y > hero.offsetHeight * 1.2) return;
    pieces.forEach(p => {
      const base = p.classList.contains("pc2") ? " rotate(6deg)" : p.classList.contains("pc4") ? " rotate(-8deg)" : "";
      p.style.transform = `translate3d(0, ${y * parseFloat(p.dataset.speed)}px, 0)${base}`;
    });
  };
}

/* ---------- Jornada horizontal ---------- */
function journey() {
  const sec = $("#jornada"), track = $("#journeyTrack"), bar = $("#journeyBar");
  return () => {
    if (innerWidth <= 720) { track.style.transform = ""; return; }
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    track.style.transform = `translateX(${-p * Math.max(0, track.scrollWidth - innerWidth + 60)}px)`;
    bar.style.transform = `scaleX(${p})`;
  };
}

/* ---------- Cases: imagem segue o hover ---------- */
function caseHover() {
  const list = $("#caseList"), img = $("#caseImg");
  $$(".case-row", list).forEach(row => {
    row.addEventListener("pointerenter", () => { img.src = row.dataset.img; list.classList.add("hovering"); });
  });
  list.addEventListener("pointerleave", () => list.classList.remove("hovering"));
}

/* ---------- Gráfico dos cases ---------- */
function chart() {
  const svg = $("#chart"), tabs = $("#caseTabs");
  const W = 600, H = 290, pad = 10;
  tabs.innerHTML = cases.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${c.nome}</button>`).join("");
  tabs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", tabs).forEach(x => x.setAttribute("aria-selected", x === b));
    draw(+b.dataset.i);
  });

  function draw(i) {
    const c = cases[i], data = c.interacoes, max = Math.max(...data) * 1.15;
    const pts = data.map((v, k) => [pad + k * (W - 2 * pad) / (data.length - 1), H - (v / max) * (H - 20)]);
    let d = `M${pts[0]}`;
    for (let k = 0; k < pts.length - 1; k++) {
      const p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
      d += ` C${[p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]} ${[p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]} ${p2}`;
    }
    svg.classList.remove("drawn");
    svg.innerHTML = `
      <defs><linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2f7de1" stop-opacity=".22"/><stop offset="1" stop-color="#2f7de1" stop-opacity="0"/></linearGradient></defs>
      <g class="grid">${[0, 1, 2, 3].map(g => `<line x1="0" x2="${W}" y1="${20 + g * (H - 20) / 3}" y2="${20 + g * (H - 20) / 3}"/>`).join("")}</g>
      <path class="area" d="${d} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H}Z"/>
      <path class="line" d="${d}"/>
      ${pts.map((p, k) => `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="4.5" data-v="${data[k]}"/>`).join("")}`;
    const line = $(".line", svg), len = line.getTotalLength();
    line.style.strokeDasharray = line.style.strokeDashoffset = len;
    line.getBoundingClientRect();
    line.style.transition = "stroke-dashoffset 1.8s cubic-bezier(.23,1,.32,1)";
    line.style.strokeDashoffset = 0;
    setTimeout(() => svg.classList.add("drawn"), 50);

    $("#chartLabels").innerHTML = c.meses.map(m => `<span>${m}</span>`).join("");
    $("#caseName").textContent = c.nome;
    $("#caseMeta").textContent = `${c.cidade} · ${c.foco}`;
    $("#caseKpis").innerHTML = c.destaques.map(([v, t]) => `<div class="kpi"><b>${v}</b><span>${t}</span></div>`).join("");
  }

  const box = $(".chart-box"), tip = document.createElement("div");
  tip.className = "chart-tip"; tip.hidden = true; box.append(tip);
  svg.addEventListener("pointermove", e => {
    const dots = $$(".dot", svg); if (!dots.length) return;
    const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W;
    const d = dots.reduce((a, b) => Math.abs(b.cx.baseVal.value - x) < Math.abs(a.cx.baseVal.value - x) ? b : a);
    tip.hidden = false;
    tip.textContent = d.dataset.v + " interações";
    tip.style.left = d.cx.baseVal.value / W * r.width + "px";
    tip.style.top = d.cy.baseVal.value / 300 * r.height + "px";
  });
  svg.addEventListener("pointerleave", () => tip.hidden = true);
  onEnter(svg, () => draw(0), .4);
}

/* ---------- Score GMN ---------- */
function quiz() {
  const card = $("#quizCard"), Q = score.perguntas, pad = n => String(n).padStart(2, "0");
  let cur = 0;
  const ans = Array(Q.length).fill(null);
  const total = () => ans.reduce((s, a, i) => s + (a == null ? 0 : Q[i].pontos[a]), 0);
  const faixa = v => score.faixas.find(f => v <= f.ate);
  const answered = () => ans.filter(a => a != null).length;

  function gauge() {
    const v = Math.round(total()), f = faixa(v), n = answered();
    $("#gFill").style.strokeDashoffset = 252 * (1 - v / 1000);
    $("#gFill").style.stroke = f.cor;
    $("#gNeedle").style.transform = `rotate(${-90 + 180 * v / 1000}deg)`;
    countTo($("#gVal"), v, "", "", 800);
    const st = $("#gStatus");
    st.textContent = n ? f.status : "—";
    st.style.background = n ? f.cor : ""; st.style.color = n ? "#fff" : "";
    $("#gText").textContent = n === Q.length ? f.texto : "Responda as perguntas para ver o diagnóstico.";
    $("#scoreCta").hidden = n !== Q.length;
  }

  function render() {
    $("#qCount").textContent = cur < Q.length ? `${pad(cur + 1)} / ${Q.length}` : "Resultado";
    $("#qBar").style.width = answered() / Q.length * 100 + "%";
    $("#qPrev").disabled = cur === 0;
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    if (cur >= Q.length) {
      const pil = Object.entries(score.pilares).map(([k, [nome, max]]) => {
        const s = Q.reduce((acc, q, i) => acc + (q.pilar === k && ans[i] != null ? q.pontos[ans[i]] : 0), 0);
        return `<div class="pillar"><span>${nome}<b>${Math.round(s)} / ${max}</b></span><div><i data-w="${s / max * 100}"></i></div></div>`;
      }).join("");
      card.innerHTML = `<div class="quiz-done"><small>Score da sua clínica</small><b>${Math.round(total())}</b><div class="pillars">${pil}</div>
        <a class="arrow-link" href="${waUrl}" target="_blank" rel="noopener"><span>Receber o laudo completo</span><i class="circ"><svg viewBox="0 0 24 24"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg></i></a></div>`;
      requestAnimationFrame(() => $$(".pillar i", card).forEach(i => i.style.width = i.dataset.w + "%"));
      return;
    }
    const q = Q[cur];
    card.innerHTML = `<h3>${q.titulo}</h3>${q.dica ? `<p class="hint">${q.dica}</p>` : ""}
      ${q.opcoes.map((o, k) => `<button class="opt${ans[cur] === k ? " sel" : ""}" data-k="${k}">${o}</button>`).join("")}`;
  }

  card.addEventListener("click", e => {
    const b = e.target.closest(".opt"); if (!b) return;
    ans[cur] = +b.dataset.k;
    $$(".opt", card).forEach(o => o.classList.toggle("sel", o === b));
    gauge();
    setTimeout(() => { cur++; render(); }, 300);
  });
  $("#qPrev").onclick = () => { if (cur > 0) { cur--; render(); } };
  $("#qReset").onclick = () => { ans.fill(null); cur = 0; render(); gauge(); };
  render();
}

/* ---------- Menu fullscreen ---------- */
function menu() {
  const btn = $("#menuBtn"), m = $("#menu");
  const set = open => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    m.setAttribute("aria-hidden", !open);
  };
  btn.onclick = () => set(!document.body.classList.contains("menu-open"));
  $$("a", m).forEach(a => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
}

/* ---------- Cursor customizado ---------- */
function cursor() {
  if (!finePointer) return;
  const c = $("#cursor"), txt = $("#cursorText");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("pointermove", e => {
    x = e.clientX; y = e.clientY;
    const t = e.target;
    const view = t.closest(".case-row, #chart");
    c.classList.toggle("view", !!view);
    if (view) txt.textContent = view.id === "chart" ? "Explorar" : "Ver case";
    c.classList.toggle("link", !view && !!t.closest("a, button"));
    c.classList.toggle("dark", !!t.closest(".manifesto, .cta, .menu, .real-case, .footer"));
  });
  const loop = () => {
    cx += (x - cx) * .2; cy += (y - cy) * .2;
    c.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- Loop de scroll ---------- */
function scrollLoop(fns) {
  const prog = $("#progress"), wa = $(".wa-float");
  let ticking = false;
  const run = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${scrollY / h})`;
    wa.classList.toggle("show", scrollY > innerHeight * .8);
    fns.forEach(f => f());
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener("resize", run);
  run();
}

numbers();
reveals();
caseHover();
chart();
quiz();
menu();
cursor();
scrollLoop([collage(), journey()]);
intro();
