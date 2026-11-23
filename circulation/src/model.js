// Modèle idéalisé de la circulation générale (cours EISPN 050-02-03-01).
// Tout est en moyenne zonale (Terre « uniformément couverte d'eau »), sauf les ondes de Rossby.
export const DEG = Math.PI / 180;
export const KT = 1.9438; // m/s -> kt
export const OMEGA_R = 465; // vitesse de la surface à l'équateur (m/s)

export const P = {
  month: 3.7,   // 0 = 1er janvier, 12 = fin décembre
  rot: 1,       // 0 = Terre sans rotation, 1 = Terre réelle
  t: 0,         // temps de simulation (s)
};

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// Décalage saisonnier de toute la circulation (ZCIT au nord en juillet, au sud en janvier)
export function seasonShift(m = P.month) { return 7.5 * Math.sin(2 * Math.PI * (m - 3.7) / 12); }
// Déclinaison du Soleil (23°26' aux solstices)
export function declination(m = P.month) { return 23.44 * Math.sin(2 * Math.PI * (m * 30.44 - 80) / 365.25); }
// Latitude « effective » : on fait glisser les ceintures en gardant les pôles aux pôles
export function effLat(lat, s = seasonShift()) {
  return lat < s ? (lat - s) / (90 + s) * 90 : (lat - s) / (90 - s) * 90;
}
// Réciproque : latitude réelle d'une latitude effective
export function realLat(le, s = seasonShift()) {
  return le < 0 ? s + le * (90 + s) / 90 : s + le * (90 - s) / 90;
}
// Hémisphère d'hiver = vents d'ouest d'altitude plus forts
export function winterFactor(lat, m = P.month) {
  const c = Math.cos(2 * Math.PI * (m - 0.5) / 12); // +1 en janvier, -1 en juillet
  return 1 + 0.4 * (lat >= 0 ? c : -c);
}
// Intensité relative des trois zones (Hadley la plus vigoureuse)
export function bandAmp(al) { return 1 - 0.42 * smooth(26, 34, al) - 0.16 * smooth(56, 64, al); }

// ---------------------------------------------------------------- surface
export function surfaceWind(lat, lon, out = {}) {
  const s = seasonShift(), le = effLat(lat, s), al = Math.abs(le), r = P.rot;
  const Au = al < 30 ? 7.5 : al < 60 ? 9 : 5.5;
  const zon = -Au * Math.sin(6 * al * DEG);            // alizés E, westerlies W, polaires E
  const mer = -3.0 * bandAmp(al) * Math.sin(6 * le * DEG);  // vers l'équateur dans Hadley
  const mer0 = -6 * Math.sin(2 * le * DEG);            // sans rotation : du pôle vers l'équateur
  out.u = r * zon;
  out.v = r * mer + (1 - r) * mer0;
  return out;
}

// ---------------------------------------------------------------- altitude (~35 000 ft)
export function jetLat(lon, hemi, t = P.t) {
  return 56 + 7 * Math.sin(5 * lon + 0.1 * t + (hemi > 0 ? 0 : 1.9));
}
export function upperWind(lat, lon, out = {}) {
  const s = seasonShift(), le = effLat(lat, s), al = Math.abs(le), r = P.rot;
  const hemi = lat >= 0 ? 1 : -1, W = winterFactor(lat);
  const base = 4 + 12 * smooth(4, 26, al) - 6 * smooth(70, 90, al);
  const stj = 40 * (0.85 + 0.15 * W) * Math.exp(-(((al - 30) / 6) ** 2));
  const jl = jetLat(lon, hemi), d = (Math.abs(lat) - jl) / 6.5;
  const pj = 32 * W * Math.exp(-d * d);
  const dj = hemi * 35 * Math.cos(5 * lon + 0.1 * P.t + (hemi > 0 ? 0 : 1.9)); // dlat/dlon (°/rad)
  const cl = Math.max(0.2, Math.cos(lat * DEG));
  const mer = 3.0 * bandAmp(al) * Math.sin(6 * le * DEG);  // vers les pôles dans Hadley
  const mer0 = 6 * Math.sin(2 * le * DEG);
  out.u = r * (base + stj + pj - 6 * Math.exp(-((le / 7) ** 2)));
  out.v = r * (mer + pj * dj * DEG / cl) + (1 - r) * mer0;
  out.jet = r * (stj + pj);
  return out;
}

