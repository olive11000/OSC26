// Modèles 3D procéduraux : avion de ligne (type A320), avion léger (type SR20),
// réacteur en coupe sur son banc, cylindre de moteur à pistons en coupe. 1 unité = 1 m.
import * as THREE from 'three';

const DEG = Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;
export const P = (c, o = {}) => new THREE.MeshPhongMaterial({ color: c, shininess: 55, specular: 0x2a2f38, ...o });
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------------------------------------------------------------- profils et lofts
// épaisseur NACA 4 chiffres + cambrure simple
const yt = (u, t) => 5 * t * (0.2969 * Math.sqrt(Math.max(0, u)) - 0.126 * u - 0.3516 * u * u + 0.2843 * u ** 3 - 0.1015 * u ** 4);
const yc = (u, m) => (u < 0.4 ? m / 0.16 * (0.8 * u - u * u) : m / 0.36 * (0.2 + 0.8 * u - u * u));
// sts : [{ s, b, zle, c, t }] ; map(s, n, z) → [x, y, z] ; n = axe d'épaisseur
export function loft(sts, u0, u1, map, o = {}) {
  const nU = o.nU || 9, cam = o.camber ?? 0.02, ts = o.thick ?? 1;
  const us = [u0];
  for (let i = 1; i < nU; i++) { const k = i / nU; us.push(u0 + (u1 - u0) * (0.5 - 0.5 * Math.cos(Math.PI * k))); }
  us.push(u1);
  const pos = [], idx = [];
  const ring = (st) => {
    const r = [];
    const up = (u) => (o.shell ? yc(u, cam) + yt(u, st.t) + o.shell : yc(u, cam) + yt(u, st.t) * ts + (o.lift || 0));
    const lo = (u) => (o.shell ? yc(u, cam) + yt(u, st.t) - 0.002 : yc(u, cam) - yt(u, st.t) * ts + (o.lift || 0));
    for (const u of us) r.push(map(st.s, st.b + up(u) * st.c, st.zle + u * st.c));
    for (let i = us.length - 1; i >= 0; i--) { const u = us[i]; r.push(map(st.s, st.b + lo(u) * st.c, st.zle + u * st.c)); }
    return r;
  };
  const rings = sts.map(ring), m = rings[0].length;
  rings.forEach((r) => r.forEach((p) => pos.push(...p)));
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < m; i++) {
    const a = k * m + i, b = k * m + (i + 1) % m, c = (k + 1) * m + i, d = (k + 1) * m + (i + 1) % m;
    idx.push(a, b, c, b, d, c);
  }
  // bouchons (sommets dupliqués pour une normale nette)
  for (const [k, flip] of [[0, true], [rings.length - 1, false]]) {
    const base = pos.length / 3, r = rings[k];
    const cx = r.reduce((s, p) => s + p[0], 0) / m, cy = r.reduce((s, p) => s + p[1], 0) / m, cz = r.reduce((s, p) => s + p[2], 0) / m;
    r.forEach((p) => pos.push(...p)); pos.push(cx, cy, cz);
    for (let i = 0; i < m; i++) { const a = base + i, b = base + (i + 1) % m, c = base + m; if (flip) idx.push(a, c, b); else idx.push(a, b, c); }
  }
  if (map.flip) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// miroir en x en gardant les faces dans le bon sens
function mirrorX(g) {
  g = g.clone(); g.scale(-1, 1, 1);
  const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
  g.index.needsUpdate = true; g.computeVertexNormals(); return g;
}
function mirrorFix(g) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.index.needsUpdate = true; g.computeVertexNormals(); return g; }
// surface articulée : pivot sur la charnière A→B (x local = charnière)
function hinged(geo, A, B, mat) {
  const pivot = new THREE.Group(); pivot.position.copy(A);
  pivot.quaternion.setFromUnitVectors(V(1, 0, 0), B.clone().sub(A).normalize());
  pivot.updateMatrix();
  geo.applyMatrix4(pivot.matrix.clone().invert());
  const inner = new THREE.Group(); pivot.add(inner);
  const mesh = new THREE.Mesh(geo, mat); inner.add(mesh);
  pivot.userData = { inner, mesh };
  return pivot;
}
// stations d'une aile trapézoïdale
function stations(o) {
  const n = o.n || 6, out = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, s = lerp(o.s0, o.s1, k);
    out.push({ s, b: o.b0 + (s - o.s0) * Math.tan(o.dih * DEG), zle: o.z0 + (s - o.s0) * Math.tan(o.sweep * DEG), c: lerp(o.c0, o.c1, k), t: lerp(o.t0, o.t1, k) });
  }
  return out;
}
const sub = (o, k0, k1) => { const ds = o.s1 - o.s0; return { ...o, s0: o.s0 + ds * k0, s1: o.s0 + ds * k1, z0: o.z0 + ds * k0 * Math.tan(o.sweep * DEG), b0: o.b0 + ds * k0 * Math.tan(o.dih * DEG), c0: lerp(o.c0, o.c1, k0), c1: lerp(o.c0, o.c1, k1), t0: lerp(o.t0, o.t1, k0), t1: lerp(o.t0, o.t1, k1), n: Math.max(2, Math.round((o.n || 6) * (k1 - k0)) + 1) }; };
const ptOn = (o, k, u, n = 0) => { const s = lerp(o.s0, o.s1, k), c = lerp(o.c0, o.c1, k); return { s, n: o.b0 + (s - o.s0) * Math.tan(o.dih * DEG) + n * c, z: o.z0 + (s - o.s0) * Math.tan(o.sweep * DEG) + u * c, c }; };

function lathe(profile, seg = 40, mat, phiStart = 0, phiLength = Math.PI * 2) {
  // profile : [[r, z]] → axe z
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(r, z)), seg, phiStart, phiLength);
  g.rotateX(Math.PI / 2); // l'axe y du tour devient z
  return new THREE.Mesh(g, mat);
}
const reg = (parts, name, ...objs) => { (parts[name] = parts[name] || []).push(...objs); objs.forEach((o) => o.traverse((m) => { if (m.isMesh) m.userData.part = name; })); };

