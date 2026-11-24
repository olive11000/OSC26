// Simus : attente (3D), approche, circling (3D), situations d'urgence, recherche et sauvetage
import * as THREE from 'three';
import { runScenario, svg, planeTop, arrow, text } from './engine.js';
import { ft, NM, VOR, ALT_HOLD, dirOf, DEG } from './world.js';
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const nb = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const norm = (a) => ((a % 360) + 360) % 360;
const s180 = (a) => { a = norm(a); return a > 180 ? a - 360 : a; };
const h3 = (h) => String(Math.round(norm(h))).padStart(3, '0');
const distr = (pool, ok, n = 3) => { const d = []; const p = pool.filter((x) => x !== ok); while (d.length < n && p.length) d.push(p.splice(Math.floor(Math.random() * p.length), 1)[0]); return d; };

// ======================================================================= ATTENTE (3D)
// side = +1 : virages à droite (standard), -1 : à gauche. phi = side × (cap d'arrivée − axe de rapprochement)
const ENTRIES = ['Directe', 'Parallèle', 'Décalée'];
function entryOf(T, H, side) { const phi = side * s180(H - T); return phi > -70 && phi < 110 ? 'Directe' : phi >= 110 ? 'Décalée' : 'Parallèle'; }
function integ(p0, h0, cmds, r) {
  const pts = [], p = p0.clone(); let h = h0;
  for (const c of cmds) {
    if (c.straight) { const n = Math.max(1, Math.ceil(c.straight / 3)), d = dirOf(h); for (let i = 0; i < n; i++) { p.addScaledVector(d, c.straight / n); pts.push(p.clone()); } continue; }
    const delta = c.by != null ? c.by : norm((c.to - h) * c.turn);
    const n = Math.max(2, Math.ceil(delta / 6)), dh = c.turn * delta / n, chord = 2 * r * Math.sin(Math.abs(dh) * DEG / 2);
    for (let i = 0; i < n; i++) { p.addScaledVector(dirOf(h + dh / 2), chord); h += dh; pts.push(p.clone()); }
  }
  return { pts, p, h: norm(h) };
}
function attenteSim(ctx) {
  const { W } = ctx;
  const F = VOR.clone().setY(ALT_HOLD), Lg = NM(4), r = NM(1.2), SPD = 24;
  let g = null, timer = null, round = null;
  function clear() { clearTimeout(timer); timer = null; if (g) { W.holdGroup.remove(g); g.traverse((o) => { o.geometry && o.geometry.dispose(); }); g = null; } }
  function build(T, side, H, showSectors) {
    clear(); g = new THREE.Group(); W.holdGroup.add(g); W.layers.holding.visible = true;
    const u = dirOf(T), n = new THREE.Vector3(-u.z, 0, u.x).multiplyScalar(side);
    // hippodrome
    const loop = [F.clone()], c1 = F.clone().addScaledVector(n, r);
    for (let i = 1; i <= 12; i++) { const f = i / 12 * Math.PI; loop.push(c1.clone().addScaledVector(n, -r * Math.cos(f)).addScaledVector(u, r * Math.sin(f))); }
    const o0 = F.clone().addScaledVector(n, 2 * r);
    for (let i = 1; i <= 4; i++) loop.push(o0.clone().addScaledVector(u, -Lg * i / 4));
    const c2 = F.clone().addScaledVector(u, -Lg).addScaledVector(n, r);
    for (let i = 1; i <= 12; i++) { const f = i / 12 * Math.PI; loop.push(c2.clone().addScaledVector(n, r * Math.cos(f)).addScaledVector(u, -r * Math.sin(f))); }
    for (let i = 1; i < 4; i++) loop.push(F.clone().addScaledVector(u, -Lg * (1 - i / 4)));
    g.add(W.tube([...loop, F.clone()], 0.45, 0xffc35c, 0.95));
    W.label(g, `Attente main ${side > 0 ? 'droite' : 'gauche'} · axe ${h3(T)}°`, F.clone().addScaledVector(u, -Lg * 0.5).addScaledVector(n, r).add(new THREE.Vector3(0, 9, 0)), { h: 5, color: '#ffe2a3' });
    const fix = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff })); fix.position.copy(F); g.add(fix);
    // secteurs d'entrée
    const B = (phi) => T + 180 + side * phi, R = NM(7.5);
    const fan = (p1, p2, col) => {
      let b1 = B(p1), b2 = B(p2); if (b2 < b1) [b1, b2] = [b2, b1];
      const N = Math.ceil((b2 - b1) / 4), pos = [];
      for (let i = 0; i < N; i++) { const a = dirOf(b1 + (b2 - b1) * i / N), b = dirOf(b1 + (b2 - b1) * (i + 1) / N); pos.push(F.x, F.y - 0.4, F.z, F.x + a.x * R, F.y - 0.4, F.z + a.z * R, F.x + b.x * R, F.y - 0.4, F.z + b.z * R); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false })); m.renderOrder = 1; return m;
    };
    const sec = new THREE.Group(); sec.visible = showSectors; g.add(sec); g.userData.sec = sec;
    sec.add(fan(-70, 110, 0x62e3a0), fan(110, 180, 0xffc35c), fan(-180, -70, 0x5fa8ff));
    for (const [t, p, c] of [['Directe (180°)', 20, '#9ff0c6'], ['Décalée (70°)', 145, '#ffd08a'], ['Parallèle (110°)', -125, '#a9cbff']]) W.label(sec, t, F.clone().addScaledVector(dirOf(B(p)), NM(5.2)).add(new THREE.Vector3(0, 3, 0)), { h: 4.6, color: c });
    for (const p of [-70, 110]) sec.add(W.tube([F.clone(), F.clone().addScaledVector(dirOf(B(p)), R)], 0.22, 0xffffff, 0.75));
    sec.add(W.tube([F.clone(), F.clone().addScaledVector(dirOf(T), R)], 0.18, 0xffffff, 0.4));
    // trajectoire d'arrivée
    const S = F.clone().addScaledVector(dirOf(H), -NM(9));
    g.add(W.tube([S, F.clone().addScaledVector(dirOf(H), -NM(1))], 0.3, 0x5fd6ff, 0.85));
    W.label(g, `Arrivée au cap ${h3(H)}°`, S.clone().add(new THREE.Vector3(0, 6, 0)), { h: 4.6, color: '#9fe6ff' });
    W.flyAlong([S, S.clone().lerp(F, 0.5), F.clone().addScaledVector(dirOf(H), -NM(1.6))], SPD, false);
    const k = innerWidth < 760 ? 1.6 : 1;
    W.camTo(F.clone().add(new THREE.Vector3(0, NM(13) * k, NM(7) * k)).addScaledVector(u, -NM(1.5)), F.clone().addScaledVector(u, -NM(1.5)), 1.2);
    return { T, side, H, u, n, loop, S };
  }
  function flyEntry(rd) {
    const { T, side, H, u, loop } = rd, type = entryOf(T, H, side);
    const pts = [F.clone().addScaledVector(dirOf(H), -NM(3)), F.clone().addScaledVector(dirOf(H), -NM(1.5)), F.clone()];
    let st = { p: F.clone(), h: H };
    const go = (cmds) => { const res = integ(st.p, st.h, cmds, r); pts.push(...res.pts); st = res; };
    if (type === 'Directe') go([{ turn: side, to: T + 180 }, { straight: Lg * 0.9 }, { turn: side, to: T }]);
    if (type === 'Parallèle') go([{ turn: -side, to: T + 180 }, { straight: Lg }, { turn: -side, by: 210 }]);
    if (type === 'Décalée') { const Ho = T + 180 - 30 * side; go([{ turn: s180(Ho - H) >= 0 ? 1 : -1, to: Ho }, { straight: Lg }, { turn: side, to: T }]); }
    // rejoindre l'axe de rapprochement en douceur jusqu'au point
    const p = st.p.clone(), along = F.clone().sub(p).dot(u), q = F.clone().addScaledVector(u, -along), e = p.clone().sub(q);
    for (let k = 1; k <= 14; k++) { const f = k / 14, s = f * f * (3 - 2 * f); pts.push(p.clone().addScaledVector(u, along * f).addScaledVector(e, -s)); }
    let len = 0; for (let i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1]);
    W.flyAlong(pts, SPD, false);
    clearTimeout(timer); timer = setTimeout(() => W.flyAlong(loop, SPD, true), len / SPD * 1000 + 250);
    if (g) g.userData.sec.visible = true;
    return type;
  }
  const ATT = { 'Directe': 'Sur le point, on vire du côté de l’attente et on suit l’hippodrome.', 'Parallèle': 'Sur le point, on vire pour voler parallèlement à l’axe, côté non-attente, pendant 1 min. Puis virage vers le côté attente pour revenir sur le point.', 'Décalée': 'Sur le point, cap à 30° de l’axe d’éloignement, côté attente, pendant 1 min. Puis virage du côté de l’attente pour intercepter le rapprochement.' };
  function entryItem(i) {
    const side = i % 4 === 3 ? -1 : 1, T = pick([340, 340, 160, 70, 250, 20, 200]);
    const type = pick(ENTRIES), rg = { 'Directe': [-56, 96], 'Décalée': [124, 168], 'Parallèle': [-166, -84] }[type];
    const H = norm(T + side * rnd(rg[0], rg[1]));
    return {
      tag: side > 0 ? 'Entrée · main droite' : 'Entrée · main gauche (non standard)',
      qhtml: `Attente au VOR, axe de rapprochement <b>${h3(T)}°</b>, virages <b>à ${side > 0 ? 'droite' : 'gauche'}</b>. Tu arrives sur le point au cap <b>${h3(H)}°</b>. Quelle entrée ?`,
      art: (cx, box) => { round = build(T, side, H, false); box.innerHTML = `<div class="hint" style="padding:9px 12px;margin:0">👀 Regarde la 3D : l’hippodrome (jaune) et ta trajectoire d’arrivée (bleue). Après ta réponse, l’avion fait l’entrée.</div>`; return () => {}; },
      c: ENTRIES, a: ENTRIES.indexOf(type), keep: true,
      whyhtml: `Écart cap d’arrivée / axe : ${Math.round(s180(H - T))}° → secteur <b>${type.toLowerCase()}</b>. ${ATT[type]} Secteurs : directe 180°, parallèle 110°, décalée 70°, séparés par une droite à 70° de l’axe (± 5°).`,
      after: () => { if (round) flyEntry(round); },
    };
  }
  const items = [];
  for (let i = 0; i < 7; i++) items.push(() => entryItem(i));
  const know = [];
  know.push(
    { tag: 'Vitesses', q: 'Vitesse max en attente au FL120, avion de catégorie C ?', c: ['230 kt', '240 kt', '265 kt', '280 kt'], a: 0, why: 'Jusqu’à 14 000 ft : 230 kt (170 kt pour les catégories A et B). En turbulence : 280 kt (170 kt A/B).' },
    { tag: 'Vitesses', q: 'Vitesse max en attente sous 14 000 ft, catégorie A ou B ?', c: ['170 kt', '230 kt', '150 kt', '200 kt'], a: 0, why: 'Catégories A et B : 170 kt sous 14 000 ft, même en turbulence.' },
    { tag: 'Vitesses', q: 'Vitesse max en attente au FL180 ?', c: ['240 kt', '230 kt', '265 kt', 'M 0,83'], a: 0, why: '14 000 à 20 000 ft : 240 kt. 20 000 à 34 000 ft : 265 kt. Au-dessus de 34 000 ft : Mach 0,83.' },
    { tag: 'Vitesses', q: 'Vitesse max en attente au FL300 ?', c: ['265 kt', '240 kt', '280 kt', 'M 0,83'], a: 0, why: '20 000 à 34 000 ft : 265 kt. En turbulence au-dessus de 14 000 ft : 280 kt ou M 0,83, le plus faible des deux.' },
    { tag: 'Vitesses', q: 'Vitesse max en attente au FL370 ?', c: ['M 0,83', '265 kt', '280 kt', 'M 0,80'], a: 0, why: 'Au-dessus de 34 000 ft : Mach 0,83.' },
    { tag: 'Chrono', q: 'Durée de la branche éloignement au FL150 ?', c: ['1 min 30', '1 min', '2 min', '45 s'], a: 0, why: '1 min jusqu’à 14 000 ft inclus, 1 min 30 au-dessus (ou une distance DME).' },
    { tag: 'Pilotage', q: 'Inclinaison en attente ?', c: ['25° ou 3°/s, le moins incliné des deux', '30° ou 3°/s', '20° ou 3°/s', '15°'], a: 0, why: 'Attente et demi-tour : 25° ou 3°/s. Circling : 20° ou 3°/s.' },
    { tag: 'Pile', q: 'Dans une pile d’attente, qui sort en premier ?', c: ['Le plus bas, c’est-à-dire le premier arrivé', 'Le plus haut', 'Le plus lourd', 'Le plus rapide'], a: 0, why: 'Premier arrivé = le plus bas = premier sorti. Utile en cas de panne radio. Un avion par niveau, 1 000 ft entre eux.' },
    { tag: 'Pile', q: 'Tu attends une amélioration météo. Où te place-t-on ?', c: ['En haut de la pile', 'En bas de la pile', 'Hors de l’attente', 'Au milieu'], a: 0, why: 'En haut, pour ne pas gêner ceux qui font l’approche.' },
    { tag: 'EAT', q: 'L’EAT est calculée à partir de quel retard ?', c: ['10 min', '5 min', '30 min', '15 min'], a: 0, why: 'EAT calculée si retard ≥ 10 min, transmise au plus vite si ≥ 30 min, révisée si elle change de 5 min ou plus. ETA = pilote, EAT = ATC.' },
    { tag: 'Protection', q: 'Niveau minimal d’attente (hors montagne) ?', c: ['300 m (984 ft) au-dessus des obstacles', '150 m', '600 m', '1 000 m'], a: 0, why: '300 m (984 ft), 600 m (1 969 ft) en montagne. Zone tampon de 5 NM autour de la zone d’attente.' },
  );
  const stop = runScenario(ctx, { title: 'Hippodrome', icon: '🔁', intro: '<p>Tu arrives sur le VOR. Choisis la bonne entrée : l’avion la vole en 3D après ta réponse. Puis vitesses, chrono et gestion de la pile.</p><p class="hint">Astuce main droite : écart cap/axe entre −70° et +110° → directe ; +110° à 180° → décalée ; −70° à −180° → parallèle.</p>', items: items.concat(ctx.shuffle(know)), n: 15, shuffle: false });
  return () => { stop(); clear(); W.stopFly(); };
}

