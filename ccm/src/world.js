// Le monde 3D de Mission CCM : un hangar avec un avion de ligne, un avion léger, un réacteur en coupe
// et un cylindre de moteur à pistons en coupe. 1 unité = 1 m, sol à y = 0, l'avion de ligne nez vers -z.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { makeAirliner, makeLightAircraft, makeTurbofanCutaway, makePistonCutaway } from './models.js';

const DEG = Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
export function makeLabel(text, opt = {}) {
  const fs = 44, pad = 16;
  const font = `${opt.bold === false ? 500 : 700} ${fs}px -apple-system, "Segoe UI", Roboto, sans-serif`;
  const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font;
  const lines = String(text).split('\n');
  const w = Math.ceil(Math.max(...lines.map((l) => g.measureText(l).width))) + pad * 2, h = Math.ceil(lines.length * fs * 1.2 + pad * 1.2);
  c.width = w; c.height = h; g.font = font;
  g.fillStyle = opt.bg || 'rgba(8,12,22,0.82)'; const r = 14;
  g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.fill();
  g.strokeStyle = opt.border || 'rgba(140,170,230,0.35)'; g.lineWidth = 4; g.stroke();
  g.fillStyle = opt.color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => g.fillText(l, w / 2, pad * 0.6 + fs * 0.6 + i * fs * 1.2));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
  sp.userData = { ar: w / h, px: (opt.px || 25) * (lines.length > 1 ? lines.length * 0.85 : 1) }; sp.renderOrder = 30; sp.center.set(0.5, 0);
  return sp;
}