// ======================================================================= AVION DE LIGNE
export function makeAirliner() {
  const g = new THREE.Group(), parts = {}, anim = {}, anchors = {};
  const white = P(0xf3f5f8), belly = P(0xc9ced6), grey = P(0x9aa3ae), dark = P(0x2a2f38, { shininess: 90 }), blue = P(0x1d4fa8), glass = P(0x101a2c, { shininess: 120, specular: 0x6688aa });
  const metal = P(0xb8c0ca, { shininess: 90, specular: 0x666666 }), tyre = P(0x1c1e22, { shininess: 10 }), yellow = P(0xf3c21b);
  const skin = P(0xf1f3f6); // peau des ailes

  // ---------------------------------------------------------------- fuselage
  const prof = [[0, -18.6], [0.45, -18.42], [0.95, -18.0], [1.35, -17.35], [1.66, -16.5], [1.86, -15.5], [1.97, -14.3], [2.0, -13], [2.0, 8], [1.95, 9.8], [1.8, 11.6], [1.55, 13.4], [1.25, 15.0], [0.9, 16.6], [0.55, 18.0], [0.32, 18.9], [0.28, 19.05]];
  const fus = lathe(prof, 48, white);
  const fp = fus.geometry.attributes.position;
  for (let i = 0; i < fp.count; i++) { const z = fp.getZ(i); if (z > 8) fp.setY(i, fp.getY(i) + Math.pow(z - 8, 2) * 0.0105); if (fp.getY(i) < -1.2 && z > -14 && z < 8) fp.setY(i, fp.getY(i)); }
  fus.geometry.computeVertexNormals(); g.add(fus); reg(parts, 'fuselage', fus);
  // ventre gris (demi-tube intérieur légèrement plus grand)
  const bel = lathe([[2.005, -13], [2.005, 8]], 32, belly, Math.PI * 1.62, Math.PI * 0.76); g.add(bel); reg(parts, 'fuselage', bel);
  // bandeau bleu
  for (const ph of [0.519, 1.431]) { const band = lathe([[2.008, -13.6], [2.008, 7.8]], 6, blue, Math.PI * ph, Math.PI * 0.05); g.add(band); reg(parts, 'fuselage', band); }
  // hublots
  const winG = new THREE.BoxGeometry(0.06, 0.34, 0.24), wins = new THREE.InstancedMesh(winG, glass, 2 * 44), mtx = new THREE.Matrix4();
  let wi = 0; for (const side of [-1, 1]) for (let k = 0; k < 41; k++) { const z = -12.2 + k * 0.5; if (Math.abs(z + 1.2) < 0.4) continue; mtx.makeTranslation(side * 1.905, 0.62, z); wins.setMatrixAt(wi++, mtx); }
  wins.count = wi; g.add(wins); reg(parts, 'fuselage', wins);
  // portes
  for (const [z, side] of [[-13.2, -1], [-13.2, 1], [8.4, -1], [8.4, 1]]) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.85, 0.82), P(0xdfe3e9)); d.position.set(side * (z > 0 ? 1.975 : 1.99), 0.05, z); g.add(d); reg(parts, 'portes', d); }
  // poste de pilotage
  const visor = lathe([[1.36, -17.4], [1.53, -17.0], [1.67, -16.5], [1.78, -16.0]], 24, P(0x101a2c, { shininess: 120, specular: 0x6688aa }), Math.PI * 0.73, Math.PI * 0.54);
  visor.scale.set(1.006, 1.006, 1); g.add(visor); const cw = [visor];
  reg(parts, 'parebrise', ...cw); anchors.parebrise = V(0, 1.3, -16.6);
  // carénage ventral (packs)
  const fair = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), belly); fair.scale.set(2.3, 0.75, 7.2); fair.position.set(0, -1.55, 0.4); g.add(fair); reg(parts, 'carenage', fair);
  for (const s of [-1, 1]) { const ram = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.7), dark); ram.position.set(s * 0.9, -2.22, -3.6); ram.rotation.z = s * 0.2; g.add(ram); reg(parts, 'packs', ram); }
  anchors.packs = V(0, -2.3, -3.5);
  // vanne de décharge (outflow), à l'arrière droit
  const ofv = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.42), dark); ofv.position.set(1.8, -0.78, 11.2); ofv.rotation.z = -0.55; ofv.rotation.y = -0.08; g.add(ofv); reg(parts, 'outflow', ofv); anim.outflow = ofv; anchors.outflow = V(1.85, -0.8, 11.2);
  // sondes : Pitot, incidence, détecteur de givre
  const probes = [];
  for (const s of [-1, 1]) {
    const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.28, 8), metal); pt.rotation.z = Math.PI / 2; pt.position.set(s * 1.82, -0.15, -15.6); g.add(pt); probes.push(pt);
    const aoa = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.16), metal); aoa.position.set(s * 1.9, 0.25, -15.0); g.add(aoa); probes.push(aoa);
  }
  const icd = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.18, 8), yellow); icd.rotation.z = Math.PI / 2; icd.position.set(-1.84, 0.7, -14.4); g.add(icd); reg(parts, 'detecteur', icd);
  reg(parts, 'sondes', ...probes); anchors.sondes = V(1.95, -0.1, -15.6); anchors.detecteur = V(-1.9, 0.7, -14.4);
  // APU : sortie en pointe de queue, porte d'entrée d'air
  const apuEx = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.12, 16, 1, true), dark); apuEx.rotation.x = Math.PI / 2; apuEx.position.set(0, 1.27, 19.05); g.add(apuEx);
  const apuIn = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.5), dark); apuIn.position.set(0.32, 1.72, 16.4); apuIn.rotation.z = -0.5; g.add(apuIn);
  reg(parts, 'apu', apuEx, apuIn); anchors.apu = V(0, 1.4, 18.4);

  // ---------------------------------------------------------------- ailes
  const WING = { s0: 1.6, s1: 17.0, b0: -1.25, dih: 5.5, z0: -3.3, sweep: 26, c0: 6.6, c1: 1.55, t0: 0.15, t1: 0.105, n: 8 };
  const wmapR = (s, n, z) => [s, n, z], wmapL = (s, n, z) => [-s, n, z]; wmapL.flip = true;
  const wing = { R: new THREE.Group(), L: new THREE.Group() }; g.add(wing.R, wing.L);
  const surfaces = { flapR: [], flapL: [], ailR: null, ailL: null, splR: [], splL: [], slatR: [], slatL: [] };
  const U_SLAT = 0.13, U_TE = 0.76;
  for (const side of ['R', 'L']) {
    const map = side === 'R' ? wmapR : wmapL, grp = wing[side], sgn = side === 'R' ? 1 : -1;
    const mk = (o, u0, u1, mat, opt) => new THREE.Mesh(loft(stations(o), u0, u1, map, opt), mat);
    const box = mk(WING, U_SLAT, U_TE, skin); grp.add(box); reg(parts, 'aile', box); box.userData.skin = true;
    // bords de fuite : volets (0,03-0,62), aileron (0,66-0,94), parties fixes
    const te = [[0, 0.03, 'fix'], [0.03, 0.62, 'flap'], [0.62, 0.66, 'fix'], [0.66, 0.94, 'ail'], [0.94, 1, 'fix']];
    for (const [k0, k1, kind] of te) {
      const o = sub(WING, k0, k1), geo = loft(stations(o), U_TE, 1, map);
      const a = ptOn(WING, side === 'R' ? k0 : k1, U_TE), b = ptOn(WING, side === 'R' ? k1 : k0, U_TE);
      const A = V(...map(a.s, a.n + yc(U_TE, 0.02) * a.c, a.z)), B = V(...map(b.s, b.n + yc(U_TE, 0.02) * b.c, b.z));
      const mat = kind === 'fix' ? skin : P(kind === 'flap' ? 0xe4e8ee : 0xdde2ea);
      const hp = hinged(geo, A, B, mat); grp.add(hp);
      if (kind === 'flap') { surfaces['flap' + side].push(hp); reg(parts, 'volets', hp); }
      else if (kind === 'ail') { surfaces['ail' + side] = hp; reg(parts, 'ailerons', hp); }
      else reg(parts, 'aile', hp);
    }
    // becs de bord d'attaque (0,05-0,97)
    const slat = mk(sub(WING, 0.08, 0.97), 0, U_SLAT, P(0xe9edf2)); grp.add(slat); surfaces['slat' + side].push(slat); reg(parts, 'becs', slat);
    const fixLE = [mk(sub(WING, 0, 0.08), 0, U_SLAT, skin), mk(sub(WING, 0.97, 1), 0, U_SLAT, skin)]; fixLE.forEach((m) => { grp.add(m); reg(parts, 'aile', m); m.userData.skin = true; });
    // spoilers : 5 panneaux sur l'extrados
    for (let i = 0; i < 5; i++) {
      const k0 = 0.12 + i * 0.1, k1 = k0 + 0.095, o = sub(WING, k0, k1);
      const geo = loft(stations(o), 0.58, U_TE, map, { shell: 0.007, camber: 0.02 });
      const nU = yc(0.58, 0.02) + yt(0.58, 0.14), a = ptOn(WING, side === 'R' ? k0 : k1, 0.58, nU), b = ptOn(WING, side === 'R' ? k1 : k0, 0.58, nU);
      const A = V(...map(a.s, a.n, a.z)), B = V(...map(b.s, b.n, b.z));
      const hp = hinged(geo, A, B, P(0xd7dce4)); grp.add(hp); surfaces['spl' + side].push(hp); reg(parts, 'spoilers', hp);
    }
    // saumon (winglet)
    const tip = ptOn(WING, 1, 0.55);
    const wl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 1.0), blue); wl.position.set(sgn * (tip.s + 0.02), tip.n + 0.7, tip.z); wl.rotation.x = -0.3; grp.add(wl); reg(parts, 'aile', wl);
    // déperditeurs statiques au bord de fuite
    const wicks = [];
    for (const k of [0.7, 0.8, 0.9, 0.99]) { const p = ptOn(WING, k, 1.0); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), dark); w.rotation.x = Math.PI / 2; w.position.set(sgn * p.s, p.n + 0.02, p.z + 0.12); grp.add(w); wicks.push(w); }
    reg(parts, 'wicks', ...wicks);
    // feux de navigation (rouge à gauche, vert à droite)
    const nl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: side === 'R' ? 0x34ff6a : 0xff3b30 })); nl.position.set(sgn * (tip.s + 0.05), tip.n, tip.z - 0.4); grp.add(nl);
    // ---- structure interne (visible quand la peau devient transparente)
    const st = new THREE.Group(); st.visible = false; grp.add(st);
    const sMat = P(0xe0a040), rMat = P(0x5fd6ff), lMat = P(0x9fe870);
    const SP = (u, mat, name) => { // longeron : plaque mince le long de l'envergure
      const geo = loft(stations(WING), u - 0.008, u + 0.008, map, { nU: 2, thick: 0.92 }); const m = new THREE.Mesh(geo, mat); st.add(m); reg(parts, name, m); return m;
    };
    SP(0.16, sMat, 'longeron'); SP(0.66, sMat, 'longeron');
    for (let i = 0; i <= 12; i++) { // nervures
      const k = i / 12, o = sub(WING, Math.max(0, k - 0.004), Math.min(1, k + 0.004));
      const m = new THREE.Mesh(loft(stations({ ...o, n: 1 }), 0.16, 0.66, map, { thick: 0.94 }), rMat); st.add(m); reg(parts, 'nervure', m);
    }
    for (const u of [0.26, 0.36, 0.46, 0.56]) for (const up of [1, -1]) { // lisses
      const pts = [0, 0.5, 1].map((k) => { const p = ptOn(WING, k, u); const c = p.c; return V(...map(p.s, p.n + (yc(u, 0.02) + up * yt(u, lerp(WING.t0, WING.t1, k)) * 0.93) * c, p.z)); });
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.025, 4), lMat); st.add(m); reg(parts, 'lisse', m);
    }
    surfaces['struct' + side] = st;
    // ---- réservoir d'aile
    const tank = new THREE.Mesh(loft(stations(sub(WING, 0.02, 0.78)), 0.18, 0.64, map, { thick: 0.85 }), new THREE.MeshPhongMaterial({ color: 0x3aa0ff, transparent: true, opacity: 0.55, depthWrite: false })); tank.visible = false; grp.add(tank); reg(parts, 'reservoirs', tank);
    surfaces['tank' + side] = tank;
    // bords d'attaque chauffés (antigivrage) : liseré
    const lez = mk(sub(WING, 0.45, 0.97), 0, 0.035, new THREE.MeshPhongMaterial({ color: 0xff8a3c, emissive: 0x000000, transparent: true, opacity: 0.0, depthWrite: false }), { thick: 1.06 });
    lez.position.z -= 0.005; grp.add(lez); surfaces['antiice' + side] = lez; reg(parts, 'antigivrage', lez);
  }
  anim.surfaces = surfaces;
  anchors.aile = V(9, -0.4, 2.2); anchors.longeron = V(8, -0.3, 1.0); anchors.nervure = V(11, -0.2, 3.8); anchors.lisse = V(6, -0.4, 0.8);
  anchors.volets = V(5.5, -1.0, 2.0); anchors.ailerons = V(13.5, -0.3, 6.0); anchors.becs = V(10, -0.4, 0.9); anchors.spoilers = V(6.5, -0.4, 0.6); anchors.wicks = V(15.5, 0.2, 7.4);
  anchors.reservoirs = V(7, -0.6, 0.5); anchors.antigivrage = V(12, -0.1, 2.9);
  // réservoir central et réservoir de trim
  const ctank = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 4.2), new THREE.MeshPhongMaterial({ color: 0x3aa0ff, transparent: true, opacity: 0.5, depthWrite: false })); ctank.position.set(0, -1.3, 0.2); ctank.visible = false; g.add(ctank); reg(parts, 'reservoirs', ctank); surfaces.tankC = ctank;

  // ---------------------------------------------------------------- empennages
  const HT = { s0: 0.6, s1: 6.3, b0: 1.15, dih: 6, z0: 13.4, sweep: 31, c0: 3.7, c1: 1.35, t0: 0.11, t1: 0.09, n: 4 };
  surfaces.elev = [];
  for (const side of ['R', 'L']) {
    const map = side === 'R' ? wmapR : wmapL;
    const ht = new THREE.Mesh(loft(stations(HT), 0, 0.7, map, { camber: 0 }), white); g.add(ht); reg(parts, 'empennage', ht);
    const o = sub(HT, 0.06, 1), geo = loft(stations(o), 0.7, 1, map, { camber: 0 });
    const a = ptOn(HT, side === 'R' ? 0.06 : 1, 0.7), b = ptOn(HT, side === 'R' ? 1 : 0.06, 0.7);
    const hp = hinged(geo, V(...map(a.s, a.n, a.z)), V(...map(b.s, b.n, b.z)), P(0xdde2ea)); g.add(hp); surfaces.elev.push(hp); reg(parts, 'profondeur', hp);
    const fixe = new THREE.Mesh(loft(stations(sub(HT, 0, 0.06)), 0.7, 1, map, { camber: 0 }), white); g.add(fixe);
    const trimT = new THREE.Mesh(loft(stations(sub(HT, 0.05, 0.75)), 0.2, 0.6, map, { camber: 0, thick: 0.8 }), new THREE.MeshPhongMaterial({ color: 0x3aa0ff, transparent: true, opacity: 0.55, depthWrite: false })); trimT.visible = false; g.add(trimT); reg(parts, 'reservoirs', trimT); (surfaces.tankT = surfaces.tankT || []).push(trimT);
    for (const k of [0.97]) { const p = ptOn(HT, k, 1.0); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 6), dark); w.rotation.x = Math.PI / 2; w.position.set((side === 'R' ? 1 : -1) * p.s, p.n, p.z + 0.1); g.add(w); reg(parts, 'wicks', w); }
  }
  const VT = { s0: 1.2, s1: 7.4, b0: 0, dih: 0, z0: 12.0, sweep: 36, c0: 5.6, c1: 2.1, t0: 0.11, t1: 0.1, n: 4 };
  const vmap = (s, n, z) => [n, s + 0.35, z];
  const vt = new THREE.Mesh(loft(stations(VT), 0, 0.7, vmap, { camber: 0 }), blue); g.add(vt); reg(parts, 'empennage', vt);
  { const o = sub(VT, 0.03, 1), geo = loft(stations(o), 0.7, 1, vmap, { camber: 0 }); const a = ptOn(VT, 0.03, 0.7), b = ptOn(VT, 1, 0.7);
    const hp = hinged(geo, V(...vmap(a.s, a.n, a.z)), V(...vmap(b.s, b.n, b.z)), P(0x2a62c8)); g.add(hp); surfaces.rudder = hp; reg(parts, 'direction', hp);
    const tipP = ptOn(VT, 1, 1); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 6), dark); w.rotation.x = Math.PI / 2; w.position.set(0, tipP.s + 0.35, tipP.z + 0.1); g.add(w); reg(parts, 'wicks', w); }
  anchors.profondeur = V(4.5, 1.6, 17.6); anchors.direction = V(0, 5.5, 18.6); anchors.empennage = V(3.5, 1.5, 15.5);

  // ---------------------------------------------------------------- réacteurs
  anim.fans = []; anim.reversers = [];
  const engines = [];
  for (const side of [-1, 1]) {
    const e = new THREE.Group(); const span = 5.75, wp = ptOn(WING, (span - WING.s0) / (WING.s1 - WING.s0), 0);
    e.position.set(side * span, wp.n - 1.55, wp.z - 1.35); g.add(e); engines.push(e);
    const nac = lathe([[0.96, -2.1], [1.06, -2.06], [1.12, -1.85], [1.14, -1.3], [1.12, -0.4], [1.06, 0.2]], 40, P(0xe8ebef), 0, Math.PI * 2);
    nac.material.side = THREE.DoubleSide; e.add(nac); reg(parts, 'nacelle', nac);
    const lip = lathe([[0.97, -2.12], [1.05, -2.08], [1.08, -2.0]], 40, metal); e.add(lip); reg(parts, 'entree', lip);
    // capot arrière mobile (inverseur à grilles)
    const rev = new THREE.Group(); e.add(rev);
    const aft = lathe([[1.06, 0.2], [1.0, 0.9], [0.86, 1.55]], 40, P(0xe8ebef)); aft.material.side = THREE.DoubleSide; rev.add(aft); reg(parts, 'inverseur', aft);
    const casc = lathe([[1.0, 0.18], [1.0, 0.95]], 40, P(0x3b4350, { shininess: 10 })); e.add(casc); reg(parts, 'inverseur', casc);
    anim.reversers.push(rev);
    const core = lathe([[0.66, 1.0], [0.62, 1.6], [0.5, 2.3], [0.42, 2.55]], 32, grey); e.add(core); reg(parts, 'nacelle', core);
    const plug = lathe([[0.3, 2.5], [0.22, 2.85], [0.02, 3.1]], 24, dark); e.add(plug);
    const fanDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.05, 40), P(0x14161b)); fanDisk.rotation.x = Math.PI / 2; fanDisk.position.z = -1.55; e.add(fanDisk);
    const fan = new THREE.Group(); fan.position.z = -1.62; e.add(fan);
    for (let i = 0; i < 22; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.26), metal); b.position.y = 0.56; const h = new THREE.Group(); h.rotation.z = i / 22 * Math.PI * 2; b.rotation.y = 0.55; h.add(b); fan.add(h); }
    const spin = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.55, 24), P(0x22262d, { shininess: 120 })); spin.rotation.x = -Math.PI / 2; spin.position.z = -0.25; fan.add(spin);
    // spirale blanche du cône (repère de rotation)
    const mark = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 6, 20, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffffff })); mark.position.z = -0.25; mark.rotation.y = Math.PI / 2; fan.add(mark);
    reg(parts, 'fan', fan); anim.fans.push(fan);
    // mât
    const py = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.25, 3.6), white); py.position.set(0, 1.25, 0.3); py.rotation.x = -0.04; e.add(py); reg(parts, 'mat', py);
    // boucles de détection feu (cachées hors mission feu)
    const loops = new THREE.Group(); loops.visible = false; e.add(loops);
    for (const [r, z, col] of [[0.7, 0.6, 0xff3b30], [0.72, 1.2, 0xff3b30], [0.69, 0.9, 0xffc35c]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 6, 40), new THREE.MeshBasicMaterial({ color: col })); t.position.z = z; loops.add(t); }
    reg(parts, 'boucles', loops);
    // IDG sur le carter
    const idg = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.42, 16), P(0x6fc3ff)); idg.rotation.x = Math.PI / 2; idg.position.set(side * -0.55, -0.72, -0.5); e.add(idg); reg(parts, 'idg', idg);
    e.userData = { loops, idg };
  }
  anim.engines = engines;
  anchors.nacelle = engines[1].position.clone().add(V(0, 0.3, 0)); anchors.fan = engines[1].position.clone().add(V(0, 0, -2)); anchors.entree = engines[1].position.clone().add(V(0, 1.1, -2.1));
  anchors.inverseur = engines[1].position.clone().add(V(0.9, 0.5, 0.8)); anchors.boucles = engines[1].position.clone().add(V(0, 0.9, 0.9)); anchors.idg = engines[1].position.clone().add(V(-0.6, -0.9, -0.5)); anchors.mat = engines[1].position.clone().add(V(0, 1.6, 1.2));

  // ---------------------------------------------------------------- train d'atterrissage
  anim.gear = [];
  const mkWheel = (r, w) => { const gw = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 28), tyre); t.rotation.z = Math.PI / 2; gw.add(t); const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, w + 0.02, 18), metal); h.rotation.z = Math.PI / 2; gw.add(h); return gw; };
  for (const side of [-1, 1]) { // trains principaux : rentrée vers l'intérieur
    const piv = new THREE.Group(); piv.position.set(side * 3.75, -1.62, 0.9); g.add(piv);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.9, 14), metal); leg.position.y = -0.95; piv.add(leg);
    const oleo = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 12), P(0xe8eef6, { shininess: 140 })); oleo.position.y = -2.05; piv.add(oleo);
    const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.15, 10), metal); ax.rotation.z = Math.PI / 2; ax.position.y = -2.45; piv.add(ax);
    for (const dx of [-0.42, 0.42]) { const w = mkWheel(0.58, 0.38); w.position.set(dx, -2.45, 0); piv.add(w); }
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.06), metal); tl.position.set(0, -1.75, 0.22); tl.rotation.x = 0.5; piv.add(tl);
    const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), metal); stay.position.set(-side * 0.75, -0.55, 0); stay.rotation.z = side * 1.05; piv.add(stay);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.5, 0.9), belly); door.position.set(side * 0.18, -0.85, 0); piv.add(door);
    reg(parts, 'train', piv); anim.gear.push({ piv, axis: 'z', dir: -side, max: 88 * DEG });
  }
  { const piv = new THREE.Group(); piv.position.set(0, -1.55, -14.6); g.add(piv); // train avant : rentrée vers l'avant
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0, 12), metal); leg.position.y = -1.0; piv.add(leg);
    const oleo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 12), P(0xe8eef6, { shininess: 140 })); oleo.position.y = -2.3; piv.add(oleo);
    for (const dx of [-0.24, 0.24]) { const w = mkWheel(0.38, 0.26); w.position.set(dx, -2.72, 0); piv.add(w); }
    const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 10), metal); ax.rotation.z = Math.PI / 2; ax.position.y = -2.72; piv.add(ax);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), metal); tl.position.set(0, -2.2, -0.17); tl.rotation.x = -0.5; piv.add(tl);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff6d0 })); lamp.position.set(0, -1.5, -0.12); piv.add(lamp);
    reg(parts, 'train', piv); anim.gear.push({ piv, axis: 'x', dir: 1, max: 88 * DEG, nose: true }); }
  // cases de train
  for (const [x, z, w, l] of [[0, -13.3, 0.7, 2.8], [-2.3, 0.9, 1.4, 1.5], [2.3, 0.9, 1.4, 1.5]]) { const bay = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, l), P(0x30353d)); bay.position.set(x, x ? -2.26 : -1.985, z); g.add(bay); }
  anchors.train = V(3.9, -3.2, 0.9); anchors.trainAvant = V(0, -3.6, -14.6);
  // RAT (éolienne de secours), rentrée dans le carénage
  const rat = new THREE.Group(); rat.position.set(1.0, -2.0, -2.0); g.add(rat);
  const ratArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), metal); ratArm.position.y = -0.45; rat.add(ratArm);
  const ratHub = new THREE.Group(); ratHub.position.set(0, -0.9, -0.15); rat.add(ratHub);
  for (let i = 0; i < 2; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.02), yellow); b.rotation.z = i * Math.PI; b.position.y = 0; const h = new THREE.Group(); h.rotation.z = i * Math.PI; b.position.y = 0.4; h.add(b); ratHub.add(h); }
  rat.rotation.x = -Math.PI / 2 + 0.05; rat.visible = false; reg(parts, 'rat', rat); anim.rat = { rat, hub: ratHub, k: 0 }; anchors.rat = V(1.0, -3.0, -2.0);
  // batterie et baie avionique (repère sous le poste)
  const bat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), P(0x62e3a0, { emissive: 0x0a3020 })); bat.position.set(0, -1.0, -13.4); bat.visible = false; g.add(bat); reg(parts, 'batterie', bat); anchors.batterie = V(0, -1.0, -13.4); anim.battery = bat;
  // ombre douce sous l'avion
  return { group: g, parts, anim, anchors, WING };
}