// ======================================================================= APPROCHE
const PROF = { IAF: [34, 40], IF: [118, 70], FAF: [196, 100], MDA: [252, 150], MAPt: [292, 150], THR: [308, 176] };
function profArt(hl, seg) {
  const P = PROF, pt = (k, lab) => { const [x, y] = P[k], on = hl === k; return `<circle cx="${x}" cy="${y}" r="${on ? 7 : 5}" fill="${on ? '#ffd65a' : '#eaf0fb'}" ${on ? 'class="blink"' : ''}/>${text(x, y - 11, on ? '?' : lab, { s: 12, c: on ? '#ffd65a' : '#cfd8ea' })}`; };
  const sg = (d, k, col) => `<path d="${d}" stroke="${seg === k ? '#ffd65a' : col}" stroke-width="${seg === k ? 6 : 3}" fill="none" stroke-linecap="round" ${seg === k ? 'class="blink"' : ''}/>`;
  return svg(340, 200, `<rect x="0" y="178" width="340" height="22" fill="#2a3a24"/><rect x="292" y="175" width="48" height="5" fill="#3c4048"/>
    <line x1="210" y1="150" x2="330" y2="150" stroke="rgba(255,255,255,.25)" stroke-dasharray="3 4"/>${text(222, 145, 'MDA', { s: 10, c: '#93a1bd' })}
    ${sg('M0,22 L34,40', 'arr', '#93a1bd')}${sg('M34,40 L118,70', 'ini', '#5fd6ff')}${sg('M118,70 L196,100', 'int', '#62e3a0')}${sg('M196,100 L252,150 L292,150', 'fin', '#ffc35c')}${sg('M292,150 C306,142 322,112 338,78', 'mis', '#ff6a4d')}
    ${pt('IAF', 'IAF')}${pt('IF', 'IF')}${pt('FAF', 'FAF')}${pt('MAPt', 'MAPt')}`);
}
const PTS = ['IAF', 'IF', 'FAF', 'MAPt'], SEGS = ['Arrivée', 'Initial', 'Intermédiaire', 'Final', 'Approche interrompue'];
const CAT = [['A', 0, 90], ['B', 91, 120], ['C', 121, 140], ['D', 141, 165], ['E', 166, 210]];
function approcheItems() {
  const L = [];
  for (const k of PTS) L.push({ tag: 'Profil', q: 'Comment s’appelle le point qui clignote ?', art: profArt(k), c: PTS, a: PTS.indexOf(k), keep: true, why: 'IAF → (initial) → IF → (intermédiaire) → FAF → (final) → MAPt, puis approche interrompue. En 3D : FAP et DA au lieu de FAF et MAPt/MDA.' });
  const MOCS = ['1 000 ft (2 000 ft en montagne)', '500 ft (150 m)', '246 ft (75 m) avec FAF', '164 ft (50 m)'];
  L.push({ tag: 'Marges', q: 'MOC du segment en surbrillance ?', art: profArt(null, 'ini'), c: MOCS, a: 0, keep: true, why: 'Arrivée et initial : 1 000 ft (2 000 en montagne). Intermédiaire : 500 ft. Final 2D : 246 ft avec FAF, 295 ft sans. Interrompue : 164 ft (50 m).' });
  L.push({ tag: 'Marges', q: 'MOC du segment en surbrillance ?', art: profArt(null, 'int'), c: MOCS, a: 1, keep: true, why: 'Intermédiaire (IF → FAF) : 500 ft (150 m). On y configure l’avion, 30 s recommandées.' });
  L.push({ tag: 'Marges', q: 'MOC du segment final 2D en surbrillance (il y a un FAF) ?', art: profArt(null, 'fin'), c: MOCS, a: 2, keep: true, why: 'Final 2D : 246 ft (75 m) avec FAF, 295 ft (90 m) sans FAF.' });
  L.push({ tag: 'Marges', q: 'Marge de l’approche interrompue (phase intermédiaire) ?', art: profArt(null, 'mis'), c: MOCS, a: 3, keep: true, why: 'Interrompue : initiale (pas de virage) → intermédiaire, jusqu’à 50 m (164 ft) de marge, pente 2,5 %, 15° max → finale, virages autorisés.' });
  for (let i = 0; i < 3; i++) L.push(() => { const c = pick(CAT), v = ri(Math.max(70, c[1]), c[2]); return { tag: 'Catégories', q: `Vat de ton avion : ${v} kt. Catégorie ?`, c: CAT.map((x) => 'Catégorie ' + x[0]), a: CAT.indexOf(c), keep: true, why: 'Selon la Vat (vitesse au seuil) : A < 91 kt, B 91-120, C 121-140, D 141-165, E 166-210.' }; });
  const ILS = [['CAT I', 'DH 220 ft, RVR 600 m'], ['CAT II', 'DH 150 ft, RVR 400 m'], ['CAT IIIA', 'DH 80 ft, RVR 250 m'], ['CAT IIIB', 'DH 40 ft, RVR 100 m'], ['CAT IIIC', 'ni DH, ni RVR']];
  for (let i = 0; i < 2; i++) L.push(() => { const [c, m] = pick(ILS); return { tag: 'ILS', q: `Minima : ${m}. Quelle catégorie d’ILS ?`, c: ILS.map((x) => x[0]), a: ILS.findIndex((x) => x[0] === c), keep: true, why: 'CAT I : DH ≥ 200 ft, RVR ≥ 550 m. CAT II : 100-200 ft, ≥ 350 m. CAT IIIA : < 100 ft, ≥ 200 m. CAT IIIB : < 50 ft, ≥ 50 m (75 m EASA). CAT IIIC : rien.' }; });
  L.push({ tag: '2D / 3D', q: 'Une approche VOR, c’est…', c: ['Une approche 2D (NPA) : FAF, MAPt, MDA', 'Une approche 3D (PA) : FAP, DA', 'Une approche à vue', 'Une approche de précision'], a: 0, why: '2D = guidage latéral : VOR, NDB, LOC, LNAV. 3D = latéral + vertical : ILS, PAR, GBAS.' });
  L.push({ tag: 'Clairances', q: 'La clairance d’arrivée t’autorise jusqu’à…', c: ['L’IAF', 'Le FAF', 'Le seuil', 'Le MAPt'], a: 0, why: 'Clairance d’arrivée jusqu’à l’IAF. Ensuite il faut une clairance d’approche, sinon attente sur l’IAF.' });
  L.push({ tag: 'MSA', q: 'La MSA est calculée sur quel rayon autour de la balise ?', c: ['25 NM (+ 5 NM de zone tampon)', '10 NM', '30 NM sans tampon', '50 NM'], a: 0, why: '25 NM, 1 000 ft au-dessus de l’obstacle le plus haut du secteur, arrondie aux 100 ft supérieurs.' });
  L.push({ tag: 'Pente', q: 'Pente optimale de l’approche finale ?', c: ['3°', '2,5°', '3,5°', '5°'], a: 0, why: '2,5° mini, 3° optimum ; 3,8° maxi en 2D selon le cours, 3,5° en 3D.' });
  L.push({ tag: 'Initial', q: 'Approche 3D : on rejoint directement le segment initial si l’écart de route est au plus de…', c: ['90°', '120°', '30°', '45°'], a: 0, why: '≤ 90° en approche 3D, ≤ 120° en 2D. Sinon demi-tour : 45°/180°, 80°/260°, virage de base ou hippodrome.' });
  L.push({ tag: 'Demi-tour', q: 'Taux de descente max pendant le demi-tour, branche éloignement, catégorie A/B ?', c: ['245 m/min (804 ft)', '365 m/min (1 197 ft)', '150 m/min (492 ft)', '230 m/min (755 ft)'], a: 0, why: 'Éloignement : A/B 245 m (804 ft), C/D/E 365 m (1 197 ft). Rapprochement : A/B 150 m (492 ft), C/D/E 230 m (755 ft).' });
  L.push({ tag: 'RNAV', q: 'LPV : d’où vient le guidage vertical ?', c: ['Du SBAS', 'Du Baro-VNAV', 'De l’ILS', 'Du radar PAR'], a: 0, why: 'LNAV : 2D. LNAV/VNAV : vertical Baro-VNAV (calage critique). LPV : vertical SBAS.' });
  return L;
}

