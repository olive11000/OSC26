// Simus de la phase « électricité » : bases, protections et logique, génération, distribution.
import { runScenario, slider, seg, toggle, row, button, holder, loop, orderTask, sortTask, svg, arrow, text, gauge, vbar, lamp, fmt1, fmtk } from './engine.js';
const Q = (tag, q, c, why, o = {}) => ({ tag, q, c, a: 0, why, ...o });
const wrap = (a) => ((a + 540) % 360) - 180;

// ======================================================================= 10. BASES DE L'ÉLECTRICITÉ
function circuitArt(o) {
  // pile à gauche, résistances à droite, électrons qui circulent (vitesse ∝ courant)
  const dots = Array.from({ length: 16 }, (_, i) => { const u = ((i / 16 + o.phase) % 1) * 4; const p = u < 1 ? [40 + u * 260, 30] : u < 2 ? [300, 30 + (u - 1) * 120] : u < 3 ? [300 - (u - 2) * 260, 150] : [40, 150 - (u - 3) * 120]; return `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#5fd6ff"/>`; }).join('');
  return svg(340, 190, `<rect x="40" y="30" width="260" height="120" fill="none" stroke="#58627a" stroke-width="3"/>${dots}
    <rect x="22" y="70" width="36" height="40" rx="5" fill="#2f6fd8"/>${text(40, 95, `${o.U} V`, { s: 11, w: 800 })}${o.body}
    ${text(170, 180, o.foot, { s: 12.5, w: 800 })}`);
}
function ohmTask(ctx, T) {
  const s = slider(T.lab, { label: 'Résistance', min: 1, max: 40, step: 1, value: 4, unit: 'Ω' });
  const hold = holder(T, 800); let ph = 0, acc = 0;
  return loop((dt) => {
    const R = s.get(), I = 28 / R, P = 28 * I; ph += dt * I * 0.04;
    acc += dt; if (acc < 1 / 30) return; acc = 0;
    T.art.innerHTML = circuitArt({ U: 28, phase: ph, body: `<rect x="270" y="60" width="60" height="60" rx="6" fill="${P > 150 ? '#ff6a4d' : '#ffc35c'}" opacity="${0.4 + Math.min(0.6, P / 200)}"/>${text(300, 95, `${R} Ω`, { s: 12, w: 800, c: '#0a1222' })}`, foot: `I = U / R = ${fmt1(I)} A · P = U × I = ${fmtk(P)} W` });
    hold(R === 14, 'I = 28 / 14 = 2 A et P = 28 × 2 = 56 W. Plus de résistance, moins de courant.');
  });
}
function spTask(ctx, T) {
  const s1 = slider(T.lab, { label: 'R1', min: 5, max: 30, step: 5, value: 20, unit: 'Ω' }), s2 = slider(T.lab, { label: 'R2', min: 5, max: 30, step: 5, value: 5, unit: 'Ω' });
  const md = seg(T.lab, 'Montage', ['Série', 'Parallèle'], 0);
  const hold = holder(T, 800); let ph = 0, acc = 0;
  return loop((dt) => {
    const a = s1.get(), b = s2.get(), par = md.get() === 1, R = par ? a * b / (a + b) : a + b, I = 28 / R; ph += dt * I * 0.03;
    acc += dt; if (acc < 1 / 30) return; acc = 0;
    const body = par ? `<line x1="300" y1="30" x2="300" y2="150" stroke="#0a1222" stroke-width="8"/><rect x="250" y="60" width="40" height="60" rx="5" fill="#ffc35c"/>${text(270, 95, a, { s: 12, w: 800, c: '#0a1222' })}<rect x="310" y="60" width="26" height="60" rx="5" fill="#62e3a0"/>${text(323, 95, b, { s: 11, w: 800, c: '#0a1222' })}<path d="M300,40 L270,40 L270,60 M300,40 L323,40 L323,60 M270,120 L270,140 L300,140 M323,120 L323,140 L300,140" stroke="#58627a" stroke-width="3" fill="none"/>${text(170, 66, `${fmt1(28 / a)} A et ${fmt1(28 / b)} A dans les branches`, { s: 11, c: '#93a1bd' })}`
      : `<rect x="282" y="40" width="36" height="44" rx="5" fill="#ffc35c"/>${text(300, 67, a, { s: 12, w: 800, c: '#0a1222' })}<rect x="282" y="96" width="36" height="44" rx="5" fill="#62e3a0"/>${text(300, 123, b, { s: 12, w: 800, c: '#0a1222' })}${text(170, 66, `même courant, tensions ${fmt1(I * a)} V + ${fmt1(I * b)} V`, { s: 11, c: '#93a1bd' })}`;
    T.art.innerHTML = circuitArt({ U: 28, phase: ph, body, foot: `R totale = ${fmt1(R)} Ω · I = ${fmt1(I)} A` });
    hold(a === 10 && b === 10 && par, 'En parallèle, 1/R = 1/10 + 1/10 : R = 5 Ω. La résistance totale baisse, la même tension est sur chaque branche, le courant total augmente. En série, ce serait 20 Ω.');
  });
}
function phaseTask(ctx, T) {
  const s = slider(T.lab, { label: 'Décalage entre les phases', min: 0, max: 180, step: 10, value: 40, unit: '°' });
  const hold = holder(T, 900); let t = 0, acc = 0;
  return loop((dt) => {
    t += dt; acc += dt; if (acc < 1 / 30) return; acc = 0;
    const d = s.get() * Math.PI / 180, cols = ['#ffc35c', '#5fd6ff', '#ff6fc8'];
    let paths = '', sum = '';
    for (let k = 0; k < 3; k++) { let p = ''; for (let x = 0; x <= 300; x += 5) { const y = 95 - 50 * Math.sin(x / 300 * Math.PI * 4 - t * 3 - k * d); p += (p ? 'L' : 'M') + (20 + x) + ',' + y.toFixed(1); } paths += `<path d="${p}" stroke="${cols[k]}" stroke-width="2.5" fill="none"/>`; }
    // puissance instantanée totale (somme des carrés) : constante seulement à 120°
    let pw = ''; for (let x = 0; x <= 300; x += 5) { const th = x / 300 * Math.PI * 4 - t * 3; let v = 0; for (let k = 0; k < 3; k++) v += Math.sin(th - k * d) ** 2; pw += (pw ? 'L' : 'M') + (20 + x) + ',' + (178 - v * 10).toFixed(1); }
    T.art.innerHTML = svg(340, 195, `<line x1="20" x2="320" y1="95" y2="95" stroke="rgba(255,255,255,.15)"/>${paths}<path d="${pw}" stroke="#62e3a0" stroke-width="2" fill="none"/>${text(170, 192, 'vert : puissance totale transmise', { s: 10.5, c: '#62e3a0' })}${text(170, 22, `${s.get()}°`, { s: 15, w: 850 })}`);
    hold(s.get() === 120, 'Triphasé : 3 tensions à 120° → la puissance totale est constante (la courbe verte devient plate). Standard avion : 115/200 V, 400 Hz.');
  });
}
const laboTasks = [
  { tag: 'Loi d’Ohm', q: 'Batterie 28 V : règle la résistance pour faire passer exactement 2 A.', task: ohmTask, why: 'U = R × I, et P = U × I = R × I² = U² / R.' },
  { tag: 'Série ou parallèle', q: 'Avec deux résistances, obtiens une résistance totale de 5 Ω.', task: spTask, why: 'Série : R1 + R2. Parallèle : 1/R = 1/R1 + 1/R2.' },
  { tag: 'Avitaillement', q: 'Avitaillement : dans quel ordre ?', task: orderTask(['Câble de masse relié à l’avion', 'Pistolet ou tuyau branché', 'Avitaillement'], { tol: 0 }), why: 'L’avion peut être encore chargé et le carburant se charge en coulant : une étincelle enflammerait les vapeurs. La masse d’abord.' },
  { tag: 'Triphasé', q: 'Règle le décalage entre les trois phases d’un réseau triphasé avion.', task: phaseTask, why: '0° = en phase, 120° = triphasé, 180° = opposition.' },
];
const laboItems = [
  Q('Statique', 'Dans quelles conditions l’avion se charge-t-il le plus ?', ['Haute altitude dans les cristaux de glace et la neige, à grande vitesse', 'Au sol par temps humide', 'En basse altitude par air calme', 'Moteurs arrêtés'], 'Effet triboélectrique : frottement de l’air, cristaux, poussière, précipitations.'),
  Q('Statique', 'Où sont placés les déperditeurs statiques ?', ['Aux bords de fuite des ailes et des empennages', 'Aux bords d’attaque', 'Sur le nez', 'Sous le fuselage'], '6 à 12 par avion, en fibre de carbone ou fils résistifs : effet couronne contrôlé.', { after: (ctx) => ctx.W.highlight(['wicks']) }),
  Q('Statique', 'Il manque un déperditeur à la prévol. Risque ?', ['Des parasites radio (P-static)', 'Un feu moteur', 'Une panne de batterie', 'Aucun'], 'Ils évitent aussi les étincelles et, au pire, le soudage des articulations de gouvernes.'),
  Q('Métallisation', 'La métallisation (bonding) sert à…', ['Mettre toutes les pièces conductrices au même potentiel', 'Isoler les réservoirs', 'Charger la batterie', 'Protéger de la corrosion'], 'Elle évite les étincelles dans les réservoirs et aux jonctions.'),
  Q('Ohm', '28 V sur 7 Ω : courant et puissance ?', ['4 A et 112 W', '2 A et 56 W', '196 A et 5 488 W', '0,25 A et 7 W'], 'I = 28 / 7 = 4 A ; P = 28 × 4 = 112 W.'),
  Q('Montages', 'En parallèle, quand on ajoute une branche…', ['La résistance totale baisse et le courant total augmente', 'La résistance totale augmente', 'La tension se partage', 'Le courant est le même partout'], 'En série : même courant, la tension se partage.'),
  Q('CTP/CTN', 'Une résistance CTN…', ['Voit sa résistance baisser quand elle chauffe', 'Voit sa résistance monter quand elle chauffe', 'Ne dépend pas de la température', 'Fond au-delà de son calibre'], 'CTN : limiteur de courant d’appel, thermistance. CTP : fusibles réarmables, capteurs.'),
  Q('Interrupteurs', 'Pourquoi un capot sur certains interrupteurs ?', ['Éviter une action par erreur sur un système critique', 'Les protéger de la poussière', 'Les éclairer la nuit', 'Les rendre étanches'], 'Pompes, extincteurs, démarrage.'),
  Q('Alternatif', 'Pourquoi 400 Hz en avion ?', ['Transformateurs et moteurs beaucoup plus petits et légers', 'Moins de pertes en ligne', 'C’est la fréquence des moteurs', 'Pour la radio'], 'Standard : 115/200 V, 400 Hz.'),
  Q('Alternatif', 'Tension entre deux phases d’un réseau 115/200 V ?', ['200 V', '115 V', '28 V', '400 V'], '115 V entre une phase et le neutre, 200 V entre deux phases.'),
  Q('Électromagnétisme', 'Le relais permet…', ['De commander un gros circuit avec un petit courant', 'De transformer l’AC en DC', 'De mesurer la fréquence', 'D’emmagasiner l’énergie'], 'Deux circuits isolés. Usage : bus tie, contrôle des génératrices.'),
  Q('Électromagnétisme', 'Le solénoïde donne…', ['Un mouvement linéaire (vannes carburant, sélecteurs hydrauliques)', 'Une rotation continue', 'Une haute tension', 'Du courant continu'], 'Une bobine attire un noyau mobile ; un ressort le ramène.'),
  Q('Induction', 'La loi de Faraday : une tension est induite par…', ['Un flux magnétique variable', 'Un aimant immobile', 'Un courant continu constant', 'La chaleur'], 'Génératrice (conducteur qui tourne) et transformateur (induction mutuelle).'),
];