// ======================================================================= AVION LÉGER (type SR20)
export function makeLightAircraft() {
  const g = new THREE.Group(), parts = {}, anim = {}, anchors = {};
  const white = P(0xf6f6f2), red = P(0xc8362c), dark = P(0x24282f), glass = P(0x1a2a40, { shininess: 120, transparent: true, opacity: 0.78 }), metal = P(0xb7bec7, { shininess: 90 }), tyre = P(0x1c1e22, { shininess: 10 });
  // fuselage arrière (à partir de la cloison pare-feu, z = -1,55) + capots moteur en deux moitiés
  const fus = lathe([[0.64, -1.56], [0.64, -1.4], [0.64, -0.2], [0.56, 0.8], [0.42, 1.8], [0.28, 2.9], [0.16, 3.9], [0.1, 4.3], [0.0, 4.32]], 36, white);
  const fp = fus.geometry.attributes.position; for (let i = 0; i < fp.count; i++) { const z = fp.getZ(i); fp.setY(i, fp.getY(i) + (z > 0.5 ? (z - 0.5) * 0.06 : 0)); } fus.geometry.computeVertexNormals();
  g.add(fus); reg(parts, 'fuselageL', fus);
  const fw = new THREE.Mesh(new THREE.CircleGeometry(0.63, 32), P(0x6d747e)); fw.position.z = -1.555; fw.rotation.y = Math.PI; g.add(fw); reg(parts, 'parefeu', fw);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), glass); canopy.scale.set(0.56, 0.5, 1.45); canopy.position.set(0, 0.42, -0.55); g.add(canopy);
  for (const ph of [0.53, 1.37]) g.add(lathe([[0.645, -1.5], [0.645, 0.6]], 4, red, Math.PI * ph, Math.PI * 0.1));
  const WL = { s0: 0.55, s1: 5.85, b0: -0.42, dih: 4.5, z0: -1.35, sweep: 2, c0: 1.55, c1: 0.95, t0: 0.15, t1: 0.12, n: 5 };
  for (const side of [1, -1]) {
    const map = (s, n, z) => [side * s, n, z]; map.flip = side < 0;
    const geo = loft(stations(WL), 0, 1, map); const w = new THREE.Mesh(geo, white); g.add(w); reg(parts, 'aileL', w);
    const tipP = ptOn(WL, 1, 0.3); const nl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: side > 0 ? 0x34ff6a : 0xff3b30 })); nl.position.set(side * (tipP.s + 0.03), tipP.n, tipP.z); g.add(nl);
  }
  const HTL = { s0: 0.1, s1: 1.75, b0: 0.42, dih: 0, z0: 3.3, sweep: 8, c0: 0.95, c1: 0.6, t0: 0.1, t1: 0.09, n: 2 };
  for (const side of [1, -1]) { const mp = (s, n, z) => [side * s, n, z]; mp.flip = side < 0; const geo = loft(stations(HTL), 0, 1, mp, { camber: 0 }); const m = new THREE.Mesh(geo, white); g.add(m); reg(parts, 'aileL', m); }
  const VTL = { s0: 0.2, s1: 1.55, b0: 0, dih: 0, z0: 3.0, sweep: 32, c0: 1.3, c1: 0.62, t0: 0.11, t1: 0.1, n: 2 };
  const vt = new THREE.Mesh(loft(stations(VTL), 0, 1, (s, n, z) => [n, s + 0.35, z], { camber: 0 }), red); g.add(vt);
  // train fixe tricycle avec carénages (sol à y = -1,49)
  const legM = P(0x2b2f36);
  for (const [x, z, r] of [[-1.25, 0.25, 0.29], [1.25, 0.25, 0.29], [0, -2.55, 0.24]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.18), legM); leg.position.set(x * 0.85, -0.82, z); leg.rotation.z = -x * 0.32; g.add(leg);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.14, 20), tyre); t.rotation.z = Math.PI / 2; t.position.set(x, -1.49 + r, z); g.add(t);
    const fair = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), white); fair.scale.set(0.15, r * 0.85, 0.5); fair.position.set(x, -1.49 + r + 0.06, z); g.add(fair);
  }
  // capots moteur : moitié haute et moitié basse, qui s'écartent pour montrer le moteur
  const cowlProf = [[0.24, -3.18], [0.48, -2.95], [0.6, -2.45], [0.64, -1.95], [0.645, -1.56]];
  const cowlTop = lathe(cowlProf, 32, white, Math.PI * 0.5, Math.PI); cowlTop.material = P(0xf6f6f2, { side: THREE.DoubleSide });
  const cowlBot = lathe(cowlProf, 32, P(0xf6f6f2, { side: THREE.DoubleSide }), Math.PI * 1.5, Math.PI);
  const cowl = new THREE.Group(); cowl.add(cowlTop); g.add(cowl); const cowlB = new THREE.Group(); cowlB.add(cowlBot); g.add(cowlB);
  reg(parts, 'capot', cowlTop, cowlBot); anim.cowl = cowl; anim.cowlB = cowlB;
  for (const s of [-1, 1]) { const flap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.22), dark); flap.position.set(s * 0.26, -0.6, -1.66); flap.rotation.x = 0.0; g.add(flap); reg(parts, 'cowlflaps', flap); (anim.cowlFlaps = anim.cowlFlaps || []).push(flap); }
  anchors.cowlflaps = V(0.4, -0.9, -1.45);
  // moteur à plat 4 cylindres sous le capot
  const eng = new THREE.Group(); eng.position.set(0, -0.05, -2.35); g.add(eng);
  const crank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.78), P(0x8b929c, { shininess: 70 })); eng.add(crank); reg(parts, 'carter', crank);
  const cylM = P(0x50565f, { shininess: 30 }), headM = P(0x9aa3ae, { shininess: 50 });
  for (const s of [-1, 1]) for (const z of [-0.2, 0.2]) {
    const zz = z + (s > 0 ? 0.06 : -0.06);
    const cy = new THREE.Group(); cy.position.set(s * 0.21, 0.02, zz); eng.add(cy);
    for (let k = 0; k < 7; k++) { const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.018, 18), cylM); fin.rotation.z = Math.PI / 2; fin.position.x = s * (0.03 + k * 0.035); cy.add(fin); }
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.27, 14), cylM); core.rotation.z = Math.PI / 2; core.position.x = s * 0.13; cy.add(core);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.22), headM); head.position.x = s * 0.31; cy.add(head);
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.09, 6), P(0xffffff)); plug.position.set(s * 0.31, -0.12, 0); cy.add(plug);
    const ex = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.024, 6, 12, Math.PI / 2), P(0x8a6a4a, { shininess: 20 })); ex.position.set(s * 0.25, -0.12, 0); ex.rotation.set(0, s > 0 ? 0 : Math.PI, Math.PI); cy.add(ex);
    reg(parts, 'cylindres', cy); reg(parts, 'echappement', ex);
  }
  const sump = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.55), P(0x6d747e)); sump.position.set(0, -0.25, 0.05); eng.add(sump); reg(parts, 'carterhuile', sump);
  const carb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.14), P(0xd9a441)); carb.position.set(0, -0.38, -0.05); eng.add(carb); reg(parts, 'carburateur', carb);
  const airbox = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.3, 10), P(0x3d434b)); airbox.position.set(0, -0.46, -0.28); airbox.rotation.x = 1.2; eng.add(airbox); reg(parts, 'carburateur', airbox);
  for (const s of [-1, 1]) { const mg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.13, 12), P(0x2f6fd8)); mg.rotation.x = Math.PI / 2; mg.position.set(s * 0.09, 0.14, 0.45); eng.add(mg); reg(parts, 'magnetos', mg); }
  const gov = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 10), P(0xb48cff)); gov.position.set(0.14, 0.22, -0.2); eng.add(gov); reg(parts, 'regulateur', gov);
  anchors.cylindres = V(0.5, 0.15, -2.35); anchors.carburateur = V(0, -0.65, -2.4); anchors.magnetos = V(0, 0.35, -1.9); anchors.carterhuile = V(0.1, -0.55, -1.95); anchors.echappement = V(-0.6, -0.12, -2.8); anchors.regulateur = V(0.2, 0.4, -2.5);
  // hélice 3 pales à pas variable
  const prop = new THREE.Group(); prop.position.set(0, 0.02, -3.32); g.add(prop);
  const spin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 20), P(0xf4f4f0, { shininess: 120 })); spin.rotation.x = -Math.PI / 2; spin.position.z = -0.12; prop.add(spin);
  const blades = [];
  for (let i = 0; i < 3; i++) {
    const arm = new THREE.Group(); arm.rotation.z = i / 3 * Math.PI * 2; prop.add(arm);
    const pitch = new THREE.Group(); arm.add(pitch); // rotation autour de l'axe de pale (y)
    const sh = new THREE.Shape(); sh.moveTo(-0.05, 0.12); sh.quadraticCurveTo(-0.11, 0.6, -0.07, 0.95); sh.lineTo(0.0, 0.98); sh.quadraticCurveTo(0.08, 0.6, 0.06, 0.12); sh.lineTo(-0.05, 0.12);
    const bl = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.018, bevelEnabled: false }), P(0x22252b, { shininess: 60 }));
    bl.position.z = -0.009; pitch.add(bl);
    const tipC = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.02), P(0xffd200)); tipC.position.y = 0.92; pitch.add(tipC);
    blades.push(pitch);
  }
  reg(parts, 'helice', prop); anim.prop = { prop, blades, rpm: 0, pitch: 18 * DEG }; anchors.helice = V(0, 1.1, -3.4);
  return { group: g, parts, anim, anchors };
}

