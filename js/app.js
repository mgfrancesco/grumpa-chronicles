import { grumpa, laurel } from './art.js';
import { load, getState, update, pull, setRemoteListener, syncEnabled, resetProgress } from './store.js';
import { addDispute, retryUnsent, sendMark } from './feedback.js';
import { CONFIG } from './config.js';

const app = document.getElementById('app');
let INDEX = null;
const SCENES = {};          // sceneId -> scene json
const SCENE_FILES = {};     // sceneId -> file
const SCENE_WING = {};      // sceneId -> wing

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CONF_LABEL = { attested: 'Attested', inferred: 'Scholarly inference', reconstructed: 'Reconstructed', counterfactual: 'Counterfactual' };
const TIER_LABEL = { 1: 'Canon', 2: 'Specialist', 3: 'Frontier' };

// ---------- boot ----------

async function boot() {
  load();
  applyTextSize();
  setRemoteListener(() => { applyTextSize(); route(); });
  INDEX = await getJSON('content/index.json');
  for (const w of INDEX.wings) for (const c of w.campaigns) for (const s of c.scenes) {
    if (s.file) { SCENE_FILES[s.id] = s.file; SCENE_WING[s.id] = w.id; }
  }
  window.addEventListener('hashchange', route);
  route();
  pull();
  retryUnsent();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

async function getJSON(path) {
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

async function scene(id) {
  if (!SCENES[id]) SCENES[id] = await getJSON(`content/${SCENE_FILES[id]}`);
  return SCENES[id];
}

function applyTextSize() {
  document.documentElement.style.setProperty('--fs', `${getState().textSize}px`);
}

// ---------- routing ----------

async function route() {
  const [, view, id] = (location.hash || '#/').split('/');
  document.body.dataset.palette = 'study';
  window.scrollTo(0, 0);
  try {
    if (view === 'wing') return renderWing(id);
    if (view === 'campaign') return await renderCampaign(id);
    if (view === 'scene') return await renderScene(id);
    if (view === 'codex') return await renderCodex(id);
    if (view === 'notebook') return renderNotebook();
    if (view === 'settings') return renderSettings();
    return renderHome();
  } catch (e) {
    app.innerHTML = `<main class="page"><p>Something went wrong loading this page.</p><p class="quiet">${esc(e.message)}</p><a class="btn" href="#/">Back to the study</a></main>`;
  }
}

const backLink = (href = '#/', label = 'The study') => `<a class="back" href="${href}">‹ ${label}</a>`;

// ---------- home: Grumpa's study ----------

function renderHome() {
  const st = getState();
  const current = Object.entries(st.progress).find(([id, p]) => !p.done && SCENE_FILES[id]);
  app.innerHTML = `
  <header class="study-head">
    <div class="portrait">${grumpa('study', { size: 132 })}</div>
    <div>
      <h1>Grumpa's Chronicle</h1>
      <p class="sub">Ancient and pre-modern history, one decision at a time.</p>
    </div>
  </header>
  <main class="page">
    ${current ? `<a class="continue" href="#/scene/${current[0]}"><span class="eyebrow">Continue</span><strong>${esc(sceneTitle(current[0]))}</strong></a>` : ''}
    <h2 class="shelf-title">The shelf</h2>
    <div class="shelf">
      ${INDEX.wings.map((w) => {
        const ready = w.campaigns.flatMap((c) => c.scenes).filter((s) => s.file).length;
        const done = w.campaigns.flatMap((c) => c.scenes).filter((s) => st.laurels.includes(s.id)).length;
        return `<a class="volume" data-palette="${w.palette}" href="#/wing/${w.id}">
          <span class="spine"></span>
          <span class="vol-text"><strong>${esc(w.title)}</strong><span class="dates">${esc(w.dates)}</span>
          <span class="blurb">${esc(w.blurb)}</span>
          <span class="status">${ready ? `${ready} scene${ready > 1 ? 's' : ''} ready${done ? ` · ${done} ${laurel(18)}` : ''}` : 'In preparation'}</span></span>
        </a>`;
      }).join('')}
    </div>
    <h2 class="shelf-title">Lenses</h2>
    <p class="quiet">Themes that run across every era. They open as the eras fill.</p>
    <div class="lenses">${INDEX.lenses.map((l) => `<span class="lens">${esc(l.title)}</span>`).join('')}</div>
    <nav class="desk">
      <a class="btn" href="#/codex">Codex</a>
      <a class="btn" href="#/notebook">Notebook</a>
      <a class="btn quiet-btn" href="#/settings">Settings</a>
    </nav>
  </main>`;
}

function sceneTitle(id) {
  for (const w of INDEX.wings) for (const c of w.campaigns) for (const s of c.scenes) if (s.id === id) return s.title;
  return id;
}

// ---------- wing ----------

function renderWing(id) {
  const w = INDEX.wings.find((x) => x.id === id);
  if (!w) return renderHome();
  document.body.dataset.palette = w.palette;
  const st = getState();
  app.innerHTML = `
  <main class="page">
    ${backLink()}
    <h1>${esc(w.title)}</h1>
    <p class="sub">${esc(w.dates)}</p>
    ${w.campaigns.map((c) => `
      <section class="campaign">
        <h2>${esc(c.title)}</h2>
        ${c.map ? `<a class="btn primary" href="#/campaign/${c.id}">Open the campaign map</a>` : ''}
        <ol class="scenes">
          ${c.scenes.map((s) => s.file
            ? `<li><a class="scene-link" href="#/scene/${s.id}"><span><strong>${esc(s.title)}</strong><span class="dates">${esc(s.date || '')}</span></span>${st.laurels.includes(s.id) ? laurel(30) : '<span class="go">Begin ›</span>'}</a></li>`
            : `<li class="planned">More scenes in preparation</li>`).join('')}
        </ol>
      </section>`).join('')}
  </main>`;
}

// ---------- campaign screen: map, scenes, and the record of counsel ----------

function findCampaign(id) {
  for (const w of INDEX.wings) for (const c of w.campaigns) if (c.id === id) return { w, c };
  return {};
}

// Equirectangular projection matching tools/maps/*.py: bounds = [lon0, lon1, lat0, lat1].
function project(map, p) {
  if (p.at) return p.at;
  const [lon0, lon1, lat0, lat1] = map.bounds;
  return [((p.lon - lon0) / (lon1 - lon0)) * 100, ((lat1 - p.lat) / (lat1 - lat0)) * 100];
}

function renderMap(map, pins) {
  return `<div class="map-wrap">
    <img src="${esc(map.src)}" alt="${esc(map.alt)}" class="map-img">
    ${pins.join('')}
  </div>`;
}

async function renderCampaign(id) {
  const { w, c } = findCampaign(id);
  if (!c) return renderHome();
  document.body.dataset.palette = w.palette;
  const st = getState();
  const map = INDEX.maps[c.map];
  const playable = c.scenes.filter((s) => s.file);
  const nextUp = playable.find((s) => !st.laurels.includes(s.id));
  const pins = playable.filter((s) => s.site).map((s, i) => {
    const [x, y] = project(map, s.site);
    const done = st.laurels.includes(s.id);
    return `<a class="pin scene-pin ${done ? 'done' : ''} ${s === nextUp ? 'next' : ''}" href="#/scene/${s.id}" style="left:${x}%;top:${y}%"
      aria-label="${esc(s.title)}${done ? ', finished' : ''}"><span class="dot">${done ? laurel(18) : c.scenes.indexOf(s) + 1}</span></a>`;
  });

  // The record: Grumpa's counsel beside what happened, decision by decision.
  const record = [];
  for (const s of playable) {
    const counsel = (st.counsel || {})[s.id] || {};
    if (!Object.keys(counsel).length) continue;
    const sc = await scene(s.id);
    const rows = sc.steps.filter((x) => x.kind === 'decision' && counsel[x.id]).map((d) => {
      const o = d.options.find((x) => x.id === counsel[d.id]);
      if (!o) return '';
      return `<div class="rec-row">
        <p class="rec-q">${esc(d.prompt)}</p>
        <div class="rec-pair">
          <div class="rec-you"><span class="eyebrow">Your counsel</span><p>${esc(o.label)}</p>
            ${o.kind === 'historical' ? '<p class="rec-tag same">What was done</p>' : o.kind === 'counterfactual' ? '<p class="rec-tag"><span class="cf-tag">Counterfactual</span></p>' : '<p class="rec-tag">Advice on record, not taken</p>'}</div>
          <div class="rec-hist"><span class="eyebrow">What happened</span>${d.outcome ? renderBlock(sc, d.outcome) : ''}</div>
        </div></div>`;
    }).join('');
    record.push(`<section class="rec-scene"><h3>${esc(s.title)} <span class="dates">${esc(s.date || '')}</span></h3>${rows}</section>`);
    SCENES[s.id] = sc;
  }

  app.innerHTML = `
  <main class="page campaign-page">
    ${backLink(`#/wing/${w.id}`, w.title)}
    <h1>${esc(c.title)}</h1>
    <p class="sub">${esc(w.title)}</p>
    ${map ? renderMap(map, pins) : ''}
    ${map && map.credit ? `<details class="map-credit"><summary>Where the places come from</summary><p>${esc(map.credit)}</p></details>` : ''}
    <ol class="scenes">
      ${c.scenes.map((s, i) => s.file
        ? `<li><a class="scene-link" href="#/scene/${s.id}"><span><strong>${i + 1}. ${esc(s.title)}</strong><span class="dates">${esc(s.date || '')}</span></span>${st.laurels.includes(s.id) ? laurel(30) : '<span class="go">Begin ›</span>'}</a></li>`
        : `<li class="planned">More scenes in preparation</li>`).join('')}
    </ol>
    <h2>Your counsel and what happened</h2>
    ${record.length ? record.join('') : '<p class="quiet">Your answers will be kept here, scene by scene, beside what the sources say was done.</p>'}
  </main>`;
  bindRecord();
}

function bindRecord() {
  app.querySelectorAll('[data-about]').forEach((btn) => btn.addEventListener('click', () => {
    const sc = SCENES[btn.closest('[data-scene]')?.dataset.scene] || Object.values(SCENES).find((x) => findBlock(x, btn.dataset.about));
    openAbout(sc, findBlock(sc, btn.dataset.about));
  }));
  app.querySelectorAll('.map-img').forEach((img) => img.addEventListener('click', () => openFigure(img)));
}

// ---------- scene player ----------

async function renderScene(id) {
  const sc = await scene(id);
  const w = INDEX.wings.find((x) => x.id === sc.wing);
  document.body.dataset.palette = w ? w.palette : 'study';
  const st = getState();
  const prog = st.progress[id] || (st.progress[id] = { step: 0, choices: {}, done: false });
  const shown = sc.steps.slice(0, prog.step + 1);

  app.innerHTML = `
  <main class="page scene">
    ${campaignBack(sc, w)}
    <header class="scene-head">
      <div class="portrait small">${grumpa(sc.outfit || 'study', { size: 84 })}</div>
      <div>
        <h1>${esc(sc.title)}</h1>
        <p class="sub">${esc(sc.place)} · ${esc(sc.date)} · You are ${esc(sc.role)}</p>
      </div>
    </header>
    ${sc.status !== 'checked' ? '<p class="draft-banner">Draft: not yet through the fact-check.</p>' : ''}
    <div class="steps">${shown.map((s) => renderStep(sc, s, prog)).join('')}</div>
    <div class="scene-foot">${sceneFooter(sc, prog)}</div>
  </main>`;

  bindBlocks(sc);
  app.querySelectorAll('[data-choose]').forEach((b) => b.addEventListener('click', () => {
    const [dec, opt] = b.dataset.choose.split(':');
    update((s) => {
      s.progress[id].choices[dec] = opt;
      s.counsel = s.counsel || {};
      (s.counsel[id] = s.counsel[id] || {})[dec] = opt;
    });
    renderScene(id).then(() => document.getElementById(`step-${dec}`)?.scrollIntoView({ block: 'start' }));
  }));
  app.querySelectorAll('[data-reconsider]').forEach((b) => b.addEventListener('click', () => {
    const dec = b.dataset.reconsider;
    const idx = sc.steps.findIndex((s) => s.id === dec);
    update((s) => { delete s.progress[id].choices[dec]; s.progress[id].step = idx; });
    renderScene(id).then(() => document.getElementById(`step-${dec}`)?.scrollIntoView({ block: 'start' }));
  }));
  app.querySelectorAll('[data-place]').forEach((pin) => pin.addEventListener('click', () => {
    const sec = pin.closest('.decision');
    const on = !pin.classList.contains('on');
    sec.querySelectorAll('[data-place]').forEach((p) => p.classList.remove('on'));
    pin.classList.toggle('on', on);
    sec.querySelectorAll('.option').forEach((o) => { o.hidden = on && o.dataset.at !== pin.dataset.place; });
    const all = sec.querySelector('[data-allopts]');
    all.hidden = !on;
    if (on) sec.querySelector('.option:not([hidden])')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
  app.querySelectorAll('[data-allopts]').forEach((b) => b.addEventListener('click', () => {
    const sec = b.closest('.decision');
    sec.querySelectorAll('[data-place]').forEach((p) => p.classList.remove('on'));
    sec.querySelectorAll('.option').forEach((o) => { o.hidden = false; });
    b.hidden = true;
  }));
  const next = app.querySelector('[data-next]');
  if (next) next.addEventListener('click', () => {
    const newStep = prog.step + 1;
    update((s) => {
      s.progress[id].step = newStep;
      const step = sc.steps[newStep];
      if (step && step.kind === 'cards') for (const c of step.cards) s.cards[c] = s.cards[c] || { at: new Date().toISOString(), scene: id };
    });
    renderScene(id).then(() => document.getElementById(`step-${sc.steps[newStep].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
  const fin = app.querySelector('[data-finish]');
  if (fin) fin.addEventListener('click', () => {
    update((s) => { s.progress[id].done = true; if (!s.laurels.includes(id)) s.laurels.push(id); });
    renderScene(id);
  });
  const again = app.querySelector('[data-replay]');
  if (again) again.addEventListener('click', () => {
    update((s) => { s.progress[id] = { step: 0, choices: {}, done: false }; });
    renderScene(id);
  });
}

function campaignBack(sc, w) {
  const { c } = findCampaign(sc.campaign);
  return c && c.map ? backLink(`#/campaign/${c.id}`, c.title) : backLink(`#/wing/${sc.wing}`, w ? w.title : 'Back');
}

function sceneFooter(sc, prog) {
  const step = sc.steps[prog.step];
  if (step.kind === 'decision' && !prog.choices[step.id]) return '';
  if (prog.step < sc.steps.length - 1) return `<button class="btn primary" data-next>Continue</button>`;
  if (!prog.done) return `<button class="btn primary" data-finish>Close the scene</button>`;
  return `<div class="done">${laurel(40)}<p>Scene complete. Its cards are in your Codex.</p>
    <a class="btn" href="${findCampaign(sc.campaign).c?.map ? `#/campaign/${sc.campaign}` : `#/wing/${sc.wing}`}">${findCampaign(sc.campaign).c?.map ? 'Back to the campaign' : 'Back to the era'}</a> <button class="btn quiet-btn" data-replay>Play again</button></div>`;
}

function renderStep(sc, s, prog) {
  if (s.kind === 'brief') return `<section class="step brief" id="step-${s.id}">
      <h3 class="speaker">${esc(s.speaker)}</h3>${s.blocks.map((b) => renderBlock(sc, b)).join('')}</section>`;
  if (s.kind === 'reveal') return `<section class="step reveal" id="step-${s.id}">
      <h3 class="speaker">${esc(s.title)}</h3>${s.blocks.map((b) => renderBlock(sc, b)).join('')}</section>`;
  if (s.kind === 'cards') return `<section class="step cards" id="step-${s.id}">
      <h3 class="speaker">${esc(s.title)}</h3>
      ${s.cards.map((cid) => renderCard(sc, sc.cards.find((c) => c.id === cid))).join('')}</section>`;
  if (s.kind === 'decision') {
    const chosen = prog.choices[s.id];
    const map = s.map && INDEX.maps[s.map.id];
    const o = chosen && s.options.find((x) => x.id === chosen);
    const pins = map ? s.map.places.map((p) => {
      const [x, y] = project(map, p);
      const box = p.box ? `width:${p.box[0]}%;height:${p.box[1]}%;` : '';
      const sel = o && o.place === p.id ? 'on' : '';
      return chosen
        ? `<span class="pin place-pin ${p.box ? 'box' : ''} ${sel}" style="left:${x}%;top:${y}%;${box}" aria-hidden="true"></span>`
        : `<button class="pin place-pin ${p.box ? 'box' : ''}" data-place="${p.id}" style="left:${x}%;top:${y}%;${box}" aria-label="${esc(p.label)}"></button>`;
    }) : [];
    const mapHtml = map ? `<div class="decision-map">${renderMap(map, pins)}
        <p class="map-hint">${chosen ? 'The place of your counsel is marked.' : 'Tap a place on the map to see the counsel that concerns it, or choose below.'}${s.map.caption ? `&nbsp;${srcButton(s.map.caption)}` : ''}</p></div>` : '';
    if (!chosen) return `<section class="step decision" id="step-${s.id}">
        <h3 class="prompt">${esc(s.prompt)}</h3>
        ${mapHtml}
        ${s.options.map((op) => `<button class="option" data-choose="${s.id}:${op.id}" ${op.place ? `data-at="${op.place}"` : ''}>${esc(op.label)}</button>`).join('')}
        <button class="link-btn" data-allopts hidden>Show all the counsel</button></section>`;
    return `<section class="step decision chosen" id="step-${s.id}">
        <h3 class="prompt">${esc(s.prompt)}</h3>
        ${mapHtml}
        <div class="your-choice"><span class="eyebrow">Your counsel</span><p>${esc(o.label)}</p>
        <p class="kind kind-${o.kind}">${o.kind === 'counterfactual' ? '<span class="cf-tag">Counterfactual</span> ' : ''}${esc(o.kind_note || '')}</p></div>
        ${o.consequence.map((b) => renderBlock(sc, b)).join('')}
        <button class="link-btn" data-reconsider="${s.id}">Reconsider this choice</button></section>`;
  }
  return '';
}

// Each passage ends in a small dagger: tap it for the sources and Grumpa's verdict.
function srcButton(b) {
  const st = getState();
  const disputed = st.disputes.some((d) => d.ref === b.id);
  const mark = disputed ? 'dispute' : st.marks[b.id];
  const label = `Sources${(b.cites || []).length ? `: ${b.cites.join('; ')}` : ''}`;
  return `<button class="src ${mark ? `mark-${mark}` : ''}" data-about="${b.id}" aria-label="${esc(label)}" title="${esc(label)}">†</button>`;
}

function renderBlock(sc, b) {
  const cf = b.confidence === 'counterfactual';
  return `<div class="block ${cf ? 'counterfactual' : ''}" data-block="${b.id}" data-scene="${sc.id}">
    ${cf ? '<span class="cf-tag">Counterfactual</span>' : ''}
    ${b.figure ? renderFigure(b.figure) : ''}
    <p class="${b.figure ? 'caption' : ''}">${esc(b.text)}&nbsp;${srcButton(b)}</p>
    ${b.quote ? renderQuote(b.quote) : ''}
  </div>`;
}

function renderFigure(f) {
  const credit = f.credit ? `<span class="credit">${f.credit_url ? `<a href="${esc(f.credit_url)}" target="_blank" rel="noopener">${esc(f.credit)}</a>` : esc(f.credit)}</span>` : '';
  return `<figure class="art ${f.kind === 'photo' ? 'photo' : ''}">
    <img src="${esc(f.src)}" alt="${esc(f.alt)}" title="Tap to enlarge" loading="lazy" onerror="this.closest('figure').hidden=true">
    ${credit}
  </figure>`;
}

function openFigure(img) {
  const wrap = document.createElement('div');
  wrap.className = 'viewer';
  wrap.innerHTML = `<img src="${img.getAttribute('src')}" alt="${esc(img.alt)}">
    <p class="quiet">Turn the phone sideways for a larger view.</p>
    <button class="btn primary" data-close>Close</button>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('click', () => wrap.remove());
}

function renderQuote(q) {
  return `<figure class="quote">
    <blockquote lang="${q.lang === 'grc' ? 'grc' : 'la'}">${esc(q.la)}</blockquote>
    <figcaption>${esc(q.cite)}</figcaption>
    <div class="q-tabs"><button class="q-btn" data-q="en">English</button><button class="q-btn" data-q="it">Italiano</button></div>
    <p class="q-trans" data-lang="en" hidden>${esc(q.en)} <span class="quiet">(${q.en_src === 'ours' ? 'our translation' : esc(q.en_src)})</span></p>
    <p class="q-trans" data-lang="it" hidden lang="it">${esc(q.it)} <span class="quiet">(traduzione nostra)</span></p>
  </figure>`;
}

function renderCard(sc, c) {
  if (!c) return '';
  return `<article class="card" id="card-${c.id}">
    <header><span class="tier tier-${c.tier}">${TIER_LABEL[c.tier] || ''}</span><h4>${esc(c.title)}</h4></header>
    ${c.ruling ? `<p class="ruling">Grumpa's ruling (${esc(c.ruling.date)}): ${esc(c.ruling.note)}</p>` : ''}
    ${c.blocks.map((b) => renderBlock(sc, b)).join('')}
  </article>`;
}

function findBlock(sc, id) {
  const walk = (blocks) => blocks.find((b) => b.id === id);
  for (const s of sc.steps) {
    if (s.blocks) { const b = walk(s.blocks); if (b) return b; }
    if (s.outcome && s.outcome.id === id) return s.outcome;
    if (s.map && s.map.caption && s.map.caption.id === id) return s.map.caption;
    if (s.options) for (const o of s.options) { const b = walk(o.consequence); if (b) return b; }
  }
  for (const c of sc.cards || []) { const b = walk(c.blocks); if (b) return b; }
  return null;
}

function bindBlocks(sc) {
  app.querySelectorAll('.q-btn').forEach((btn) => btn.addEventListener('click', () => {
    const fig = btn.closest('figure');
    const target = fig.querySelector(`[data-lang="${btn.dataset.q}"]`);
    const show = target.hidden;
    fig.querySelectorAll('.q-trans').forEach((p) => { p.hidden = true; });
    fig.querySelectorAll('.q-btn').forEach((b) => b.classList.remove('on'));
    target.hidden = !show;
    btn.classList.toggle('on', show);
  }));
  app.querySelectorAll('[data-about]').forEach((btn) => btn.addEventListener('click', () => openAbout(sc, findBlock(sc, btn.dataset.about))));
  app.querySelectorAll('.art img').forEach((img) => img.addEventListener('click', () => openFigure(img)));
}

// ---------- the "about this" sheet: sources and Grumpa's verdict ----------

function openAbout(sc, b) {
  if (!b) return;
  const st = getState();
  const srcLinks = (b.cites || []).map((c) => {
    const key = Object.keys(sc.sources || {}).find((k) => c.startsWith(k));
    const s = key && sc.sources[key];
    return `<li>${esc(c)}${s ? ` — <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>` : ''}</li>`;
  }).join('');
  const sheet = document.createElement('div');
  sheet.className = 'sheet-wrap';
  sheet.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="About this passage">
    <p class="eyebrow">${esc(CONF_LABEL[b.confidence] || '')}</p>
    <p class="excerpt">${esc(b.text)}</p>
    ${srcLinks ? `<h4>Sources</h4><ul class="sources">${srcLinks}</ul>` : '<p class="quiet">No source: this line is the game\'s own.</p>'}
    ${b.note ? `<p class="note">${esc(b.note)}</p>` : ''}
    ${st.disputes.some((d) => d.ref === b.id) ? '<p class="quiet">You have disputed this passage; it is in your Notebook.</p>' : ''}
    <div class="verdicts">
      <button class="btn ${st.marks[b.id] === 'knew' ? 'on' : ''}" data-mark="knew">Knew it</button>
      <button class="btn ${st.marks[b.id] === 'new' ? 'on' : ''}" data-mark="new">New to me</button>
      <button class="btn dispute" data-dispute>I dispute this</button>
    </div>
    <div class="dispute-form" hidden>
      <label for="dnote">What's wrong? Type, or tap the microphone on the keyboard to dictate.</label>
      <textarea id="dnote" rows="5"></textarea>
      <button class="btn primary" data-send>Save my dispute</button>
    </div>
    <button class="btn quiet-btn close" data-close>Close</button>
  </div>`;
  document.body.appendChild(sheet);
  const close = () => { sheet.remove(); renderSceneOrStay(sc); };
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  sheet.querySelector('[data-close]').addEventListener('click', close);
  sheet.querySelectorAll('[data-mark]').forEach((btn) => btn.addEventListener('click', () => {
    const m = btn.dataset.mark;
    update((s) => { if (s.marks[b.id] === m) delete s.marks[b.id]; else s.marks[b.id] = m; });
    sendMark(b.id, sc.id, getState().marks[b.id] || 'cleared');
    close();
  }));
  sheet.querySelector('[data-dispute]').addEventListener('click', () => {
    sheet.querySelector('.dispute-form').hidden = false;
    sheet.querySelector('textarea').focus();
  });
  sheet.querySelector('[data-send]').addEventListener('click', () => {
    const note = sheet.querySelector('textarea').value.trim();
    if (!note) { sheet.querySelector('textarea').focus(); return; }
    addDispute({ sceneId: sc.id, ref: b.id, excerpt: b.text, note });
    sheet.querySelector('.sheet').innerHTML = `<p class="excerpt">Saved to your Notebook${CONFIG.endpoint ? ' and sent to Matthew' : ''}. Thank you.</p><button class="btn primary" data-close>Close</button>`;
    sheet.querySelector('[data-close]').addEventListener('click', close);
  });
}

function renderSceneOrStay(sc) {
  const y = window.scrollY;
  const [, view] = (location.hash || '#/').split('/');
  const arg = location.hash.split('/')[2];
  const p = view === 'scene' ? renderScene(sc.id) : view === 'codex' ? renderCodex(arg) : view === 'campaign' ? renderCampaign(arg) : null;
  Promise.resolve(p).then(() => window.scrollTo(0, y));
}

// ---------- codex ----------

async function renderCodex(cardId) {
  const st = getState();
  const unlocked = Object.entries(st.cards);
  const groups = {};
  for (const [cid, meta] of unlocked) {
    if (!SCENE_FILES[meta.scene]) continue;
    const sc = await scene(meta.scene);
    const c = sc.cards.find((x) => x.id === cid);
    if (c) (groups[sc.wing] = groups[sc.wing] || []).push({ sc, c });
  }
  if (cardId) {
    for (const list of Object.values(groups)) {
      const hit = list.find((x) => x.c.id === cardId);
      if (hit) {
        app.innerHTML = `<main class="page">${backLink('#/codex', 'Codex')}${renderCard(hit.sc, hit.c)}</main>`;
        bindBlocks(hit.sc);
        return;
      }
    }
  }
  app.innerHTML = `<main class="page">${backLink()}
    <h1>Codex</h1>
    ${unlocked.length ? '' : '<p class="quiet">Cards unlock as you finish scenes.</p>'}
    ${Object.entries(groups).map(([wid, list]) => `<h2>${esc(INDEX.wings.find((w) => w.id === wid)?.title || wid)}</h2>
      <ul class="codex-list">${list.map(({ c }) => `<li><a href="#/codex/${c.id}"><span class="tier tier-${c.tier}">${TIER_LABEL[c.tier]}</span> ${esc(c.title)}</a></li>`).join('')}</ul>`).join('')}
  </main>`;
}

// ---------- notebook ----------

function renderNotebook() {
  const st = getState();
  const newOnes = Object.entries(st.marks).filter(([, m]) => m === 'new').map(([ref]) => ref);
  app.innerHTML = `<main class="page notebook">${backLink()}
    <h1>Notebook</h1>
    <h2>Disputes</h2>
    ${st.disputes.length ? `<ul class="nb-list">${st.disputes.slice().reverse().map((d) => `<li>
      <p class="excerpt">“${esc(d.excerpt)}”</p><p>${esc(d.note)}</p>
      <p class="quiet">${new Date(d.at).toLocaleDateString()} · ${esc(sceneTitle(d.sceneId))} · ${d.sent ? 'sent to Matthew' : 'saved on this device'}</p></li>`).join('')}</ul>` : '<p class="quiet">None yet. Tap the † at the end of any passage to see its sources or dispute it.</p>'}
    <h2>New to me</h2>
    ${newOnes.length ? `<p>${newOnes.length} passage${newOnes.length > 1 ? 's' : ''} marked.</p>` : '<p class="quiet">Passages you mark “New to me” are counted here.</p>'}
    <h2>Notes</h2>
    <textarea id="note" rows="4" placeholder="A note for yourself"></textarea>
    <button class="btn" data-addnote>Add note</button>
    <ul class="nb-list">${st.notes.slice().reverse().map((n) => `<li><p>${esc(n.text)}</p><p class="quiet">${new Date(n.at).toLocaleDateString()}</p></li>`).join('')}</ul>
    <button class="btn quiet-btn" data-print>Print or save as PDF</button>
  </main>`;
  app.querySelector('[data-addnote]').addEventListener('click', () => {
    const t = app.querySelector('#note').value.trim();
    if (!t) return;
    update((s) => s.notes.push({ id: `n${Date.now().toString(36)}`, text: t, at: new Date().toISOString() }));
    renderNotebook();
  });
  app.querySelector('[data-print]').addEventListener('click', () => window.print());
}

// ---------- settings ----------

function renderSettings() {
  const st = getState();
  app.innerHTML = `<main class="page">${backLink()}
    <h1>Settings</h1>
    <h2>Text size</h2>
    <div class="row"><button class="btn" data-fs="-1" aria-label="Smaller text">A−</button>
      <span class="fs-val">${st.textSize}</span>
      <button class="btn" data-fs="1" aria-label="Larger text">A+</button></div>
    <p>The quick brown fox: <span lang="la">arma virumque cano</span>.</p>
    <h2>Saving</h2>
    <p>${syncEnabled() ? 'Your progress is kept in step between your phone and computer.' : 'Your progress is saved on this device.'}</p>
    <h2>Start over</h2>
    <p class="quiet">Clears scenes and laurels. Your disputes and notes are kept.</p>
    <button class="btn quiet-btn" data-reset>Clear my progress</button>
    <div class="confirm" hidden><p>Clear all progress?</p><button class="btn primary" data-reset-yes>Yes, clear it</button> <button class="btn" data-reset-no>Keep it</button></div>
  </main>`;
  app.querySelectorAll('[data-fs]').forEach((b) => b.addEventListener('click', () => {
    update((s) => { s.textSize = Math.max(20, Math.min(28, s.textSize + Number(b.dataset.fs))); });
    applyTextSize(); renderSettings();
  }));
  app.querySelector('[data-reset]').addEventListener('click', () => { app.querySelector('.confirm').hidden = false; });
  app.querySelector('[data-reset-no]').addEventListener('click', () => { app.querySelector('.confirm').hidden = true; });
  app.querySelector('[data-reset-yes]').addEventListener('click', () => { resetProgress(); renderSettings(); });
}

boot();
