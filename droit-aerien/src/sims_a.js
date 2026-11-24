// Simus : règles de l'air, AIS, communications, aérodromes (3D), contrôle d'aérodrome, départs
import { runScenario, svg, planeTop, arrow, text } from './engine.js';
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));

// ======================================================================= RÈGLES DE L'AIR
function prio(otherSvg, me = 'Toi', note = '') {
  return svg(340, 230, `
    <circle cx="170" cy="150" r="95" fill="none" stroke="rgba(255,255,255,.08)" stroke-dasharray="4 6"/>
    <line x1="170" y1="150" x2="170" y2="20" stroke="rgba(95,214,255,.35)" stroke-width="2" stroke-dasharray="6 6"/>
    ${planeTop(170, 160, 0, '#5fd6ff', 0.9)}${text(170, 205, me, { c: '#9fe6ff', s: 13 })}${otherSvg}${note ? text(170, 222, note, { s: 11, c: '#93a1bd', w: 500 }) : ''}`);
}
const other = (x, y, c, col = '#ffc35c', label = '') => {
  const r = c * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r);
  return `<line x1="${x}" y1="${y}" x2="${x + dx * 120}" y2="${y + dy * 120}" stroke="rgba(255,195,92,.35)" stroke-width="2" stroke-dasharray="6 6"/>${planeTop(x, y, c, col, 0.75)}${label ? text(x, y - 26, label, { s: 12, c: col }) : ''}`;
};
const glider = (x, y, c) => `<g transform="translate(${x} ${y}) rotate(${c})"><path d="M0,-20 L3,-6 L44,-2 L44,2 L3,2 L2,16 L9,19 L9,22 L0,20 L-9,22 L-9,19 L-2,16 L-3,2 L-44,2 L-44,-2 L-3,-6 Z" fill="#62e3a0" stroke="#0a1222"/></g>`;
const balloon = (x, y) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-8" r="17" fill="#ff6fc8"/><rect x="-6" y="11" width="12" height="9" fill="#c98a4a"/></g>`;
const blimp = (x, y, c) => `<g transform="translate(${x} ${y}) rotate(${c})"><path d="M-4,20 L-15,33 L-4,29 Z M4,20 L15,33 L4,29 Z" fill="#8a64d8"/><ellipse cx="0" cy="0" rx="11" ry="31" fill="#b48cff"/><ellipse cx="0" cy="2" rx="3" ry="8" fill="#6f4fc0"/><line x1="0" y1="-29" x2="0" y2="28" stroke="#d6c4ff" stroke-width="1" opacity=".6"/></g>`;
const C_PRIO = ['Je lui cède le passage', 'Il doit me céder le passage', 'Chacun dégage par la droite', 'Je le dépasse par la droite'];
function nightLights(lights, note) {
  // lights : [{x, col}] vus devant soi, de nuit
  const stars = Array.from({ length: 40 }, () => `<circle cx="${rnd(0, 340)}" cy="${rnd(0, 120)}" r="${rnd(0.4, 1.3)}" fill="#fff" opacity="${rnd(0.3, 0.9)}"/>`).join('');
  return svg(340, 200, `<defs><radialGradient id="gl"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>${stars}
    <rect x="0" y="150" width="340" height="50" fill="#05070d"/><path d="M0,150 Q170,140 340,150" stroke="#1a2440" fill="none"/>
    ${lights.map((l) => `<circle cx="${l.x}" cy="${l.y || 95}" r="16" fill="${l.col}" opacity=".25"/><circle cx="${l.x}" cy="${l.y || 95}" r="5.5" fill="${l.col}"/>`).join('')}
    <line x1="170" y1="200" x2="170" y2="180" stroke="#5fd6ff" stroke-width="3"/><line x1="150" y1="190" x2="190" y2="190" stroke="#5fd6ff" stroke-width="3"/>
    ${text(170, 22, note || 'De nuit, tu vois ces feux devant toi', { s: 12, c: '#93a1bd', w: 500 })}`, '#03050b');
}
const SIGNALS = [
  ['Vert continu', 'vert', false, 'Autorisé à atterrir', 'Autorisé à décoller'],
  ['Rouge continu', 'rouge', false, 'Cédez le passage et continuez à circuler', 'Arrêtez-vous'],
  ['Éclats verts', 'vert', true, 'Revenez pour atterrir', 'Autorisé à circuler (rouler)'],
  ['Éclats rouges', 'rouge', true, 'Aérodrome dangereux, n’atterrissez pas', 'Dégagez l’aire d’atterrissage'],
  ['Éclats blancs', 'blanc', true, 'Atterrissez ici et gagnez l’aire de trafic', 'Retournez au point de départ'],
];
function towerArt(col, blink, inAir, alt = false) {
  const C = { vert: '#34ff6a', rouge: '#ff3b30', blanc: '#ffffff' };
  const beam = (c, cls = '') => `<path class="${cls}" d="M92,62 L300,${inAir ? 40 : 150} L300,${inAir ? 80 : 182} Z" fill="${c}" opacity=".28"/><circle class="${cls}" cx="92" cy="62" r="9" fill="${c}"/>`;
  return svg(340, 200, `<rect y="160" width="340" height="40" fill="#1b2a1d"/><rect x="70" y="70" width="18" height="90" fill="#cfc8bb"/><rect x="58" y="48" width="44" height="22" rx="4" fill="#5fb0d8"/><rect x="56" y="44" width="48" height="6" fill="#30353f"/>
    ${alt ? `<g class="blink">${beam('#ff3b30')}</g><g style="animation:blink .7s steps(1) infinite reverse">${beam('#34ff6a')}</g>` : beam(C[col], blink ? 'blink' : '')}
    ${inAir ? planeTop(300, 60, 270, '#5fd6ff', 0.6) : `<rect x="250" y="166" width="90" height="10" fill="#3c4048"/>${planeTop(300, 165, 270, '#5fd6ff', 0.55)}`}
    ${text(170, 22, inAir ? '✈️ Tu es EN VOL' : '🛞 Tu es AU SOL', { s: 13, c: '#ffc35c' })}`, '#0d1a2e');
}
function reglesItems() {
  const L = [];
  L.push({ tag: 'Priorités', q: 'Cet avion arrive de ta droite, routes convergentes. Que fais-tu ?', art: prio(other(285, 95, 245)), c: C_PRIO, a: 0, why: 'Priorité à droite : celui qui a l’autre à sa droite cède le passage.' });
  L.push({ tag: 'Priorités', q: 'Cet avion arrive de ta gauche, routes convergentes. Qui cède ?', art: prio(other(55, 95, 115)), c: C_PRIO, a: 1, why: 'Il t’a à sa droite : c’est lui qui cède. Tu gardes cap et vitesse en restant vigilant.' });
  L.push({ tag: 'Priorités', q: 'Face à face, même altitude. Que faites-vous ?', art: prio(other(170, 45, 180)), c: C_PRIO, a: 2, why: 'Face à face : chacun dégage vers sa droite.' });
  L.push({ tag: 'Priorités', q: 'Tu rattrapes cet avion par l’arrière (secteur de moins de 70°). Que fais-tu ?', art: prio(other(170, 70, 0, '#ffc35c'), 'Toi (plus rapide)'), c: C_PRIO, a: 3, why: 'L’avion dépassé est prioritaire : on le dépasse par la droite.' });
  L.push({ tag: 'Catégories', q: 'Tu es en avion. Un planeur arrive de ta GAUCHE. Qui cède ?', art: prio(glider(60, 95, 110) + text(60, 66, 'Planeur', { c: '#62e3a0', s: 12 })), c: C_PRIO, a: 0, why: 'Ordre : avion motorisé → dirigeable → planeur → ballon. L’avion motorisé cède au planeur, même s’il vient de gauche.' });
  L.push({ tag: 'Catégories', q: 'Tu es en planeur. Un dirigeable arrive de ta DROITE. Qui cède ?', art: prio(blimp(285, 100, 250) + text(285, 58, 'Dirigeable', { c: '#b48cff', s: 12 }), 'Toi (planeur)'), c: C_PRIO, a: 1, why: 'Le dirigeable cède aux planeurs et aux ballons : la catégorie l’emporte sur la priorité à droite.' });
  L.push({ tag: 'Catégories', q: 'Tu es en avion. Un ballon dérive à ta droite, sur ta trajectoire. Qui cède ?', art: prio(balloon(260, 90) + text(260, 58, 'Ballon', { c: '#ff6fc8', s: 12 })), c: C_PRIO, a: 0, why: 'Le ballon est prioritaire sur tous : avion, dirigeable et planeur lui cèdent.' });
  L.push({ tag: 'Atterrissage', q: 'Tu es en finale. Un avion en vent arrière annonce « PAN PAN ». Qui atterrit en premier ?', c: ['L’avion en urgence', 'Toi, tu es en finale', 'Le plus lourd des deux', 'Celui qui a contacté la tour en premier'], a: 0, why: 'Priorités à l’atterrissage : 1) avion en détresse ou en urgence, 2) avion en finale.' });
  L.push({ tag: 'Feux de nuit', q: 'Tu vois un feu ROUGE, devant et à ta droite. Que fais-tu ?', art: nightLights([{ x: 255, col: '#ff3b30' }]), c: ['Je cède le passage', 'Il me cède le passage', 'Chacun à droite', 'Je le dépasse par la droite'], a: 0, why: 'Le rouge est le feu gauche de l’autre : il arrive de ta droite et passe devant toi. Rouge à droite = je cède.' });
  L.push({ tag: 'Feux de nuit', q: 'Tu vois un feu VERT, devant et à ta gauche. Qui cède ?', art: nightLights([{ x: 85, col: '#34ff6a' }]), c: ['Je cède le passage', 'Il me cède le passage', 'Chacun à droite', 'Je le dépasse par la droite'], a: 1, why: 'Le vert est son feu droit : il vient de ta gauche, il t’a à sa droite. C’est lui qui cède.' });
  L.push({ tag: 'Feux de nuit', q: 'Tu vois un feu vert à gauche ET un feu rouge à droite, juste devant. Que faites-vous ?', art: nightLights([{ x: 150, col: '#34ff6a' }, { x: 190, col: '#ff3b30' }]), c: ['Je cède le passage', 'Il me cède le passage', 'Chacun dégage par la droite', 'Je le dépasse par la droite'], a: 2, why: 'Tu vois ses deux feux : il vient droit sur toi. Face à face : chacun dégage à droite.' });
  L.push({ tag: 'Feux de nuit', q: 'Tu ne vois qu’un feu BLANC fixe, droit devant, qui se rapproche. Que fais-tu ?', art: nightLights([{ x: 170, col: '#ffffff' }]), c: ['Je cède le passage', 'Il me cède le passage', 'Chacun dégage par la droite', 'Je le dépasse par la droite'], a: 3, why: 'Le feu blanc est à l’arrière : tu le rattrapes. On dépasse par la droite, il est prioritaire.' });
  for (const s of SIGNALS) for (const air of [true, false]) {
    const ans = air ? s[3] : s[4];
    const pool = [...new Set(SIGNALS.flatMap((x) => [x[3], x[4]]).filter((x) => x !== ans))];
    L.push(() => { const d = []; while (d.length < 3) { const p = pick(pool); if (!d.includes(p)) d.push(p); } return { tag: 'Signaux de la tour', q: `${s[0]}, dirigé vers toi. Ça veut dire…`, art: towerArt(s[1], s[2], air), c: [ans, ...d], a: 0, why: `${s[0]} : en vol « ${s[3]} », au sol « ${s[4]} ».` }; });
  }
  L.push({ tag: 'Signaux de la tour', q: 'Fusée ROUGE tirée depuis la tour, tu es en vol. Ça veut dire…', art: towerArt('rouge', true, true), c: ['N’atterrissez pas pour le moment, quelles que soient les instructions précédentes', 'Autorisé à atterrir', 'Revenez pour atterrir', 'Extrême prudence'], a: 0, why: 'La fusée rouge annule toute autorisation : n’atterrissez pas pour le moment.' });
  L.push({ tag: 'Signaux de la tour', q: 'Rouge et vert ALTERNÉS, dirigés vers toi. Ça veut dire…', art: towerArt('rouge', true, true, true), c: ['Extrême prudence', 'Autorisé à atterrir', 'Aérodrome fermé', 'Retournez au parking'], a: 0, why: 'Rouge et vert alternés : extrême prudence (cours REG 19, panne radio).' });
  L.push({ tag: 'Détresse ou urgence', q: 'Un avion allume et éteint ses phares d’atterrissage de façon répétée. C’est…', c: ['Un signal d’urgence', 'Un signal de détresse', 'Un accusé de réception', 'Un signal d’interception'], a: 0, why: 'Urgence : PAN PAN ×3, phares ou feux de navigation allumés puis éteints, XXX en morse. Détresse : SOS, MAYDAY ×3, fusée rouge, 7700.' });
  L.push({ tag: 'Détresse ou urgence', q: 'Lequel est un signal de DÉTRESSE ?', c: ['Une fusée rouge', 'XXX en morse', 'PAN PAN ×3', 'Les phares allumés puis éteints'], a: 0, why: 'Détresse : SOS, MAYDAY ×3, fusée rouge, 7700.' });
  L.push({ tag: 'Hauteurs', q: 'Hauteur minimale VFR au-dessus d’une ville (SERA) ?', c: ['1 000 ft au-dessus de l’obstacle le plus haut dans un rayon de 600 m', '500 ft dans un rayon de 150 m', '1 500 ft dans un rayon de 1 NM', '2 000 ft dans un rayon de 8 km'], a: 0, why: 'Ville : 1 000 ft / 600 m. Ailleurs : 500 ft. IFR : 1 000 ft dans un rayon de 8 km (2 000 ft en montagne).' });
  L.push({ tag: 'Zones', q: 'La zone « D » sur ta carte, c’est…', c: ['Dangereuse : on peut y entrer, à ses risques', 'Interdite en permanence', 'Réglementée : transit avec autorisation', 'Interdite aux militaires'], a: 0, why: 'P = interdite, R = réglementée (autorisation), D = dangereuse (à vos risques), M = interdite aux militaires.' });
  L.push({ tag: 'Plan de vol', q: 'Ton vol contrôlé a du retard sur le plan de vol. À partir de quand faut-il le modifier ?', c: ['30 min', '15 min', '1 h', '2 h'], a: 0, why: 'Retard : 30 min si le vol est contrôlé, 1 h sinon.' });
  L.push({ tag: 'Formation', q: 'En patrouille, chaque avion reste au maximum à quelle distance du leader ?', c: ['0,5 NM latéralement et 100 ft verticalement', '1 NM et 500 ft', '150 m et 50 ft', '2 NM et 1 000 ft'], a: 0, why: 'La formation compte comme un seul avion : 0,5 NM et 100 ft maximum du leader.' });
  L.push({ tag: 'Abordages', q: 'Distance minimale entre deux aéronefs (même en interception) ?', c: ['150 m', '300 m', '500 ft', '0,5 NM'], a: 0, why: '150 m minimum, même en interception.' });
  return L;
}

