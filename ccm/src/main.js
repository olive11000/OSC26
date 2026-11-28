import * as THREE from 'three';
import { createWorld, INFO } from './world.js';
import { applyView } from './views.js';
import { FICHE } from './data_fiche.js';
import { QUIZ } from './data_quiz.js';
import { MISSIONS, PHASES, GRADES } from './missions.js';
import { SIMS } from './sims.js';
import { LEXIQUE } from './lexique.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isMobile = matchMedia('(max-width: 760px)').matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const NM = MISSIONS.length;

// ======================================================================= sauvegarde
const KEY = 'ccm_game_v1';
let S;
try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
if (!S || S.v !== 1) S = { v: 1, xp: 0, m: {}, err: {}, exams: [], sound: true, seen: {} };
S.seen = S.seen || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible */ } };
const MS = (id) => (S.m[id] = S.m[id] || { read: [], sim: 0, check: 0, oral: [] });
const cardsOf = (m) => (FICHE[m.id] ? FICHE[m.id].cards.map((c, k) => ({ ...c, key: m.id + ':' + k })) : []);
const oralOf = (m) => (FICHE[m.id] ? FICHE[m.id].oral.map((q, k) => ({ q, key: m.id + ':' + k })) : []);
function stars(m) { const s = MS(m.id), n = cardsOf(m).length; return [s.read.length >= n, s.sim >= 0.7, s.check >= 0.8]; }
const totalStars = () => MISSIONS.reduce((a, m) => a + stars(m).filter(Boolean).length, 0);
function grade(xp = S.xp) { let g = GRADES[0], nx = null; for (let i = 0; i < GRADES.length; i++) if (xp >= GRADES[i][0]) { g = GRADES[i]; nx = GRADES[i + 1] || null; } return { name: g[1], from: g[0], to: nx ? nx[0] : null, next: nx ? nx[1] : null }; }
function addXP(n) {
  const before = grade().name; S.xp = Math.round(S.xp + n); save(); updateTop();
  const after = grade().name; if (after !== before) { toast(`🎖️ Promotion : <b>${after}</b> !`, 3200); sfx('star'); confetti(); }
}

// ======================================================================= sons
let AC = null;
function sfx(kind) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [[660, 0], [990, 0.08]], ko: [[180, 0], [140, 0.1]], star: [[523, 0], [659, 0.08], [784, 0.16], [1047, 0.24]], tick: [[880, 0]], bang: [[90, 0], [60, 0.05]] }[kind] || [];
    for (const [f, t] of notes) {
      const o = AC.createOscillator(), g = AC.createGain(); o.type = kind === 'ko' || kind === 'bang' ? 'sawtooth' : 'sine'; o.frequency.value = f;
      const t0 = AC.currentTime + t; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(kind === 'ko' ? 0.08 : 0.14, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g).connect(AC.destination); o.start(t0); o.stop(t0 + 0.25);
    }
  } catch (e) { /* audio indisponible */ }
}
// ======================================================================= confettis et toasts
const cf = $('#fx'), cfx = cf.getContext('2d'); let parts = [];
function confetti(n = 120) {
  const Wd = cf.width = innerWidth * devicePixelRatio, H = cf.height = innerHeight * devicePixelRatio;
  for (let i = 0; i < n; i++) parts.push({ x: Wd / 2, y: H * 0.35, vx: (Math.random() - 0.5) * 18 * devicePixelRatio, vy: (-Math.random() * 16 - 4) * devicePixelRatio, r: (4 + Math.random() * 5) * devicePixelRatio, c: ['#ffc35c', '#5fd6ff', '#62e3a0', '#ff6fc8', '#b48cff', '#fff'][i % 6], a: Math.random() * 6, life: 1 });
  if (parts.length === n) requestAnimationFrame(cfLoop);
}
function cfLoop() {
  cfx.clearRect(0, 0, cf.width, cf.height);
  for (const p of parts) { p.x += p.vx; p.y += p.vy; p.vy += 0.5 * devicePixelRatio; p.vx *= 0.99; p.a += 0.2; p.life -= 0.009; cfx.save(); cfx.globalAlpha = Math.max(0, p.life); cfx.translate(p.x, p.y); cfx.rotate(p.a); cfx.fillStyle = p.c; cfx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cfx.restore(); }
  parts = parts.filter((p) => p.life > 0 && p.y < cf.height + 50);
  if (parts.length) requestAnimationFrame(cfLoop); else cfx.clearRect(0, 0, cf.width, cf.height);
}
let toastT;
function toast(html, ms = 2200) { const t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms); }