// Fiche d'identité de chaque pièce cliquable : titre, explication courte, mission liée
export const INFO = {
  fuselage: ['Fuselage semi-monocoque', 'Peau + cadres + lisses. La pressurisation tend la peau en circonférence à chaque vol : fatigue cyclique.', 'structure'],
  portes: ['Portes « plug »', 'Plus grandes que leur ouverture : la pression cabine les plaque sur leur cadre.', 'structure'],
  parebrise: ['Pare-brise chauffant', 'Plusieurs couches, chauffé entre 18 et 35 °C en AC 400 Hz contre le givre et les fissures.', 'oxygivre'],
  carenage: ['Carénage ventral', 'Il abrite les packs de climatisation et les trains principaux rentrés.', 'pressu'],
  packs: ['Entrées d’air dynamique des packs', 'L’air extérieur refroidit les échangeurs du cycle bootstrap.', 'pressu'],
  outflow: ['Vanne de décharge (outflow valve)', 'Elle règle la sortie d’air : c’est elle qui fixe l’altitude cabine.', 'pressu'],
  sondes: ['Sondes Pitot et d’incidence', 'Chauffées en permanence en vol. Les capteurs critiques sont au moins triplés pour le vote.', 'oxygivre'],
  detecteur: ['Détecteur de givre', 'Sonde à résonance : la glace ajoute de la masse, la fréquence baisse → alarme ICE.', 'oxygivre'],
  apu: ['APU', 'Petite turbine à gaz en queue : électricité et air au sol, secours en vol. Démarrage moins haut que l’utilisation.', 'perfs'],
  aile: ['Aile (caisson de torsion)', 'Longerons + nervures + peau : résiste à la flexion et à la torsion, et sert de réservoir.', 'structure'],
  longeron: ['Longeron', 'Poutre principale : flexion et cisaillement. Âme = cisaillement, semelles = traction/compression.', 'structure'],
  nervure: ['Nervure', 'Garde la forme du profil et transmet les efforts de la peau aux longerons.', 'structure'],
  lisse: ['Lisse (stringer)', 'Raidisseur dans l’envergure : empêche la peau de flamber.', 'structure'],
  volets: ['Volets (commande secondaire)', 'Plus de courbure, plus de portance. Load relief au-delà de VFE, protection de dissymétrie.', 'commandes'],
  ailerons: ['Ailerons (commande primaire)', 'Roulis, aidés par les spoilers de roulis.', 'commandes'],
  becs: ['Becs de bord d’attaque', 'Retardent le décrochage, autorisent une incidence plus forte.', 'commandes'],
  spoilers: ['Spoilers', 'En vol : roulis et freinage aérodynamique. Au sol : ils détruisent la portance.', 'commandes'],
  wicks: ['Déperditeurs statiques', 'Au bord de fuite : ils déchargent l’électricité statique par effet couronne (moins de parasites radio).', 'elecbase'],
  reservoirs: ['Réservoirs', 'Ailes, centre et plan horizontal (trim). Jauges capacitives, indication en masse.', 'carburant'],
  antigivrage: ['Antigivrage voilure', 'Air chaud prélevé distribué par des tubes piccolo dans le bord d’attaque.', 'oxygivre'],
  empennage: ['Empennages', 'Plan horizontal réglable (THS) et dérive. Sur beaucoup de jets, l’empennage n’est pas protégé du givre.', 'structure'],
  profondeur: ['Gouverne de profondeur', 'Commande primaire de tangage.', 'commandes'],
  direction: ['Gouverne de direction', 'Lacet. Un limiteur réduit son débattement quand la vitesse augmente.', 'commandes'],
  nacelle: ['Nacelle du réacteur', 'Double flux à fort taux de dilution : la soufflante fournit la majorité de la poussée.', 'reacteur'],
  entree: ['Entrée d’air', 'Ralentit l’air pour augmenter sa pression statique. Lèvre chauffée contre le givre.', 'reacteur'],
  inverseur: ['Inverseur à grilles (flux froid)', 'Le capot recule, des portes bloquent le flux froid, les grilles le renvoient vers l’avant.', 'demarrage'],
  fan: ['Soufflante (fan)', 'Elle accélère un gros débit d’air à vitesse modérée : bon rendement propulsif.', 'reacteur'],
  mat: ['Mât réacteur', 'Zone très chargée : à surveiller en prévol (fissures, corrosion).', 'conception'],
  boucles: ['Boucles de détection feu A et B', 'Elles détectent la chaleur. Logique ET : moins de fausses alarmes.', 'feu'],
  idg: ['IDG', 'CSD + alternateur : vitesse constante, donc 400 Hz. Désaccouplement en vol définitif.', 'generation'],
  train: ['Train d’atterrissage', 'Amortisseur oléopneumatique, compas, contrefiches, verrou bas au-delà du point mort.', 'train'],
  rat: ['RAT (éolienne de secours)', 'Elle sort en secours : hydraulique et/ou électricité. Son efficacité dépend de la vitesse.', 'hydraulique'],
  batterie: ['Batterie', 'Démarrage et secours. Ni-Cd : 24 éléments de 1,2 V pour 28 V.', 'generation'],
  fuselageL: ['Avion léger (type SR20)', 'Moteur à pistons à plat, hélice à vitesse constante, train fixe tricycle.', 'quatretemps'],
  aileL: ['Aile basse', 'CG bas, train simple, effet de sol ; mais risque de toucher le sol avec l’hélice.', 'structure'],
  capot: ['Capots moteur', 'Sous les capots : un moteur à plat 4 cylindres refroidi par air.', 'melange'],
  cowlflaps: ['Volets de capot (cowl flaps)', 'Ouverts au décollage et en montée, fermés en croisière.', 'melange'],
  carter: ['Carter', 'Le bâti du moteur, qui porte le vilebrequin.', 'quatretemps'],
  cylindres: ['Cylindres à ailettes', 'Refroidis par air ; la sonde CHT est sur le plus chaud.', 'melange'],
  echappement: ['Échappement', 'Sonde EGT pour régler la mixture. L’échangeur de chauffage cabine est autour : risque de CO.', 'melange'],
  carterhuile: ['Carter d’huile', 'Carter humide : l’huile est stockée dans le carter.', 'melange'],
  carburateur: ['Carburateur', 'Venturi + gicleur. Givrage possible de −10 à +27 °C : réchauffage carbu.', 'carbu'],
  magnetos: ['Deux magnétos', 'Allumage autonome, deux étincelles par cylindre. Essai : chute max 125 à 175 tr/min.', 'melange'],
  regulateur: ['Régulateur d’hélice', 'Masselottes : il règle l’huile du moyeu pour garder le régime choisi.', 'helice'],
  helice: ['Hélice à vitesse constante', 'Le pas augmente quand la vitesse augmente, le régime reste constant.', 'helice'],
  parefeu: ['Cloison pare-feu', 'Sépare le moteur de la cabine.', 'structure'],
  f_cowl: ['Carter de soufflante', 'Il canalise le flux froid (secondaire).', 'reacteur'],
  f_core: ['Carter du cœur', 'Le flux chaud (primaire) passe dedans : compresseurs, chambre, turbines.', 'reacteur'],
  f_fan: ['Attelage BP (vert)', 'Soufflante + compresseur BP + turbine BP, sur l’arbre long. Régime N1.', 'reacteur'],
  f_chambre: ['Chambre de combustion annulaire', 'Air primaire 20-30 % brûle à la stœchiométrie, air secondaire de dilution. Pression ≈ constante.', 'reacteur'],
  f_tuyere: ['Tuyère et cône', 'Accélèrent les gaz : la vitesse monte, pression et température baissent.', 'reacteur'],
  f_arbres: ['Arbres BP et HP', 'L’arbre BP (vert) tourne dans l’arbre HP (jaune) : deux attelages indépendants.', 'reacteur'],
  f_agb: ['Boîtier d’accessoires', 'Entraîné par le corps HP : pompes, génératrice, démarreur.', 'demarrage'],
  f_demarreur: ['Démarreur pneumatique', 'Turbine à air alimentée par l’APU, le groupe de parc ou le cross-bleed.', 'demarrage'],
  f_idg: ['IDG', 'Génératrice à vitesse constante entraînée par le boîtier d’accessoires.', 'generation'],
  f_allumeurs: ['Allumeurs', 'Deux circuits indépendants. Allumage continu en givrage, forte pluie, turbulence.', 'demarrage'],
  p_cylindre: ['Cylindre', 'Le piston y coulisse. Volume total = cylindrée + volume mort.', 'quatretemps'],
  p_culasse: ['Culasse', 'Chambre de combustion, soupapes, bougie.', 'quatretemps'],
  p_admission: ['Conduit d’admission', 'Le mélange frais (bleu) entre pendant le temps 1.', 'quatretemps'],
  p_echappement: ['Conduit d’échappement', 'Les gaz brûlés sortent pendant le temps 4.', 'quatretemps'],
  p_soupapes: ['Soupapes', 'Admission (bleue) et échappement (orange), ouvertes par l’arbre à cames.', 'quatretemps'],
  p_bougie: ['Bougie', 'L’étincelle part juste avant le PMH, à la fin de la compression.', 'quatretemps'],
  p_piston: ['Piston et segments', 'Les segments font l’étanchéité et contrôlent l’huile.', 'quatretemps'],
  p_bielle: ['Bielle', 'Relie le piston au vilebrequin.', 'quatretemps'],
  p_vilebrequin: ['Vilebrequin', 'Transforme le mouvement linéaire en rotation. 2 tours par cycle.', 'quatretemps'],
  p_cames: ['Arbre à cames', 'Il tourne deux fois moins vite que le vilebrequin.', 'quatretemps'],
};

