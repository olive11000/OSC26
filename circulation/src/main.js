import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as M from './model.js';
import { P, DEG } from './model.js';
import * as SH from './shaders.js';
import { STEPS, KEYWORDS, QUIZ } from './content.js';

const $ = (s) => document.querySelector(s);
const isMobile = matchMedia('(max-width: 760px)').matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ======================================================================= rendu
THREE.ColorManagement.enabled = false;
const canvas = $('#c');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { $('#err').style.display = 'flex'; $('#loading').style.display = 'none'; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
camera.position.set(0, 1, 4);
const controls = new OrbitControls(camera, canvas);
Object.assign(controls, { enableDamping: true, dampingFactor: 0.075, enablePan: false, rotateSpeed: 0.55, zoomSpeed: 0.8, minDistance: 1.35, maxDistance: 12, autoRotateSpeed: 0.35 });

const geo = (lat, lon, r = 1, v = new THREE.Vector3()) => {
  const c = Math.cos(lat * DEG);
  return v.set(r * c * Math.cos(lon), r * Math.sin(lat * DEG), -r * c * Math.sin(lon));
};

// ======================================================================= textures
const loader = new THREE.TextureLoader();
let pending = 0;
function tex(url, cb) {
  pending++;
  const t = loader.load(url, () => { pending--; cb && cb(t); if (pending === 0) ready(); }, undefined, () => { pending--; if (pending === 0) ready(); });
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}
const dayTex = tex(isMobile ? 'assets/earth_day_2k.jpg' : 'assets/earth_day_4k.jpg');
const nightTex = tex('assets/earth_night_2k.jpg');
const waterTex = tex('assets/water_1k.png');
const starTex = tex('assets/stars_2k.jpg');

// ======================================================================= uniforms partagés
const sunDir = new THREE.Vector3(1, 0, 0);
const U = {
  sunDir: { value: sunDir }, uShift: { value: 0 }, uRot: { value: 1 }, uNight: { value: 0.3 },
};

// ======================================================================= globe
const earth = new THREE.Group();
scene.add(earth);
const earthMat = new THREE.ShaderMaterial({
  uniforms: { ...U, dayMap: { value: dayTex }, nightMap: { value: nightTex }, waterMap: { value: waterTex },
    uWater: { value: 0 }, uRad: { value: 0 }, uPress: { value: 0 }, uGrid: { value: 0 }, uDim: { value: 1 } },
  vertexShader: SH.earthVert, fragmentShader: SH.fill(SH.earthFrag, SH),
});
const globe = new THREE.Mesh(new THREE.SphereGeometry(1, isMobile ? 128 : 192, isMobile ? 96 : 128), earthMat);
earth.add(globe);

// nuages : texture générée en continu
const CW = isMobile ? 1024 : 2048;
const cloudRT = new THREE.WebGLRenderTarget(CW, CW / 2, { type: THREE.UnsignedByteType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
cloudRT.texture.wrapS = THREE.RepeatWrapping;
const genMat = new THREE.ShaderMaterial({
  uniforms: { uShift: U.uShift, uRot: U.uRot, uTime: { value: 0 }, uDense: { value: 1 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: SH.fill(SH.cloudGenFrag, SH), depthTest: false, depthWrite: false,
});
const genScene = new THREE.Scene();
genScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), genMat));
const genCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const cloudMat = new THREE.ShaderMaterial({
  uniforms: { cloudMap: { value: cloudRT.texture }, sunDir: U.sunDir, uOpacity: { value: 0 }, uNight: U.uNight },
  vertexShader: SH.cloudVert, fragmentShader: SH.cloudFrag, transparent: true, depthWrite: false,
});
const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.014, isMobile ? 96 : 144, isMobile ? 64 : 96), cloudMat);
clouds.renderOrder = 2;
earth.add(clouds);

// atmosphère
const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.085, 96, 64), new THREE.ShaderMaterial({
  uniforms: { sunDir: U.sunDir, uNight: U.uNight }, vertexShader: SH.atmoVert, fragmentShader: SH.atmoFrag,
  side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
}));
atmo.renderOrder = 1;
scene.add(atmo);

// étoiles
starTex.colorSpace = THREE.NoColorSpace;
const stars = new THREE.Mesh(new THREE.SphereGeometry(80, 48, 24), new THREE.MeshBasicMaterial({ map: starTex, side: THREE.BackSide, depthWrite: false, color: 0x6f7a90 }));
scene.add(stars);

// Soleil (halo lointain)
function glowTex(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner); gr.addColorStop(0.25, inner); gr.addColorStop(1, outer);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
}
const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,244,214,1)', 'rgba(255,200,90,0)'), blending: THREE.AdditiveBlending, depthWrite: false }));
sun.scale.set(9, 9, 1);
scene.add(sun);