// ======================================================================= monde 3D
const canvas = $('#c');
let W;
try { W = createWorld(canvas, { mobile: isMobile }); } catch (e) { $('#err').style.display = 'flex'; throw e; }
let curView = 'home';
function preset(name) { curView = name; applyView(W, name); hidePick(); }
W.preset = preset;

// ======================================================================= mise en page
const panel = $('#panel'), view = $('#view');
function panelRect() { const r = panel.getBoundingClientRect(); return innerWidth > 760 ? { w: r.width + 28, h: 0 } : { w: 0, h: Math.max(0, innerHeight - r.top) }; }
function resize() { const pr = panelRect(); W.resize(innerWidth, innerHeight, pr.w / 2, pr.h / 2); }
addEventListener('resize', resize);
$('#grab').onclick = () => { panel.classList.toggle('min'); setTimeout(resize, 380); };
function updateTop() {
  const g = grade();
  const pct = g.to ? Math.round((S.xp - g.from) / (g.to - g.from) * 100) : 100;
  $('#rank').innerHTML = `<b>${g.name}</b><span>${S.xp} XP</span><i id="xpbar" style="width:${pct}%"></i>`;
  $('#stars').textContent = `⭐ ${totalStars()} / ${NM * 3}`;
  $('#bsound').textContent = S.sound ? '🔊' : '🔇';
}
$('#bsound').onclick = () => { S.sound = !S.sound; save(); updateTop(); if (S.sound) sfx('tick'); };

// ======================================================================= pièces cliquables (explorer)
const pickEl = $('#pick');
function hidePick() { pickEl.classList.remove('on'); }
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const d = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null;
  if (d > 8 || dt > 600) return;
  const r = canvas.getBoundingClientRect(), hit = W.pick(e.clientX - r.left, e.clientY - r.top);
  if (!hit || !INFO[hit.part]) { hidePick(); return; }
  const [t, d2, mid] = INFO[hit.part], m = MISSIONS.find((x) => x.id === mid);
  if (!S.seen[hit.part]) { S.seen[hit.part] = 1; save(); addXP(2); }
  const nSeen = Object.keys(S.seen).length, nAll = Object.keys(INFO).length;
  pickEl.innerHTML = `<b>${esc(t)}</b><p>${esc(d2)}</p><div class="prow">${m && (!curMission || curMission.id !== m.id) ? `<button class="btn sm pri" data-go="${m.id}">${m.icon} Mission : ${esc(m.title)}</button>` : ''}<span class="hint">🔍 ${nSeen}/${nAll} pièces</span><button class="btn sm" id="pclose">✕</button></div>`;
  pickEl.classList.add('on');
  const b = pickEl.querySelector('[data-go]'); if (b) b.onclick = () => { hidePick(); openMission(b.dataset.go); };
  $('#pclose').onclick = hidePick;
  sfx('tick');
});

