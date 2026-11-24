// Simus : espace aérien (3D), VMC, niveaux, information de vol, radar, interception (3D)
import * as THREE from 'three';
import { runScenario, svg, planeTop, arrow, text } from './engine.js';
import { ft } from './world.js';
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const nb = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const distr = (pool, ok, n = 3) => { const d = []; const p = pool.filter((x) => x !== ok); while (d.length < n && p.length) { const x = p.splice(Math.floor(Math.random() * p.length), 1)[0]; d.push(x); } return d; };

// ======================================================================= ESPACE AÉRIEN (3D)
const ZINFO = {
  CTR: 'Zone de contrôle de l’aérodrome, gérée par la tour. Limite haute d’au moins 700 ft, rayon d’au moins 5 NM dans les axes d’approche. <b>Classe D</b> : clairance + radio pour tous ; seul l’IFR est séparé de l’IFR, info de trafic pour le reste.',
  TMA1: 'Région de contrôle terminale, autour des grands aéroports, gérée par l’<b>approche</b> (arrivées et départs). Ici en <b>classe D</b> : clairance + radio pour tous.',
  TMA2: 'Partie de TMA en <b>classe E</b> : clairance et radio pour l’IFR seulement. Le VFR y entre sans clairance (info de trafic si possible).',
  AWY: 'Voie aérienne : CTA en forme de couloir, gérée par l’ACC (CRNA). Nom de 6 caractères max, RNP 5. Sous le FL115 : <b>classe E</b>.',
  LTA: 'Région inférieure de contrôle : du FL115 (ou 3 000 ft AGL, le plus haut) au FL195, gérée par l’ACC (CRNA). En France, principalement <b>classe D</b>.',
  UTA: 'Espace supérieur, du FL195 au FL660, géré par l’ACC. <b>Classe C</b>. Pas de VFR au-dessus du FL195 en France (sauf autorisation spéciale, jusqu’au FL285).',
  P: 'Zone <b>P</b> (prohibée) : survol interdit en permanence (sauf QRA).',
  R: 'Zone <b>R</b> (réglementée) : transit possible avec autorisation.',
  Dz: 'Zone <b>D</b> (dangereuse) : pénétration possible à vos risques, évitement fortement recommandé. D ne veut pas dire interdite.',
  TSA: '<b>TSA</b> : réservée aux militaires sur un créneau, 48 h à l’avance auprès d’Eurocontrol (FUA). Active, elle est impénétrable pour le VFR et l’IFR. (Une TRA, elle, peut être traversée avec accord.)',
};
const ZIDS = ['CTR', 'TMA1', 'TMA2', 'AWY', 'LTA', 'UTA', 'P', 'R', 'Dz', 'TSA'];
const ZLBL = { CTR: 'CTR', TMA1: 'TMA (D)', TMA2: 'TMA (E)', AWY: 'AWY', LTA: 'LTA', UTA: 'UTA', P: 'Zone P', R: 'Zone R', Dz: 'Zone D', TSA: 'TSA' };
const C_VFR = ['Une clairance et le contact radio', 'Rien : le VFR y entre librement', 'Le contact radio seulement', 'Un plan de vol IFR'];
function espaceItems() {
  return [
    { z: 'CTR', q: 'Tu es en VFR et tu veux traverser cette CTR (classe D). Il te faut…', c: C_VFR, a: 0, why: 'Classes B, C et D : clairance et contact radio obligatoires pour le VFR.' },
    { z: 'TMA2', q: 'En VFR, tu veux entrer dans cette partie de TMA en classe E. Il te faut…', c: C_VFR, a: 1, why: 'Classe E : clairance et radio obligatoires pour l’IFR seulement. Le VFR y entre librement.' },
    { z: 'UTA', q: 'Tu es en VFR et tu voudrais monter au FL210. Possible ?', c: ['Non : pas de VFR au-dessus du FL195 en France (sauf autorisation spéciale, jusqu’au FL285)', 'Oui, avec une clairance', 'Oui, sans condition', 'Oui, si tu as le transpondeur'], a: 0, why: 'Le VFR ne monte pas au-dessus du FL195 en France. Jusqu’au FL285 seulement avec une autorisation spéciale publiée à l’AIP.' },
    { z: 'TSA', q: 'Cette TSA est active. Tu es en IFR, avec un plan de vol. Peux-tu la traverser ?', c: ['Non : active, elle est impénétrable pour le VFR et l’IFR', 'Oui, avec une clairance IFR', 'Oui, en VFR seulement', 'Oui, à tes risques'], a: 0, why: 'TSA active = impénétrable (sauf circonstances exceptionnelles). TRA active = traversable avec accord.' },
    { z: 'P', q: 'Tu es à 3 000 ft et ta route passe dans cette zone P. Que fais-tu ?', c: ['Je modifie ma route pour l’éviter', 'Je demande une autorisation de transit', 'Je la traverse à mes risques', 'Je la traverse en affichant 7000'], a: 0, why: 'P (prohibée) : survol interdit en permanence. R : transit avec autorisation. D : à vos risques.' },
    { z: 'R', q: 'Ta route passe dans cette zone R active. Que fais-tu ?', c: ['Je demande l’autorisation de transit, sinon je l’évite', 'Je la traverse à mes risques', 'Je l’évite : survol toujours interdit', 'Je la traverse en restant en VFR'], a: 0, why: 'R (réglementée) : transit possible avec autorisation.' },
    { z: 'Dz', q: 'Zone D sur ta route. Peux-tu y entrer ?', c: ['Oui, à tes risques, mais l’évitement est fortement recommandé', 'Non, jamais', 'Seulement avec une clairance', 'Seulement les militaires'], a: 0, why: 'D = dangereuse, pas interdite : pénétration à vos risques.' },
    { z: 'AWY', q: 'Cette voie aérienne (AWY) est gérée par…', c: ['L’ACC (le CRNA)', 'La tour', 'L’approche', 'Le FIC'], a: 0, why: 'Le contrôle régional (ACC, 5 CRNA en France) gère l’en-route : LTA, UTA, AWY, PDR, CDR.' },
    { z: 'TMA1', q: 'Qui te rend le service de contrôle dans cette TMA ?', c: ['L’approche (APP)', 'La tour (TWR)', 'Le CRNA', 'Le FIC'], a: 0, why: 'Tour : CTR, piste et circuit. Approche : TMA et CTA (arrivées et départs). ACC : en-route.' },
    { z: 'CTR', q: 'Une CTR monte au minimum jusqu’à…', c: ['700 ft (200 m)', '1 000 ft', '1 500 ft', '2 000 ft'], a: 0, why: 'CTR : du sol à au moins 700 ft, sur au moins 5 NM autour du terrain dans les axes d’approche.' },
    { z: 'LTA', q: 'En France, la LTA commence à…', c: ['FL115 ou 3 000 ft AGL (le plus haut)', 'FL195', 'FL100', '3 000 ft AMSL'], a: 0, why: 'LTA : de 3 000 ft AGL ou FL115 jusqu’au FL195, gérée par l’ACC.' },
    { q: 'En classe D, qui est séparé de qui ?', c: ['L’IFR de l’IFR seulement', 'L’IFR de l’IFR et du VFR', 'Tout le monde', 'Personne'], a: 0, why: 'D : IFR/IFR séparés, info de trafic pour le reste. C : IFR séparé de l’IFR et du VFR. B : tous séparés.' },
    { q: 'En classe C, l’IFR est séparé…', c: ['Des IFR et des VFR', 'Des IFR seulement', 'De personne', 'Des VFR seulement'], a: 0, why: 'C : IFR/IFR et IFR/VFR. Info de trafic VFR/VFR.' },
    { q: 'Quelles classes n’existent pas en France ?', c: ['B et F', 'A et B', 'E et F', 'F et G'], a: 0, why: 'Pas de classe B ni F en France. G = FIR et UIR non contrôlées.' },
    { q: 'Vitesse maximale sous le FL100, en France ?', c: ['250 kt, dans toutes les classes', '200 kt en classe D seulement', '250 kt en classe G seulement', '300 kt'], a: 0, why: 'France : 250 kt max sous le FL100, toutes classes. Radio 8,33 kHz.' },
    { q: 'Entre deux espaces voisins de classes différentes, on applique…', c: ['La règle de la classe la moins restrictive', 'La règle de la classe la plus restrictive', 'La règle de l’espace du dessous', 'Le choix du pilote'], a: 0, why: 'Règle du cours : à la limite de deux espaces voisins, la classe la moins restrictive.' },
    { q: 'Une CDR (route conditionnelle) se réserve…', c: ['48 h à l’avance auprès d’Eurocontrol', '24 h à l’avance', '1 semaine à l’avance', 'En vol, auprès du CRNA'], a: 0, why: 'CDR, TSA, TRA et CBA : réservées 48 h à l’avance (FUA, utilisation flexible de l’espace).' },
    { q: 'Une TRA est active. Peux-tu la traverser ?', c: ['Oui, si on t’y autorise', 'Jamais', 'Oui, librement', 'Seulement en VFR'], a: 0, why: 'TRA : réservée aux militaires, mais d’autres avions peuvent être autorisés à la traverser. TSA : impénétrable.' },
    { q: 'Route « UL612 » : que veulent dire U et L ?', c: ['U = espace supérieur, L = route RNAV', 'U = urgence, L = longue distance', 'U = UIR, L = hélicoptères', 'U = non RNAV, L = basse altitude'], a: 0, why: 'Préfixe : K = hélicos basse altitude, U = supérieure, S = supersonique. A, B, G, R (et H, J, V, W) = non RNAV ; L, M, N, P (et Q, T, Y, Z) = RNAV. Suffixe : Y = RNP 1 au-dessus du FL200, Z = RNP 1 au FL190 ou dessous, F = consultatif, G = information de vol.' },
    { q: 'RMZ et TMZ, c’est…', c: ['Zone à radio obligatoire, zone à transpondeur obligatoire', 'Deux types de zones réglementées', 'Zone militaire et zone de transit', 'Zone de montagne et zone de transit'], a: 0, why: 'RMZ : radio obligatoire. TMZ : transpondeur obligatoire (mode S, ou A/C pour le VFR).' },
    { q: 'Combien d’ACC (CRNA) en France ?', c: ['5 : Paris, Reims, Brest, Bordeaux, Marseille', '3', '4', '7'], a: 0, why: '5 CRNA, avec des contrôleurs militaires du CMCC à l’intérieur.' },
  ];
}
function espaceSim(ctx) {
  const { W, el, esc } = ctx;
  const vols = W.airVolumes;
  const meshes = (id) => vols.filter((m) => m.userData.info.id === id);
  function setHL(id) {
    for (const m of vols) {
      const on = !id || m.userData.info.id === id;
      m.material.opacity = id ? (on ? Math.max(0.4, m.userData.baseOp * 2.4) : m.userData.baseOp * 0.25) : m.userData.baseOp;
      m.material.emissiveIntensity = id && on ? 0.75 : 0.25;
      m.userData.edges.material.opacity = id ? (on ? 1 : 0.12) : 0.85;
    }
  }
  function look(id) {
    const m = meshes(id)[0]; if (!m) return;
    if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
    const s = m.geometry.boundingSphere, c = s.center.clone();
    const d = Math.min(2300, Math.max(80, s.radius * 2.3));
    W.camTo(c.clone().addScaledVector(new THREE.Vector3(-0.62, 0.45, 0.66).normalize(), d), c, 1.3);
  }
  function card(id) {
    const i = meshes(id)[0].userData.info;
    const tag = i.cls.length === 1 ? 'Classe ' + i.cls : 'Zone ' + (i.cls === 'Dz' ? 'D' : i.cls);
    return `<h3>${esc(i.name)}</h3><div><span class="pill">${tag}</span><span class="pill">${esc(i.lim)}</span></div><div class="cbody"><p>${ZINFO[id]}</p></div>`;
  }
  let mode = 'explore', stopDefi = null, last = { key: '', k: 0 };
  const cvs = W.renderer.domElement, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY }; };
  const onUp = (e) => {
    if (!down || mode !== 'explore') return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
    if (moved > 8) return;
    const r = cvs.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, W.camera);
    const hits = ray.intersectObjects(vols, false);
    const ids = [...new Set(hits.map((h) => h.object.userData.info.id))];
    if (!ids.length) return;
    // le plus petit volume d'abord ; toucher encore au même endroit = volume suivant
    ids.sort((a, b) => meshes(a)[0].geometry.boundingSphere.radius - meshes(b)[0].geometry.boundingSphere.radius);
    const key = ids.join(','); last = key === last.key ? { key, k: (last.k + 1) % ids.length } : { key, k: 0 };
    show(ids[last.k], false);
  };
  vols.forEach((m) => { if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere(); });
  cvs.addEventListener('pointerdown', onDown); cvs.addEventListener('pointerup', onUp);
  function show(id, move = true) {
    setHL(id); if (move) look(id);
    const inf = el.querySelector('#zinfo'); if (!inf) return;
    inf.style.display = 'block'; inf.innerHTML = card(id);
    el.querySelectorAll('[data-z]').forEach((b) => b.classList.toggle('on', b.dataset.z === id));
    inf.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function explore() {
    mode = 'explore'; setHL(null);
    el.innerHTML = `<div class="sim"><h3>🗺️ Explore l’espace aérien</h3><p class="hint">Touche un volume dans la 3D (touche encore au même endroit pour passer au volume derrière), ou choisis-le ici.</p>
      <div class="row">${ZIDS.map((id) => `<button class="btn sm" data-z="${id}">${ZLBL[id]}</button>`).join('')}</div><div id="zinfo" class="card" style="display:none"></div>
      <button class="btn" id="zall">Vue d’ensemble</button><button class="btn pri big" id="zgo">Lancer le défi 🎯</button></div>`;
    el.querySelectorAll('[data-z]').forEach((b) => b.onclick = () => show(b.dataset.z));
    el.querySelector('#zall').onclick = () => { setHL(null); W.preset('espace'); };
    el.querySelector('#zgo').onclick = defi;
  }
  function defi() {
    mode = 'defi';
    const items = espaceItems().map((it) => it.z ? { ...it, tag: ZLBL[it.z], art: (cx, box) => { setHL(it.z); look(it.z); box.innerHTML = `<div class="hint" style="padding:9px 12px;margin:0">👀 Zone en surbrillance dans la 3D : <b>${ZLBL[it.z]}</b></div>`; return () => setHL(null); } } : it);
    stopDefi = runScenario(ctx, { title: 'Espaces aériens', icon: '🗺️', intro: '<p>Une zone s’allume dans la 3D : dis ce que tu as le droit d’y faire et qui s’en occupe.</p>', items, n: 14, onStop: () => setHL(null) });
  }
  explore();
  return () => { cvs.removeEventListener('pointerdown', onDown); cvs.removeEventListener('pointerup', onUp); stopDefi && stopDefi(); setHL(null); };
}

