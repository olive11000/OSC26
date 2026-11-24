// Le monde 3D : une base aérienne fictive (piste 34/16), ses espaces aériens, un VOR, la mer.
// 1 unité = 100 m à l'horizontale ; les hauteurs sont exagérées ×2,5 pour être lisibles.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const VEX = 2.5;
export const ft = (f) => f * 0.3048 / 100 * VEX;
export const km = (k) => k * 10;
export const NM = (n) => n * 18.52;
export const DEG = Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// Repères : x = est, -z = nord. Cap c (degrés) -> vecteur unitaire
export const dirOf = (c) => new THREE.Vector3(Math.sin(c * DEG), 0, -Math.cos(c * DEG));
export const RWY_HDG = 340;                      // QFU 34
const RW = dirOf(RWY_HDG), RN = new THREE.Vector3(-RW.z, 0, RW.x); // RN = à droite de l'axe
export const THR34 = RW.clone().multiplyScalar(-15);   // seuil 34 (sud)
export const THR16 = RW.clone().multiplyScalar(15);    // seuil 16 (nord) = fin de piste 34
export const VOR = THR34.clone().addScaledVector(RW, -NM(11));   // VOR « PRO » dans l'axe, 11 NM
export const ALT_HOLD = ft(5000);

// ---------------------------------------------------------------- bruit
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
}
function fbm(x, y, o = 5) { let a = 0.5, s = 0, n = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x, y); n += a; x *= 2.03; y *= 2.03; a *= 0.5; } return s / n; }
export function terrainH(x, z) {
  const hills = ft(900) * Math.pow(fbm(x * 0.006 + 3, z * 0.006 + 7), 2.2) * 2.2;
  const ridge = ft(10500) * smooth(-260, -560, z) * Math.pow(fbm(x * 0.004 + 11, z * 0.004 + 2, 6), 1.6) * 1.5;
  let h = hills + ridge;
  // plaine de l'aérodrome
  const dA = Math.hypot(x, z);
  h *= smooth(28, 70, dA);
  // côte au sud
  const coast = 420 + 60 * Math.sin(x * 0.006) + 30 * fbm(x * 0.02, 1);
  h = h * (1 - smooth(coast - 40, coast, z)) - ft(500) * smooth(coast - 10, coast + 40, z);
  return h;
}

// ---------------------------------------------------------------- textures utilitaires
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
export function glowTex(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  return canvasTex(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, inner); gr.addColorStop(0.22, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  });
}
export function makeLabel(text, opt = {}) {
  const fs = 44, pad = 16;
  const font = `${opt.bold === false ? 500 : 700} ${fs}px -apple-system, "Segoe UI", Roboto, sans-serif`;
  const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font;
  const lines = String(text).split('\n');
  const w = Math.ceil(Math.max(...lines.map((l) => g.measureText(l).width))) + pad * 2, h = Math.ceil(lines.length * fs * 1.2 + pad * 1.2);
  c.width = w; c.height = h; g.font = font;
  if (opt.bg !== false) {
    g.fillStyle = opt.bg || 'rgba(8,12,22,0.78)'; const r = 14;
    g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.fill();
    if (opt.border) { g.strokeStyle = opt.border; g.lineWidth = 4; g.stroke(); }
  }
  g.fillStyle = opt.color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => g.fillText(l, w / 2, pad * 0.6 + fs * 0.6 + i * fs * 1.2));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: opt.depthTest === true }));
  const H = opt.h || 1; sp.userData = { h: H, ar: w / h, px: opt.px || 26 }; sp.scale.set(H * w / h, H, 1); sp.renderOrder = 20;
  return sp;
}