// ======================================================================= RÉACTEUR EN COUPE SUR BANC
export function makeTurbofanCutaway(clip) {
  const g = new THREE.Group(), parts = {}, anim = {}, anchors = {};
  const C = (c, o = {}) => P(c, { side: THREE.DoubleSide, clippingPlanes: clip, clipShadows: true, ...o });
  const mats = { cowl: C(0xd9dee6), fan: C(0x7fd0ff), lpc: C(0x5fd6ff), hpc: C(0x3fb0e8), comb: C(0xff8a3c, { emissive: 0x401000 }), hpt: C(0xff5a4a), lpt: C(0xd04a8a), noz: C(0x9aa3ae), shaftLP: C(0x62e3a0), shaftHP: C(0xffc35c), dark: C(0x2a2f38), gear: C(0xb48cff) };
  // axe du moteur : z local, de -3 (entrée) à +3,2 (sortie)
  const rot = new THREE.Group(); g.add(rot); // éléments fixes
  const cowl = lathe([[1.22, -3.0], [1.3, -2.9], [1.34, -2.4], [1.34, -1.0], [1.28, 0.2], [1.18, 1.0], [1.1, 1.5]], 48, mats.cowl); rot.add(cowl); reg(parts, 'f_cowl', cowl);
  const inner = lathe([[1.16, -2.95], [1.2, -2.4], [1.2, -1.0], [1.12, 0.3], [1.05, 1.45]], 48, mats.cowl); rot.add(inner);
  const coreCase = lathe([[0.62, -1.35], [0.62, -0.6], [0.56, 0.4], [0.5, 1.3], [0.56, 2.1], [0.62, 2.6], [0.52, 3.2]], 48, C(0xc4cad3)); rot.add(coreCase); reg(parts, 'f_core', coreCase);
  const splitter = lathe([[0.64, -1.4], [0.7, -1.3], [0.66, -1.0]], 48, mats.dark); rot.add(splitter);
  const plug = lathe([[0.3, 2.6], [0.26, 3.1], [0.05, 3.6]], 32, mats.noz); rot.add(plug); reg(parts, 'f_tuyere', plug);
  const combustor = lathe([[0.42, 0.5], [0.5, 0.65], [0.52, 1.0], [0.48, 1.25], [0.42, 1.3], [0.36, 1.0], [0.36, 0.65], [0.42, 0.5]], 40, mats.comb); rot.add(combustor); reg(parts, 'f_chambre', combustor);
  const flame = lathe([[0.4, 0.7], [0.46, 0.85], [0.45, 1.1], [0.4, 1.15], [0.4, 0.7]], 30, new THREE.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: 0.0, side: THREE.DoubleSide, clippingPlanes: clip, depthWrite: false, blending: THREE.AdditiveBlending })); rot.add(flame); anim.flame = flame;
  // rotors
  const lp = new THREE.Group(), hp = new THREE.Group(); g.add(lp, hp);
  const stage = (grp, z, rIn, rOut, n, mat, chord = 0.08, twist = 0.6) => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(rIn, rIn, chord * 0.8, 28), mat); disc.rotation.x = Math.PI / 2; disc.position.z = z; grp.add(disc);
    for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.018, rOut - rIn, chord), mat); b.position.y = (rIn + rOut) / 2; b.rotation.y = twist; const h = new THREE.Group(); h.position.z = z; h.rotation.z = i / n * Math.PI * 2; h.add(b); grp.add(h); }
    return disc;
  };
  // soufflante
  for (let i = 0; i < 20; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.88, 0.34), mats.fan); b.position.y = 0.72; b.rotation.y = 0.6; const h = new THREE.Group(); h.position.z = -2.2; h.rotation.z = i / 20 * Math.PI * 2; h.add(b); lp.add(h); }
  const spin = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 28), C(0x22262d)); spin.rotation.x = -Math.PI / 2; spin.position.z = -2.5; lp.add(spin);
  const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.3, 28), C(0x22262d)); fanHub.rotation.x = Math.PI / 2; fanHub.position.z = -2.12; lp.add(fanHub);
  reg(parts, 'f_fan', lp);
  // compresseur BP (booster) : 3 étages
  for (let k = 0; k < 3; k++) stage(lp, -1.75 + k * 0.17, 0.3, 0.58 - k * 0.03, 28, mats.lpc);
  // compresseur HP : 8 étages, veine convergente
  for (let k = 0; k < 8; k++) stage(hp, -0.95 + k * 0.17, 0.27 + k * 0.006, 0.5 - k * 0.018, 30, mats.hpc, 0.07);
  // turbine HP (2) et BP (4)
  for (let k = 0; k < 2; k++) stage(hp, 1.5 + k * 0.16, 0.3, 0.47, 32, mats.hpt, 0.07, -0.55);
  for (let k = 0; k < 4; k++) stage(lp, 1.95 + k * 0.17, 0.3, 0.5 + k * 0.03, 32, mats.lpt, 0.08, -0.55);
  // arbres : BP (long, vert) dans HP (court, jaune)
  const sLP = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 5.0, 16), mats.shaftLP); sLP.rotation.x = Math.PI / 2; sLP.position.z = 0.0; lp.add(sLP); reg(parts, 'f_arbres', sLP);
  const sHP = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.75, 16, 1, true), mats.shaftHP); sHP.rotation.x = Math.PI / 2; sHP.position.z = 0.35; hp.add(sHP); reg(parts, 'f_arbres', sHP);
  // boîtier d'accessoires sous le carter, arbre de renvoi
  const agb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.8), mats.gear); agb.position.set(0, -1.48, -1.0); rot.add(agb); reg(parts, 'f_agb', agb);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.15, 8), mats.gear); tower.position.set(0, -0.85, -0.7); rot.add(tower);
  const starter = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.25, 14), C(0x62e3a0)); starter.rotation.x = Math.PI / 2; starter.position.set(0.22, -1.52, -0.45); rot.add(starter); reg(parts, 'f_demarreur', starter);
  const idg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.32, 14), C(0x6fc3ff)); idg.rotation.x = Math.PI / 2; idg.position.set(-0.22, -1.52, -1.25); rot.add(idg); reg(parts, 'f_idg', idg);
  for (const a of [0.9, -0.9]) { const ig = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6), C(0xffffff)); ig.position.set(Math.sin(a) * 0.62, Math.cos(a) * 0.62, 0.75); ig.rotation.z = -a; rot.add(ig); reg(parts, 'f_allumeurs', ig); }
  // banc
  const stand = new THREE.Group(); g.add(stand);
  const sm = P(0x3b4350);
  for (const z of [-1.6, 1.8]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.4, 0.16), sm); leg.position.set(0, -1.9, z); stand.add(leg); const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.05, 6, 20, Math.PI), sm); yoke.position.z = z; yoke.rotation.z = Math.PI; stand.add(yoke); }
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 4.6), sm); base.position.set(0, -2.6, 0.1); stand.add(base);
  // flux d'air animé (points)
  const N = 420, ptsG = new THREE.BufferGeometry(), arr = new Float32Array(N * 3), col = new Float32Array(N * 3);
  ptsG.setAttribute('position', new THREE.BufferAttribute(arr, 3)); ptsG.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const flow = new THREE.Points(ptsG, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, clippingPlanes: clip }));
  g.add(flow);
  const seeds = Array.from({ length: N }, (_, i) => ({ s: Math.random(), a: Math.random() * Math.PI * 2, core: i % 5 === 0, r: Math.random() }));
  anim.flow = { flow, seeds, arr, col, speed: 0 };
  anim.lp = lp; anim.hp = hp; anim.marker = null;
  // repère de la traversée
  const mk = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.035, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffc35c, transparent: true, opacity: 0.9, clippingPlanes: clip })); mk.visible = false; g.add(mk); anim.marker = mk;
  anchors.f_fan = V(0, 1.6, -2.2); anchors.f_lpc = V(0, -0.62, -1.6); anchors.f_hpc = V(0, 0.62, -0.4); anchors.f_chambre = V(0, -0.55, 0.9); anchors.f_hpt = V(0, 0.55, 1.6); anchors.f_lpt = V(0, -0.6, 2.3); anchors.f_tuyere = V(0, 0.55, 3.4);
  anchors.f_froid = V(0, 1.75, 0.6); anchors.f_arbres = V(0, 0.2, 0.3); anchors.f_agb = V(0, -1.25, -0.95); anchors.f_demarreur = V(0.4, -1.95, 0.25); anchors.f_idg = V(-0.45, -1.95, -1.95); anchors.f_allumeurs = V(0.7, 0.75, 0.75);
  return { group: g, parts, anim, anchors, mats };
}