// ======================================================================= VMC
const VMC_C = ['VMC ✅ : je continue en VFR', 'Pas VMC : visibilité trop faible', 'Pas VMC : nuages trop proches (ou sol pas en vue)', 'VFR interdit dans cet espace'];
const planeSide = (x, y, col = '#5fd6ff') => `<g transform="translate(${x} ${y})"><path d="M-26,0 C-20,-6 14,-6 24,-2 L29,0 L24,3 C10,5 -16,5 -26,3 Z" fill="${col}"/><path d="M-22,-1 L-28,-14 L-20,-14 L-12,-2 Z" fill="${col}"/><rect x="-6" y="-1" width="17" height="3" rx="1.5" fill="#0a1222" opacity=".45"/><rect x="10" y="-4" width="7" height="2.5" rx="1" fill="#0a1222" opacity=".6"/></g>`;
const cloud = (x, y, s = 1, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#eef3fa" opacity="${o}"><circle cx="-18" cy="4" r="14"/><circle cx="0" cy="-6" r="19"/><circle cx="20" cy="2" r="15"/><rect x="-32" y="2" width="66" height="16" rx="8"/></g>`;
function vmcArt(c) {
  const haze = Math.max(0, Math.min(0.7, 0.85 - c.vis / 9000));
  const P = { x: 90, y: 112 };
  let cl = '', gr = `<rect x="0" y="178" width="340" height="32" fill="#2f4a2a"/><path d="M0,178 L60,170 L120,176 L200,166 L260,175 L340,168 L340,180 L0,180 Z" fill="#3c5b33"/>`;
  if (c.type === 'front') { const x = Math.min(300, P.x + 70 + c.dist / 3000 * 170); cl = cloud(x, P.y - 4, 1.1) + arrow(P.x + 32, P.y + 26, x - 34, P.y + 26, '#ffc35c', 2) + text((P.x + x) / 2, P.y + 44, nb(c.dist) + ' m', { s: 13, c: '#ffd08a' }); }
  if (c.type === 'up') { const y = P.y - 30 - Math.min(60, c.dist / 2000 * 60); cl = [20, 80, 140, 200, 260, 320].map((x) => cloud(x, y - 14, 1)).join('') + arrow(P.x + 60, P.y - 6, P.x + 60, y + 6, '#ffc35c', 2) + text(P.x + 100, (P.y + y) / 2 + 4, nb(c.dist) + ' ft', { s: 13, c: '#ffd08a' }); }
  if (c.type === 'down') { const y = P.y + 26 + Math.min(40, c.dist / 2000 * 40); cl = [20, 80, 140, 200, 260, 320].map((x) => cloud(x, y + 8, 1.05)).join('') + `<rect x="0" y="${y + 14}" width="340" height="${210 - y}" fill="#eef3fa"/>` + arrow(P.x + 60, P.y + 8, P.x + 60, y - 10, '#ffc35c', 2) + text(P.x + 100, (P.y + y) / 2 + 4, nb(c.dist) + ' ft', { s: 13, c: '#ffd08a' }); gr = ''; }
  if (c.type === 'in') cl = cloud(P.x + 4, P.y - 2, 2.4, 0.9);
  if (c.type === 'none') cl = cloud(290, 40, 0.6, 0.8);
  return svg(340, 210, `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7fc9"/><stop offset="1" stop-color="#a9cdf0"/></linearGradient></defs>
    <rect width="340" height="210" fill="url(#sk)"/>${gr}${c.type === 'in' ? planeSide(P.x, P.y) + cl : cl + planeSide(P.x, P.y)}
    <rect width="340" height="210" fill="#e8eef6" opacity="${haze}"/>
    <rect x="8" y="8" width="${Math.max(120, c.where.length * 7.4)}" height="24" rx="12" fill="rgba(8,14,28,.72)"/>${text(16, 25, c.where, { s: 13, a: 'start' })}
    <rect x="200" y="182" width="132" height="22" rx="11" fill="rgba(8,14,28,.72)"/>${text(266, 198, 'Visibilité ' + (c.vis >= 5000 ? nb(c.vis / 1000) + ' km' : nb(c.vis) + ' m'), { s: 12.5 })}`, '#3f7fc9');
}
function vmcCase() {
  const k = pick(['haut', 'haut', 'bas', 'bas', 'bas', 'G', 'G', 'A', 'sup']);
  const fail = Math.random() < 0.62 ? pick(['vis', 'cloud']) : null;
  const geo = (bad) => Math.random() < 0.5 ? { type: 'front', dist: bad ? pick([500, 800, 1000, 1200]) : pick([1500, 2000, 3000]) } : { type: pick(['up', 'down']), dist: bad ? pick([300, 500, 700, 800]) : pick([1000, 1500, 2000]) };
  let c, a, why;
  if (k === 'haut') {
    const fl = ri(11, 19) * 10, cls = pick(['C', 'D', 'E']);
    c = { where: `FL${fl} · classe ${cls}`, vis: fail === 'vis' ? pick([5, 6, 7]) * 1000 : pick([8, 10, 15, 20]) * 1000, ...geo(fail === 'cloud') };
    a = fail === 'vis' ? 1 : fail === 'cloud' ? 2 : 0;
    why = 'Au-dessus du FL100 (toutes classes) : 8 km de visibilité, 1 500 m des nuages horizontalement et 1 000 ft verticalement.' + (fail === 'vis' ? ' 5 km ne suffit que sous le FL100.' : '');
  } else if (k === 'bas') {
    const alt = ri(7, 18) * 500, cls = pick(['D', 'E']);
    c = { where: `${nb(alt)} ft QNH · classe ${cls}`, vis: fail === 'vis' ? pick([2000, 3000, 4000]) : pick([5, 6, 8, 10]) * 1000, ...geo(fail === 'cloud') };
    a = fail === 'vis' ? 1 : fail === 'cloud' ? 2 : 0;
    why = 'Sous le FL100, classes A à E : 5 km de visibilité, 1 500 m des nuages horizontalement et 1 000 ft verticalement.';
  } else if (k === 'G') {
    const alt = pick([1500, 2000, 2500]);
    let g;
    if (fail === 'cloud') g = pick([{ type: 'down', dist: pick([200, 400]) }, { type: 'in', dist: 0 }]);
    else g = pick([{ type: 'front', dist: pick([300, 500, 800]) }, { type: 'up', dist: pick([300, 500]) }, { type: 'none', dist: 0 }]);
    c = { where: `${nb(alt)} ft AMSL · classe G · 110 kt`, vis: fail === 'vis' ? pick([800, 1000, 1200]) : pick([1500, 2000, 3000, 5000]), ...g };
    a = fail === 'vis' ? 1 : fail === 'cloud' ? 2 : 0;
    why = 'Classes F et G, sous 3 000 ft AMSL ou 1 000 ft AGL (le plus haut) : hors nuages et sol en vue. Visibilité 5 km, en France jusqu’à 1 500 m si IAS ≤ 140 kt.' + (a === 0 && g.type !== 'none' ? ' Ici, pas de distance minimale aux nuages : il suffit de rester hors nuages, sol en vue.' : '');
  } else if (k === 'A') {
    c = { where: `${nb(pick([5000, 6000, 7000]))} ft · classe A`, vis: 10000, type: 'none', dist: 0 }; a = 3;
    why = 'Classe A : IFR seulement. Le VFR y est interdit, même par grand beau temps.';
  } else {
    c = { where: `FL${pick([205, 215, 225])} · classe C (UTA)`, vis: 20000, type: 'none', dist: 0 }; a = 3;
    why = 'En France, pas de VFR au-dessus du FL195 (jusqu’au FL285 seulement avec une autorisation spéciale publiée à l’AIP).';
  }
  return { tag: 'VMC ?', q: 'Peux-tu continuer en VFR ?', art: vmcArt(c), c: VMC_C, a, keep: true, why };
}
function vmcItems() {
  const L = Array.from({ length: 10 }, () => vmcCase);
  L.push({ tag: 'VFR spécial', q: 'VFR spécial dans une CTR : visibilité minimale ?', c: ['1 500 m', '800 m', '3 km', '5 km'], a: 0, why: 'VFR spécial : vis ≥ 1 500 m, clairance obligatoire, de jour, routes publiées. Possible quand la vis est sous 5 km et le plafond sous 1 500 ft.' });
  L.push({ tag: 'VFR de nuit', q: 'VFR de nuit (SERA) : plafond minimal ?', c: ['1 500 ft', '1 000 ft', '3 000 ft', '500 ft'], a: 0, why: 'VFR de nuit : contact radio, plafond ≥ 1 500 ft, sol en vue sous 3 000 ft AMSL ou 1 000 ft AGL. Pas de visibilités réduites du VFR spécial.' });
  L.push({ tag: 'Hauteurs', q: 'Monomoteur : hauteur minimale de survol d’une ville de plus de 3 600 m de large ?', c: ['5 000 ft', '3 300 ft', '1 700 ft', '6 500 ft'], a: 0, why: 'Monomoteur : autoroute 1 000 ft, ville < 1 200 m 1 700 ft, 1 200 à 3 600 m 3 300 ft, > 3 600 m 5 000 ft, Paris 6 500 ft.' });
  L.push({ tag: 'Hauteurs', q: 'Biréacteur : hauteur minimale de survol d’une autoroute ?', c: ['3 300 ft', '1 000 ft', '1 700 ft', '5 000 ft'], a: 0, why: 'Multimoteur ou réacteur : 3 300 ft pour l’autoroute et les villes jusqu’à 3 600 m, puis 5 000 ft, Paris 6 500 ft.' });
  L.push({ tag: 'VFR de nuit', q: 'VFR de nuit en France, vol non local : plan de vol…', c: ['Obligatoire, déposé 30 min avant l’EOBT', 'Facultatif', 'Obligatoire, 60 min avant', 'Obligatoire, 10 min avant'], a: 0, why: '30 min avant l’EOBT (ou 30 min avant le coucher du soleil à destination). Vol local = dans la CTR ou à 12 km du terrain.' });
  return L;
}

// ======================================================================= NIVEAUX DE CROISIÈRE
function trackArt(trk, rule, half) {
  const r = trk * Math.PI / 180, ex = 170 + 82 * Math.sin(r), ey = 110 - 82 * Math.cos(r);
  const ticks = Array.from({ length: 36 }, (_, i) => { const a = i * 10 * Math.PI / 180, l = i % 9 === 0 ? 12 : 6; return `<line x1="${170 + 95 * Math.sin(a)}" y1="${110 - 95 * Math.cos(a)}" x2="${170 + (95 - l) * Math.sin(a)}" y2="${110 - (95 - l) * Math.cos(a)}" stroke="#93a1bd"/>`; }).join('');
  const hz = half ? `<path d="M170,110 L170,15 A95,95 0 0 1 170,205 Z" fill="rgba(98,227,160,.16)"/><path d="M170,110 L170,205 A95,95 0 0 1 170,15 Z" fill="rgba(255,195,92,.13)"/>${text(232, 150, '000-179°', { s: 11, c: '#62e3a0' })}${text(232, 164, 'impairs', { s: 11, c: '#62e3a0' })}${text(108, 150, '180-359°', { s: 11, c: '#ffc35c' })}${text(108, 164, 'pairs', { s: 11, c: '#ffc35c' })}` : '';
  return svg(340, 220, `<circle cx="170" cy="110" r="95" fill="#0d1a30" stroke="#2a3757"/>${hz}${ticks}${text(170, 32, 'N', { s: 13, c: '#ffc35c' })}${text(255, 114, 'E', { s: 12 })}${text(170, 200, 'S', { s: 12 })}${text(85, 114, 'O', { s: 12 })}
    ${arrow(170, 110, ex, ey, '#5fd6ff', 4)}${planeTop(170, 110, trk, '#5fd6ff', 0.6)}
    <rect x="8" y="8" width="62" height="24" rx="12" fill="${rule === 'IFR' ? '#5b3fd6' : '#1f8a5a'}"/>${text(39, 25, rule, { s: 13, w: 800 })}
    <rect x="232" y="8" width="100" height="24" rx="12" fill="rgba(255,255,255,.08)"/>${text(282, 25, 'Rm ' + String(trk).padStart(3, '0') + '°', { s: 13 })}`);
}
const randTrack = () => (Math.random() < 0.5 ? ri(2, 34) * 5 : ri(38, 70) * 5);
function levelItem(forceRvsm) {
  const trk = randTrack(), east = trk < 180;
  if (forceRvsm) {
    const b = ri(15, 19) * 2 + 1; // 31..39 impairs
    const opts = east ? [b * 10, (b + 1) * 10, (b - 1) * 10, b * 10 + 5] : [(b + 1) * 10, b * 10, (b + 2) * 10, b * 10 + 5];
    return { tag: 'RVSM', q: `IFR en espace RVSM, route magnétique ${String(trk).padStart(3, '0')}°. Quel niveau ?`, art: trackArt(trk, 'IFR', false), c: opts.map((x) => 'FL' + x), a: 0, why: `En RVSM (FL290 à FL410), 1 000 ft de séparation et toujours la règle semi-circulaire : ${east ? '000-179° → niveaux impairs (FL290, 310, 330…)' : '180-359° → niveaux pairs (FL300, 320, 340…)'}.`, after: (cx, box) => { box.innerHTML = trackArt(trk, 'IFR', true); } };
  }
  const rule = Math.random() < 0.5 ? 'IFR' : 'VFR';
  const b = pick([5, 7, 9, 11, 13, 15, 17]);
  const opts = [b * 10, (b + 1) * 10, b * 10 + 5, (b + 1) * 10 + 5];
  const ok = rule === 'IFR' ? (east ? b * 10 : (b + 1) * 10) : (east ? b * 10 + 5 : (b + 1) * 10 + 5);
  return { tag: 'Semi-circulaire', q: `${rule}, route magnétique ${String(trk).padStart(3, '0')}°, vers le FL${b * 10 + 5} environ. Quel niveau de croisière ?`, art: trackArt(trk, rule, false), c: opts.map((x) => 'FL' + x), a: opts.indexOf(ok), keep: true, why: `${east ? '000-179° → niveaux impairs' : '180-359° → niveaux pairs'}${rule === 'VFR' ? ', + 500 ft en VFR' : ''} : FL${ok}.`, after: (cx, box) => { box.innerHTML = trackArt(trk, rule, true); } };
}
function niveauxItems() {
  const L = [];
  for (let i = 0; i < 7; i++) L.push(() => levelItem(false));
  for (let i = 0; i < 2; i++) L.push(() => levelItem(true));
  L.push(() => { const trk = randTrack(); return { tag: 'Piège', q: `VFR, route ${String(trk).padStart(3, '0')}°. Tu voudrais croiser vers le FL205. Quel niveau ?`, art: trackArt(trk, 'VFR', false), c: ['Aucun : VFR interdit au-dessus du FL195 (sauf autorisation)', 'FL205', 'FL215', 'FL210'], a: 0, why: 'Le VFR plafonne au FL195 en France (FL285 avec autorisation spéciale). Interdit aussi en RVSM et en transsonique/supersonique.' }; });
  L.push({ tag: 'Transition', q: 'En France, l’altitude de transition n’est jamais inférieure à…', c: ['5 000 ft', '3 000 ft', '1 500 ft', '6 000 ft'], a: 0, why: 'OACI : jamais sous 3 000 ft. France : jamais sous 5 000 ft.' });
  L.push({ tag: 'Séparation', q: 'Hors RVSM, séparation verticale au-dessus du FL290 ?', c: ['2 000 ft', '1 000 ft', '500 ft', '4 000 ft'], a: 0, why: '1 000 ft jusqu’au FL290, 2 000 ft au-dessus hors RVSM. En RVSM : 1 000 ft du FL290 au FL410.' });
  L.push({ tag: 'Calage', q: 'Espace non contrôlé, sous 3 000 ft AMSL : tu voles…', c: ['En altitude, au QNH', 'En niveau de vol (1013)', 'En hauteur, au QFE', 'Comme tu veux'], a: 0, why: 'Non contrôlé : niveaux de vol, sauf sous 3 000 ft AMSL (France : 3 000 ft AMSL ou 1 000 ft AGL) où l’on vole en altitude QNH.' });
  L.push({ tag: 'IFR', q: 'Niveau minimal IFR hors région montagneuse ?', c: ['1 000 ft au-dessus de l’obstacle le plus haut dans 8 km', '500 ft dans 150 m', '2 000 ft dans 8 km', '1 000 ft dans 600 m'], a: 0, why: '1 000 ft / 8 km. Montagne (± 3 000 ft dans 10 NM) : 2 000 ft.' });
  L.push({ tag: 'Créneau', q: 'Ton CTOT est 10 h 20. Tu peux décoller…', c: ['Entre 10 h 15 et 10 h 30', 'Entre 10 h 10 et 10 h 30', 'Entre 10 h 20 et 10 h 35', 'Seulement à 10 h 20 pile'], a: 0, why: 'Fenêtre de 15 min : CTOT − 5 min à CTOT + 10 min.' });
  L.push({ tag: 'Plan de vol', q: 'Plan de vol IFR : dépôt au plus tard…', c: ['1 h avant l’EOBT (jamais plus de 120 h avant)', '30 min avant', '3 h avant', '24 h avant'], a: 0, why: '1 h avant l’EOBT (jusqu’à 3 h en cas de régulation). Max 120 h (5 jours) avant. AFIL : activé en 10 min.' });
  L.push({ tag: 'Radio', q: 'Tu veux passer d’IFR à VFR. Tu dis…', c: ['« Cancelling my IFR flight »', '« Request VFR »', '« Leaving IFR »', 'Rien, tu déposes un plan VFR'], a: 0, why: 'On annonce « CANCELLING MY IFR FLIGHT ». Déposer un plan de vol VFR n’est pas obligatoire.' });
  return L;
}

// ======================================================================= INFORMATION DE VOL
const ALPHA = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL', 'INDIA', 'JULIETT', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY', 'X-RAY', 'YANKEE', 'ZULU'];
function atis() {
  const L = pick(ALPHA), hh = String(ri(6, 18)).padStart(2, '0'), mm = pick(['00', '30']), wd = ri(30, 35) * 10, ws = ri(4, 18), q = ri(1003, 1028), tl = pick([50, 60, 70]), t = ri(4, 24), d = t - ri(2, 9), vis = pick(['10 km ou plus', '8 km', '6 000 m']), cl = pick(['quelques nuages à 2 500 ft', 'nuages épars à 3 000 ft', 'fragmentés à 4 000 ft', 'pas de nuages significatifs']);
  const msg = `SALON INFORMATION ${L}, enregistrée à ${hh} h ${mm} UTC.\nApproche ILS piste 34. Piste 34 en service, sèche.\nNiveau de transition ${tl}.\nVent ${wd}°, ${ws} kt. Visibilité ${vis}.\nNuages : ${cl}.\nTempérature ${t}, point de rosée ${d}.\nQNH ${q}.`;
  return { L, q, tl, msg };
}
const atisArt = (a) => `<div class="msgbox" style="margin:0;border:0;border-radius:0">📻 ATIS · 127,425\n${a.msg}</div>`;
function fisItems() {
  return [
    () => { const a = atis(); return { tag: 'ATIS', q: 'Tu as écouté l’ATIS. Au premier contact avec la tour, tu dis…', art: atisArt(a), c: [`« …avec ${a.L}, QNH ${a.q} »`, `« …avec ${a.L} »`, `« …QNH ${a.q} »`, '« …sans l’ATIS »'], a: 0, why: 'Au premier contact : on annonce la lettre de l’ATIS reçue et on collationne le QNH.' }; },
    () => { const a = atis(); return { tag: 'ATIS', q: 'D’après cet ATIS, quel est le niveau de transition ?', art: atisArt(a), c: [`FL${a.tl}`, `FL${a.tl + 10}`, 'FL115', `${a.tl * 100} ft`], a: 0, why: 'Le niveau de transition fait partie du contenu de l’ATIS, avec la piste, l’état de piste, le vent, la vis, les nuages, T°, Td et le QNH.' }; },
    { tag: 'ATIS', q: 'Le vent de l’ATIS est une moyenne sur…', c: ['2 min', '1 min', '10 min', '30 s'], a: 0, why: 'Vent : moyenne sur 2 min. Visibilité et RVR : moyenne sur 1 min.' },
    { tag: 'ATIS', q: 'Quels nuages l’ATIS annonce-t-il ?', c: ['Ceux sous 5 000 ft (ou sous la MSA la plus haute) et les CB', 'Tous les nuages', 'Seulement les CB', 'Ceux sous 1 500 ft'], a: 0, why: 'Nuages sous 5 000 ft ou sous la MSA la plus haute, et les CB.' },
    { tag: 'ATIS', q: 'Laquelle de ces infos n’est PAS dans un ATIS ?', c: ['Le trafic dans le tour de piste', 'Le niveau de transition', 'L’état de la piste', 'La tendance'], a: 0, why: 'L’ATIS est un message enregistré pour un aérodrome : météo, piste, approche, TL, QNH, tendance. Pas le trafic.' },
    { tag: 'ATIS', q: 'Durée maximale d’un message ATIS (si possible) ?', c: ['30 s', '1 min', '2 min', '10 s'], a: 0, why: '30 s maximum si possible, diffusé en boucle, identifié par une lettre OACI, mis à jour immédiatement.' },
    { tag: 'Météo', q: 'Phénomène dangereux en route, pour TOUS les avions, jusqu’à 60 000 ft :', c: ['SIGMET', 'AIRMET', 'ATIS', 'VOLMET'], a: 0, why: 'SIGMET : tous les avions, jusqu’à 60 000 ft. AIRMET : vols à basse altitude, jusqu’à 24 000 ft.' },
    { tag: 'Météo', q: 'Phénomène dangereux pour les vols à basse altitude (jusqu’à 24 000 ft) :', c: ['AIRMET', 'SIGMET', 'NOTAM', 'SNOWTAM'], a: 0, why: 'AIRMET : basse altitude, pas déjà prévu dans les prévisions basse altitude.' },
    { tag: 'AFIS', q: 'Tu arrives sur un terrain AFIS. Qui te sépare des autres avions ?', c: ['Toi-même, selon les règles de l’air', 'L’agent AFIS, par clairance', 'La tour la plus proche', 'Le FIC'], a: 0, why: 'AFIS : information de vol et alerte seulement. Pas de contrôle, pas de clairance.' },
    { tag: 'FIS', q: 'Le FIS est rendu…', c: ['À tout avion contrôlé ou connu de l’organisme', 'Seulement aux IFR', 'Seulement en espace contrôlé', 'Seulement sur demande écrite'], a: 0, why: 'À tout avion contrôlé, ou connu (en contact radio en espace non contrôlé). Le contrôle reste prioritaire sur le FIS.' },
    { tag: 'Consultatif', q: 'Route consultative (classe F) : l’ATS te suggère un évitement. Tu…', c: ['Décides de le suivre ou non, et préviens l’ATS sans délai', 'Dois l’exécuter', 'L’ignores sans rien dire', 'Demandes une clairance'], a: 0, why: 'Service consultatif : suggestions à l’IFR, le pilote décide et informe. Il faut un plan de vol. Pas de classe F en France.' },
    { tag: 'D-ATIS', q: 'Le D-ATIS, c’est…', c: ['L’ATIS transmis par liaison de données', 'L’ATIS de défense', 'Un ATIS de dégagement', 'L’ATIS de nuit'], a: 0, why: 'D-ATIS = data link ATIS.' },
  ];
}