// ---------------------------------------------------------------- modèles
const M = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
export function makePlane(opt = {}) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const white = M(opt.color || 0xf2f4f8), stripe = M(opt.stripe || 0x2a62d8), dark = M(0x222833);
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 1.0, 6, 12), white); fus.rotation.x = Math.PI / 2; body.add(fus);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.7, 12, 1, true), stripe); band.rotation.x = Math.PI / 2; band.position.z = 0.05; body.add(band);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark); glass.scale.set(0.9, 0.7, 1.4); glass.position.set(0, 0.07, -0.38); body.add(glass);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 0.26), white); wing.position.set(0, -0.02, -0.02); body.add(wing);
  const hs = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.025, 0.15), white); hs.position.set(0, 0.02, 0.56); body.add(hs);
  const vs = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.26, 0.2), stripe); vs.position.set(0, 0.15, 0.56); body.add(vs);
  const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.08, 10), dark); prop.rotation.x = Math.PI / 2; prop.position.z = -0.66; body.add(prop);
  // feux de navigation : rouge à gauche, vert à droite, blanc à l'arrière
  const lights = {};
  const L = (col, x, y, z, name) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: col }));
    m.position.set(x, y, z); body.add(m);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: col, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.scale.set(0.5, 0.5, 1); s.position.copy(m.position); body.add(s); lights[name] = s;
  };
  L(0xff2a2a, -0.76, -0.01, -0.02, 'red'); L(0x2aff6a, 0.76, -0.01, -0.02, 'green'); L(0xffffff, 0, 0.06, 0.72, 'white');
  g.userData.lights = lights; g.userData.body = body;
  const s = opt.scale || 1; g.scale.setScalar(s);
  return g;
}
export function makeFighter() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const grey = M(0x8a94a3), dark = M(0x39414d);
  const fus = new THREE.Mesh(new THREE.ConeGeometry(0.1, 1.6, 12), grey); fus.rotation.x = -Math.PI / 2; fus.position.z = -0.1; body.add(fus);
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.5, 12), grey); tail.rotation.x = Math.PI / 2; tail.position.z = 0.75; body.add(tail);
  const sh = new THREE.Shape(); sh.moveTo(0, -0.25); sh.lineTo(0.72, 0.62); sh.lineTo(-0.72, 0.62); sh.lineTo(0, -0.25);
  const wing = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.025, bevelEnabled: false }), grey); wing.rotation.x = Math.PI / 2; wing.position.set(0, 0, 0.18); body.add(wing);
  const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.45, 0); fin.lineTo(0.4, 0.38); fin.lineTo(0.25, 0.38);
  const f = new THREE.Mesh(new THREE.ExtrudeGeometry(fin, { depth: 0.02, bevelEnabled: false }), grey); f.rotation.y = -Math.PI / 2; f.position.set(0.01, 0.05, 0.55); body.add(f);
  const can = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.015, 0.1), grey); can.position.set(0, 0.03, -0.45); body.add(can);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), dark); glass.scale.set(0.8, 0.8, 2.2); glass.position.set(0, 0.08, -0.4); body.add(glass);
  const gear = new THREE.Group(); body.add(gear);
  for (const [x, z] of [[0, -0.55], [-0.22, 0.35], [0.22, 0.35]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), dark); l.position.set(x, -0.15, z); gear.add(l); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), dark); w.rotation.z = Math.PI / 2; w.position.set(x, -0.27, z); gear.add(w); }
  gear.visible = false; g.userData.gear = gear; g.userData.body = body;
  const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  lamp.position.set(0, -0.08, -0.6); lamp.scale.set(1.2, 1.2, 1); body.add(lamp); g.userData.lamp = lamp;
  return g;
}
function makeHeli() {
  const g = new THREE.Group(); const red = M(0xd6332b), white = M(0xf3f3f3), dark = M(0x262c36);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), red); b.scale.set(0.9, 0.85, 1.4); g.add(b);
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.9, 8), white); boom.rotation.x = Math.PI / 2; boom.position.set(0, 0.05, 0.7); g.add(boom);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.14), red); fin.position.set(0, 0.15, 1.12); g.add(fin);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14), dark); mast.position.y = 0.3; g.add(mast);
  const rotor = new THREE.Group(); rotor.position.y = 0.38; g.add(rotor);
  for (let i = 0; i < 4; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.01, 0.06), dark); bl.rotation.y = i * Math.PI / 4; rotor.add(bl); }
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1), new THREE.MeshBasicMaterial({ color: 0xffe08a })); rope.position.set(0.2, -0.6, 0); g.add(rope);
  g.userData.rotor = rotor; return g;
}
let GLOW;