// ======================================================================= accueil
let curMission = null;
function home() {
  curMission = null; simCleanup(); preset('home');
  const next = MISSIONS.find((m) => stars(m).filter(Boolean).length < 3) || MISSIONS[0];
  const g = grade(), nErr = Object.keys(S.err).length, nSeen = Object.keys(S.seen).length;
  let h = `<div class="hero"><div class="h1">Mission CCM</div><p>Tout le cours cellule, systèmes et moteurs en ${NM} missions, dans un hangar en 3D. Pour chaque mission : <b>lis le briefing</b>, <b>réussis la simu</b>, <b>passe le check</b>. Trois étoiles chacune. Touche les pièces de l'avion pour les découvrir.</p>
    <div class="gradebox"><span>${g.name}</span><div class="bar"><i style="width:${g.to ? Math.round((S.xp - g.from) / (g.to - g.from) * 100) : 100}%"></i></div><small>${g.to ? `${g.to - S.xp} XP avant ${g.next}` : 'Grade maximal atteint'} · 🔍 ${nSeen}/${Object.keys(INFO).length} pièces explorées</small></div>
    <button class="btn pri big" data-go="${next.id}">▶ ${S.xp ? 'Continuer' : 'Commencer'} : ${esc(next.title)}</button></div>`;
  for (const ph of PHASES) {
    h += `<div class="phase" style="--pc:${ph.color}"><div class="ph">${ph.icon} ${ph.name}</div>`;
    for (const m of MISSIONS.filter((x) => x.phase === ph.id)) {
      const st = stars(m), n = MISSIONS.indexOf(m) + 1;
      h += `<button class="mrow" data-go="${m.id}"><span class="num">${n}</span><span class="mi">${m.icon}</span><span class="mt"><b>${esc(m.title)}</b><small>${m.code}</small></span><span class="st">${st.map((x) => `<i class="${x ? 'on' : ''}">★</i>`).join('')}</span></button>`;
    }
    h += '</div>';
  }
  h += `<div class="tools"><button class="btn" data-act="exam">📝 Examen blanc</button><button class="btn" data-act="err" ${nErr ? '' : 'disabled'}>🔁 Mes erreurs (${nErr})</button><button class="btn" data-act="lex">🔤 Lexique</button></div>
    <p class="foot">Sources : cours CCM 021 de la BA701 (cellule, systèmes, électricité, moteur à pistons, turboréacteur) et banque de 417 QCM. Progression enregistrée sur cet appareil.</p>`;
  view.innerHTML = h; $('#ptitle').textContent = 'Carte des missions'; $('#bback').style.visibility = 'hidden';
  view.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => openMission(b.dataset.go));
  view.querySelector('[data-act="exam"]').onclick = exam;
  view.querySelector('[data-act="err"]').onclick = errors;
  view.querySelector('[data-act="lex"]').onclick = lexique;
  view.scrollTop = 0; setHash('');
}
$('#bback').onclick = () => { if (curMission && tab !== 'brief' && !quizRun) setTab('brief'); else home(); };

// ======================================================================= mission
let tab = 'brief', cardIdx = 0, quizRun = null;
function openMission(id, t = 'brief') {
  const m = MISSIONS.find((x) => x.id === id); if (!m) return home();
  curMission = m; quizRun = null; simCleanup(); preset(m.id);
  $('#ptitle').innerHTML = `${m.icon} ${esc(m.title)}`; $('#bback').style.visibility = 'visible';
  cardIdx = 0;
  setTab(t); setHash(m.id);
}
function setHash(h) { try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (e) { /* ignore */ } }
function mhead(m) {
  const st = stars(m);
  const T = (k, n, s) => `<button class="tb ${tab === k ? 'on' : ''}" data-t="${k}">${n} <i class="${s ? 'on' : ''}">★</i></button>`;
  return `<div class="mhead"><div class="code">${m.code} · Mission ${MISSIONS.indexOf(m) + 1}/${NM}</div><p class="pitch">${esc(m.pitch)}</p>
    <div class="tabs">${T('brief', '📖 Briefing', st[0])}${T('sim', '🎮 Simu', st[1])}${T('check', '✅ Check', st[2])}</div></div>`;
}
function setTab(t) {
  tab = t; simCleanup(); quizRun = null;
  if (t === 'brief') { if (curView !== curMission.id) preset(curMission.id); return brief(); }
  if (t === 'sim') return startSim();
  if (t === 'check') { if (curView !== curMission.id) preset(curMission.id); return checkIntro(); }
}
function bindTabs() { view.querySelectorAll('.tabs .tb').forEach((b) => b.onclick = () => setTab(b.dataset.t)); }