// ======================================================================= traînées (rubans)
class Streaks {
  constructor(n, segs, width, normalMode = 'radial', taper = true) {
    this.n = n; this.s = segs; this.w = width; this.mode = normalMode; this.taper = taper;
    const vp = segs + 1, nv = n * vp * 2;
    this.P = new Float32Array(n * vp * 3); // points (tête -> queue) remplis par l'appelant
    this.C = new Float32Array(n * 3); this.A = new Float32Array(n); this.W = new Float32Array(n).fill(1);
    this.pos = new Float32Array(nv * 3); this.col = new Float32Array(nv * 3); this.alp = new Float32Array(nv);
    const idx = new (nv > 65535 ? Uint32Array : Uint16Array)(n * segs * 6);
    let q = 0;
    for (let i = 0; i < n; i++) for (let k = 0; k < segs; k++) {
      const a = (i * vp + k) * 2, b = a + 1, c = a + 2, d = a + 3;
      idx[q++] = a; idx[q++] = b; idx[q++] = c; idx[q++] = b; idx[q++] = d; idx[q++] = c;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alp, 1).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);
    this.mat = new THREE.ShaderMaterial({ uniforms: { uOpacity: { value: 1 } }, vertexShader: SH.streakVert, fragmentShader: SH.streakFrag,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(g, this.mat); this.mesh.frustumCulled = false; this.geo = g;
  }
  build(count = this.n) {
    const { P, pos, col, alp, s } = this, vp = s + 1;
    for (let i = 0; i < count; i++) {
      const cr = this.C[i * 3], cg = this.C[i * 3 + 1], cb = this.C[i * 3 + 2], a0 = this.A[i], w0 = this.w * this.W[i];
      for (let k = 0; k < vp; k++) {
        const j = (i * vp + k) * 3;
        const k0 = Math.max(0, k - 1), k1 = Math.min(s, k + 1);
        const j0 = (i * vp + k0) * 3, j1 = (i * vp + k1) * 3;
        let tx = P[j0] - P[j1], ty = P[j0 + 1] - P[j1 + 1], tz = P[j0 + 2] - P[j1 + 2];
        const px = P[j], py = P[j + 1], pz = P[j + 2];
        let nx, ny, nz;
        if (this.mode === 'radial') { nx = px; ny = py; nz = pz; } else { nx = 0; ny = 0; nz = 1; }
        let sx = ty * nz - tz * ny, sy = tz * nx - tx * nz, sz = tx * ny - ty * nx;
        const L = Math.hypot(sx, sy, sz) || 1;
        const f = this.taper ? 1 - k / s : 1, w = w0 * (0.25 + 0.75 * f) / L;
        sx *= w; sy *= w; sz *= w;
        const v = (i * vp + k) * 2, a = a0 * Math.pow(f, 1.25);
        pos[v * 3] = px + sx; pos[v * 3 + 1] = py + sy; pos[v * 3 + 2] = pz + sz;
        pos[v * 3 + 3] = px - sx; pos[v * 3 + 4] = py - sy; pos[v * 3 + 5] = pz - sz;
        col[v * 3] = col[v * 3 + 3] = cr; col[v * 3 + 1] = col[v * 3 + 4] = cg; col[v * 3 + 2] = col[v * 3 + 5] = cb;
        alp[v] = alp[v + 1] = a;
      }
    }
    for (let i = count; i < this.n; i++) for (let k = 0; k < vp; k++) { const v = (i * vp + k) * 2; alp[v] = alp[v + 1] = 0; }
    const at = this.geo.attributes; at.position.needsUpdate = at.color.needsUpdate = at.alpha.needsUpdate = true;
  }
}

const COL = { trade: [1.0, 0.74, 0.30], west: [0.33, 0.82, 1.0], polar: [0.86, 0.86, 1.0], none: [0.92, 0.95, 1.0] };
function regimeColor(lat, out) {
  const al = Math.abs(M.effLat(lat)), r = P.rot;
  const wT = 1 - M.smooth(26, 34, al), wP = M.smooth(56, 64, al), wW = 1 - wT - wP;
  for (let c = 0; c < 3; c++) out[c] = lerp(COL.none[c], COL.trade[c] * wT + COL.west[c] * wW + COL.polar[c] * wP, r);
  return out;
}

// ---------------------------------------------------------------- vents au sol
const K = 0.02; // rad/s par m/s
function makeFlow(n, segs, radius, width, field, hTrail, colorFn) {
  const st = new Streaks(n, segs, width);
  const lat = new Float32Array(n), lon = new Float32Array(n), age = new Float32Array(n), life = new Float32Array(n);
  const spawn = (i) => { lat[i] = Math.asin(Math.random() * 2 - 1) / DEG; lon[i] = Math.random() * Math.PI * 2; age[i] = 0; life[i] = 2.5 + Math.random() * 4; };
  for (let i = 0; i < n; i++) { spawn(i); age[i] = Math.random() * life[i]; }
  const w = {}, rgb = [0, 0, 0], v3 = new THREE.Vector3();
  st.mesh.renderOrder = 3;
  return {
    st, n, active: n,
    update(dt) {
      const vp = segs + 1, count = this.active;
      for (let i = 0; i < count; i++) {
        age[i] += dt;
        if (age[i] > life[i]) spawn(i);
        field(lat[i], lon[i], w);
        lat[i] += w.v * K * dt / DEG;
        lon[i] += w.u * K * dt / Math.max(0.12, Math.cos(lat[i] * DEG));
        if (Math.abs(lat[i]) > 88.5) spawn(i);
        let la = lat[i], lo = lon[i];
        for (let k = 0; k < vp; k++) {
          geo(la, lo, radius, v3);
          const j = (i * vp + k) * 3; st.P[j] = v3.x; st.P[j + 1] = v3.y; st.P[j + 2] = v3.z;
          field(la, lo, w);
          la -= w.v * K * hTrail / DEG; lo -= w.u * K * hTrail / Math.max(0.12, Math.cos(la * DEG));
        }
        field(lat[i], lon[i], w);
        const sp = Math.hypot(w.u, w.v);
        colorFn(lat[i], sp, w, rgb);
        st.C[i * 3] = rgb[0]; st.C[i * 3 + 1] = rgb[1]; st.C[i * 3 + 2] = rgb[2];
        const fade = Math.min(1, age[i] / 0.5, (life[i] - age[i]) / 0.7);
        st.A[i] = Math.max(0, fade) * (0.3 + 0.7 * Math.min(1, sp / 7));
      }
      st.build(count);
    },
  };
}
const surf = makeFlow(isMobile ? 1700 : 3000, 7, 1.007, isMobile ? 0.0042 : 0.0034, M.surfaceWind, 0.12,
  (lat, sp, w, rgb) => regimeColor(lat, rgb));
earth.add(surf.st.mesh);
const BLUE = [0.35, 0.58, 1.0], PINK = [1.0, 0.38, 0.80];
const upper = makeFlow(isMobile ? 1300 : 2400, 7, 1.05, isMobile ? 0.0045 : 0.0036, M.upperWind, 0.07,
  (lat, sp, w, rgb) => { const t = M.smooth(14, 48, sp), h = M.smooth(50, 70, sp); for (let c = 0; c < 3; c++) rgb[c] = lerp(lerp(BLUE[c], PINK[c], t), 1, h * 0.6); });
earth.add(upper.st.mesh);

// ======================================================================= coupe verticale (rideau)
const HMAX = 20, HS = 0.30; // 20 km dessinés sur 0,30 rayon terrestre
const curtain = new THREE.Group();
scene.add(curtain);
(function buildCurtainBg() {
  const NL = 180, NZ = 24, pos = [], lz = [], idx = [];
  for (const side of [1, -1]) {
    const base = pos.length / 3;
    for (let i = 0; i <= NL; i++) for (let j = 0; j <= NZ; j++) {
      const lat = -90 + 180 * i / NL, z = j / NZ, r = 1 + z * HS;
      pos.push(side * r * Math.cos(lat * DEG), r * Math.sin(lat * DEG), 0); lz.push(lat, z);
    }
    for (let i = 0; i < NL; i++) for (let j = 0; j < NZ; j++) {
      const a = base + i * (NZ + 1) + j, b = a + NZ + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aLZ', new THREE.Float32BufferAttribute(lz, 2)); g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: { uShift: U.uShift, uRot: U.uRot, uHmax: { value: HMAX }, uOpacity: { value: 0 } },
    vertexShader: SH.sectionVert, fragmentShader: SH.fill(SH.sectionFrag, SH), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  m.renderOrder = 4; curtain.add(m); curtain.userData.bg = m;
})();
const secN = isMobile ? 520 : 900;
const sec = new Streaks(secN * 2, 6, 0.0034, 'z');
sec.mesh.renderOrder = 5; curtain.add(sec.mesh);
const sLat = new Float32Array(secN), sZ = new Float32Array(secN), sAge = new Float32Array(secN), sLife = new Float32Array(secN);
const CS = 0.06;
const sSpawn = (i) => { sLat[i] = Math.asin(Math.random() * 1.98 - 0.99) / DEG; sZ[i] = 0.04 + Math.random() * 0.92; sAge[i] = 0; sLife[i] = 6 + Math.random() * 8; };
for (let i = 0; i < secN; i++) { sSpawn(i); sAge[i] = Math.random() * sLife[i]; }
function secXY(lat, z, side, out, j) {
  const r = 1 + z * M.tropopause(lat) / HMAX * HS;
  out[j] = side * r * Math.cos(lat * DEG); out[j + 1] = r * Math.sin(lat * DEG); out[j + 2] = 0.002;
}
function updateSection(dt) {
  const c = {}, rgb = [0, 0, 0], vp = 7;
  for (let i = 0; i < secN; i++) {
    sAge[i] += dt; if (sAge[i] > sLife[i]) sSpawn(i);
    M.cellVel(sLat[i], sZ[i], c);
    sLat[i] += c.v * CS * dt / DEG; sZ[i] = clamp(sZ[i] + c.w * CS * dt, 0.015, 0.985);
    if (Math.abs(sLat[i]) > 89.5) sSpawn(i);
    let la = sLat[i], z = sZ[i];
    for (let k = 0; k < vp; k++) {
      secXY(la, z, 1, sec.P, (i * vp + k) * 3); secXY(la, z, -1, sec.P, ((i + secN) * vp + k) * 3);
      M.cellVel(la, z, c); la -= c.v * CS * 0.3 / DEG; z = clamp(z - c.w * CS * 0.3, 0.0, 1.0);
    }
    regimeColor(sLat[i], rgb);
    const fade = Math.max(0, Math.min(1, sAge[i] / 0.6, (sLife[i] - sAge[i]) / 0.8));
    M.cellVel(sLat[i], sZ[i], c);
    const a = fade * (0.35 + 0.65 * Math.min(1, Math.hypot(c.v, c.w * 0.5) / 2));
    for (const ii of [i, i + secN]) { sec.C[ii * 3] = rgb[0]; sec.C[ii * 3 + 1] = rgb[1]; sec.C[ii * 3 + 2] = rgb[2]; sec.A[ii] = a; }
  }
  sec.build();
}

// ======================================================================= étiquettes
function makeLabel(text, opt = {}) {
  const fs = 44, pad = 16, font = `${opt.bold === false ? 500 : 700} ${fs}px -apple-system, "Segoe UI", Roboto, sans-serif`;
  const c = document.createElement('canvas'), g = c.getContext('2d');
  g.font = font; const lines = String(text).split('\n');
  const w = Math.ceil(Math.max(...lines.map((l) => g.measureText(l).width))) + pad * 2, h = lines.length * fs * 1.18 + pad * 1.3;
  c.width = w; c.height = Math.ceil(h);
  g.font = font;
  if (opt.bg !== false) {
    g.fillStyle = opt.bg || 'rgba(8,12,22,0.72)';
    const r = 16; g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.fill();
    if (opt.border) { g.strokeStyle = opt.border; g.lineWidth = 3; g.stroke(); }
  }
  g.fillStyle = opt.color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => g.fillText(l, w / 2, pad * 0.65 + fs * 0.62 + i * fs * 1.18));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
  const H = opt.h || 0.065; sp.scale.set(H * w / h, H, 1); sp.userData.h = H; sp.userData.ar = w / h;
  sp.renderOrder = 10; sp.material.opacity = 0;
  return sp;
}
const labelSets = {};
const labelRoot = new THREE.Group(); earth.add(labelRoot);
const curtainLabels = new THREE.Group(); curtain.add(curtainLabels);
// type 'face' : posé sur le méridien face à la caméra (+ décalage dlon) ; 'sec' : sur la coupe ; 'geo' : position fixe
function defLabels(name, list) {
  labelSets[name] = list.map((d) => {
    const sp = makeLabel(d.t, d); (d.kind === 'sec' ? curtainLabels : labelRoot).add(sp); sp.visible = false;
    return { ...d, sp, a: 0 };
  });
}
const A_ = 'rgba(120,24,18,0.78)', D_ = 'rgba(16,44,110,0.78)';
defLabels('clouds', [
  { kind: 'face', le: 0, t: 'ZCIT : nuages épais et denses (gros CB)', border: '#ffffff55' },
  { kind: 'face', le: 22, t: 'Ciel clair, nuages fins (déserts)' }, { kind: 'face', le: -22, t: 'Ciel clair, nuages fins (déserts)' },
  { kind: 'face', le: 52, t: 'Nuages en tourbillons (perturbations)' }, { kind: 'face', le: -52, t: 'Nuages en tourbillons (perturbations)' },
  { kind: 'face', le: 79, t: 'Ciel clair ou nuages bas' }, { kind: 'face', le: -79, t: 'Ciel clair ou nuages bas' },
]);
defLabels('rad', [
  { kind: 'face', le: 0, t: 'EXCÉDENT', color: '#ffb199', bg: 'rgba(90,20,10,0.75)', h: 0.08 },
  { kind: 'face', le: 64, t: 'DÉFICIT', color: '#a9cbff', bg: 'rgba(10,30,80,0.75)', h: 0.07 },
  { kind: 'face', le: -64, t: 'DÉFICIT', color: '#a9cbff', bg: 'rgba(10,30,80,0.75)', h: 0.07 },
  { kind: 'face', le: 37, dlon: 10, t: '≈ 37° : équilibre', h: 0.05 }, { kind: 'face', le: -37, dlon: 10, t: '≈ 37° : équilibre', h: 0.05 },
  { kind: 'sun', le: 4, off: 0.3, t: 'rayons presque verticaux\n= énergie concentrée', h: 0.1, color: '#ffe2a3' },
  { kind: 'sun', le: 60, off: 0.3, t: 'rayons rasants\n= énergie étalée', h: 0.1, color: '#ffe2a3' },
]);
defLabels('winds', [
  { kind: 'face', le: 15, t: 'Alizés de NE', color: '#ffd08a' }, { kind: 'face', le: -15, t: 'Alizés de SE', color: '#ffd08a' },
  { kind: 'face', le: 45, t: "Westerlies (vents de SW)", color: '#9fe6ff' }, { kind: 'face', le: -45, t: 'Westerlies (vents de NW)', color: '#9fe6ff' },
  { kind: 'face', le: 74, t: "Vents d'est polaires (NE)" }, { kind: 'face', le: -74, t: "Vents d'est polaires (SE)" },
  { kind: 'face', le: 32, dlon: 22, t: 'Altitude : courant d’ouest + JET', color: '#ffb0e4', r: 1.07, h: 0.055 },
]);
defLabels('belts', [
  { kind: 'face', le: 86, t: 'A · anticyclone thermique polaire', bg: A_ }, { kind: 'face', le: 60, t: 'D · dépressions subpolaires (~60°)', bg: D_ },
  { kind: 'face', le: 30, t: 'A · anticyclones subtropicaux (~30°)', bg: A_ }, { kind: 'face', le: 0, t: 'ZCIT · dépressions thermiques', bg: D_ },
  { kind: 'face', le: -30, t: 'A · anticyclones subtropicaux', bg: A_ }, { kind: 'face', le: -60, t: 'D · dépressions subpolaires', bg: D_ },
  { kind: 'face', le: -86, t: 'A · anticyclone polaire', bg: A_ },
  { kind: 'face', le: 71, dlon: 42, t: 'NE polaires', h: 0.05 }, { kind: 'face', le: 45, dlon: 32, t: 'SW', h: 0.05, color: '#9fe6ff' },
  { kind: 'face', le: 15, dlon: 32, t: 'alizés NE', h: 0.05, color: '#ffd08a' }, { kind: 'face', le: -15, dlon: 32, t: 'alizés SE', h: 0.05, color: '#ffd08a' },
  { kind: 'face', le: -45, dlon: 32, t: 'NW', h: 0.05, color: '#9fe6ff' }, { kind: 'face', le: -71, dlon: 42, t: 'SE polaires', h: 0.05 },
]);
defLabels('upper', [
  { kind: 'face', le: 0, t: 'Géopotentiel HAUT (air chaud)', bg: A_, r: 1.07 }, { kind: 'face', le: 84, t: 'Géopotentiel BAS', bg: D_, r: 1.07 },
  { kind: 'face', le: -84, t: 'Géopotentiel BAS', bg: D_, r: 1.07 },
  { kind: 'face', le: 42, t: "Vents d'ouest (westerlies)", color: '#ffb0e4', r: 1.07 }, { kind: 'face', le: -42, t: "Vents d'ouest (westerlies)", color: '#ffb0e4', r: 1.07 },
]);
defLabels('front', [
  { kind: 'face', le: 47, t: 'Front polaire : air polaire / air tropical', r: 1.07 },
  { kind: 'face', le: 64, dlon: 35, t: 'Ondes de Rossby', color: '#ffb0e4', r: 1.07 }, { kind: 'face', le: 68, dlon: -35, t: 'Dépressions mobiles', bg: D_, r: 1.07 },
  { kind: 'face', le: 30, dlon: 30, t: 'Jet subtropical', color: '#ffb0e4', r: 1.07, h: 0.05 },
]);
defLabels('polar', [
  { kind: 'face', le: 86, t: 'A thermique polaire (surface)', bg: A_ }, { kind: 'face', le: 70, dlon: 30, t: 'Drainage polaire → vents de NE', color: '#e0e4ff' },
  { kind: 'face', le: 60, dlon: -30, t: 'D subpolaires', bg: D_, h: 0.055 },
  { kind: 'sec', le: 84, zk: 13.5, t: 'D en altitude', bg: D_, h: 0.06 }, { kind: 'sec', le: 82, zk: 4, t: 'A au sol', bg: A_, h: 0.06 },
  { kind: 'sec', le: 66, zk: 16.5, t: 'Front polaire', h: 0.06 },
]);
defLabels('cells', [
  { kind: 'sec', le: 0, zk: 19, t: 'ZCIT', color: '#ffd08a', h: 0.07, cells: 1 },
  { kind: 'sec', le: 15, zk: 7.5, t: 'Hadley', h: 0.07, cells: 3 }, { kind: 'sec', le: -15, zk: 7.5, t: 'Hadley', h: 0.07, side: -1, cells: 3 },
  { kind: 'sec', le: 30, zk: 15.8, t: 'JET ⊗ (WTJ)', color: '#ffb0e4', h: 0.06, cells: 3 }, { kind: 'sec', le: -30, zk: 15.8, t: '⊙ JET', color: '#ffb0e4', h: 0.06, side: -1, cells: 3 },
  { kind: 'sec', le: 30, zk: 6.2, t: 'A · subsidence', bg: A_, h: 0.05, cells: 3, minor: 1 },
  { kind: 'sec', le: 45, zk: 7.5, t: 'Front polaire', h: 0.055, cells: 3, minor: 1 }, { kind: 'sec', le: 76, zk: 6, t: 'Drainage\npolaire', h: 0.09, cells: 3 },
  { kind: 'sec', le: 40, zk: 9, t: '1 seule cellule', h: 0.065, cells: 0 }, { kind: 'sec', le: -40, zk: 9, t: '1 seule cellule', h: 0.065, side: -1, cells: 0 },
  { kind: 'sec', le: 86, zk: 3, t: 'A', bg: A_, h: 0.06, cells: 0 }, { kind: 'sec', le: 4, zk: 2, t: 'D', bg: D_, h: 0.06, cells: 0 },
  { kind: 'sec', le: 52, zk: 13.6, t: 'tropopause', color: '#ffe2a3', bg: false, h: 0.045, bold: false, minor: 1 },
]);
const HIGHS = [['Açores', 35, -32], ['Hawaï', 33, -148], ['Île de Pâques', -29, -100], ['Sainte-Hélène', -27, -6], ['Mascareignes', -30, 66]];
defLabels('highs', HIGHS.map(([n, la, lo]) => ({ kind: 'geo', lat: la, lon: lo * DEG, t: 'A · ' + n, bg: A_, border: '#ff9b8a', h: 0.06 })));

const tmpV = new THREE.Vector3(), camDir = new THREE.Vector3();
function updateLabels(dt, faceLon) {
  const s = M.seasonShift(); camDir.copy(camera.position).normalize();
  for (const name in labelSets) {
    const on = name === 'highs' ? layer.highs.v > 0.5 : (layer.labels.v > 0.5 && cur.labels === name);
    for (const L of labelSets[name]) {
      let want = on ? 1 : 0;
      if (L.cells !== undefined) want *= L.cells === 0 ? (P.rot < 0.5 ? 1 : 0) : L.cells === 1 ? 1 : (P.rot >= 0.5 ? 1 : 0);
      if (L.kind === 'sec') want *= layer.section.v;
      if (L.minor && innerWidth < 500) want = 0;
      if (['winds', 'belts', 'upper', 'front', 'polar'].includes(name) && P.rot < 0.5) want = 0;
      L.a = lerp(L.a, want, Math.min(1, dt * 5));
      L.sp.visible = L.a > 0.02; L.sp.material.opacity = L.a;
      if (!L.sp.visible) continue;
      if (L.kind === 'face') {
        const lat = M.realLat(L.le, s);
        geo(lat, faceLon + (L.dlon === undefined ? -20 : L.dlon) * DEG, L.r || 1.035, L.sp.position);
      } else if (L.kind === 'sun') {
        geo(M.realLat(L.le, s), sunLon, 1.0, L.sp.position).addScaledVector(sunDir, innerWidth < 500 ? 0.05 : (L.off || 0.5));
      } else if (L.kind === 'sec') {
        const lat = M.realLat(L.le, s), side = L.side || 1, r = 1 + L.zk / HMAX * HS;
        L.sp.position.set(side * r * Math.cos(lat * DEG), r * Math.sin(lat * DEG), 0.01);
      } else {
        geo(L.lat + s * 0.6, L.lon, 1.04, L.sp.position);
      }
      if (L.kind === 'face' || L.kind === 'geo') {
        const f = M.smooth(0.08, 0.32, tmpV.copy(L.sp.position).normalize().dot(camDir));
        L.sp.material.opacity = L.a * f; L.sp.visible = L.a * f > 0.02; if (!L.sp.visible) continue;
      }
      // taille constante à l'écran (environ)
      const d = camera.position.distanceTo(L.sp.getWorldPosition(tmpV));
      const k = d / 3.4 * sizeK;
      L.sp.scale.set(L.sp.userData.h * L.sp.userData.ar * k, L.sp.userData.h * k, 1);
    }
  }
}

// ======================================================================= démo moment cinétique
const ring = new THREE.Group(); earth.add(ring);
const ringN = 128, ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((ringN + 1) * 3), 3));
const ringLine = { material: new THREE.LineBasicMaterial({ color: 0x62e3a0, transparent: true }) };
const ringRib = new THREE.Group(); const ringSt = new Streaks(1, ringN, 0.011, 'radial', false); ringSt.mesh.renderOrder = 6; ring.add(ringSt.mesh);
const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -1.35, 0), new THREE.Vector3(0, 1.35, 0)]), new THREE.LineDashedMaterial({ color: 0xaab6d0, dashSize: 0.04, gapSize: 0.03, transparent: true }));
axis.computeLineDistances(); ring.add(axis);
const rArm = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xffc35c, transparent: true }));
ring.add(rArm);
const beads = new Streaks(16, 5, 0.012);
ring.add(beads.mesh);
const rLabel = makeLabel('r', { color: '#ffc35c', h: 0.07, bg: false }); ring.add(rLabel);
let ringPhase = 0, beadAng = 0;
function updateRing(dt, faceLon) {
  const a = layer.ring.v; ring.visible = a > 0.02;
  $('#demo').style.display = a > 0.5 ? 'block' : 'none';
  if (!ring.visible) return;
  ringPhase = (ringPhase + dt) % 11;
  const t = ringPhase, lat = t < 7 ? 34 * M.smooth(0, 7, t) : t < 9 ? 34 : 34 * (1 - M.smooth(9, 11, t));
  const R = 1.07, r = R * Math.cos(lat * DEG), y = R * Math.sin(lat * DEG);
  const arr = ringGeo.attributes.position.array;
  for (let i = 0; i <= ringN; i++) { const q = i / ringN * Math.PI * 2; arr[i * 3] = r * Math.cos(q); arr[i * 3 + 1] = y; arr[i * 3 + 2] = r * Math.sin(q); }
  ringGeo.attributes.position.needsUpdate = true;
  ringSt.P.set(arr); 
  const u = M.angMomWind(lat), kt = u * M.KT;
  const col = new THREE.Color().setRGB(lerp(0.38, 1, M.smooth(40, 200, kt)), lerp(0.89, 0.42, M.smooth(120, 260, kt)), lerp(0.63, 0.3, M.smooth(40, 200, kt)));
  ringLine.material.color.copy(col); ringLine.material.opacity = a; axis.material.opacity = a * 0.7; rArm.material.opacity = a;
  const fl = faceLon;
  rArm.geometry.attributes.position.setXYZ(0, 0, y, 0); rArm.geometry.attributes.position.setXYZ(1, r * Math.cos(fl), y, -r * Math.sin(fl)); rArm.geometry.attributes.position.needsUpdate = true;
  rLabel.position.set(r * 0.5 * Math.cos(fl), y + 0.06, -r * 0.5 * Math.sin(fl)); rLabel.material.opacity = a;
  // billes qui tournent vers l'est, d'autant plus vite que le vent d'ouest est fort
  beadAng += (0.25 + u / 140) * dt;
  for (let i = 0; i < 16; i++) {
    for (let k = 0; k <= 5; k++) {
      const q = -(beadAng + i / 16 * Math.PI * 2) + k * (0.02 + u / 3000), j = (i * 6 + k) * 3;
      beads.P[j] = r * Math.cos(q); beads.P[j + 1] = y; beads.P[j + 2] = r * Math.sin(q);
    }
    beads.C.set([col.r, col.g, col.b], i * 3); beads.A[i] = a;
  }
  // rubans dans le plan horizontal : normale radiale suffisante
  beads.build();
  ringSt.C.set([col.r, col.g, col.b]); ringSt.A[0] = a * 0.9; ringSt.build();
  $('#dkt').textContent = Math.round(kt) + ' kt';
  $('#dbar').style.width = Math.min(100, kt / 2.8) + '%';
  $('#dtxt').textContent = `latitude ${Math.round(lat)}° · r = ${(Math.cos(lat * DEG)).toFixed(2).replace('.', ',')} R` + (kt > 200 ? ' · trop rapide : instable !' : '');
}

