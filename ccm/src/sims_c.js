// Simus des phases « moteur à pistons » et « turbomachines ».
import { runScenario, slider, seg, toggle, row, button, holder, loop, orderTask, sortTask, svg, arrow, text, gauge, vbar, lamp, fmt1, fmtk } from './engine.js';
const Q = (tag, q, c, why, o = {}) => ({ tag, q, c, a: 0, why, ...o });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
// interpolation linéaire dans une table [[x, y], …]
const tab = (T, x) => { if (x <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (x <= T[i][0]) return lerp(T[i - 1][1], T[i][1], (x - T[i - 1][0]) / (T[i][0] - T[i - 1][0])); return T[T.length - 1][1]; };

// ======================================================================= 14. LE CYCLE À 4 TEMPS
const STROKES = ['1. Admission', '2. Compression', '3. Combustion-détente', '4. Échappement'];
function crankArt(deg) {
  const c = ((deg % 720) + 720) % 720, st = Math.floor(c / 180), th = deg * Math.PI / 180;
  const inO = c < 200 || c > 710, exO = c > 520 || c < 10, spark = c > 340 && c < 362;
  return svg(340, 150, `<circle cx="70" cy="75" r="50" fill="#070c18" stroke="rgba(140,170,230,.3)"/>
    ${[0, 1, 2, 3].map((k) => { const a0 = k * 90 - 90, a1 = a0 + 90, r = 44, P = (a) => [70 + r * Math.cos(a * Math.PI / 180), 75 + r * Math.sin(a * Math.PI / 180)]; const [x0, y0] = P(a0), [x1, y1] = P(a1); return `<path d="M70,75 L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${['#5fa8ff', '#9a7dff', '#ff7a2a', '#8a8f98'][k]}" opacity="${k === st ? 0.9 : 0.25}"/>`; }).join('')}
    <line x1="70" y1="75" x2="${70 + 46 * Math.sin(th / 2)}" y2="${75 - 46 * Math.cos(th / 2)}" stroke="#fff" stroke-width="3"/>${text(70, 144, 'cycle = 720°', { s: 10, c: '#93a1bd' })}
    ${text(150, 34, STROKES[st], { s: 15, w: 850, a: 'start', c: ['#5fa8ff', '#b49cff', '#ff8a3c', '#b8c0ca'][st] })}${text(150, 58, `vilebrequin : ${Math.round(c)}° (${(c / 360).toFixed(2).replace('.', ',')} tour)`, { s: 12, a: 'start', c: '#cdd7ea' })}
    ${text(150, 84, `soupape d’admission : ${inO ? 'OUVERTE' : 'fermée'}`, { s: 11.5, a: 'start', c: inO ? '#5fa8ff' : '#93a1bd' })}${text(150, 102, `soupape d’échappement : ${exO ? 'OUVERTE' : 'fermée'}`, { s: 11.5, a: 'start', c: exO ? '#ff8a3c' : '#93a1bd' })}${spark ? text(150, 126, '⚡ étincelle, juste avant le PMH', { s: 12.5, w: 800, a: 'start', c: '#ffc35c' }) : ''}`);
}
function crankTask(ctx, T) {
  const W = ctx.W; W.setPistonSpeed(0);
  const goals = [['Le début de la compression (PMB, soupapes fermées)', (c) => c >= 178 && c <= 195], ['L’instant de l’étincelle', (c) => c > 340 && c < 362], ['Le seul temps moteur', (c) => c > 380 && c < 520], ['La fin de l’échappement (PMH)', (c) => c > 700 || c < 4]];
  let k = 0; const info = row(T.lab, 'goals');
  const s = slider(T.lab, { label: 'Angle du vilebrequin', min: 0, max: 720, step: 2, value: 60, unit: '°' }, draw);
  const hold = holder(T, 700); let busy = false;
  function draw() {
    const c = s.get() % 720; W.setPiston({ deg: s.get() }); T.art.innerHTML = crankArt(s.get());
    info.innerHTML = goals.map((g, i) => `<div>${i < k ? '✅' : i === k ? '👉' : '⬜'} Montre : ${g[0]}</div>`).join('');
    if (k < goals.length && goals[k][1](c) && !busy) { busy = true; setTimeout(() => { busy = false; if (goals[k] && goals[k][1](s.get() % 720)) { k++; ctx.sfx('tick'); draw(); } }, 600); }
    hold(k >= goals.length, '4 courses du piston = 2 tours de vilebrequin. L’arbre à cames tourne deux fois moins vite. Pendant la compression, les deux soupapes sont fermées.');
  }
  draw();
  return () => W.setPistonSpeed(150);
}
function ratioTask(ctx, T) {
  const sv = slider(T.lab, { label: 'Volume mort', min: 50, max: 300, step: 10, value: 250, unit: 'cm³' }, draw);
  const hold = holder(T, 800);
  function draw() {
    const vm = sv.get(), cy = 1200, r = (cy + vm) / vm, h = 120 * vm / (cy + vm);
    T.art.innerHTML = svg(340, 170, `<rect x="40" y="20" width="80" height="130" fill="rgba(95,168,255,.12)" stroke="#58627a" stroke-width="3"/><rect x="40" y="20" width="80" height="${h}" fill="rgba(255,122,42,.5)"/><rect x="44" y="${22 + h}" width="72" height="14" fill="#b8c0ca"/>
      ${text(80, 16, 'PMH', { s: 10, c: '#93a1bd' })}${text(150, 30 + h / 2, `volume mort ${vm}`, { s: 11, a: 'start', c: '#ff8a3c' })}${text(150, 110, 'cylindrée 1 200 cm³', { s: 11, a: 'start', c: '#5fa8ff' })}
      ${text(260, 70, `${fmt1(r)} : 1`, { s: 28, w: 850, c: Math.abs(r - 9) < 0.01 ? '#62e3a0' : '#fff' })}${text(260, 92, '(cylindrée + mort) / mort', { s: 10.5, c: '#93a1bd' })}`);
    hold(vm === 150, '(1 200 + 150) / 150 = 9:1. Taux = volume total / volume mort. Essence 7 à 11:1, diesel 14 à 22:1 : plus il est haut, meilleur est le rendement thermique.');
  }
  draw();
}
function mapTask(ctx, T) {
  const sa = slider(T.lab, { label: 'Altitude (plein gaz, moteur atmosphérique)', min: 0, max: 10000, step: 500, value: 0, unit: 'ft', fmt: fmtk }, draw);
  const hold = holder(T, 800);
  function draw() {
    const h = sa.get(), map = 30 - h / 1000;
    T.art.innerHTML = svg(340, 150, `${gauge(90, 72, 50, map, 10, 35, 'MAP (inHg)', { zones: [[25, 30, '#62e3a0']], fmt: fmt1 })}${text(240, 60, `${fmtk(h)} ft`, { s: 24, w: 850 })}${text(240, 88, '≈ 1 inHg de moins par 1 000 ft', { s: 11, c: '#93a1bd' })}`);
    hold(Math.abs(map - 25) < 0.01, 'À manette fixe, l’air se raréfie : on perd environ 1 inHg par 1 000 ft. Moteur arrêté, la MAP montre la pression ambiante (~30 inHg au niveau de la mer).');
  }
  draw();
}
const m4Tasks = [
  { tag: 'Les 4 temps', q: 'Tourne le vilebrequin : le cylindre en coupe bouge en 3D. Montre chaque moment demandé.', task: crankTask, why: 'Combustion intermittente à volume constant ; rendement thermique ≈ 30 %.' },
  { tag: 'Taux de compression', q: 'Cylindrée 1 200 cm³ : règle le volume mort pour obtenir 9:1.', task: ratioTask, why: 'Volume total = cylindrée + volume mort.' },
  { tag: 'MAP', q: 'Plein gaz, monte jusqu’à ce que la MAP tombe à 25 inHg.', task: mapTask, why: 'MAP = pression absolue après le papillon. MAP + régime = puissance réelle.' },
];
const m4Items = [
  Q('Grandeurs', 'La puissance est égale à…', ['Couple × régime', 'Couple / régime', 'MAP × régime', 'Régime seul'], 'Le pic de puissance arrive à un régime plus haut que le pic de couple.'),
  Q('Grandeurs', 'Le régime seul suffit-il à connaître la puissance ?', ['Non', 'Oui', 'Oui, au niveau de la mer', 'Oui avec une hélice à calage fixe seulement'], 'Il faut aussi la MAP (et l’état de l’air, l’âge du moteur).'),
  Q('Consommation', 'La consommation spécifique est la meilleure vers…', ['65 à 75 % de puissance', '100 % de puissance', '30 % de puissance', 'Le ralenti'], 'Essence : 0,45 à 0,55 lb/ch/h ; diesel : 0,35 à 0,45.'),
  Q('Cycle', 'Combien de tours de vilebrequin pour un cycle complet ?', ['2', '1', '4', '½'], '4 courses de piston = 720°.'),
  Q('Cycle', 'Pendant l’admission, la pression dans le cylindre est…', ['Inférieure à la pression atmosphérique : le mélange est aspiré', 'Supérieure', 'Égale', 'Nulle'], 'Le piston descend, soupape d’admission ouverte.'),
  Q('Pièces', 'Les segments servent à…', ['L’étanchéité de la chambre et le contrôle de l’huile', 'Ouvrir les soupapes', 'Relier piston et bielle', 'Allumer le mélange'], 'L’axe de piston relie le piston à la bielle.'),
  Q('Pièces', 'L’arbre à cames tourne…', ['Deux fois moins vite que le vilebrequin', 'Aussi vite', 'Deux fois plus vite', 'Seulement au démarrage'], 'Entraîné par pignon, chaîne ou courroie.'),
  Q('Pièces', 'Qui transforme le mouvement linéaire en rotation ?', ['Le vilebrequin', 'L’arbre à cames', 'Le culbuteur', 'Le carter'], 'Le carter est le bâti qui porte le vilebrequin.'),
  Q('Architectures', 'Le moteur à plat (boxer)…', ['Est très bien équilibré, avec un CG bas', 'A un diamètre énorme', 'Est le plus long', 'Refroidit mal ses cylindres'], 'Le plus courant : Lycoming O-320, IO-360, Continental IO-550.'),
  Q('Architectures', 'Le moteur en étoile…', ['Est très bien refroidi mais a un diamètre énorme (traînée)', 'A un CG très haut', 'Est très bien équilibré et étroit', 'Est le plus courant aujourd’hui'], 'Gros couple à bas régime ; presque disparu.'),
  Q('Deux temps', 'Le moteur deux temps…', ['Donne un temps moteur par tour, mais consomme et pollue', 'A deux arbres à cames', 'Utilise du Jet A-1', 'Est le plus sobre'], 'Huile mélangée à l’essence (graissage perdu). ULM, paramoteurs.'),
  Q('Diesel', 'Le diesel d’avion…', ['S’allume par compression, au Jet A-1, sans givrage carburateur', 'A des magnétos', 'A une commande de mélange', 'Fonctionne à l’AVGAS'], 'Démarrage à froid avec des bougies de préchauffage ; souvent turbocompressé.'),
];

// ======================================================================= 15. CARBURANT ET CARBURATEUR
function carbIceTask(ctx, T) {
  let ice = 0, heat = false, sawDrop = false, heatWithIce = false, melted = false, t = 0, acc = 0, rpmS = 2150, stopped = false;
  const r = row(T.lab); const th = toggle(r, 'RÉCHAUFFAGE CARBU', false, (v) => { heat = v; if (v && ice > 0.18) heatWithIce = true; });
  const hold = holder(T, 700);
  return loop((dt) => {
    if (stopped) return;
    t += dt; if (!heat) ice = Math.min(1, ice + (t > 2 ? dt * 0.06 : 0)); else ice = Math.max(0, ice - dt * 0.09);
    const melting = heat && ice > 0, rpm = 2150 - ice * 520 - (heat ? 110 : 0) - (melting ? 90 : 0) + Math.sin(t * 13) * (ice > 0.6 ? 25 : 3);
    rpmS += (rpm - rpmS) * Math.min(1, dt * 2);
    if (ice > 0.25) sawDrop = true;
    if (heatWithIce && ice === 0) melted = true;
    if (ice >= 1) { stopped = true; T.fail('Le moteur s’est étouffé : le givre a bouché le passage de l’air.'); }
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    const ic = `rgba(230,245,255,${Math.min(0.95, ice * 1.2)})`;
    T.art.innerHTML = svg(340, 170, `<path d="M20,30 L80,30 Q110,70 80,110 L20,110 Z" fill="none" stroke="#58627a" stroke-width="3"/><path d="M120,30 L80,30 Q50,70 80,110 L120,110" fill="none" stroke="#58627a" stroke-width="3"/>
      <rect x="10" y="30" width="110" height="80" fill="rgba(95,168,255,.08)"/>${text(50, 24, 'venturi', { s: 10, c: '#93a1bd' })}
      <path d="M66,52 Q80,70 66,88" stroke="${ic}" stroke-width="${2 + ice * 12}" fill="none"/><path d="M94,52 Q80,70 94,88" stroke="${ic}" stroke-width="${2 + ice * 12}" fill="none"/>
      <line x1="108" y1="${70 - 30}" x2="${116}" y2="${70 + 30}" stroke="#cfd8e6" stroke-width="5"/>${text(112, 126, 'papillon', { s: 10, c: '#93a1bd' })}
      <rect x="74" y="100" width="12" height="22" fill="#2f6fd8"/>${text(80, 138, 'gicleur', { s: 10, c: '#93a1bd' })}
      ${gauge(245, 76, 52, rpmS, 1500, 2700, 'tr/min (hélice à calage fixe)', { zones: [[2000, 2400, '#62e3a0']], fmt: (v) => fmtk(Math.round(v / 10) * 10) })}
      ${text(170, 164, '15 °C · humidité 85 % · croisière à 55 %', { s: 11, c: '#5fd6ff' })}${ice > 0.55 ? text(245, 18, 'moteur rugueux…', { s: 11, w: 800, c: '#ffc35c' }) : ''}`);
    T.say(melted && heat ? '💡 Givre fondu : tu peux repousser le réchauffage.' : heat ? (ice > 0 ? 'Réchauffage : le régime baisse d’abord…' : 'Le régime reste bas : pas (ou plus) de givre.') : '💡 Surveille le compte-tours.');
    hold(melted && !heat && sawDrop, 'Régime qui baisse sans raison = givrage carbu. Au réchauffage, la puissance baisse d’abord (air chaud moins dense, eau de fonte), puis remonte quand la glace a fondu : c’est la preuve qu’il y avait du givre.');
  });
}
const carbuTasks = [
  { tag: 'Givrage carbu', q: 'Croisière tranquille par 15 °C et air humide. Surveille ton moteur et réagis.', task: carbIceTask, why: 'Givrage d’évaporation : +4 à +27 °C si humidité > 50 %. Hélice à calage fixe : le régime baisse ; à vitesse constante : la MAP baisse.' },
  { tag: 'Combustions anormales', q: 'Détonation ou auto-allumage ? Range chaque carte.', task: sortTask([
    ['Une partie du mélange explose après l’étincelle, avant le front de flamme.', 0, 'Détonation.'],
    ['La combustion démarre avant l’étincelle, à cause d’un point chaud.', 1, 'Auto-allumage (pré-allumage).'],
    ['De la calamine rougit dans la chambre.', 1, 'Un point chaud : auto-allumage.'],
    ['MAP élevée, mélange pauvre, air d’admission chaud.', 0, 'Causes de détonation.'],
    ['Le plus destructeur des deux.', 1, 'L’auto-allumage pousse contre le piston qui remonte.'],
    ['On la combat en enrichissant et en réduisant la puissance.', 0, 'Détonation : enrichir, réduire, prendre de la vitesse.'],
  ], ['Détonation', 'Auto-allumage'], { n: 5 }), why: 'Le carburant à indice d’octane élevé résiste mieux à la détonation.' },
  { tag: 'Feu de carburateur', q: 'Feu de carburateur au démarrage : remets les actions dans l’ordre.', task: orderTask(['Mélange sur étouffoir', 'Robinet carburant sur OFF', 'Magnétos sur OFF', 'Manette des gaz plein ouvert', 'Continuer à lancer le démarreur']), why: 'Un maximum d’air, et on continue à lancer pour aspirer et souffler le feu.' },
];
const carbuItems = [
  Q('Octane', 'L’indice d’octane mesure…', ['La résistance du carburant à la détonation', 'Sa densité', 'Son pouvoir calorifique', 'Sa volatilité'], 'Plus il est haut, plus on peut comprimer sans détonation. 100LL ≈ 100.'),
  Q('Carburant', 'Le seul carburant approuvé pour les diesels d’avion certifiés ?', ['Le Jet A-1', 'L’AVGAS 100LL', 'La MOGAS', 'L’UL91'], 'Incolore, sans plomb, pas d’indice d’octane.'),
  Q('Purge', 'Quand faut-il surtout purger ?', ['Avant le premier vol du jour et après un avitaillement', 'Seulement en maintenance', 'Après chaque atterrissage', 'Jamais sur un injecteur'], 'Aussi après stockage, pluie, réservoirs restés à moitié vides.'),
  Q('Vapour lock', 'Le vapour lock, c’est…', ['Des bulles de vapeur dans les tuyaux qui privent le moteur de carburant', 'De l’eau dans le carburant', 'Un givrage du filtre', 'Un mélange trop riche'], 'Carburant chaud + basse pression. Parade : pompe de gavage.'),
  Q('Pompes', 'Quand met-on la pompe électrique sur ON ?', ['Au décollage et à l’atterrissage', 'Seulement en croisière', 'Jamais en vol', 'Pour appauvrir'], 'Si la pompe moteur lâche, le moteur continue. Aussi en urgence et contre le vapour lock.'),
  Q('Pompes', 'La pompe mécanique entraînée par le moteur…', ['Marche tant que le moteur tourne, sans électricité', 'Ne marche qu’avec la batterie', 'Ne donne que 2 à 10 psi', 'Sert au démarrage seulement'], 'La pompe électrique seule ne donne que 2 à 10 psi.'),
  Q('Carburateur', 'Dans le carburateur, le carburant est aspiré grâce…', ['À la dépression dans le venturi (Bernoulli)', 'À la pompe de reprise', 'Au papillon', 'Au flotteur'], 'Flotteur + pointeau : niveau constant dans la cuve.'),
  Q('Carburateur', 'En montant, le mélange d’un carburateur classique…', ['S’enrichit : le pilote appauvrit', 'S’appauvrit : le pilote enrichit', 'Reste constant', 'Gèle'], 'L’air est moins dense, mais le carburateur est réglé pour le niveau de la mer.'),
  Q('Carburateur', 'La pompe de reprise…', ['Envoie un jet de carburant quand on ouvre vite les gaz', 'Sert au démarrage à froid', 'Enrichit à pleine puissance', 'Remplace le gicleur'], 'Le primer envoie du carburant pur aux cylindres pour le démarrage à froid.'),
  Q('Rapports', 'Rapport air/carburant stœchiométrique ?', ['14,7:1', '12,6:1', '15,4:1', '9:1'], 'Puissance max 12,6:1 ; économie max 15,4:1.'),
  Q('Givrage', 'Hélice à vitesse constante : le givrage carbu se voit sur…', ['La MAP qui baisse', 'Le régime qui baisse', 'L’EGT qui monte beaucoup', 'La pression d’huile'], 'Le régulateur tient le régime : c’est la MAP qui trahit le givre.'),
  Q('Givrage', 'Tu tires le réchauffage : la puissance baisse et reste basse.', ['Il n’y avait pas de givre', 'Il y avait du givre', 'Le réchauffage est en panne', 'Le moteur est noyé'], 'Avec du givre : baisse, puis remontée après 30 s à 2 min.'),
  Q('Givrage', 'Le réchauffage carbu rend le mélange…', ['Plus riche, avec 10 à 20 % de puissance en moins', 'Plus pauvre', 'Stœchiométrique', 'Inchangé'], 'L’air chaud est moins dense.'),
  Q('Injection', 'Un défaut de l’injection ?', ['Démarrage à chaud difficile, et pas de pression = moteur arrêté', 'Givrage carbu fréquent', 'Mélange inégal entre cylindres', 'Ne marche pas en voltige'], 'Avantages : pas de venturi, mélange égal, toutes positions. Air alternatif si l’entrée est bouchée.'),
];

// ======================================================================= 16. MÉLANGE, REFROIDISSEMENT, ALLUMAGE
const egtOf = (r) => 1450 - (r < 14.7 ? 42 : 58) * (r - 14.7) ** 2, powOf = (r) => (r < 12.8 ? 100 - 2 * (12.8 - r) ** 2 : 100 - 1.2 * (r - 12.8) ** 2), ffOf = (r) => 14 * 14.7 / r, chtOf = (r) => 390 - 7 * (r - 14.2) ** 2;
function leanTask(ctx, T) {
  const goals = [['Trouve le pic d’EGT', (r) => Math.abs(r - 14.7) <= 0.2], ['Règle la puissance max (côté riche)', (r) => r >= 12.5 && r <= 13.1], ['Règle l’économie max (côté pauvre)', (r) => r >= 15.1 && r <= 15.7]];
  let k = 0; const info = row(T.lab, 'goals');
  const s = slider(T.lab, { label: 'Manette de mélange', min: 0, max: 100, step: 1, value: 0, fmt: (v) => (v < 3 ? 'plein riche' : v > 97 ? 'très pauvre' : Math.round(v) + ' %') }, draw);
  const hold = holder(T, 600); let busy = false;
  function draw() {
    const r = 11 + s.get() / 100 * 6.5, egt = egtOf(r), pw = powOf(r), ff = ffOf(r), sfc = ff * 6 / (2 * pw);
    const X = (rr) => 30 + (rr - 11) / 6.5 * 290, Y = (e) => 120 - (e - 1250) / 220 * 90;
    let c = ''; for (let rr = 11; rr <= 17.5; rr += 0.1) c += (c ? 'L' : 'M') + X(rr).toFixed(1) + ',' + Y(egtOf(rr)).toFixed(1);
    T.art.innerHTML = svg(340, 190, `<path d="${c}" stroke="#ff8a3c" stroke-width="3" fill="none"/><line x1="${X(14.7)}" y1="22" x2="${X(14.7)}" y2="124" stroke="rgba(255,255,255,.15)" stroke-dasharray="4 4"/>
      ${text(X(14.7), 18, 'pic d’EGT = 14,7:1', { s: 10, c: '#93a1bd' })}${text(40, 140, '← riche', { s: 10, a: 'start', c: '#93a1bd' })}${text(320, 140, 'pauvre →', { s: 10, a: 'end', c: '#93a1bd' })}
      <circle cx="${X(r)}" cy="${Y(egt)}" r="7" fill="#ffc35c" stroke="#fff" stroke-width="2"/>
      ${text(14, 162, `EGT ${fmtk(egt)} °F`, { s: 12, w: 800, a: 'start', c: '#ff8a3c' })}${text(14, 180, `CHT ${fmtk(chtOf(r))} °F`, { s: 11, a: 'start', c: '#93a1bd' })}
      ${text(170, 162, `Puissance ${Math.round(pw)} %`, { s: 12, w: 800, c: '#62e3a0' })}${text(170, 180, `air/carburant ${fmt1(r)}:1`, { s: 11, c: '#93a1bd' })}
      ${text(326, 162, `${fmt1(ff)} gal/h`, { s: 12, w: 800, a: 'end', c: '#5fd6ff' })}${text(326, 180, `${sfc.toFixed(3).replace('.', ',')} lb/ch/h`, { s: 11, a: 'end', c: '#93a1bd' })}`);
    info.innerHTML = goals.map((g, i) => `<div>${i < k ? '✅' : i === k ? '👉' : '⬜'} ${g[0]}</div>`).join('');
    if (k < goals.length && goals[k][1](r) && !busy) { busy = true; setTimeout(() => { busy = false; const r2 = 11 + s.get() / 100 * 6.5; if (goals[k] && goals[k][1](r2)) { k++; ctx.sfx('tick'); draw(); } }, 700); }
    hold(k >= goals.length, 'On appauvrit jusqu’au pic d’EGT (stœchiométrique), puis on se place côté riche (puissance max, le carburant en trop refroidit) ou côté pauvre (économie, mais CHT plus haute et risque de détonation à forte puissance).');
  }
  draw();
}
const MAGS = [
  ['normal', -100, -120, true, 'Normal : petite chute de chaque côté (max 125 à 175 tr/min), écart < 50 à 100.'],
  ['morte', 0, -110, true, 'Aucune chute sur L : la magnéto gauche ne fonctionne pas réellement (le moteur tournait en fait sur la droite seule).'],
  ['bougie', -110, -320, true, 'Grosse chute et moteur rugueux sur R : magnéto droite ou bougie défectueuse.'],
  ['masse', -100, -130, false, 'Sur OFF le moteur ne s’arrête pas : fil de masse coupé, magnéto toujours « chaude » : hélice dangereuse !'],
];
const DIAG = ['Tout est normal', 'Une magnéto ne fonctionne pas', 'Magnéto ou bougie défectueuse', 'Mauvaise mise à la masse'];
function magTask(ctx, T) {
  const W = ctx.W; let round = 0, score = 0, cs = null, sel = 2, tested = new Set(), rpm = 1800, acc = 0, t = 0;
  const cases = ctx.shuffle([0, 1, 2, 3]).slice(0, 3);
  const r = row(T.lab, 'ovh'); const sw = ['OFF', 'L', 'R', 'BOTH'].map((n, i) => button(r, n, () => { sel = i; if (i !== 3) tested.add(i); paint(); }));
  const dg = row(T.lab, 'diag');
  function paint() { sw.forEach((b, i) => b.classList.toggle('on', i === sel)); }
  function next() {
    if (round >= 3) { return score >= 2 ? T.win(`${score}/3 bons diagnostics.`) : T.fail(`${score}/3 bons diagnostics.`); }
    cs = MAGS[cases[round]]; sel = 3; tested = new Set(); paint();
    dg.innerHTML = `<div class="hint">Essai ${round + 1}/3 à 1 800 tr/min : teste L, R et OFF, puis diagnostique.</div>` + DIAG.map((d, i) => `<button class="btn sm" data-i="${i}">${d}</button>`).join('');
    dg.querySelectorAll('button').forEach((b) => b.onclick = () => {
      if (tested.size < 3) { T.say('💡 Teste d’abord L, R et OFF.'); return; }
      const ok = +b.dataset.i === cases[round]; if (ok) score++; ctx.sfx(ok ? 'ok' : 'ko');
      dg.innerHTML = `<div class="expl ${ok ? 'good' : 'bad'}">${ok ? '✅' : '❌'} ${cs[4]}</div>`; const nb = button(dg, 'Essai suivant ▸', () => { round++; next(); });
    });
  }
  next();
  return loop((dt) => {
    t += dt; if (!cs) return;
    const target = sel === 3 ? 1800 : sel === 1 ? 1800 + cs[1] : sel === 2 ? 1800 + cs[2] : cs[3] ? 0 : 1650;
    rpm += (target - rpm) * Math.min(1, dt * (sel === 0 ? 1.5 : 3)); const rough = sel === 2 && cs[0] === 'bougie';
    W.setProp(rpm, 18); acc += dt; if (acc < 1 / 20) return; acc = 0;
    T.art.innerHTML = svg(340, 140, `${gauge(90, 70, 50, rpm + (rough ? Math.sin(t * 30) * 40 : 0), 0, 2700, 'tr/min', { zones: [[1600, 1850, '#62e3a0']], fmt: (v) => fmtk(Math.round(v / 10) * 10) })}
      ${text(240, 50, `Contacteur : ${['OFF', 'L', 'R', 'BOTH'][sel]}`, { s: 15, w: 800 })}${text(240, 78, sel === 0 ? (cs[3] ? 'le moteur s’arrête' : '⚠️ il tourne encore !') : sel === 3 ? 'référence 1 800' : `chute : ${Math.round(1800 - rpm)} tr/min`, { s: 13, c: sel === 0 && !cs[3] ? '#ff6a4d' : '#cdd7ea', w: 700 })}
      ${rough ? text(240, 102, 'moteur rugueux', { s: 12, w: 800, c: '#ffc35c' }) : ''}`);
  });
}
function cowlTask(ctx, T) {
  const W = ctx.W; const PH = ['Décollage', 'Montée', 'Croisière'], want = [true, true, false]; let k = 0, cht = 340, acc = 0;
  const info = row(T.lab, 'goals'); const r = row(T.lab); const cf = toggle(r, 'Volets de capot ouverts', false, (v) => W.setCowlFlaps(v ? 1 : 0));
  const rb = row(T.lab); button(rb, 'Phase suivante ▸', () => {
    if (cf.get() !== want[k]) { ctx.sfx('ko'); T.say(want[k] ? '❌ CHT trop chaude : il faut plus d’air.' : '❌ Ouverts en croisière : traînée et bruit pour rien.'); return; }
    ctx.sfx('tick'); k++; if (k >= PH.length) T.win('Ouverts au décollage, en montée, par forte chaleur et au sol ; fermés en croisière (moins de traînée et de bruit).');
  }, 'pri');
  return loop((dt) => {
    const p = k < 3 ? k : 2, heat = [470, 450, 360][p], target = heat - (cf.get() ? 85 : 0); cht += (target - cht) * Math.min(1, dt * 0.8);
    acc += dt; if (acc < 1 / 15) return; acc = 0;
    info.innerHTML = PH.map((n, i) => `<div>${i < k ? '✅' : i === k ? '👉' : '⬜'} ${n}</div>`).join('');
    T.art.innerHTML = svg(340, 140, `${gauge(90, 70, 50, cht, 100, 560, 'CHT (°F)', { zones: [[150, 400, '#62e3a0'], [400, 500, '#ffc35c'], [500, 560, '#ff6a4d']], fmt: (v) => Math.round(v) })}
      ${text(240, 56, PH[p], { s: 18, w: 850 })}${text(240, 82, ['plein gaz, faible vitesse', 'forte puissance, vitesse moyenne', 'puissance réduite, grande vitesse'][p], { s: 11.5, c: '#93a1bd' })}`);
  });
}
const melangeTasks = [
  { tag: 'Mixture', q: 'Joue avec la mixture et l’EGT : trouve les trois réglages.', task: leanTask, why: 'Puissance max 12,5 à 13:1 (riche), stœchiométrique 14,7:1 (pic d’EGT), économie max 15,5 à 16,5:1 (pauvre).' },
  { tag: 'Essai magnétos', q: 'Trois essais magnétos au point fixe : teste et diagnostique.', task: magTask, why: 'L → BOTH → R → BOTH. Sur OFF, le moteur doit s’arrêter.' },
  { tag: 'Volets de capot', q: 'Règle les volets de capot pour chaque phase de vol (regarde la CHT et la 3D).', task: cowlTask, why: 'CHT trop haute : réduire la puissance, enrichir, ouvrir les volets de capot, prendre de la vitesse.' },
];
const melangeItems = [
  Q('Refroidissement', 'Le refroidissement par liquide…', ['Donne une température stable, indépendante de la vitesse, mais il est plus lourd', 'Est plus léger que par air', 'N’a pas de thermostat', 'Ne craint pas les fuites'], 'Thermostat ouvert vers 75 à 90 °C.'),
  Q('CHT', 'La sonde CHT est placée…', ['Sur le cylindre le plus chaud', 'Sur le carter', 'Dans l’échappement', 'Sur le cylindre le plus froid'], 'Souvent le n° 3 ou 5.'),
  Q('Huile', 'Une huile 15W-50 : que veut dire « 15W » ?', ['Son comportement à froid (winter)', 'Sa viscosité à chaud', 'Sa teneur en additifs', 'Son point éclair'], 'Le second chiffre donne la viscosité à chaud.'),
  Q('Huile', 'Huile chaude →', ['Plus fluide → pression plus basse', 'Plus épaisse → pression plus haute', 'Rien ne change', 'Elle mousse'], 'Pression basse → température qui monte vite.'),
  Q('Huile', 'Trop d’huile dans un carter humide…', ['Le vilebrequin barbote : mousse, pression instable', 'Meilleur refroidissement', 'Aucun effet', 'Moins de consommation'], 'Ne jamais trop remplir.'),
  Q('Huile', 'Carter sec : pourquoi les pompes de récupération sont-elles plus grosses ?', ['L’huile de retour est chargée d’air', 'Pour remplir plus vite', 'Elles servent aussi au carburant', 'Elles refroidissent'], 'Réservoir séparé : huile disponible dans toutes les attitudes.'),
  Q('Huile', 'Le puits chaud (hot well)…', ['Fait circuler une petite quantité d’huile qui chauffe vite', 'Stocke l’huile chaude pour la nuit', 'Refroidit l’huile', 'Sépare l’air de l’huile'], 'Le désaérateur sépare l’air par centrifugation.'),
  Q('Huile', 'Rôle de l’huile, parmi :', ['Nettoyer (calamine, limaille vers le filtre)', 'Allumer le mélange', 'Refroidir l’air d’admission', 'Doser le carburant'], '6 rôles : frottement, refroidir, nettoyer, étanchéité, corrosion, amortir.'),
  Q('Magnéto', 'Que fait le rupteur ?', ['Il ouvre brutalement le primaire : 15 à 30 kV induits au secondaire', 'Il distribue la haute tension', 'Il met la magnéto à la masse', 'Il charge la batterie'], 'Le condensateur évite l’arc et rend l’étincelle plus franche.'),
  Q('Magnéto', 'L’accouplement à impulsion…', ['Lâche l’arbre de la magnéto près du PMH : étincelle forte et retardée au démarrage', 'Coupe l’allumage', 'Synchronise les deux magnétos', 'Refroidit la magnéto'], 'Aide au démarrage, comme le vibreur.'),
  Q('Allumage', 'Pourquoi deux magnétos ?', ['Redondance + deux étincelles par cylindre', 'Une pour chaque sens de rotation', 'Une pour le démarrage, une pour le vol', 'Pour doubler la tension'], 'Combustion plus rapide et complète, moteur plus doux.'),
  Q('Diesel', 'Sur un diesel d’avion…', ['Pas de commande de mélange : la puissance se règle par la quantité injectée', 'On appauvrit au pic d’EGT', 'Il y a deux magnétos', 'Il faut un réchauffage carbu'], 'Pas de papillon, pas de détonation en appauvrissant.'),
];

// ======================================================================= 17. HÉLICE
function propTask(ctx, T) {
  const W = ctx.W;
  const sm = slider(T.lab, { label: 'Manette des gaz (MAP)', min: 12, max: 29, step: 0.5, value: 20, unit: 'inHg', fmt: fmt1 }), sr = slider(T.lab, { label: 'Manette d’hélice (régime)', min: 1800, max: 2700, step: 50, value: 2700, unit: 'tr/min', fmt: fmtk }), sv = slider(T.lab, { label: 'Vitesse', min: 60, max: 170, step: 5, value: 90, unit: 'kt' });
  const goals = [['Règle la croisière : 24 inHg et 2 400 tr/min', (o) => o.map === 24 && o.sel === 2400], ['Sans toucher aux manettes, accélère à 160 kt', (o) => o.map === 24 && o.sel === 2400 && o.V >= 160]];
  let k = 0, b0 = null; const info = row(T.lab, 'goals'), hold = holder(T, 900); let acc = 0, busy = false;
  return loop((dt) => {
    const map = sm.get(), sel = sr.get(), V = sv.get(), raw = 8 + 0.12 * V + 0.6 * (map - 15) - 0.009 * (sel - 2000), beta = clamp(raw, 10, 42), rpm = raw < 10 ? sel - (10 - raw) * 70 : sel;
    W.setProp(rpm, beta);
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    if (k === 1 && b0 === null) b0 = beta;
    const o = { map, sel, V };
    if (k < goals.length && goals[k][1](o) && !busy) { busy = true; setTimeout(() => { busy = false; if (goals[k] && goals[k][1]({ map: sm.get(), sel: sr.get(), V: sv.get() })) { k++; ctx.sfx('tick'); } }, 600); }
    info.innerHTML = goals.map((g, i) => `<div>${i < k ? '✅' : i === k ? '👉' : '⬜'} ${g[0]}</div>`).join('');
    T.art.innerHTML = svg(340, 160, `${gauge(60, 70, 44, rpm, 0, 3000, 'tr/min', { zones: [[2000, 2700, '#62e3a0']], fmt: (v) => fmtk(Math.round(v / 10) * 10) })}${gauge(170, 70, 44, map, 10, 35, 'MAP (inHg)', { fmt: fmt1 })}
      <g transform="translate(282 62)"><line x1="-46" y1="0" x2="46" y2="0" stroke="rgba(255,255,255,.2)" stroke-dasharray="4 4"/><g transform="rotate(${-beta})"><path d="M-34,0 Q-26,-8 4,-6 L34,-1 Q36,0 34,1 L4,4 Q-26,5 -34,0Z" fill="#cfd8e6"/></g>${arrow(0, 40, 0, 18, '#5fd6ff', 2)}</g>
      ${text(282, 122, `calage ${Math.round(beta)}°`, { s: 13, w: 800 })}${text(282, 140, raw <= 10 ? 'butée petit pas !' : beta >= 42 ? 'grand pas max' : 'régulateur actif', { s: 10.5, c: raw <= 10 ? '#ffc35c' : '#93a1bd' })}${text(110, 152, `${V} kt`, { s: 12, w: 800, c: '#5fd6ff' })}`);
    hold(k >= goals.length, `Le régime n’a pas bougé : le régulateur a augmenté le pas (${Math.round(b0 || 0)}° → ${Math.round(beta)}°). Manette d’hélice = régime, manette des gaz = MAP.`);
  });
}
function featherTask(ctx, T) {
  const W = ctx.W; let pos = 0, rpm = 2400, beta = 18, acc = 0;
  const sp = seg(T.lab, 'Manette d’hélice', ['PLEIN AVANT', 'CROISIÈRE', 'TOUT ARRIÈRE', 'DRAPEAU (au-delà du cran)'], 1, (v) => { pos = v; });
  const r = row(T.lab); button(r, '⛔ Couper carburant et allumage', (b) => { b.disabled = true; dead = true; }); let dead = false;
  return loop((dt) => {
    const tb = pos === 3 ? 88 : pos === 0 ? 14 : pos === 1 ? 20 : 30; beta += (tb - beta) * Math.min(1, dt * 1.5);
    const tr = pos === 3 ? 0 : dead ? 900 : [2700, 2400, 1900][pos]; rpm += (tr - rpm) * Math.min(1, dt * 1.2);
    W.setProp(rpm, beta); acc += dt; if (acc < 1 / 20) return; acc = 0;
    T.art.innerHTML = svg(340, 140, `${gauge(80, 70, 48, rpm, 0, 3000, 'tr/min', { fmt: (v) => fmtk(Math.round(v / 10) * 10) })}<g transform="translate(240 66)"><g transform="rotate(${-beta})"><path d="M-40,0 Q-30,-9 5,-7 L40,-1 Q42,0 40,1 L5,5 Q-30,6 -40,0Z" fill="#cfd8e6"/></g>${arrow(0, 50, 0, 26, '#5fd6ff', 2)}</g>
      ${text(240, 130, `calage ${Math.round(beta)}°${beta > 80 ? ' : DRAPEAU' : ''}`, { s: 13, w: 800, c: beta > 80 ? '#62e3a0' : '#fff' })}${text(80, 136, dead ? 'moteur coupé' : 'moteur en panne', { s: 11, c: '#ff6a4d' })}`);
    T.say(dead && pos !== 3 ? 'L’hélice moulinet et freine l’avion : mets-la en drapeau !' : '');
    if (dead && pos === 3 && beta > 85 && !T.isDone()) T.win('Pales de profil (~90°) : traînée minimale, l’hélice s’arrête. Manette au-delà du cran + carburant + allumage coupés. Une perte d’huile sur une hélice simple effet, elle, envoie vers le grand pas.');
  });
}
function turboTask(ctx, T) {
  const sa = slider(T.lab, { label: 'Altitude (plein gaz)', min: 0, max: 24000, step: 500, value: 2000, unit: 'ft', fmt: fmtk }, draw);
  const hold = holder(T, 900), CR = 16000;
  function draw() {
    const h = sa.get(), na = 29.9 - h / 1000, tu = h <= CR ? 29.5 : 29.5 - (h - CR) / 1000, wg = h <= CR ? Math.round(100 - h / CR * 100) : 0;
    T.art.innerHTML = svg(340, 160, `${gauge(64, 70, 44, tu, 10, 35, 'MAP turbo', { zones: [[29, 30, '#62e3a0']], fmt: fmt1 })}${gauge(170, 70, 44, na, 10, 35, 'MAP atmosphérique', { fmt: fmt1 })}
      ${vbar(272, 24, 26, 92, wg, 0, 100, 'waste gate', wg ? '#ffc35c' : '#62e3a0', { val: wg + ' %' })}${text(170, 148, h >= CR ? `Au-dessus de l’altitude critique (${fmtk(CR)} ft) : la MAP baisse` : 'Le turbo tient la MAP du niveau de la mer', { s: 11.5, c: '#cdd7ea' })}`);
    hold(h >= CR && h <= CR + 1000, 'Altitude critique : la waste gate est complètement fermée, tous les gaz passent dans la turbine. Au-dessus, la MAP baisse comme sur un moteur atmosphérique.');
  }
  draw();
}
const heliceTasks = [
  { tag: 'Vitesse constante', q: 'Règle la croisière, puis accélère sans toucher aux manettes : regarde l’hélice 3D et le calage.', task: propTask, why: 'La vitesse augmente → le régulateur augmente le pas → le régime reste constant.' },
  { tag: 'Drapeau', q: 'Panne moteur sur bimoteur : coupe le moteur et mets l’hélice en drapeau.', task: featherTask, why: 'Mise en drapeau automatique : capteur de couple négatif ou de chute de pression d’huile.' },
  { tag: 'Turbo', q: 'Moteur turbocompressé : monte jusqu’à l’altitude critique.', task: turboTask, why: 'Altitude-boosted : MAP constante jusqu’à l’altitude critique. Intercooler : air plus dense, moins de détonation.' },
  { tag: 'Pertes de puissance', q: 'Classe les facteurs, du plus pénalisant au moins pénalisant.', task: orderTask(['Altitude densité', 'Température', 'Pression', 'Contre-pression d’échappement', 'Humidité']), why: '~3 % par 1 000 ft (jusqu’à ~8 000 ft), ~1 % par 3 °C au-dessus d’ISA, humidité 1 à 3 %.' },
];
const heliceItems = [
  Q('Régulateur', 'Le régime dépasse la valeur réglée. Le régulateur…', ['Envoie plus d’huile : grand pas, plus de charge, le régime baisse', 'Passe au petit pas', 'Coupe l’allumage', 'Met en drapeau'], 'Régime trop bas : moins d’huile, la force centrifuge des pales ramène au petit pas.'),
  Q('Simple effet', 'Hélice simple effet : la pression d’huile disparaît. Les pales vont…', ['Vers le grand pas', 'Vers le petit pas', 'En drapeau automatique', 'En reverse'], 'Sans huile, le moment de torsion centrifuge pousse vers le grand pas.'),
  Q('Double effet', 'L’hélice double effet…', ['Utilise l’huile dans les deux sens : réponse rapide (gros avions)', 'N’a pas besoin d’huile', 'Est plus simple', 'Ne peut pas se mettre en drapeau'], 'Simple effet : simple et léger, avions légers.'),
  Q('Instruments', 'Pourquoi un manomètre de MAP avec une hélice à vitesse constante ?', ['Le régime seul ne dit plus la puissance', 'Pour régler le pas', 'Pour surveiller l’huile', 'Pour le givrage carbu seulement'], 'Le couplemètre donne la puissance réelle sur les turbopropulseurs.'),
  Q('Synchro', 'Le synchrophasage, c’est…', ['La synchronisation des régimes + un décalage angulaire fixe des pales', 'La même chose que la synchronisation', 'Un réglage de mixture', 'Un mode de mise en drapeau'], 'Encore moins de vibrations et de bruit en cabine.'),
  Q('Butée', 'La butée de petit pas (verrou centrifuge) sert…', ['À bloquer les pales au petit pas à bas régime', 'À limiter le grand pas en croisière', 'À la reverse', 'À la synchronisation'], 'Elle évite traînée et survitesse au démarrage, et se libère à haut régime.'),
  Q('Réducteur', 'Moteur à 5 500 tr/min, réducteur 0,5 : régime de l’hélice ?', ['2 750 tr/min', '11 000 tr/min', '5 500 tr/min', '1 375 tr/min'], 'Une hélice est efficace vers 2 000 à 2 700 tr/min ; plus vite, les bouts de pales deviennent supersoniques.'),
  Q('Cyclage', 'Le cyclage de l’hélice après le démarrage sert…', ['À purger l’air du moyeu et vérifier le régulateur', 'À chauffer l’huile du réducteur', 'À tester les magnétos', 'À mettre en drapeau'], 'Plein avant, tout arrière (le régime baisse, la pression d’huile monte), plein avant.'),
  Q('Reverse', 'La plage bêta / reverse est interdite en vol par…', ['Un contacteur train', 'Le régulateur', 'La butée de grand pas', 'Le synchrophaseur'], 'Pales à −10 à −20° en reverse.'),
  Q('Air', 'Terrain à 2 000 ft par 30 °C : altitude densité ?', ['Environ 5 000 ft : 85 à 90 % de la puissance', '2 000 ft', '0 ft', '10 000 ft'], 'L’altitude densité est le facteur le plus pénalisant.'),
  Q('Suralimentation', 'Le compresseur mécanique (supercharger)…', ['N’a pas de temps de réponse mais prend 10 à 30 % de la puissance', 'Récupère l’énergie de l’échappement', 'Gagne en altitude', 'N’existe pas en aviation'], 'Le turbo récupère l’énergie perdue à l’échappement : meilleur rendement, mais turbo lag.'),
  Q('FADEC', 'Avec un FADEC sur un moteur à pistons…', ['Plus de manette de mélange ni de magnétos : une seule manette', 'Il faut régler la mixture plus souvent', 'Une panne simple arrête le moteur', 'Il n’y a plus de redondance'], 'Double canal, alimentations redondantes, capteurs doublés.'),
  Q('Conduite', 'Pour augmenter la puissance…', ['Enrichir d’abord, puis les gaz', 'Les gaz d’abord, puis enrichir', 'Réduire le régime d’abord', 'Couper la pompe électrique'], 'Pour réduire, la règle classique est gaz, puis hélice, puis mélange.'),
];

// ======================================================================= 18. LA TRAVERSÉE DU RÉACTEUR
// stations le long de l'axe (z local du modèle), valeurs indicatives d'un double flux moderne
const ST = [[-3.0, 'Entrée d’air'], [-2.2, 'Soufflante'], [-1.45, 'Compresseur BP'], [-0.9, 'Compresseur HP'], [0.45, 'Diffuseur'], [0.7, 'Chambre de combustion'], [1.45, 'Turbine HP'], [1.9, 'Turbine BP'], [2.75, 'Tuyère'], [3.6, 'Sortie']];
const PT = [[-3.0, 1.0], [-2.2, 1.5], [-1.45, 2.4], [-0.9, 3.2], [0.35, 40], [0.6, 39], [1.35, 37.5], [1.85, 9], [2.65, 1.8], [3.0, 1.3], [3.6, 1.0]];
const TT = [[-3.0, 15], [-2.2, 50], [-1.45, 110], [-0.9, 160], [0.35, 620], [0.6, 620], [1.35, 1550], [1.85, 1050], [2.65, 620], [3.6, 560]];
const VT = [[-3.0, 180], [-2.2, 160], [-0.9, 150], [0.35, 150], [0.6, 40], [1.2, 40], [1.35, 110], [1.85, 250], [2.65, 300], [3.6, 520]];
function traverseTask(ctx, T) {
  const W = ctx.W; W.setTF({ spin: 1, flame: 1, flow: 1 });
  const goals = [['Là où la pression est maximale', (z) => z >= 0.2 && z <= 0.65], ['Là où la pression reste presque constante pendant que la température monte', (z) => z >= 0.7 && z <= 1.3], ['Là où la température est maximale', (z) => z >= 1.2 && z <= 1.5], ['Là où la vitesse est maximale', (z) => z >= 3.3]];
  let k = 0, busy = false; const info = row(T.lab, 'goals');
  const s = slider(T.lab, { label: 'Position de la particule d’air', min: 0, max: 100, value: 0, unit: '%' }, draw);
  const hold = holder(T, 600);
  function draw() {
    const z = -3 + s.get() / 100 * 6.6; W.setMarker(z);
    const X = (zz) => 20 + (zz + 3) / 6.6 * 300, lines = [[PT, 40, '#5fd6ff', 'pression'], [TT, 1600, '#ff8a3c', 'température'], [VT, 550, '#62e3a0', 'vitesse']];
    let body = '';
    for (const [tb, mx, col] of lines) { let p = ''; for (let zz = -3; zz <= 3.6; zz += 0.05) p += (p ? 'L' : 'M') + X(zz).toFixed(1) + ',' + (130 - tab(tb, zz) / mx * 100).toFixed(1); body += `<path d="${p}" stroke="${col}" stroke-width="2.5" fill="none"/>`; }
    const name = ST.reduce((a, b) => (z >= b[0] - 0.05 ? b : a))[1];
    T.art.innerHTML = svg(340, 196, `${body}<line x1="${X(z)}" x2="${X(z)}" y1="22" y2="134" stroke="#ffc35c" stroke-width="2"/>${text(clamp(X(z), 60, 280), 18, name, { s: 11.5, w: 800, c: '#ffc35c' })}
      ${text(20, 156, `P ${fmt1(tab(PT, z))} bar`, { s: 12.5, w: 800, a: 'start', c: '#5fd6ff' })}${text(140, 156, `T ${fmtk(tab(TT, z))} °C`, { s: 12.5, w: 800, a: 'start', c: '#ff8a3c' })}${text(250, 156, `V ${fmtk(tab(VT, z))} m/s`, { s: 12.5, w: 800, a: 'start', c: '#62e3a0' })}
      ${text(170, 186, 'valeurs indicatives d’un double flux moderne (flux chaud)', { s: 10, c: '#93a1bd' })}`);
    info.innerHTML = goals.map((g, i) => `<div>${i < k ? '✅' : i === k ? '👉' : '⬜'} ${g[0]}</div>`).join('');
    if (k < goals.length && goals[k][1](z) && !busy) { busy = true; setTimeout(() => { busy = false; const z2 = -3 + s.get() / 100 * 6.6; if (goals[k] && goals[k][1](z2)) { k++; ctx.sfx('tick'); draw(); } }, 700); }
    hold(k >= goals.length, 'Compresseur : P et T montent. Chambre : P presque constante (perte 3 à 7 %), T qui monte fortement, vitesse faible. Turbine : P et T baissent. Tuyère : la vitesse augmente fortement.');
  }
  draw();
  return () => W.setMarker(null);
}
function thrustTask(ctx, T) {
  const s = slider(T.lab, { label: 'Vitesse d’éjection Ve', min: 200, max: 800, step: 10, value: 300, unit: 'm/s' }, draw);
  const hold = holder(T, 800);
  function draw() {
    const Ve = s.get(), F = 80 * (Ve - 150);
    T.art.innerHTML = svg(340, 130, `${text(170, 38, `F = ṁ × (Ve − V0) = 80 × (${Ve} − 150)`, { s: 14, c: '#93a1bd', w: 700 })}${text(170, 82, `${fmtk(F)} N`, { s: 30, w: 850, c: F === 28000 ? '#62e3a0' : '#fff' })}${text(170, 112, 'ṁ = 80 kg/s · V0 = 150 m/s · pas de poussée de pression', { s: 11, c: '#93a1bd' })}`);
    hold(F === 28000, '80 × 350 = 28 000 N = 28 kN. Plus l’avion va vite (V0), plus l’écart Ve − V0 diminue… mais le bélier augmente le débit : la poussée reste à peu près constante en subsonique.');
  }
  draw();
}
const traverseeTasks = [
  { tag: 'La traversée', q: 'Fais voyager une particule d’air dans le réacteur en coupe (anneau jaune en 3D) et trouve chaque endroit.', task: traverseTask, why: 'Entrée d’air → compresseur → chambre → turbine → tuyère. La turbine entraîne le compresseur ; la tuyère accélère les gaz.' },
  { tag: 'Formule de poussée', q: 'ṁ = 80 kg/s, V0 = 150 m/s : règle Ve pour obtenir 28 kN.', task: thrustTask, why: 'F = ṁ × (Ve − V0) + (Pe − P0) × Ae. En subsonique, la poussée de pression est souvent petite.' },
  { tag: 'Pompage', q: 'Range chaque élément : signe, cause ou parade du pompage ?', task: sortTask([
    ['Détonation forte et flammes à l’entrée d’air', 0, 'Signe.'], ['Accélération brutale de la manette', 1, 'Cause.'], ['Vannes de décharge entre deux étages', 2, 'Parade : on évacue de l’air.'],
    ['Pic d’EGT et chute rapide de N1/N2', 0, 'Signe.'], ['Faible vitesse et régime élevé', 1, 'Cause.'], ['IGV et stators à calage variable', 2, 'Parade : moins d’incidence à bas régime.'], ['Moteur multi-corps', 2, 'Parade.'],
  ], ['Signe', 'Cause', 'Parade'], { n: 6 }), why: 'Pompage : l’écoulement s’arrête ou s’inverse dans tout le compresseur. Décrochage : décollement local sur une aube.' },
];
const traverseeItems = [
  Q('Poussée', 'Pourquoi la poussée d’un turboréacteur reste-t-elle à peu près constante en subsonique ?', ['L’effet de vitesse (−) et la compression dynamique (+) s’équilibrent', 'Le FADEC la corrige', 'La tuyère est bloquée', 'Le débit d’air ne change pas'], 'Poussée au décollage ≈ en montée ≈ en croisière, jusqu’aux effets transsoniques.'),
  Q('Cycle', 'Le cycle d’un réacteur est…', ['Continu : tout se passe en même temps à des endroits différents', 'Intermittent comme un moteur à pistons', 'À volume constant', 'À deux temps'], 'Admission, compression, combustion, détente en même temps.'),
  Q('BPR', 'Flux froid 550 kg/s, flux chaud 50 kg/s : taux de dilution ?', ['11:1', '1:11', '600', '10:1'], 'BPR = flux secondaire (froid) / flux primaire (chaud). A320neo ≈ 11:1.'),
  Q('Types', 'Le turbopropulseur tire de son hélice…', ['80 à 99 % de sa poussée', '20 %', '50 %', 'Rien, l’hélice ne sert qu’au refroidissement'], 'Meilleur rendement propulsif à basse vitesse (< ~400 kt).'),
  Q('Corps', 'La turbine libre…', ['Est sur un arbre indépendant du générateur de gaz : démarrage plus facile', 'Est sur le même arbre que le compresseur', 'N’a pas de roulement', 'Fait tourner le compresseur HP'], 'N1 (générateur de gaz) et N2 (turbine de puissance) sans lien mécanique.'),
  Q('Turbopropulseur', '1 000 SHP sur l’arbre + 200 dus au jet : EHP ?', ['1 200', '800', '1 000', '200'], 'EHP = SHP + puissance due au jet résiduel.'),
  Q('Rendements', 'Le rendement propulsif est bon quand…', ['Ve est proche de la vitesse de l’avion', 'Ve est très supérieure à V0', 'Le taux de compression est élevé', 'La TIT est faible'], 'D’où l’intérêt du double flux et de l’hélice à vitesse modérée.'),
  Q('Limites', 'Qu’est-ce qui limite la poussée maximale ?', ['La TIT (température d’entrée turbine)', 'La vitesse de la soufflante', 'La pression d’huile', 'Le diamètre de l’entrée d’air'], 'Le point le plus chaud du moteur : 1 400 à 1 700 °C avec refroidissement.'),
  Q('Compresseur', 'Le compresseur centrifuge…', ['Donne 4 à 6:1 par étage et craint peu les corps étrangers', 'Donne 1,2 à 1,5:1 par étage', 'Est réservé aux gros réacteurs', 'Est très sensible aux débris'], 'Axial : petit taux par étage, beaucoup d’étages, sensible.'),
  Q('Compresseur', 'Pourquoi la veine du compresseur est-elle convergente ?', ['Pour garder une vitesse axiale constante malgré la compression', 'Pour accélérer l’air', 'Pour réduire la masse', 'Pour la combustion'], 'Sinon les aubes décrochent.'),
  Q('Compresseur', 'Cliquetis du fan au sol quand il tourne lentement :', ['Normal : les aubes bougent dans leur logement', 'Roulement cassé', 'Pompage', 'Corps étranger'], 'Pas de force centrifuge pour les plaquer.'),
  Q('Chambre', 'L’air primaire de la chambre…', ['20 à 30 %, brûle à la stœchiométrie', '70 à 80 %, refroidit', 'Sert aux allumeurs', 'Contourne la chambre'], 'Air secondaire (70 à 80 %) : dilution et refroidissement. Richesse globale 40 à 60:1.'),
  Q('Chambre', 'À quoi sert la vrille d’entrée (swirler) ?', ['Créer une recirculation qui accroche la flamme', 'Refroidir les aubes', 'Accélérer le gaz', 'Doser le carburant'], 'Meilleur mélange, flamme stable, chambre compacte.'),
  Q('Chambre', 'La chambre standard moderne est…', ['Annulaire', 'Tubulaire', 'Tubo-annulaire', 'À flux inversé'], 'Température homogène, moins de pertes. Flux inversé : petits moteurs, APU.'),
  Q('Turbine', 'Turbine à action : où se fait la détente ?', ['Dans le distributeur (stator)', 'Dans le rotor', 'Dans la tuyère', 'Dans la chambre'], 'Réaction : aussi dans le rotor. Action-réaction : le plus courant.'),
  Q('Tuyère', 'Tuyère bloquée (choked) :', ['Mach 1 au col, débit maximal', 'Débit nul', 'Pompage', 'Post-combustion obligatoire'], 'Pour un jet supersonique : tuyère convergente-divergente.'),
  Q('Bruit', 'Qu’est-ce qui réduit le bruit de jet ?', ['Un fort taux de dilution et des chevrons', 'Une tuyère plus petite', 'Plus de TIT', 'Moins de flux froid'], 'Le flux froid entoure le jet chaud : moins d’écart de vitesse.'),
];

// ======================================================================= 19. DÉMARRAGE ET EXPLOITATION
function startTask(ctx, T) {
  const W = ctx.W; let n2, egt, peak, fuel, ign, starter, lit, wet, cutAt, t, over, fuelAt, acc = 0;
  const r = row(T.lab, 'ovh'); const bs = toggle(r, 'DÉMARREUR', false), bi = toggle(r, 'ALLUMAGE', false), bf = toggle(r, 'CARBURANT (HP)', false);
  const rb = row(T.lab); const retry = button(rb, '↻ Recommencer', () => reset(), ''); retry.style.display = 'none';
  function reset() { n2 = 0; egt = 20; peak = 20; fuel = ign = starter = lit = false; wet = 0; cutAt = null; t = 0; over = ''; fuelAt = null; bs.set(false); bi.set(false); bf.set(false); retry.style.display = 'none'; T.say('💡 Démarreur, allumage… et le carburant au bon moment.'); }
  reset();
  const fail = (m) => { over = m; retry.style.display = ''; ctx.sfx('ko'); T.say('❌ ' + m); bf.set(false); bs.set(false); };
  return loop((dt) => {
    if (!over) {
      t += dt; starter = bs.get(); ign = bi.get();
      if (bf.get() && !fuel) { fuel = true; fuelAt = n2; }
      if (!bf.get()) fuel = false;
      if (starter === false && cutAt === null && n2 > 2 && lit) cutAt = n2;
      const starterA = starter ? Math.max(0.6, (25 - n2) * 0.45) : 0;
      if (fuel && ign && !lit && n2 >= 10) lit = true;
      if (fuel && !lit) wet += dt;
      const comb = lit ? (n2 < 45 ? (starter ? 2.2 : -1.2) : 2.8) * (n2 < 58 ? 1 : 0) : 0;
      n2 = Math.max(0, n2 + (starterA + comb - (lit ? 0 : n2 * 0.08)) * dt * (lit && n2 >= 45 ? 1.4 : 1));
      if (lit && n2 > 58) n2 = 58 + (n2 - 58) * 0.9;
      const early = fuelAt !== null && fuelAt < 14, eT = lit ? (n2 < 45 ? (early ? 980 : 600) + (45 - n2) * (early ? 6 : 1.5) : 470) : 20;
      egt += (eT - egt) * Math.min(1, dt * (lit ? 0.9 : 0.5)); peak = Math.max(peak, egt);
      if (peak > 725) fail('Démarrage chaud : l’EGT dépasse le trait rouge. Carburant ouvert trop tôt (pas assez d’air).');
      else if (wet > 4 && !ign) fail('Faux démarrage humide : carburant sans allumage, l’EGT ne monte pas. Il faut ventiler.');
      else if (lit && !starter && n2 < 45 && t > 2 && cutAt !== null && cutAt < 45) { if (n2 < cutAt - 4 || (n2 < 42 && t > 8)) fail('Démarrage bloqué (hung) : démarreur coupé avant le régime autonome, N2 n’accélère plus.'); }
      if (starter && n2 > 55) { bs.set(false); T.say('Coupure auto du démarreur à 55 % N2.'); }
      if (lit && n2 >= 57.5 && !starter && !T.isDone()) T.win(`Light-off à ${Math.round(fuelAt)} % N2, pic d’EGT ${Math.round(peak)} °C, ralenti stabilisé. Le régime autonome est le régime où le moteur accélère seul, sans démarreur.`);
      W.setTF({ spin: n2 / 58, flame: lit ? 0.4 + n2 / 100 : 0, flow: n2 / 58 });
    }
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    T.art.innerHTML = svg(340, 154, `${gauge(60, 70, 44, n2, 0, 110, 'N2 (%)', { zones: [[15, 20, '#5fd6ff'], [45, 50, '#62e3a0']], fmt: (v) => Math.round(v) + '%' })}${gauge(170, 70, 44, n2 * (lit ? 0.38 : 0.2), 0, 110, 'N1 (%)', { fmt: (v) => Math.round(v) + '%' })}
      ${gauge(280, 70, 44, egt, 0, 900, 'EGT (°C)', { zones: [[725, 900, '#ff6a4d']], fmt: (v) => Math.round(v) })}${text(170, 146, 'N2 : bleu = carburant, vert = autonome · EGT : rouge = limite', { s: 9.5, c: '#93a1bd' })}${lit ? text(170, 14, '🔥 LIGHT-OFF', { s: 11, w: 850, c: '#ffc35c' }) : ''}`);
  });
}
const FAILS = [['Pas d’allumage, l’EGT reste basse, N1 ne monte pas.', 0], ['Flammes à l’échappement, EGT haute, N1 qui ne monte pas.', 1], ['L’EGT monte très vite et dépasse le trait rouge.', 2], ['N1 se stabilise sous le régime autonome.', 3]];
const FN = ['Faux démarrage', 'Feu de tuyère (torching)', 'Démarrage chaud (hot start)', 'Démarrage bloqué (hung start)'];
function reverseTask(ctx, T) {
  const W = ctx.W; let V = 140, rev = 0, revT = 0, ok1 = false, acc = 0, done = false, ground = false;
  const r = row(T.lab); const tr = toggle(r, 'REVERSE', false, (v) => { if (v && !ground) { tr.set(false); T.say('❌ Contacteur train : reverse impossible en l’air.'); return; } revT = v ? 1 : 0; });
  return loop((dt) => {
    if (done) return;
    if (!ground) { V -= dt * 3; if (V <= 132) ground = true; } else V = Math.max(0, V - dt * (6 + rev * 7));
    rev += Math.sign(revT - rev) * Math.min(Math.abs(revT - rev), dt * 0.8); W.setReverser(rev); W.setFan(0.3 + rev * 0.5);
    if (rev > 0.98 && V > 80) ok1 = true;
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    const transit = rev > 0.02 && rev < 0.98, dep = rev >= 0.98;
    T.art.innerHTML = svg(340, 120, `${text(80, 52, `${Math.round(V)} kt`, { s: 30, w: 850 })}${text(80, 78, ground ? 'au sol : roues comprimées' : 'arrondi…', { s: 12, c: '#93a1bd' })}
      ${lamp(190, 26, 60, 28, 'REV', transit, '#ffc35c')}${lamp(260, 26, 60, 28, 'REV', dep, '#34ff6a')}${text(220, 74, 'ambre = transit', { s: 10, c: '#ffc35c' })}${text(290, 74, 'vert = déployé', { s: 10, c: '#62e3a0' })}`);
    T.say(!ground ? 'Attends le toucher.' : !ok1 ? 'Sors les inverseurs !' : V > 75 ? 'Rentre-les avant 70 kt.' : '');
    if (ok1 && rev < 0.02 && V <= 75 && V > 40) { done = true; T.win('Inverseurs sortis après le toucher (contacteur train), rentrés à basse vitesse : sous ~60 à 80 kt, risque d’ingestion de débris, d’instabilité et de pompage.'); }
    if (ok1 && V <= 40 && rev > 0.02) { done = true; T.fail('Encore en reverse à basse vitesse : ingestion de débris, instabilité directionnelle, pompage.'); }
    if (!ok1 && V < 80 && ground) { done = true; T.fail('Pas d’inverseurs : les freins ont tout fait.'); }
  });
}
const startTasks = [
  { tag: 'Démarrage', q: 'Démarre le réacteur à la main : démarreur, allumage, carburant… au bon moment (regarde la 3D).', task: startTask, hint: 'Carburant vers 15 à 20 % de N2.', why: 'Démarreur ON → carburant vers 15-20 % N2 → allumage (EGT qui monte) → régime autonome → coupure du démarreur.' },
  { tag: 'Démarrages ratés', q: 'Associe chaque symptôme au bon démarrage raté.', task: sortTask(FAILS.map(([t, i]) => [t, i]), FN, { tol: 0 }), why: 'Hot start = EGT qui s’emballe ; hung start = régime bloqué sous l’autonome ; faux démarrage = pas d’allumage.' },
  { tag: 'Inverseurs', q: 'Atterrissage : sors les inverseurs après le toucher, rentre-les avant 70 kt.', task: reverseTask, why: 'Inverseurs à grilles sur le flux froid : le capot recule (regarde le réacteur droit en 3D).' },
];
const startItems = [
  Q('Carburant', 'La pompe BP du moteur sert à…', ['Gaver la pompe HP pour éviter la cavitation', 'Doser le carburant', 'Remplir les réservoirs', 'Refroidir l’huile'], 'La pompe HP envoie le carburant haute pression au régulateur et aux injecteurs.'),
  Q('FCU', 'Pendant une accélération, le FCU…', ['Limite le débit pour éviter le pompage', 'Ouvre en grand le carburant', 'Coupe l’allumage', 'Ferme les vannes de décharge'], 'Il dose, garde la richesse, protège et corrige selon l’altitude et la température.'),
  Q('FADEC', 'Le FADEC moderne est…', ['Double canal, sans secours hydromécanique', 'Simple canal avec secours mécanique', 'Hydromécanique', 'Débrayable par le pilote'], 'Deux canaux A et B, chacun avec son alternateur à aimant permanent (PMA).'),
  Q('FADEC', 'Un capteur N2 tombe en panne. Que fait le FADEC ?', ['Il rejette la donnée fausse et prend celle de l’autre canal', 'Il coupe le moteur', 'Il passe en manuel', 'Il fige la poussée'], 'Pas de perte de contrôle.'),
  Q('Huile', 'Les joints labyrinthe sont pressurisés par…', ['L’air du compresseur', 'L’huile', 'Le carburant', 'L’azote'], 'L’huile ne fuit pas dans la veine, les gaz n’entrent pas dans l’huile.'),
  Q('Huile', 'Les détecteurs de limaille (bouchons magnétiques) donnent…', ['Une alerte précoce d’usure', 'La pression d’huile', 'La température d’huile', 'Le niveau'], 'Ils récupèrent les particules métalliques.'),
  Q('Accessoires', 'Le boîtier d’accessoires est entraîné par…', ['Le corps HP', 'Le corps BP', 'La soufflante', 'Le démarreur seul'], 'Il entraîne pompes, génératrices et démarreur.'),
  Q('Allumage', 'Quand utilise-t-on l’allumage continu ?', ['En givrage, forte pluie ou turbulence', 'Toujours en croisière', 'Au roulage', 'Jamais en vol'], 'Le FADEC peut aussi rallumer automatiquement après une extinction.'),
  Q('Démarreur', 'Le démarreur pneumatique est alimenté par…', ['L’APU, le groupe de parc ou le cross-bleed', 'La batterie', 'La RAT', 'Le TRU'], 'Une turbine à air qui fait tourner le corps HP.'),
  Q('Régimes', 'La poussée MTO est limitée en temps à…', ['En général 5 min', '30 s', '30 min', 'Sans limite'], 'MCT : sans limite de temps (montée, croisière, vol sur un moteur).'),
  Q('Ralentis', 'Pourquoi le ralenti vol est-il plus haut que le ralenti sol ?', ['Pour accélérer vite en remise de gaz', 'Pour moins de bruit', 'Pour économiser', 'Pour refroidir les freins'], 'Aussi assez d’air pour l’antigivrage, l’électricité et l’hydraulique.'),
  Q('Paramètres', 'Le paramètre de poussée principal d’un double flux ?', ['N1', 'EGT', 'Couple', 'Débit carburant'], 'EGT/ITT : paramètre limitant. Couple : référence des turbopropulseurs.'),
  Q('EGT', 'L’EGT fait un pic pendant une accélération.', ['C’est normal : le carburant augmente plus vite que l’air', 'C’est un démarrage chaud', 'C’est un pompage', 'Le FADEC est en panne'], 'En décélération, mélange pauvre : l’EGT baisse puis se stabilise.'),
  Q('Pannes', 'EGT haute avec N1 bas :', ['Turbine endommagée', 'Roulement', 'Lubrification', 'Réducteur'], 'Débit plus fort pour la même poussée : rendement dégradé.'),
  Q('Pannes', 'Fuite de l’échangeur avec pression carburant > huile :', ['Le carburant dilue l’huile : risque de feu', 'L’huile pollue le carburant', 'Rien de grave', 'Le moteur accélère'], 'Huile > carburant : l’huile pollue le carburant, moteur rugueux.'),
  Q('Turbopropulseur', 'En plage bêta…', ['La manette commande directement le pas, sans régulateur', 'Le régulateur gère le pas', 'L’hélice est en drapeau', 'On est en croisière'], 'Bêta par erreur en vol : traînée brutale, lacet et roulis violents.'),
  Q('Rallumage', 'La limite basse de l’enveloppe de rallumage, c’est…', ['La vitesse mini pour un moulinet suffisant', 'L’altitude max', 'La TIT max', 'Le régime autonome'], 'Limite haute : altitude max où l’air est assez dense.'),
];

// ======================================================================= 20. PERFORMANCES ET APU
const thrustAt = (oat) => (oat <= 30 ? 100 : 100 - 1.0 * (oat - 30)), titAt = (oat) => (oat <= 30 ? 950 - 5 * (30 - oat) : 950);
function flatArt(oat, mark) {
  const X = (o) => 30 + (o + 20) / 70 * 290;
  let th = '', ti = ''; for (let o = -20; o <= 50; o += 1) { th += (th ? 'L' : 'M') + X(o).toFixed(1) + ',' + (40 + (100 - thrustAt(o)) * 3.2).toFixed(1); ti += (ti ? 'L' : 'M') + X(o).toFixed(1) + ',' + (150 - (titAt(o) - 700) / 260 * 90).toFixed(1); }
  return svg(340, 190, `<path d="${th}" stroke="#62e3a0" stroke-width="3" fill="none"/><path d="${ti}" stroke="#ff8a3c" stroke-width="3" fill="none"/>
    ${text(40, 30, 'poussée', { s: 11, a: 'start', c: '#62e3a0', w: 800 })}${text(40, 172, 'TIT', { s: 11, a: 'start', c: '#ff8a3c', w: 800 })}<line x1="${X(oat)}" x2="${X(oat)}" y1="24" y2="164" stroke="#ffc35c" stroke-width="2"/>
    ${text(X(oat), 184, `${oat} °C → ${fmt1(thrustAt(oat))} %`, { s: 12, w: 800, c: '#ffc35c' })}${mark || ''}`);
}
function flatTask(ctx, T) {
  const s = slider(T.lab, { label: 'Température extérieure (OAT)', min: -20, max: 50, step: 1, value: 0, unit: '°C' }, draw);
  const hold = holder(T, 900);
  function draw() { T.art.innerHTML = flatArt(s.get()); hold(s.get() >= 29 && s.get() <= 31, 'Sous 30 °C, la poussée est plafonnée et la TIT monte avec l’OAT. À 30 °C, la TIT atteint sa limite. Au-dessus, la TIT est figée : la poussée baisse.'); }
  draw();
}
function flexTask(ctx, T) {
  const s = slider(T.lab, { label: 'Température supposée (FLEX)', min: 18, max: 60, step: 1, value: 18, unit: '°C' }, draw);
  const hold = holder(T, 900);
  function draw() { const X = (o) => 30 + (o + 20) / 70 * 290; T.art.innerHTML = flatArt(Math.min(50, s.get()), `<line x1="${X(18)}" x2="${X(18)}" y1="24" y2="164" stroke="#5fd6ff" stroke-dasharray="4 4"/>${text(X(18), 20, 'OAT réelle 18 °C', { s: 10, c: '#5fd6ff' })}`); hold(s.get() === 40, 'On « trompe » la régulation avec 40 °C : poussée −10 %, moins d’EGT, moteur qui dure plus. Mais il garde toute sa capacité : le pilote peut pousser les manettes à fond. En DERATE, la poussée max est réellement plafonnée.'); }
  draw();
}
function bleedTask(ctx, T) {
  const r = row(T.lab); const p = toggle(r, 'PACKS', false, draw), a = toggle(r, 'ANTI-GIVRAGE', false, draw);
  const hold = holder(T, 900);
  function draw() {
    const k = (p.get() ? 1 : 0) + (a.get() ? 1.4 : 0), n1 = 85 - k * 0.4, egt = 620 + k * 18, th = 100 - k * 2.2, sfc = 0.56 * (1 + k * 0.025);
    T.art.innerHTML = svg(340, 150, `${vbar(30, 30, 30, 90, n1, 80, 86, 'N1', '#5fd6ff', { val: fmt1(n1) + '%' })}${vbar(110, 30, 30, 90, egt, 600, 680, 'EGT', '#ff8a3c', { val: Math.round(egt) + '°' })}${vbar(190, 30, 30, 90, th, 90, 100, 'poussée', '#62e3a0', { val: fmt1(th) + '%' })}${vbar(270, 30, 30, 90, sfc, 0.55, 0.6, 'conso spé.', '#ffc35c', { val: sfc.toFixed(3).replace('.', ',') })}`);
    hold(p.get() && a.get(), 'Prélever de l’air au compresseur : régime en légère baisse, EGT/TIT en hausse, poussée en baisse, consommation spécifique en hausse.');
  }
  draw();
}
const perfsTasks = [
  { tag: 'Flat rating', q: 'Fais varier l’OAT : trouve la température de flat rating.', task: flatTask, why: 'Le moteur pourrait donner plus par temps froid, mais on plafonne la poussée. Par temps chaud, c’est la TIT qui limite.' },
  { tag: 'FLEX', q: 'OAT réelle 18 °C : choisis la température supposée qui réduit la poussée de 10 %.', task: flexTask, why: 'FLEX interdit sur piste contaminée et avec risque de cisaillement de vent.' },
  { tag: 'Prélèvements', q: 'Ouvre les prélèvements d’air (packs et antigivrage) et observe le moteur.', task: bleedTask, why: 'Il faut plus de carburant pour garder la poussée.' },
];
const perfsItems = [
  Q('Altitude', 'À TAS constante, quand on monte…', ['La poussée baisse et la consommation spécifique augmente', 'La poussée augmente', 'Rien ne change', 'La consommation spécifique baisse'], 'Moins de débit massique : ~3 à 4 % de poussée en moins par 1 000 ft jusqu’à ~25 000 ft.'),
  Q('Vitesse', 'À altitude constante, la TAS augmente (subsonique). La consommation spécifique…', ['Baisse légèrement', 'Augmente fortement', 'Ne change pas', 'Double'], 'Le rendement propulsif s’améliore quand V0 se rapproche de Ve.'),
  Q('EPR', 'L’EPR, c’est…', ['Pression sortie turbine / pression entrée compresseur', 'La température d’échappement', 'Le régime du corps BP', 'Le rapport de dilution'], 'Paramètre de poussée de beaucoup d’anciens moteurs.'),
  Q('DERATE', 'La poussée détarée (DERATE)…', ['Est une réduction fixe et certifiée, par paliers (TO1, TO2)', 'Se règle en continu avec une température supposée', 'Laisse toute la poussée disponible', 'Est interdite par vent de travers'], 'Robuste et simple, mais moins optimisée.'),
  Q('FLEX', 'Quand le FLEX est-il interdit ?', ['Sur piste contaminée et avec risque de cisaillement de vent', 'Par temps froid', 'Sur piste longue', 'Avec un avion léger'], 'Parfois aussi avec l’antigivrage ON.'),
  Q('APU', 'Pourquoi l’altitude max de démarrage de l’APU est-elle plus basse que son altitude max de fonctionnement ?', ['Le démarrage demande plus de couple et plus d’air', 'Le démarreur gèle', 'C’est une limite du bruit', 'La batterie est plus faible en altitude'], 'Démarrage FL250 à FL300 ; fonctionnement FL350 à FL410.'),
  Q('APU', 'L’entrée d’air affleurante (flush) de l’APU…', ['Fait peu de traînée mais demande une porte', 'Fait beaucoup de traînée', 'N’a pas de porte', 'N’existe que sur les anciens avions'], 'L’écope (scoop) : plus de traînée, plus simple, sans porte.'),
  Q('APU', 'Lequel provoque un arrêt automatique de l’APU ?', ['Une pression d’huile basse', 'Un vol en croisière', 'La sortie des volets', 'Un démarrage moteur'], 'Aussi : EGT haute, température d’huile haute, survitesse, sous-vitesse, inversion du flux bleed, feu.'),
  Q('APU', 'Après un arrêt automatique de l’APU…', ['Il faut en général une action de maintenance avant de redémarrer', 'On le relance aussitôt', 'Il redémarre seul', 'On coupe la batterie'], 'Ces arrêts ne sont pas contournables dans la plupart des cas.'),
  Q('APU', 'Un rôle de l’APU ?', ['Fournir l’air pour démarrer les moteurs', 'Produire la poussée au décollage', 'Remplacer le train', 'Freiner l’avion'], 'Aussi : électricité au sol, clim au sol, secours électrique et pneumatique en vol.'),
];

export const SIMS_C = {
  moteur4t: { start: (ctx) => runScenario(ctx, { title: 'Le moteur ouvert', icon: '🔩', intro: '<p>Le cylindre en coupe est dans la 3D : tourne le vilebrequin et suis les soupapes, l’étincelle et les gaz. Puis taux de compression et MAP.</p>', tasks: m4Tasks, items: m4Items, n: 12 }) },
  carbu: { start: (ctx) => runScenario(ctx, { title: 'Givre au carbu', icon: '🧊', intro: '<p>Capots ouverts sur l’avion léger. Détecte un givrage carburateur au compte-tours, puis détonation, auto-allumage et feu de carbu.</p>', tasks: carbuTasks, items: carbuItems, n: 13 }) },
  mixture: { start: (ctx) => runScenario(ctx, { title: 'Le point fixe', icon: '🎚️', intro: '<p>Règle la mixture à l’EGT, fais trois essais magnétos et gère les volets de capot.</p>', tasks: melangeTasks, items: melangeItems, n: 12 }) },
  governor: { start: (ctx) => runScenario(ctx, { title: 'L’hélice à vitesse constante', icon: '🌀', intro: '<p>Manette des gaz, manette d’hélice, vitesse : regarde les pales changer de pas sur l’hélice 3D. Puis drapeau et turbo.</p>', tasks: heliceTasks, items: heliceItems, n: 13 }) },
  traversee: { start: (ctx) => runScenario(ctx, { title: 'La traversée du réacteur', icon: '🔥', intro: '<p>Le réacteur est en coupe sur son banc. Fais voyager une particule d’air de l’entrée à la tuyère et regarde pression, température et vitesse.</p>', tasks: traverseeTasks, items: traverseeItems, n: 13 }) },
  start: { start: (ctx) => runScenario(ctx, { title: 'Démarrage moteur', icon: '🔑', intro: '<p>Démarre un réacteur à la main sans démarrage chaud ni bloqué, reconnais les démarrages ratés et utilise les inverseurs.</p>', tasks: startTasks, items: startItems, n: 13 }) },
  flat: { start: (ctx) => runScenario(ctx, { title: 'Performances moteur', icon: '📈', intro: '<p>Flat rating, FLEX, prélèvements d’air : vois comment évoluent poussée et TIT. Puis l’APU.</p>', tasks: perfsTasks, items: perfsItems, n: 11 }) },
};