// ---------------------------------------------------------------- briefing
function brief() {
  const m = curMission, cards = cardsOf(m), s = MS(m.id), oral = oralOf(m);
  const n = cards.length + 1; cardIdx = Math.max(0, Math.min(cardIdx, n - 1));
  let body;
  if (cardIdx < cards.length) {
    const c = cards[cardIdx];
    if (!s.read.includes(c.key)) { s.read.push(c.key); addXP(5); save(); if (s.read.length >= cards.length) { toast('⭐ Briefing complet !'); sfx('star'); } }
    body = `<div class="card ${c.kind}"><div class="ctop"><span>${esc(m.code)} · ${esc(m.title)}</span><span>${cardIdx + 1} / ${n}</span></div><h3>${c.kind === 'trap' ? '⚠️ ' : ''}${esc(c.t)}</h3><div class="cbody">${c.html}</div></div>`;
  } else {
    body = `<div class="card oral"><div class="ctop"><span>Questions d'exam</span><span>${n} / ${n}</span></div><h3>🎤 Sais-tu répondre ?</h3>
      <p class="hint">Ton contrôle est en questions ouvertes. Réponds à voix haute ou sur une feuille, puis coche si c'est bon. Un doute ? Reviens sur la fiche.</p>
      <div class="oral">${oral.map((o) => `<label><input type="checkbox" data-k="${o.key}" ${s.oral.includes(o.key) ? 'checked' : ''}><span>${esc(o.q)}</span></label>`).join('')}</div>
      <button class="btn pri" id="gosim">Passer à la simu 🎮</button></div>`;
  }
  view.innerHTML = mhead(m) + `<div class="dots">${Array.from({ length: n }, (_, i) => `<i class="${i === cardIdx ? 'on' : (i < cards.length && s.read.includes(cards[i].key)) ? 'done' : ''}" data-i="${i}"></i>`).join('')}</div>` + body
    + `<div class="cnav"><button class="btn" id="cprev" ${cardIdx ? '' : 'disabled'}>◀</button><button class="btn pri" id="cnext">${cardIdx < n - 1 ? 'Suivant ▶' : 'Simu ▶'}</button></div>`;
  bindTabs();
  view.querySelectorAll('.dots i').forEach((d) => d.onclick = () => { cardIdx = +d.dataset.i; brief(); });
  $('#cprev').onclick = () => { cardIdx--; brief(); view.scrollTop = 0; };
  $('#cnext').onclick = () => { if (cardIdx < n - 1) { cardIdx++; brief(); view.scrollTop = 0; } else setTab('sim'); };
  view.querySelectorAll('.oral input').forEach((x) => x.onchange = () => { const k = x.dataset.k; s.oral = s.oral.filter((y) => y !== k); if (x.checked) { s.oral.push(k); addXP(3); } save(); });
  const gs = $('#gosim'); if (gs) gs.onclick = () => setTab('sim');
  let sx = null; const cardEl = view.querySelector('.card');
  if (cardEl) { cardEl.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true }); cardEl.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 70) { if (dx < 0 && cardIdx < n - 1) { cardIdx++; brief(); } else if (dx > 0 && cardIdx > 0) { cardIdx--; brief(); } } }); }
}

