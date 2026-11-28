// Moteur commun des simus : manches « question » (choix multiples) et manches « manip » (objectif à atteindre
// avec des commandes en direct). item = { q, c, a, why, art?, tag?, keep? } ou { q, task: (ctx, T) => cleanup, why, tag? }
export function runScenario(ctx, cfg) {
  const { el, esc, shuffle, sfx } = ctx;
  // les manips (cfg.tasks, dans l'ordre) sont intercalées entre les questions tirées au hasard
  const build = () => {
    let q = cfg.items.slice(); if (cfg.shuffle !== false) q = shuffle(q);
    const t = (cfg.tasks || []).slice();
    if (cfg.n) q = q.slice(0, Math.max(0, cfg.n - t.length));
    if (!t.length) return q;
    const out = [], per = q.length / t.length; let qi = 0;
    t.forEach((x, i) => { out.push(x); const upto = Math.round(per * (i + 1)); while (qi < upto) out.push(q[qi++]); });
    while (qi < q.length) out.push(q[qi++]);
    return out;
  };
  let items = build(), k = 0, good = 0, streak = 0, best = 0, cleanup = null, stopped = false;
  function intro() {
    clean();
    const nT = (cfg.tasks || []).length;
    el.innerHTML = `<div class="sim"><h3>${cfg.icon || '🎮'} ${esc(cfg.title)}</h3><div class="card"><div class="cbody">${cfg.intro}</div>
      <p class="hint">${items.length} manches${nT ? ` dont ${nT} manip${nT > 1 ? 's' : ''} en direct` : ''} · étoile à partir de 70 %.</p><button class="btn pri big" id="sgo">Lancer la simu</button></div></div>`;
    el.querySelector('#sgo').onclick = () => { k = 0; good = 0; streak = 0; round(); };
    cfg.onIntro && cfg.onIntro(ctx);
  }
  function clean() { if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; } }
  function head(it) {
    return `<div class="kpi"><span>${esc(cfg.title)} · ${k + 1}/${items.length}</span><span>${streak >= 2 ? '🔥 ' + streak : ''} ✔ ${good}</span></div>${it.tag ? `<span class="pill">${it.task ? '🕹️ ' : ''}${esc(it.tag)}</span>` : ''}`;
  }
  function finish(it, ok, msg) {
    if (ok) { good++; streak++; best = Math.max(best, streak); sfx('ok'); ctx.xp(it.task ? 10 : 4 + Math.min(streak, 5)); } else { streak = 0; sfx('ko'); }
    const why = (msg ? msg + ' ' : '') + (it.whyhtml || esc(it.why || ''));
    el.querySelector('#sfb').innerHTML = `<div class="expl ${ok ? 'good' : 'bad'}">${ok ? '✅ ' : '❌ '}${why}</div><button class="btn pri big" id="snext">${k + 1 < items.length ? 'Suivant ▶' : 'Résultat'}</button>`;
    el.querySelector('#snext').onclick = () => { k++; round(); const v = el.closest('#view'); if (v) v.scrollTop = 0; };
    const fb = el.querySelector('#sfb'); fb.scrollIntoView && fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function round() {
    if (stopped) return; clean();
    if (k >= items.length) return end();
    const it = typeof items[k] === 'function' ? items[k](ctx) : items[k];
    items[k] = it;
    if (it.task) {
      el.innerHTML = `<div class="sim">${head(it)}<div class="art" id="sart"></div><h3>${it.qhtml || esc(it.q)}</h3><div class="lab" id="slab"></div>
        <div class="trow"><span class="hint" id="shint">${it.hint ? '💡 ' + esc(it.hint) : ''}</span><button class="btn sm" id="sskip">Je passe</button></div><div id="sfb"></div></div>`;
      let done = false;
      const T = {
        art: el.querySelector('#sart'), lab: el.querySelector('#slab'), isDone: () => done,
        win: (m) => { if (done) return; done = true; el.querySelector('#sskip').remove(); finish(it, true, m); },
        fail: (m) => { if (done) return; done = true; el.querySelector('#sskip').remove(); finish(it, false, m); },
        say: (h) => { el.querySelector('#shint').innerHTML = h; },
      };
      el.querySelector('#sskip').onclick = () => T.fail(it.skip || 'Pas grave, regarde l’explication.');
      try { cleanup = it.task(ctx, T) || null; } catch (e) { console.error(e); T.fail('La manip a planté.'); }
      return;
    }
    const order = it.keep ? it.c.map((_, j) => j) : shuffle(it.c.map((_, j) => j));
    el.innerHTML = `<div class="sim">${head(it)}<div class="art" id="sart" ${it.art ? '' : 'style="display:none"'}></div>
      <h3>${it.qhtml || esc(it.q)}</h3><div class="opts">${order.map((j) => `<button data-j="${j}">${it.chtml ? it.c[j] : esc(it.c[j])}</button>`).join('')}</div><div id="sfb"></div></div>`;
    const box = el.querySelector('#sart');
    if (typeof it.art === 'string') box.innerHTML = it.art;
    else if (typeof it.art === 'function') cleanup = it.art(ctx, box) || null;
    let done = false;
    el.querySelectorAll('.opts button').forEach((b) => b.onclick = () => {
      if (done) return; done = true;
      const j = +b.dataset.j, ok = j === it.a;
      el.querySelectorAll('.opts button').forEach((x) => { const y = +x.dataset.j; if (y === it.a) x.classList.add('ok'); else if (y === j) x.classList.add('ko'); x.disabled = true; });
      it.after && it.after(ctx, box, ok);
      finish(it, ok);
    });
  }
  function end() {
    clean();
    const score = good / items.length;
    ctx.done(score);
    el.innerHTML = `<div class="sim"><div class="card res"><div class="big">${good} / ${items.length}</div><p>${score >= 0.9 ? 'Parfait, chef mécano !' : score >= 0.7 ? 'Simu réussie ⭐' : 'Encore un effort : relis le briefing et recommence.'}</p>
      <p class="hint">Meilleure série : ${best} réussite${best > 1 ? 's' : ''} d'affilée</p>
      <div class="qbtns"><button class="btn pri" id="sre">Rejouer</button><button class="btn" id="schk">Passer au check ✅</button></div></div></div>`;
    el.querySelector('#sre').onclick = () => { items = build(); k = 0; good = 0; streak = 0; best = 0; cfg.onIntro && cfg.onIntro(ctx); round(); };
    el.querySelector('#schk').onclick = () => ctx.goCheck();
  }
  intro();
  return () => { stopped = true; clean(); cfg.onStop && cfg.onStop(ctx); };
}