// ======================================================================= 11. PROTECTIONS ET LOGIQUE
const GATE = (type, x, y, out) => {
  const bub = type === 'NAND' || type === 'NOR' || type === 'NOT', body = type === 'AND' || type === 'NAND' ? `<path d="M${x},${y - 28} L${x + 30},${y - 28} A28,28 0 0 1 ${x + 30},${y + 28} L${x},${y + 28} Z"/>`
    : type === 'NOT' ? `<path d="M${x},${y - 26} L${x + 48},${y} L${x},${y + 26} Z"/>` : `<path d="M${x - 6},${y - 28} Q${x + 40},${y - 28} ${x + 60},${y} Q${x + 40},${y + 28} ${x - 6},${y + 28} Q${x + 10},${y} ${x - 6},${y - 28} Z"/>`;
  const ox = type === 'NOT' ? x + 48 : type === 'AND' || type === 'NAND' ? x + 58 : x + 60;
  return `<g fill="#1d2840" stroke="#cfd8e6" stroke-width="2.5">${body}${bub ? `<circle cx="${ox + 6}" cy="${y}" r="6"/>` : ''}</g><line x1="${ox + (bub ? 12 : 0)}" y1="${y}" x2="${ox + 50}" y2="${y}" stroke="${out ? '#62e3a0' : '#58627a'}" stroke-width="4"/>${text(x + 24, y + 5, { AND: 'ET', OR: 'OU', NOT: 'NON', NAND: 'NON-ET', NOR: 'NON-OU' }[type], { s: 10, w: 800 })}`;
};
const EVAL = { AND: (a, b) => a && b, OR: (a, b) => a || b, NOT: (a) => !a, NAND: (a, b) => !(a && b), NOR: (a, b) => !(a || b) };
function spoilerGate(ctx, T) {
  const W = ctx.W; const r = row(T.lab); const wow = toggle(r, 'Train comprimé (WOW)', false, draw), idle = toggle(r, 'Manettes au ralenti', false, draw);
  const hold = holder(T, 900);
  function draw() {
    const a = wow.get(), b = idle.get(), o = a && b; W.setSurf({ gspl: o ? 45 : 0 });
    T.art.innerHTML = svg(340, 150, `<line x1="20" y1="50" x2="130" y2="50" stroke="${a ? '#62e3a0' : '#58627a'}" stroke-width="4"/><line x1="20" y1="100" x2="130" y2="100" stroke="${b ? '#62e3a0' : '#58627a'}" stroke-width="4"/>
      ${text(20, 40, 'WOW', { s: 11, a: 'start', c: '#93a1bd' })}${text(20, 90, 'ralenti', { s: 11, a: 'start', c: '#93a1bd' })}${text(110, 46, a ? 1 : 0, { s: 12, w: 800 })}${text(110, 96, b ? 1 : 0, { s: 12, w: 800 })}
      ${GATE('AND', 130, 75, o)}${lamp(246, 62, 86, 26, 'SPOILERS', o, '#62e3a0')}`);
    hold(o, 'Porte ET : la sortie vaut 1 seulement si toutes les entrées valent 1. Spoilers sol sortis : la portance est détruite au toucher.');
  }
  draw();
  return () => W.setSurf({ gspl: 0 });
}
function gatesTask(ctx, T) {
  const P = [['NAND', false, 'Porte NON-ET : obtiens une sortie à 0.', 'NON-ET donne 0 seulement si toutes les entrées sont à 1.', [false, false]], ['NOR', true, 'Porte NON-OU : obtiens une sortie à 1.', 'NON-OU donne 1 seulement si toutes les entrées sont à 0.', [true, true]], ['OR', true, 'Porte OU : obtiens 1 avec UNE seule entrée à 1.', 'OU : au moins une entrée à 1 suffit.', [false, false]], ['NOT', true, 'Porte NON : obtiens 1.', 'NON inverse l’entrée : le petit rond = une inversion.', [true, false]]];
  let k = 0; const r = row(T.lab); let a = false, b = false;
  const ta = toggle(r, 'Entrée A', false, (v) => { a = v; draw(); }), tb = toggle(r, 'Entrée B', false, (v) => { b = v; draw(); });
  const info = row(T.lab, 'goals'); let lock = false;
  const init = () => { [a, b] = P[k][4]; ta.set(a); tb.set(b); };
  function draw() {
    const [g, want, q] = P[k], one = g === 'NOT', o = one ? EVAL.NOT(a) : EVAL[g](a, b);
    tb.el.style.visibility = one ? 'hidden' : '';
    const okExtra = g !== 'OR' || (a !== b);
    T.art.innerHTML = svg(340, 130, `<line x1="30" y1="${one ? 65 : 45}" x2="130" y2="${one ? 65 : 45}" stroke="${a ? '#62e3a0' : '#58627a'}" stroke-width="4"/>${one ? '' : `<line x1="30" y1="85" x2="130" y2="85" stroke="${b ? '#62e3a0' : '#58627a'}" stroke-width="4"/>`}
      ${text(40, one ? 58 : 38, 'A=' + (a ? 1 : 0), { s: 11, w: 800 })}${one ? '' : text(40, 78, 'B=' + (b ? 1 : 0), { s: 11, w: 800 })}${GATE(g, 130, 65, o)}${text(300, 70, o ? 1 : 0, { s: 22, w: 850, c: o ? '#62e3a0' : '#93a1bd' })}`);
    info.innerHTML = `<div><b>${k + 1}/${P.length}</b> · ${q}</div>`;
    if (!lock && o === want && okExtra) { lock = true; ctx.sfx('tick'); info.innerHTML += `<div>✅ ${P[k][3]}</div>`; setTimeout(() => { lock = false; k++; if (k >= P.length) T.win('Tables de vérité maîtrisées. On lit un schéma de FCOM de gauche (entrées) à droite (sortie).'); else { init(); draw(); } }, 1300); }
  }
  init(); draw();
}
function cbTask(ctx, T) {
  let heat = 0, tripped = null, seen = { th: false, mag: false }, acc = 0, ang = 0;
  const s = slider(T.lab, { label: 'Courant dans le câble (calibre 10 A)', min: 0, max: 40, step: 1, value: 6, unit: 'A' });
  const r = row(T.lab); button(r, '⚡ Court-circuit', () => { if (!tripped) { tripped = 'mag'; seen.mag = true; ctx.sfx('bang'); } }); button(r, '↺ Réarmer', () => { tripped = null; heat = 0; });
  return loop((dt) => {
    const I = tripped ? 0 : s.get();
    if (!tripped) { heat += ((I / 10) ** 2 - 1) * dt * 0.35; heat = Math.max(0, heat); if (heat >= 1) { tripped = 'th'; seen.th = true; ctx.sfx('ko'); } }
    else heat = Math.max(0, heat - dt * 0.25);
    ang += dt * I * 0.5; acc += dt; if (acc < 1 / 25) return; acc = 0;
    const bend = Math.min(1, heat) * 26;
    T.art.innerHTML = svg(340, 170, `<rect x="20" y="20" width="140" height="120" rx="10" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>${text(90, 14, 'thermique : bilame', { s: 11, c: '#ffc35c', w: 800 })}
      <path d="M50,120 Q${60 + bend},80 ${50 + bend * 1.6},40" stroke="#ffc35c" stroke-width="7" fill="none"/><path d="M58,120 Q${68 + bend},80 ${58 + bend * 1.6},40" stroke="#b8c0ca" stroke-width="5" fill="none"/>
      ${vbar(126, 34, 16, 90, heat, 0, 1, 'chaleur', heat > 0.8 ? '#ff6a4d' : '#ffc35c')}
      <rect x="180" y="20" width="140" height="120" rx="10" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>${text(250, 14, 'magnétique : bobine', { s: 11, c: '#5fd6ff', w: 800 })}
      ${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${210 + i * 14}" cy="80" rx="6" ry="22" fill="none" stroke="#5fd6ff" stroke-width="3"/>`).join('')}${text(250, 126, 'coupe vers 5× le calibre', { s: 10, c: '#93a1bd' })}
      ${text(90, 162, tripped === 'th' ? '🔴 SURCHARGE : thermique déclenché' : '', { s: 11, w: 800, c: '#ff6a4d' })}${text(250, 162, tripped === 'mag' ? '🔴 COURT-CIRCUIT : magnétique' : '', { s: 11, w: 800, c: '#ff6a4d' })}
      ${!tripped ? text(170, 162, `${I} A`, { s: 13, w: 800 }) : ''}`);
    T.say(`Surcharge : ${seen.th ? '✅' : '⬜'} · Court-circuit : ${seen.mag ? '✅' : '⬜'}${tripped ? ' · pense à réarmer' : ''}`);
    if (seen.th && seen.mag && !T.isDone()) T.win('Thermique = lent, il dépend de la durée : contre la surcharge. Magnétique = très rapide : contre le court-circuit. Les deux protègent le câble.');
  });
}
const logiqueTasks = [
  { tag: 'Porte ET', q: 'Fais sortir les spoilers sol de l’avion 3D : il faut WOW ET manettes au ralenti.', task: spoilerGate, why: 'Un schéma de FCOM se lit de gauche (entrées) à droite (sortie).' },
  { tag: 'Portes logiques', q: 'Résous les 4 portes logiques.', task: gatesTask, why: 'ET : toutes à 1. OU : au moins une. NON : inverse. NON-ET : 0 seulement si toutes à 1. NON-OU : 1 seulement si toutes à 0.' },
  { tag: 'Disjoncteur', q: 'Fais déclencher le disjoncteur par surcharge, puis par court-circuit.', task: cbTask, hint: 'Surcharge : un peu au-dessus du calibre, et attends.', why: 'En avion, on combine souvent les deux : magnéto-thermique.' },
  { tag: 'Réarmement', q: 'Un disjoncteur de pompe a sauté. Remets la bonne conduite dans l’ordre.', task: orderTask(['Je le laisse ouvert (tiré)', 'J’attends 10 à 30 s', 'Je le repousse, une seule fois', 'Il saute encore : je le laisse ouvert et je le signale']), why: 'Réarmer plusieurs fois peut provoquer des arcs et cacher un vrai défaut (fil dénudé qui frotte). Jamais de shunt.' },
];
const logiqueItems = [
  Q('Fusibles', 'Le fusible de 5 A a grillé et tu n’as qu’un 10 A. Tu…', ['Ne le montes pas : le fil chaufferait et brûlerait avant', 'Le montes, c’est plus sûr', 'Le montes pour le vol retour seulement', 'Pontes le support'], 'Jamais un calibre plus fort.'),
  Q('Disjoncteurs', 'Un disjoncteur protège…', ['Le câble, contre l’échauffement et le feu', 'L’équipement en bout de ligne', 'La batterie', 'Le pilote'], 'Le disjoncteur se réarme ; le fusible fond et se remplace.'),
  Q('Disjoncteurs', 'Le disjoncteur thermique est…', ['Lent : il dépend de la durée, contre la surcharge', 'Très rapide, contre le court-circuit', 'Réservé au courant alternatif', 'Un fusible jetable'], 'Le magnétique coupe vite les courts-circuits.'),
  Q('Court-circuit', 'Pourquoi un court-circuit provoque-t-il un feu ?', ['I = U / R devient énorme, et P = R × I² dégage une chaleur massive', 'La tension monte', 'La fréquence baisse', 'Le courant s’annule'], 'Fils qui chauffent, isolant qui fond : principal risque de feu électrique.'),
  Q('Surintensité', 'Le démarrage d’un moteur électrique crée…', ['Une surintensité transitoire normale', 'Un court-circuit', 'Une panne de barre', 'Une inversion de polarité'], 'Fusibles temporisés et thermiques la tolèrent.'),
  Q('Réarmement', 'Pourquoi jamais de shunt (trombone, fusible ponté) ?', ['Plus rien ne protège le câble : risque catastrophique', 'Il fait sauter les autres disjoncteurs', 'Il coupe la batterie', 'Il décale la fréquence'], 'Le réarmement est une étape de dépannage, pas une réparation.'),
  Q('Semi-conducteurs', 'Un semi-conducteur qui chauffe…', ['Conduit mieux (comme une CTN), jusqu’à l’emballement thermique', 'Conduit moins', 'Ne change pas', 'Devient isolant'], 'D’où les ailettes, les dissipateurs, la ventilation des baies avioniques.'),
  Q('Logique', 'Porte NON-OU avec A = 1 et B = 0 : sortie ?', ['0', '1', 'Indéterminée', 'Ça dépend du courant'], 'NON-OU = 1 seulement si toutes les entrées sont à 0.'),
  Q('Logique', 'Porte NON-ET avec A = 1 et B = 0 : sortie ?', ['1', '0', 'Indéterminée', 'Ça dépend de la tension'], 'NON-ET = 0 seulement si toutes les entrées sont à 1.'),
  Q('Logique', 'Que veut dire le petit rond sur un symbole de porte ?', ['Une inversion', 'Une masse', 'Un fusible', 'Une entrée en option'], 'ET + rond = NON-ET ; OU + rond = NON-OU.'),
];

// ======================================================================= 12. GÉNÉRATION
function freqTask(ctx, T) {
  const sr = slider(T.lab, { label: 'Régime de l’alternateur', min: 0, max: 16000, step: 500, value: 6000, unit: 'tr/min', fmt: fmtk }, draw);
  const sp = seg(T.lab, 'Nombre de pôles', ['2', '4', '6', '8', '12'], 1, draw);
  const goals = [[4, 'Obtiens 400 Hz avec 4 pôles'], [12, 'Obtiens 400 Hz avec 12 pôles']], got = [false, false]; const info = row(T.lab, 'goals');
  function draw() {
    const n = sr.get(), p = [2, 4, 6, 8, 12][sp.get()], f = n * p / 120;
    goals.forEach((g, i) => { if (p === g[0] && f === 400) got[i] = true; });
    info.innerHTML = goals.map((g, i) => `<div>${got[i] ? '✅' : '⬜'} ${g[1]}</div>`).join('');
    T.art.innerHTML = svg(340, 150, `${gauge(90, 72, 50, f, 0, 1000, 'fréquence (Hz)', { zones: [[390, 410, '#62e3a0']], fmt: (v) => Math.round(v) + ' Hz' })}
      ${text(240, 56, `f = ${fmtk(n)} × ${p} / 120`, { s: 14, w: 700, c: '#93a1bd' })}${text(240, 92, `= ${fmt1(f)} Hz`, { s: 26, w: 850, c: f === 400 ? '#62e3a0' : '#fff' })}`);
    if (got.every(Boolean)) T.win('4 pôles à 12 000 tr/min, ou 12 pôles à 4 000 tr/min : 400 Hz. Pour garder 400 Hz, l’alternateur doit tourner à vitesse constante.');
  }
  draw();
}
function csdTask(ctx, T) {
  let t = 0, disc = false, alarm = false, csdT = 0, acc = 0;
  const r = row(T.lab); const csd = toggle(r, 'CSD (vitesse constante)', false);
  const r2 = row(T.lab); const db = button(r2, '⛔ DISC IDG', () => { if (!alarm || disc) return; disc = true; ctx.sfx('bang'); }), rb = button(r2, '↻ Réaccoupler', () => { if (disc) T.say('❌ Impossible en vol : on réaccouple au sol seulement.'); });
  return loop((dt) => {
    t += dt; const n2 = 80 + 18 * Math.sin(t * 0.8);
    if (csd.get() && !disc) { csdT += dt; if (csdT > 3 && !alarm) { alarm = true; ctx.sfx('ko'); } }
    const f = disc ? 0 : csd.get() ? 400 + Math.sin(t * 7) * 0.3 : 400 * n2 / 82;
    acc += dt; if (acc < 1 / 25) return; acc = 0;
    db.disabled = !alarm || disc; rb.disabled = !disc;
    T.art.innerHTML = svg(340, 160, `${gauge(70, 74, 46, n2, 50, 100, 'régime moteur N2 (%)', { fmt: (v) => Math.round(v) + '%' })}${gauge(200, 74, 46, f, 0, 600, 'fréquence (Hz)', { zones: [[390, 410, '#62e3a0']], fmt: (v) => Math.round(v) })}
      ${lamp(262, 30, 70, 24, 'IDG', alarm && !disc, '#ffc35c')}${text(297, 72, alarm ? (disc ? 'IDG désaccouplé' : 'OIL HI TEMP') : csd.get() ? 'IDG = CSD + alt.' : 'sans CSD', { s: 10.5, w: 800, c: alarm ? '#ffc35c' : '#93a1bd' })}
      ${text(170, 152, disc ? 'Le bus passe sur une autre source.' : csd.get() ? 'Fréquence fixe malgré le régime qui varie.' : 'Fréquence « sauvage » : elle suit le régime.', { s: 11.5, c: '#cdd7ea' })}`);
    T.say(alarm && !disc ? '⚠️ Alarme IDG : désaccouple-le !' : !csd.get() ? '💡 La fréquence varie avec le régime : il te faut 400 Hz fixes.' : '');
    if (disc && !T.isDone()) T.win('Le CSD sort une vitesse fixe à partir d’un régime variable : 400 Hz. Désaccouplement automatique ou manuel si surchauffe ou pression basse, et définitif en vol.');
  });
}
function batTask(ctx, T) {
  const ty = seg(T.lab, 'Éléments', ['Plomb 2,0 V', 'Ni-Cd 1,2 V', 'Li-ion 3,7 V'], 0, draw);
  const sn = slider(T.lab, { label: 'Éléments en série', min: 1, max: 30, value: 12 }, draw), sp = slider(T.lab, { label: 'Rangées en parallèle (20 Ah chacune)', min: 1, max: 3, value: 1 }, draw);
  const hold = holder(T, 900);
  function draw() {
    const v = [2.0, 1.2, 3.7][ty.get()], n = sn.get(), p = sp.get(), U = v * n, C = 20 * p;
    T.art.innerHTML = svg(340, 150, `${Array.from({ length: p }, (_, j) => Array.from({ length: Math.min(n, 30) }, (_, i) => `<rect x="${14 + i * 10.6}" y="${24 + j * 22}" width="8" height="16" rx="2" fill="${['#9aa3ae', '#62e3a0', '#5fd6ff'][ty.get()]}"/>`).join('')).join('')}
      ${text(90, 120, `${fmt1(U)} V`, { s: 26, w: 850, c: U >= 27.5 && U <= 30 ? '#62e3a0' : '#fff' })}${text(90, 140, 'tension (série)', { s: 10.5, c: '#93a1bd' })}${text(250, 120, `${C} Ah`, { s: 26, w: 850, c: C === 40 ? '#62e3a0' : '#fff' })}${text(250, 140, 'capacité (parallèle)', { s: 10.5, c: '#93a1bd' })}`);
    hold(ty.get() === 1 && n === 24 && p === 2, '24 éléments Ni-Cd × 1,2 V = 28,8 V pour le bus 28 V ; deux rangées en parallèle doublent la capacité (40 Ah). En série la tension s’additionne, en parallèle la capacité.');
  }
  draw();
}
const generationTasks = [
  { tag: 'Fréquence', q: 'f = régime × pôles / 120 : obtiens 400 Hz de deux façons.', task: freqTask, why: 'D’où le besoin d’une vitesse constante, ou d’un réseau à fréquence sauvage (ATR 72 : 300 à 800 Hz).' },
  { tag: 'CSD / IDG', q: 'Le régime moteur varie : garde 400 Hz, puis gère l’alarme de l’IDG.', task: csdTask, why: 'IDG = CSD + alternateur en un bloc, avec un circuit d’huile propre.' },
  { tag: 'Batterie', q: 'Construis la batterie Ni-Cd du bus 28 V, avec 40 Ah de capacité.', task: batTask, why: 'Ni-Cd : 1,2 V par élément, 24 éléments pour 28 V. Li-ion : 7 à 8 éléments.' },
  { tag: 'Convertisseurs', q: 'Range chaque fonction dans le bon équipement.', task: sortTask([
    ['115/200 V AC → 28 V DC', 0, 'TRU (transfo-redresseur) : principale source de continu, 2 ou 3 en parallèle.'],
    ['28 V DC → 115 V AC monophasé, en secours', 1, 'Onduleur statique.'],
    ['Change la tension alternative sans changer la fréquence', 2, 'Transformateur : induction mutuelle, sans pièce mobile.'],
    ['Régime moteur variable en entrée, vitesse fixe en sortie', 3, 'CSD, hydromécanique.'],
    ['200 V → 26 V', 2, 'Transformateur.'],
  ], ['TRU', 'Onduleur', 'Transformateur', 'CSD']), why: 'TRU : AC → DC. Onduleur : DC → AC.' },
];
const generationItems = [
  Q('Batterie', 'Un rôle de la batterie de bord ?', ['Secours quand toutes les génératrices lâchent', 'Alimenter les packs en vol', 'Dégivrer le pare-brise', 'Démarrer les réacteurs de ligne seule'], 'Démarrer l’APU et les petits moteurs, secours, stabiliser la tension, alimenter au sol, garder les mémoires.'),
  Q('Batterie', 'Pourquoi la tension de charge est-elle plus haute que celle de la batterie ?', ['Pour vaincre sa résistance interne', 'Pour la décharger', 'Pour la refroidir', 'Pour équilibrer la fréquence'], 'Plomb 28,5 à 28,8 V ; Ni-Cd 28 à 30 V corrigée selon la température ; Li-ion 4,2 V max par élément.'),
  Q('Batterie', '1C, c’est…', ['Une charge ou décharge complète en 1 heure', '1 coulomb', '1 cycle de vie', '1 élément'], 'Le C-rate compare le courant à la capacité.'),
  Q('Batterie', 'Capacité d’une batterie Ni-Cd à −20 °C ?', ['40 à 60 % de la capacité', '100 %', '120 %', '5 %'], 'Plage idéale : +15 à +30 °C. Démarrage à froid : préchauffage ou groupe de parc.'),
  Q('Batterie', 'Plus aucune génératrice : autonomie sur batterie ?', ['30 min à 2 h selon la charge : essential bus + déroutement', 'Illimitée', '5 min', '10 h'], 'La QRH donne la durée.'),
  Q('Lithium', 'La menace principale d’une batterie lithium ?', ['L’emballement thermique', 'Le gel', 'Le courant inverse', 'La sulfatation'], 'Confinement : boîtier acier ou titane, isolation, évacuation des gaz vers l’extérieur.'),
  Q('Génératrice', 'Sans protection contre le courant inverse…', ['La batterie se vide dans la génératrice et la fait tourner en moteur', 'La génératrice surchauffe à vide', 'La fréquence double', 'Rien ne se passe'], 'Diode ou relais, obligatoire.'),
  Q('Génératrice', 'Le régulateur de tension agit sur…', ['Le courant d’excitation', 'Le régime moteur', 'Le nombre de pôles', 'La batterie'], 'Plus d’excitation = champ plus fort = tension plus haute. Bus tenu entre 26 et 30 V.'),
  Q('Alternateur', 'Dans l’alternateur sans balais, qui alimente l’inducteur du rotor ?', ['L’excitatrice, via des diodes tournantes', 'Des balais et un collecteur', 'La batterie directement', 'Le stator'], 'Pas de balais : fiable, sans usure ni étincelle. La GCU règle la tension.'),
  Q('Alternateur', 'Le démarreur-génératrice…', ['Est un moteur au démarrage, une génératrice ensuite', 'Ne sert qu’au sol', 'Sort de l’alternatif 400 Hz', 'Remplace la batterie'], 'Gain de masse : petits jets, turbopropulseurs, APU.'),
  Q('IDG', 'Une fuite d’huile d’IDG peut ressembler à…', ['Une fuite d’huile moteur', 'Une fuite hydraulique', 'Une fuite carburant', 'De la condensation'], 'L’IDG a son propre circuit d’huile.'),
  Q('Fréquence', 'Le courant à fréquence sauvage est bon pour…', ['Le dégivrage et le chauffage', 'Les calculateurs', 'Les instruments de vol', 'Les radios'], 'Simple et léger, mais pas pour les calculateurs.'),
];

// ======================================================================= 13. DISTRIBUTION
function net(s) {
  const p = { gen1: !!s.gen1, gen2: !!s.gen2, apu: false, gpu: false, rat: !!s.rat, bat: false, ac1: !!s.gen1, ac2: !!s.gen2, ess: false, tie: false };
  const ext = s.gpu ? 'gpu' : s.apu ? 'apu' : null;
  if (!p.ac1) { if (ext === 'gpu') { p.ac1 = p.gpu = true; } else if (s.tie && ext === 'apu') { p.ac1 = p.apu = p.tie = true; } else if (s.tie && p.gen2) { p.ac1 = p.tie = true; } }
  if (!p.ac2) { if (ext === 'apu') { p.ac2 = p.apu = true; } else if (s.tie && ext === 'gpu') { p.ac2 = p.gpu = p.tie = true; } else if (s.tie && p.gen1) { p.ac2 = p.tie = true; } }
  p.ess = p.ac1 || p.rat; p.bat = !p.ess; p.essAny = true;
  return p;
}
function netTask(sc) {
  return (ctx, T) => {
    const W = ctx.W; W.setElec(true); const s = { gen1: sc.gen1, gen2: sc.gen2, apu: false, gpu: false, rat: false, tie: false }; let apuT = 0, acc = 0;
    const r1 = row(T.lab, 'ovh'), r2 = row(T.lab, 'ovh');
    const B = (r, k, label, en = true) => { const b = toggle(r, label, s[k], (v) => { if (k === 'apu') { if (!sc.apuOk) { b.set(false); T.say('❌ L’APU ne démarre pas.'); return; } apuT = v ? 2.5 : 0; s.apu = false; } else if (k === 'rat') { if (!v) { b.set(true); return; } s.rat = true; } else s[k] = v; }); if (!en) { b.el.disabled = true; } return b; };
    const gl = (n, ok) => (sc.ground ? `GEN ${n} (moteur arrêté)` : ok ? `GEN ${n}` : `GEN ${n} FAULT`);
    B(r1, 'gen1', gl(1, sc.gen1), sc.gen1); B(r1, 'gen2', gl(2, sc.gen2), sc.gen2); B(r1, 'apu', 'APU START'); B(r2, 'gpu', 'EXT PWR', sc.ground); B(r2, 'tie', 'BUS TIE'); if (!sc.ground) B(r2, 'rat', 'RAT MAN ON');
    const hold = holder(T, 900);
    const stop = loop((dt) => {
      if (apuT > 0) { apuT -= dt; if (apuT <= 0) s.apu = true; }
      const p = net(s); W.elecSet({ ...p, bat: p.bat, ess: p.ess || p.bat });
      acc += dt; if (acc < 1 / 10) return; acc = 0;
      const L = (x, y, t, on, col = '#62e3a0') => lamp(x, y, 74, 22, t, on, col);
      T.art.innerHTML = svg(340, 120, `${L(10, 14, 'AC BUS 1', p.ac1)}${L(92, 14, 'AC BUS 2', p.ac2)}${L(174, 14, 'ESS BUS', p.ess || p.bat, p.bat ? '#ffc35c' : '#62e3a0')}${L(256, 14, 'BAT ONLY', p.bat, '#ff3b30')}
        ${text(170, 66, `Sources : ${[p.gen1 && 'GEN 1', p.gen2 && 'GEN 2', p.apu && 'APU', p.gpu && 'GPU', p.rat && 'RAT'].filter(Boolean).join(' + ') || 'aucune'}`, { s: 13, w: 800 })}
        ${text(170, 90, apuT > 0 ? 'APU en démarrage…' : p.tie ? 'Bus tie fermé : les deux côtés sont reliés' : 'Bus tie ouvert : côtés séparés', { s: 11.5, c: '#93a1bd' })}
        ${text(170, 110, sc.ground ? 'Au sol, moteurs arrêtés' : 'En vol, FL350', { s: 11, c: '#5fd6ff' })}`);
      hold(sc.check(p, s), sc.msg);
    });
    return () => { stop(); W.setElec(false); };
  };
}
function syncTask(ctx, T) {
  let ph = 140, acc = 0, msg = '';
  const sv = slider(T.lab, { label: 'Tension GEN 2', min: 105, max: 125, step: 1, value: 108, unit: 'V' }), sf = slider(T.lab, { label: 'Fréquence GEN 2', min: 396, max: 404, step: 0.1, value: 402.4, unit: 'Hz', fmt: fmt1 });
  const r = row(T.lab); button(r, '🔗 COUPLER', () => {
    const dv = Math.abs(sv.get() - 115), df = Math.abs(sf.get() - 400), dp = Math.abs(wrap(ph));
    if (dv <= 2 && df <= 0.3 && dp <= 15) T.win('Tension égale, fréquence égale, même ordre des phases, déphasage proche de zéro : la GCU autorise le couplage sans courants de circulation.');
    else { ctx.sfx('bang'); msg = `❌ Couplage refusé : ${dv > 2 ? 'tension différente' : df > 0.3 ? 'fréquence différente' : 'déphasage de ' + Math.round(dp) + '°'}. Courants de circulation énormes !`; }
  }, 'pri');
  return loop((dt) => {
    ph = wrap(ph + (sf.get() - 400) * 120 * dt); acc += dt; if (acc < 1 / 30) return; acc = 0;
    const a = ph * Math.PI / 180;
    let w1 = '', w2 = ''; for (let x = 0; x <= 150; x += 4) { w1 += (w1 ? 'L' : 'M') + (180 + x) + ',' + (70 - 30 * Math.sin(x / 150 * Math.PI * 4)).toFixed(1); w2 += (w2 ? 'L' : 'M') + (180 + x) + ',' + (70 - 30 * sv.get() / 115 * Math.sin(x / 150 * Math.PI * 4 - a)).toFixed(1); }
    T.art.innerHTML = svg(340, 160, `<circle cx="82" cy="72" r="54" fill="#070c18" stroke="rgba(140,170,230,.3)"/><path d="M82,18 L82,30" stroke="#62e3a0" stroke-width="4"/>${text(82, 140, 'synchronoscope', { s: 10.5, c: '#93a1bd' })}
      <line x1="82" y1="72" x2="${82 + 46 * Math.sin(a)}" y2="${72 - 46 * Math.cos(a)}" stroke="${Math.abs(ph) < 15 ? '#62e3a0' : '#ffc35c'}" stroke-width="4" stroke-linecap="round"/><circle cx="82" cy="72" r="5" fill="#fff"/>
      <path d="${w1}" stroke="#5fd6ff" stroke-width="2.5" fill="none"/><path d="${w2}" stroke="#ffc35c" stroke-width="2.5" fill="none"/>${text(255, 126, 'bleu : réseau 115 V 400 Hz · orange : GEN 2', { s: 10, c: '#93a1bd' })}
      ${text(170, 152, msg, { s: 11, w: 800, c: '#ff6a4d' })}`);
  });
}
const distributionTasks = [
  { tag: 'Au sol', q: 'Au sol, moteurs et APU arrêtés : mets les deux barres AC sous tension avec la source prioritaire.', task: netTask({ ground: true, gen1: false, gen2: false, apuOk: true, check: (p, s) => p.ac1 && p.ac2 && p.gpu && !s.apu, msg: 'Au sol : groupe de parc d’abord (moins de bruit et de carburant), puis APU, puis génératrices moteur. En vol : génératrices moteur > APU > RAT > batterie.' }), why: 'Les fils s’allument en 3D sur l’avion.' },
  { tag: 'Panne de source', q: 'En vol, la GEN 1 est en panne et l’APU indisponible : rétablis l’AC BUS 1.', task: netTask({ ground: false, gen1: false, gen2: true, apuOk: false, check: (p) => p.ac1 && p.ac2, msg: 'Bus tie fermé : la GEN 2 alimente les deux côtés. Une panne de source est récupérable (transfert, parfois délestage).' }), why: 'Partage de charge entre génératrices, délestage des non-essentiels si la puissance manque.' },
  { tag: 'Secours', q: 'Les deux génératrices sont perdues et l’APU ne démarre pas : protège l’ESS BUS.', task: netTask({ ground: false, gen1: false, gen2: false, apuOk: false, check: (p) => p.ess && p.rat, msg: 'La RAT entraîne le générateur de secours : l’essential bus est sauvé. Sur batterie seule, c’était 30 min à 2 h.' }), why: 'Perte de tout l’AC normal → RAT + essential AC + onduleur.' },
  { tag: 'Couplage', q: 'Couple la GEN 2 au réseau : accorde tension, fréquence et phase, puis appuie sur COUPLER.', task: syncTask, hint: 'Garde une petite différence de fréquence : l’aiguille tourne lentement, appuie quand elle passe en haut.', why: 'Conditions vérifiées par la GCU : tension (à quelques %), fréquence (±0,1 Hz), ordre des phases, déphasage < 10 à 20°.' },
];
const distributionItems = [
  Q('Barres', 'Le battery bus…', ['Est directement relié à la batterie, toujours sous tension', 'N’est alimenté qu’au sol', 'Est un bus alternatif', 'Est alimenté par la RAT'], 'Hot / ground bus : toujours relié à la batterie, pour l’entretien au sol.'),
  Q('Masse', 'Pourquoi la métallisation est-elle vitale ?', ['La structure sert de masse commune (retour du courant)', 'Elle évite le givre', 'Elle protège de la foudre seulement', 'Elle charge la batterie'], 'Mauvaise métallisation : parasites, corrosion, fausses alarmes.'),
  Q('Pannes', 'Quelle panne est la plus grave ?', ['La panne de barre : tous ses consommateurs sont perdus', 'La panne de source', 'La panne d’un TRU parmi trois', 'Un disjoncteur de galley'], 'Panne de barre : court-circuit sur la barre, isolée (BUS FAULT).'),
  Q('Délestage', 'Le délestage (load shedding)…', ['Coupe les non-essentiels quand la puissance manque', 'Répartit la charge entre génératrices', 'Ferme le bus tie', 'Démarre l’APU'], 'Partage de charge (load sharing) : parts égales via les GCU.'),
  Q('Réseaux', 'Le réseau AC parallèle…', ['Couple les génératrices sur une barre commune : il faut synchroniser', 'Garde les côtés indépendants', 'N’existe qu’en continu', 'Interdit le secours automatique'], 'C’est le standard CS-25. Le réseau séparé (split) n’a pas de secours automatique.'),
  Q('Réseaux', 'Sur un CS-25, le courant continu vient surtout…', ['Des TRU branchés sur l’alternatif', 'D’une génératrice continue par moteur', 'De la batterie', 'De la RAT'], 'Barres DC gauche et droite + essential + emergency.'),
  Q('Réseaux', 'Bimoteur CS-23 (DA42) : une génératrice lâche.', ['Le bus tie relie les barres, l’autre génératrice alimente les deux côtés', 'Batterie seule immédiatement', 'Il faut couper un moteur', 'Plus d’avionique'], 'Les deux en panne : batterie seule.'),
  Q('Puissance', 'La puissance d’une génératrice AC est donnée en…', ['kVA', 'kW', 'Ah', 'Hz'], 'VA = U × I (√3 × U × I en triphasé). Puissance réelle = VA × facteur de puissance.'),
  Q('Transferts', 'En combien de temps se fait le transfert vers une autre source AC ?', ['Moins de 50 ms', '5 s', '1 min', 'Il faut le faire à la main'], 'Perte de tout l’AC normal : RAT + essential AC + onduleur.'),
  Q('Moteurs', 'Le rotor d’un moteur électrique se bloque. Le courant…', ['Monte à 5 à 10 fois le normal : risque de feu', 'Baisse', 'S’annule', 'Ne change pas'], 'Le disjoncteur doit sauter vite.'),
  Q('Moteurs', 'Un moteur électrique perd sa charge et s’emballe. Le courant…', ['Baisse, comme le couple', 'Monte fortement', 'Devient alternatif', 'Double'], 'Survitesse : roulements et arbre cassés, rotor qui se désintègre.'),
  Q('Démarrage', 'Pour démarrer un gros réacteur (CS-25) il faut…', ['Le groupe de parc ou l’APU : la batterie seule ne suffit pas', 'La batterie seule', 'La RAT', 'Un TRU'], 'Petits moteurs CS-23 : la batterie suffit, 2 à 3 essais max.'),
];

export const SIMS_B = {
  labo: { start: (ctx) => runScenario(ctx, { title: 'Le labo d’électricité', icon: '🔋', intro: '<p>Loi d’Ohm, série et parallèle, triphasé : manipule et regarde le courant circuler. Les déperditeurs statiques sont repérés sur l’avion 3D.</p>', tasks: laboTasks, items: laboItems, n: 12 }) },
  logique: { start: (ctx) => runScenario(ctx, { title: 'Protections et logique', icon: '🧩', intro: '<p>Fais sortir les spoilers avec une porte ET, résous les portes logiques, fais sauter les disjoncteurs.</p>', tasks: logiqueTasks, items: logiqueItems, n: 12 }) },
  alternateur: { start: (ctx) => runScenario(ctx, { title: 'La centrale électrique', icon: '⚙️', intro: '<p>Produis du 400 Hz, gère un IDG, construis la batterie et range les convertisseurs.</p>', tasks: generationTasks, items: generationItems, n: 12 }) },
  reseau: { start: (ctx) => runScenario(ctx, { title: 'Le réseau de bord', icon: '🕸️', intro: '<p>Le réseau est dessiné sur l’avion 3D : chaque source et chaque barre s’allume. Gère les pannes, puis couple une génératrice au synchronoscope.</p>', tasks: distributionTasks, items: distributionItems, n: 12 }) },
};
