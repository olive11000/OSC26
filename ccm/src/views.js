// Vues 3D : une par mission (caméra, étiquettes, surbrillances, animations), plus l'accueil.
import * as THREE from 'three';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const A = (x, y, z) => V(x, y + 4.65, z); // repère avion de ligne → monde
function wpos(W, M, x, y, z) { W[M].group.updateMatrixWorld(true); return W[M].group.localToWorld(V(x, y, z)); }
const OR = 'rgba(255,195,92,0.7)', CY = 'rgba(95,214,255,0.7)', GR = 'rgba(98,227,160,0.7)', RD = 'rgba(255,106,77,0.8)', PK = 'rgba(255,111,200,0.7)', VI = 'rgba(180,140,255,0.75)';

export const VIEWS = {
  home: { pos: V(-40, 24, 46), tgt: V(0, 3, -2), auto: true, setup: (W) => { W.setFan(0.25); W.setTF({ spin: 0.2 }); W.setPiston({ speed: 90 }); W.setProp(600); } },
  conception: { pos: V(-24, 16, 26), tgt: A(0, -1, 4), hl: ['mat'],
    labels: [[A(-2.6, -1.0, -0.2), 'Emplanture d’aile', OR], ['mat', 'Mât réacteur', OR], [A(-3.8, -1.8, 0.9), 'Attaches du train', OR], [A(0, 2.2, -7), 'Jonctions du fuselage', OR], [A(-4.6, 1.7, 16.6), 'Attaches des gouvernes', OR]],
    setup: (W) => { W.setFan(0.15); } },
  structure: { pos: V(20, 15, 12), tgt: A(9, -0.6, 2.4), ghost: ['aile', 'volets', 'ailerons', 'spoilers', 'becs'],
    labels: [['longeron', 'Longerons', OR], ['nervure', 'Nervures', CY], ['lisse', 'Lisses', GR], [A(13.5, -0.1, 4.3), 'Caisson de torsion\n= longerons + nervures + peau', 'rgba(255,255,255,0.5)']],
    setup: (W) => { W.showStruct(true); } },
  feu: { pos: V(13, 4.6, -9.5), tgt: A(5.75, -2.3, -2.2), ghost: ['nacelle', 'inverseur'], hl: ['boucles'],
    labels: [['boucles', 'Boucles de détection A et B', RD], [A(5.75, -3.8, -4.2), 'Extinction : 2 décharges par moteur', OR]],
    setup: (W) => { W.setFire(true); W.setFan(0.2); } },
  hydraulique: { pos: V(7, 1.2, -12), tgt: A(1.0, -2.8, -2.2), hl: ['rat'],
    labels: [['rat', 'RAT : dépend de la vitesse', OR], ['train', 'Vérins du train', CY], [A(-1.5, -2.4, -2.5), 'PTU : transfère la puissance, pas le liquide', GR]],
    setup: (W) => { W.setRat(1); W.setFan(0.15); } },
  train: { pos: V(13.5, 2.4, 10), tgt: A(3.2, -3.0, -1.5), hl: [],
    labels: [['train', 'Amortisseur oléopneumatique\n(huile + azote)', OR], [A(3.75, -1.3, 0.9), 'Verrou bas : au-delà du point mort', CY], ['trainAvant', 'Train avant : centrage avant rentrée', GR]],
    setup: (W) => { W.gearAuto(true); W.setJacks(true); } },
  commandes: { pos: V(21, 15, 30), tgt: A(3, -0.5, 6), labels: [['ailerons', 'Ailerons', OR], ['volets', 'Volets', CY], ['spoilers', 'Spoilers', GR], ['becs', 'Becs', CY], ['profondeur', 'Profondeur', OR], ['direction', 'Direction', OR]],
    setup: (W) => { W.surfAuto(true); } },
  pressu: { pos: V(13, 3.2, 17), tgt: A(1.5, -1.2, 6), hl: ['outflow', 'packs'],
    labels: [['outflow', 'Vanne de décharge (outflow)', OR], ['packs', 'Entrées d’air des packs', CY], ['apu', 'APU : air au sol', GR]],
    setup: (W) => { W.setFan(0.3); } },
  oxygivre: { pos: V(15, 9, -26), tgt: A(2, -0.5, -9), hl: ['entree', 'parebrise', 'sondes', 'detecteur'],
    labels: [['antigivrage', 'Bord d’attaque : air chaud', OR], ['entree', 'Lèvre d’entrée d’air chauffée', OR], ['parebrise', 'Pare-brise chauffant', CY], ['sondes', 'Sondes chauffées', CY], ['detecteur', 'Détecteur de givre', GR]],
    setup: (W) => { W.setIce(1); W.setFan(0.3); } },
  carburant: { pos: V(-15, 36, 24), tgt: A(0, -1, 5), ghost: ['aile', 'volets', 'ailerons', 'spoilers', 'becs', 'empennage', 'profondeur', 'fuselage', 'carenage'],
    labels: [['reservoirs', 'Réservoirs d’aile', CY], [A(0, -0.6, 0.2), 'Réservoir central', CY], [A(3.5, 1.5, 15.5), 'Réservoir de trim (centrage)', GR]],
    setup: (W) => { W.setTanks(1); W.setTankLevels({ L: 0.8, R: 0.8, C: 0.5, T: 0.4 }); } },
  elecbase: { pos: V(22, 10, 18), tgt: A(12, -0.3, 6), hl: ['wicks'],
    labels: [['wicks', 'Déperditeurs statiques\n(bords de fuite)', CY]],
    setup: (W) => {} },
  protections: { pos: V(-9, 5.2, -24), tgt: A(0, -0.6, -14), ghost: ['fuselage', 'parebrise'],
    labels: [['batterie', 'Batterie et baie avionique\n(disjoncteurs, calculateurs)', CY]],
    setup: (W) => { W.setBattery(true); W.setElec(true); W.elecSet({ gen1: 1, gen2: 1, apu: 0, rat: 0, bat: 1, gpu: 0, ac1: 1, ac2: 1, ess: 1, tie: 0 }); } },
  generation: { pos: V(20, 3.5, 9), tgt: A(3, -2, 0), hl: ['idg', 'apu'],
    labels: [['idg', 'IDG = CSD + alternateur', CY], ['apu', 'Génératrice APU', CY], ['batterie', 'Batterie', GR], ['rat', 'RAT', OR]],
    setup: (W) => { W.setBattery(true); W.setRat(0.6); W.setFan(0.4); } },
  distribution: { pos: V(-24, 11, -21), tgt: A(-0.5, -1, -9), ghost: ['fuselage', 'carenage', 'parebrise', 'portes'],
    labels: [['e_gen1', 'GEN 1', CY], ['e_gen2', 'GEN 2', CY], ['e_apu', 'APU GEN', CY], ['e_ac1', 'AC BUS 1', 'rgba(255,255,255,0.5)'], ['e_ac2', 'AC BUS 2', 'rgba(255,255,255,0.5)'], ['e_ess', 'ESS BUS', OR], ['e_bat', 'BAT', GR], ['e_rat', 'RAT', OR], ['e_gpu', 'GPU (groupe de parc)', 'rgba(255,255,255,0.5)']],
    setup: (W) => { W.setElec(true); W.setBattery(true); W.setRat(1); W.setFan(0.4); } },
  quatretemps: { pos: V(-9.6, 3.6, -5.8), tgt: V(-14, 2.6, -12), labels: [['p_soupapes', 'Soupapes', CY], ['p_bougie', 'Bougie', OR], ['p_piston', 'Piston + segments', 'rgba(255,255,255,0.5)'], ['p_bielle', 'Bielle', OR], ['p_vilebrequin', 'Vilebrequin', GR], ['p_cames', 'Arbre à cames (½ vitesse)', VI]],
    setup: (W) => { W.setPiston({ speed: 150 }); } },
  carbu: { pos: (W) => wpos(W, 'LA', 2.9, 0.2, -3.6), tgt: (W) => wpos(W, 'LA', 0, -0.25, -2.4), hl: ['carburateur'],
    labels: [['carburateur', 'Carburateur (venturi)', OR], [(W) => wpos(W, 'LA', -0.4, -0.75, -2.9), 'Prise d’air', CY]],
    setup: (W) => { W.setCowl(1); W.setProp(700); } },
  melange: { pos: (W) => wpos(W, 'LA', -2.7, 1.4, -3.6), tgt: (W) => wpos(W, 'LA', 0, -0.15, -2.3), hl: ['magnetos', 'echappement', 'cowlflaps'],
    labels: [['magnetos', '2 magnétos', VI], ['cylindres', 'Cylindres à ailettes (CHT)', OR], ['echappement', 'Échappement (EGT)', RD], ['cowlflaps', 'Volets de capot', CY]],
    setup: (W) => { W.setCowl(1); W.setCowlFlaps(1); W.setProp(900); } },
  helice: { pos: (W) => wpos(W, 'LA', 2.2, 1.0, -8.2), tgt: (W) => wpos(W, 'LA', 0, 0.1, -3.2), hl: ['regulateur'],
    labels: [['helice', 'Hélice à vitesse constante', OR], ['regulateur', 'Régulateur à masselottes', VI]],
    setup: (W) => { W.setProp(2400, 18); } },
  reacteur: { pos: V(22, 3.6, 7.6), tgt: V(22, 2.4, -4), labels: [['f_fan', 'Soufflante', CY], ['f_lpc', 'Compresseur BP', CY, 1], ['f_hpc', 'Compresseur HP', CY], ['f_chambre', 'Chambre', OR, 1], ['f_hpt', 'Turbine HP', RD], ['f_lpt', 'Turbine BP', PK, 1], ['f_tuyere', 'Tuyère', 'rgba(255,255,255,0.5)'], ['f_froid', 'Flux froid (secondaire)', CY]],
    setup: (W) => { W.setTF({ spin: 1, flame: 1, flow: 1 }); } },
  demarrage: { pos: V(26, 2.2, 7), tgt: V(22, 1.6, -4), hl: ['f_agb', 'f_demarreur', 'f_allumeurs'],
    labels: [['f_agb', 'Boîtier d’accessoires (corps HP)', VI], ['f_demarreur', 'Démarreur pneumatique', GR, 1], ['f_allumeurs', 'Allumeurs (×2)', OR], ['f_idg', 'IDG', CY, 1], ['f_arbres', 'Arbres BP / HP', 'rgba(255,255,255,0.5)']],
    setup: (W) => { W.setTF({ spin: 0.35, flame: 0.4, flow: 0.4 }); } },
  perfs: { pos: V(-13, 7.5, 33), tgt: A(0, 0.2, 14), hl: ['apu'],
    labels: [['apu', 'APU : démarrage ≤ FL250-300\nutilisation ≤ FL350-410', OR], ['nacelle', 'Prélèvement d’air : poussée ↓, EGT ↑', CY]],
    setup: (W) => { W.setFan(0.6); } },
};