export function createWorld(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, opts.mobile ? 1.6 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = !opts.mobile; renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1424); scene.fog = new THREE.Fog(0x0b1424, 90, 230);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 600);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, rotateSpeed: 0.6, zoomSpeed: 0.9, panSpeed: 0.8, maxPolarAngle: Math.PI * 0.49, minDistance: 1.2, maxDistance: 95, screenSpacePanning: true });
  const W = { renderer, scene, camera, controls, tick: [], parts: {}, anim: {} };

  // ---------------------------------------------------------------- lumières
  scene.add(new THREE.HemisphereLight(0xe7efff, 0x39404a, 1.35));
  const key = new THREE.DirectionalLight(0xfff3e0, 1.75); key.position.set(-30, 48, 30); scene.add(key);
  if (!opts.mobile) { key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 140 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; }
  const fill = new THREE.DirectionalLight(0x9fc0ff, 0.55); fill.position.set(40, 20, -20); scene.add(fill);

  // ---------------------------------------------------------------- hangar
  const floorTex = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#5d636c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = Math.random() * 30 - 15; g.fillStyle = `rgba(${120 + v},${126 + v},${134 + v},${Math.random() * 0.25})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    g.strokeStyle = 'rgba(30,34,40,0.55)'; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(14, 14);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(160, 64), new THREE.MeshPhongMaterial({ map: floorTex, shininess: 30, specular: 0x222222 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // marquages au sol
  const Y = new THREE.MeshBasicMaterial({ color: 0xe9b824 }), Wm = new THREE.MeshBasicMaterial({ color: 0xdde3ea });
  const strip = (w, l, x, z, m = Y, ry = 0) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(w, l), m); s.rotation.x = -Math.PI / 2; s.rotation.z = ry; s.position.set(x, 0.01, z); scene.add(s); return s; };
  strip(0.25, 70, 0, 0); for (const z of [-26, 26]) strip(30, 0.25, 0, z);
  for (const [x, z, ry] of [[-24, 6, 0.6]]) strip(0.2, 14, x, z, Y, ry);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.6, 48), Y); ring.rotation.x = -Math.PI / 2; ring.position.set(22, 0.011, -4); scene.add(ring);
  const ring2 = ring.clone(); ring2.position.set(-14, 0.011, -12); ring2.scale.setScalar(0.55); scene.add(ring2);
  // structure : arches, toit, mur du fond
  const steel = new THREE.MeshPhongMaterial({ color: 0x46505e, shininess: 20 });
  for (let i = 0; i < 9; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(60, 0.35, 8, 64, Math.PI), steel); a.position.set(0, 0, -56 + i * 14); scene.add(a); }
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(60.6, 60.6, 116, 64, 1, true, -Math.PI / 2, Math.PI), new THREE.MeshPhongMaterial({ color: 0x18202c, side: THREE.BackSide, shininess: 5 }));
  roof.rotation.x = Math.PI / 2; roof.position.z = -0.5; scene.add(roof);
  const wallTex = canvasTex(2048, 1024, (g, w, h) => { g.fillStyle = '#1d2633'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 4; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.fillStyle = 'rgba(255,195,92,0.85)'; g.font = 'bold 38px sans-serif'; g.textAlign = 'center'; g.fillText('BA 701 · ATELIER CCM', w / 2, h * 0.4); });
  const wall = new THREE.Mesh(new THREE.CircleGeometry(60.6, 64, 0, Math.PI), new THREE.MeshPhongMaterial({ map: wallTex, side: THREE.DoubleSide })); wall.position.z = -58; scene.add(wall);
  // rampes de lumière au plafond
  const lampM = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
  for (let i = 0; i < 8; i++) for (const a of [-0.55, 0, 0.55]) { const l = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 9), lampM); l.position.set(Math.sin(a) * 59.6, Math.cos(a) * 59.6, -49 + i * 14); l.rotation.z = -a; scene.add(l); }
  // établis, chariots (décor)
  const deco = new THREE.MeshPhongMaterial({ color: 0x2f6fd8 }), deco2 = new THREE.MeshPhongMaterial({ color: 0xc8362c });
  for (const [x, z, m] of [[-40, -40, deco], [-36, -44, deco2], [40, -38, deco], [36, -44, deco2], [44, 12, deco]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(3, 1.1, 1.4), m); b.position.set(x, 0.55, z); b.castShadow = true; scene.add(b); }

  // ---------------------------------------------------------------- modèles
  const AL = makeAirliner(); AL.group.position.set(0, 4.65, 0); scene.add(AL.group);
  const LA = makeLightAircraft(); LA.group.position.set(-24, 1.49, 7); LA.group.rotation.y = 0.65; scene.add(LA.group);
  const clip = [new THREE.Plane(new THREE.Vector3(0, 0, -1), -4)];
  const TF = makeTurbofanCutaway(clip); TF.group.position.set(22, 2.66, -4); TF.group.rotation.y = Math.PI / 2; scene.add(TF.group);
  const PC = makePistonCutaway(); PC.group.position.set(-14, 1.675, -12); PC.group.rotation.y = 0.35; PC.group.scale.setScalar(1.25); scene.add(PC.group);
  for (const M of [AL, LA, TF, PC]) {
    M.group.traverse((o) => { if (o.isMesh) { o.castShadow = !opts.mobile && !o.material.transparent; } });
    for (const k in M.parts) W.parts[k] = (W.parts[k] || []).concat(M.parts[k]);
  }
  // plan de coupe du réacteur : on garde z ≤ -4 (distance = -z - 4 ≥ 0), la face coupée regarde la caméra
  // ombres de contact (disques sombres, peu coûteux, aussi sur mobile)
  const blob = (x, z, sx, sz, ry = 0) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.rotation.z = ry; m.scale.set(sx, sz, 1); m.position.set(x, 0.015, z); scene.add(m); };
  blob(0, 0, 13, 17); blob(-24, 7, 5, 4.5, -0.65); blob(22, -4, 3, 1.4); blob(-14, -12, 0.9, 0.9);
  W.AL = AL; W.LA = LA; W.TF = TF; W.PC = PC;

  // ---------------------------------------------------------------- réseau électrique (couche)
  const elec = new THREE.Group(); elec.visible = false; AL.group.add(elec);
  const XM = (col, o = 0.95) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: o, depthTest: false, depthWrite: false });
  const node = (name, p, col) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), XM(col)); m.position.copy(p); m.renderOrder = 20; elec.add(m); return m; };
  const EN = {
    gen1: [V(-5.75, -3.4, -2.6), 0x5fd6ff], gen2: [V(5.75, -3.4, -2.6), 0x5fd6ff], apu: [V(0, 1.3, 17.6), 0x5fd6ff], rat: [V(1.0, -2.9, -2.0), 0xffc35c],
    ac1: [V(-0.9, -0.9, -8.6), 0x9aa3ae], ac2: [V(0.9, -0.9, -10.8), 0x9aa3ae], ess: [V(0, 0.4, -12.8), 0x9aa3ae], bat: [V(0, -1.3, -14.6), 0x62e3a0], gpu: [V(-2.6, -4.3, -17.5), 0x9aa3ae],
  };
  for (const k in EN) AL.anchors['e_' + k] = EN[k][0].clone().add(V(0, 0.45, 0));
  const nodes = {}; for (const k in EN) nodes[k] = node(k, EN[k][0], EN[k][1]);
  const links = [['gen1', 'ac1'], ['gen2', 'ac2'], ['ac1', 'ac2'], ['apu', 'ac2'], ['ac1', 'ess'], ['rat', 'ess'], ['bat', 'ess'], ['gpu', 'ac1']];
  const wires = links.map(([a, b]) => {
    const pa = EN[a][0], pb = EN[b][0], mid = pa.clone().add(pb).multiplyScalar(0.5); mid.y -= 0.6;
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.07, 6), XM(0x5fd6ff, 0.9)); m.renderOrder = 19;
    elec.add(m); return { a, b, m, curve, on: true };
  });
  const sparks = Array.from({ length: 40 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), XM(0xffffff, 1)); s.renderOrder = 21; elec.add(s); return { s, w: wires[i % wires.length], t: Math.random() }; });
  W.elecSet = (st) => { // st : { gen1, gen2, apu, rat, bat, gpu, ac1, ac2, ess, tie: bool } → éclaire les fils sous tension
    for (const k in nodes) nodes[k].material.color.setHex(st[k] ? (k === 'rat' ? 0xffc35c : k === 'bat' ? 0x62e3a0 : 0x5fd6ff) : 0x3a414c);
    for (const w of wires) { w.on = !!(st[w.a] && st[w.b]) && (w.a !== 'ac1' || w.b !== 'ac2' || st.tie); w.m.material.color.setHex(w.on ? 0x5fd6ff : 0x2a3038); w.m.material.opacity = w.on ? 0.95 : 0.5; }
  };
  W.elecSet({ gen1: 1, gen2: 1, apu: 0, rat: 0, bat: 1, gpu: 0, ac1: 1, ac2: 1, ess: 1, tie: 0 });
  W.tick.push((dt) => { if (!elec.visible) return; for (const p of sparks) { p.t = (p.t + dt * 0.45) % 1; p.s.visible = p.w.on; if (p.w.on) p.s.position.copy(p.w.curve.getPointAt(p.t)); } });
  W.layers = { elec };

  // ---------------------------------------------------------------- étiquettes
  const labels = new THREE.Group(); scene.add(labels);
  const anchorOf = (name) => {
    for (const M of [AL, LA, TF, PC]) if (M.anchors[name]) return M.group.localToWorld(M.anchors[name].clone());
    return null;
  };
  W.anchorOf = anchorOf;
  W.setLabels = (list) => {
    while (labels.children.length) { const c = labels.children.pop(); c.material.map.dispose(); c.material.dispose(); }
    for (const [anchor, text, col, below] of list || []) {
      const p = typeof anchor === 'string' ? anchorOf(anchor) : anchor; if (!p) continue;
      const s = makeLabel(text, { border: col || 'rgba(255,195,92,0.6)' }); s.position.copy(p); if (below) s.center.set(0.5, 1); labels.add(s);
    }
  };

  // ---------------------------------------------------------------- surbrillance
  const hlState = { meshes: [], t: 0 };
  W.highlight = (names, color = 0xffb03a) => {
    for (const m of hlState.meshes) { m.material = m.userData.mat0; }
    hlState.meshes = [];
    for (const n of names || []) for (const o of W.parts[n] || []) o.traverse((m) => {
      if (!m.isMesh || !m.material || m.material.isMeshBasicMaterial) return;
      m.userData.mat0 = m.material; m.material = m.material.clone(); m.material.emissive = new THREE.Color(color); hlState.meshes.push(m);
    });
  };
  W.tick.push((dt, t) => { const k = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 4)); for (const m of hlState.meshes) m.material.emissiveIntensity = k; });

  // ---------------------------------------------------------------- commandes des animations
  const S = AL.anim.surfaces;
  const sm = { ail: 0, elev: 0, rud: 0, flap: 0, slat: 0, spl: 0, gspl: 0 };
  const st = { gear: 1, gearT: 1, gearAuto: false, surf: { ail: 0, elev: 0, rud: 0, flap: 0, slat: 0, spl: 0 }, surfAuto: false, rev: 0, revT: 0, fan: 0, rat: 0, ratT: 0, ratSpin: 1, xray: 0, xrayT: 0, tanks: 0, ice: 0, cowl: 0, cowlT: 0, cowlFlaps: 0, prop: { rpm: 0, pitch: 18, pitchT: 18 }, tf: { spin: 0, flame: 0, flow: 0 }, piston: { speed: 0 } };
  W.st = st;
  W.setGear = (k) => { st.gearT = k; st.gearAuto = false; };
  W.gearAuto = (on) => { st.gearAuto = on; };
  W.setSurf = (o) => { Object.assign(st.surf, o); st.surfAuto = false; };
  W.surfAuto = (on) => { st.surfAuto = on; };
  W.setReverser = (k) => { st.revT = k; };
  W.setFan = (v) => { st.fan = v; };
  W.setRat = (k, spin = 1) => { st.ratT = k; st.ratSpin = spin; };
  W.setTanks = (k) => { st.tanks = k; for (const t of [S.tankR, S.tankL, S.tankC, ...(S.tankT || [])]) t.visible = !!k; };
  W.setTankLevels = (o) => { const f = (m, v) => { if (!m) return; m.material.opacity = 0.12 + 0.6 * v; m.material.color.setHex(v < 0.15 ? 0xff6a4d : 0x3aa0ff); }; f(S.tankL, o.L); f(S.tankR, o.R); f(S.tankC, o.C); (S.tankT || []).forEach((m) => f(m, o.T ?? 0.5)); };
  W.setIce = (k) => { st.ice = k; };
  W.setCowl = (k) => { st.cowlT = k; };
  W.setCowlFlaps = (k) => { st.cowlFlaps = k; };
  W.setOutflow = (k) => { AL.anim.outflow.rotation.y = -0.08 - k * 0.9; };
  // feu moteur 2 (flammes animées) et vérins de levage sous l'avion
  const fireG = new THREE.Group(); fireG.visible = false; AL.anim.engines[1].add(fireG);
  const fireT = canvasTex(64, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h * 0.75, 2, w / 2, h * 0.6, h * 0.55); gr.addColorStop(0, 'rgba(255,250,200,1)'); gr.addColorStop(0.35, 'rgba(255,150,40,0.9)'); gr.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const flames = Array.from({ length: 7 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: fireT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.position.set((i - 3) * 0.18, 0.9, 0.2 + (i % 3) * 0.35); s.scale.set(0.7, 1.4, 1); fireG.add(s); return s; });
  const smoke = new THREE.PointLight(0xff7a2a, 0, 12); smoke.position.set(0, 1.2, 0.5); fireG.add(smoke);
  W.setEngineFire = (on) => { fireG.visible = !!on; smoke.intensity = on ? 4 : 0; };
  W.tick.push((dt, t) => { if (!fireG.visible) return; flames.forEach((f, i) => { const k = 0.75 + 0.35 * Math.sin(t * (9 + i) + i * 1.7); f.scale.set(0.6 * k, 1.5 * k, 1); f.position.y = 0.9 + 0.15 * Math.sin(t * 6 + i); }); smoke.intensity = 3 + Math.sin(t * 17) * 1.2; });
  const jacks = new THREE.Group(); jacks.visible = false; scene.add(jacks);
  const jm = new THREE.MeshPhongMaterial({ color: 0xe9b824 }), jd = new THREE.MeshPhongMaterial({ color: 0x2f3540 });
  for (const [x, top, z] of [[-6.8, 3.55, 1.6], [6.8, 3.55, 1.6], [0, 2.62, -12.4]]) {
    const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, top - 0.9, 10), jm); ram.position.set(x, 0.9 + (top - 0.9) / 2, z); jacks.add(ram);
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2, leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 6), jd); leg.position.set(x + Math.cos(a) * 0.45, 0.55, z + Math.sin(a) * 0.45); leg.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45); jacks.add(leg); }
  }
  W.setJacks = (on) => { jacks.visible = !!on; };
  W.setProp = (rpm, pitch) => { st.prop.rpm = rpm; if (pitch !== undefined) st.prop.pitchT = pitch; };
  W.setTF = (o) => Object.assign(st.tf, o);
  W.setPistonSpeed = (v) => { st.piston.speed = v; };
  W.setPiston = (o) => { if (o.speed !== undefined) st.piston.speed = o.speed; if (o.deg !== undefined) { PC.anim.deg = o.deg; PC.anim.set(o.deg); } };
  W.setMarker = (z) => { const mk = TF.anim.marker; if (z === null || z === undefined) { mk.visible = false; return; } mk.visible = true; mk.position.set(0, 0, z); const r = z < -1.4 ? 1.42 : z < 1.6 ? 0.72 : 0.68; mk.scale.setScalar(r / 1.42); };
  W.setFire = (on) => { for (const e of AL.anim.engines) e.userData.loops.visible = !!on; };
  W.setBattery = (on) => { AL.anim.battery.visible = !!on; };
  W.setElec = (on) => { elec.visible = !!on; };

  W.tick.push((dt, t) => {
    // train
    if (st.gearAuto) st.gearT = (Math.sin(t * 0.55) > 0) ? 1 : 0;
    st.gear += Math.sign(st.gearT - st.gear) * Math.min(Math.abs(st.gearT - st.gear), dt * 0.32);
    for (const gg of AL.anim.gear) { const k = 1 - st.gear, a = gg.dir * gg.max * (gg.nose ? Math.min(1, k * 1.15) : Math.min(1, Math.max(0, k * 1.2 - 0.05))); if (gg.axis === 'z') gg.piv.rotation.z = a; else gg.piv.rotation.x = a; }
    // gouvernes
    const sf = st.surf;
    const k8 = Math.min(1, dt * 8), k3 = Math.min(1, dt * 2.5);
    if (st.surfAuto) { const s1 = Math.sin(t * 1.1), s2 = Math.sin(t * 0.7 + 1), s3 = Math.sin(t * 0.5 + 2); sf.ail = s1 * 18; sf.elev = s2 * 14; sf.rud = s3 * 16; sf.spl = s1 * 25; sf.flap = (0.5 + 0.5 * Math.sin(t * 0.25)) * 30; sf.slat = sf.flap / 30; }
    // conventions : ail > 0 = roulis à droite, elev > 0 = cabrer, rud > 0 = lacet à droite, flap en degrés, slat 0-1,
    // spl = spoilers de roulis (> 0 : côté droit), gspl = spoilers sol / aérofreins (tous)
    const rot = (p, deg) => { if (p) p.userData.inner.rotation.x = deg * DEG; };
    sm.ail = lerp(sm.ail, sf.ail, k8); sm.elev = lerp(sm.elev, sf.elev, k8); sm.rud = lerp(sm.rud, sf.rud, k8); sm.flap = lerp(sm.flap, sf.flap, k3); sm.slat = lerp(sm.slat, sf.slat, k3); sm.spl = lerp(sm.spl, sf.spl, k8); sm.gspl = lerp(sm.gspl, sf.gspl || 0, k3);
    rot(S.ailR, -sm.ail); rot(S.ailL, sm.ail);
    for (const p of S.elev) rot(p, -sm.elev);
    rot(S.rudder, sm.rud);
    for (const p of [...S.flapR, ...S.flapL]) rot(p, sm.flap);
    S.splR.forEach((p, i) => rot(p, -Math.max(i >= 1 ? Math.max(0, sm.spl) : 0, sm.gspl)));
    S.splL.forEach((p, i) => rot(p, -Math.max(i >= 1 ? Math.max(0, -sm.spl) : 0, sm.gspl)));
    for (const sl of [...S.slatR, ...S.slatL]) { sl.position.set(0, -0.22 * sm.slat, -0.38 * sm.slat); }
    // inverseurs
    st.rev = lerp(st.rev, st.revT, Math.min(1, dt * 2)); for (const r of AL.anim.reversers) r.position.z = st.rev * 0.85;
    // soufflantes
    for (const f of AL.anim.fans) f.rotation.z += dt * st.fan * 40;
    // RAT
    st.rat = lerp(st.rat, st.ratT, Math.min(1, dt * 2)); const R = AL.anim.rat; R.rat.visible = st.rat > 0.02; R.rat.rotation.x = (-Math.PI / 2 + 0.05) * (1 - st.rat); R.hub.rotation.z += dt * 25 * st.rat * st.ratSpin;
    // pièces fantômes (transparentes)
    st.xray = lerp(st.xray, st.xrayT, Math.min(1, dt * 2.5)); ghostMat.opacity = lerp(1, 0.16, st.xray); ghostMat.depthWrite = st.xray < 0.5;
    // antigivrage
    for (const z of [S.antiiceR, S.antiiceL]) { z.material.opacity = st.ice * (0.55 + 0.25 * Math.sin(t * 5)); z.material.emissive.setHex(0xff6a20); z.material.emissiveIntensity = st.ice; z.visible = st.ice > 0.01; }
    // avion léger : capots, hélice
    st.cowl = lerp(st.cowl, st.cowlT, Math.min(1, dt * 2.2)); LA.anim.cowl.position.y = st.cowl * 0.8; LA.anim.cowlB.position.y = -st.cowl * 0.3;
    for (const c of [LA.anim.cowl, LA.anim.cowlB]) c.traverse((m) => { if (m.isMesh) { const tr = st.cowl > 0.02; if (m.material.transparent !== tr) { m.material.transparent = tr; m.material.needsUpdate = true; } m.material.opacity = 1 - 0.72 * st.cowl; m.material.depthWrite = !tr; } });
    for (const f of LA.anim.cowlFlaps) f.rotation.x = st.cowlFlaps * 0.55;
    const pr = LA.anim.prop; pr.prop.rotation.z += dt * st.prop.rpm / 60 * Math.PI * 2 * 0.06; st.prop.pitch = lerp(st.prop.pitch, st.prop.pitchT, Math.min(1, dt * 3)); for (const b of pr.blades) b.rotation.y = st.prop.pitch * DEG;
    // réacteur en coupe
    const tf = TF.anim; tf.lp.rotation.z += dt * st.tf.spin * 9; tf.hp.rotation.z += dt * st.tf.spin * 15;
    tf.flame.material.opacity = st.tf.flame * (0.55 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7)); TF.mats.comb.emissiveIntensity = 0.3 + st.tf.flame * 1.6;
    updateFlow(dt);
    // cylindre en coupe
    if (st.piston.speed) { PC.anim.deg = (PC.anim.deg + dt * st.piston.speed) % 720; PC.anim.set(PC.anim.deg); }
  });
  // pièces fantômes : on remplace leur matière par une matière transparente commune
  const ghostMat = new THREE.MeshPhongMaterial({ color: 0xdfe6ef, transparent: true, opacity: 1, shininess: 60, side: THREE.DoubleSide });
  let ghosted = [];
  W.ghost = (names) => {
    for (const m of ghosted) m.material = m.userData.gmat0; ghosted = [];
    for (const n of names || []) for (const o of W.parts[n] || []) o.traverse((m) => { if (m.isMesh && !m.material.isMeshBasicMaterial) { m.userData.gmat0 = m.material; m.material = ghostMat; ghosted.push(m); } });
    st.xray = 0; st.xrayT = names && names.length ? 1 : 0;
  };
  W.showStruct = (on) => { S.structR.visible = S.structL.visible = !!on; };

  // flux d'air dans le réacteur en coupe
  const fl = TF.anim.flow, cCold = new THREE.Color(0x7fd6ff), cComp = new THREE.Color(0x5fa8ff), cHot = new THREE.Color(0xff7a2a), cExh = new THREE.Color(0xd04a8a);
  function updateFlow(dt) {
    fl.flow.visible = st.tf.flow > 0;
    if (!fl.flow.visible) return;
    for (let i = 0; i < fl.seeds.length; i++) {
      const p = fl.seeds[i]; p.s += dt * 0.22 * st.tf.flow * (p.core ? 0.8 : 1.15); if (p.s > 1) { p.s = 0; p.a = Math.random() * Math.PI * 2; }
      const z = -3.2 + p.s * 7.0;
      let r, c;
      if (p.core) {
        if (z < -2.2) { r = lerp(0.35, 0.9, p.r); c = cCold; }
        else if (z < -1.4) { r = lerp(0.36, 0.62, p.r) * lerp(1, 0.95, (z + 2.2) / 0.8); c = cCold; }
        else if (z < 0.4) { const k = (z + 1.4) / 1.8; r = lerp(0.3, lerp(0.56, 0.4, k), p.r); c = cComp.clone().lerp(cHot, k * 0.35); }
        else if (z < 1.35) { r = lerp(0.38, 0.48, p.r); c = cHot; }
        else if (z < 2.7) { r = lerp(0.32, 0.55, p.r); c = cHot.clone().lerp(cExh, (z - 1.35) / 1.35); }
        else { r = lerp(0.1, 0.45, p.r) * Math.max(0.3, 1 - (z - 2.7) * 0.35); c = cExh; }
      } else {
        if (z < -2.2) { r = lerp(0.35, 1.15, p.r); } else if (z < 1.4) { r = lerp(0.72, 1.12, p.r) - Math.max(0, z - 0.2) * 0.06; } else { r = lerp(0.62, 1.0, p.r) - (z - 1.4) * 0.12; }
        c = cCold;
      }
      fl.arr[i * 3] = Math.cos(p.a) * r; fl.arr[i * 3 + 1] = Math.sin(p.a) * r; fl.arr[i * 3 + 2] = z;
      fl.col[i * 3] = c.r; fl.col[i * 3 + 1] = c.g; fl.col[i * 3 + 2] = c.b;
    }
    fl.flow.geometry.attributes.position.needsUpdate = true; fl.flow.geometry.attributes.color.needsUpdate = true;
  }

  // ---------------------------------------------------------------- caméra
  let fly = null;
  W.camTo = (pos, target, dur = 1.6) => { fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: target.clone(), s: performance.now(), dur }; controls.enabled = false; };
  W.isFlying = () => !!fly;
  camera.position.set(-38, 22, 44); controls.target.set(0, 3, 0);

  // ---------------------------------------------------------------- sélection d'une pièce (clic)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  W.pick = (x, y) => {
    ndc.set(x / W.size.w * 2 - 1, -(y / W.size.h) * 2 + 1); ray.setFromCamera(ndc, camera);
    const objs = []; scene.traverseVisible((o) => { if (o.isMesh && o.userData.part) objs.push(o); });
    const hits = ray.intersectObjects(objs, false);
    for (const h of hits) { if (clip[0].distanceToPoint(h.point) < 0 && TF.group.getObjectById(h.object.id)) continue; return { part: h.object.userData.part, point: h.point }; }
    return null;
  };

  // ---------------------------------------------------------------- boucle
  const clock = { last: performance.now(), t: 0 };
  W.size = { w: 1, h: 1 };
  W.resize = (w, h, offX = 0, offY = 0) => { W.size = { w, h }; renderer.setSize(w, h, false); camera.aspect = w / h; camera.setViewOffset(w, h, offX, offY, w, h); camera.updateProjectionMatrix(); };
  const _v = new THREE.Vector3();
  W.frame = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - clock.last) / 1000); clock.last = now; clock.t += dt;
    if (fly) {
      const k = Math.min(1, (now - fly.s) / 1000 / fly.dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.lerpVectors(fly.p0, fly.p1, e); controls.target.lerpVectors(fly.t0, fly.t1, e); camera.lookAt(controls.target);
      if (k >= 1) { fly = null; controls.enabled = true; }
    } else controls.update();
    for (const f of W.tick) f(dt, clock.t);
    const lk = W.size.w < 520 ? 0.74 : W.size.h < 600 ? 1.1 : 1;
    labels.children.forEach((o) => { const d = camera.position.distanceTo(o.getWorldPosition(_v)); const k = d * Math.tan(camera.fov * DEG / 2) * 2 / W.size.h * o.userData.px * lk; o.scale.set(k * o.userData.ar, k, 1); });
    renderer.render(scene, camera);
  };
  return W;
}