// ======================================================================= AIS
const DOC = (t, c) => svg(340, 120, `<rect x="120" y="14" width="100" height="92" rx="8" fill="${c}" opacity=".9"/><rect x="132" y="30" width="76" height="6" fill="#0a1222" opacity=".35"/><rect x="132" y="44" width="62" height="6" fill="#0a1222" opacity=".35"/><rect x="132" y="58" width="70" height="6" fill="#0a1222" opacity=".35"/>${text(170, 92, t, { c: '#0a1222', s: 16, w: 800 })}`);
const DOCS = ['AIP (amendement)', 'SUP AIP', 'NOTAM', 'AIC'];
function aisItems() {
  return [
    { tag: 'Le bon document', q: 'Une zone temporaire est créée pour un exercice militaire de deux mois. On la publie dans…', c: DOCS, a: 1, why: 'Information temporaire mais longue, avec des cartes : SUP AIP (supplément).' },
    { tag: 'Le bon document', q: 'Le balisage de la piste est en panne cette nuit. On le publie dans…', c: DOCS, a: 2, why: 'Information temporaire, courte et urgente : NOTAM.' },
    { tag: 'Le bon document', q: 'On explique un changement de réglementation qui arrivera l’an prochain. On le publie dans…', c: DOCS, a: 3, why: 'AIC : circulaire d’information qui explique un changement à venir.' },
    { tag: 'Le bon document', q: 'Les fréquences permanentes d’un aérodrome se trouvent dans…', c: ['L’AIP, partie AD', 'L’AIP, partie ENR', 'Un NOTAM', 'Une AIC'], a: 0, why: 'AIP = permanent. 3 parties : GEN (généralités), ENR (en route), AD (aérodromes).' },
    { tag: 'Les -TAM', q: 'La piste est couverte de neige. Quel message ?', art: DOC('SNOWTAM', '#cfe8ff'), c: ['SNOWTAM', 'ASHTAM', 'BIRDTAM', 'METAR'], a: 0, why: 'SNOWTAM : état de surface de piste. Validité 8 h max, chaque nouveau SNOWTAM annule le précédent.' },
    { tag: 'Les -TAM', q: 'Validité maximale d’un SNOWTAM ?', c: ['8 h', '24 h', '14 jours', '28 jours'], a: 0, why: '8 h maximum. Depuis le 5 novembre 2020, il n’est diffusé que par NOTAM.' },
    { tag: 'Les -TAM', q: 'Des cendres volcaniques sont signalées. Quel message ?', art: DOC('???TAM', '#ffd9a8'), c: ['ASHTAM', 'SNOWTAM', 'BIRDTAM', 'SIGMET seulement'], a: 0, why: 'ASHTAM : cendres volcaniques. BIRDTAM : oiseaux.' },
    { tag: 'NOTAM', q: 'Validité maximale d’un trigger NOTAM ?', c: ['14 jours', '8 h', '28 jours', '3 mois'], a: 0, why: 'Il annonce un amendement d’AIP ou un SUP AIP : 14 jours maximum.' },
    { tag: 'NOTAM', q: 'La série M des NOTAM concerne…', c: ['Les militaires', 'La météo', 'Les aérodromes', 'Les moyens radio'], a: 0, why: 'Séries A, B, D (aérodromes), C (région), M (militaires).' },
    { tag: 'AIRAC', q: 'Le cycle AIRAC, c’est…', c: ['Des changements à dates communes tous les 28 jours', 'Une mise à jour quotidienne', 'Un NOTAM mensuel', 'Une carte des zones dangereuses'], a: 0, why: 'Tous les 28 jours, info diffusée au moins 42 jours avant (56 jours pour un changement majeur).' },
    { tag: 'AIRAC', q: 'Un changement majeur passe par l’AIRAC. Combien de temps avant sa date d’effet faut-il l’annoncer ?', c: ['56 jours', '42 jours', '28 jours', '14 jours'], a: 0, why: '42 jours en général, 56 jours pour un changement majeur.' },
    { tag: 'AIC', q: 'Une AIC de couleur ROSE parle de…', art: DOC('AIC', '#ffb3d1'), c: ['Sécurité', 'Administratif', 'Services de la circulation aérienne', 'Cartes'], a: 0, why: 'Blanc : administratif. Jaune : ATS. Rose : sécurité. Mauve : zones dangereuses. Vert : cartes.' },
    { tag: 'AIC', q: 'Une AIC JAUNE parle de…', art: DOC('AIC', '#ffe680'), c: ['Services de la circulation aérienne', 'Sécurité', 'Cartes', 'Administratif'], a: 0, why: 'Jaune = ATS.' },
    { tag: 'Militaire', q: 'Les procédures aux instruments des avions de chasse sur terrains militaires sont dans…', c: ['MIAC 4', 'MIAC 1', 'MIAC 2', 'AIP partie AD'], a: 0, why: 'MIAC 1 : militaires sur terrains civils. MIAC 2 : transport et hélicos sur terrains militaires. MIAC 4 : chasse.' },
    { tag: 'Récap', q: 'La liste récapitulative des NOTAM et SUP AIP en vigueur paraît…', c: ['Tous les mois', 'Toutes les semaines', 'Tous les 28 jours', 'Tous les ans'], a: 0, why: 'Liste récapitulative mensuelle.' },
  ];
}