// ======================================================================= rayons du Soleil
const rays = new THREE.Group(); scene.add(rays);
const rayMat = new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
const rayLines = [];
for (let i = 0; i < 9; i++) { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]); const l = new THREE.Line(g, rayMat); rays.add(l); rayLines.push(l); }
const dotMat = new THREE.SpriteMaterial({ map: glowTex('rgba(255,230,150,1)', 'rgba(255,180,60,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
const rayDots = rayLines.map(() => { const s = new THREE.Sprite(dotMat); s.scale.set(0.09, 0.09, 1); rays.add(s); return s; });
function updateRays(sunLon) {
  const a = layer.rays.v; rays.visible = a > 0.02; if (!rays.visible) return;
  rayMat.opacity = 0.85 * a; dotMat.opacity = a;
  const d = sunDir;
  rayLines.forEach((l, i) => {
    const lat = -72 + i * 18; // impacts le long du méridien sous le Soleil
    const p = geo(lat, sunLon, 1.002, new THREE.Vector3());
    if (p.dot(d) < 0.02) { l.visible = false; rayDots[i].visible = false; return; }
    l.visible = rayDots[i].visible = true;
    const q = p.clone().addScaledVector(d, 2.6);
    l.geometry.attributes.position.setXYZ(0, q.x, q.y, q.z); l.geometry.attributes.position.setXYZ(1, p.x, p.y, p.z); l.geometry.attributes.position.needsUpdate = true;
    rayDots[i].position.copy(p);
  });
}

// ======================================================================= bulles d'air
const parcels = [];
const parcelTex = glowTex('rgba(255,255,255,1)', 'rgba(150,200,255,0)');
const KP = 0.012, CP = 0.03;
function addParcel(lat, lon, z) {
  if (parcels.length >= 6) removeParcel(parcels[0]);
  const st = new Streaks(1, 260, 0.007);
  st.mesh.renderOrder = 6; earth.add(st.mesh);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: parcelTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  sp.scale.set(0.07, 0.07, 1); sp.renderOrder = 7; earth.add(sp);
  const p = { lat, lon, z, st, sp, hist: [], t: 0, id: (addParcel.n = (addParcel.n || 0) + 1) };
  parcels.push(p); return p;
}
function removeParcel(p) { earth.remove(p.st.mesh); earth.remove(p.sp); p.st.geo.dispose(); p.st.mat.dispose(); parcels.splice(parcels.indexOf(p), 1); }
const pr = (p, v) => geo(p.lat, p.lon, 1.008 + p.z * M.tropopause(p.lat) / HMAX * 0.12, v);
const w3 = {}, ws = {}, wu = {};
function updateParcels(dt) {
  for (const p of parcels) {
    for (let sub = 0; sub < 3; sub++) {
      const h = dt / 3;
      M.wind3D(p.lat, p.lon, p.z, w3);
      p.lat = clamp(p.lat + w3.v * CP * h / DEG, -88, 88);
      p.lon += w3.u * KP * h / Math.max(0.15, Math.cos(p.lat * DEG));
      p.z = clamp(p.z + w3.w * CP * h, 0.02, 0.97);
    }
    p.t += dt;
    const v = pr(p, new THREE.Vector3());
    if (!p.hist.length || p.hist[0].distanceToSquared(v) > 0.00004) { p.hist.unshift(v); if (p.hist.length > 261) p.hist.pop(); }
    p.sp.position.copy(v);
    const n = p.hist.length;
    for (let k = 0; k <= 260; k++) { const q = p.hist[Math.min(k, n - 1)]; p.st.P[k * 3] = q.x; p.st.P[k * 3 + 1] = q.y; p.st.P[k * 3 + 2] = q.z; }
    p.st.C.set([1, 1, 1]); p.st.A[0] = 0.95; p.st.build();
  }
  const last = parcels[parcels.length - 1];
  const box = $('#info');
  if (!last) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  const km = last.z * M.tropopause(last.lat), k = M.smooth(0, 1, last.z);
  M.surfaceWind(last.lat, last.lon, ws); M.upperWind(last.lat, last.lon, wu);
  const u = lerp(ws.u, wu.u, k), vv = lerp(ws.v, wu.v, k), spd = Math.hypot(u, vv) * M.KT;
  M.wind3D(last.lat, last.lon, last.z, w3);
  const up = w3.w > 0.4 ? '↑ monte' : w3.w < -0.4 ? '↓ descend' : '→ à niveau';
  const la = Math.abs(last.lat).toFixed(0) + '°' + (last.lat >= 0 ? 'N' : 'S');
  const zone = last.z < 0.25 ? M.regime(last.lat) : spd > 80 && P.rot > 0.5 ? 'dans le JET' : 'en altitude';
  box.innerHTML = `<b>Bulle ${last.id}</b> <span class="k">·</span> ${la} <span class="k">·</span> ${km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1).replace('.', ',') + ' km'} (${Math.round(km * 3281 / 100) * 100} ft)<br>`
    + `${zone} <span class="k">·</span> vent ${spd < 2 ? 'calme' : 'du ' + M.compass(M.windFrom(u, vv)) + ' ' + Math.round(spd) + ' kt'} <span class="k">·</span> ${up}`;
}

// ======================================================================= état des couches (fondus)
const layer = {};
for (const k of ['clouds', 'surf', 'upper', 'press', 'section', 'rad', 'grid', 'labels', 'ring', 'rays', 'highs', 'water', 'chart'])
  layer[k] = { v: 0, t: 0 };
layer.labels.t = 1;
let cur = { labels: null };
let rotTarget = 1, monthTarget = 3.7, monthAnim = false, timeScale = 1, sizeK = 1;

// ======================================================================= caméra
let fly = null;
function camTo(c, dur = 1.6) {
  const from = new THREE.Spherical().setFromVector3(camera.position);
  const p = geo(c.lat, c.lon * DEG, 1);
  const to = new THREE.Spherical().setFromVector3(p); to.radius = c.dist * 1.1 * fitScale();
  // chemin le plus court en azimut
  let dth = to.theta - from.theta; dth = ((dth + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  to.theta = from.theta + dth;
  fly = { from, to, t0: performance.now(), dur }; controls.enabled = false;
}
function fitScale() {
  const W = innerWidth, H = innerHeight, pr = panelRect();
  const Wv = W - pr.w, Hv = H - pr.h;
  return Math.max(1, H / Math.max(240, Math.min(Wv, Hv)) * (Wv < Hv ? 0.86 : 1));
}
function panelRect() {
  const el = $('#panel'), r = el.getBoundingClientRect();
  if (innerWidth > 760) return { w: r.width + 28, h: 0 };
  return { w: 0, h: Math.max(0, innerHeight - r.top) };
}
function resize() {
  const W = innerWidth, H = innerHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  const pr = panelRect();
  camera.setViewOffset(W, H, pr.w / 2, pr.h / 2, W, H);
  camera.updateProjectionMatrix();
  sizeK = clamp(H / 820, 0.75, 1.35) * (W < 500 ? 0.72 : 1);
  const f = fitScale(); controls.minDistance = 1.35 * Math.max(1, f * 0.7); controls.maxDistance = 12 * f;
}
addEventListener('resize', () => { resize(); });

// ======================================================================= étapes du cours
let stepIdx = 0; const seen = new Set();
function applyStep(i, fromUser = true) {
  stepIdx = clamp(i, 0, STEPS.length - 1); const st = STEPS[stepIdx]; seen.add(stepIdx);
  const L = st.L || {};
  for (const k in layer) layer[k].t = 0;
  for (const k in L) if (k in layer) layer[k].t = typeof L[k] === 'number' ? L[k] : 1;
  layer.labels.t = 1; layer.water.t = st.water ? 1 : 0;
  cur.labels = L.labels || null; cur.sunSide = !!L.rays;
  rotTarget = st.rot === undefined ? 1 : st.rot;
  monthAnim = !!st.monthAnim; if (!monthAnim) monthTarget = st.month === undefined ? 3.7 : st.month;
  controls.autoRotate = !!st.auto;
  camTo(st.cam);
  while (parcels.length) removeParcel(parcels[0]);
  (st.parcels || []).forEach((q) => addParcel(q.lat, q.lon * DEG, q.z));
  ringPhase = 0;
  // texte
  $('#snum').textContent = `ÉTAPE ${stepIdx + 1} / ${STEPS.length}`;
  $('#stitle').textContent = st.title;
  $('#sen').innerHTML = st.en.map((e) => `<span>${e}</span>`).join('');
  $('#sbody').innerHTML = st.body;
  const kp = $('#skeep'); kp.style.display = st.keep.length ? 'block' : 'none';
  kp.querySelector('ul').innerHTML = st.keep.map((k) => `<li>${k}</li>`).join('');
  $('#chart').style.display = L.chart ? 'block' : 'none'; if (L.chart) drawChart();
  const kw = $('#kwlist');
  if (kw) kw.innerHTML = KEYWORDS.map(([e, f, s]) => `<button data-s="${s}">${e}<small>${f}</small></button>`).join('');
  if (kw) kw.querySelectorAll('button').forEach((b) => b.onclick = () => applyStep(+b.dataset.s));
  $('#dots').innerHTML = STEPS.map((_, j) => `<i class="${j === stepIdx ? 'on' : seen.has(j) ? 'done' : ''}" data-j="${j}"></i>`).join('');
  $('#dots').querySelectorAll('i').forEach((d) => d.onclick = () => applyStep(+d.dataset.j));
  $('#bprev').disabled = stepIdx === 0;
  $('#bnext').textContent = stepIdx === STEPS.length - 1 ? 'Faire le quiz ▶' : 'Suivant ▶';
  $('#v-cours').scrollTop = 0;
  syncExplorer();
  try { localStorage.setItem('circ_step', String(stepIdx)); } catch (e) { /* stockage indisponible */ }
}
$('#bprev').onclick = () => { if (tab === 'cours') applyStep(stepIdx - 1); };
$('#bnext').onclick = () => {
  if (tab === 'cours') { if (stepIdx === STEPS.length - 1) setTab('quiz'); else applyStep(stepIdx + 1); }
};

// ======================================================================= graphique bilan radiatif
function drawChart() {
  const c = $('#chart'), g = c.getContext('2d'), W = c.width, H = c.height;
  g.clearRect(0, 0, W, H);
  const x0 = 70, x1 = W - 20, y0 = H - 46, y1 = 22, X = (lat) => x0 + (90 - lat) / 180 * (x1 - x0), Y = (w) => y0 - w / 450 * (y0 - y1);
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1.5; g.font = '600 20px -apple-system, Segoe UI, sans-serif'; g.fillStyle = '#93a1bd';
  for (const w of [0, 150, 300, 450]) { g.beginPath(); g.moveTo(x0, Y(w)); g.lineTo(x1, Y(w)); g.stroke(); g.textAlign = 'right'; g.fillText(w, x0 - 10, Y(w) + 7); }
  g.textAlign = 'center';
  for (const lat of [90, 60, 30, 0, -30, -60, -90]) g.fillText(Math.abs(lat) + '°' + (lat > 0 ? 'N' : lat < 0 ? 'S' : ''), X(lat), H - 14);
  // remplissage excédent / déficit
  for (let lat = 90; lat > -90; lat -= 0.5) {
    const a = M.absorbed(lat), o = M.outgoing(lat);
    g.fillStyle = a > o ? 'rgba(255,106,77,.55)' : 'rgba(90,162,255,.45)';
    g.fillRect(X(lat), Y(Math.max(a, o)), (x1 - x0) / 360 + 0.6, Y(Math.min(a, o)) - Y(Math.max(a, o)));
  }
  const curve = (f, col) => { g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); for (let lat = 90; lat >= -90; lat -= 1) { const x = X(lat), y = Y(f(lat)); lat === 90 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); };
  curve(M.absorbed, '#ffc35c'); curve(M.outgoing, '#7fb2ff');
  g.font = '700 20px -apple-system, Segoe UI, sans-serif'; g.textAlign = 'left';
  g.fillStyle = '#ffc35c'; g.fillText('reçu (absorbé)', x0 + 8, y1 + 8);
  g.fillStyle = '#7fb2ff'; g.fillText('émis (perdu)', x0 + 8, y1 + 34);
  g.fillStyle = '#ffd2c5'; g.textAlign = 'center'; g.fillText('EXCÉDENT', X(0), Y(300) - 6);
  g.fillStyle = '#c9dcff'; g.fillText('DÉFICIT', X(70), Y(110)); g.fillText('DÉFICIT', X(-70), Y(110));
  g.fillStyle = '#93a1bd'; g.font = '500 17px -apple-system, Segoe UI, sans-serif'; g.textAlign = 'right'; g.fillText('W/m²', x0 - 10, y1 - 4);
}

// ======================================================================= onglets
let tab = 'cours';
function setTab(t) {
  tab = t;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === t));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('on', v.id === 'v-' + (t === 'explore' ? 'explore' : t)));
  $('#nav').style.display = t === 'cours' ? 'flex' : 'none';
  if (t === 'quiz') startQuiz();
  if (t === 'cours') applyStep(stepIdx);
  if (t === 'explore') syncExplorer();
  $('#panel').classList.remove('min'); setTimeout(resize, 380);
}
document.querySelectorAll('.tabs button').forEach((b) => b.onclick = () => setTab(b.dataset.t));
$('#grab').onclick = () => { $('#panel').classList.toggle('min'); setTimeout(() => { resize(); }, 380); };

// ======================================================================= explorer
const TOGGLES = [['clouds', 'Nuages', '#ffffff'], ['surf', 'Vents au sol', '#ffc35c'], ['upper', 'Vents en altitude', '#ff6fc8'], ['press', 'Pressions A / D', '#ff6a4d'],
  ['section', 'Coupe des cellules', '#62e3a0'], ['rad', 'Bilan radiatif', '#ff9b5c'], ['grid', 'Parallèles 0/30/60°', '#cfd8ea'], ['highs', '5 anticyclones', '#ff8a7a'], ['labels', 'Étiquettes', '#5fd6ff']];
$('#tgs').innerHTML = TOGGLES.map(([k, n, c]) => `<button class="tg" data-k="${k}" style="--c:${c}">${n}</button>`).join('');
$('#tgs').querySelectorAll('.tg').forEach((b) => b.onclick = () => {
  const k = b.dataset.k, L = layer[k]; L.t = L.t > 0.5 ? 0 : (k === 'clouds' ? 0.9 : 1);
  if (k === 'labels' && L.t > 0.5 && !cur.labels) cur.labels = layer.section.t > 0.5 ? 'cells' : layer.press.t > 0.5 ? 'belts' : layer.surf.t > 0.5 ? 'winds' : layer.upper.t > 0.5 ? 'upper' : layer.rad.t > 0.5 ? 'rad' : 'clouds';
  if (k === 'section' && L.t > 0.5) cur.labels = 'cells';
  if (k === 'press' && L.t > 0.5) cur.labels = 'belts';
  if (k === 'rad' && L.t > 0.5) cur.labels = 'rad';
  syncExplorer();
});
$('#segw').querySelectorAll('button').forEach((b) => b.onclick = () => { layer.water.t = +b.dataset.w; syncExplorer(); });
$('#rm').oninput = (e) => { monthAnim = false; monthTarget = +e.target.value; P.month = monthTarget; syncExplorer(); };
$('#rr').oninput = (e) => { rotTarget = +e.target.value; P.rot = rotTarget; syncExplorer(); };
$('#rs').oninput = (e) => { timeScale = +e.target.value; syncExplorer(); };
$('#tauto').onclick = () => { controls.autoRotate = !controls.autoRotate; syncExplorer(); };
let tool = false, toolZ = 0.04;
$('#btool').onclick = () => { tool = !tool; syncExplorer(); };
$('#segz').querySelectorAll('button').forEach((b) => b.onclick = () => { toolZ = +b.dataset.z; syncExplorer(); });
$('#bclear').onclick = () => { while (parcels.length) removeParcel(parcels[0]); };
function monthName(m) { return MONTHS[Math.floor(((m % 12) + 12) % 12)]; }
function syncExplorer() {
  $('#tgs').querySelectorAll('.tg').forEach((b) => b.classList.toggle('on', layer[b.dataset.k].t > 0.5));
  $('#segw').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.w === (layer.water.t > 0.5 ? 1 : 0)));
  $('#rm').value = monthTarget; $('#om').textContent = monthName(monthTarget) + ' · ZCIT ' + itczTxt(monthTarget);
  $('#rr').value = rotTarget; $('#or').textContent = rotTarget < 0.02 ? 'sans rotation' : Math.round(rotTarget * 100) + ' %';
  $('#rs').value = timeScale; $('#os').textContent = '× ' + timeScale.toFixed(2).replace('.', ',');
  $('#tauto').classList.toggle('on', controls.autoRotate);
  $('#btool').classList.toggle('act', tool); $('#btool').textContent = tool ? '🎈 Touche le globe…' : '🎈 Lâcher une bulle';
  $('#segz').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.z === toolZ));
  updateLegend();
}
function itczTxt(m) { const s = M.seasonShift(m); return Math.abs(s) < 0.5 ? '≈ 0°' : '≈ ' + Math.abs(s).toFixed(0) + '°' + (s > 0 ? 'N' : 'S'); }
function updateLegend() {
  const parts = [];
  if (layer.surf.t > 0.5) parts.push(`<div class="lg"><b>Sol</b><span class="sw" style="--c:#ffbd4d">alizés</span><span class="sw" style="--c:#55d1ff">westerlies</span><span class="sw" style="--c:#dcdcff">polaires</span></div>`);
  if (layer.upper.t > 0.5) parts.push(`<div class="lg"><b>Altitude</b><span class="sw" style="--c:#5994ff">faible</span><span class="sw" style="--c:#ff61cc">JET</span></div>`);
  if (layer.press.t > 0.5) parts.push(`<div class="lg"><b>Pression</b><span class="sw" style="--c:#ff6a4d">A</span><span class="sw" style="--c:#4d9bff">D</span></div>`);
  if (layer.rad.t > 0.5) parts.push(`<div class="lg"><b>Bilan</b><span class="sw" style="--c:#ff5a3a">excédent</span><span class="sw" style="--c:#3d86ff">déficit</span></div>`);
  if (layer.section.t > 0.5) parts.push(`<div class="lg"><b>Coupe</b>altitudes ×70 · <span class="sw" style="--c:#ffe2a3">tropopause</span></div>`);
  $('#legend').innerHTML = parts.join('');
}