// ======================================================================= CIRCLING (3D + vue de dessus)
const CIRC = { A: { moc: 295, och: 394, R: 30, v: 100 }, B: { moc: 295, och: 492, R: 40, v: 135 }, C: { moc: 394, och: 591, R: 56, v: 180 }, D: { moc: 394, och: 689, R: 70, v: 205 }, E: { moc: 492, och: 787, R: 84, v: 240 } };
function circArt(cat, obs) {
  const R = CIRC[cat].R, X = 170, y1 = 62, y2 = 158;
  return svg(340, 220, `<rect width="340" height="220" fill="#1a2a1c"/>
    <path d="M${X - R},${y1} A${R},${R} 0 0 1 ${X + R},${y1} L${X + R},${y2} A${R},${R} 0 0 1 ${X - R},${y2} Z" fill="rgba(95,214,255,.13)" stroke="#5fd6ff" stroke-width="2" stroke-dasharray="6 4"/>
    <rect x="${X - 4}" y="${y1}" width="8" height="${y2 - y1}" fill="#3c4048"/>${text(X + 14, y1 + 6, '16', { s: 11 })}${text(X + 14, y2 + 2, '34', { s: 11 })}
    <circle cx="${X}" cy="${y1}" r="2.5" fill="#62e3a0"/><circle cx="${X}" cy="${y2}" r="2.5" fill="#62e3a0"/>
    ${obs.map((o) => `<path d="M${o.x - 8},${o.y + 7} L${o.x},${o.y - 9} L${o.x + 8},${o.y + 7} Z" fill="${o.in ? '#ff8a5c' : '#8a8f9a'}"/>${text(o.x, o.y + 21, o.h + ' ft', { s: 11, c: o.in ? '#ffc3a6' : '#b8bfcc' })}`).join('')}
    <rect x="8" y="8" width="116" height="24" rx="12" fill="rgba(8,14,28,.7)"/>${text(66, 25, 'Catégorie ' + cat, { s: 13 })}
    ${text(330, 212, 'zone de circling', { s: 11, c: '#9fe6ff', a: 'end', w: 500 })}`);
}
function circItem() {
  const cat = pick(['A', 'B', 'C', 'D', 'E']), C = CIRC[cat], R = C.R, X = 170, y1 = 62, y2 = 158;
  const inside = (x, y) => { const yy = Math.max(y1, Math.min(y2, y)); return Math.hypot(x - X, y - yy) < R - 6; };
  const obs = [];
  let guard = 0;
  while (obs.length < 4 && guard++ < 400) {
    const want = obs.length < 2 ? true : obs.length === 2 ? false : Math.random() < 0.5;
    const x = rnd(20, 320), y = rnd(30, 196); if (Math.abs(x - X) < 14) continue;
    const isIn = inside(x, y); if (isIn !== want) continue; if (!isIn && Math.hypot(x - X, Math.max(y1, Math.min(y2, y)) - y) < R + 10) continue;
    if (obs.some((o) => Math.hypot(o.x - x, o.y - y) < 34)) continue;
    obs.push({ x, y, in: isIn, h: 0 });
  }
  if (!obs.some((o) => o.in)) obs.push({ x: X + R * 0.62, y: (y1 + y2) / 2, in: true, h: 0 });
  if (!obs.some((o) => !o.in)) obs.push({ x: Math.min(322, X + R + 36), y: 196, in: false, h: 0 });
  const ins = obs.filter((o) => o.in), outs = obs.filter((o) => !o.in);
  ins.forEach((o) => { o.h = ri(4, 40) * 10; });
  const maxIn = Math.max(...ins.map((o) => o.h));
  outs.forEach((o, i) => { o.h = i === 0 ? maxIn + ri(10, 30) * 10 : ri(4, 40) * 10; });
  const ok = Math.max(maxIn + C.moc, C.och), maxOut = Math.max(...outs.map((o) => o.h));
  const cands = [...new Set([ok, maxOut + C.moc, maxIn, C.och === ok ? maxIn + C.moc : C.och, maxIn + (C.moc === 295 ? 394 : 295)])].filter((x) => x !== ok).slice(0, 3);
  for (let k = 1; cands.length < 3; k++) if (!cands.includes(ok + 100 * k)) cands.push(ok + 100 * k);
  return { tag: 'OCH', q: `Catégorie ${cat}. Les obstacles sont cotés au-dessus du seuil. Quelle OCH de circling ?`, art: circArt(cat, obs), c: [ok, ...cands].map((x) => nb(x) + ' ft'), a: 0, why: `Seuls les obstacles DANS la zone comptent (le plus haut : ${maxIn} ft). OCH = ${maxIn} + MOC ${C.moc} ft = ${maxIn + C.moc} ft, mais jamais sous l’OCH mini de la catégorie ${cat} (${C.och} ft) → ${nb(ok)} ft.` };
}
function circlingSim(ctx) {
  const { W } = ctx;
  W.ad.updateMatrixWorld(true);
  const Lp = (x, z, y) => W.ad.localToWorld(new THREE.Vector3(x, y, z));
  const path = [Lp(0, 75, ft(1500)), Lp(0, 48, ft(1000)), Lp(0, 30, ft(620)), Lp(2.5, 21, ft(600)), Lp(6.5, 12, ft(600)), Lp(8, 1, ft(600)), Lp(8, -14, ft(600)), Lp(7.4, -21.5, ft(600)), Lp(5.4, -26.5, ft(560)), Lp(2.4, -28.6, ft(470)), Lp(0.3, -27, ft(380)), Lp(0, -22, ft(180)), Lp(0, -16, ft(40)), Lp(0, -11, 0.18), Lp(0, -3, 0.15)];
  let len = 0; for (let i = 1; i < path.length; i++) len += path[i].distanceTo(path[i - 1]);
  const SPD = 7, fly = () => W.flyAlong(path, SPD, false);
  W.camTo(Lp(-20, 24, 36), Lp(3, -6, 0), 1.4); fly();
  const iv = setInterval(fly, (len / SPD + 2.5) * 1000);
  const items = [];
  for (let i = 0; i < 5; i++) items.push(circItem);
  items.push(
    { tag: 'Descente', q: 'Quand peux-tu descendre sous la MDA en circling ?', c: ['Seuil en vue, marge maintenue en position d’atterrir, références visuelles acquises et gardées', 'Dès que tu vois le sol', 'Dès que tu passes le seuil', 'Sur ordre de la tour seulement'], a: 0, why: 'Les 3 conditions : seuil en vue ; marge d’obstacles maintenue et avion en position d’atterrir ; références visuelles (piste ou balisage) acquises et gardées.' },
    { tag: 'Perte de vue', q: 'Tu perds les références visuelles en circling. Tu…', c: ['Vires en montée vers la piste, rejoins la verticale, puis suis l’interrompue publiée', 'Vires vers l’extérieur et montes', 'Continues en descente', 'Fais un 360° pour retrouver la piste'], a: 0, why: 'On vire vers la piste, pas vers l’extérieur. Puis verticale du terrain et procédure d’approche interrompue publiée.' },
    { tag: 'Pilotage', q: 'Inclinaison prise en compte pour la zone de circling ?', c: ['20° ou 3°/s, le moins incliné', '25° ou 3°/s', '30°', '15°'], a: 0, why: 'Circling 20°, avec un vent de 25 kt. Attente et demi-tour : 25°.' },
    { tag: 'MOC', q: 'MOC de circling pour un avion de catégorie D ?', c: ['394 ft (120 m)', '295 ft (90 m)', '492 ft (150 m)', '689 ft (210 m)'], a: 0, why: 'MOC : 295 ft (A, B), 394 ft (C, D), 492 ft (E). OCH mini : 394 / 492 / 591 / 689 / 787 ft.' },
    { tag: 'Vitesses', q: 'Vitesse max en circling, catégorie C ?', c: ['180 kt', '135 kt', '205 kt', '240 kt'], a: 0, why: 'Circling max : A 100 kt, B 135, C 180, D 205, E 240.' },
    { tag: 'VPT', q: 'Une VPT, c’est…', c: ['Une trajectoire à vue imposée, en plus de la zone de circling', 'Une approche de précision', 'Un point de visée', 'Une vitesse de virage'], a: 0, why: 'Visual Prescribed Track, sur les terrains difficiles. Ex. Ajaccio : approche aux instruments en 02 seulement, VPT pour atterrir en 20.' },
    { tag: 'Décollage', q: 'Norme particulière, carte blanche : minima de décollage ?', c: ['VIS/RVR ≥ 1 600 m, plafond ≥ 300 ft', 'VIS/RVR ≥ 600 m, plafond ≥ 100 ft', 'RVR ≥ 400 m', 'Minima d’atterrissage'], a: 0, why: 'Carte blanche : 1 600 m / 300 ft. Carte verte : 600 m / 100 ft. Norme standard : minima de décollage = minima d’atterrissage. Civil : RVR 400 m.' },
    { tag: 'Dégagement', q: 'REAF, norme standard : combien de possibilités d’atterrissage ?', c: ['2, au départ comme à destination', '1 seule', '3', 'Aucune obligation'], a: 0, why: '2 possibilités, dégagement militaire si possible, à 30 min de vol. Norme particulière : 1 seule suffit. CPMRA : au moins une possibilité.' },
  );
  const stop = runScenario(ctx, { title: 'Circling', icon: '🌀', intro: '<p>L’avion fait un ILS 34 puis tourne à vue pour atterrir en 16 (regarde la 3D). À toi : calcule l’OCH et connais les règles de la MVL.</p>', items, n: 11 });
  return () => { stop(); clearInterval(iv); W.stopFly(); };
}

