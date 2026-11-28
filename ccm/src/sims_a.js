// Simus de la phase « cellule et systèmes » : conception, structure, feu, hydraulique, train, commandes,
// pressurisation, oxygène et givre, carburant.
import { runScenario, slider, seg, toggle, row, button, holder, loop, orderTask, pickTask, sortTask, pad, svg, arrow, text, gauge, vbar, lamp, fmt1, fmtk } from './engine.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const Q = (tag, q, c, why, o = {}) => ({ tag, q, c, a: 0, why, ...o }); // la bonne réponse est la première (mélangée à l'affichage)

// avion de ligne vu de dessus (nez en haut), centré en (x, y)
const JET = (x, y, s = 1, col = '#cfd8e6') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,-92 C7,-88 9,-74 9,-60 L9,-14 L78,18 L78,28 L9,12 L8,58 L30,74 L30,82 L0,76 L-30,82 L-30,74 L-8,58 L-9,12 L-78,28 L-78,18 L-9,-14 L-9,-60 C-9,-74 -7,-88 0,-92 Z" fill="${col}" stroke="#0a1222" stroke-width="2"/><ellipse cx="-34" cy="4" rx="5" ry="11" fill="#8a94a6"/><ellipse cx="34" cy="4" rx="5" ry="11" fill="#8a94a6"/></g>`;