// ======================================================================= le monde
export function createWorld(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, opts.mobile ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  GLOW = glowTex();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 6000);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, rotateSpeed: 0.6, zoomSpeed: 0.9, panSpeed: 0.8, maxPolarAngle: Math.PI * 0.495, minDistance: 2, maxDistance: 2600, screenSpacePanning: false });
  const W = { renderer, scene, camera, controls, layers: {}, tick: [], night: 0 };

  // ---------------------------------------------------------------- ciel
  const SKY = { top: new THREE.Color(0x2f6fd8), hor: new THREE.Color(0xcfe3f7), ntop: new THREE.Color(0x02040b), nhor: new THREE.Color(0x14203a) };
  const skyMat = new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() } }, side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 vP; void main(){ float t = pow(clamp(vP.y,0.0,1.0),0.55); gl_FragColor = vec4(mix(hor, top, t), 1.0); }',
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(4500, 32, 16), skyMat); scene.add(sky);
  scene.fog = new THREE.Fog(0xcfe3f7, 900, 3600);
  const starsG = new THREE.BufferGeometry(); const sp = [];
  for (let i = 0; i < 1400; i++) { const u = Math.random() * Math.PI * 2, v = Math.acos(Math.random() * 0.95); sp.push(4000 * Math.sin(v) * Math.cos(u), 4000 * Math.cos(v), 4000 * Math.sin(v) * Math.sin(u)); }
  starsG.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(starsG, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false }));
  scene.add(stars);
  const hemi = new THREE.HemisphereLight(0xdde9ff, 0x4d5a3a, 1.25); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff3dd, 1.9); sun.position.set(-600, 900, 400); scene.add(sun);

  // ---------------------------------------------------------------- terrain
  const SZ = 2400, SEG = opts.mobile ? 180 : 260;
  const tg = new THREE.PlaneGeometry(SZ, SZ, SEG, SEG); tg.rotateX(-Math.PI / 2);
  const pos = tg.attributes.position, col = [];
  const cGrass = new THREE.Color(0x7fa35a), cGrass2 = new THREE.Color(0x5e8746), cForest = new THREE.Color(0x3f6b3a), cRock = new THREE.Color(0x8b7d6b), cSnow = new THREE.Color(0xf4f6fa), cSand = new THREE.Color(0xd9c793), cSea = new THREE.Color(0x2a6f9e), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = terrainH(x, z); pos.setY(i, h);
    const n = fbm(x * 0.03, z * 0.03, 3);
    tmp.copy(cGrass).lerp(cGrass2, n).lerp(cForest, smooth(0.55, 0.75, fbm(x * 0.012 + 5, z * 0.012, 3)) * 0.8);
    tmp.lerp(cRock, smooth(ft(2500), ft(5000), h)); tmp.lerp(cSnow, smooth(ft(6800), ft(8200), h));
    if (h < ft(60)) tmp.lerp(cSand, smooth(ft(60), ft(-20), h)); if (h < -ft(80)) tmp.copy(cSea);
    col.push(tmp.r, tmp.g, tmp.b);
  }
  tg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); tg.computeVertexNormals();
  const terrain = new THREE.Mesh(tg, new THREE.MeshLambertMaterial({ vertexColors: true }));
  scene.add(terrain); W.terrain = terrain;
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(SZ * 1.6, SZ * 0.8), new THREE.MeshPhongMaterial({ color: 0x1f6aa5, shininess: 90, specular: 0x9fc8ff, transparent: true, opacity: 0.92 }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, -0.12, 900); scene.add(sea);

  // ---------------------------------------------------------------- aérodrome
  const ad = new THREE.Group(); scene.add(ad); W.ad = ad;
  ad.rotation.y = -RWY_HDG * DEG; // piste locale selon -z
  const asphalt = canvasTex(256, 256, (g) => { g.fillStyle = '#3c4048'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},255,${Math.random() * 0.05})`; g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); } });
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping; asphalt.repeat.set(1, 40);
  const RWL = 30, RWW = 0.6, y0 = 0.02;
  const plane = (w, l, mat, x, z, y = y0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); ad.add(m); return m; };
  const strip = plane(3, 33, new THREE.MeshLambertMaterial({ color: 0x8db36a }), 0, 0, 0.005);
  plane(RWW, RWL, new THREE.MeshLambertMaterial({ map: asphalt }), 0, 0);
  const W_ = new THREE.MeshBasicMaterial({ color: 0xf4f4f4 }), Y_ = new THREE.MeshBasicMaterial({ color: 0xf3c21b });
  // marques : seuils (bandes), axe, points de visée, zone de toucher, bords
  const marks = new THREE.Group(); ad.add(marks); W.marks = {};
  const mplane = (w, l, x, z, mat = W_) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y0 + 0.004, z); marks.add(m); return m; };
  for (const end of [1, -1]) {
    const zT = end * (RWL / 2 - 0.25);
    for (let i = 0; i < 8; i++) { const x = -0.255 + i * 0.073 + (i >= 4 ? 0.003 : 0); mplane(0.03, 0.3, x, zT); }
    const tx = makeTextPlane(end > 0 ? '34' : '16', 0.32, 0.42); tx.position.set(0, y0 + 0.004, end * (RWL / 2 - 0.85)); tx.rotation.z = end > 0 ? 0 : Math.PI; marks.add(tx);
    mplane(0.06, 0.45, -0.17, end * (RWL / 2 - 4)); mplane(0.06, 0.45, 0.17, end * (RWL / 2 - 4)); // points de visée
    for (let k = 1; k <= 3; k++) { const z = end * (RWL / 2 - 1.5 - k * 1.5); if (k === 2) continue; for (const s of [-1, 1]) for (let j = 0; j < (k === 1 ? 3 : 2); j++) mplane(0.018, 0.22, s * (0.12 + j * 0.03), z); }
  }
  for (let z = -RWL / 2 + 1.4; z < RWL / 2 - 1.4; z += 0.6) mplane(0.012, 0.3, 0, z);
  mplane(0.01, RWL, -RWW / 2 + 0.01, 0); mplane(0.01, RWL, RWW / 2 - 0.01, 0);
  // taxiway parallèle (ouest), bretelles, parking
  const twMat = new THREE.MeshLambertMaterial({ map: asphalt.clone() }); twMat.map.repeat.set(1, 30);
  const twX = -1.8;
  plane(0.3, 26, twMat, twX, 0, 0.015);
  for (const z of [-12.5, 0, 12.5]) { const b = plane(1.8, 0.3, twMat, twX / 2, z, 0.016); }
  const apron = plane(3.2, 6, new THREE.MeshLambertMaterial({ color: 0x9ba1a8 }), -4.2, 2, 0.012);
  const ty = (w, l, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), Y_); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, z); ad.add(m); return m; };
  ty(0.012, 26, twX, 0);
  for (const z of [-12.5, 0, 12.5]) ty(1.8, 0.012, twX / 2, z);
  // point d'attente (2 traits pleins + 2 tirets) sur la bretelle sud, à 0,5 du bord de piste
  const hp = new THREE.Group(); ad.add(hp); W.holdingPoint = hp;
  for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.3), Y_); m.rotation.x = -Math.PI / 2; m.position.set(-0.8 - i * 0.04, 0.032, 12.5); hp.add(m); }
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.06), Y_); m.rotation.x = -Math.PI / 2; m.position.set(-0.9 - i * 0.04, 0.032, 12.5 - 0.1 + j * 0.1); hp.add(m); }
  // panneau obligatoire (rouge) au point d'attente
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.42), [M(0x222222), M(0x222222), M(0x222222), M(0x222222), new THREE.MeshBasicMaterial({ map: signTex('16-34', '#c8102e', '#fff') }), new THREE.MeshBasicMaterial({ map: signTex('16-34', '#c8102e', '#fff') })]);
  sign.rotation.y = Math.PI / 2; sign.position.set(-0.9, 0.08, 12.95); ad.add(sign); W.sign = sign;
  // tour, hangars, radar
  const tower = new THREE.Group(); ad.add(tower); tower.position.set(-5.2, 0, -1.5);
  const tw1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.6, 12), M(0xe9e4da)); tw1.position.y = 0.8; tower.add(tw1);
  const cab = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.32, 12), new THREE.MeshPhongMaterial({ color: 0x5fb0d8, shininess: 80, transparent: true, opacity: 0.9 })); cab.position.y = 1.76; tower.add(cab);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 12), M(0x30353f)); roof.position.y = 1.95; tower.add(roof);
  W.tower = tower;
  for (let i = 0; i < 3; i++) { const hg = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 16, 1, false, 0, Math.PI), M(0xb9bec6)); hg.rotation.z = Math.PI / 2; hg.rotation.y = Math.PI / 2; hg.position.set(-6.3, 0, 3.2 + i * 1.25); ad.add(hg); }
  const radar = new THREE.Group(); radar.position.set(-6.5, 0, -6); ad.add(radar);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.9, 8), M(0xdddddd)); mast.position.y = 0.45; radar.add(mast);
  const ant = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.05), M(0xc93b2b)); ant.position.y = 0.98; radar.add(ant);
  W.radarAnt = ant; W.tick.push((dt) => { ant.parent.rotation.y += dt * 1.2; });
  // manche à air
  const sock = new THREE.Group(); sock.position.set(1.2, 0, -12); ad.add(sock);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.6), M(0xdddddd)); pole.position.y = 0.3; sock.add(pole);
  const coneT = canvasTex(64, 16, (g) => { for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#ff4a1c'; g.fillRect(i * 12.8, 0, 12.8, 16); } });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.4, 10, 1, true), new THREE.MeshLambertMaterial({ map: coneT, side: THREE.DoubleSide }));
  cone.rotation.z = Math.PI / 2; cone.position.set(0.2, 0.58, 0); sock.add(cone); sock.rotation.y = 0.9; W.sock = sock;
  // aire à signaux
  const sa = new THREE.Group(); sa.position.set(-4, 0, -6); ad.add(sa);
  const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), M(0x1d1f24)); sq.rotation.x = -Math.PI / 2; sq.position.y = 0.02; sa.add(sq);
  const Tm = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.08), W_); Tm.rotation.x = -Math.PI / 2; Tm.position.set(0, 0.025, -0.15); sa.add(Tm);
  const Tm2 = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.45), W_); Tm2.rotation.x = -Math.PI / 2; Tm2.position.set(0, 0.025, 0.08); sa.add(Tm2);
  W.signalArea = sa;

  // ---------------------------------------------------------------- balisage lumineux
  const LP = [], LC = [];
  const addL = (x, z, c, y = 0.06) => { LP.push(x, y, z); LC.push(c.r, c.g, c.b); };
  const cW = new THREE.Color(1, 0.95, 0.85), cG = new THREE.Color(0.2, 1, 0.35), cR = new THREE.Color(1, 0.15, 0.1), cB = new THREE.Color(0.25, 0.45, 1), cGt = new THREE.Color(0.3, 1, 0.5);
  for (let z = -RWL / 2; z <= RWL / 2 + 0.01; z += 0.6) { addL(-RWW / 2 - 0.03, z, cW); addL(RWW / 2 + 0.03, z, cW); }
  for (let i = 0; i < 9; i++) { const x = -0.3 + i * 0.075; addL(x, RWL / 2 + 0.05, cG); addL(x, -RWL / 2 - 0.05, cR); }
  for (let z = -RWL / 2 + 0.3; z < RWL / 2; z += 0.3) addL(0, z, cW, 0.04);
  for (let k = 1; k <= 9; k++) for (let i = -3; i <= 3; i++) addL(i * 0.08, RWL / 2 + k * 0.6, cW, 0.08); // rampe d'approche 34
  for (let z = -13; z <= 13; z += 0.6) { addL(twX - 0.2, z, cB); addL(twX + 0.2, z, cB); addL(twX, z + 0.3, cGt, 0.04); }
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(LP, 3)); lg.setAttribute('color', new THREE.Float32BufferAttribute(LC, 3));
  const lmat = new THREE.PointsMaterial({ size: 0.22, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 });
  const lights = new THREE.Points(lg, lmat); ad.add(lights); W.rwLights = lights;
  // PAPI : 4 boîtiers à gauche de la piste 34, près du point de visée
  const papi = new THREE.Group(); ad.add(papi); W.papi = papi;
  const papiPos = new THREE.Vector3(-0.75, 0.07, RWL / 2 - 4);
  const papiSpr = [];
  for (let i = 0; i < 4; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.07), M(0x2a2d33)); box.position.set(papiPos.x - i * 0.16, 0.035, papiPos.z); papi.add(box);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.position.set(papiPos.x - i * 0.16, 0.08, papiPos.z - 0.05); s.scale.set(0.35, 0.35, 1); papi.add(s); papiSpr.push(s);
  }
  // angle vu par la caméra (angles réels : on retire l'exagération verticale)
  const PAPI_A = [3.5, 3 + 1 / 6, 2 + 5 / 6, 2.5]; // boîtier le plus proche de la piste (calage le plus haut) -> le plus éloigné
  W.papiAngle = () => {
    const wp = papi.localToWorld(new THREE.Vector3(papiPos.x, 0.07, papiPos.z));
    const d = Math.hypot(camera.position.x - wp.x, camera.position.z - wp.z), h = (camera.position.y - wp.y) / VEX;
    return Math.atan2(h, d) / DEG;
  };
  W.tick.push(() => {
    const a = W.papiAngle();
    papiSpr.forEach((s, i) => { const white = a > PAPI_A[i]; s.material.color.set(white ? 0xffffff : 0xff2a1a); });
    lmat.opacity = 0.25 + 0.75 * W.night; lmat.size = 0.18 + 0.14 * W.night;
  });

  // ---------------------------------------------------------------- objets du monde (en coordonnées monde)
  const world = new THREE.Group(); scene.add(world);
  const groundY = (x, z) => Math.max(terrainH(x, z), -0.1);
  // VOR
  const vor = new THREE.Group(); vor.position.set(VOR.x, groundY(VOR.x, VOR.z), VOR.z); world.add(vor);
  const vb = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.5, 12), M(0xffffff)); vb.position.y = 0.25; vor.add(vb);
  const vc = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 12), M(0xdedede)); vc.position.y = 1.1; vor.add(vc);
  const vlab = makeLabel('VOR « PRO »', { h: 3, bg: 'rgba(20,40,80,.8)' }); vlab.position.set(0, 6, 0); vor.add(vlab); W.vor = vor;

  // ---------------------------------------------------------------- calques
  const layer = (name) => { const g = new THREE.Group(); g.visible = false; scene.add(g); W.layers[name] = g; return g; };
  const lineMat = (c, o = 1, dashed = false) => dashed ? new THREE.LineDashedMaterial({ color: c, transparent: true, opacity: o, dashSize: 2, gapSize: 1.4 }) : new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o });
  const tube = (pts, r, c, o = 1) => { const cu = new THREE.CatmullRomCurve3(pts, false, 'centripetal'); return new THREE.Mesh(new THREE.TubeGeometry(cu, Math.max(20, pts.length * 12), r, 8, false), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o })); };
  W.tube = tube; W.lineMat = lineMat;
  const label = (g, t, p, o = {}) => { const s = makeLabel(t, o); s.position.copy(p); g.add(s); return s; };
  W.label = label;

  // espaces aériens
  const air = layer('airspace'); W.airVolumes = [];
  const CLS = { C: 0x4d6bff, D: 0x2f9cf0, E: 0x22c7b0, P: 0xff3b30, R: 0xff9500, Dz: 0xffd60a, TSA: 0xb05cff };
  function volume(shape, y1, y2, color, info, op = 0.16) {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: y2 - y1, bevelEnabled: false, curveSegments: 48 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, y1, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.25 }));
    m.userData = { info, baseOp: op }; m.renderOrder = 2;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 }));
    const g = new THREE.Group(); g.add(m, e); air.add(g); W.airVolumes.push(m); m.userData.edges = e;
    return g;
  }
  const circle = (cx, cz, r) => { const s = new THREE.Shape(); s.absarc(cx, -cz, r, 0, Math.PI * 2, false); return s; };
  const poly = (pts) => { const s = new THREE.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); s.closePath(); return s; };
  // CTR (SFC – 2 000 ft), TMA (1 500 ft – FL115, deux étages), LTA (FL115 – FL195), UTA (> FL195)
  const ctrS = new THREE.Shape(); ctrS.absarc(0, 0, NM(5), 0, Math.PI * 2, false);
  const ctrExt = poly([[VOR.x * 0.45 - RN.x * 40, VOR.z * 0.45 - RN.z * 40], [VOR.x * 0.45 + RN.x * 40, VOR.z * 0.45 + RN.z * 40], [RN.x * 40, RN.z * 40], [-RN.x * 40, -RN.z * 40]]);
  volume(ctrS, 0, ft(2000), CLS.D, { id: 'CTR', cls: 'D', name: 'CTR (zone de contrôle)', lim: 'SFC → 2 000 ft' }, 0.2);
  volume(ctrExt, 0, ft(2000), CLS.D, { id: 'CTR', cls: 'D', name: 'CTR (extension d’approche)', lim: 'SFC → 2 000 ft' }, 0.2);
  volume(circle(0, 0, NM(12)), ft(2000), ft(11500), CLS.D, { id: 'TMA1', cls: 'D', name: 'TMA, partie 1', lim: '2 000 ft → FL115' }, 0.12);
  const tma2 = new THREE.Shape(); tma2.absarc(0, 0, NM(24), 0, Math.PI * 2, false); const hole = new THREE.Path(); hole.absarc(0, 0, NM(12), 0, Math.PI * 2, true); tma2.holes.push(hole);
  volume(tma2, ft(4500), ft(11500), CLS.E, { id: 'TMA2', cls: 'E', name: 'TMA, partie 2', lim: '4 500 ft → FL115' }, 0.1);
  volume(poly([[-1100, -1100], [1100, -1100], [1100, 1100], [-1100, 1100]]), ft(11500), ft(19500), CLS.D, { id: 'LTA', cls: 'D', name: 'LTA (espace inférieur, FIR)', lim: 'FL115 → FL195' }, 0.05);
  volume(poly([[-1100, -1100], [1100, -1100], [1100, 1100], [-1100, 1100]]), ft(19500), ft(30000), CLS.C, { id: 'UTA', cls: 'C', name: 'UTA (espace supérieur, UIR)', lim: 'FL195 → illimité' }, 0.045);
  // route aérienne sous le FL115, à l'ouest
  const a0 = new THREE.Vector3(-1000, 0, 520), a1 = new THREE.Vector3(-260, 0, -1000), ad_ = a1.clone().sub(a0).normalize(), an = new THREE.Vector3(-ad_.z, 0, ad_.x).multiplyScalar(NM(5));
  volume(poly([[a0.x + an.x, a0.z + an.z], [a1.x + an.x, a1.z + an.z], [a1.x - an.x, a1.z - an.z], [a0.x - an.x, a0.z - an.z]]), ft(6500), ft(11500), CLS.E, { id: 'AWY', cls: 'E', name: 'AWY (route aérienne)', lim: 'FL065 → FL115' }, 0.14);
  // zones P, R, D et TSA
  volume(circle(520, -160, 55), 0, ft(5000), CLS.P, { id: 'P', cls: 'P', name: 'Zone P (interdite)', lim: 'SFC → 5 000 ft' }, 0.28);
  volume(circle(640, 260, 90), 0, ft(9500), CLS.R, { id: 'R', cls: 'R', name: 'Zone R (réglementée)', lim: 'SFC → FL095' }, 0.22);
  volume(circle(320, 640, 110), 0, ft(12500), CLS.Dz, { id: 'Dz', cls: 'Dz', name: 'Zone D (dangereuse)', lim: 'SFC → FL125' }, 0.2);
  volume(poly([[180, -760], [760, -760], [760, -420], [180, -420]]), ft(6500), ft(19500), CLS.TSA, { id: 'TSA', cls: 'TSA', name: 'TSA (zone militaire temporaire)', lim: 'FL065 → FL195' }, 0.16);
  const fl = (y, t, c) => { const s = makeLabel(t, { h: 7, color: c, bg: 'rgba(8,12,22,.6)' }); s.position.set(-700, y, -700); air.add(s); };
  fl(ft(11500), 'FL 115', '#9fd6ff'); fl(ft(19500), 'FL 195 : limite FIR / UIR', '#c6b8ff');
  W.airLabels = [];
  for (const [t, p, c] of [['CTR · D', new THREE.Vector3(0, ft(2000) + 4, 40), '#7cc4ff'], ['TMA · D', new THREE.Vector3(-150, ft(11500) + 6, 0), '#7cc4ff'], ['TMA · E', new THREE.Vector3(380, ft(11500) - 10, 140), '#7fe8d8'],
    ['AWY · E', a0.clone().lerp(a1, 0.55).setY(ft(11500) + 6), '#7fe8d8'], ['LTA · D', new THREE.Vector3(-760, ft(16000), -300), '#7cc4ff'], ['UTA · C', new THREE.Vector3(-760, ft(24000), -300), '#a8b6ff'],
    ['P', new THREE.Vector3(520, ft(5000) + 6, -160), '#ff8a80'], ['R', new THREE.Vector3(640, ft(9500) + 6, 260), '#ffc06b'], ['D', new THREE.Vector3(320, ft(12500) + 6, 640), '#ffe36b'], ['TSA', new THREE.Vector3(470, ft(19500) + 6, -590), '#d6a6ff']]) {
    const s = makeLabel(t, { h: 9, color: c }); s.position.copy(p); air.add(s); W.airLabels.push(s);
  }

  // tour de piste (main gauche, 1 000 ft) pour la piste 34
  const circuit = layer('circuit');
  const cH = ft(1000) + 0.5, off = -NM(1.1);
  const ptsC = [[0, -14, 0.2], [0, -24, cH * 0.7], [off * 0.6, -27, cH], [off, -20, cH], [off, 10, cH], [off * 0.7, 20, cH], [0, 24, cH * 0.75], [0, 15, 0.3]];
  const local = (x, z, y) => new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), -RWY_HDG * DEG);
  const cpts = ptsC.map(([x, z, y]) => local(x, z, y));
  circuit.add(tube(cpts, 0.12, 0xffc35c, 0.95));
  for (const [t, x, z, y] of [['Montée initiale', 2.5, -21, cH * 0.4], ['Vent traversier', off * 0.5, -29.5, cH], ['Vent arrière', off - 3, -3, cH], ['Étape de base', off * 0.5, 24.5, cH], ['Finale', 3, 19, cH * 0.4]]) {
    label(circuit, t, local(x, z, y + 2.2), { h: 1.6, color: '#ffe2a3' });
  }
  W.circuitPts = cpts;

  // attente au VOR (virages à droite, axe d'arrivée 340°), entrées
  const hold = layer('holding');
  W.holdGroup = hold;
  // approche ILS 34 : IAF (VOR) → IF → FAF → seuil, interrompue
  const appr = layer('approach');
  const P_IF = THR34.clone().addScaledVector(RW, -NM(8)), P_FAF = THR34.clone().addScaledVector(RW, -NM(5));
  const yFAF = ft(1600), yIF = ft(2500), yIAF = ALT_HOLD;
  const apPts = [VOR.clone().setY(yIAF), P_IF.clone().setY(yIF), P_FAF.clone().setY(yFAF), THR34.clone().setY(ft(50))];
  appr.add(tube([apPts[0], apPts[0].clone().lerp(apPts[1], 0.5).setY((yIAF + yIF) / 2), apPts[1]], 0.18, 0x5fd6ff));
  appr.add(tube([apPts[1], apPts[1].clone().lerp(apPts[2], 0.5).setY(yIF * 0.5 + yFAF * 0.5), apPts[2]], 0.18, 0x62e3a0));
  appr.add(tube([apPts[2], apPts[3]], 0.18, 0xffc35c));
  const MAPt = THR34.clone().addScaledVector(RW, -NM(0.5)).setY(ft(200));
  const miss = [MAPt, THR16.clone().addScaledVector(RW, NM(2)).setY(ft(1800)), THR16.clone().addScaledVector(RW, NM(4)).addScaledVector(RN, NM(2)).setY(ft(3000))];
  const missT = tube(miss, 0.15, 0xff6a4d, 0.9); appr.add(missT);
  for (const [t, p, c] of [['IAF · VOR', apPts[0], '#9fe6ff'], ['IF', apPts[1], '#9ff0c6'], ['FAF / FAP', apPts[2], '#ffd08a'], ['MAPt', MAPt, '#ffb3a6'], ['Interrompue', miss[2], '#ffb3a6']]) {
    const s = label(appr, t, p.clone().add(new THREE.Vector3(0, 6, 0)), { h: 4, color: c }); const d = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8), new THREE.MeshBasicMaterial({ color: c })); d.position.copy(p); appr.add(d);
  }
  label(appr, 'Initiale', apPts[0].clone().lerp(apPts[1], 0.5).add(new THREE.Vector3(0, 5, 0)), { h: 3, color: '#9fe6ff', bg: false });
  label(appr, 'Intermédiaire', apPts[1].clone().lerp(apPts[2], 0.5).add(new THREE.Vector3(0, 5, 0)), { h: 3, color: '#9ff0c6', bg: false });
  label(appr, 'Finale', apPts[2].clone().lerp(apPts[3], 0.45).add(new THREE.Vector3(0, 5, 0)), { h: 3, color: '#ffd08a', bg: false });
  W.apPts = apPts; W.MAPt = MAPt;
  // MSA 25 NM autour du VOR, 4 secteurs
  const msa = layer('msa');
  const ring = new THREE.Mesh(new THREE.RingGeometry(NM(25) - 2, NM(25), 128), new THREE.MeshBasicMaterial({ color: 0xffc35c, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(VOR.x, ft(9000), VOR.z); msa.add(ring);
  label(msa, 'MSA : 25 NM autour du VOR', new THREE.Vector3(VOR.x, ft(9000) + 10, VOR.z - NM(25)), { h: 9, color: '#ffd08a' });

  // départ (SID) piste 34 : DER, OIS 2,5 %, pente 3,3 %
  const sid = layer('sid');
  const der = THR16.clone();
  const sidPts = [der.clone().setY(ft(16)), der.clone().addScaledVector(RW, NM(3)), der.clone().addScaledVector(RW, NM(6)).addScaledVector(RN, NM(2.5)).setY(ft(4000)), der.clone().addScaledVector(RW, NM(7)).addScaledVector(RN, NM(8)).setY(ft(6000))];
  sidPts[1].y = NM(3) * 0.033 * VEX + ft(16);
  sid.add(tube(sidPts, 0.16, 0x62e3a0));
  label(sid, 'SID : pente 3,3 %', sidPts[1].clone().add(new THREE.Vector3(0, 6, 0)), { h: 4, color: '#9ff0c6' });
  label(sid, 'DER', der.clone().add(new THREE.Vector3(0, 3, 0)), { h: 2.5, color: '#ffd08a' });
  W.der = der; W.sidPts = sidPts;

  // nuages (pour le VFR)
  const clouds = layer('clouds');
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
  const camSpots = [[-150, 210], [-260, 330], [-90, 140], [-40, 80], [-70, 95]];
  for (let i = 0; i < 16; i++) {
    let cx, cz, tries = 0;
    do { cx = (Math.random() - 0.5) * 900; cz = (Math.random() - 0.5) * 700 - 100; } while (tries++ < 30 && camSpots.some(([x, z]) => Math.hypot(cx - x, cz - z) < 90));
    const g = new THREE.Group(), cy = ft(4500 + Math.random() * 2500);
    for (let k = 0; k < 7; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(6 + Math.random() * 7, 10, 8), cloudMat); s.position.set((Math.random() - 0.5) * 30, Math.random() * 6, (Math.random() - 0.5) * 18); s.scale.y = 0.6; g.add(s); }
    g.position.set(cx, cy, cz); clouds.add(g);
  }

  // mer : SAR (bateau, radeau, hélicoptère)
  const sar = layer('sar');
  const raftP = new THREE.Vector3(160, 0, 980);
  const raft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 12), M(0xff8a00)); raft.position.copy(raftP).setY(0.1); sar.add(raft);
  const ship = new THREE.Group(); ship.position.set(260, 0, 1040); sar.add(ship);
  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 8), M(0x384152)); hull.position.y = 0.3; ship.add(hull);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 2.5), M(0xeeeeee)); deck.position.set(0, 1.2, 1); ship.add(deck);
  const heli = makeHeli(); heli.scale.setScalar(4); sar.add(heli); W.heli = heli;
  W.tick.push((dt, t) => { if (!sar.visible) return; heli.userData.rotor.rotation.y += dt * 30; heli.position.set(raftP.x + 14 * Math.cos(t * 0.3), 12 + Math.sin(t) * 0.6, raftP.z + 14 * Math.sin(t * 0.3)); heli.rotation.y = -t * 0.3 + Math.PI; raft.position.y = 0.1 + Math.sin(t * 2) * 0.08; });
  label(sar, 'Survivants', raftP.clone().setY(6), { h: 3, color: '#ffd08a' });
  W.raftP = raftP;

  // ---------------------------------------------------------------- avion principal et chasseur
  const ac = makePlane({ scale: 3 }); scene.add(ac); ac.visible = false; W.ac = ac;
  const fighter = makeFighter(); fighter.scale.setScalar(3); scene.add(fighter); fighter.visible = false; W.fighter = fighter;

  // ---------------------------------------------------------------- caméra : vols et préréglages
  let fly = null;
  W.camTo = (pos, target, dur = 1.6) => {
    fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: target.clone(), s: performance.now(), dur };
    controls.enabled = false;
  };
  W.isFlying = () => !!fly;
  W.setNight = (v) => { W.nightTarget = typeof v === 'number' ? Math.max(0, Math.min(1, v)) : (v ? 1 : 0); };
  W.nightTarget = 0;
  W.show = (names) => { for (const k in W.layers) W.layers[k].visible = names.includes(k); };

  // ---------------------------------------------------------------- boucle
  const clock = { last: performance.now(), t: 0 };
  W.size = { w: 1, h: 1 };
  W.resize = (w, h, offX = 0, offY = 0) => {
    W.size = { w, h }; renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.setViewOffset(w, h, offX, offY, w, h); camera.updateProjectionMatrix();
  };
  W.frame = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - clock.last) / 1000); clock.last = now; clock.t += dt;
    if (fly) {
      const k = Math.min(1, (now - fly.s) / 1000 / fly.dur), e = 1 - Math.pow(1 - k, 3);
      camera.position.lerpVectors(fly.p0, fly.p1, e); controls.target.lerpVectors(fly.t0, fly.t1, e);
      camera.lookAt(controls.target);
      if (k >= 1) { fly = null; controls.enabled = true; }
    } else controls.update();
    W.night = lerp(W.night, W.nightTarget, Math.min(1, dt * 2.5));
    const n = W.night;
    skyMat.uniforms.top.value.copy(SKY.top).lerp(SKY.ntop, n); skyMat.uniforms.hor.value.copy(SKY.hor).lerp(SKY.nhor, n);
    scene.fog.color.copy(skyMat.uniforms.hor.value); stars.material.opacity = n;
    hemi.intensity = lerp(1.25, 0.12, n); sun.intensity = lerp(1.9, 0.05, n);
    for (const f of W.tick) f(dt, clock.t);
    // étiquettes : taille à peu près constante à l'écran
    scene.traverseVisible((o) => {
      if (o.isSprite && o.userData && o.userData.ar) {
        const d = camera.position.distanceTo(o.getWorldPosition(_v));
        const k = d * Math.tan(camera.fov * DEG / 2) * 2 / W.size.h * o.userData.px * (W.size.h < 600 ? 1.15 : 1);
        o.scale.set(k * o.userData.ar, k, 1);
      }
    });
    renderer.render(scene, camera);
  };
  const _v = new THREE.Vector3();
  camera.position.set(-300, 420, 900); controls.target.set(0, 0, 0);
  return W;
}

// texte peint au sol (numéro de piste)
function makeTextPlane(txt, w, l) {
  const t = canvasTex(128, 168, (g) => { g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, 128, 168); g.fillStyle = '#f4f4f4'; g.font = '700 150px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 64, 90); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
  m.rotation.x = -Math.PI / 2; return m;
}
function signTex(txt, bg, fg) {
  return canvasTex(256, 72, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 256, 72); g.fillStyle = fg; g.font = '700 52px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 128, 38); g.strokeStyle = '#111'; g.lineWidth = 6; g.strokeRect(0, 0, 256, 72); });
}