// ======================================================================= quiz
let qOrder = [], qi = 0, qScore = 0, qDone = false;
function startQuiz() {
  qOrder = QUIZ.map((_, i) => i).sort(() => Math.random() - 0.5); qi = 0; qScore = 0; renderQ();
}
function renderQ() {
  const el = $('#quiz');
  if (qi >= qOrder.length) {
    el.innerHTML = `<div class="qcard"><h3>Score : ${qScore} / ${qOrder.length}</h3><p>${qScore >= qOrder.length - 2 ? 'Excellent, tu maîtrises la circulation générale.' : qScore >= qOrder.length / 2 ? 'Pas mal ! Revois les étapes des questions ratées.' : 'Refais le parcours du cours, puis retente.'}</p>
      <div class="qbtns"><button class="btn pri" id="qre">Recommencer</button><button class="btn" id="qco">Revoir le cours</button></div></div>`;
    $('#qre').onclick = startQuiz; $('#qco').onclick = () => { stepIdx = 0; setTab('cours'); };
    return;
  }
  const Q = QUIZ[qOrder[qi]];
  el.innerHTML = `<div class="qcard"><div class="qtop"><span>QUESTION ${qi + 1} / ${qOrder.length}</span><span id="qsc">score ${qScore}</span></div><h3>${Q.q}</h3>
    <div class="opts">${Q.a.map((a, j) => `<button data-j="${j}">${a}</button>`).join('')}</div><div id="qex"></div></div>`;
  qDone = false;
  el.querySelectorAll('.opts button').forEach((b) => b.onclick = () => {
    if (qDone) return; qDone = true; const j = +b.dataset.j;
    if (j === Q.c) qScore++;
    $('#qsc').textContent = 'score ' + qScore;
    el.querySelectorAll('.opts button').forEach((x) => { const k = +x.dataset.j; if (k === Q.c) x.classList.add('ok'); else if (k === j) x.classList.add('ko'); });
    $('#qex').innerHTML = `<div class="expl">${j === Q.c ? '✅ ' : '❌ '}${Q.e}</div><div class="qbtns"><button class="btn" id="qsee">👁 Voir sur le globe</button><button class="btn pri" id="qnext">Suivante ▶</button></div>`;
    $('#qnext').onclick = () => { qi++; renderQ(); };
    $('#qsee').onclick = () => { stepIdx = Q.s; setTab('cours'); };
  });
}