// ---------------------------------------------------------------- simulation
let simStop = null;
function simCleanup() { if (simStop) { try { simStop(); } catch (e) { console.error(e); } simStop = null; if (curMission) applyView(W, curMission.id); } }
function startSim() {
  const m = curMission, sim = SIMS[m.sim];
  view.innerHTML = mhead(m) + `<div id="simbox" class="simbox"></div>`; bindTabs();
  if (!sim) { $('#simbox').innerHTML = '<p>Simu en préparation.</p>'; return; }
  preset(m.id);
  const ctx = {
    W, THREE, el: $('#simbox'), mission: m, toast, sfx, confetti, esc, shuffle, isMobile,
    done(score) {
      const s = MS(m.id), prev = s.sim; s.sim = Math.max(s.sim, score); save();
      const gain = Math.round(60 * Math.max(0, score - prev * 0.5)); if (gain > 0) addXP(gain);
      if (score >= 0.7 && prev < 0.7) { sfx('star'); confetti(); toast('⭐ Simu réussie !'); } else if (score >= 0.7) sfx('ok');
      updateTop();
    },
    xp: addXP,
    resize,
    goCheck: () => setTab('check'),
  };
  try { simStop = sim.start(ctx) || null; } catch (e) { console.error(e); $('#simbox').innerHTML = '<p>Oups, la simu a planté.</p>'; }
  view.scrollTop = 0;
}