// ---------------------------------------------------------------- commandes des manips
export function slider(parent, o, cb) {
  const w = document.createElement('div'); w.className = 'ctl';
  w.innerHTML = `<label><span>${o.label}</span><b></b></label><input type="range" min="${o.min}" max="${o.max}" step="${o.step || 1}" value="${o.value ?? o.min}">`;
  const inp = w.querySelector('input'), out = w.querySelector('b');
  const show = () => { const v = +inp.value; out.textContent = (o.fmt ? o.fmt(v) : String(v).replace('.', ',')) + (o.unit ? ' ' + o.unit : ''); };
  inp.oninput = () => { show(); cb && cb(+inp.value); };
  show(); parent.appendChild(w);
  return { get: () => +inp.value, set: (v) => { inp.value = v; show(); }, el: w, inp, disable: (d) => { inp.disabled = d; } };
}
// boutons à choix unique (ou bascule si toggle)
export function seg(parent, label, opts, val, cb) {
  const w = document.createElement('div'); w.className = 'seg';
  w.innerHTML = (label ? `<span>${label}</span>` : '') + `<div>${opts.map((o, i) => `<button class="btn sm" data-i="${i}">${o}</button>`).join('')}</div>`;
  let cur = val;
  const paint = () => w.querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.i === cur));
  w.querySelectorAll('button').forEach((b) => b.onclick = () => { cur = +b.dataset.i; paint(); cb && cb(cur); });
  paint(); parent.appendChild(w);
  return { get: () => cur, set: (v) => { cur = v; paint(); }, el: w };
}
export function toggle(parent, label, val, cb) {
  const w = document.createElement('button'); w.className = 'btn sm tg'; let on = !!val;
  const paint = () => { w.classList.toggle('on', on); w.innerHTML = `<i>${on ? '●' : '○'}</i> ${label}`; };
  w.onclick = () => { on = !on; paint(); cb && cb(on); };
  paint(); parent.appendChild(w);
  return { get: () => on, set: (v) => { on = !!v; paint(); }, el: w };
}
export function row(parent, cls = 'brow') { const d = document.createElement('div'); d.className = cls; parent.appendChild(d); return d; }
export function button(parent, label, cb, cls = '') { const b = document.createElement('button'); b.className = 'btn sm ' + cls; b.innerHTML = label; b.onclick = () => cb(b); parent.appendChild(b); return b; }
// objectif tenu pendant ms : appelle win une seule fois
export function holder(T, ms = 700) {
  let t = null;
  return (ok, msg) => {
    if (T.isDone()) return;
    if (ok && !t) t = setTimeout(() => { t = null; T.win(typeof msg === 'function' ? msg() : msg); }, ms);
    if (!ok && t) { clearTimeout(t); t = null; }
  };
}
// boucle d'animation avec nettoyage
export function loop(fn) {
  let id = 0, last = performance.now(), alive = true;
  const f = (now) => { if (!alive) return; const dt = Math.min(0.1, (now - last) / 1000); last = now; fn(dt); id = requestAnimationFrame(f); };
  id = requestAnimationFrame(f);
  return () => { alive = false; cancelAnimationFrame(id); };
}
// manche « remets dans l'ordre »
export function orderTask(steps, opt = {}) {
  return (ctx, T) => {
    const order = ctx.shuffle(steps.map((_, i) => i)); let next = 0, errors = 0; opt.setup && opt.setup(ctx);
    T.lab.innerHTML = `<ol class="ordl" id="ol"></ol><div class="ordb">${order.map((i) => `<button class="btn sm" data-i="${i}">${steps[i]}</button>`).join('')}</div>`;
    T.art.style.display = opt.art ? '' : 'none'; if (opt.art) T.art.innerHTML = opt.art;
    const ol = T.lab.querySelector('#ol');
    T.lab.querySelectorAll('.ordb button').forEach((b) => b.onclick = () => {
      if (T.isDone()) return;
      const i = +b.dataset.i;
      if (i === next) { b.disabled = true; b.classList.add('okb'); ol.insertAdjacentHTML('beforeend', `<li>${steps[i]}</li>`); next++; ctx.sfx('tick'); opt.onStep && opt.onStep(next, ctx); if (next === steps.length) (errors <= (opt.tol ?? 1) ? T.win(errors ? `(${errors} erreur)` : '') : T.fail(`${errors} erreurs.`)); }
      else { errors++; b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); ctx.sfx('ko'); T.say(`❌ Pas encore celle-là (${errors} erreur${errors > 1 ? 's' : ''}).`); }
    });
    return () => opt.cleanup && opt.cleanup(ctx);
  };
}
// manche « sélectionne toutes les bonnes réponses »
export function pickTask(opts, good, opt = {}) {
  return (ctx, T) => {
    const sel = new Set(); const order = ctx.shuffle(opts.map((_, i) => i)); opt.setup && opt.setup(ctx);
    T.art.style.display = opt.art ? '' : 'none'; if (opt.art) T.art.innerHTML = opt.art;
    T.lab.innerHTML = `<div class="opts">${order.map((i) => `<button data-i="${i}">${opts[i]}</button>`).join('')}</div><button class="btn pri big" id="pval">Valider</button>`;
    T.lab.querySelectorAll('.opts button').forEach((b) => b.onclick = () => { const i = +b.dataset.i; if (sel.has(i)) sel.delete(i); else sel.add(i); b.classList.toggle('sel', sel.has(i)); });
    T.lab.querySelector('#pval').onclick = () => {
      const okAll = good.every((g) => sel.has(g)) && [...sel].every((s) => good.includes(s));
      T.lab.querySelectorAll('.opts button').forEach((b) => { const i = +b.dataset.i; b.disabled = true; if (good.includes(i)) b.classList.add('ok'); else if (sel.has(i)) b.classList.add('ko'); });
      T.lab.querySelector('#pval').remove();
      okAll ? T.win() : T.fail();
    };
    return () => opt.cleanup && opt.cleanup(ctx);
  };
}