// ---------------------------------------------------------------- coupe verticale
// Hauteur de la tropopause (km) : épaisse à l'équateur, mince aux pôles
export function tropopause(lat) {
  const le = effLat(lat), c = Math.cos(le * DEG);
  return 8 + 8.5 * c * c;
}
// Fonction de courant méridienne, z normalisé (0 = sol, 1 = tropopause)
// v = dpsi/dz (positif vers le nord), w = -dpsi/dphi (positif vers le haut)
export function cellVel(lat, z, out = {}) {
  const s = seasonShift(), le = effLat(lat, s) * DEG, al = Math.abs(le / DEG), r = P.rot;
  const A = bandAmp(al), sz = Math.sin(Math.PI * z), cz = Math.cos(Math.PI * z);
  // 3 cellules (Hadley, zone du front polaire, drainage polaire)
  const v3 = -A * Math.PI * Math.sin(6 * le) * cz;
  const w3 = A * 6 * Math.cos(6 * le) * sz;
  // 1 cellule par hémisphère (sans rotation)
  const v1 = -1.4 * Math.PI * Math.sin(2 * le) * cz;
  const w1 = 1.4 * 2 * Math.cos(2 * le) * sz;
  out.v = r * v3 + (1 - r) * v1;
  out.w = r * w3 + (1 - r) * w1;
  return out;
}

// Vent 3D pour la bulle d'air : z = 0 sol, 1 tropopause
const _s = {}, _u = {}, _c = {};
export function wind3D(lat, lon, z, out = {}) {
  surfaceWind(lat, lon, _s); upperWind(lat, lon, _u); cellVel(lat, z, _c);
  const k = smooth(0, 1, z);
  out.u = (1 - k) * _s.u + k * _u.u;
  out.v = _c.v * 2.2;   // composante méridienne issue des cellules
  out.w = _c.w;         // vertical (unités normalisées)
  out.jet = k * _u.jet;
  return out;
}

// Pression (anomalie, -1 = D, +1 = A)
export function pressure(lat) {
  const le = effLat(lat) * DEG, r = P.rot;
  return r * -Math.cos(6 * le) + (1 - r) * -Math.cos(2 * le);
}

// Bilan radiatif moyen (W/m²), forme du cours : excédent entre ~37°N et ~37°S
export function absorbed(lat) { const c = Math.cos((lat - seasonShift() * 0.9) * DEG); return 340 * c * c + 20; }
export function outgoing(lat) { const s = Math.sin(lat * DEG); return 255 - 55 * s * s; }

// Moment cinétique : vent d'ouest d'un anneau parti de l'équateur au repos
export function angMomWind(lat) {
  const c = Math.cos(lat * DEG), s = Math.sin(lat * DEG);
  return OMEGA_R * s * s / Math.max(c, 1e-3); // m/s
}

// Nom du régime de vent en surface
export function regime(lat) {
  if (P.rot < 0.5) return lat >= 0 ? 'vent du nord (sans rotation)' : 'vent du sud (sans rotation)';
  const le = effLat(lat), al = Math.abs(le), n = le >= 0;
  if (al < 4) return 'calmes équatoriaux (pot au noir)';
  if (al < 27) return n ? 'alizé de nord-est' : 'alizé de sud-est';
  if (al < 33) return 'latitudes des chevaux (calmes)';
  if (al < 58) return n ? "vents de sud-ouest (westerlies)" : "vents de nord-ouest (westerlies)";
  if (al < 63) return 'dépressions subpolaires';
  return n ? 'vents polaires de nord-est' : 'vents polaires de sud-est';
}

// Direction d'où vient le vent (degrés, 0 = nord) à partir de u, v
export function windFrom(u, v) {
  let d = Math.atan2(-u, -v) / DEG; if (d < 0) d += 360; return d;
}
export function compass(d) {
  const n = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return n[Math.round(d / 22.5) % 16];
}