// ======================================================================= COMMUNICATIONS
function compass(qdr, extra = '') {
  const r = qdr * Math.PI / 180, ax = 170 + 78 * Math.sin(r), ay = 110 - 78 * Math.cos(r);
  const ticks = Array.from({ length: 36 }, (_, i) => { const a = i * 10 * Math.PI / 180, l = i % 9 === 0 ? 12 : 6; return `<line x1="${170 + 95 * Math.sin(a)}" y1="${110 - 95 * Math.cos(a)}" x2="${170 + (95 - l) * Math.sin(a)}" y2="${110 - (95 - l) * Math.cos(a)}" stroke="#93a1bd"/>`; }).join('');
  return svg(340, 220, `<circle cx="170" cy="110" r="95" fill="#0d1a30" stroke="#2a3757"/>${ticks}${text(170, 30, 'N', { s: 13, c: '#ffc35c' })}${text(258, 115, 'E', { s: 12 })}${text(170, 202, 'S', { s: 12 })}${text(82, 115, 'O', { s: 12 })}
    <rect x="162" y="102" width="16" height="16" fill="#62e3a0"/>${text(170, 132, 'station', { s: 10, c: '#62e3a0' })}
    <line x1="170" y1="110" x2="${ax}" y2="${ay}" stroke="#ffc35c" stroke-width="2" stroke-dasharray="5 4"/>${planeTop(ax, ay, (qdr + 180) % 360, '#5fd6ff', 0.55)}${extra}`);
}
const Q3 = (n) => String(((n % 360) + 360) % 360).padStart(3, '0');
function comItems() {
  const L = [];
  for (let i = 0; i < 3; i++) L.push(() => { const qdr = ri(1, 35) * 10; const ok = Q3(qdr + 180); return { tag: 'Code Q', q: `L’avion est au relèvement ${Q3(qdr)}° (magnétique) depuis la station. Le contrôleur te donne le QDM :`, art: compass(qdr), c: ['QDM ' + ok, 'QDM ' + Q3(qdr), 'QDM ' + Q3(qdr + 90), 'QDM ' + Q3(qdr - 90)], a: 0, why: `QDM = cap magnétique pour rejoindre la station = QDR ± 180° = ${ok}°.` }; });
  L.push({ tag: 'Code Q', q: 'QDR, c’est…', c: ['Le relèvement magnétique de l’avion depuis la station', 'Le cap magnétique vers la station', 'Le relèvement vrai depuis la station', 'La distance à la station'], a: 0, why: 'QDR = depuis la station (magnétique). QDM = vers la station. QTE et QUJ sont en vrai. QGE = distance.' });
  L.push({ tag: 'Code Q', q: 'Le relèvement VRAI de l’avion depuis la station s’appelle…', c: ['QTE', 'QDR', 'QUJ', 'QDL'], a: 0, why: 'QTE = relèvement vrai depuis la station. QUJ = route vraie vers la station.' });
  L.push({ tag: 'Relèvements', q: 'Un relèvement de classe A est précis à…', c: ['± 2°', '± 5°', '± 10°', '± 1°'], a: 0, why: 'A ± 2°, B ± 5°, C ± 10°, D moins précis que C.' });
  L.push({ tag: 'Priorités', q: 'Quel ordre de priorité des messages est le bon ?', c: ['Détresse, urgence, radiogoniométrie, sécurité des vols, météo, régularité', 'Urgence, détresse, sécurité des vols, météo, radiogoniométrie, régularité', 'Détresse, urgence, sécurité des vols, régularité, météo, radiogoniométrie', 'Détresse, sécurité des vols, urgence, météo, régularité, radiogoniométrie'], a: 0, why: 'Détresse > urgence > radiogoniométrie > sécurité des vols > météo > régularité des vols.' });
  L.push({ tag: 'Priorités', q: 'Un message VOLMET est classé…', c: ['Météo', 'Sécurité des vols', 'Régularité des vols', 'Urgence'], a: 0, why: 'Météo sans intérêt immédiat : VOLMET, ATIS, AIREP. La météo d’intérêt immédiat pour un avion en vol = sécurité des vols.' });
  L.push({ tag: 'Priorités', q: 'Un changement d’équipage ou d’horaire est un message de…', c: ['Régularité des vols', 'Sécurité des vols', 'Météo', 'Urgence'], a: 0, why: 'Régularité des vols : maintenance, équipages, passagers, horaires.' });
  L.push({ tag: 'Services', q: 'Le réseau AFTN appartient au…', c: ['Service fixe (AFS), sol-sol', 'Service mobile (AMS), air-sol', 'Service de radionavigation (ARNS)', 'Service de radiodiffusion (ABS)'], a: 0, why: 'AFS = sol-sol (AFTN). AMS = air-sol. ARNS = aides radio. ABS = diffusions à tous.' });
  L.push({ tag: 'Indicatifs', q: 'Indicatif complet F-UAVC. Lequel est un indicatif abrégé correct ?', c: ['F-VC', 'UAVC', 'F-UA', 'AVC'], a: 0, why: '1er caractère + au moins les 2 derniers : F-VC ou F-AVC. Et seulement après que le contrôleur l’a abrégé.' });
  L.push({ tag: 'Indicatifs', q: 'Comment abréger « AIR FRANCE 287 » ?', c: ['On ne l’abrège pas', 'AIR FRANCE 87', 'AF 287', '287'], a: 0, why: 'Compagnie + numéro de vol : jamais abrégé.' });
  L.push({ tag: 'Indicatifs', q: 'Quand peux-tu utiliser ton indicatif abrégé ?', c: ['Après que le contrôleur l’a utilisé', 'Dès le premier contact', 'Jamais en France', 'Seulement en VFR'], a: 0, why: 'Premier contact : indicatif complet. On abrège seulement après le contrôleur.' });
  L.push({ tag: 'Indicatifs', q: 'Un avion « HEAVY » a une masse max au décollage de…', c: ['136 t ou plus', '100 t ou plus', '200 t ou plus', '57 t ou plus'], a: 0, why: 'HEAVY ≥ 136 t, SUPER = A380 : à ajouter après l’indicatif au premier appel à l’approche et à la tour.' });
  L.push({ tag: 'Suffixes', q: 'Le radar d’approche de précision s’appelle…', c: ['PRECISION', 'ARRIVAL', 'APPROACH', 'HOMER'], a: 0, why: 'PRECISION = PAR. HOMER = radiogoniomètre. APPROACH = approche (sans radar).' });
  L.push({ tag: 'Suffixes', q: 'Le suffixe de la délivrance des clairances ?', c: ['DELIVERY', 'DISPATCH', 'GROUND', 'APRON'], a: 0, why: 'DELIVERY = clairances. DISPATCH = compagnie. APRON = aire de trafic.' });
  L.push({ tag: 'Lisibilité', q: '« I read you 3 », ça veut dire…', c: ['Lisible avec difficulté', 'Parfaitement lisible', 'Lisible par moments', 'Illisible'], a: 0, why: '1 illisible, 2 par moments, 3 avec difficulté, 4 lisible, 5 parfaitement lisible.' });
  const MSG = [
    ['« Mistral 66, montez niveau 120, prenez le cap 270. »', ['Niveau 120, cap 270, Mistral 66', 'Mistral 66, bien reçu', 'Wilco, Mistral 66', 'Cap 270, Mistral 66'], 'Niveau et cap se collationnent, suivis de l’indicatif.'],
    ['« Mistral 66, affichez 4521, QNH 1008. »', ['4521, QNH 1008, Mistral 66', 'Roger, Mistral 66', 'Code affiché, Mistral 66', 'QNH 1008, Mistral 66'], 'Codes transpondeur et calages altimétriques : toujours collationnés.'],
    ['« Mistral 66, derrière l’avion en courte finale, alignez-vous piste 34 derrière. »', ['Derrière l’avion en courte finale, alignement piste 34 derrière, Mistral 66', 'Alignement piste 34, Mistral 66', 'Roger, Mistral 66', 'Wilco, Mistral 66'], 'Clairance conditionnelle : on collationne la condition ET l’instruction.'],
    ['« Mistral 66, autorisé décollage piste 34, vent 330, 10 nœuds. »', ['Autorisé décollage piste 34, Mistral 66', 'Roger, Mistral 66', 'Vent 330, 10 nœuds, Mistral 66', 'Décollage, Mistral 66'], 'Décoller, atterrir, entrer ou traverser une piste : on collationne avec la piste. Le vent, non.'],
  ];
  for (const [m, c, w] of MSG) L.push({ tag: 'Collationnement', qhtml: `Le contrôleur : <div class="msgbox">${m}</div>Que réponds-tu ?`, c, a: 0, why: w });
  L.push({ tag: 'Collationnement', q: 'Lequel n’a PAS besoin d’être collationné ?', c: ['Le vent', 'Le QNH', 'Le code transpondeur', 'La piste en service'], a: 0, why: 'On collationne : niveaux, caps, vitesses, pistes, calages, codes, instructions de roulage, CTOT, fréquences, niveau de transition. Pas le vent.' });
  return L;
}