// ======================================================================= 1. CONCEPTION ET FATIGUE
function crackTask(ctx, T) {
  const a = (N) => 0.2 * Math.exp(Math.log(125) * (N - 12000) / 20000), NMAX = 34000, DET = 2, CRIT = 25;
  const s = slider(T.lab, { label: 'Intervalle entre deux inspections', min: 1000, max: 12000, step: 500, value: 11000, unit: 'cycles', fmt: fmtk }, draw);
  const hold = holder(T, 900);
  function draw() {
    const I = s.get(), X = (N) => 30 + N / NMAX * 290, Y = (mm) => 170 - Math.min(mm, 30) / 30 * 136;
    let path = ''; for (let N = 12000; N <= NMAX; N += 500) path += (path ? 'L' : 'M') + X(N).toFixed(1) + ',' + Y(a(N)).toFixed(1);
    let marks = '', found = null, n = 0;
    for (let N = I; N <= NMAX; N += I) { const v = a(N), det = v >= DET && v < CRIT; if (det) { n++; if (found === null) found = N; } marks += `<line x1="${X(N)}" x2="${X(N)}" y1="34" y2="170" stroke="${det ? (found === N ? '#62e3a0' : 'rgba(98,227,160,.45)') : 'rgba(255,255,255,.14)'}" stroke-width="2" stroke-dasharray="3 3"/>`; }
    T.art.innerHTML = svg(340, 200, `${marks}<line x1="30" x2="320" y1="${Y(DET)}" y2="${Y(DET)}" stroke="#5fd6ff" stroke-dasharray="5 4"/>${text(318, Y(DET) - 5, 'visible à l’inspection (2 mm)', { s: 10, a: 'end', c: '#5fd6ff' })}
      <line x1="30" x2="320" y1="${Y(CRIT)}" y2="${Y(CRIT)}" stroke="#ff6a4d" stroke-width="2"/>${text(318, Y(CRIT) - 5, 'longueur critique : rupture', { s: 10, a: 'end', c: '#ff6a4d' })}
      <path d="${path}" stroke="#ffc35c" stroke-width="3" fill="none"/>${text(36, Y(0.3) - 6, 'fissure', { s: 10, a: 'start', c: '#ffc35c' })}${text(175, 192, 'cycles de vol →  (traits verticaux = inspections)', { s: 10, c: '#93a1bd' })}
      ${text(170, 20, found === null ? '💥 Fissure jamais vue avant la rupture !' : `Vue à ${fmtk(found)} cycles · ${n} inspection${n > 1 ? 's' : ''} dans la fenêtre`, { s: 12.5, c: found === null ? '#ff6a4d' : n >= 2 ? '#62e3a0' : '#ffc35c', w: 800 })}`);
    hold(n >= 2, 'C’est la logique damage-tolerant : on suppose que la fissure existe et on règle les inspections pour avoir au moins deux occasions de la voir entre « visible » et « critique ».');
  }
  draw();
}
const SPOTS = svg(340, 210, `${JET(170, 105, 1.05)}
  ${[[1, 152, 100], [2, 206, 104], [3, 170, 150], [4, 236, 128], [5, 163, 50], [6, 170, 186], [7, 252, 124], [8, 118, 128]].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="rgba(255,195,92,.25)" stroke="#ffc35c" stroke-width="2"/>${text(x, y + 4, n, { s: 11, w: 800, c: '#ffc35c' })}`).join('')}`);
const conceptionTasks = [
  { tag: 'Prévol', q: 'Visite prévol : sélectionne les 4 zones à surveiller en priorité (fissures, bosses, corrosion).', task: pickTask(['① Emplanture d’aile', '② Bâti moteur (mât)', '③ Jonctions du fuselage', '④ Attaches des gouvernes', '⑤ Hublots passagers', '⑥ Logo de la dérive', '⑦ Feu de navigation', '⑧ Bord d’attaque des volets'], [0, 1, 2, 3], { art: SPOTS }), why: 'Les zones très chargées : emplanture, bâti moteur, jonctions du fuselage, attaches des gouvernes. Une lampe et un miroir aident.' },
  { tag: 'Damage-tolerant', q: 'Une fissure grandit sous les cycles. Règle l’intervalle d’inspection pour la voir au moins deux fois avant la rupture.', task: crackTask, why: 'Amorçage → propagation → rupture : la fissure grandit de plus en plus vite. Des inspections trop espacées la ratent.' },
  { tag: 'Philosophies', q: 'Range chaque exemple dans la bonne philosophie de conception.', task: sortTask([
    ['On dépose le train après 20 000 cycles, même s’il a l’air neuf.', 0, 'Durée de vie fixée par les essais de fatigue : safe-life.'],
    ['Quatre ferrures tiennent le mât : si l’une casse, les trois autres reprennent la charge.', 1, 'Plusieurs chemins d’effort : fail-safe.'],
    ['On suppose que des fissures existent et on les cherche aux inspections programmées.', 2, 'Damage-tolerant : mécanique de la rupture + inspections.'],
    ['Le fuselage est conçu pour finir le vol après la rupture d’un cadre.', 1, 'Rupture partielle, mais on atterrit : fail-safe.'],
    ['On calcule la vitesse de propagation d’une fissure pour fixer les visites.', 2, 'Damage-tolerant.'],
    ['Une pièce de moteur est retirée à sa limite de cycles, quel que soit son état.', 0, 'Safe-life : on jette avant que ça casse.'],
  ], ['Safe-life', 'Fail-safe', 'Damage-tolerant'], { n: 5 }), why: 'Safe-life = je jette avant que ça casse. Fail-safe = si ça casse, autre chose tient. Damage-tolerant = je sais que ça fissure, je surveille.' },
  { tag: 'Maintenance', q: 'Range chaque action dans le bon type de maintenance.', task: sortTask([
    ['Révision générale du moteur à son TBO, quel que soit son état.', 0, 'Intervalle fixe : hard-time.'],
    ['On change les freins quand la tige témoin ne dépasse plus.', 1, 'Mesure comparée à une limite : on-condition.'],
    ['On suit l’analyse d’huile, vol après vol, pour voir une tendance.', 2, 'Tendance statistique, sans limite fixe : condition monitoring.'],
    ['Pneu changé quand l’usure atteint le repère.', 1, 'On-condition.'],
    ['Suivi des vibrations et de l’EGT (EHM), sans démontage.', 2, 'Condition monitoring.'],
    ['Remplacement systématique d’un équipement toutes les 6 000 h.', 0, 'Hard-time.'],
  ], ['Hard-time', 'On-condition', 'Condition monitoring'], { n: 5 }), why: 'On-condition = une mesure face à une limite. Condition monitoring = une tendance, sans limite fixe.' },
];
const conceptionItems = [
  Q('Fatigue', 'Une charge cyclique peut casser une pièce…', ['Sous sa résistance maximale : c’est la fatigue', 'Seulement au-dessus de sa résistance maximale', 'Jamais si la pièce est en composite', 'Seulement si elle est corrodée'], 'Des charges répétées font naître puis grandir une fissure, même bien sous la résistance maximale.'),
  Q('Fatigue', 'Les trois étapes de la fatigue, dans l’ordre ?', ['Amorçage → propagation → rupture', 'Propagation → amorçage → rupture', 'Corrosion → amorçage → rupture', 'Rupture → propagation → amorçage'], 'Une fissure s’amorce, se propage, puis la pièce rompt.'),
  Q('Fatigue', 'Lequel de ces facteurs aggrave la fatigue ?', ['Les manœuvres à fort facteur de charge', 'Un vol de croisière stable', 'Un hangar chauffé', 'Une peinture neuve'], 'Aggravent la fatigue : corrosion, nombre de cycles, fort facteur de charge, contrainte élevée, mauvaise maintenance.'),
  Q('Corrosion', 'Poudre blanche ou verdâtre sur un panneau en aluminium : c’est…', ['De la corrosion', 'Du givre résiduel', 'Une peinture qui farine, sans gravité', 'De l’huile séchée, normale'], 'Aluminium : poudre blanche ou verdâtre. Acier : rouille. Aussi : piqûres, exfoliation.'),
  Q('Corrosion', 'Quel milieu accélère le plus la corrosion ?', ['L’eau salée du bord de mer', 'L’air sec du désert', 'Le froid de l’altitude', 'Un hangar sec'], 'Eau salée, humidité, pollution, liquides de dégivrage. Parades : laver, revêtements, hangar.'),
  Q('Corrosion', 'Lequel de ces fluides de bord est corrosif s’il fuit ?', ['L’acide de batterie', 'L’azote des pneus', 'L’air de pressurisation', 'L’eau du circuit de dégivrage des sondes'], 'Fluides corrosifs : acide de batterie, liquide hydraulique (Skydrol), additifs carburant. Cherche les taches.'),
  Q('Certification', 'La CS-25 certifie…', ['Les gros avions de transport', 'Les avions légers et de voltige', 'Les hélicoptères', 'Les planeurs'], 'CS-25 = gros avions. CS-23 = normaux, utilitaires, voltige et commuter.'),
  Q('Redondance', 'À quoi sert la redondance ?', ['À ce qu’une seule panne ne fasse pas tout tomber', 'À alléger l’avion', 'À supprimer la maintenance', 'À augmenter la vitesse de croisière'], 'Deux génératrices, trois circuits hydrauliques, trois canaux de PA… Indispensable au fail-safe et au damage-tolerant.'),
  Q('Charges', 'Une rafale en croisière est une charge…', ['Dynamique', 'Statique', 'Cyclique', 'Permanente'], 'Dynamique : rafale, impact à l’atterrissage, facteur de charge. Le pilote adapte sa vitesse en turbulence.'),
  Q('Charges', 'La pressurisation répétée à chaque vol est une charge…', ['Cyclique', 'Statique', 'Dynamique', 'Négligeable'], 'Cyclique : elle peut casser une pièce sous sa résistance max (fatigue).'),
  Q('Charges', 'Au parking, les ailes fléchissent sous le carburant. C’est une charge…', ['Statique', 'Dynamique', 'Cyclique', 'Aérodynamique'], 'Statique : masse, carburant. Les contraintes existent même au parking.'),
  Q('Maintenance', 'On-condition ou condition monitoring : quelle différence ?', ['On-condition compare une mesure à une limite ; condition monitoring suit une tendance sans limite fixe', 'C’est la même chose', 'On-condition se fait à intervalle fixe, quel que soit l’état', 'Condition monitoring impose un démontage'], 'Les programmes modernes combinent hard-time, on-condition et condition monitoring.'),
  Q('Philosophies', 'Fail-safe veut dire…', ['Si une pièce casse, une autre reprend la charge', 'Rien ne casse jamais', 'On jette la pièce avant qu’elle casse', 'On ne contrôle jamais la pièce'], 'Fail-safe n’est pas « incassable » : plusieurs chemins d’effort.'),
];

// ======================================================================= 2. STRUCTURE
function mzfmTask(ctx, T) {
  const OEW = 42, WW = 8, LIM = 21.2;
  const sp = slider(T.lab, { label: 'Charge marchande (passagers + fret)', min: 0, max: 25, step: 0.5, value: 12, unit: 't', fmt: fmt1 }, draw);
  const sf = slider(T.lab, { label: 'Carburant dans les ailes', min: 0, max: 19, step: 0.5, value: 12, unit: 't', fmt: fmt1 }, draw);
  const hold = holder(T, 900);
  function draw() {
    const P = sp.get(), F = sf.get(), M = OEW + P + F, B = 0.4 * M - 0.45 * (WW + F), k = B / LIM, over = B > LIM + 1e-6;
    const flex = 6 + 34 * Math.min(1.35, k), y = (d) => 112 - flex * Math.pow(d / 160, 1.7), col = over ? '#ff6a4d' : '#cfd8e6';
    const wing = (sg) => `M170,112 Q${170 + sg * 80},${112 - flex * 0.3} ${170 + sg * 160},${112 - flex}`;
    T.art.innerHTML = svg(340, 200, `<path d="${wing(1)}" stroke="${col}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${wing(-1)}" stroke="${col}" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${[-1, 1].map((sg) => [50, 95, 140].map((d) => arrow(170 + sg * d, y(d) + 14, 170 + sg * d, y(d) - 18, '#5fd6ff', 2.5)).join('')).join('')}
      ${F > 0 ? [-1, 1].map((sg) => arrow(170 + sg * 72, y(72) + 4, 170 + sg * 72, y(72) + 10 + F * 1.4, '#62e3a0', 3.5)).join('') : ''}
      <circle cx="170" cy="112" r="22" fill="#e9edf2" stroke="#0a1222" stroke-width="2"/>${P > 0 ? arrow(170, 122, 170, 136 + P * 1.6, '#ffc35c', 4.5) : ''}
      <circle cx="194" cy="111" r="7" fill="none" stroke="${over ? '#ff6a4d' : '#ffc35c'}" stroke-width="2.5"/><circle cx="146" cy="111" r="7" fill="none" stroke="${over ? '#ff6a4d' : '#ffc35c'}" stroke-width="2.5"/>
      ${text(48, 22, '↑ portance', { s: 11, c: '#5fd6ff' })}${text(276, 22, '↓ carburant d’aile', { s: 11, c: '#62e3a0' })}${text(170, 196, '↓ charge dans le fuselage', { s: 11, c: '#ffc35c' })}
      ${gauge(298, 146, 24, k * 100, 0, 130, 'emplanture', { zones: [[0, 100, '#62e3a0'], [100, 130, '#ff6a4d']], fmt: (v) => Math.round(v) + '%', vs: 11 })}
      ${text(10, 150, `Masse : ${fmt1(M)} t`, { s: 12, w: 800, a: 'start' })}${text(10, 166, `Sans carburant : ${fmt1(OEW + P)} t`, { s: 11, c: '#93a1bd', a: 'start' })}`);
    T.say(over ? '🔴 Emplanture surchargée !' : F > 0.01 ? '💡 Vide les réservoirs d’aile : l’emplanture souffre-t-elle plus ou moins ?' : '💡 Monte la charge jusqu’à la limite verte.');
    hold(F <= 0.01 && P >= 19.5 && !over, 'Sans carburant, rien ne compense la charge du fuselage : c’est là que l’emplanture est la plus chargée. 42 t + 20 t = 62 t : c’est la MZFM. Le carburant dans l’aile pèse là où la portance tire : il soulage la flexion.');
  }
  draw();
}
function flutterTask(ctx, T) {
  const sv = slider(T.lab, { label: 'Vitesse', min: 150, max: 420, step: 5, value: 250, unit: 'kt' });
  const r = row(T.lab); const tm = toggle(r, 'Masses d’équilibrage', false), tr = toggle(r, 'Aile plus rigide en torsion', false);
  const hold = holder(T, 1500); let ph = 0, amp = 0.1, acc = 0;
  return loop((dt) => {
    const Vf = 335 + (tm.get() ? 55 : 0) + (tr.get() ? 45 : 0), V = sv.get();
    const target = V < Vf ? 0.06 + 0.5 * Math.pow(V / Vf, 8) : 2.6;
    amp += (target - amp) * Math.min(1, dt * (V < Vf ? 2.5 : 0.8)); ph += dt * (10 + V / 30);
    acc += dt; if (acc < 1 / 30) return; acc = 0;
    const a = Math.min(amp, 2.2), tip = 34 * a * Math.sin(ph), tw = 16 * a * Math.sin(ph + 1.3), bad = amp > 1.2;
    T.art.innerHTML = svg(340, 190, `<rect x="16" y="70" width="26" height="60" rx="6" fill="#58627a"/>
      <path d="M40,100 Q170,${100 + tip * 0.35} 300,${100 + tip}" stroke="${bad ? '#ff6a4d' : '#cfd8e6'}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g transform="translate(300 ${100 + tip}) rotate(${tw})"><ellipse rx="26" ry="6" fill="${bad ? '#ff6a4d' : '#e9edf2'}"/>${tm.get() ? '<circle cx="-24" cy="0" r="5" fill="#ffc35c"/>' : ''}</g>
      ${text(170, 24, bad ? '⚠️ FLOTTEMENT : l’oscillation s’amplifie !' : `Vitesse de flottement : ${Vf} kt`, { s: 13, w: 800, c: bad ? '#ff6a4d' : '#62e3a0' })}
      ${text(170, 178, 'bout d’aile vu de face : flexion + torsion couplées', { s: 10.5, c: '#93a1bd' })}`);
    T.say(bad ? 'Réduis la vitesse, puis ajoute des parades.' : '💡 Objectif : tenir 400 kt sans flottement.');
    hold(V >= 400 && V < Vf, 'Masses d’équilibrage (elles décalent le centre de gravité et découplent les modes) et rigidité en torsion (elle monte la fréquence propre) : la vitesse de flottement passe au-delà de 400 kt.');
  });
}
const structureTasks = [
  { tag: 'MZFM', q: 'Charge l’avion : trouve la charge marchande maximale quand les réservoirs d’aile sont vides.', task: mzfmTask, why: 'MRM ≥ MTOM ≥ MLM ; la MZFM protège l’emplanture de l’aile, pas le train.' },
  { tag: 'Pièces de l’aile', q: 'À quelle pièce correspond chaque rôle ? Regarde-la s’allumer en 3D.', task: sortTask([
    ['Empêche la peau de flamber.', 2, 'La lisse (stringer), raidisseur dans l’envergure.'],
    ['Garde la forme du profil et cloisonne les réservoirs.', 1, 'La nervure.'],
    ['Reprend la flexion et le cisaillement.', 0, 'Le longeron, poutre principale.'],
    ['Prend cisaillement et torsion, et donne la surface aérodynamique.', 3, 'Le revêtement (peau travaillante avec les lisses).'],
    ['Âme = cisaillement, semelles = traction et compression.', 0, 'Le longeron.'],
    ['Transmet les efforts de la peau au longeron.', 1, 'La nervure.'],
  ], ['Longeron', 'Nervure', 'Lisse', 'Revêtement'], { n: 5, onCard: (ctx, c) => ctx.W.highlight([['longeron', 'nervure', 'lisse', 'aile'][c[1]]]), cleanup: (ctx) => ctx.W.highlight([]) }), why: 'Longerons + nervures + peau = caisson de torsion, qui contient souvent le carburant.' },
  { tag: 'Flottement', q: 'Pousse l’avion à 400 kt sans flottement : choisis les bonnes parades.', task: flutterTask, why: 'Flottement = couplage aéroélastique flexion + torsion, qui dépend de la vitesse et peut détruire l’aile en quelques secondes.' },
];
const structureItems = [
  Q('Assemblages', 'Quel assemblage peut cacher des défauts invisibles ?', ['Le collage', 'Le rivetage', 'Le boulonnage', 'Le goupillage'], 'Le collage répartit bien les efforts et allège, mais ses défauts sont cachés (contrôle non destructif).'),
  Q('Assemblages', 'Quel assemblage se desserre aux vibrations ?', ['Le vissage des trappes et carénages', 'Le rivetage', 'Le soudage', 'Le collage'], 'Vis : desserrage, filetage arraché. Boulons : couple de serrage, repères, fils à freiner.'),
  Q('Composites', 'Le vrai point faible des composites ?', ['Les dégâts internes invisibles (délaminage)', 'La fatigue', 'La corrosion', 'Leur masse'], 'Ils résistent très bien à la fatigue et à la corrosion. Problèmes : dégâts cachés, foudre (grillage métallique), coût.'),
  Q('Composites', 'Pourquoi ajoute-t-on un grillage métallique dans un composite ?', ['Contre la foudre : le composite conduit mal l’électricité', 'Pour le rigidifier', 'Contre la corrosion', 'Pour le rendre plus léger'], 'Mauvaise conductivité électrique → grillage métallique pour écouler la foudre.'),
  Q('Configuration', 'Le risque propre à l’empennage en T ?', ['Le super-décrochage (deep stall)', 'Le capotage', 'Le flottement des volets', 'La corrosion de la dérive'], 'En T : aéro propre, effet de plaque, mais deep stall, dérive plus chargée, maintenance difficile.'),
  Q('Configuration', 'Un avantage de l’aile basse ?', ['CG bas, accès facile et train simple', 'Garde au sol de l’hélice', 'Effet dièdre stabilisant', 'Fuselage dégagé sous l’aile'], 'Aile haute : garde d’hélice, stabilité. Aile basse : CG bas, accès, train simple, effet de sol.'),
  Q('Fuselage', 'Pourquoi la section circulaire est-elle la meilleure en pressurisation ?', ['La pression tend la peau régulièrement, sans angle très contraint', 'Elle donne plus de plancher', 'Elle est plus facile à peindre', 'Elle supprime la fatigue'], 'La pressurisation tend la peau en circonférence, comme un ballon. Les angles d’une section rectangulaire seraient très contraints.'),
  Q('Fuselage', 'Une porte « plug »…', ['Est plus grande que son ouverture : la pression la plaque sur son cadre', 'S’ouvre vers l’extérieur en vol', 'Est retenue par la seule serrure', 'Sert de panneau blow-out'], 'Impossible à ouvrir sous pression : la cabine la plaque sur son cadre.'),
  Q('Plancher', 'À quoi servent les panneaux blow-out ?', ['À égaliser la pression cabine-soute lors d’une décompression', 'À évacuer la fumée', 'À ventiler les freins', 'À ouvrir les trappes de train'], 'Sans eux, le plancher pourrait s’effondrer et couper les câbles de commandes qui passent dessous.'),
  Q('Masses', 'La MLM est plus basse que la MTOM parce que…', ['C’est une limite d’absorption d’énergie à l’impact', 'Le carburant soulage l’aile', 'Les freins chauffent au roulage', 'La piste est plus courte'], 'MRM ≥ MTOM ≥ MLM. La MLM est limitée par l’énergie que le train peut absorber.'),
  Q('Masses', 'La MZFM protège…', ['L’emplanture de l’aile, en flexion', 'Le train d’atterrissage', 'Les pneus', 'La cloison pare-feu'], 'Sans carburant dans l’aile, la flexion à l’emplanture est maximale.'),
  Q('Fuselage', 'Atterrissage dur sur la roue avant : quel risque ?', ['Une forte flexion du fuselage', 'Un tail strike', 'Une fuite d’huile moteur', 'Un givrage du pare-brise'], 'Tail strike, lui, abîme la cloison arrière (fuite de pressurisation).'),
];

// ======================================================================= 3. FEU
function smokeTask(ctx, T) {
  const ft = seg(T.lab, 'Type de feu', ['Couvant (câbles, batterie lithium)', 'Vif (carburant, arc électrique)'], 0, draw);
  const sd = slider(T.lab, { label: 'Fumée dans la soute', min: 0, max: 100, value: 0, unit: '%' }, draw);
  const seen = [null, null];
  const parts = Array.from({ length: 60 }, () => [Math.random(), Math.random()]);
  function chamber(x, big, d) {
    const n = Math.round(d / 100 * 40);
    return parts.slice(0, n).map(([u, v]) => `<circle cx="${x + 10 + u * 120}" cy="${38 + v * 70}" r="${big ? 3.2 : 1.3}" fill="rgba(200,200,210,.75)"/>`).join('');
  }
  function draw() {
    const f = ft.get(), d = sd.get(), big = f === 0;
    const opt = d * (big ? 1 : 0.45), ion = d * (big ? 0.45 : 1), oA = opt >= 50, iA = ion >= 50, cur = 100 - ion * 0.8;
    if ((oA || iA) && !seen[f]) seen[f] = oA ? 'optique' : 'ionique';
    const scat = big ? Math.round(d / 12) : Math.round(d / 30);
    T.art.innerHTML = svg(340, 196, `
      <rect x="12" y="30" width="140" height="86" rx="10" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>${text(82, 22, 'Optique (effet Tyndall)', { s: 11.5, c: '#5fd6ff', w: 800 })}
      <circle cx="22" cy="96" r="6" fill="#ff5a4a"/><line x1="28" y1="96" x2="148" y2="96" stroke="rgba(255,90,74,.5)" stroke-width="3"/>
      <rect x="74" y="32" width="16" height="10" rx="2" fill="#62e3a0"/>${text(30, 130, 'LED IR', { s: 9.5, c: '#93a1bd' })}${text(104, 130, 'photodiode en angle', { s: 9.5, c: '#93a1bd' })}
      ${Array.from({ length: scat }, (_, i) => `<line x1="${40 + i * 9}" y1="96" x2="82" y2="43" stroke="rgba(255,120,100,.45)" stroke-width="1.5"/>`).join('')}
      ${chamber(12, big, d)}
      <rect x="188" y="30" width="140" height="86" rx="10" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>${text(258, 22, 'Ionique (américium 241)', { s: 11.5, c: '#ffc35c', w: 800 })}
      <rect x="196" y="38" width="6" height="70" fill="#9aa3ae"/><rect x="314" y="38" width="6" height="70" fill="#9aa3ae"/>${text(258, 130, 'courant entre les électrodes', { s: 9.5, c: '#93a1bd' })}
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${215 + (i * 37) % 90}" cy="${46 + (i * 23) % 56}" r="2" fill="${i < Math.round(14 * (1 - ion / 110)) ? '#ffc35c' : 'rgba(255,195,92,.2)'}"/>`).join('')}
      ${chamber(188, big, d)}
      ${lamp(20, 146, 74, 24, 'SMOKE', oA, '#ff3b30')}${vbar(112, 140, 14, 36, opt, 0, 100, 'lumière', oA ? '#ff6a4d' : '#62e3a0', { marks: [[50, '#fff']] })}
      ${lamp(196, 146, 74, 24, 'SMOKE', iA, '#ff3b30')}${vbar(288, 140, 14, 36, cur, 0, 100, 'courant', iA ? '#ff6a4d' : '#ffc35c', { marks: [[60, '#fff']] })}`);
    T.say(`Feu couvant : ${seen[0] ? '✅ ' + seen[0] : '…'} · Feu vif : ${seen[1] ? '✅ ' + seen[1] : '…'}`);
    if (seen[0] && seen[1]) T.win(`Feu couvant : c’est l’${seen[0]} qui a sonné. Feu vif : l’${seen[1]}.`);
  }
  draw();
}
function loopTask(ctx, T) {
  const ST = ['OK', 'Chaud', 'En panne'];
  const goals = [['Déclencher l’alarme FIRE', (a, b) => fireOf(a, b)], ['Obtenir une simple caution LOOP (boucle en panne)', (a, b) => (a === 2 || b === 2) && !fireOf(a, b)], ['Montrer qu’une seule boucle chaude ne suffit pas', (a, b) => (a === 1 && b === 0) || (a === 0 && b === 1)]];
  const got = goals.map(() => false);
  function fireOf(a, b) { return (a === 1 && b === 1) || (a === 1 && b === 2) || (a === 2 && b === 1); }
  const sa = seg(T.lab, 'Boucle A', ST, 0, draw), sb = seg(T.lab, 'Boucle B', ST, 0, draw);
  const list = row(T.lab, 'goals');
  function draw() {
    const a = sa.get(), b = sb.get(), fire = fireOf(a, b), fa = a === 2, fb = b === 2;
    goals.forEach((g, i) => { if (g[1](a, b)) got[i] = true; });
    list.innerHTML = goals.map((g, i) => `<div>${got[i] ? '✅' : '⬜'} ${g[0]}</div>`).join('');
    const col = (s) => (s === 1 ? '#ff6a4d' : s === 2 ? '#58627a' : '#62e3a0');
    T.art.innerHTML = svg(340, 175, `<path d="M40,60 L230,52 Q270,88 230,124 L40,116 Z" fill="#cfd8e6" stroke="#0a1222" stroke-width="2"/>
      <path d="M50,70 L225,64" stroke="${col(a)}" stroke-width="5" ${a === 2 ? 'stroke-dasharray="8 6"' : ''}/><path d="M50,106 L225,112" stroke="${col(b)}" stroke-width="5" ${b === 2 ? 'stroke-dasharray="8 6"' : ''}/>
      ${text(140, 60, 'boucle A', { s: 10, c: '#0a1222', w: 800 })}${text(140, 124, 'boucle B', { s: 10, c: '#0a1222', w: 800 })}
      ${lamp(250, 30, 78, 34, 'FIRE', fire, '#ff3b30')}${lamp(250, 74, 78, 24, 'LOOP A', fa, '#ffc35c')}${lamp(250, 104, 78, 24, 'LOOP B', fb, '#ffc35c')}
      ${text(170, 160, fire ? '🔥 Alarme feu : voyant rouge, Master Warning, son' : (fa || fb) ? 'Une boucle en panne : simple caution' : 'Logique ET : les deux boucles doivent voir la chaleur', { s: 11.5, c: fire ? '#ff6a4d' : '#93a1bd', w: 700 })}`);
    ctx.W.setEngineFire(fire);
    if (got.every(Boolean)) T.win('Les deux boucles chaudes = FIRE ; une seule = pas d’alarme (moins de fausses alarmes) ; une boucle en panne = caution, et sur beaucoup d’avions (A320) l’autre boucle prend alors le relais seule.');
  }
  draw();
  return () => ctx.W.setEngineFire(false);
}
const feuTasks = [
  { tag: 'Détecteurs de fumée', q: 'Fais monter la fumée avec un feu couvant, puis avec un feu vif : quel détecteur sonne en premier à chaque fois ?', task: smokeTask, why: 'L’optique voit les grosses particules des feux couvants : c’est le standard en soute. L’ionique est très sensible aux feux vifs, mais donne des fausses alarmes.' },
  { tag: 'Double boucle', q: 'Joue avec les boucles de détection A et B du moteur 2.', task: loopTask, why: 'Deux boucles = redondance + moins de fausses alarmes.' },
  { tag: 'Feu moteur', q: 'FEU MOTEUR 2 ! Dans quel ordre agis-tu ? (procédure type A320)', task: orderTask(['Manette du moteur 2 au ralenti', 'ENG MASTER 2 sur OFF : carburant coupé', 'Bouton ENG 2 FIRE poussé : vannes fermées, squibs armés', 'AGENT 1 : première décharge', 'Le feu continue : AGENT 2, seconde décharge'], {
    setup: (ctx) => ctx.W.setEngineFire(true), cleanup: (ctx) => ctx.W.setEngineFire(false), onStep: (n, ctx) => { if (n === 5) ctx.W.setEngineFire(false); } }), why: 'La règle CS 25.1195(c) impose 2 décharges par moteur : un second tir si le feu persiste ou reprend.' },
];
const feuItems = [
  Q('Extinction', 'Comment le Halon 1301 éteint-il le feu ?', ['Il casse la réaction chimique de la combustion', 'Il refroidit le moteur par de l’eau', 'Il souffle la flamme', 'Il remplace l’air par de l’azote'], 'Très rapide et abîme peu les équipements.'),
  Q('Extinction', 'Combien de décharges faut-il par moteur ?', ['2', '1', '3', '4'], 'Deux bouteilles ou une double : un second tir possible.'),
  Q('Extinction', 'Comment éteint-on un feu de soute ?', ['Forte décharge, puis débit dosé de longue durée', 'Une seule décharge brève', 'En ouvrant la soute en vol', 'Avec de l’eau sous pression'], 'Le débit dosé garde peu d’oxygène longtemps.'),
  Q('Extinction', 'Qu’est-ce qu’un squib ?', ['Une cartouche pyrotechnique qui ouvre la bouteille', 'Un détecteur de fumée', 'Une boucle de détection', 'Un voyant de test'], 'Vannes à cartouche pyrotechnique (squib) ou électriques.'),
  Q('Détection', 'Un détecteur incendie de moteur mesure…', ['La chaleur', 'La flamme', 'La fumée', 'Le CO'], 'Bilame, boucle continue (résistance ou pression), boucle à gaz.'),
  Q('Détection', 'Le détecteur ionique : la fumée fait…', ['Baisser le courant entre les électrodes', 'Monter le courant', 'Arriver la lumière sur la photodiode', 'Chauffer une boucle'], 'Les particules captent les ions, ils bougent moins, le courant chute.'),
  Q('Détection', 'Quel détecteur est le standard en soute ?', ['Optique', 'Ionique', 'Boucle à gaz', 'Bilame'], 'Optique : feux couvants, batteries lithium, stable dans les zones ventilées.'),
  Q('Détection', 'Avant chaque vol, on vérifie la détection…', ['Avec les boutons SMOKE TEST et FIRE TEST', 'En allumant une flamme près du moteur', 'En maintenance seulement', 'On ne la teste jamais'], 'FIRE TEST teste les boucles et les circuits de squibs.'),
  Q('Détection', 'Le détecteur idéal…', ['Signale aussi la fin du feu et sa reprise', 'Ne se teste qu’au sol', 'S’arrête après 10 s d’alarme', 'Préfère une alarme de trop'], 'Aucune fausse alarme, alerte rapide et localisée, continue pendant le feu, fin et reprise, testable du cockpit, robuste.'),
  Q('Pluie', 'Quel moyen anti-pluie est très efficace à grande vitesse ?', ['Le liquide anti-pluie', 'Les essuie-glaces', 'Le désembuage', 'Le chauffage du pare-brise'], 'Les essuie-glaces décollent à grande vitesse. Le liquide anti-pluie fait perler l’eau qui s’envole.'),
  Q('Pluie', 'Le revêtement hydrophobe du pare-brise…', ['Est passif mais s’use : on le refait en maintenance', 'Se recharge en vol', 'Remplace le chauffage', 'Abîme la vue en forte pluie'], 'Couche transparente permanente, sans action du pilote.'),
];

// ======================================================================= 4. HYDRAULIQUE
function pressArt(A1, A2, F1, F2, lift, d1 = 0, d2 = 0) {
  const w1 = 14 + Math.sqrt(A1) * 9, w2 = 14 + Math.sqrt(A2) * 9, x1 = 80, x2 = 240, base = 160;
  const y1 = 70 + d1 * 2.2, y2 = 76 - (lift ? 10 : 0) - d2 * 10;
  return svg(340, 200, `<path d="M${x1 - w1 / 2},${y1} L${x1 - w1 / 2},${base} L${x2 + w2 / 2},${base} L${x2 + w2 / 2},${y2}" fill="none" stroke="#58627a" stroke-width="3"/>
    <rect x="${x1 - w1 / 2}" y="${y1}" width="${w1}" height="${base - y1}" fill="rgba(255,138,60,.35)"/><rect x="${x1 + w1 / 2}" y="${base - 22}" width="${x2 - x1 - w1 / 2 - w2 / 2}" height="22" fill="rgba(255,138,60,.35)"/><rect x="${x2 - w2 / 2}" y="${y2}" width="${w2}" height="${base - y2}" fill="rgba(255,138,60,.35)"/>
    <rect x="${x1 - w1 / 2}" y="${y1 - 8}" width="${w1}" height="8" fill="#cfd8e6"/><rect x="${x2 - w2 / 2}" y="${y2 - 8}" width="${w2}" height="8" fill="#cfd8e6"/>
    ${arrow(x1, y1 - 46, x1, y1 - 10, '#ffc35c', 4)}${text(x1, y1 - 52, `${F1} N`, { s: 12, w: 800, c: '#ffc35c' })}
    <rect x="${x2 - 26}" y="${y2 - 40}" width="52" height="32" rx="4" fill="${lift ? '#62e3a0' : '#9aa3ae'}"/>${text(x2, y2 - 19, '1 000 N', { s: 11, w: 800, c: '#0a1222' })}
    ${text(x1, base + 16, `${fmt1(A1)} cm²`, { s: 11, c: '#93a1bd' })}${text(x2, base + 16, `${fmt1(A2)} cm²`, { s: 11, c: '#93a1bd' })}
    ${text(170, 186, `Pression = ${fmt1(F1 / A1)} N/cm² partout · force produite : ${fmtk(F2)} N`, { s: 12, w: 700 })}`);
}
function pascalTask(ctx, T) {
  const s1 = slider(T.lab, { label: 'Section du petit piston', min: 1, max: 5, step: 0.5, value: 4, unit: 'cm²', fmt: fmt1 }, draw);
  const s2 = slider(T.lab, { label: 'Section du grand piston', min: 5, max: 50, step: 1, value: 12, unit: 'cm²' }, draw);
  const hold = holder(T, 800);
  function draw() { const A1 = s1.get(), A2 = s2.get(), F2 = 100 / A1 * A2, lift = F2 >= 1000; T.art.innerHTML = pressArt(A1, A2, 100, F2, lift); hold(lift, `${fmt1(100 / A1)} N/cm² × ${A2} cm² = ${fmtk(F2)} N : la charge monte.`); }
  draw();
}
function strokeTask(ctx, T) {
  const s = slider(T.lab, { label: 'Course du petit piston', min: 0, max: 30, step: 1, value: 0, unit: 'cm' }, draw);
  const hold = holder(T, 800);
  function draw() { const d1 = s.get(), d2 = d1 / 10; T.art.innerHTML = pressArt(1, 10, 100, 1000, true, d1 / 3, d2 * 2) + ''; T.say(`La charge est montée de ${fmt1(d2)} cm.`); hold(Math.abs(d2 - 2) < 0.05, '20 cm en bas pour 2 cm en haut. Travail : 100 N × 0,20 m = 1 000 N × 0,02 m = 20 J. On gagne en force, on perd en course : aucune énergie créée.'); }
  draw();
}
function ratTask(ctx, T) {
  const W = ctx.W; let out = false;
  const r = row(T.lab); button(r, '🌀 Sortir la RAT', (b) => { out = true; b.disabled = true; W.setRat(1); draw(); }, 'pri');
  const sv = slider(T.lab, { label: 'Vitesse de l’avion', min: 60, max: 280, step: 5, value: 250, unit: 'kt' }, draw);
  const hold = holder(T, 900);
  function draw() {
    const V = sv.get(), p = out ? 3000 * Math.min(1, (V / 160) ** 2) : 0; W.setRat(out ? 1 : 0, V / 160);
    T.art.innerHTML = svg(340, 150, `${gauge(90, 70, 46, p, 0, 3500, 'pression RAT (psi)', { zones: [[2600, 3500, '#62e3a0'], [0, 1500, '#ff6a4d']], fmt: fmtk })}
      ${text(240, 50, out ? 'RAT sortie' : 'RAT rentrée', { s: 15, w: 800, c: out ? '#ffc35c' : '#93a1bd' })}${text(240, 76, `${V} kt`, { s: 22, w: 850 })}${text(240, 100, out ? (p < 2600 ? 'pression qui chute !' : 'pression nominale') : 'panne totale des moteurs…', { s: 12, c: out && p < 2600 ? '#ff6a4d' : '#93a1bd' })}`);
    hold(out && V <= 110, 'La RAT est une éolienne : sa puissance dépend de la vitesse. À basse vitesse, elle ne tient plus la pression.');
  }
  draw();
  return () => W.setRat(0);
}
const hydrauTasks = [
  { tag: 'Loi de Pascal', q: 'Tu pousses avec 100 N. Choisis les pistons pour soulever la charge de 1 000 N.', task: pascalTask, why: 'P = F / A se transmet intégralement dans tout le liquide ; sur un grand piston, la même pression donne une grande force : F = P × A.' },
  { tag: 'Course', q: 'Pistons de 1 et 10 cm² : pompe jusqu’à ce que la charge monte de 2 cm.', task: strokeTask, why: 'Le volume de liquide est conservé : le grand piston fait une petite course.' },
  { tag: 'RAT', q: 'Panne des deux moteurs : sors la RAT, puis ralentis à 110 kt. Regarde la pression.', task: ratTask, why: 'Sources de secours : pompe électrique, PTU, RAT (dépend de la vitesse), pompe manuelle.' },
];
const hydrauItems = [
  Q('Hydrostatique', 'La pression au fond d’un réservoir dépend…', ['De la hauteur de liquide (P = ρ g h), pas de la forme', 'De la forme du réservoir', 'De la surface du fond', 'Du volume total'], 'Elle augmente avec la profondeur et ne dépend pas de la forme du récipient.'),
  Q('Liquide', 'Pourquoi ne mélange-t-on jamais Skydrol et liquide minéral ?', ['Ça fait de la mousse et du gel', 'Ça change de couleur', 'Ça gèle à 0 °C', 'C’est interdit seulement par le constructeur, sans risque réel'], 'Synthétique (ester phosphate) ou minéral : jamais de mélange. Gants et lunettes.'),
  Q('Liquide', 'Une qualité indispensable du liquide hydraulique ?', ['Un point éclair élevé, vers 200 °C', 'Une forte volatilité', 'Une viscosité qui change beaucoup avec la température', 'Être corrosif pour nettoyer'], 'Stabilité thermique, non corrosif, point éclair élevé, peu volatil, viscosité stable.'),
  Q('Circuit', 'Un circuit « à la demande »…', ['N’est pressurisé que quand on en a besoin', 'Est toujours sous pression', 'N’a pas de pompe', 'Ne sert qu’aux commandes de vol'], 'À pression constante : commandes de vol des gros avions. À la demande : train d’un petit avion, portes cargo.'),
  Q('Circuit', 'Un circuit « passif »…', ['Utilise une énergie stockée (ressort, gaz)', 'A une pompe qui maintient la pression', 'Est piloté par calculateur', 'N’existe qu’au sol'], 'Actif en principal, passif en secours.'),
  Q('Pressions', 'Pression hydraulique habituelle d’un avion de ligne ?', ['3 000 psi', '300 psi', '30 psi', '30 000 psi'], 'Basse ≤ 2 000 psi ; haute 3 000 psi ; 4 000 à 5 000 psi sur A350.'),
  Q('Pompes', 'La pompe à plateau inclinable…', ['A une cylindrée variable et garde une pression constante', 'A un débit fixe lié au régime', 'Est une pompe à main', 'Ne marche qu’à l’air'], 'La pompe à engrenages, elle, a une cylindrée fixe.'),
  Q('PTU', 'Le circuit vert fuit. La PTU peut-elle le sauver ?', ['Non : elle transfère de la puissance, pas du liquide', 'Oui : elle le remplit avec le liquide de l’autre circuit', 'Oui, si on la met en route avant la fuite', 'Oui, au sol seulement'], 'La PTU fait entraîner un circuit par un autre. Sans liquide, rien à pressuriser.'),
  Q('Composants', 'Qui stocke de la pression ?', ['L’accumulateur', 'Le réservoir', 'Le filtre', 'Le restricteur'], 'L’accumulateur amortit les à-coups et sert de secours ; le réservoir stocke le liquide.'),
  Q('Composants', 'La valve navette (shuttle)…', ['Reçoit le liquide de l’une de deux sources', 'Coupe une branche qui fuit', 'Limite la vitesse du vérin', 'Ramène la surpression au réservoir'], 'Fusible hydraulique : coupe une branche qui fuit. Restricteur : vitesse. Soupape de sûreté : surpression.'),
  Q('Composants', 'Le clapet anti-retour…', ['Laisse passer le liquide dans un seul sens', 'Stocke la pression', 'Filtre les particules', 'Se ferme à une température donnée'], 'Comme une diode.'),
  Q('Composants', 'Le fusible hydraulique…', ['Coupe une branche qui fuit au-delà d’un débit seuil', 'Fond à 200 °C', 'Protège le circuit électrique de la pompe', 'Filtre l’eau du liquide'], 'Il protège le reste du circuit.'),
  Q('Pannes', 'Avec quoi surveille-t-on une fuite lente ?', ['La jauge de niveau du réservoir', 'Le manomètre seul', 'Le thermomètre', 'Le voyant du train'], 'Niveau → jauge ; pression basse → manomètre ; température haute → thermomètre.'),
];

// ======================================================================= 5. TRAIN, FREINS, PNEUS
const MU = (s, m) => m * Math.sin(1.6 * Math.atan(12.5 * s)); // adhérence max vers 12 % de glissement
function brakeLab(goal) {
  return (ctx, T) => {
    const RW = [['Sèche', 0.8], ['Mouillée', 0.5], ['Glacée', 0.15]];
    const rw = seg(T.lab, 'Piste', RW.map((r) => r[0]), goal.rw, () => { locked = false; }), as = toggle(row(T.lab), 'Anti-skid', goal.as, () => { locked = false; });
    const sp = slider(T.lab, { label: 'Pression de freinage', min: 0, max: 100, value: 20, unit: '%' });
    const hold = holder(T, 1100); let locked = false, ang = 0, acc = 0, t = 0;
    return loop((dt) => {
      t += dt; const m = RW[rw.get()][1], req = sp.get() / 100 * 0.9; let s;
      if (as.get()) { s = req >= m * 0.97 ? 0.12 + 0.03 * Math.sin(t * 9) : Math.tan(Math.asin(Math.min(1, req / m)) / 1.6) / 12.5; locked = false; }
      else { if (locked && req < m * 0.6) locked = false; if (!locked && req >= m * 0.999) locked = true; s = locked ? 1 : Math.tan(Math.asin(req / m) / 1.6) / 12.5; }
      const mu = MU(s, m), dec = mu * 9.81; ang += dt * 20 * (1 - Math.min(1, s));
      acc += dt; if (acc < 1 / 30) return; acc = 0;
      const X = (v) => 40 + v / 0.6 * 280, Y = (v) => 150 - v / 0.85 * 120;
      let curve = ''; for (let v = 0; v <= 0.6001; v += 0.01) curve += (curve ? 'L' : 'M') + X(v).toFixed(1) + ',' + Y(MU(v, m)).toFixed(1);
      const sx = Math.min(s, 0.6), lock = s >= 0.99;
      T.art.innerHTML = svg(340, 200, `<line x1="40" y1="150" x2="324" y2="150" stroke="rgba(255,255,255,.25)"/><line x1="40" y1="150" x2="40" y2="24" stroke="rgba(255,255,255,.25)"/>
        <rect x="${X(0.10)}" y="24" width="${X(0.15) - X(0.10)}" height="126" fill="rgba(98,227,160,.12)"/>${text(X(0.125), 20, 'adhérence max', { s: 9.5, c: '#62e3a0' })}
        <path d="${curve}" stroke="#5fd6ff" stroke-width="2.5" fill="none"/>${lock ? `<line x1="${X(0.6)}" y1="${Y(MU(1, m))}" x2="324" y2="${Y(MU(1, m))}" stroke="#ff6a4d" stroke-width="2.5" stroke-dasharray="4 3"/>` : ''}
        <circle cx="${lock ? 320 : X(sx)}" cy="${Y(mu)}" r="7" fill="${lock ? '#ff6a4d' : '#ffc35c'}" stroke="#fff" stroke-width="2"/>
        ${text(182, 168, 'glissement de la roue →', { s: 10, c: '#93a1bd' })}${text(14, 90, 'μ', { s: 13, c: '#93a1bd' })}
        <g transform="translate(286 78)"><circle r="22" fill="#1c1e22" stroke="${lock ? '#ff6a4d' : '#9aa3ae'}" stroke-width="5"/><line x1="0" y1="0" x2="${18 * Math.cos(ang)}" y2="${18 * Math.sin(ang)}" stroke="#fff" stroke-width="3"/></g>
        ${text(110, 190, `Glissement ${lock ? '100 % : ROUE BLOQUÉE' : Math.round(s * 100) + ' %'}`, { s: 12, w: 800, c: lock ? '#ff6a4d' : '#fff' })}${text(268, 190, `Décélération ${fmt1(dec)} m/s²`, { s: 12, w: 800, c: '#62e3a0' })}`);
      T.say(lock ? '🔴 Roue bloquée : le pneu ripe (méplat) et on perd le contrôle. Relâche les freins !' : goal.hint);
      hold(goal.check({ s, lock, as: as.get(), rw: rw.get(), p: sp.get() }), goal.msg);
    });
  };
}
function aquaTask(ctx, T) {
  const s = slider(T.lab, { label: 'Pression du pneu', min: 50, max: 250, step: 1, value: 200, unit: 'psi' }, draw);
  const hold = holder(T, 800);
  function draw() {
    const P = s.get(), V = 9 * Math.sqrt(P);
    T.art.innerHTML = svg(340, 140, `<rect x="0" y="96" width="340" height="44" fill="#2a3140"/><rect x="0" y="92" width="340" height="8" fill="rgba(95,170,255,.45)"/>
      <g transform="translate(110 70)"><circle r="26" fill="#1c1e22" stroke="#9aa3ae" stroke-width="6"/><circle r="9" fill="#9aa3ae"/></g>${Array.from({ length: 8 }, (_, i) => `<path d="M${140 + i * 6},${92 - i * 2} q8,-10 16,-2" stroke="rgba(120,190,255,.6)" fill="none" stroke-width="2"/>`).join('')}
      ${text(250, 44, `${Math.round(V)} kt`, { s: 30, w: 850, c: '#5fd6ff' })}${text(250, 70, `9 × √${P} = ${fmt1(V)}`, { s: 13, c: '#93a1bd' })}`);
    hold(P === 144, '9 × √144 = 9 × 12 = 108 kt. Au-dessus, le pneu peut flotter sur l’eau : plus de freinage ni de direction.');
  }
  draw();
}
const trainTasks = [
  { tag: 'Freinage', q: 'Piste mouillée, anti-skid coupé : freine le plus fort possible SANS bloquer la roue.', task: brakeLab({ rw: 1, as: false, hint: '💡 Approche doucement le sommet de la courbe.', check: (o) => !o.as && o.rw === 1 && !o.lock && o.s >= 0.06, msg: 'Tu es au sommet de la courbe : 10 à 15 % de glissement, là où l’adhérence est maximale. Un cran de plus et la roue se bloque.' }), why: 'Une roue bloquée adhère moins qu’une roue qui glisse un peu, et elle s’abîme.' },
  { tag: 'Anti-skid', q: 'Active l’anti-skid et écrase les freins à 100 %.', task: brakeLab({ rw: 1, as: false, hint: '💡 L’anti-skid relâche la pression quand la roue ralentit trop.', check: (o) => o.as && o.p >= 95, msg: 'L’anti-skid compare chaque roue à une vitesse de référence et relâche la pression pour rester vers 12 % de glissement : décélération maximale sans blocage. L’autobrake en a besoin.' }), why: 'Protections : roue bloquée, toucher des roues, aquaplaning.' },
  { tag: 'Rentrée du train', q: 'Rentre le train : remets la séquence dans l’ordre (l’avion est sur vérins dans le hangar).', task: orderTask(['Levier du train sur UP', 'Les trappes s’ouvrent', 'Déverrouillage des verrous bas', 'Le vérin rentre le train', 'Les trappes se ferment'], {
    setup: (ctx) => { ctx.W.gearAuto(false); ctx.W.setGear(1); ctx.W.setJacks(true); }, onStep: (n, ctx) => { if (n === 4) ctx.W.setGear(0); }, cleanup: (ctx) => { ctx.W.setGear(1); ctx.W.gearAuto(true); } }), why: 'Sortie : DOWN → trappes ouvertes → déverrouillage haut → le train sort → verrou bas → trappes fermées.' },
  { tag: 'Aquaplaning', q: 'Trouve la pression de pneu dont l’aquaplaning commence à 108 kt.', task: aquaTask, why: 'V aquaplaning (kt) = 9 × √P (psi).' },
];
const gearLights = (l) => svg(340, 120, `<rect x="90" y="14" width="160" height="92" rx="12" fill="#111725" stroke="rgba(140,170,230,.3)"/>${[[170, 40, l[0]], [130, 78, l[1]], [210, 78, l[2]]].map(([x, y, c]) => `<rect x="${x - 22}" y="${y - 13}" width="44" height="26" rx="5" fill="${c === 'g' ? '#34ff6a' : c === 'r' ? '#ff3b30' : '#1d2332'}" ${c ? `style="filter:drop-shadow(0 0 6px ${c === 'g' ? '#34ff6a' : '#ff3b30'})"` : ''}/>`).join('')}`);
const trainItems = [
  Q('Voyants', 'Levier DOWN, tu vois 3 verts. Ça veut dire…', ['Train sorti et verrouillé', 'Train en transit', 'Désaccord', 'Train rentré'], 'Rouge = en transit ou non verrouillé ; rien = désaccord ou ampoule grillée.', { art: gearLights(['g', 'g', 'g']) }),
  Q('Voyants', 'Levier DOWN depuis 30 s : un vert éteint à gauche, les autres verts.', ['Désaccord ou ampoule grillée : tester les voyants', 'Train gauche sorti et verrouillé', 'Le train gauche est en transit normal', 'Tout est normal'], 'Aucun voyant = désaccord ou ampoule grillée : on teste avant de conclure.', { art: gearLights(['g', '', 'g']) }),
  Q('Voyants', 'Voyant rouge sur le train avant.', ['Train avant en transit ou non verrouillé', 'Train avant sorti', 'Feu de roue', 'Pneu crevé'], 'Rouge = transit ou non verrouillé.', { art: gearLights(['r', 'g', 'g']) }),
  Q('Amortisseur', 'Dans l’amortisseur oléopneumatique, qui fait ressort ?', ['L’azote, qui se comprime', 'L’huile, qui passe par l’orifice', 'Le compas', 'La contrefiche'], 'L’huile amortit (orifice + pointeau), l’azote fait ressort. L’énergie devient de la chaleur.'),
  Q('Pièces', 'Le compas (torsion links)…', ['Garde la roue alignée et empêche la tige de tourner', 'Verrouille le train en bas', 'Amortit le choc', 'Oriente la roue avant'], 'Verrou bas : contrefiche au-delà du point mort.'),
  Q('Au sol', 'Qu’est-ce qui empêche la rentrée du train au sol ?', ['Le contacteur train comprimé (WOW) qui bloque le levier', 'Le voyant rouge', 'Le klaxon', 'Les trappes fermées'], 'Aussi : goupilles à flamme rouge, verrou mécanique dans le vérin.'),
  Q('Vitesses', 'VLO et VLE ?', ['VLO = manœuvrer le train ; VLE = train sorti ; VLO ≤ VLE', 'VLO = train sorti ; VLE = manœuvre', 'VLO > VLE', 'Ce sont deux noms de la VFE'], 'On peut voler plus vite train sorti qu’on ne peut le manœuvrer.'),
  Q('Direction', 'Le tiller…', ['A un grand débattement (±70 à 85°) pour les virages serrés lents', 'A un petit débattement pour le décollage', 'Commande la direction en vol', 'Freine les roues avant'], 'Palonnier : petit débattement (±6 à 15°), pour le roulage rapide et le décollage.'),
  Q('Direction', 'Le shimmy, c’est…', ['Une oscillation violente et rapide de la roue', 'Le blocage d’une roue', 'Un pneu qui tourne sur la jante', 'Un freinage trop fort'], 'Parade : amortisseur de shimmy + compas.'),
  Q('Direction', 'Pourquoi centre-t-on la roue avant avant la rentrée ?', ['Sinon elle n’entre pas dans sa case', 'Pour éviter le shimmy en vol', 'Pour économiser l’hydraulique', 'Pour aligner l’avion sur la piste'], 'Came, vérin de centrage, ressorts.'),
  Q('Pneus', 'Le ply rating d’un pneu, c’est…', ['Un indice de résistance (charge)', 'Le nombre réel de nappes', 'La pression maximale', 'La vitesse maximale'], 'Pas le nombre réel de plis.'),
  Q('Pneus', 'Les bouchons fusibles de la jante…', ['Fondent vers 180 à 300 °C et dégonflent le pneu avant qu’il explose', 'Indiquent l’usure', 'Évitent le creep', 'Gonflent le pneu à l’azote'], 'Après un décollage interrompu ou un freinage fort.'),
  Q('Pneus', 'Quand peut-on dépasser la vitesse limite du pneu ?', ['Au décollage par vent arrière', 'Par vent de face fort', 'À l’atterrissage court', 'Jamais, la vitesse sol est toujours plus faible'], 'Vent arrière : vitesse sol plus grande.'),
  Q('Freins', 'Les freins carbone…', ['Freinent mieux à chaud et mal au roulage', 'Sont plus lourds que l’acier', 'Supportent moins de 800 °C', 'S’usent plus vite que l’acier'], 'Carbone : 40 à 50 % plus léger, > 1 600 °C, usure 2 à 4 fois meilleure, cher.'),
  Q('Freins', 'Après un freinage très fort, le risque…', ['Un feu de freins chauds qui peut se déclarer longtemps après l’arrêt', 'Un pneu qui se regonfle', 'Un blocage du tiller', 'Aucun, les freins refroidissent vite'], 'On surveille la température des freins.'),
  Q('Autobrake', 'Le voyant DECEL ne s’allume pas sur piste glissante, autobrake MED.', ['Ça ne veut pas dire que l’autobrake est en panne', 'L’autobrake est en panne', 'Il faut couper l’anti-skid', 'Il faut passer en MAX'], 'DECEL = 80 % de la décélération visée. Sur piste glissante, on ne l’atteint pas forcément.'),
  Q('Autobrake', 'A320neo : MAX sert…', ['Au décollage seulement (RTO)', 'À l’atterrissage sur piste courte', 'Au roulage', 'À tous les atterrissages'], 'MED = 3 m/s², LO = 2 m/s².'),
  Q('Train', 'Le train classique (roulette de queue) a pour défaut…', ['Le capotage et le cheval de bois', 'Une hélice trop près du sol', 'Un fuselage horizontal', 'Trop de traînée en vol'], 'Le tricycle garde le fuselage horizontal et est stable à l’atterrissage.'),
];

// ======================================================================= 6. COMMANDES DE VOL
function surfArt(o) {
  const tag = (x, y, v, up = 'monte', dn = 'descend') => Math.abs(v) < 1 ? '' : text(x, y, v > 0 ? '▲ ' + up : '▼ ' + dn, { s: 10.5, w: 800, c: v > 0 ? '#ffc35c' : '#5fd6ff' });
  return svg(340, 200, `${JET(170, 102, 1.05)}
    ${tag(92, 146, o.ailL)}${tag(248, 146, o.ailR)}${o.splL > 1 ? text(126, 118, 'spoilers ▲', { s: 10, w: 800, c: '#ff6fc8' }) : ''}${o.splR > 1 ? text(214, 118, 'spoilers ▲', { s: 10, w: 800, c: '#ff6fc8' }) : ''}
    ${tag(170, 196, o.elev)}${Math.abs(o.rud) > 1 ? text(170, 178, o.rud > 0 ? 'direction ▶' : '◀ direction', { s: 10.5, w: 800, c: '#b48cff' }) : ''}
    ${o.flap ? text(170, 74, `volets ${o.flapN}`, { s: 11, w: 800, c: '#62e3a0' }) : ''}${o.gspl ? text(170, 90, `aérofreins ${Math.round(o.gspl)} %`, { s: 10.5, w: 800, c: '#ff6fc8' }) : ''}`);
}
function stickTask(goal) {
  return (ctx, T) => {
    const W = ctx.W; W.surfAuto(false);
    const r = row(T.lab, 'padrow'); const side = document.createElement('div'); side.className = 'padside';
    const pd = pad(r, () => upd(), { label: 'Mini-manche' }); r.appendChild(side);
    const rud = slider(side, { label: 'Palonnier', min: -1, max: 1, step: 0.1, value: 0, fmt: (v) => (v < -0.05 ? '◀ gauche' : v > 0.05 ? 'droite ▶' : 'neutre') }, () => upd());
    const fl = seg(side, 'Volets', ['0', '1', '2', '3', 'FULL'], 0, () => upd());
    const sb = slider(side, { label: 'Aérofreins', min: 0, max: 100, step: 25, value: 0, unit: '%' }, () => upd());
    const hold = holder(T, 600);
    function upd() {
      const [x, y] = pd.get(), f = fl.get(), ail = x * 20, elev = -y * 20;
      W.setSurf({ ail, spl: x * 30, elev, rud: rud.get() * 25, flap: [0, 10, 15, 20, 35][f], slat: f ? [0, 0.6, 0.8, 0.9, 1][f] : 0, gspl: sb.get() * 0.4 });
      T.art.innerHTML = surfArt({ ailL: -ail, ailR: ail, splL: -x * 30, splR: x * 30, elev, rud: rud.get() * 25, flap: f, flapN: ['0', '1', '2', '3', 'FULL'][f], gspl: sb.get() });
      hold(goal.check({ x, y, r: rud.get(), f, sb: sb.get() }), goal.msg);
    }
    upd();
    return () => W.setSurf({ ail: 0, spl: 0, elev: 0, rud: 0, flap: 0, slat: 0, gspl: 0 });
  };
}
function reliefTask(ctx, T) {
  const W = ctx.W, VFE = [0, 230, 200, 185, 177], NM = ['0', '1', '2', '3', 'FULL']; let act = 3, relieved = false;
  const sv = slider(T.lab, { label: 'Vitesse', min: 150, max: 215, step: 1, value: 160, unit: 'kt' }, draw);
  const hold = holder(T, 900);
  function draw() {
    const V = sv.get(), cmd = 3;
    if (act === cmd && V > VFE[cmd] + 4) { act = cmd - 1; relieved = true; ctx.sfx('tick'); }
    if (act < cmd && V < VFE[cmd] - 4) act = cmd;
    W.setSurf({ flap: [0, 10, 15, 20, 35][act], slat: [0, 0.6, 0.8, 0.9, 1][act] });
    const Y = (v) => 180 - (v - 140) / 100 * 160;
    T.art.innerHTML = svg(340, 190, `<rect x="40" y="10" width="54" height="172" rx="6" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>
      ${[160, 180, 200, 220].map((v) => `<line x1="40" x2="52" y1="${Y(v)}" y2="${Y(v)}" stroke="#93a1bd"/>${text(70, Y(v) + 4, v, { s: 10, c: '#93a1bd' })}`).join('')}
      <rect x="86" y="${Y(240)}" width="8" height="${Y(VFE[act]) - Y(240)}" fill="#ff3b30"/>${text(100, Y(VFE[act]) + 4, `VFE ${NM[act]} = ${VFE[act]} kt`, { s: 11, a: 'start', c: '#ff6a4d', w: 800 })}
      <polygon points="40,${Y(V)} 30,${Y(V) - 7} 30,${Y(V) + 7}" fill="#ffc35c"/>${text(28, Y(V) + 4, V, { s: 12, a: 'end', w: 800, c: '#ffc35c' })}
      ${text(240, 60, `Levier : ${NM[cmd]}`, { s: 15, w: 800 })}${text(240, 86, `Volets réels : ${NM[act]}`, { s: 15, w: 800, c: act < cmd ? '#ffc35c' : '#62e3a0' })}${act < cmd ? lamp(190, 104, 100, 26, 'F RELIEF', true) : ''}`);
    hold(relieved, 'Load relief : au-delà de VFE + marge, les volets remontent d’un cran tout seuls pour protéger la structure, puis ressortent quand la vitesse redescend. Ils ne sont pas bloqués : ils rentrent.');
  }
  draw();
}
function lawTask(ctx, T) {
  const lw = seg(T.lab, 'Loi', ['Normale', 'Alternate', 'Directe'], 0);
  const r = row(T.lab, 'padrow'); const pd = pad(r, () => 0, { label: 'Tire vers toi' }); const info = document.createElement('div'); info.className = 'padside'; r.appendChild(info);
  let a = 3, hold0 = 0, acc = 0;
  return loop((dt) => {
    const [, y] = pd.get(), law = lw.get(), want = 3 + Math.max(0, -y) * 20 - Math.max(0, y) * 4;
    const lim = law === 0 ? 15 : 99; a += (Math.min(want, lim) - a) * Math.min(1, dt * 1.5);
    const stall = a > 16;
    if (law === 0 && y < -0.9) hold0 += dt; else hold0 = 0;
    acc += dt; if (acc < 1 / 30) return; acc = 0;
    info.innerHTML = `<div class="big">${fmt1(a)}°</div><div class="hint">incidence · α max 15°</div>${stall ? '<div class="stall">STALL</div>' : ''}`;
    T.art.innerHTML = svg(340, 150, `<g transform="translate(110 92)"><line x1="-90" y1="0" x2="120" y2="0" stroke="rgba(255,255,255,.2)" stroke-dasharray="6 6"/><g transform="rotate(${-a})"><path d="M-70,0 Q-60,-11 -10,-9 L70,-2 Q74,0 70,2 L-10,6 Q-60,8 -70,0Z" fill="#cfd8e6"/></g>${arrow(-110, 0, -76, 0, '#5fd6ff', 2)}</g>
      ${text(250, 40, ['Loi NORMALE', 'Loi ALTERNATE', 'Loi DIRECTE'][law], { s: 15, w: 800, c: law === 0 ? '#62e3a0' : law === 1 ? '#ffc35c' : '#ff6a4d' })}${text(250, 64, law === 0 ? 'toutes les protections' : law === 1 ? 'protections partielles' : 'aucune protection', { s: 12, c: '#93a1bd' })}
      ${stall ? text(250, 100, '⚠️ DÉCROCHAGE', { s: 16, w: 850, c: '#ff6a4d' }) : a > 14.5 && law === 0 ? text(250, 100, 'α max : l’avion ne va pas plus loin', { s: 12, w: 800, c: '#62e3a0' }) : ''}`);
    T.say(law === 0 ? '💡 Tire le manche à fond et tiens-le.' : '💡 Essaie aussi en loi normale.');
    if (hold0 > 2 && !T.isDone()) T.win('Manche plein arrière en loi normale : la protection d’incidence plafonne α, l’avion ne décroche pas. En alternate ou en directe, cette protection n’est plus là : c’est au pilote d’éviter le décrochage.');
  });
}
const fbwTasks = [
  { tag: 'Roulis', q: 'Mets l’avion en roulis à GAUCHE au mini-manche (tiens-le) et regarde les gouvernes en 3D.', task: stickTask({ check: (o) => o.x < -0.6, msg: 'Aileron gauche levé, aileron droit baissé, et les spoilers gauches sortent : l’aile gauche perd de la portance et s’abaisse.' }), why: 'Roulis : ailerons, spoilers de roulis, flaperons. Ce sont des commandes primaires.' },
  { tag: 'Configuration', q: 'Configure l’atterrissage : volets FULL et aérofreins rentrés.', task: stickTask({ check: (o) => o.f === 4 && o.sb === 0, msg: 'Volets et becs sont des commandes secondaires : plus de courbure, une incidence de décrochage plus forte. Les becs sortent avec les volets.' }), why: 'Commandes secondaires : volets, becs, aérofreins, spoilers, trims.' },
  { tag: 'Load relief', q: 'Volets 3 sortis : accélère au-delà de la VFE et observe.', task: reliefTask, why: 'VFE = vitesse max volets sortis, une par cran.' },
  { tag: 'Lois FBW', q: 'En loi NORMALE, tire le mini-manche à fond et tiens 2 s : l’avion décroche-t-il ?', task: lawTask, why: 'Normale : toutes les protections. Alternate : partielles. Directe : aucune, le manche commande la gouverne.' },
];
const fbwItems = [
  Q('Primaires', 'Laquelle est une commande primaire ?', ['La gouverne de direction', 'Les volets', 'Les becs', 'Le trim'], 'Primaires : profondeur (tangage), ailerons et spoilers de roulis (roulis), direction (lacet).'),
  Q('Commandes', 'Une commande assistée (servocommande + liaison mécanique gardée)…', ['Reste réversible : pas besoin de sensation artificielle', 'Est irréversible', 'Impose une sensation artificielle', 'N’existe pas sur les avions de ligne'], 'Totalement asservie = irréversible : sensation artificielle obligatoire.'),
  Q('Commandes', 'Pourquoi une commande irréversible protège-t-elle du flutter ?', ['Les efforts aéro ne remontent pas dans la transmission', 'Elle est plus légère', 'Elle a plus de câbles', 'Elle bloque les gouvernes'], 'Transmission à sens unique.'),
  Q('Q-feel', 'Le Q-feel donne au manche un effort proportionnel…', ['À la pression dynamique, donc à la vitesse', 'À l’altitude', 'À la masse de l’avion', 'À la température'], 'Il évite la sur-commande à grande vitesse.'),
  Q('Trim', 'Sur une commande asservie, le trim de profondeur…', ['Déplace le plan horizontal réglable (THS) par vérin à vis', 'Utilise un tab aérodynamique', 'Bloque la gouverne', 'Change la loi de pilotage'], 'Les trims de direction et d’ailerons déplacent le neutre de l’unité de sensation.'),
  Q('Limiteur', 'Le limiteur de direction…', ['Réduit le débattement de la gouverne à grande vitesse', 'Augmente le débattement à grande vitesse', 'Ne marche qu’au sol', 'Bloque le palonnier en croisière'], 'Rapport variable, butées variables ou blow-back : on protège la dérive.'),
  Q('Secondaires', 'Les volets sortent de façon inégale. Que fait le système ?', ['Il se fige (protection de dissymétrie)', 'Il les rentre d’un cran', 'Il sort les becs', 'Il passe en loi directe'], 'Sinon embardée en roulis et torsion de la structure.'),
  Q('Secondaires', 'Le blow-back…', ['L’effort aéro dépasse celui du vérin : la surface rentre un peu', 'Les becs sortent seuls à forte incidence', 'Les volets remontent au-delà de la VFE', 'Les spoilers sortent au toucher'], 'Protection naturelle à grande vitesse.'),
  Q('Secondaires', 'Le frein mécanique sur le moteur hydraulique des volets sert…', ['À bloquer le vérin à vis sans pression', 'À ralentir l’avion', 'À éviter le blow-back', 'À verrouiller les becs au sol'], 'Les volets ne glissent pas.'),
  Q('FBW', 'Les deux pilotes poussent leur mini-manche en même temps. Les ordres…', ['S’additionnent (avec limite) + annonce DUAL INPUT', 'S’annulent', 'Seul le commandant compte', 'Le dernier qui bouge gagne'], 'Bouton de priorité : annule l’autre mini-manche + PRIORITY LEFT/RIGHT.'),
  Q('FBW', 'Pourquoi des calculateurs dissemblables ?', ['Pour qu’un même bug ne touche pas tous les calculateurs', 'Pour réduire le coût', 'Pour alléger l’avion', 'Pour avoir plus de puissance de calcul'], 'Matériels et logiciels différents + vote.'),
  Q('FBW', 'Les capteurs critiques (incidence, vitesse, attitude) sont…', ['Au moins triplés, avec un vote', 'Doublés', 'Uniques mais très fiables', 'Mesurés par le pilote'], 'Le vote élimine le capteur faux.'),
  Q('FBW', 'Un avantage des commandes électriques ?', ['La protection du domaine de vol', 'Plus de sensations naturelles', 'Plus de câbles', 'Un avion forcément plus stable'], 'Aussi : trim automatique, gain de masse, et elles permettent un avion instable (moins de traînée).'),
  Q('Au sol', 'Les gust locks…', ['Bloquent les gouvernes au sol contre le vent', 'Verrouillent le train', 'Bloquent les inverseurs', 'Coupent le FBW'], 'À retirer avant le vol (voyants, flammes).'),
];

// ======================================================================= 7. PRESSURISATION
const PA = (h) => 1013.25 * Math.pow(1 - 6.8756e-6 * h, 5.2559), HOF = (p) => (1 - Math.pow(p / 1013.25, 1 / 5.2559)) / 6.8756e-6, PSI = 1 / 68.95;
function cabinArt(o) {
  return svg(340, 176, `${gauge(56, 56, 36, o.ca / 1000, 0, 16, 'cabine ×1000 ft', { zones: [[0, 8, '#62e3a0'], [10, 16, '#ff6a4d']], fmt: (v) => fmt1(v) })}
    ${gauge(170, 56, 36, o.vs / 1000, -2, 3, 'vario ×1000 ft/min', { zones: [[-1, 1, '#62e3a0'], [1, 3, '#ffc35c']], fmt: (v) => fmt1(v) })}
    ${gauge(284, 56, 36, o.dp, -1, 10, 'ΔP psi', { zones: [[0, 8.6, '#62e3a0'], [8.6, 10, '#ff6a4d']], fmt: (v) => fmt1(v) })}
    ${text(10, 136, `Avion : FL${String(Math.round(o.alt / 100)).padStart(3, '0')}`, { s: 13, w: 800, a: 'start' })}
    ${lamp(196, 122, 64, 20, 'CAB ALT', o.ca > 10000, '#ff3b30')}${lamp(266, 122, 64, 20, o.masks ? 'MASQUES' : 'ΔP', o.masks || o.dp > 8.6, o.masks ? '#ffc35c' : '#ff3b30')}
    ${text(170, 164, o.note || '', { s: 11, c: '#93a1bd' })}`);
}
function pressuTask(ctx, T) {
  const W = ctx.W; let alt, Pc, ca0, strikes, run, msg = '', last = null;
  const so = slider(T.lab, { label: 'Vanne de décharge (outflow)', min: 0, max: 100, value: 100, unit: '% ouverte' }, (v) => W.setOutflow(v / 100));
  const rb = row(T.lab); const go = button(rb, '▶ Décoller', () => reset(true), 'pri');
  const hold = holder(T, 300);
  function reset(start) { alt = 0; Pc = PA(0); ca0 = 0; strikes = 0; run = !!start; msg = ''; last = null; go.style.display = start ? 'none' : ''; if (start) { so.set(70); W.setOutflow(0.7); } }
  reset(false);
  let acc = 0;
  const stop = loop((dt) => {
    if (run) {
      const sdt = dt * 30; alt = Math.min(37000, alt + 2500 / 60 * sdt);
      const Pa = PA(alt), A = so.get() / 100, dP = Math.max(0, Pc - Pa), out = A * Math.sqrt(dP / 61.3);
      Pc += 0.55 * (1 - out) * sdt; Pc = Math.min(Pc, PA(-600));
      const ca = HOF(Pc), vs = (ca - ca0) / sdt * 60; ca0 = ca;
      const dp = (Pc - Pa) * PSI, bad = ca > 8000 ? 'altitude cabine au-dessus de 8 000 ft' : Math.abs(vs) > 1000 ? 'vario cabine au-delà de 1 000 ft/min' : dp > 8.6 ? 'ΔP au-delà de 8,6 psi' : '';
      if (bad) { strikes += dt; if (strikes > 2.5) { run = false; msg = '❌ Raté : ' + bad + '.'; go.style.display = ''; go.textContent = '↻ Réessayer'; ctx.sfx('ko'); } } else strikes = Math.max(0, strikes - dt * 0.3);
      if (alt >= 37000 && run) { run = false; hold(true, `FL370 atteint avec une cabine à ${fmtk(ca)} ft et ΔP ${fmt1(dp)} psi. Tu as fermé la vanne au fur et à mesure : c’est ce que fait le régulateur.`); }
      last = { ca, vs, dp, alt };
    }
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    const L = last || { ca: 0, vs: 0, dp: 0, alt: 0 };
    T.art.innerHTML = cabinArt({ ...L, note: msg || (run ? 'Ferme la vanne peu à peu pendant la montée.' : 'Débit d’air entrant constant : c’est la sortie que tu règles.') });
  });
  return () => { stop(); W.setOutflow(0.3); };
}
function decompTask(ctx, T) {
  const W = ctx.W; let Pc = PA(7000), leak = 0, ca0 = 7000, masks = false, alarm = false, acc = 0;
  const so = slider(T.lab, { label: 'Vanne de décharge', min: 0, max: 100, value: 34, unit: '% ouverte' }, (v) => W.setOutflow(v / 100));
  const rb = row(T.lab); button(rb, '💥 Brèche dans le fuselage', (b) => { leak = 0.8; b.disabled = true; }, '');
  return loop((dt) => {
    const sdt = dt * 30, Pa = PA(35000), A = so.get() / 100, dP = Math.max(0, Pc - Pa);
    Pc += 0.55 * (1 - (A + leak) * Math.sqrt(dP / 61.3)) * sdt; Pc = Math.max(Pa, Math.min(Pc, PA(6000)));
    const ca = HOF(Pc), vs = (ca - ca0) / sdt * 60; ca0 = ca;
    if (ca > 10000 && !alarm) { alarm = true; ctx.sfx('ko'); }
    if (ca > 14000 && !masks) { masks = true; ctx.sfx('bang'); }
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    T.art.innerHTML = cabinArt({ ca, vs, dp: (Pc - Pa) * PSI, alt: 35000, masks, note: masks ? 'Masques passagers tombés (capsule anévroïde).' : alarm ? 'Alarme CAB ALT : Master Caution, son, ECAM.' : 'Croisière FL350, cabine stable.' });
    if (masks && !T.isDone()) T.win('Alarme CAB ALT à 10 000 ft cabine, chute automatique des masques vers 14 000 ft. En croisière normale, la cabine reste sous 8 000 ft.');
  });
}
const pressuTasks = [
  { tag: 'Mode manuel', q: 'Pressurisation en manuel : décolle et monte au FL370 en gardant cabine ≤ 8 000 ft, vario ≤ 1 000 ft/min et ΔP ≤ 8,6 psi.', task: pressuTask, hint: 'Pars vanne ouverte, et ferme-la doucement.', why: 'La pression cabine est l’équilibre entre ce qui entre (à peu près constant) et ce qui sort par la vanne de décharge.' },
  { tag: 'Décompression', q: 'Croisière FL350 : provoque une brèche et observe les alarmes de la cabine.', task: decompTask, why: 'Alarme 10 000 ft, masques 14 000 ft, croisière ≤ 8 000 ft.' },
  { tag: 'Bootstrap', q: 'Remets dans l’ordre le trajet de l’air dans le cycle bootstrap.', task: orderTask(['Air prélevé chaud et comprimé', 'Prérefroidisseur (air de soufflante)', 'Compresseur de l’ACM', 'Échangeur principal (air dynamique)', 'Turbine de l’ACM : détente, air très froid', 'Séparateur d’eau', 'Vers la cabine']), why: 'Le froid vient de la détente dans la turbine. On recomprime avant l’échangeur pour qu’il évacue mieux la chaleur.' },
];
const pressuItems = [
  Q('Pistons', 'Sur un avion léger, la pompe à vide alimente…', ['Les gyroscopes (horizon, conservateur de cap)', 'Les boudins de dégivrage', 'La pressurisation', 'Le chauffage cabine'], 'Elle perd en efficacité en altitude. Le compresseur gonfle les boudins.'),
  Q('Pistons', 'Le chauffage cabine d’un avion à pistons présente un risque de…', ['Monoxyde de carbone', 'Givrage', 'Surpression', 'Hypoxie due à la pompe à vide'], 'L’échangeur est autour du pot d’échappement : une fissure laisse passer le CO.'),
  Q('Prélèvement', 'À bas régime, on prélève l’air…', ['Sur l’étage HP', 'Sur l’étage IP', 'À la soufflante', 'À l’APU seulement'], 'HP à bas régime, IP à fort régime, pour limiter la pénalité moteur.'),
  Q('Prélèvement', 'Alarme BLEED LEAK : que fais-tu ?', ['J’isole le prélèvement concerné', 'J’ouvre le cross-bleed', 'Je monte pour refroidir', 'J’augmente la poussée'], 'Une fuite peut donner un feu de compartiment ou une perte de pressurisation.'),
  Q('Pressurisation', 'Quels paramètres la pressurisation règle-t-elle ?', ['Ventilation, température et pression', 'Pression, température et humidité', 'Seulement la pression', 'Pression et oxygène'], 'L’humidité n’est pas régulée (2 à 15 % en croisière), sauf humidification sur A350 et 787.'),
  Q('Pressurisation', 'Pour faire « descendre » la cabine…', ['On ferme la vanne de décharge', 'On ouvre la vanne de décharge', 'On coupe un pack', 'On ouvre les soupapes'], 'Moins d’air sort, la pression cabine monte, l’altitude cabine baisse.'),
  Q('Régulateur', 'Quelle donnée entre-t-on dans le régulateur de pressurisation ?', ['L’altitude du terrain de destination', 'La masse de l’avion', 'La température cabine', 'Le nombre de passagers'], 'Il reçoit aussi l’altitude avion et la vitesse verticale.'),
  Q('Sécurité', 'La soupape de dépression évite…', ['Que la cabine soit plus basse que l’extérieur (implosion)', 'Une surpression structurale', 'La fumée en cabine', 'Le givrage de la vanne'], 'Soupapes passives, indépendantes du régulateur : surpression et dépression.'),
  Q('Chiffres', 'Le plafond d’un jet est limité par…', ['Le ΔP structural max (8,6 à 9,1 psi)', 'La puissance des packs', 'L’altitude cabine de 14 000 ft', 'La vanne de décharge'], 'Ex. 8,6 psi → FL410 à 430.'),
  Q('Pack', 'Le hot trim air…', ['Contourne le pack et réchauffe chaque zone', 'Sort de la turbine de l’ACM', 'Alimente l’antigivrage', 'Vient de la recirculation'], 'Air chaud injecté zone par zone (cockpit, cabine avant, arrière).'),
  Q('Pack', 'Part de l’air recirculé en cabine ?', ['Environ 50 %', '5 %', '90 %', '0 %'], 'Ventilateurs + filtres HEPA : économie d’énergie, confort.'),
  Q('Pack', 'L’intérêt d’une climatisation électrique (787, A350) ?', ['Pas de prélèvement : meilleure consommation', 'Plus légère que tout', 'Pas besoin de refroidissement', 'Elle humidifie l’air'], 'Mais gros moteurs électriques et refroidissement plus complexes.'),
  Q('Bootstrap', 'D’où vient le froid du cycle bootstrap ?', ['De la détente dans la turbine de l’ACM', 'Du compresseur de l’ACM', 'D’un fluide frigorigène', 'Du séparateur d’eau'], 'Sans fluide frigorigène : plus léger et fiable.'),
];

// ======================================================================= 8. OXYGÈNE ET GIVRE
function bootsTask(ctx, T) {
  let ice = 0, good = 0, inflate = 0, acc = 0, note = '';
  const rb = row(T.lab); button(rb, '🎈 Gonfler les boudins', () => {
    if (inflate > 0) return;
    if (ice < 6) { note = '❌ Trop tôt : la glace est trop fine, elle casse mal.'; ctx.sfx('ko'); good = 0; }
    else if (ice > 13) { note = '❌ Trop tard : trop de glace, le profil était dégradé.'; ctx.sfx('ko'); good = 0; }
    else { good++; note = `✅ Bien vu (${fmt1(ice)} mm) ! ${good}/2`; ctx.sfx('ok'); }
    inflate = 1;
  }, 'pri big');
  return loop((dt) => {
    if (inflate > 0) { inflate -= dt * 1.1; if (inflate <= 0) { inflate = 0; ice = 0; } else ice = Math.max(0, ice * (inflate > 0.5 ? 1 : 0.7)); }
    else ice = Math.min(22, ice + dt * 2.2);
    if (ice >= 22 && !inflate) { note = '❌ Beaucoup trop de glace ! On recommence.'; good = 0; ice = 0; }
    acc += dt; if (acc < 1 / 30) return; acc = 0;
    const inf = inflate > 0.5 ? (1 - inflate) * 2 : inflate * 2, th = ice * 1.6;
    T.art.innerHTML = svg(340, 160, `<path d="M300,40 L120,40 Q60,40 60,80 Q60,120 120,120 L300,120" fill="#cfd8e6"/>
      <path d="M140,${40 - inf * 8} Q${60 - inf * 10},${40 - inf * 6} ${60 - inf * 10},80 Q${60 - inf * 10},${120 + inf * 6} 140,${120 + inf * 8}" fill="none" stroke="#1c1e22" stroke-width="${8 + inf * 6}"/>
      ${ice > 0.3 ? `<path d="M140,${34 - th * 0.3} Q${56 - th},${36 - th * 0.4} ${56 - th},80 Q${56 - th},${124 + th * 0.4} 140,${126 + th * 0.3}" fill="none" stroke="rgba(220,240,255,.85)" stroke-width="${3 + th * 0.5}"/>` : ''}
      ${text(250, 84, `${fmt1(ice)} mm`, { s: 22, w: 850, c: ice >= 6 && ice <= 13 ? '#62e3a0' : '#fff' })}${text(250, 104, 'de glace', { s: 11, c: '#93a1bd' })}
      ${text(170, 150, note || 'Objectif : gonfler entre 6 et 13 mm, deux fois de suite.', { s: 11.5, w: 700, c: '#ffc35c' })}`);
    if (good >= 2 && !T.isDone()) T.win('Les boudins font seulement du dégivrage : on laisse la glace se former (6 à 13 mm), puis on la casse par cycles.');
  });
}
function iceDetTask(ctx, T) {
  const W = ctx.W; let heat = 0, acc = 0;
  const si = slider(T.lab, { label: 'Glace sur la sonde', min: 0, max: 100, value: 0, unit: '%' });
  const rb = row(T.lab); const ai = toggle(rb, 'WING ANTI ICE', false, (v) => W.setIce(v ? 1 : 0)); button(rb, '🔥 Chauffage bref de la sonde', () => { heat = 2.5; });
  return loop((dt) => {
    heat = Math.max(0, heat - dt);
    const ice = heat > 0 ? 0 : si.get(), f = 40 - ice * 0.012, alarm = f < 39.6, flash = heat > 0 && si.get() > 33;
    acc += dt; if (acc < 1 / 20) return; acc = 0;
    T.art.innerHTML = svg(340, 150, `<rect x="40" y="40" width="16" height="70" rx="4" fill="#9aa3ae"/><rect x="${44 - ice * 0.06}" y="${40 - ice * 0.15}" width="${8 + ice * 0.12}" height="${70 + ice * 0.15}" rx="4" fill="rgba(220,240,255,${ice / 120})"/>
      ${text(48, 130, 'sonde', { s: 10, c: '#93a1bd' })}${text(170, 62, `${f.toFixed(3).replace('.', ',')} kHz`, { s: 24, w: 850, c: alarm ? '#ffc35c' : '#62e3a0' })}${text(170, 84, heat > 0 ? 'chauffage : la glace fond' : 'fréquence de résonance', { s: 11, c: '#93a1bd' })}
      ${lamp(250, 44, 70, 30, 'ICE', alarm || flash, '#ffc35c')}${text(285, 100, ai.get() ? 'antigivrage ON' : 'antigivrage OFF', { s: 11, c: ai.get() ? '#ff8a3c' : '#93a1bd', w: 800 })}`);
    if (alarm && ai.get() && !T.isDone()) T.win('La glace ajoute de la masse : la fréquence baisse → ICE. Mais ICE veut dire « de la glace se forme », pas « la protection marche » : c’est à l’équipage d’enclencher l’antigivrage.');
  });
}
const AI_CASES = [
  ['Montée', 'TAT +6 °C', 'Dans les nuages', 0, 'TAT ≤ 10 °C + humidité visible = conditions givrantes : ENG ANTI ICE ON.'],
  ['Croisière', 'SAT −48 °C', 'Dans les nuages', 1, 'En montée et en croisière avec SAT < −40 °C, l’antigivrage moteur n’est pas requis.'],
  ['Descente', 'SAT −45 °C', 'Dans les nuages', 0, 'En descente dans le givrage : ON, même sous −40 °C.'],
  ['Montée', 'TAT +14 °C', 'Dans les nuages', 1, 'TAT au-dessus de 10 °C : pas de conditions givrantes.'],
  ['Roulage', 'OAT +3 °C', 'Ciel clair, slush sur la piste', 0, 'Au sol, OAT ≤ 10 °C avec neige, eau ou slush sur la piste = conditions givrantes.'],
  ['Croisière', 'TAT −8 °C', 'Ciel clair, aucun nuage', 1, 'Pas d’humidité visible : pas de conditions givrantes.'],
  ['Décollage', 'OAT +8 °C', 'Brouillard, visibilité 600 m', 0, 'Brouillard ≤ 1 mile = humidité visible, et OAT ≤ 10 °C.'],
];
const aiArt = (c) => svg(340, 110, `<rect x="10" y="10" width="320" height="90" rx="12" fill="#0d1628" stroke="rgba(140,170,230,.3)"/>${text(30, 40, '✈️ ' + c[0], { s: 15, w: 800, a: 'start' })}${text(30, 66, '🌡️ ' + c[1], { s: 14, a: 'start', c: '#5fd6ff', w: 700 })}${text(30, 90, '☁️ ' + c[2], { s: 13, a: 'start', c: '#cdd7ea' })}${text(306, 40, 'A320', { s: 12, a: 'end', c: '#93a1bd' })}`);
const givreTasks = [
  { tag: 'Boudins', q: 'La glace s’accumule sur le bord d’attaque : gonfle les boudins au bon moment, deux fois de suite.', task: bootsTask, why: 'Cycles de 6 à 60 s ; protection limitée par la pompe.' },
  { tag: 'Détecteur de givre', q: 'Fais apparaître l’alarme ICE sur le détecteur à résonance, puis réagis.', task: iceDetTask, why: 'Sonde magnétostrictive vers 40 kHz : la masse de glace fait baisser la fréquence ; un bref chauffage confirme que c’est de la glace.' },
  { tag: 'Oxygène équipage', q: 'Range chaque situation dans le bon mode du masque équipage.', task: sortTask([
    ['Fumée dans le poste de pilotage.', 1, '100 % : O₂ pur, aucun air cabine (fumée) aspiré.'],
    ['Décompression rapide à FL390.', 2, 'Emergency : O₂ en surpression, poussé dans les poumons.'],
    ['Altitude cabine 11 000 ft, sans fumée.', 0, 'Normal (dilution) : le plus économe.'],
    ['Odeur de brûlé et fumée légère.', 1, '100 %.'],
    ['Altitude cabine 38 000 ft.', 2, 'Emergency : très haute altitude cabine (35 000 à 40 000 ft).'],
    ['Cabine qui monte lentement à 12 000 ft.', 0, 'Normal : plus d’O₂ en montant.'],
  ], ['Normal', '100 %', 'Emergency'], { n: 5 }), why: 'Régulateur diluteur à la demande, relié à une bouteille haute pression.' },
];
const givreItems = [
  ...AI_CASES.map((c) => ({ tag: 'Antigivrage A320', q: 'ENG ANTI ICE : quelle décision ?', art: aiArt(c), c: ['ON', 'Pas obligatoire'], a: c[3], keep: true, why: c[4] })),
  Q('Passagers', 'Le générateur chimique d’un masque passager…', ['Débite en continu 12 à 20 min et ne s’arrête plus', 'Ne débite que quand on inspire', 'Se coupe quand on remet le masque', 'Dure 2 h'], 'Il démarre quand le passager tire le masque.'),
  Q('Passagers', 'Les masques passagers tombent automatiquement vers…', ['14 000 ft cabine', '8 000 ft cabine', '10 000 ft cabine', '25 000 ft cabine'], 'Capsule anévroïde, ou bouton MAN DROP.'),
  Q('Sécurité', 'Pourquoi jamais de graisse sur un circuit oxygène ?', ['Graisse + O₂ sous pression = inflammation spontanée', 'Elle bouche les masques', 'Elle gèle en altitude', 'Elle corrode les bouteilles'], 'Seulement des lubrifiants compatibles oxygène.'),
  Q('PBE', 'La cagoule anti-fumée (PBE) protège environ…', ['15 à 20 min', '2 min', '2 h', '5 h'], 'Générateur chimique intégré, protège yeux et voies respiratoires.'),
  Q('Principes', 'Antigivrage ou dégivrage : laquelle laisse la glace se former ?', ['Le dégivrage, qui l’enlève par cycles', 'L’antigivrage', 'Les deux', 'Aucune'], 'Antigivrage : protection continue, préférée sur les surfaces critiques.'),
  Q('Empennage', 'Pourquoi l’empennage de beaucoup de jets n’est-il pas protégé ?', ['Il travaille dans un air plus propre et l’avion est certifié ainsi', 'Il ne givre jamais', 'Il est chauffé par les moteurs', 'Il est en composite'], 'Risque : décrochage de l’empennage, surtout volets sortis.'),
  Q('Systèmes', 'Les tubes piccolo distribuent…', ['De l’air chaud prélevé au bord d’attaque', 'Du liquide glycolé', 'Du courant aux résistances', 'L’air des boudins'], 'Air à 200 à 350 °C : antigivrage continu des jets (voilure, nacelles).'),
  Q('Pare-brise', 'Le pare-brise chauffant est maintenu entre…', ['18 et 35 °C, en AC triphasé 400 Hz', '0 et 5 °C, en 28 V DC', '60 et 80 °C', '−10 et +10 °C'], 'Fils ou film conducteur.'),
  Q('Détecteurs', 'Le détecteur de givre pneumatique détecte la glace par…', ['Une chute de pression quand la glace bouche les trous', 'Une baisse de fréquence', 'Un couple sur un rotor', 'Une caméra'], 'Rotatif : la glace bloque le jeu rotor-couteau → couple → microcontact.'),
  Q('Alarme', 'Le voyant ICE s’allume. Ça veut dire…', ['De la glace se forme : l’équipage doit agir', 'L’antigivrage est en marche', 'Le détecteur est en panne', 'Le givre a disparu'], 'Il reste allumé tant que la sonde n’est pas dégagée.'),
];

// ======================================================================= 9. CARBURANT
function balanceTask(ctx, T) {
  const W = ctx.W; let L = 4000, R = 5600, used = false, acc = 0;
  W.setTanks(1);
  const r1 = row(T.lab); const xf = toggle(r1, 'X-FEED (intercommunication)', false, () => { used = true; });
  const r2 = row(T.lab); const pl = toggle(r2, 'Pompes GAUCHE', true), pr = toggle(r2, 'Pompes DROITE', true);
  const hold = holder(T, 1000);
  const stop = loop((dt) => {
    const burn = 40 * dt; // 1 200 kg/h par moteur, temps accéléré
    let fromL = 0, fromR = 0;
    if (!xf.get()) { fromL = burn; fromR = burn; }
    else { const nL = pl.get(), nR = pr.get(); if (nL && nR) { fromL = burn; fromR = burn; } else if (nR) fromR = 2 * burn; else if (nL) fromL = 2 * burn; else { fromL = burn; fromR = burn; } }
    L = Math.max(0, L - fromL); R = Math.max(0, R - fromR);
    W.setTankLevels({ L: L / 7000, R: R / 7000, C: 0.03, T: 0.05 });
    acc += dt; if (acc < 1 / 15) return; acc = 0;
    const lo = (!xf.get() && (!pl.get() || !pr.get()));
    T.art.innerHTML = svg(340, 160, `${JET(170, 96, 0.62, '#2a3346')}
      ${vbar(70, 30, 34, 100, L, 0, 7000, 'GAUCHE', L < R - 100 ? '#ffc35c' : '#5fd6ff', { val: fmtk(L) + ' kg' })}${vbar(236, 30, 34, 100, R, 0, 7000, 'DROITE', R < L - 100 ? '#ffc35c' : '#5fd6ff', { val: fmtk(R) + ' kg' })}
      ${text(170, 148, `Écart : ${fmtk(Math.abs(L - R))} kg`, { s: 13, w: 800, c: Math.abs(L - R) < 100 ? '#62e3a0' : '#ffc35c' })}${lo ? lamp(126, 10, 88, 20, 'LO PR', true) : ''}${xf.get() ? text(170, 128, '↔ X-FEED ouvert', { s: 11, w: 800, c: '#62e3a0' }) : ''}`);
    hold(used && Math.abs(L - R) < 100 && !xf.get() && pl.get() && pr.get(), 'Intercommunication ouverte, pompes coupées du côté le plus léger : les deux moteurs boivent dans le réservoir le plus lourd. Une fois équilibré, on referme et on remet les pompes : vérifie toujours la symétrie.');
  });
  return () => { stop(); W.setTankLevels({ L: 0.8, R: 0.8, C: 0.5, T: 0.4 }); };
}
function densityTask(ctx, T) {
  const s = slider(T.lab, { label: 'Volume avitaillé', min: 0, max: 15000, step: 100, value: 6000, unit: 'L', fmt: fmtk }, draw);
  const hold = holder(T, 800);
  function draw() { const v = s.get(), m = v * 0.8; T.art.innerHTML = svg(340, 110, `${text(170, 44, `${fmtk(v)} L × 0,80 kg/L`, { s: 15, c: '#93a1bd', w: 700 })}${text(170, 82, `= ${fmtk(m)} kg`, { s: 30, w: 850, c: Math.abs(m - 8000) < 1 ? '#62e3a0' : '#fff' })}`); hold(Math.abs(m - 8000) < 1, '8 000 / 0,80 = 10 000 L. La densité sert à passer des litres aux kilos (masse et centrage, autonomie).'); }
  draw();
}
const cup = (fuel, water, label) => svg(340, 150, `<path d="M130,30 L210,30 L200,130 L140,130 Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
  <path d="M133,50 L207,50 L${water ? 202 : 200},${water ? 112 : 130} L${water ? 138 : 140},${water ? 112 : 130} Z" fill="${fuel}"/>${water ? '<path d="M138,112 L202,112 L200,130 L140,130 Z" fill="rgba(200,230,255,.55)"/><circle cx="160" cy="104" r="4" fill="rgba(200,230,255,.7)"/><circle cx="182" cy="108" r="3" fill="rgba(200,230,255,.7)"/>' : ''}
  ${text(260, 80, label, { s: 12, c: '#93a1bd' })}`);
const fuelTasks = [
  { tag: 'Équilibrage', q: 'Le réservoir gauche est plus léger. Rééquilibre (écart < 100 kg), puis remets le circuit en normal.', task: balanceTask, hint: 'Ouvre l’intercommunication et joue sur les pompes.', why: 'Intercommunication (cross-feed) : alimenter un moteur avec le réservoir opposé, pour équilibrer, en monomoteur ou après une panne moteur.' },
  { tag: 'Densité', q: 'Il te faut 8 000 kg de Jet A-1 (densité 0,80). Règle le volume à avitailler.', task: densityTask, why: 'Jet A-1 : 0,775 à 0,84 kg/L. AVGAS : 0,68 à 0,72 kg/L.' },
];
const fuelItems = [
  Q('Purge', 'Purge d’AVGAS avant le premier vol : qu’en penses-tu ?', ['De l’eau au fond : je purge encore jusqu’à avoir du carburant propre', 'Tout est normal : l’AVGAS est bleue', 'Le carburant est trop dense, je vide le réservoir', 'Ce sont des bulles d’air'], 'L’eau, plus lourde, se met au fond (gouttes ou dépôt trouble).', { art: cup('rgba(70,140,255,.6)', true, 'AVGAS 100LL') }),
  Q('Purge', 'Purge de Jet A-1 : le liquide est incolore et limpide, rien au fond.', ['C’est normal : le Jet A-1 est incolore', 'Ce n’est que de l’eau : danger', 'Il manque le colorant bleu : mauvais carburant', 'Il faut le filtrer'], 'Eau incolore, AVGAS bleue, Jet A-1 incolore : on regarde s’il y a une séparation au fond.', { art: cup('rgba(255,250,230,.25)', false, 'Jet A-1') }),
  Q('Carburants', 'Point éclair de l’AVGAS ?', ['Environ −40 °C : très inflammable', '≥ 38 °C', 'Environ 200 °C', '0 °C'], 'Jet A-1 : ≥ 38 °C.'),
  Q('Carburants', 'Le Jet A-1 gèle à…', ['−47 °C', '−40 °C', '−20 °C', '−60 °C'], 'Jet A : −40 °C.'),
  Q('Carburants', 'Le Jet B, c’est…', ['30 % essence + 70 % kérosène, très volatil, pour le grand froid', 'Du kérosène pur pour les diesels', 'L’AVGAS sans plomb', 'Le carburant militaire JP-8'], 'JP-8 = Jet A-1 + FSII.'),
  Q('Additifs', 'Le FSII (DiEGME, Prist) sert à…', ['Empêcher les cristaux de glace de l’eau dans le carburant', 'Augmenter l’indice d’octane', 'Colorer le carburant', 'Abaisser le point éclair'], '0,10 à 0,15 % en volume, aussi antibactérien.'),
  Q('Inutilisable', 'Le carburant inutilisable…', ['N’est pas affiché par la jauge et se retire de l’autonomie', 'Est affiché en rouge', 'Est pompé en secours', 'N’existe pas sur les avions modernes'], 'Donné par le manuel de vol : puisards, tuyaux, crépine découverte en montée forte.'),
  Q('Alimentation', 'Alimentation par gravité : condition ?', ['Le réservoir est au-dessus du moteur (aile haute)', 'Une pompe de gavage', 'Un vol sur le dos', 'Une batterie chargée'], 'Simple et fiable. Sous pression : marche en altitude, par temps chaud, sur le dos, mais dépend de l’électricité.'),
  Q('Jauges', 'Une sonde capacitive tombe en panne. La jauge affiche…', ['Vide', 'Plein', 'La dernière valeur', 'Une moyenne'], 'D’où les jaugeurs à tige magnétique pour vérifier au sol.'),
  Q('Pompes', 'Les deux pompes de gavage lâchent à FL370. Que fais-tu ?', ['Je descends et je réduis la puissance', 'Je monte pour économiser', 'J’ouvre l’intercommunication et je continue', 'Je coupe un moteur'], 'La pompe moteur cavite : risque d’extinction. Un air plus dense limite la cavitation. Alarme LOW FUEL PRESS.'),
  Q('Vidange', 'Un avion a une vidange en vol (dump) quand…', ['Sa MTOM dépasse largement sa MLM', 'Il a plus de deux moteurs', 'Il vole au-dessus de FL300', 'Il a un réservoir de trim'], 'Au-dessus de 6 000 ft, loin des zones habitées, arrêt automatique à une masse préréglée.'),
  Q('Réservoirs', 'À quoi sert le réservoir de queue (trim tank) ?', ['Au centrage', 'À l’APU seulement', 'À la vidange', 'Au refroidissement de l’huile'], 'Ailes (principaux), centre, saumons, queue.'),
  Q('Réservoirs', 'Le défaut d’un réservoir souple (bladder) ?', ['Des plis au fond peuvent piéger de l’eau et du carburant', 'Il fuit toujours', 'Il est trop lourd', 'Il ne s’inspecte pas'], 'Rigides : inspectables. Structuraux : l’aile elle-même, légers et efficaces.'),
  Q('Débitmètre', 'Pourquoi le débitmètre massique est-il plus fiable que le volumique ?', ['La densité du carburant varie', 'Il est plus simple', 'Il marche sans électricité', 'Il mesure aussi l’eau'], 'Les gros avions indiquent la quantité en masse.'),
];

export const SIMS_A = {
  inspecteur: { start: (ctx) => runScenario(ctx, { title: 'L’inspecteur de structure', icon: '🔍', intro: '<p>Tu es l’inspecteur : repère les zones à risque, règle les inspections pour attraper une fissure de fatigue, et classe philosophies et maintenances.</p>', tasks: conceptionTasks, items: conceptionItems, n: 12 }) },
  aile: { start: (ctx) => runScenario(ctx, { title: 'L’aile sous contrainte', icon: '🦴', intro: '<p>L’aile est en transparence dans la 3D : longerons, nervures, lisses. Charge l’avion pour trouver la <b>MZFM</b>, puis échappe au <b>flottement</b>.</p>', tasks: structureTasks, items: structureItems, n: 12 }) },
  feu: { start: (ctx) => runScenario(ctx, { title: 'Alerte feu', icon: '🧯', intro: '<p>Fumée en soute, boucles de détection, feu moteur : à toi de jouer. Le moteur droit est en coupe pour voir ses boucles.</p>', tasks: feuTasks, items: feuItems, n: 12 }) },
  pascal: { start: (ctx) => runScenario(ctx, { title: 'Le banc hydraulique', icon: '💧', intro: '<p>Multiplie une force avec la <b>loi de Pascal</b>, vérifie que le travail est conservé, puis teste la RAT.</p>', tasks: hydrauTasks, items: hydrauItems, n: 12 }) },
  freins: { start: (ctx) => runScenario(ctx, { title: 'Roues, freins, train', icon: '🛞', intro: '<p>Trouve l’adhérence maximale, laisse l’anti-skid travailler, rentre le train (l’avion est sur vérins) et calcule l’aquaplaning.</p>', tasks: trainTasks, items: trainItems, n: 13 }) },
  fbw: { start: (ctx) => runScenario(ctx, { title: 'Aux commandes', icon: '🕹️', intro: '<p>Bouge le mini-manche : les gouvernes bougent en 3D. Puis load relief et lois de pilotage.</p>', tasks: fbwTasks, items: fbwItems, n: 13 }) },
  cabine: { start: (ctx) => runScenario(ctx, { title: 'Pressurisation manuelle', icon: '🌬️', intro: '<p>Le régulateur est en panne : c’est toi qui commandes la <b>vanne de décharge</b> pendant toute la montée. Puis une décompression, et le cycle bootstrap.</p>', tasks: pressuTasks, items: pressuItems, n: 12 }) },
  givre: { start: (ctx) => runScenario(ctx, { title: 'Givre et oxygène', icon: '❄️', intro: '<p>Gonfle les boudins au bon moment, lis le détecteur de givre, choisis le mode du masque et applique les règles A320.</p>', tasks: givreTasks, items: givreItems, n: 13 }) },
  fuel: { start: (ctx) => runScenario(ctx, { title: 'Chef carburant', icon: '⛽', intro: '<p>Les réservoirs sont visibles en 3D : rééquilibre-les avec l’intercommunication, convertis litres et kilos, contrôle la purge.</p>', tasks: fuelTasks, items: fuelItems, n: 12 }) },
};
