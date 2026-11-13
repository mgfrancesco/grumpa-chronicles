import { CONFIG } from './config.js';

const STATE_KEY = 'gc-state-v1';
const SYNC_KEY = 'gc-sync-key';

const fresh = () => ({
  v: 1,
  textSize: 21,
  progress: {},   // sceneId -> { step, choices: {decisionId: optionId}, done }
  laurels: [],    // sceneIds completed
  cards: {},      // cardId -> { at }
  marks: {},      // ref -> 'knew' | 'new'
  disputes: [],   // { id, sceneId, ref, excerpt, note, at, sent }
  notes: [],      // { id, text, at }
  updatedAt: 0
});

let state = fresh();
let onRemoteUpdate = () => {};
let pushTimer = null;

export function getState() { return state; }

export function syncKey() {
  try { return localStorage.getItem(SYNC_KEY) || ''; } catch { return ''; }
}

export function load() {
  // A personal link (…/?key=XXXX) ties this device to Grumpa's save once.
  const url = new URL(location.href);
  const k = url.searchParams.get('key');
  // The key stays in the address on purpose: an iPhone home-screen app has its own
  // storage, separate from Safari, and launches from the address it was added with.
  if (k) {
    try { localStorage.setItem(SYNC_KEY, k); } catch {}
  }
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) state = { ...fresh(), ...JSON.parse(raw) };
  } catch {}
  return state;
}

export function save() {
  state.updatedAt = Date.now();
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
  schedulePush();
}

export function update(fn) { fn(state); save(); }

export function resetProgress() {
  const keep = { textSize: state.textSize, disputes: state.disputes, notes: state.notes };
  state = { ...fresh(), ...keep };
  save();
}

// ---- sync with the Apps Script endpoint (optional) ----

export function setRemoteListener(fn) { onRemoteUpdate = fn; }

export function syncEnabled() { return Boolean(CONFIG.endpoint && syncKey()); }

export async function pull() {
  if (!syncEnabled()) return false;
  try {
    const r = await fetch(`${CONFIG.endpoint}?action=load&key=${encodeURIComponent(syncKey())}`);
    const data = await r.json();
    if (data && data.state && (data.state.updatedAt || 0) > (state.updatedAt || 0)) {
      state = { ...fresh(), ...data.state };
      try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
      onRemoteUpdate();
      return true;
    }
  } catch {}
  return false;
}

function schedulePush() {
  if (!syncEnabled()) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 1500);
}

export async function push() {
  if (!syncEnabled()) return;
  try {
    // text/plain avoids a CORS preflight, which Apps Script cannot answer.
    await fetch(CONFIG.endpoint, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'save', key: syncKey(), state })
    });
  } catch {}
}