// ======================================================================= AÉRODROMES (3D)
function pisteSim(ctx) {
  const { W, el, esc, THREE, v3 } = ctx;
  const ad = W.ad;
  const L2W = (x, y, z) => ad.localToWorld(new THREE.Vector3(x, y, z));
  const RWL = 30;
  const SPOTS = [
    ['Seuil et bandes de seuil', [0, 0, RWL / 2 - 0.25], [2.2, 1.2, RWL / 2 + 3.5], 'Les bandes blanches longitudinales (« touches de piano ») marquent le seuil : le début de la partie utilisable pour l’atterrissage. Feux de seuil : <b>verts</b>.'],
    ['Numéro de piste', [0, 0, RWL / 2 - 0.85], [1.4, 1.0, RWL / 2 + 2.2], 'QFU 340° → piste <b>34</b> (arrondi à la dizaine, sans le dernier zéro). L’autre bout s’appelle 16.'],
    ['Points de visée et zone de toucher', [0, 0, RWL / 2 - 4], [2.5, 1.6, RWL / 2 + 1.5], 'Deux grands rectangles : le point de visée. Les petites barres de part et d’autre : la zone de toucher des roues (TDZ).'],
    ['Feux de bord, de seuil et d’extrémité', [0, 0, 0], [-6, 2.6, RWL / 2 + 6], 'Bords de piste : <b>blancs</b>, tous les 60 m. Seuil : <b>vert</b>. Extrémité : <b>rouge</b>. Axe (CAT II/III) : blanc, puis rouge et blanc alternés de 900 à 300 m de la fin, puis rouge.'],
    ['Rampe d’approche', [0, 0, RWL / 2 + 3], [3.5, 2, RWL / 2 + 9], 'Barres de feux blancs dans l’axe, avant le seuil. Surélevée : fragile sur les 300 derniers mètres.'],
    ['PAPI', [-0.75, 0, RWL / 2 - 4], [-2.4, 0.8, RWL / 2 - 1.5], '4 boîtiers à <b>gauche</b> de la piste. 2 blancs + 2 rouges = sur le plan. Plus de blancs = trop haut, plus de rouges = trop bas. Visible à 8 km de jour, 32 km de nuit.'],
    ['Taxiway', [-1.8, 0, 6], [-3.6, 1.4, 9], 'Taxiway : axe <b>vert</b>, bords <b>bleus</b> (60 m max entre feux). Le cockpit reste sur l’axe.'],
    ['Point d’attente et panneau rouge', [-0.9, 0, 12.5], [-1.8, 0.7, 14.2], 'Deux traits pleins + deux tirets jaunes, côté pleins vers le taxiway : on s’arrête avant. Panneau <b>rouge</b> à inscription blanche = instruction obligatoire. Point d’attente à 50 m du bord de piste (piste ≥ 900 m) ou 30 m (piste plus courte).'],
    ['Manche à air', [1.2, 0.4, -12], [2.4, 1.2, -10.2], 'Indique le vent. Au moins une est éclairée la nuit.'],
    ['Aire à signaux', [-4, 0, -6], [-4.6, 2.2, -4.2], 'Carré noir près de la tour : on y pose des signaux visibles du ciel (le T d’atterrissage indique le sens d’atterrissage).'],
  ];
  let mode = 'explore', stop = null;
  const go = (s) => { const t = L2W(...s[1]), p = L2W(...s[2]); W.camTo(p, t, 1.3); };
  function explore() {
    W.setNight(0.6); stop && stop(); stop = null; mode = 'explore';
    el.innerHTML = `<div class="sim"><h3>🛣️ Visite de la piste</h3><p class="hint">Touche un élément : la caméra y va. Fais tourner la vue avec le doigt. Ensuite, lance le défi (PAPI, distances, couleurs des feux).</p>
      <div class="row">${SPOTS.map((s, i) => `<button class="btn sm" data-s="${i}">${esc(s[0])}</button>`).join('')}</div><div id="pinfo" class="card" style="display:none"></div>
      <div class="row"><button class="btn" id="bday">☀️ Jour</button><button class="btn" id="bnight">🌙 Nuit</button></div><button class="btn pri big" id="pgo">Lancer le défi 🎯</button></div>`;
    el.querySelectorAll('[data-s]').forEach((b) => b.onclick = () => { const s = SPOTS[+b.dataset.s]; go(s); const inf = el.querySelector('#pinfo'); inf.style.display = 'block'; inf.innerHTML = `<h3>${esc(s[0])}</h3><div class="cbody"><p>${s[3]}</p></div>`; });
    el.querySelector('#bday').onclick = () => W.setNight(0); el.querySelector('#bnight').onclick = () => W.setNight(1);
    el.querySelector('#pgo').onclick = defi;
  }
  // PAPI : on place la caméra sur la finale, à un angle réel donné
  function papiArt(angle) {
    return (cx, box) => {
      W.setNight(0.75);
      const thr = L2W(0, 0, RWL / 2), dir = L2W(0, 0, RWL / 2 + 1).sub(thr).normalize();
      const papi = L2W(-0.75, 0.07, RWL / 2 - 4), d = 30;
      const p = papi.clone().addScaledVector(dir, d); p.y = 0.07 + d * Math.tan(angle * Math.PI / 180) * 2.5;
      W.camTo(p, papi.clone().add(v3(0, 0.3, 0)).addScaledVector(dir, -2), 1.2);
      const draw = () => { const a = W.papiAngle(); const lim = [3.5, 3 + 1 / 6, 2 + 5 / 6, 2.5]; box.innerHTML = svg(340, 90, `${text(170, 20, 'PAPI (à gauche de la piste), zoom', { s: 12, c: '#93a1bd', w: 500 })}${[0, 1, 2, 3].map((i) => { const white = a > lim[i]; return `<circle cx="${110 + (3 - i) * 40}" cy="55" r="14" fill="${white ? '#ffffff' : '#ff3b30'}"/><circle cx="${110 + (3 - i) * 40}" cy="55" r="22" fill="${white ? '#ffffff' : '#ff3b30'}" opacity=".18"/>`; }).join('')}`, '#05070d'); };
      const iv = setInterval(draw, 200); draw();
      return () => clearInterval(iv);
    };
  }
  const PAPI_C = ['Trop bas (4 rouges)', 'Un peu bas (3 rouges)', 'Sur le plan (2 + 2)', 'Un peu haut (3 blancs)', 'Trop haut (4 blancs)'];
  const distArt = (tora, stop_, clear, disp) => svg(340, 150, `
    <rect x="20" y="70" width="${tora / 10}" height="22" fill="#3c4048"/>${disp ? `<rect x="20" y="70" width="${disp / 10}" height="22" fill="#55505a"/><line x1="${20 + disp / 10}" y1="66" x2="${20 + disp / 10}" y2="96" stroke="#34ff6a" stroke-width="3"/>${text(20 + disp / 20, 110, 'seuil décalé', { s: 10, c: '#9ff0c6' })}` : ''}
    <rect x="${20 + tora / 10}" y="70" width="${stop_ / 10}" height="22" fill="#6b6f78" stroke="#ffc35c" stroke-dasharray="4 3"/>
    <rect x="${20 + tora / 10}" y="40" width="${clear / 10}" height="70" fill="rgba(95,214,255,.12)" stroke="#5fd6ff" stroke-dasharray="4 3"/>
    ${text(20 + tora / 20, 62, `piste ${tora} m`, { s: 12 })}${text(20 + tora / 10 + stop_ / 20, 128, `stopway ${stop_} m`, { s: 11, c: '#ffc35c' })}${text(20 + tora / 10 + clear / 20, 34, `clearway ${clear} m`, { s: 11, c: '#5fd6ff' })}
    ${arrow(30, 140, 300, 140, '#93a1bd', 1.5)}${text(170, 22, 'Décollage vers la droite →', { s: 11, c: '#93a1bd', w: 500 })}`);
  function defi() {
    mode = 'defi';
    const items = [];
    for (const [ang, a] of [[1.9, 0], [2.65, 1], [3.0, 2], [3.35, 3], [3.9, 4]]) items.push({ tag: 'PAPI', q: 'Tu es en finale. Que te dit le PAPI ?', art: papiArt(ang + rnd(-0.06, 0.06)), c: PAPI_C, a, keep: true, why: 'Plus de blancs = trop haut, plus de rouges = trop bas. 2 blancs + 2 rouges = sur le plan (3°).' });
    items.push(() => { const tora = ri(20, 26) * 100, st = ri(1, 3) * 100, cl = ri(3, 5) * 100; return { tag: 'Distances déclarées', q: 'Combien vaut la TODA ?', art: distArt(tora, st, cl, 0), c: [`${tora + cl} m`, `${tora + st} m`, `${tora} m`, `${tora + st + cl} m`], a: 0, why: `TODA = TORA + clearway = ${tora} + ${cl} = ${tora + cl} m. ASDA = TORA + stopway.` }; });
    items.push(() => { const tora = ri(20, 26) * 100, st = ri(1, 3) * 100, cl = ri(3, 5) * 100; return { tag: 'Distances déclarées', q: 'Combien vaut l’ASDA ?', art: distArt(tora, st, cl, 0), c: [`${tora + st} m`, `${tora + cl} m`, `${tora} m`, `${tora + st + cl} m`], a: 0, why: `ASDA = TORA + stopway = ${tora} + ${st} = ${tora + st} m.` }; });
    items.push(() => { const tora = ri(22, 28) * 100, d = ri(2, 5) * 100; return { tag: 'Distances déclarées', q: 'Le seuil est décalé. Combien vaut la LDA ?', art: distArt(tora, 100, 300, d), c: [`${tora - d} m`, `${tora} m`, `${tora + 100} m`, `${tora - 2 * d} m`], a: 0, why: `La LDA commence au seuil décalé : ${tora} − ${d} = ${tora - d} m.` }; });
    items.push({ tag: 'Feux', q: 'De quelle couleur sont les feux de bord de taxiway ?', c: ['Bleus', 'Verts', 'Blancs', 'Jaunes'], a: 0, why: 'Taxiway : axe vert, bords bleus. Piste : bords blancs, seuil vert, fin rouge.' });
    items.push({ tag: 'Feux', q: 'Les feux d’extrémité de piste (vus depuis la piste) sont…', c: ['Rouges', 'Verts', 'Blancs', 'Jaunes'], a: 0, why: 'Extrémité : rouge. Seuil : vert.' });
    items.push({ tag: 'Feux', q: 'Un obstacle de plus de 150 m de haut porte des feux…', c: ['Blancs à éclats, haute intensité', 'Rouges fixes, basse intensité', 'Bleus à éclats', 'Verts fixes'], a: 0, why: 'Sous 45 m : rouge fixe basse intensité. 45-150 m : rouge ou blanc à éclats, moyenne intensité. Au-dessus : blanc à éclats haute intensité.' });
    items.push({ tag: 'Zones', q: 'La RESA, c’est…', c: ['L’aire de sécurité d’extrémité, contre le dépassement de piste', 'Le prolongement dégagé', 'La bande de piste', 'Le prolongement d’arrêt'], a: 0, why: 'RESA : après la bande, 90 m minimum, 2 fois la largeur de la piste, pas dans les distances déclarées.' });
    items.push({ tag: 'Zones', q: 'Une piste est « équilibrée » quand…', c: ['TODA = ASDA (clearway = stopway)', 'TORA = LDA', 'Elle n’a pas de pente', 'ACN = PCN'], a: 0, why: 'Piste équilibrée : TODA = ASDA.' });
    items.push({ tag: 'Chaussée', q: 'Un avion peut utiliser la piste si…', c: ['ACN ≤ PCN', 'PCN ≤ ACN', 'ACN = 0', 'La piste fait plus de 2 000 m'], a: 0, why: 'PCN : ce que supporte la chaussée. ACN : l’effet de l’avion. Il faut ACN ≤ PCN.' });
    items.push({ tag: 'État de piste', q: 'Une piste est « contaminée » quand plus de … de sa surface est couverte (eau ou slush > 3 mm, neige, glace) :', c: ['25 %', '10 %', '50 %', '75 %'], a: 0, why: 'Plus de 25 % de la surface utilisée.' });
    stop = runScenario(ctx, { title: 'Défi piste', icon: '🎯', intro: '<p>5 approches au <b>PAPI</b> : regarde les lumières et dis où tu es. Puis distances déclarées, feux et zones.</p>', items, n: 12 });
  }
  explore();
  return () => { stop && stop(); W.setNight(0); };
}