// ======================================================================= SITUATIONS D'URGENCE
function urgenceItems() {
  const chain = [
    { tag: 'Panne radio · 1', q: 'Plus personne ne te répond. Première chose ?', c: ['Vérifier : radio allumée, volume, casque, fréquence, station à portée', 'Afficher 7600 tout de suite', 'Faire demi-tour', 'Déclarer MAYDAY'], a: 0, why: 'D’abord les vérifications, puis 2 ou 3 essais, puis d’autres stations. Seulement ensuite : 7600.' },
    { tag: 'Panne radio · 2', q: 'Rien n’y fait, même sur d’autres stations. Tu…', c: ['Affiches 7600 et émets tes messages deux fois, « transmitting blind »', 'Affiches 7700', 'Coupes ton transpondeur', 'Montes au niveau supérieur'], a: 0, why: '7600 (IFR militaire : 7601), CPDLC si possible, messages émis deux fois avec « transmitting blind ».' },
    { tag: 'Panne radio · 3', q: 'Tu entends le trafic mais personne ne t’entend. Tu es en VMC. Tu…', c: ['Restes VMC et atterris sur le terrain convenable le plus proche', 'Continues ton plan de vol en IMC', 'Gardes ton niveau 20 min', 'Attends sur l’IAF'], a: 0, why: 'En VMC (panne d’émetteur ou de récepteur) : rester VMC et atterrir au plus proche convenable.' },
    { tag: 'Panne radio · 4', q: 'Panne de récepteur en IMC, hors radar. Que fais-tu de ton niveau et de ta vitesse ?', c: ['Je les garde 20 min, puis je suis le plan de vol déposé', 'Je les garde 7 min, puis le plan de vol', 'Je descends immédiatement', 'Je monte au niveau le plus haut'], a: 0, why: '20 min (7 min sous service radar), puis le plan de vol déposé jusqu’à destination.' },
    { tag: 'Panne radio · 5', q: 'Tu arrives à destination, toujours sans radio, en IMC. Tu…', c: ['Attends sur l’IAF au niveau le plus haut publié jusqu’à la dernière EAT (ou l’ETA), puis approche, atterrissage dans les 30 min', 'Commences l’approche dès l’arrivée', 'Vas au dégagement directement', 'Attends au niveau le plus bas'], a: 0, why: 'Attente IAF, niveau le plus haut publié, jusqu’à la dernière EAT accusée (sinon ETA). Approche publiée panne radio. Atterrir si possible dans les 30 min. Prévenir l’ATC après l’atterrissage.' },
  ];
  const rest = [
    { tag: 'Signaux', q: 'Panne radio, en tour de piste : la tour t’envoie du rouge et du vert alternés. Ça veut dire…', c: ['Extrême prudence', 'Autorisé à atterrir', 'N’atterrissez pas', 'Revenez au parking'], a: 0, why: 'Les signaux lumineux de la tour s’appliquent. En plus : rouge et vert alternés = extrême prudence.' },
    { tag: 'Transpondeur', q: 'Transpondeur en panne avant le départ, espace contrôlé prévu. Tu…', c: ['Préviens l’ATC : le vol peut être annulé', 'Pars quand même', 'Affiches 7600', 'Changes de plan de vol en VFR'], a: 0, why: 'Avant le vol : prévenir l’ATC, vol possiblement annulé (ou autorisé à rejoindre le terrain le plus proche pour réparer). Après le 1er transfert : l’ATC peut refuser la suite.' },
    { tag: 'Détournement', q: 'Détournement, tu ne peux pas le signaler à la radio. Que fais-tu ?', c: ['Afficher 7500 et voler à un niveau décalé de 500 ft (ou 1 000 ft)', 'Afficher 7600', 'Faire des battements d’ailes', 'Couper le transpondeur'], a: 0, why: '7500 (et 7700). Sinon, niveau décalé de 500 ft (ou 1 000 ft) par rapport aux niveaux IFR normaux.' },
    { tag: 'MAYDAY', q: 'Dans quel ordre ton message de détresse ?', c: ['MAYDAY ×3, organisme, indicatif, nature, intentions, position-niveau-cap', 'Indicatif, MAYDAY, position, nature', 'MAYDAY ×1, position, intentions', 'Organisme, MAYDAY ×3, cap, niveau'], a: 0, why: 'Sur la fréquence en cours, ou 121,5 / 243,0 MHz. Transpondeur 7700, CPDLC, mode urgence ADS-B.' },
    { tag: 'MAYDAY', q: 'L’ATS veut imposer le silence radio aux autres. Il dit…', c: ['« Stop transmitting Mayday »', '« Cancel Mayday »', '« Distress traffic ended »', '« Roger Mayday »'], a: 0, why: '« Roger Mayday » : accusé de réception. « Stop transmitting Mayday » : silence. Le pilote : « Cancel Mayday ». L’ATS : « Distress traffic ended ».' },
    { tag: 'PAN PAN', q: 'Un passager fait un malaise grave, l’avion n’est pas en danger. Tu annonces…', c: ['PAN PAN MEDICAL', 'MAYDAY MEDICAL', 'PAN PAN ×1', 'Rien, tu continues'], a: 0, why: 'Urgence = sécurité de l’avion ou d’une personne, sans besoin d’aide immédiate. PAN PAN ×3 ; PAN PAN MEDICAL pour un transport sanitaire.' },
    { tag: 'Vidange', q: 'Vidange de carburant : séparation des autres avions ?', c: ['10 NM latéral, 1 000 ft au-dessus, 3 000 ft en dessous', '5 NM, 1 000 ft partout', '10 NM, 3 000 ft au-dessus, 1 000 ft en dessous', '3 NM, 500 ft'], a: 0, why: 'Le carburant descend : 3 000 ft en dessous. Hauteur minimale : 6 000 ft.' },
    { tag: 'Radar', q: 'Panne radar ATS : en attendant la séparation aux procédures, l’ATS peut séparer les avions de…', c: ['La moitié de la séparation verticale normale', 'La séparation normale doublée', '5 NM', 'Rien, il arrête tout'], a: 0, why: 'L’ATS reporte les positions, passe aux procédures, et peut temporairement utiliser la moitié de la séparation verticale.' },
    { tag: 'Égaré', q: 'Un avion est égaré. L’ATS…', c: ['Essaie de le contacter, cherche sa position, prévient les centres voisins et les militaires, puis lui donne sa position et la correction', 'Attend qu’il se signale', 'Déclenche DETRESFA immédiatement', 'Lui fait afficher 7500'], a: 0, why: 'Tous les moyens pour le localiser, puis position et correction à faire.' },
    { tag: 'Indicatif', q: 'Deux indicatifs se ressemblent trop. L’ATC peut…', c: ['Faire changer temporairement l’un d’eux, dans l’espace concerné', 'Refuser un des deux vols', 'Imposer un nouveau plan de vol', 'Rien'], a: 0, why: 'Changement temporaire, retour à l’indicatif du plan de vol avant le transfert.' },
    { tag: 'ELT', q: 'Une balise ELT émet sur…', c: ['121,5 et 406 MHz (243 MHz autorisé)', '123,1 MHz', '118,0 MHz', '2 182 kHz seulement'], a: 0, why: 'ELT : 121,5 et 406 MHz (détection satellite COSPAS-SARSAT).' },
  ];
  return { chain, rest };
}

