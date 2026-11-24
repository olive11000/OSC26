// Moteur commun des simus « scénario » : une illustration, une question, des choix, une explication.
// item = { q, c: [choix…], a: index bon choix, why, art?: svg | (ctx, box) => cleanup, tag? }
export function runScenario(ctx, cfg) {
  const { el, esc, shuffle, sfx } = ctx;
  let items = cfg.items.slice(), k = 0, good = 0, streak = 0, best = 0, cleanup = null, stopped = false;
  if (cfg.shuffle !== false) items = shuffle(items);
  if (cfg.n) items = items.slice(0, cfg.n);
  function intro() {
    el.innerHTML = `<div class="sim"><h3>${cfg.icon || '🎮'} ${esc(cfg.title)}</h3><div class="card"><div class="cbody">${cfg.intro}</div>
      <p class="hint">${items.length} manches · étoile à partir de 70 % de bonnes réponses.</p><button class="btn pri big" id="sgo">Lancer la simu</button></div>
      ${cfg.extraIntro || ''}</div>`;
    el.querySelector('#sgo').onclick = () => { k = 0; good = 0; streak = 0; round(); };
    cfg.onIntro && cfg.onIntro(el);
  }
  function clean() { if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; } }
  function round() {
    if (stopped) return; clean();
    if (k >= items.length) return end();
    const it = typeof items[k] === 'function' ? items[k]() : items[k];
    items[k] = it;
    const order = it.keep ? it.c.map((_, j) => j) : shuffle(it.c.map((_, j) => j));
    el.innerHTML = `<div class="sim"><div class="kpi"><span>${esc(cfg.title)} · ${k + 1}/${items.length}</span><span>${streak >= 2 ? '🔥 ' + streak : ''} ✔ ${good}</span></div>
      ${it.tag ? `<span class="pill">${esc(it.tag)}</span>` : ''}
      <div class="art" id="sart" ${it.art ? '' : 'style="display:none"'}></div>
      <h3>${it.qhtml || esc(it.q)}</h3><div class="opts">${order.map((j) => `<button data-j="${j}">${it.chtml ? it.c[j] : esc(it.c[j])}</button>`).join('')}</div><div id="sfb"></div></div>`;
    const box = el.querySelector('#sart');
    if (typeof it.art === 'string') box.innerHTML = it.art;
    else if (typeof it.art === 'function') cleanup = it.art(ctx, box) || null;
    let done = false;
    el.querySelectorAll('.opts button').forEach((b) => b.onclick = () => {
      if (done) return; done = true;
      const j = +b.dataset.j, ok = j === it.a;
      if (ok) { good++; streak++; best = Math.max(best, streak); sfx('ok'); ctx.xp(4 + Math.min(streak, 5)); } else { streak = 0; sfx('ko'); }
      el.querySelectorAll('.opts button').forEach((x) => { const y = +x.dataset.j; if (y === it.a) x.classList.add('ok'); else if (y === j) x.classList.add('ko'); x.disabled = true; });
      el.querySelector('#sfb').innerHTML = `<div class="expl ${ok ? 'good' : 'bad'}">${ok ? '✅ ' : '❌ '}${it.whyhtml || esc(it.why || '')}</div><button class="btn pri big" id="snext">${k + 1 < items.length ? 'Suivant ▶' : 'Résultat'}</button>`;
      it.after && it.after(ctx, box, ok);
      el.querySelector('#snext').onclick = () => { k++; round(); el.scrollIntoView ? el.parentElement.scrollTop = 0 : 0; };
      el.querySelector('#sfb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  function end() {
    clean();
    const score = good / items.length;
    ctx.done(score);
    el.innerHTML = `<div class="sim"><div class="card res"><div class="big">${good} / ${items.length}</div><p>${score >= 0.9 ? 'Parfait, commandant de bord !' : score >= 0.7 ? 'Simu réussie ⭐' : 'Encore un effort : relis la fiche et recommence.'}</p>
      <p class="hint">Meilleure série : ${best} bonne${best > 1 ? 's' : ''} réponse${best > 1 ? 's' : ''} d'affilée</p>
      <div class="qbtns"><button class="btn pri" id="sre">Rejouer</button><button class="btn" id="schk">Passer au check ✅</button></div></div></div>`;
    el.querySelector('#sre').onclick = () => { items = cfg.items.slice(); if (cfg.shuffle !== false) items = shuffle(items); if (cfg.n) items = items.slice(0, cfg.n); k = 0; good = 0; streak = 0; best = 0; round(); };
    el.querySelector('#schk').onclick = () => document.querySelector('.tabs .tb[data-t="check"]').click();
  }
  intro();
  return () => { stopped = true; clean(); cfg.onStop && cfg.onStop(); };
}

// ---------------------------------------------------------------- petits dessins SVG
export const svg = (w, h, body, bg = '#0a1222') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
// avion vu de dessus, nez vers le haut, centré en (x, y), cap c (degrés)
export function planeTop(x, y, c, col = '#5fd6ff', s = 1, lights = false) {
  return `<g transform="translate(${x} ${y}) rotate(${c}) scale(${s})">
    <path d="M0,-26 C4,-24 5,-16 5,-8 L30,4 L30,9 L5,4 L4,16 L12,22 L12,26 L0,23 L-12,26 L-12,22 L-4,16 L-5,4 L-30,9 L-30,4 L-5,-8 C-5,-16 -4,-24 0,-26 Z" fill="${col}" stroke="#0a1222" stroke-width="1.5"/>
    ${lights ? '<circle cx="-30" cy="6.5" r="4" fill="#ff3b30"/><circle cx="30" cy="6.5" r="4" fill="#34ff6a"/><circle cx="0" cy="25" r="3.5" fill="#fff"/>' : ''}</g>`;
}
export const arrow = (x1, y1, x2, y2, col = '#ffc35c', w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} Z" fill="${col}"/>`;
};
export const text = (x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.c || '#eaf0fb'}" font-size="${o.s || 14}" font-weight="${o.w || 600}" text-anchor="${o.a || 'middle'}" font-family="-apple-system,Segoe UI,Roboto,sans-serif">${t}</text>`;