// ======================================================================= CONTRÔLE D'AÉRODROME
const CATC = { L: '#62e3a0', M: '#5fd6ff', H: '#ffc35c', A380: '#ff6fc8' };
const wakeArt = (lead, foll, phase) => svg(340, 130, `${text(170, 20, phase, { s: 12, c: '#93a1bd', w: 500 })}
  <line x1="20" y1="95" x2="320" y2="95" stroke="#3c4048" stroke-width="10"/>
  ${planeTop(250, 70, 90, CATC[lead], lead === 'A380' ? 1.2 : lead === 'H' ? 1 : lead === 'M' ? 0.8 : 0.6)}${text(250, 118, 'devant : ' + lead, { s: 12, c: CATC[lead] })}
  ${planeTop(90, 70, 90, CATC[foll], foll === 'H' ? 1 : foll === 'M' ? 0.8 : 0.6)}${text(90, 118, 'derrière : ' + foll, { s: 12, c: CATC[foll] })}
  <path d="M215,64 C180,60 160,80 125,70" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none" stroke-dasharray="3 4"/>`);
function circuitArt(hl) {
  const legs = { 'Montée initiale': 'M170,80 L170,52', 'Vent traversier': 'M170,52 Q170,32 150,32 L82,32', 'Vent arrière': 'M82,32 Q62,32 62,52 L62,168', 'Étape de base': 'M62,168 Q62,188 82,188 L150,188', 'Finale': 'M150,188 Q170,188 170,168 L170,160' };
  return svg(340, 220, `<rect x="164" y="80" width="12" height="80" fill="#3c4048"/>${text(192, 152, '34', { s: 11 })}${text(192, 92, '16', { s: 11, c: '#93a1bd' })}
    ${Object.entries(legs).map(([k, d]) => `<path d="${d}" stroke="${k === hl ? '#ffc35c' : 'rgba(255,255,255,.28)'}" stroke-width="${k === hl ? 5 : 3}" fill="none" stroke-linecap="round"/>`).join('')}
    ${arrow(170, 70, 170, 56, 'rgba(255,255,255,.5)', 2)}${text(262, 104, 'Circuit main gauche', { s: 12, c: '#93a1bd', w: 500 })}${text(262, 122, '1 000 ft', { s: 12, c: '#93a1bd', w: 500 })}${text(262, 140, 'décollage vers le nord', { s: 11, c: '#93a1bd', w: 500 })}`);
}
function ctlItems() {
  const L = [];
  const W3 = [['L', 'H', 'Arrivée', '3 min'], ['L', 'M', 'Arrivée', '3 min'], ['M', 'A380', 'Arrivée', '3 min'], ['L', 'A380', 'Arrivée', '4 min'], ['L', 'H', 'Départ, même piste', '2 min'], ['M', 'A380', 'Départ, même piste', '3 min'], ['L', 'A380', 'Départ depuis une partie intermédiaire', '4 min'], ['L', 'M', 'Départ depuis une partie intermédiaire', '3 min']];
  for (const [f, l, ph, ans] of W3) L.push({ tag: 'Sillage', q: `${ph} : ${f} derrière ${l}. Séparation minimale ?`, art: wakeArt(l, f, ph), c: ['2 min', '3 min', '4 min', '1 min'], a: ['2 min', '3 min', '4 min', '1 min'].indexOf(ans), keep: true, why: 'Arrivée : 3 min L derrière H ou M, 3 min M derrière A380, 4 min L derrière A380. Départ : 2 min standard ; 3 min L ou M derrière A380 ; depuis une partie intermédiaire, 3 min (L ou M derrière H, L derrière M) et 4 min derrière A380.' });
  L.push({ tag: 'RECAT-EU', q: 'RECAT-EU, c’est…', c: ['6 catégories, séparation de 80 à 180 s', '4 catégories, séparation en NM', '3 catégories, 2 min fixes', '8 catégories, séparation radar seulement'], a: 0, why: 'Pionnier : Paris-CDG. 6 catégories au lieu de 4, séparation en secondes de 80 s à 180 s.' });
  for (const leg of ['Vent arrière', 'Étape de base', 'Vent traversier']) L.push({ tag: 'Tour de piste', q: 'Comment s’appelle la branche en jaune ?', art: circuitArt(leg), c: ['Vent arrière', 'Étape de base', 'Vent traversier', 'Montée initiale', 'Finale'], a: ['Vent arrière', 'Étape de base', 'Vent traversier', 'Montée initiale', 'Finale'].indexOf(leg), keep: true, why: 'Montée initiale → vent traversier → vent arrière → étape de base → finale. Virages à gauche sauf instruction contraire.' });
  L.push({ tag: 'Positions', q: 'Tu veux rouler du parking au point d’attente. Qui appelles-tu ?', c: ['GROUND (sol)', 'TOWER (tour)', 'DELIVERY', 'APPROACH'], a: 0, why: 'Sol : taxiways et aire de trafic. Tour : piste et circuit. Delivery : mise en route et clairances IFR.' });
  L.push({ tag: 'Positions', q: 'Ta clairance IFR de départ, tu la demandes à…', c: ['DELIVERY', 'GROUND', 'TOWER', 'CONTROL'], a: 0, why: 'Délivrance : mise en route et clairances IFR au départ (à Salon : PROVENCE DELIVERY).' });
  L.push({ tag: 'Vocabulaire', q: 'L’aire de MANŒUVRE comprend…', c: ['Pistes + taxiways, sans l’aire de trafic', 'Pistes + taxiways + aire de trafic', 'L’aire de trafic seulement', 'Les pistes seulement'], a: 0, why: 'Aire de mouvement = aire de manœuvre + aire de trafic.' });
  L.push({ tag: 'Vocabulaire', q: '« Piste dégagée » se dit quand…', c: ['Tout l’avion a franchi le point d’attente', 'Le train principal a quitté la piste', 'L’avion a quitté l’axe', 'L’avion a ralenti sous 30 kt'], a: 0, why: 'Tout l’avion doit être au-delà du point d’attente.' });
  L.push({ tag: 'Piste', q: 'Un avion qui atterrit n’a pas encore dépassé le point d’attente. Peut-on aligner un avion au départ ?', c: ['Non', 'Oui, sans restriction', 'Oui si c’est un léger', 'Oui de jour seulement'], a: 0, why: 'Alignement interdit tant que l’avion qui atterrit n’a pas dépassé le point d’attente.' });
  L.push({ tag: 'Point d’attente', q: 'Sur une piste de 2 000 m, le point d’attente est à au moins…', c: ['50 m du bord de piste', '30 m du bord de piste', '90 m du bord de piste', '150 m du bord de piste'], a: 0, why: '50 m si la piste fait 900 m ou plus, 30 m si elle est plus courte.' });
  L.push({ tag: 'VFR spécial', q: 'Le VFR spécial en CTR n’est jamais accordé sous…', c: ['1 500 m de visibilité', '5 km de visibilité', '800 m de visibilité', '3 000 m de visibilité'], a: 0, why: 'Accordé si plafond < 1 500 ft ou visibilité < 5 km, mais jamais sous 1 500 m. Clairance obligatoire.' });
  L.push({ tag: 'Priorités', q: 'Qui passe en premier à l’atterrissage ?', c: ['Un avion en détresse', 'Un avion sanitaire', 'Un avion SAR', 'Le premier en finale'], a: 0, why: 'Détresse ou urgence, puis sanitaire, puis SAR, puis les autres désignés par l’autorité.' });
  L.push({ tag: 'Radio', q: 'Quand un HEAVY ajoute-t-il « HEAVY » après son indicatif ?', c: ['Au premier contact avec la tour au départ et avec l’approche à l’arrivée', 'À chaque message', 'Jamais en France', 'Seulement en urgence'], a: 0, why: 'Au premier contact : tour au départ, approche à l’arrivée.' });
  return L;
}