// ---------------------------------------------------------------- check (QCM)
function poolFor(groups) { return groups.flatMap((g) => (QUIZ[g] || []).map((_, i) => ({ g, i }))); }
function checkIntro() {
  const m = curMission, pool = poolFor(m.quiz), s = MS(m.id);
  view.innerHTML = mhead(m) + `<div class="card"><h3>✅ Check de la mission</h3><p>10 questions tirées parmi les <b>${pool.length}</b> de la mission. Tu as <b>3 vies</b>. Enchaîne les bonnes réponses pour faire monter le <b>combo</b>.</p>
    <p>Meilleur score : <b>${Math.round(s.check * 100)} %</b> · étoile à partir de 80 %.</p><button class="btn pri big" id="go">C'est parti</button></div>`;
  bindTabs();
  $('#go').onclick = () => runQuiz({ title: m.title, items: shuffle(pool).slice(0, 10), lives: 3, onEnd: (r) => { const s2 = MS(m.id); const best = Math.max(s2.check, r.score); const newStar = r.score >= 0.8 && s2.check < 0.8; s2.check = best; save(); if (newStar) { sfx('star'); confetti(); toast('⭐ Check réussi !'); } updateTop(); } });
}
function runQuiz(opt) {
  const items = opt.items; let k = 0, good = 0, lives = opt.lives || 0, combo = 0, answered = false; const missed = [];
  const t0 = performance.now(); let timer = null;
  quizRun = opt;
  function render() {
    if (k >= items.length || (opt.lives && lives <= 0)) return end();
    const it = items[k], q = QUIZ[it.g][it.i];
    const order = shuffle(q[1].map((_, j) => j));
    answered = false;
    view.innerHTML = `<div class="qz"><div class="qtop"><span>${esc(opt.title)}</span><span>${k + 1} / ${items.length}</span></div><div class="qbar"><i style="width:${k / items.length * 100}%"></i></div>
      <div class="qstat">${opt.lives ? `<span class="hearts">${'❤️'.repeat(lives)}${'🖤'.repeat(Math.max(0, opt.lives - lives))}</span>` : ''}${opt.timer ? '<span id="qtime"></span>' : ''}<span class="combo ${combo >= 2 ? 'on' : ''}">🔥 combo ×${Math.min(4, 1 + Math.floor(combo / 2))}</span></div>
      <h3>${esc(q[0])}</h3><div class="opts">${order.map((j) => `<button data-j="${j}">${esc(q[1][j])}</button>`).join('')}</div><div id="qex"></div></div>`;
    view.querySelectorAll('.opts button').forEach((b) => b.onclick = () => answer(+b.dataset.j, q, it));
    if (opt.timer) tickTimer();
    view.scrollTop = 0;
  }
  function tickTimer() { const el = $('#qtime'); if (!el) return; const left = Math.max(0, opt.timer - (performance.now() - t0) / 1000); el.textContent = '⏱ ' + Math.floor(left / 60) + ':' + String(Math.floor(left % 60)).padStart(2, '0'); if (left <= 0) { k = items.length; end(); return; } clearTimeout(timer); timer = setTimeout(tickTimer, 500); }
  function answer(j, q, it) {
    if (answered) return; answered = true;
    const ok = j === q[2], key = it.g + ':' + it.i;
    if (ok) { good++; combo++; const mult = Math.min(4, 1 + Math.floor(combo / 2)); addXP(8 * mult); sfx('ok'); if (S.err[key]) { S.err[key]--; if (S.err[key] <= 0) delete S.err[key]; } }
    else { combo = 0; if (opt.lives) lives--; sfx('ko'); S.err[key] = 2; missed.push(it); }
    save();
    view.querySelectorAll('.opts button').forEach((b) => { const x = +b.dataset.j; if (x === q[2]) b.classList.add('ok'); else if (x === j) b.classList.add('ko'); b.disabled = true; });
    $('#qex').innerHTML = `<div class="expl ${ok ? 'good' : 'bad'}">${ok ? '✅ Exact.' : '❌ Raté. Bonne réponse : <b>' + esc(q[1][q[2]]) + '</b>.'} ${esc(q[3])}</div><button class="btn pri big" id="qn">${k + 1 < items.length && !(opt.lives && lives <= 0) ? 'Suivante ▶' : 'Résultat'}</button>`;
    $('#qn').onclick = () => { k++; render(); };
    $('#qex').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function end() {
    clearTimeout(timer);
    const score = good / items.length, dur = Math.round((performance.now() - t0) / 1000);
    const r = { score, good, n: items.length, dur, missed };
    opt.onEnd && opt.onEnd(r);
    const note = opt.note ? `<div class="note">${(score * 20).toFixed(1).replace('.', ',')} / 20</div>` : '';
    const msg = score >= 0.9 ? 'Excellent, rien à redire.' : score >= 0.8 ? 'Très bien !' : score >= 0.6 ? 'Pas mal. Revois tes erreurs.' : 'Il faut revoir le briefing.';
    view.innerHTML = `<div class="card res"><div class="big">${good} / ${items.length}</div>${note}<p>${msg}</p>${opt.extra ? opt.extra(r) : ''}
      ${missed.length ? `<details><summary>Revoir mes ${missed.length} erreur(s)</summary>${missed.map((it) => { const q = QUIZ[it.g][it.i]; return `<div class="miss"><b>${esc(q[0])}</b><span>✔ ${esc(q[1][q[2]])}</span><small>${esc(q[3])}</small></div>`; }).join('')}</details>` : ''}
      <div class="qbtns"><button class="btn pri" id="qagain">Recommencer</button><button class="btn" id="qback">${curMission ? 'Retour à la mission' : 'Carte'}</button></div></div>`;
    if (score >= 0.8) { confetti(); sfx('star'); }
    $('#qagain').onclick = () => (opt.again ? opt.again() : runQuiz({ ...opt, items: shuffle(items) }));
    $('#qback').onclick = () => { quizRun = null; if (curMission) setTab('check'); else home(); };
    view.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => openMission(b.dataset.go));
  }
  render();
}