// ======================================================================= CYLINDRE EN COUPE (4 temps)
export function makePistonCutaway() {
  const g = new THREE.Group(), parts = {}, anim = {}, anchors = {};
  const R = 0.34, STROKE = 0.5, ROD = 0.85; // rayon d'alésage, course, bielle
  const glass = new THREE.MeshPhongMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, shininess: 120 });
  const steel = P(0xb8c0ca, { shininess: 90 }), dark = P(0x3b4350), copper = P(0xc98a4a);
  const TOP = 1.55; // haut du cylindre (y)
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 1.15, 32, 1, true), glass); cyl.position.y = TOP - 0.575; g.add(cyl); reg(parts, 'p_cylindre', cyl);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 0.85), P(0x7c8590)); head.position.y = TOP + 0.11; g.add(head); reg(parts, 'p_culasse', head);
  // conduits d'admission (bleu) et d'échappement (gris)
  const inP = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.7, 12), P(0x3f8cff)); inP.rotation.z = Math.PI / 2 - 0.5; inP.position.set(-0.62, TOP + 0.32, 0); g.add(inP); reg(parts, 'p_admission', inP);
  const exP = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.7, 12), P(0x8a6a4a)); exP.rotation.z = -Math.PI / 2 + 0.5; exP.position.set(0.62, TOP + 0.32, 0); g.add(exP); reg(parts, 'p_echappement', exP);
  // soupapes
  const valve = (x, mat) => { const v = new THREE.Group(); const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), steel); stem.position.y = 0.25; v.add(stem); const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.06, 0.04, 20), mat); v.add(hd); v.position.set(x, TOP - 0.02, 0); g.add(v); return v; };
  const vIn = valve(-0.16, P(0x3f8cff)), vEx = valve(0.16, P(0xff8a3c)); reg(parts, 'p_soupapes', vIn, vEx);
  const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), P(0xffffff)); plug.position.set(0, TOP + 0.2, 0.2); g.add(plug); reg(parts, 'p_bougie', plug);
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); spark.position.set(0, TOP - 0.05, 0.16); g.add(spark);
  // gaz dans la chambre
  const gasM = new THREE.MeshBasicMaterial({ color: 0x5fa8ff, transparent: true, opacity: 0.45, depthWrite: false });
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 1, 28), gasM); g.add(gas);
  // piston, axe, bielle, vilebrequin
  const piston = new THREE.Group(); g.add(piston);
  const pBody = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.01, R - 0.01, 0.3, 28), steel); piston.add(pBody);
  for (const y of [0.09, 0.05]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(R - 0.005, 0.008, 6, 28), dark); ring.rotation.x = Math.PI / 2; ring.position.y = y; piston.add(ring); }
  reg(parts, 'p_piston', piston);
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.07, ROD, 0.05), P(0xffc35c)); g.add(rod); reg(parts, 'p_bielle', rod);
  const crankC = new THREE.Vector3(0, 0, 0); // centre du vilebrequin
  const crank = new THREE.Group(); crank.position.copy(crankC); g.add(crank);
  const web = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 28), P(0x62e3a0)); web.rotation.x = Math.PI / 2; web.position.z = -0.1; crank.add(web);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), steel); pin.rotation.x = Math.PI / 2; pin.position.y = STROKE / 2; crank.add(pin);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), steel); shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.4; crank.add(shaft);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.02), P(0xffffff)); mark.position.set(0, 0.18, -0.15); crank.add(mark);
  reg(parts, 'p_vilebrequin', crank);
  // arbre à cames (demi-vitesse)
  const cam = new THREE.Group(); cam.position.set(0, TOP + 0.55, -0.1); g.add(cam);
  const camS = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), steel); camS.rotation.z = Math.PI / 2; cam.add(camS);
  for (const x of [-0.16, 0.16]) { const lobe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 3), P(0xb48cff)); lobe.rotation.z = Math.PI / 2; lobe.position.x = x; cam.add(lobe); }
  reg(parts, 'p_cames', cam);
  const caseB = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.9), new THREE.MeshPhongMaterial({ color: 0x5a626d, transparent: true, opacity: 0.35, depthWrite: false })); caseB.position.y = -0.1; g.add(caseB);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 1.2), dark); stand.position.y = -0.4; g.add(stand);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 10), dark); pole.position.y = -0.85; g.add(pole);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.08, 20), dark); foot.position.y = -1.3; g.add(foot);
  // pose selon l'angle du vilebrequin (0° = PMH au début de l'admission)
  const set = (deg) => {
    const th = deg * DEG, r = STROKE / 2;
    const px = r * Math.sin(th), py = r * Math.cos(th);
    const pinY = py + Math.sqrt(ROD * ROD - px * px); // hauteur de l'axe de piston
    piston.position.y = pinY + 0.12; crank.rotation.z = -th;
    rod.position.set(px / 2, (py + pinY) / 2, 0); rod.rotation.z = Math.atan2(px, pinY - py);
    const top = piston.position.y + 0.15, h = Math.max(0.02, TOP - top);
    gas.scale.y = h; gas.position.y = top + h / 2;
    const c = ((deg % 720) + 720) % 720, stroke = Math.floor(c / 180);
    const lift = (x, a, b) => (x > a && x < b ? Math.sin((x - a) / (b - a) * Math.PI) * 0.1 : 0);
    vIn.position.y = TOP - 0.02 - Math.max(lift(c, -10, 200), lift(c - 720, -10, 200));
    vEx.position.y = TOP - 0.02 - lift(c < 10 ? c + 720 : c, 520, 730);
    cam.rotation.x = -th / 2;
    const cols = [0x5fa8ff, 0x9a7dff, 0xff7a2a, 0x8a8f98];
    gasM.color.setHex(cols[stroke]); gasM.opacity = stroke === 1 ? 0.35 + (c - 180) / 180 * 0.35 : stroke === 2 ? 0.75 - (c - 360) / 180 * 0.4 : 0.42;
    spark.material.opacity = c > 345 && c < 375 ? 1 - Math.abs(c - 360) / 15 : 0;
    anim.angle = c; anim.stroke = stroke;
  };
  anim.set = set; anim.speed = 0; anim.deg = 0; set(0);
  anchors.p_piston = V(0.55, 1.0, 0); anchors.p_soupapes = V(-0.5, TOP + 0.12, 0.3); anchors.p_bougie = V(0.22, TOP + 0.5, 0.35); anchors.p_bielle = V(0.4, 0.6, 0); anchors.p_vilebrequin = V(0.5, 0, 0);
  anchors.p_admission = V(-0.9, TOP + 0.55, 0); anchors.p_echappement = V(0.9, TOP + 0.55, 0); anchors.p_cames = V(0, TOP + 0.75, -0.1);
  return { group: g, parts, anim, anchors };
}