// ======================================================================= RADAR
const CODES = [['7700', 'Détresse'], ['7600', 'Panne radio'], ['7500', 'Intervention illicite (détournement)'], ['7000', 'VFR sans code attribué (France)'], ['2000', 'Entrée dans l’espace national sans instruction'], ['0300', 'Vol CAM V'], ['0400', 'Vol CAM V en LTA'], ['7004', 'Voltige'], ['7072', 'Largage de parachutistes'], ['7777', 'Test du transpondeur au sol'], ['7601', 'Panne radio d’un IFR militaire']];
function scopeArt(targets) {
  return (cx, box) => {
    const DPR = Math.min(2, devicePixelRatio || 1), cv = document.createElement('canvas');
    cv.width = 340 * DPR; cv.height = 230 * DPR; cv.style.cssText = 'width:100%;display:block'; box.appendChild(cv);
    const g = cv.getContext('2d'); g.scale(DPR, DPR);
    const C = { x: 170, y: 118 }, glow = targets.map(() => 0.25);
    let raf = 0, a = -Math.PI / 2, last = performance.now();
    const pos = (t) => { const ang = (t.b - 90) * Math.PI / 180; return [C.x + t.r * Math.cos(ang), C.y + t.r * Math.sin(ang)]; };
    function draw(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const a0 = a; a += dt * 1.7;
      g.fillStyle = '#03110b'; g.fillRect(0, 0, 340, 230);
      g.strokeStyle = 'rgba(90,255,160,.16)'; g.lineWidth = 1;
      for (let r = 25; r <= 100; r += 25) { g.beginPath(); g.arc(C.x, C.y, r, 0, Math.PI * 2); g.stroke(); }
      g.beginPath(); g.moveTo(C.x - 105, C.y); g.lineTo(C.x + 105, C.y); g.moveTo(C.x, C.y - 105); g.lineTo(C.x, C.y + 105); g.stroke();
      for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(90,255,160,${0.2 * (1 - i / 18)})`; g.beginPath(); g.moveTo(C.x, C.y); g.arc(C.x, C.y, 104, a - (i + 1) * 0.045, a - i * 0.045); g.closePath(); g.fill(); }
      targets.forEach((t, i) => {
        const ang = (t.b - 90) * Math.PI / 180, d = ((ang - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        if (d < a - a0 + 1e-6) glow[i] = 1; glow[i] = Math.max(0.25, glow[i] - dt * 0.35);
        const [x, y] = pos(t);
        g.fillStyle = t.hl ? `rgba(255,214,90,${glow[i]})` : `rgba(120,255,170,${glow[i]})`; g.beginPath(); g.arc(x, y, 3.4, 0, Math.PI * 2); g.fill();
        g.font = `${t.hl ? 700 : 500} 11px ui-monospace,Menlo,monospace`; g.fillStyle = t.hl ? '#ffd65a' : `rgba(150,255,190,${0.35 + glow[i] * 0.5})`;
        g.fillText(t.code, x + 7, y - 4); g.fillText(t.fl, x + 7, y + 8);
        if (t.hl) { g.strokeStyle = '#ffd65a'; g.strokeRect(x - 7, y - 7, 14, 14); }
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  };
}
const randTargets = (code) => {
  const T = [{ b: ri(0, 359), r: ri(40, 95), code, fl: String(pick([45, 65, 80, 95, 110, 140])).padStart(3, '0'), hl: true }];
  for (let i = 0; i < 4; i++) T.push({ b: ri(0, 359), r: ri(20, 100), code: String(ri(1, 6)) + String(ri(0, 7)) + String(ri(0, 7)) + String(ri(0, 7)), fl: String(ri(30, 300)).padStart(3, '0') });
  return T;
};
const WK = { L: [3, 3, 3], M: [5, 3, 3], H: [6, 5, 4], A380: [8, 7, 6] };
const CATC = { L: '#62e3a0', M: '#5fd6ff', H: '#ffc35c', A380: '#ff6fc8' };
const trailArt = (lead, foll) => svg(340, 110, `${text(170, 20, 'En finale, même niveau', { s: 12, c: '#93a1bd', w: 500 })}
  ${planeTop(270, 62, 90, CATC[lead], lead === 'A380' ? 1.2 : lead === 'H' ? 1 : lead === 'M' ? 0.8 : 0.6)}${text(270, 100, 'devant : ' + (lead === 'A380' ? 'A380 (SUPER)' : lead), { s: 12, c: CATC[lead] })}
  ${planeTop(70, 62, 90, CATC[foll], foll === 'H' ? 1 : foll === 'M' ? 0.8 : 0.6)}${text(70, 100, 'derrière : ' + foll, { s: 12, c: CATC[foll] })}
  ${arrow(105, 62, 230, 62, '#ffc35c', 2)}${text(168, 54, '? NM', { s: 14, c: '#ffd08a', w: 800 })}`);
function radarItems() {
  const L = [];
  for (let i = 0; i < 5; i++) L.push(() => { const [code, mean] = pick(CODES); return { tag: 'Transpondeur', q: `L’écho encadré affiche ${code}. Ça veut dire…`, art: scopeArt(randTargets(code)), c: [mean, ...distr(CODES.map((x) => x[1]), mean)], a: 0, why: `${code} = ${mean}. Astuce : 75 = taxi (hijack), 76 = pas de radio, 77 = au secours.` }; });
  for (let i = 0; i < 3; i++) L.push(() => { const lead = pick(['M', 'H', 'H', 'A380', 'A380']), foll = pick(['L', 'M', 'H']), ok = WK[lead][['L', 'M', 'H'].indexOf(foll)]; const opts = [3, 4, 5, 6, 7, 8].map((x) => x + ' NM'); return { tag: 'Sillage radar', q: `Séparation radar de turbulence de sillage : ${foll} derrière ${lead === 'A380' ? 'A380' : lead} ?`, art: trailArt(lead, foll), c: [ok + ' NM', ...distr(opts, ok + ' NM')], a: 0, why: 'Devant → derrière L / M / H : M → 5 / 3 / 3 · H → 6 / 5 / 4 · A380 → 8 / 7 / 6 NM. Sinon, minimum radar.' }; });
  L.push({ tag: 'Séparation', q: 'Séparations radar standard / réduite / en finale ?', c: ['5 NM / 3 NM / 2,5 NM', '3 NM / 2 NM / 1 NM', '10 NM / 5 NM / 3 NM', '5 NM / 2,5 NM / 2 NM'], a: 0, why: '2,5 NM en finale dans les 10 NM du seuil, sous conditions : occupation de piste ≤ 50 s, freinage bon, radar toutes les 5 s, procédure publiée…' });
  L.push({ tag: 'PAR', q: 'Approche PAR : le contrôleur radar prévient la tour au plus tard à…', c: ['8 NM du toucher', '4 NM', '2 NM', '10 NM'], a: 0, why: 'Tour prévenue à 8 NM au plus tard, clairance d’atterrissage entre 8 et 2 NM. Pas de changement de vitesse dans les 4 derniers NM (pas plus de 20 kt).' });
  L.push({ tag: 'PAR', q: 'PAR : pas d’autorisation d’atterrir à 2 NM. Que se passe-t-il ?', c: ['Remise de gaz', 'On continue jusqu’à 1 NM', 'Atterrissage à vue', 'On passe en SRA'], a: 0, why: 'Remise de gaz aussi si position dangereuse, conflit, ordre de la tour, doute sur la position ou avion perdu dans les 2 derniers NM.' });
  L.push({ tag: 'Radars', q: 'Quel radar fonctionne sans coopération de l’avion ?', c: ['Le PSR (primaire)', 'Le SSR (secondaire)', 'L’ADS-B', 'Le mode S'], a: 0, why: 'PSR : écho réfléchi. SSR : interroge le transpondeur (A = code, C = altitude, S = position, immat, vitesse, cap).' });
  L.push({ tag: 'Guidage', q: 'Pendant un guidage radar, qui est responsable de l’anticollision avec le sol ?', c: ['Le contrôleur', 'Le pilote', 'Personne', 'Le chef de quart'], a: 0, why: 'Guidage ou route directe = le contrôleur gère le relief. Fin : « reprenez votre propre navigation », le pilote redevient responsable.' });
  L.push({ tag: 'Identification', q: 'Identifier un avion au radar primaire (PSR) :', c: ['Le faire virer de 30° ou plus', 'Lui faire afficher 7000', 'Lui demander IDENT', 'Lui faire changer de niveau'], a: 0, why: 'PSR : écho et position annoncée, virage ≥ 30°, ou avion qui vient de décoller (< 1 NM). SSR : code discret, changement de code ou IDENT.' });
  L.push({ tag: 'Guidage', q: 'Guidage radar : pas à moins de … de la limite de l’espace contrôlé.', c: ['2,5 NM', '5 NM', '1 NM', '10 NM'], a: 0, why: '2,5 NM (ou la moitié de la séparation si elle dépasse 5 NM). Pas de guidage en espace non contrôlé, sauf urgence ou évitement météo.' });
  L.push({ tag: 'SRA', q: 'Une approche SRA, c’est…', c: ['Une approche classique : caps + altitude à laquelle tu devrais être', 'Une approche de précision 3D', 'Une approche GNSS', 'Une approche à vue'], a: 0, why: 'SRA = approche de surveillance (2D). PAR = approche de précision (écart latéral, vertical, distance).' });
  L.push({ tag: 'ADS-B', q: 'ADS-B, c’est…', c: ['L’avion diffuse lui-même son identité et sa position GNSS', 'Un radar primaire amélioré', 'Un contrat entre l’ATS et l’avion', 'Un transpondeur mode A'], a: 0, why: 'ADS-B : diffusion. ADS-C : sous contrat entre l’ATS et l’avion.' });
  return L;
}

// ======================================================================= INTERCEPTION (3D)
function interceptSim(ctx) {
  const { W } = ctx;
  const Y = ft(9000), base = new THREE.Vector3(0, Y, 0);
  const ac = W.ac, fi = W.fighter, L = ac.userData.lights;
  const dir = (h) => new THREE.Vector3(Math.sin(h * Math.PI / 180), 0, -Math.cos(h * Math.PI / 180));
  let anim = null, t0 = 0;
  function reset() {
    W.stopFly(); ac.visible = true; fi.visible = true;
    ac.position.copy(base); W.orient(ac, dir(0)); ac.userData.body.rotation.z = 0;
    for (const k in L) L[k].visible = true;
    fi.userData.gear.visible = false; fi.userData.lamp.material.opacity = 0;
    fi.position.copy(base).add(new THREE.Vector3(-9, 1.4, -3)); W.orient(fi, dir(0)); fi.userData.body.rotation.z = 0;
  }
  // le chasseur : position relative intégrée à partir d'un cap h(s), d'une vitesse et d'une montée
  function integ(steps) { const p = new THREE.Vector3(-9, 1.4, -3); let h = 0; const out = []; for (const s of steps) { for (let i = 0; i < s.n; i++) { h += s.dh || 0; p.addScaledVector(dir(h), s.v).add(new THREE.Vector3(0, s.vy || 0, 0)).addScaledVector(dir(0), -(s.u ?? s.v)); out.push({ p: p.clone(), h, bank: s.bank || 0 }); } } return out; }
  const FOLLOW = [{ n: 90, v: 0, bank: 0 }, { n: 200, v: 0.09, dh: -0.25, bank: 0.38 }];
  const BREAK = [{ n: 70, v: 0 }, { n: 60, v: 0.3, u: 0.12, dh: -1.7, vy: 0.09, bank: 1.1 }, { n: 90, v: 0.4, u: 0.12, vy: 0.04 }];
  const tracks = { follow: integ(FOLLOW), brk: integ(BREAK) };
  const ANIM = {
    follow: (s) => { const tr = tracks.follow, i = Math.floor(s * 60) % (tr.length + 40); const k = Math.min(i, tr.length - 1), f = tr[k]; fi.position.copy(base).add(f.p); W.orient(fi, dir(f.h)); fi.userData.body.rotation.z = i < 90 ? Math.sin(s * 9) * 0.55 : f.bank; },
    brk: (s) => { const tr = tracks.brk, i = Math.floor(s * 60) % (tr.length + 50); const k = Math.min(i, tr.length - 1), f = tr[k]; fi.position.copy(base).add(f.p); W.orient(fi, dir(f.h)); fi.userData.body.rotation.z = f.bank; fi.visible = i < tr.length + 20; },
    land: (s) => { fi.userData.gear.visible = true; fi.userData.lamp.material.opacity = W.night > 0.3 ? 1 : 0.6; const w = s * 0.55, R = 9, c = base.clone().add(new THREE.Vector3(-2, -3.5, -26)); fi.position.set(c.x + R * Math.cos(w), c.y, c.z + R * Math.sin(w)); W.orient(fi, new THREE.Vector3(-Math.sin(w), 0, Math.cos(w))); fi.userData.body.rotation.z = -0.45; },
    reg: (s) => { const on = Math.floor(s * 2) % 2 === 0; for (const k in L) L[k].visible = on; },
    irr: (s) => { const k0 = Math.floor(s * 7), on = ((k0 * 2654435761) >>> 0) % 7 < 3; for (const k in L) L[k].visible = on; },
    ack: (s) => { ANIM.follow(s); ac.userData.body.rotation.z = (s % 7) > 2 && (s % 7) < 4.5 ? Math.sin(s * 9) * 0.5 : 0; },
  };
  const tick = () => { if (anim) anim((performance.now() - t0) / 1000); else ac.position.y = Y + Math.sin(performance.now() / 900) * 0.15; };
  W.tick.push(tick);
  const view = (night, far) => (cx, box) => { W.setNight(night); const k = innerWidth < 760 ? 2 : 1; W.camTo(base.clone().add(far ? new THREE.Vector3(-14 * k, 9 * k, 30 * k) : new THREE.Vector3(-8.5 + (k - 1) * 3, 4.7 * k, 20.5 * k)), base.clone().add(far ? new THREE.Vector3(-4, -2, -10) : new THREE.Vector3(-4.5, 0.7, -1.5)), 1.1); };
  const play = (name, night, caption) => (cx, box) => {
    reset(); view(night, name === 'land' || name === 'brk')(cx, box); anim = ANIM[name]; t0 = performance.now();
    box.innerHTML = `<div class="hint" style="padding:9px 12px;margin:0">👀 Regarde la 3D : ${caption}</div>`;
    return () => { anim = null; reset(); };
  };
  const items = [
    { tag: 'Signal vu', q: 'L’intercepteur fait ça devant toi. Ça veut dire…', art: play('follow', 0, 'battements d’ailes, puis virage lent en palier.'), c: ['Vous êtes intercepté, suivez-moi', 'Vous pouvez continuer', 'Atterrissez ici', 'Dégagez immédiatement'], a: 0, why: 'Battements d’ailes puis virage lent en palier, en général à gauche, sans couper ta route. De nuit, en plus, feux de navigation clignotant irrégulièrement.' },
    { tag: 'Signal vu', q: 'L’intercepteur fait ça. Ça veut dire…', art: play('brk', 0, 'dégagement brusque, virage en montée.'), c: ['Vous pouvez continuer', 'Suivez-moi', 'Atterrissez ici', 'Je suis en détresse'], a: 0, why: 'Dégagement brusque par la gauche : virage en montée de 90° ou plus, sans couper ta route. = « Vous pouvez continuer ».' },
    { tag: 'Signal vu', q: 'L’intercepteur tourne, train sorti, phare allumé. Ça veut dire…', art: play('land', 0.75, 'il tourne autour du terrain, train sorti, et survole la piste dans le sens d’atterrissage.'), c: ['Atterrissez ici', 'Vous pouvez continuer', 'Suivez-moi', 'Je ne peux pas obéir'], a: 0, why: '« Atterrissez ici » : il tourne autour du terrain, train sorti, survole la piste dans le sens d’atterrissage. De nuit, phares allumés fixes.' },
    { tag: 'Tes signaux', q: 'Ton avion allume et éteint RÉGULIÈREMENT tous ses feux. Tu dis…', art: play('reg', 0.85, 'tes feux s’allument et s’éteignent régulièrement.'), c: ['Je ne peux pas obéir', 'Je suis en détresse', 'Compris, j’obéis', 'Ce terrain ne convient pas'], a: 0, why: 'Régulièrement = je ne peux pas obéir. Irrégulièrement = je suis en détresse.' },
    { tag: 'Tes signaux', q: 'Ton avion fait clignoter IRRÉGULIÈREMENT tous ses feux. Tu dis…', art: play('irr', 0.85, 'tes feux clignotent irrégulièrement.'), c: ['Je suis en détresse', 'Je ne peux pas obéir', 'Compris, j’obéis', 'Ce terrain ne convient pas'], a: 0, why: 'Irrégulièrement = détresse. Régulièrement = je ne peux pas obéir.' },
    { tag: 'Ta réponse', q: 'L’intercepteur te fait le signal « suivez-moi ». Pour dire « compris, j’obéis », tu…', art: play('ack', 0, 'tu réponds au signal.'), c: ['Bats des ailes et tu le suis', 'Sors le train', 'Fais clignoter tes feux régulièrement', 'Vires brusquement à droite'], a: 0, why: 'Intercepté : battements d’ailes et il suit. De nuit, en plus, feux de navigation clignotants.' },
    { tag: 'Ta réponse', q: '« Ce terrain ne convient pas » : quel signal fais-tu ?', c: ['Rentrer le train et faire clignoter les phares en passant entre 1 000 et 2 000 ft, en continuant à tourner', 'Battements d’ailes', 'Allumer et éteindre régulièrement tous les feux', 'Sortir le train et allumer les phares'], a: 0, why: 'Sortir le train + phares + suivre = « compris » (j’atterris). Rentrer le train + phares clignotants entre 1 000 et 2 000 ft = « ce terrain ne convient pas ».' },
    { tag: 'Phraséologie', q: 'L’intercepteur dit « FOLLOW ». Tu réponds…', c: ['WILCO', 'ROGER', 'PROCEED', 'FOLLOW'], a: 0, why: 'WILCO = compris, j’exécute. CAN NOT si tu ne peux pas.' },
    { tag: 'Phraséologie', q: '« DESCEND », dit par l’intercepteur :', c: ['Descendez pour atterrir', 'Je demande à descendre', 'Descendez de 1 000 ft', 'Vous pouvez continuer'], a: 0, why: 'Intercepteur : CALL SIGN, FOLLOW, DESCEND (pour atterrir), YOU LAND, PROCEED (reprenez votre navigation).' },
    { tag: 'Phraséologie', q: 'Tu ne connais plus ta position. Tu dis…', c: ['AM LOST', 'CAN NOT', 'REPEAT', 'MAYDAY'], a: 0, why: 'Intercepté : CALL SIGN, WILCO, CAN NOT, REPEAT, AM LOST, MAYDAY, HIJACK, LAND, DESCEND.' },
    { tag: 'Phraséologie', q: 'Tu subis une intervention illicite. Tu dis…', c: ['HIJACK', 'MAYDAY', 'CAN NOT', 'AM LOST'], a: 0, why: 'HIJACK = je subis une intervention illicite.' },
    { tag: 'Réflexes', q: 'Tu es intercepté : sur quelle fréquence appeler l’intercepteur ?', c: ['121,5 MHz ou 243 MHz', '123,1 MHz', '118,0 MHz', '2 182 kHz'], a: 0, why: 'Suivre l’intercepteur, prévenir l’ATS, appeler sur 121,5 ou 243 MHz, afficher 7700.' },
    { tag: 'Réflexes', q: 'Tu es intercepté : quel code transpondeur selon le cours ?', c: ['7700', '7600', '7500', '7000'], a: 0, why: 'Le cours : afficher 7700, en plus de suivre, prévenir l’ATS et appeler sur 121,5 / 243 MHz.' },
    { tag: 'Phases', q: 'Phase 1 : où se place l’intercepteur ?', c: ['À gauche, à plus de 300 m, légèrement au-dessus et en avant', 'À droite, à 150 m, même niveau', 'Derrière, à 500 m', 'Juste devant, à 150 m'], a: 0, why: 'Phase 1 : arrive par l’arrière, se place à gauche (> 300 m). Phase 2 : 150 m minimum, même niveau, pour l’identité. Phase 3 : s’écarte.' },
    { tag: 'Défense aérienne', q: 'On n’intercepte que les avions…', c: ['Inconnus et hostiles', 'Douteux et inconnus', 'Amis et douteux', 'Tous ceux qui entrent dans l’espace national'], a: 0, why: 'Classement : ami, douteux, inconnu, hostile. On intercepte les inconnus et les hostiles. Délais d’alerte : 2 / 7 / 15 min.' },
    { tag: 'Défense aérienne', q: 'Interception d’entraînement d’un avion civil :', c: ['Interdite', 'Autorisée avec accord du CDC', 'Autorisée de jour', 'Obligatoire chaque mois'], a: 0, why: 'Interdite. La destruction n’est possible que si l’on a la preuve que l’avion va servir d’arme.' },
  ];
  reset(); view(0)(ctx, null);
  const stop = runScenario(ctx, { title: 'Interception', icon: '🛩️', intro: '<p>Un chasseur arrive sur ta gauche. Lis ses signaux dans la 3D, réponds avec les bons gestes et la bonne phraséologie.</p>', items, n: 14 });
  return () => { stop(); anim = null; const i = W.tick.indexOf(tick); if (i >= 0) W.tick.splice(i, 1); reset(); W.stopFly(); W.setNight(0); };
}

export const SIMS_B = {
  espace: { start: espaceSim },
  vmc: { start: (ctx) => runScenario(ctx, { title: 'VMC ou pas ?', icon: '☁️', intro: '<p>Regarde où tu es, la visibilité et les nuages, et dis si tu peux continuer en VFR. Attention aux pièges : FL100, classe G, classe A, FL195.</p>', items: vmcItems(), n: 12 }) },
  niveaux: { start: (ctx) => runScenario(ctx, { title: 'Choisis ton niveau', icon: '🧭', intro: '<p>Règle semi-circulaire : <b>000-179° → impairs</b>, <b>180-359° → pairs</b>. Le VFR prend les mêmes + 500 ft. En RVSM, même règle.</p>', items: niveauxItems(), n: 12 }) },
  fis: { start: (ctx) => runScenario(ctx, { title: 'Information de vol', icon: '📡', intro: '<p>Décode l’ATIS, distingue SIGMET et AIRMET, et sache ce que fait (ou ne fait pas) un AFIS.</p>', items: fisItems(), n: 11 }) },
  radar: { start: (ctx) => runScenario(ctx, { title: 'Scope radar', icon: '🛰️', intro: '<p>Tu es au scope : lis les codes transpondeur, applique les séparations et les règles de guidage.</p>', items: radarItems(), n: 14 }) },
  intercept: { start: interceptSim },
};