// ---------------------------------------------------------------- examen blanc, erreurs
const missionOfChap = (g) => MISSIONS.find((x) => x.quiz.includes(g));
function exam() {
  curMission = null; simCleanup(); preset('home');
  $('#ptitle').textContent = '📝 Examen blanc'; $('#bback').style.visibility = 'visible';
  const best = S.exams.length ? Math.max(...S.exams.map((e) => e.s)) : null;
  view.innerHTML = `<div class="card"><h3>Examen blanc</h3><p><b>30 questions</b> tirées dans tout le cours (les ${NM} missions), <b>25 minutes</b>. Pas de vies, une note sur 20 à la fin et le détail des points à revoir.</p>
    ${best !== null ? `<p>Meilleure note : <b>${(best * 20).toFixed(1).replace('.', ',')} / 20</b> (${S.exams.length} examen${S.exams.length > 1 ? 's' : ''})</p>` : ''}<button class="btn pri big" id="go">Commencer l'examen</button></div>`;
  $('#go').onclick = () => {
    const chaps = Object.keys(QUIZ), per = {}; for (const c of chaps) per[c] = shuffle(QUIZ[c].map((_, i) => ({ g: c, i })));
    const items = []; let r = 0; const order = shuffle(chaps);
    while (items.length < 30) { const it = per[order[r % order.length]].pop(); if (it) items.push(it); r++; }
    runQuiz({ title: 'Examen blanc', items: shuffle(items), timer: 25 * 60, note: true,
      onEnd: (res) => { S.exams.push({ s: res.score, d: Date.now() }); save(); },
      extra: (res) => { const bad = {}; res.missed.forEach((it) => { const m = missionOfChap(it.g); if (m) bad[m.id] = (bad[m.id] || 0) + 1; }); const l = Object.entries(bad).sort((a, b) => b[1] - a[1]); return l.length ? `<div class="weak"><b>À revoir en priorité :</b>${l.map(([id, n]) => { const m = MISSIONS.find((x) => x.id === id); return `<button class="btn sm" data-go="${id}">${m.icon} ${esc(m.title)} (${n})</button>`; }).join('')}</div>` : ''; },
      again: exam });
  };
}
function errors() {
  const keys = Object.keys(S.err); if (!keys.length) return home();
  curMission = null; simCleanup(); $('#ptitle').textContent = '🔁 Mes erreurs'; $('#bback').style.visibility = 'visible';
  const items = shuffle(keys.map((k) => { const [g, i] = k.split(':'); return { g, i: +i }; }).filter((it) => QUIZ[it.g] && QUIZ[it.g][it.i])).slice(0, 15);
  runQuiz({ title: 'Mes erreurs', items, onEnd: () => updateTop(), again: errors });
}
// ---------------------------------------------------------------- lexique
function lexique() {
  curMission = null; simCleanup(); $('#ptitle').textContent = '🔤 Lexique'; $('#bback').style.visibility = 'visible';
  view.innerHTML = `<input id="lq" class="search" placeholder="Chercher un sigle ou un mot (ex. IDG, MZFM, EGT)…" autocomplete="off"><div id="ll" class="lex"></div>`;
  const draw = () => {
    const q = $('#lq').value.trim().toLowerCase();
    const l = LEXIQUE.filter(([a, b, c]) => !q || (a + ' ' + b + ' ' + (c || '')).toLowerCase().includes(q)).sort((x, y) => x[0].localeCompare(y[0], 'fr'));
    $('#ll').innerHTML = l.map(([a, b, c]) => `<div class="lx"><b>${esc(a)}</b><span>${esc(b)}</span>${c ? `<small>${esc(c)}</small>` : ''}</div>`).join('') || '<p class="hint">Rien trouvé.</p>';
  };
  $('#lq').oninput = draw; draw();
}

// ======================================================================= démarrage
function loop() { requestAnimationFrame(loop); W.frame(); }
resize(); updateTop();
const h0 = location.hash.slice(1);
if (h0 && MISSIONS.find((m) => m.id === h0)) openMission(h0); else home();
const qs = new URLSearchParams(location.search);
if (qs.get('tab') && curMission) setTab(qs.get('tab'));
requestAnimationFrame(loop);
setTimeout(() => { $('#loading').style.opacity = 0; setTimeout(() => $('#loading').remove(), 600); }, 400);
window.__CCM = { W, S, openMission, setTab, home };