// ======================================================================= interaction (bulle)
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null;
  if (moved > 8 || dt > 500 || !tool) return;
  const r = canvas.getBoundingClientRect();
  ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObject(globe)[0];
  if (!hit) return;
  const p = hit.point.clone().normalize();
  addParcel(Math.asin(p.y) / DEG, Math.atan2(-p.z, p.x), toolZ);
});

// ======================================================================= boucle
let last = performance.now(), frameN = 0, sunLon = 0, started = false;
const camSph = new THREE.Spherical();
function tick(now) {
  requestAnimationFrame(tick);
  const rdt = Math.min(0.05, (now - last) / 1000); last = now; frameN++;
  const dt = rdt * timeScale;
  P.t += dt;
  // fondus des couches
  for (const k in layer) { const L = layer[k]; L.v = lerp(L.v, L.t, Math.min(1, rdt * 3.2)); if (Math.abs(L.v - L.t) < 0.002) L.v = L.t; }
  // saison et rotation
  if (monthAnim) { monthTarget = 3.5 + 3 * Math.sin(P.t * 0.25 - Math.PI / 2); }
  P.month = lerp(P.month, monthTarget, Math.min(1, rdt * (monthAnim ? 6 : 2.5)));
  P.rot = lerp(P.rot, rotTarget, Math.min(1, rdt * 1.4)); if (Math.abs(P.rot - rotTarget) < 0.002) P.rot = rotTarget;
  U.uShift.value = M.seasonShift(); U.uRot.value = P.rot; U.uNight.value = lerp(U.uNight.value, cur.sunSide ? 0.62 : 0.3, Math.min(1, rdt * 3));
  // caméra
  if (fly) {
    fly.t = Math.min(1, (now - fly.t0) / 1000 / fly.dur); const e = 1 - Math.pow(1 - fly.t, 3);
    camSph.set(lerp(fly.from.radius, fly.to.radius, e), lerp(fly.from.phi, fly.to.phi, e), lerp(fly.from.theta, fly.to.theta, e));
    camera.position.setFromSpherical(camSph); camera.lookAt(0, 0, 0);
    if (fly.t >= 1) { fly = null; controls.enabled = true; }
  } else controls.update();
  // longitude face à la caméra, Soleil légèrement à droite
  const cp = camera.position, faceLon = Math.atan2(-cp.z, cp.x);
  const camLat = Math.asin(cp.y / cp.length()) / DEG;
  const wantSun = faceLon + (cur.sunSide ? -1.0 : 0.55);
  let dl = wantSun - sunLon; dl = Math.atan2(Math.sin(dl), Math.cos(dl)); sunLon += dl * Math.min(1, rdt * 2);
  const dec = M.declination() * DEG;
  sunDir.set(Math.cos(dec) * Math.cos(sunLon), Math.sin(dec), -Math.cos(dec) * Math.sin(sunLon)).normalize();
  sun.position.copy(sunDir).multiplyScalar(60);
  // uniforms
  const em = earthMat.uniforms;
  em.uWater.value = layer.water.v; em.uRad.value = layer.rad.v; em.uPress.value = layer.press.v; em.uGrid.value = layer.grid.v;
  em.uDim.value = 1 - 0.18 * Math.max(layer.section.v, layer.upper.v * 0.6);
  cloudMat.uniforms.uOpacity.value = layer.clouds.v;
  if (layer.clouds.v > 0.01 && (frameN % (isMobile ? 4 : 3) === 0 || frameN < 3)) {
    genMat.uniforms.uTime.value = P.t;
    renderer.setRenderTarget(cloudRT); renderer.render(genScene, genCam); renderer.setRenderTarget(null);
  }
  clouds.visible = layer.clouds.v > 0.01;
  // vents
  surf.st.mesh.visible = layer.surf.v > 0.01; surf.st.mat.uniforms.uOpacity.value = layer.surf.v;
  if (surf.st.mesh.visible) surf.update(dt);
  upper.st.mesh.visible = layer.upper.v > 0.01; upper.st.mat.uniforms.uOpacity.value = layer.upper.v * (isMobile ? 1 : 0.95);
  if (upper.st.mesh.visible) upper.update(dt);
  // coupe
  const secA = layer.section.v * (1 - M.smooth(52, 72, Math.abs(camLat)));
  curtain.visible = secA > 0.01; curtain.rotation.y = Math.atan2(cp.x, cp.z);
  curtain.userData.bg.material.uniforms.uOpacity.value = secA; sec.mat.uniforms.uOpacity.value = secA;
  if (curtain.visible) updateSection(dt);
  updateRing(dt, faceLon);
  updateRays(sunLon);
  updateParcels(dt);
  updateLabels(rdt, faceLon);
  // puces
  const mc = $('#mchip'), txt = monthName(P.month) + ' · ZCIT ' + itczTxt(P.month);
  if (mc.textContent !== txt) mc.textContent = txt;
  $('#rchip').style.display = P.rot < 0.5 ? 'block' : 'none';
  renderer.render(scene, camera);
}

function ready() {
  if (started) return; started = true;
  $('#loading').style.opacity = 0; setTimeout(() => $('#loading').remove(), 700);
}
resize();
let s0 = 0; try { s0 = +(localStorage.getItem('circ_step') || 0); } catch (e) { s0 = 0; }
const qs = new URLSearchParams(location.search);
if (qs.has('step')) s0 = +qs.get('step') - 1;
camera.position.copy(geo(20, -25 * DEG, 9));
applyStep(s0 || 0);
if (qs.get('tab')) setTab(qs.get('tab'));
syncExplorer();
requestAnimationFrame(tick);
setTimeout(ready, 9000); // au cas où une texture tarde