// ---------------------------------------------------------------- petits dessins SVG
export const svg = (w, h, body, bg = '#0a1222') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
export const arrow = (x1, y1, x2, y2, col = '#ffc35c', w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 9;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} Z" fill="${col}"/>`;
};
export const text = (x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.c || '#eaf0fb'}" font-size="${o.s || 14}" font-weight="${o.w || 600}" text-anchor="${o.a || 'middle'}" font-family="-apple-system,Segoe UI,Roboto,sans-serif"${o.extra || ''}>${t}</text>`;
// cadran à aiguille : zones = [[de, à, couleur]]
export function gauge(x, y, r, v, min, max, label, o = {}) {
  const a0 = -225, a1 = 45, ang = (val) => (a0 + (Math.max(min, Math.min(max, val)) - min) / (max - min) * (a1 - a0)) * Math.PI / 180;
  const P = (val, rr) => [x + rr * Math.cos(ang(val)), y + rr * Math.sin(ang(val))];
  const arc = (va, vb, rr, col, w) => { const [xa, ya] = P(va, rr), [xb, yb] = P(vb, rr); const large = (ang(vb) - ang(va)) > Math.PI ? 1 : 0; return `<path d="M${xa},${ya} A${rr},${rr} 0 ${large} 1 ${xb},${yb}" stroke="${col}" stroke-width="${w}" fill="none"/>`; };
  let s = `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="#070c18" stroke="rgba(140,170,230,.25)"/>` + arc(min, max, r - 3, 'rgba(255,255,255,.12)', 4);
  for (const [za, zb, col] of o.zones || []) s += arc(za, zb, r - 3, col, 5);
  const [nx, ny] = P(v, r - 8);
  s += `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${o.nc || '#fff'}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/>`;
  s += text(x, y + r * 0.5, o.fmt ? o.fmt(v) : Math.round(v), { s: o.vs || 13, w: 800, c: o.vc || '#fff' }) + text(x, y + r + 16, label, { s: 11, c: '#93a1bd', w: 600 });
  return s;
}
// barre verticale
export function vbar(x, y, w, h, v, min, max, label, col = '#5fd6ff', o = {}) {
  const k = Math.max(0, Math.min(1, (v - min) / (max - min)));
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#070c18" stroke="rgba(140,170,230,.25)"/><rect x="${x + 2}" y="${y + 2 + (h - 4) * (1 - k)}" width="${w - 4}" height="${(h - 4) * k}" rx="3" fill="${col}"/>`;
  for (const [lv, lc] of o.marks || []) { const yy = y + 2 + (h - 4) * (1 - (lv - min) / (max - min)); s += `<line x1="${x - 3}" x2="${x + w + 3}" y1="${yy}" y2="${yy}" stroke="${lc}" stroke-width="2"/>`; }
  s += text(x + w / 2, y + h + 14, label, { s: 11, c: '#93a1bd' });
  if (o.val !== undefined) s += text(x + w / 2, y - 5, o.val, { s: 12, w: 800 });
  return s;
}
// voyant d'alarme
export const lamp = (x, y, w, h, t, on, col = '#ffc35c') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${on ? col : '#151b27'}" stroke="${on ? col : 'rgba(140,170,230,.25)'}" ${on ? `style="filter:drop-shadow(0 0 6px ${col})"` : ''}/>` + text(x + w / 2, y + h / 2 + 4, t, { s: 11, w: 800, c: on ? '#111' : '#56607a' });
export const fmt1 = (v) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
export const fmtk = (v) => Math.round(v).toLocaleString('fr-FR');

