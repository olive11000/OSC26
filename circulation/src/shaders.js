// GLSL du globe, des nuages, de l'atmosphère et de la coupe verticale
export const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p, int oct){ float a=0.5, s=0.0, n=0.0; for(int i=0;i<6;i++){ if(i>=oct) break; s+=a*snoise(p); n+=a; p=p*2.03+vec3(1.7,9.2,3.3); a*=0.5; } return 0.5+0.5*s/n; }
`;

// Latitude effective (décalage saisonnier), même formule que model.js
export const EFFLAT = /* glsl */`
uniform float uShift; uniform float uRot;
float effLat(float lat){ return lat < uShift ? (lat-uShift)/(90.0+uShift)*90.0 : (lat-uShift)/(90.0-uShift)*90.0; }
`;

export const earthVert = /* glsl */`
varying vec2 vUv; varying vec3 vN; varying vec3 vObj; varying vec3 vWorld;
void main(){
  vUv = uv; vObj = normalize(position);
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const earthFrag = /* glsl */`
uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D waterMap;
uniform vec3 sunDir; uniform float uWater; uniform float uRad; uniform float uPress; uniform float uGrid;
uniform float uNight; uniform float uDim;
varying vec2 vUv; varying vec3 vN; varying vec3 vObj; varying vec3 vWorld;
${'__EFFLAT__'}
float absorbed(float lat){ float c=cos(radians(lat-uShift*0.9)); return 340.0*c*c+20.0; }
float outgoing(float lat){ float s=sin(radians(lat)); return 255.0-55.0*s*s; }
float line(float x, float w){ float d=fwidth(x); return 1.0-smoothstep(w*d, (w+1.2)*d, abs(x)); }
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWorld);
  float lat = degrees(asin(clamp(vObj.y,-1.0,1.0)));
  float le = effLat(lat);
  vec3 day = texture2D(dayMap, vUv).rgb;
  float water = texture2D(waterMap, vUv).r;
  vec3 ocean = mix(vec3(0.015,0.10,0.26), vec3(0.04,0.22,0.46), 0.5+0.5*sin(lat*0.06));
  ocean *= 0.85 + 0.15*cos(radians(lat));
  day = mix(day, ocean, uWater); water = mix(water, 1.0, uWater);
  float ndl = dot(N, sunDir);
  float lit = smoothstep(-0.18, 0.35, ndl);
  vec3 col = day * (uNight + (1.15 - uNight) * lit);
  vec3 lights = texture2D(nightMap, vUv).rgb;
  col += lights * vec3(1.0,0.78,0.45) * (1.0 - lit) * 1.4 * (1.0 - uWater);
  vec3 H = normalize(sunDir + V);
  col += vec3(0.9,0.95,1.0) * pow(max(dot(N,H),0.0), 70.0) * water * lit * 0.55;
  // bilan radiatif
  float net = (absorbed(lat) - outgoing(lat)) / 120.0;
  vec3 rc = net > 0.0 ? vec3(1.0,0.32,0.18) : vec3(0.22,0.52,1.0);
  col = mix(col, rc * (0.55 + 0.45*lit), uRad * clamp(abs(net)*0.9, 0.0, 0.58));
  // ceintures de pression (A rouge, D bleu)
  float p = uRot * -cos(radians(6.0*le)) + (1.0-uRot) * -cos(radians(2.0*le));
  vec3 pc = p > 0.0 ? vec3(1.0,0.42,0.30) : vec3(0.30,0.62,1.0);
  col = mix(col, pc * (0.45 + 0.55*lit), uPress * 0.6 * smoothstep(0.25, 1.0, abs(p)));
  // parallèles 0, 30, 60
  float g = 0.0;
  g += line(lat, 0.6) * 0.9; g += line(abs(lat)-30.0, 0.5) * 0.55; g += line(abs(lat)-60.0, 0.5) * 0.55;
  col = mix(col, vec3(1.0), uGrid * g * 0.6);
  // liseré atmosphérique
  float rim = pow(1.0 - max(dot(N,V),0.0), 3.0);
  col += vec3(0.30,0.55,1.0) * rim * (0.2 + 0.5*lit) * 0.45;
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
}`;

// Nuages générés dans une texture équirectangulaire (mise à jour en continu)
export const cloudGenFrag = /* glsl */`
uniform float uTime; uniform float uDense;
varying vec2 vUv;
${'__NOISE__'}
${'__EFFLAT__'}
float surfU(float le){ float al=abs(le); float A = al<30.0?7.5:(al<60.0?9.0:5.5); return -A*sin(radians(6.0*al)); }
float coverage(float le){
  float a = abs(le);
  float itcz = 0.86*exp(-pow(le/6.5,2.0));
  float sub = 0.07 + 0.10*smoothstep(26.0,40.0,a);
  float mid = 0.70*smoothstep(36.0,46.0,a)*(1.0-smoothstep(68.0,78.0,a));
  float pol = 0.36*smoothstep(70.0,80.0,a);
  float c = max(itcz, max(sub, max(mid, pol)));
  float c0 = 0.25 + 0.5*exp(-pow(le/14.0,2.0));
  return mix(c0, c, uRot);
}
vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z); }
float sampleClouds(vec3 p, float le, float ang){
  vec3 q = rotY(p, ang);
  float a = abs(le);
  // latitudes moyennes : grands tourbillons (déformation du domaine)
  vec3 w = vec3(fbm(q*1.7+vec3(5.2,1.3,2.1),3), fbm(q*1.7+vec3(1.7,9.2,4.4),3), fbm(q*1.7+vec3(8.3,2.8,6.1),3)) - 0.5;
  float swirl = fbm(q*3.4 + w*2.4, 5);
  // ZCIT : amas convectifs (cumulonimbus)
  float clump = fbm(q*7.0 + vec3(0.0, uTime*0.015, 0.0), 5);
  // subtropiques : petits cumulus épars
  float speck = fbm(q*16.0, 3);
  float mw = smoothstep(20.0, 38.0, a);
  float sw = smoothstep(9.0, 16.0, a) * (1.0 - smoothstep(30.0, 40.0, a));
  return mix(mix(clump, speck, sw), swirl, mw);
}
void main(){
  float lon = (vUv.x - 0.5) * 6.2831853; float lat = (vUv.y - 0.5) * 3.1415927;
  vec3 p = vec3(cos(lat)*cos(lon), sin(lat), -cos(lat)*sin(lon));
  float latd = degrees(lat), le = effLat(latd);
  // dérive des nuages avec le vent de surface (deux échantillons en fondu)
  float speed = uRot * surfU(le) * 0.0022 / max(cos(lat), 0.3);
  float T = 14.0; float ph1 = fract(uTime / T), ph2 = fract(uTime / T + 0.5);
  float n1 = sampleClouds(p, le, -speed * ph1 * T);
  float n2 = sampleClouds(p, le, -speed * ph2 * T);
  float wgt = abs(ph1 - 0.5) * 2.0;
  float n = mix(n1, n2, wgt);
  float cov = coverage(le) * uDense;
  float th = 0.5 + (0.5 - cov) * 0.34;
  float d = smoothstep(th, th + 0.06, n) * (0.62 + 0.38 * smoothstep(th, th + 0.22, n));
  gl_FragColor = vec4(d, d, d, 1.0);
}`;

export const cloudVert = /* glsl */`
varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
void main(){ vUv = uv; vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`;
export const cloudFrag = /* glsl */`
uniform sampler2D cloudMap; uniform vec3 sunDir; uniform float uOpacity; uniform float uNight;
varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
void main(){
  float d = texture2D(cloudMap, vUv).r;
  vec3 N = normalize(vN);
  float lit = smoothstep(-0.15, 0.4, dot(N, sunDir));
  vec3 c = vec3(1.0) * (uNight + (1.05 - uNight) * lit);
  gl_FragColor = vec4(c, d * uOpacity);
}`;

export const atmoVert = /* glsl */`
varying vec3 vN; varying vec3 vWorld;
void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vWorld=w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`;
export const atmoFrag = /* glsl */`
uniform vec3 sunDir; uniform float uNight;
varying vec3 vN; varying vec3 vWorld;
void main(){
  vec3 V = normalize(cameraPosition - vWorld);
  float x = -dot(normalize(vN), V);
  float f = pow(smoothstep(0.0, 0.40, x), 2.6) * 0.62;
  float lit = smoothstep(-0.35, 0.5, dot(normalize(vN), sunDir));
  vec3 c = mix(vec3(0.10,0.22,0.55), vec3(0.35,0.65,1.0), lit) * (0.35 + uNight + 0.65*lit);
  gl_FragColor = vec4(c * f * 0.9, 1.0);
}`;

// Fond de la coupe verticale : troposphère, tropopause, stratosphère
export const sectionVert = /* glsl */`
attribute vec2 aLZ; varying vec2 vLZ;
void main(){ vLZ = aLZ; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
export const sectionFrag = /* glsl */`
uniform float uHmax; uniform float uOpacity;
varying vec2 vLZ;
${'__EFFLAT__'}
float tropo(float lat){ float c=cos(radians(effLat(lat))); return 8.0+8.5*c*c; }
void main(){
  float lat = vLZ.x; float zkm = vLZ.y * uHmax;
  float tp = tropo(lat);
  float below = 1.0 - smoothstep(tp-0.25, tp+0.25, zkm);
  float le = effLat(lat);
  vec3 warm = vec3(0.95,0.45,0.20), cold = vec3(0.30,0.55,1.0);
  vec3 tint = mix(warm, cold, smoothstep(5.0, 70.0, abs(le)));
  vec3 col = mix(vec3(0.03,0.05,0.10), tint*0.32 + vec3(0.02,0.04,0.09), below);
  float a = mix(0.28, 0.62, below);
  // tropopause
  float dz = fwidth(zkm);
  float tl = 1.0 - smoothstep(0.6*dz, 2.2*dz, abs(zkm - tp));
  col = mix(col, vec3(1.0,0.86,0.55), tl*0.95); a = max(a, tl*0.95);
  // graduations tous les 5 km
  float g = abs(fract(zkm/5.0+0.5)-0.5)*5.0;
  float gl = (1.0 - smoothstep(0.5*dz, 1.6*dz, g)) * 0.18 * (1.0 - tl);
  col += vec3(gl);
  // bord inférieur (sol) et fondu vers les pôles
  float fade = 1.0 - smoothstep(80.0, 90.0, abs(lat));
  gl_FragColor = vec4(col, a * fade * uOpacity);
}`;

// Traînées (rubans) : couleur + alpha par sommet, mélange additif
export const streakVert = /* glsl */`
attribute vec3 color; attribute float alpha; varying vec3 vC; varying float vA;
void main(){ vC = color; vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
export const streakFrag = /* glsl */`
uniform float uOpacity; varying vec3 vC; varying float vA;
void main(){ gl_FragColor = vec4(vC, vA * uOpacity); }`;

export function fill(src, parts) {
  return src.replace("__EFFLAT__", parts.EFFLAT || '').replace("__NOISE__", parts.NOISE || '');
}