export function applyView(W, name) {
  const v = VIEWS[name] || VIEWS.home;
  // remise à zéro
  W.highlight([]); W.ghost([]); W.showStruct(false);
  W.gearAuto(false); W.setGear(1); W.surfAuto(false); W.setSurf({ ail: 0, elev: 0, rud: 0, flap: 0, slat: 0, spl: 0, gspl: 0 });
  W.setReverser(0); W.setFan(0.12); W.setRat(0); W.setTanks(0); W.setIce(0); W.setCowl(0); W.setProp(0, 18);
  W.setTF({ spin: 0.15, flame: 0, flow: 0 }); W.setPiston({ speed: 0 }); W.setMarker(null); W.setFire(false); W.setBattery(false); W.setElec(false);
  W.setEngineFire(false); W.setJacks(false); W.setOutflow(0.3); W.setCowlFlaps(0);
  // vue
  W.ghost(v.ghost || []); W.highlight(v.hl || []);
  const res = (x) => (typeof x === 'function' ? x(W) : x);
  W.setLabels((v.labels || []).map(([a, t, c, b]) => [typeof a === 'function' ? a(W) : a, t, c, b]));
  v.setup && v.setup(W);
  // écran en portrait : on recule la caméra pour garder le sujet entier
  const tgt = res(v.tgt), pos = res(v.pos), port = W.size.w < W.size.h ? 1.9 : W.size.w < 1100 ? 1.2 : 1;
  W.camTo(tgt.clone().add(pos.clone().sub(tgt).multiplyScalar(port)), tgt, 1.7);
  W.controls.autoRotate = !!v.auto; W.controls.autoRotateSpeed = 0.35;
}