// ======================================================================= RECHERCHE ET SAUVETAGE
const GROUND = [['V', 'Besoin d’assistance'], ['X', 'Besoin d’assistance médicale'], ['N', 'Non (négatif)'], ['Y', 'Oui (affirmatif)'], ['↑', 'Nous partons dans cette direction']];
const RESCUE = [['LLL', 'Opération terminée'], ['LL', 'Nous avons retrouvé tout le monde'], ['++', 'Nous n’avons retrouvé qu’une partie des personnes'], ['XX', 'Impossible de continuer, retour à la base'], ['NN', 'Rien trouvé, nous continuons les recherches']];
const signArt = (sym, who) => svg(340, 170, `<rect width="340" height="170" fill="#c9b88a"/>${Array.from({ length: 40 }, () => `<circle cx="${rnd(0, 340)}" cy="${rnd(0, 170)}" r="${rnd(1, 4)}" fill="#b3a173"/>`).join('')}
  <text x="170" y="${sym === '↑' ? 128 : 118}" text-anchor="middle" font-size="${sym.length > 2 ? 70 : 92}" font-weight="900" fill="#ffffff" stroke="#8f7f55" stroke-width="2" font-family="Arial Black,Arial,sans-serif" letter-spacing="10">${sym}</text>
  <rect x="8" y="8" width="${who.length * 7 + 20}" height="22" rx="11" fill="rgba(8,14,28,.72)"/>${text(18, 23, who, { s: 12, a: 'start' })}`, '#c9b88a');