// manche « range chaque carte dans la bonne case » : cards = [[texte, bonne case, explication?]]
export function sortTask(cards, bins, opt = {}) {
  return (ctx, T) => {
    const list = ctx.shuffle(cards.map((_, i) => i)).slice(0, opt.n || cards.length);
    let k = 0, err = 0; opt.setup && opt.setup(ctx);
    T.art.style.display = opt.art ? '' : 'none'; if (opt.art) T.art.innerHTML = opt.art;
    const draw = () => {
      if (T.isDone()) return;
      if (k >= list.length) { const tol = opt.tol ?? 1; return err <= tol ? T.win(`${list.length - err}/${list.length} bien rangées.`) : T.fail(`${err} erreurs sur ${list.length}.`); }
      const c = cards[list[k]];
      T.lab.innerHTML = `<div class="sortc"><small>Carte ${k + 1}/${list.length}</small><div>${c[0]}</div></div><div class="sortb">${bins.map((b, i) => `<button class="btn" data-i="${i}">${b}</button>`).join('')}</div><div id="sortfb"></div>`;
      T.lab.querySelectorAll('.sortb button').forEach((b) => b.onclick = () => {
        const i = +b.dataset.i, ok = i === c[1];
        T.lab.querySelectorAll('.sortb button').forEach((x) => { x.disabled = true; if (+x.dataset.i === c[1]) x.classList.add('okb'); else if (x === b) x.classList.add('kob'); });
        if (!ok) err++; ctx.sfx(ok ? 'tick' : 'ko');
        opt.onCard && opt.onCard(ctx, c, ok);
        const fb = T.lab.querySelector('#sortfb');
        if (c[2] || !ok) { fb.innerHTML = `<div class="expl ${ok ? 'good' : 'bad'}">${ok ? '✅' : '❌'} ${c[2] || ''}</div><button class="btn sm" id="sortn">Carte suivante ▸</button>`; fb.querySelector('#sortn').onclick = () => { k++; draw(); }; }
        else setTimeout(() => { k++; draw(); }, 550);
      });
    };
    draw();
    return () => opt.cleanup && opt.cleanup(ctx);
  };
}
// mini-manche : un manche latéral qui revient au neutre quand on le lâche → cb(x, y) dans [-1, 1]
export function pad(parent, cb, opt = {}) {
  const w = document.createElement('div'); w.className = 'pad'; w.innerHTML = `<i></i><span>${opt.label || 'Manche'}</span>`; parent.appendChild(w);
  const knob = w.querySelector('i'); let drag = false, x = 0, y = 0;
  const set = (nx, ny) => { x = Math.max(-1, Math.min(1, nx)); y = Math.max(-1, Math.min(1, ny)); knob.style.transform = `translate(${x * 42}px, ${-y * 42}px)`; cb(x, y); };
  const at = (e) => { const r = w.getBoundingClientRect(); set(((e.clientX - r.left) / r.width - 0.5) * 2.4, -((e.clientY - r.top) / r.height - 0.5) * 2.4); };
  w.addEventListener('pointerdown', (e) => { drag = true; w.setPointerCapture(e.pointerId); at(e); });
  w.addEventListener('pointermove', (e) => { if (drag) at(e); });
  const up = () => { drag = false; if (!opt.stay) set(0, 0); };
  w.addEventListener('pointerup', up); w.addEventListener('pointercancel', up);
  return { get: () => [x, y], set };
}