// ======================================================================= DÉPARTS : pente de montée
function profileArt(d, h, pdg) {
  // d (m) distance de l'obstacle au DER, h (m) hauteur au-dessus du DER
  const X = (m) => 40 + m / 6000 * 280, Y = (m) => 190 - m * 0.9;
  const ois = (m) => 5 + 0.025 * m;
  return svg(340, 210, `<rect x="0" y="190" width="340" height="20" fill="#2a3a24"/><rect x="0" y="186" width="40" height="6" fill="#3c4048"/>${text(40, 205, 'DER', { s: 11, c: '#ffc35c' })}
    <line x1="${X(0)}" y1="${Y(5)}" x2="${X(6000)}" y2="${Y(ois(6000))}" stroke="#ff6a4d" stroke-width="2" stroke-dasharray="6 4"/>${text(X(5200), Y(ois(5200)) + 16, 'OIS 2,5 %', { s: 11, c: '#ff8a70' })}
    <line x1="${X(0)}" y1="${Y(5)}" x2="${X(6000)}" y2="${Y(5 + 0.033 * 6000)}" stroke="#62e3a0" stroke-width="2"/>${text(X(4300), Y(5 + 0.033 * 4300) - 8, '3,3 %', { s: 11, c: '#62e3a0' })}
    ${pdg ? `<line x1="${X(0)}" y1="${Y(5)}" x2="${X(6000)}" y2="${Y(5 + pdg / 100 * 6000)}" stroke="#ffc35c" stroke-width="3"/>` : ''}
    <path d="M${X(d) - 18},190 L${X(d)},${Y(h)} L${X(d) + 18},190 Z" fill="#7a6a3a"/>${text(X(d), Y(h) - 8, `${h} m à ${(d / 1000).toFixed(1).replace('.', ',')} km`, { s: 11 })}`);
}
const reqPDG = (d, h) => Math.max(3.3, ((h - 5) / d + 0.008) * 100);
function departSim(ctx) {
  const { el } = ctx;
  const items = [];
  for (let i = 0; i < 4; i++) items.push(() => {
    const d = ri(15, 50) * 100, pierce = Math.random() < 0.65, h = Math.round(pierce ? 5 + 0.025 * d + ri(10, 60) : 5 + 0.025 * d - ri(10, 30));
    const r = reqPDG(d, h), ok = r.toFixed(1).replace('.', ',') + ' %';
    const wrong = [(r + 0.8).toFixed(1), Math.max(2.5, r - 0.8).toFixed(1), ((h - 5) / d * 100).toFixed(1)].map((x) => x.replace('.', ',') + ' %').filter((x) => x !== ok);
    const c = [...new Set([ok, ...wrong, '3,3 %'])].slice(0, 4);
    return { tag: 'Pente', q: 'Quelle pente de montée la procédure doit-elle imposer ?', art: profileArt(d, h, r), c, a: 0, why: h > 5 + 0.025 * d ? `L’obstacle perce l’OIS (${(5 + 0.025 * d).toFixed(0)} m à cet endroit). Pente = (h − 5 m)/d + 0,8 % de MOC = (${h} − 5)/${d} + 0,8 % ≈ ${ok}, publiée avec son altitude.` : `L’obstacle est sous l’OIS (${(5 + 0.025 * d).toFixed(0)} m à cet endroit) : pente standard 3,3 % (OIS 2,5 % + MOC 0,8 %).` };
  });
  items.push({ tag: 'Construction', q: 'L’OIS commence à quelle hauteur au-dessus du DER ?', c: ['5 m (16 ft)', '0 m', '35 ft', '50 ft'], a: 0, why: 'Surface imaginaire à 2,5 %, qui part à 5 m (16 ft) au-dessus du DER.' });
  items.push({ tag: 'Construction', q: 'Que vaut la MOC à 5 km du DER ?', c: ['40 m', '0,8 m', '125 m', '400 m'], a: 0, why: 'MOC = 0,8 % × distance = 0,008 × 5 000 = 40 m.' });
  items.push({ tag: 'Types', q: 'Peu d’IFR et pas d’obstacle : quel type de départ ?', c: ['Sans route publiée (instructions locales)', 'SID', 'Départ omnidirectionnel', 'Départ RNAV'], a: 0, why: 'SID : beaucoup d’IFR/obstacles. Omnidirectionnel : moins. Sans route publiée : très peu. Et le guidage radar.' });
  items.push({ tag: 'Ligne droite', q: 'Un départ est « en ligne droite » si la divergence reste inférieure à…', c: ['15° dans les 10 km', '30° dans les 5 NM', '45° dans les 10 NM', '5° dans les 2 km'], a: 0, why: '15° max dans les 10 km (5,4 NM). Au-delà : départ avec virage, ligne droite jusqu’à 120 m (394 ft) au-dessus du DER au minimum.' });
  items.push({ tag: 'Virage', q: 'Départ avec virage : pas de virage avant quelle hauteur au-dessus du DER ?', c: ['120 m (394 ft)', '5 m (16 ft)', '300 m (1 000 ft)', '50 m (164 ft)'], a: 0, why: 'Ligne droite jusqu’à 120 m (394 ft) au minimum, puis virage au taux 3°/s.' });
  items.push({ tag: 'Catégories', q: 'Vitesse max d’un avion de catégorie C pour les procédures de départ ?', c: ['265 kt (490 km/h)', '165 kt', '290 kt', '120 kt'], a: 0, why: 'A 120 kt, B 165 kt, C 265 kt, D 290 kt, E 300 kt : vitesses de l’interrompue finale + 10 %.' });
  items.push({ tag: 'DER', q: 'Le DER est défini sur une largeur de…', c: ['300 m', '150 m', '45 m', '1 NM'], a: 0, why: 'La procédure commence en bout de piste, sur une largeur de 300 m.' });
  const extra = `<div class="card"><h3>🧪 Bac à sable</h3><p class="hint">Place un obstacle et regarde la pente qu’il impose.</p><div class="art" id="pbox"></div>
    <div class="range"><span>Distance</span><input type="range" id="pd" min="500" max="6000" step="100" value="3000"><output id="od"></output></div>
    <div class="range"><span>Hauteur</span><input type="range" id="ph" min="10" max="250" step="5" value="110"><output id="oh"></output></div><p id="pres" class="big"></p></div>`;
  return runScenario(ctx, { title: 'Pente de montée', icon: '📈', intro: '<p>L’OIS part à <b>5 m</b> au-dessus du DER avec <b>2,5 %</b>. On ajoute <b>0,8 %</b> de MOC : pente standard <b>3,3 %</b>. Si un obstacle perce l’OIS, la pente monte : <b>(h − 5 m) / d + 0,8 %</b>.</p>', items, n: 10, extraIntro: extra,
    onIntro: (root) => {
      const upd = () => { const d = +root.querySelector('#pd').value, h = +root.querySelector('#ph').value, r = reqPDG(d, h); root.querySelector('#od').textContent = (d / 1000).toFixed(1).replace('.', ',') + ' km'; root.querySelector('#oh').textContent = h + ' m'; root.querySelector('#pbox').innerHTML = profileArt(d, h, r); root.querySelector('#pres').innerHTML = `${h > 5 + 0.025 * d ? '⚠️ Perce l’OIS' : '✅ Sous l’OIS'} → pente ${r.toFixed(1).replace('.', ',')} %`; };
      root.querySelector('#pd').oninput = upd; root.querySelector('#ph').oninput = upd; upd();
    } });
}

export const SIMS_A = {
  regles: { start: (ctx) => runScenario(ctx, { title: 'Règles de l’air', icon: '⚖️', intro: '<p>Priorités, feux de nuit, signaux lumineux de la tour, détresse et urgence. <b>Rouge à droite = je cède.</b></p>', items: reglesItems(), n: 14 }) },
  ais: { start: (ctx) => runScenario(ctx, { title: 'Le bon document', icon: '📚', intro: '<p>AIP permanent, SUP AIP temporaire long, NOTAM temporaire court et urgent, AIC pour expliquer. À toi de classer.</p>', items: aisItems(), n: 12 }) },
  com: { start: (ctx) => runScenario(ctx, { title: 'Radio', icon: '📻', intro: '<p>QDM, QDR, priorités des messages, indicatifs, suffixes, et surtout le <b>collationnement</b>.</p>', items: comItems(), n: 14 }) },
  piste: { start: pisteSim },
  ctl: { start: (ctx) => runScenario(ctx, { title: 'Chef de tour', icon: '🗼', intro: '<p>Turbulence de sillage, tour de piste, positions de contrôle, VFR spécial : prends la place du contrôleur.</p>', items: ctlItems(), n: 14 }) },
  pente: { start: departSim },
};