const COLS = [['#d63a2f', 'Rouge', 'Matériel médical'], ['#2f6fd6', 'Bleu', 'Eau et nourriture'], ['#e8c21b', 'Jaune', 'Couvertures et vêtements'], ['#222', 'Noir', 'Matériel divers']];
const boxArt = (col) => svg(340, 150, `<rect width="340" height="150" fill="#5b88c6"/><path d="M130,30 Q170,-10 210,30" fill="#eee" stroke="#ccc"/><line x1="133" y1="30" x2="160" y2="78" stroke="#ddd"/><line x1="207" y1="30" x2="180" y2="78" stroke="#ddd"/><rect x="150" y="78" width="40" height="42" rx="4" fill="${col}" stroke="#fff" stroke-width="2"/>${text(170, 140, 'Conteneur largué', { s: 12, c: '#eaf0fb' })}`, '#5b88c6');
const PH = ['INCERFA', 'ALERFA', 'DETRESFA'];
function sarItems() {
  const L = [];
  for (let i = 0; i < 3; i++) L.push(() => { const [s, m] = pick(GROUND); return { tag: 'Signaux des survivants', q: 'Les survivants ont tracé ce signal au sol. Ça veut dire…', art: signArt(s, 'Vu du ciel · signal des survivants'), c: [m, ...distr(GROUND.map((x) => x[1]), m)], a: 0, why: 'Survivants : V = assistance, X = assistance médicale, N = non, Y = oui, ↑ = nous partons dans cette direction.' }; });
  for (let i = 0; i < 2; i++) L.push(() => { const [s, m] = pick(RESCUE); return { tag: 'Signaux des sauveteurs', q: 'Les équipes de secours au sol ont tracé ce signal. Ça veut dire…', art: signArt(s, 'Signal des équipes de secours'), c: [m, ...distr(RESCUE.map((x) => x[1]), m)], a: 0, why: 'Sauveteurs : LLL terminé, LL tout le monde retrouvé, ++ une partie seulement, XX impossible de continuer / retour, NN rien trouvé / on continue, flèches séparées = scindés en deux groupes.' }; });
  L.push(() => { const [c, n, m] = pick(COLS); return { tag: 'Conteneurs', q: `Un conteneur ${n.toLowerCase()} est largué. Il contient…`, art: boxArt(c), c: [m, ...distr(COLS.map((x) => x[2]), m)], a: 0, why: 'Rouge = médical, bleu = eau et nourriture, jaune = couvertures et vêtements, noir = matériel divers.' }; });
  const P = [
    ['Un avion lance un MAYDAY (ou affiche 7700).', 'DETRESFA à H+5'],
    ['Un avion annonce PAN PAN.', 'ALERFA à H+5'],
    ['Un avion affiche 7500.', 'ALERFA à H+5'],
    ['On perd le contact radio ET radar avec un avion.', 'ALERFA à H+5, puis DETRESFA à H+10'],
    ['On perd le contact radio avec un avion au départ d’un aérodrome.', 'INCERFA à H+10, ALERFA à H+20, DETRESFA à H+30'],
  ];
  const PO = [...new Set(P.map((x) => x[1]).concat(['INCERFA à H+30', 'DETRESFA à H+30', 'ALERFA à H+10']))];
  for (let i = 0; i < 3; i++) L.push(() => { const [s, ok] = pick(P); return { tag: 'Phases d’alerte', q: `${s} Quelle(s) phase(s), et quand ?`, c: [ok, ...distr(PO, ok)], a: 0, why: 'Slide du cours : MAYDAY/7700 → DETRESFA H+5. PAN PAN → ALERFA H+5. 7500 → ALERFA H+5. Perte radio et radar → ALERFA H+5, DETRESFA H+10. Perte radio au départ → INCERFA H+10, ALERFA H+20, DETRESFA H+30.' }; });
  L.push({ tag: 'Phases', q: '« Inquiétude pour la sécurité de l’avion et de ses occupants » : c’est…', c: PH, a: 1, keep: true, why: 'INCERFA = doute. ALERFA = inquiétude. DETRESFA = danger grave et imminent, aide immédiate.' });
  L.push({ tag: 'Organisation', q: 'Combien de RCC en France, et où ?', c: ['1, à Lyon Mont-Verdun (Air)', '3 : Cherbourg, Brest, Toulon', '5, un par CRNA', '2 : Lyon et Brest'], a: 0, why: '1 RCC (Lyon, Armée de l’Air et de l’Espace) et 3 centres secondaires Marine : Cherbourg, Brest, Toulon.' });
  L.push({ tag: 'Organisation', q: 'Délai d’alerte des moyens SAR hors heures ouvrables ?', c: ['2 h', '1 h', '30 min', '15 min'], a: 0, why: '1 h aux heures ouvrables, 2 h en dehors.' });
  L.push({ tag: 'Fréquences', q: 'Fréquence du RCC ?', c: ['123,1 MHz', '121,5 MHz', '243,0 MHz', '406 MHz'], a: 0, why: 'Détresse : 121,5 / 243,0 MHz et 2 182 kHz. ELT : 406 MHz. RCC : 123,1 MHz.' });
  L.push({ tag: 'Accusé', q: 'De nuit, comment accuser réception d’un signal au sol ?', c: ['Allumer et éteindre deux fois les phares ou feux de navigation', 'Battements d’ailes', 'Faire un 360°', 'Larguer une fusée verte'], a: 0, why: 'De jour : battements d’ailes. De nuit : phares ou feux de navigation allumés et éteints deux fois.' });
  L.push({ tag: 'Pilote non SAR', q: 'Tu captes un signal de détresse. Tu…', c: ['Notes position et relèvement, préviens l’ATS, y vas si on te le demande', 'Continues ta route', 'Descends pour chercher seul', 'Coupes ta radio'], a: 0, why: 'Tu dois accepter d’y aller si on te le demande, sauf si la sécurité de ton vol l’interdit (carburant, météo).' });
  L.push({ tag: 'Pilote non SAR', q: 'Tu vois un navire en détresse. Que transmets-tu au RCC ou à l’ATS ?', c: ['Type, identification, état, position, heure UTC, nombre de personnes, observations', 'Seulement la position', 'Seulement ton indicatif', 'Rien, tu le gardes en vue'], a: 0, why: 'Et tu le gardes en vue tant que ta présence est utile.' });
  L.push({ tag: 'Moyens', q: 'Combien d’hélicoptères a la Gendarmerie ?', c: ['56', '15', '26', '120'], a: 0, why: '56 hélicoptères : 15 EC145, 15 EC135, 26 AS350. Air : Puma (Solenzara), Caracal (Cazaux, 250 NM en mer), Fennec. Marine : Falcon 50, Falcon 200 Gardian, Caïman, H160 / Dauphin, Panther.' });
  return L;
}

export const SIMS_C = {
  attente: { start: attenteSim },
  approche: { start: (ctx) => runScenario(ctx, { title: 'Profil d’approche', icon: '🛬', intro: '<p>L’avion vole l’approche ILS 34 dans la 3D. Reconnais les points et les segments, leurs marges, les catégories d’avions et d’ILS.</p>', items: approcheItems(), n: 14 }) },
  circling: { start: circlingSim },
  urgence: { start: (ctx) => { const { chain, rest } = urgenceItems(); return runScenario(ctx, { title: 'Urgences', icon: '🚨', intro: '<p>Une panne radio en 5 étapes, puis transpondeur, détournement, MAYDAY, PAN PAN, vidange…</p>', items: chain.concat(ctx.shuffle(rest)), shuffle: false, n: 14 }); } },
  sar: { start: (ctx) => runScenario(ctx, { title: 'Recherche et sauvetage', icon: '🛟', intro: '<p>Survole la zone : lis les signaux au sol, choisis la bonne phase d’alerte, connais l’organisation SAR.</p>', items: sarItems(), n: 14 }) },
};
