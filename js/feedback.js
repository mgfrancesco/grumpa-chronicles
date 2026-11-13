import { CONFIG } from './config.js';
import { getState, save, syncKey } from './store.js';

// Disputes are always kept in Grumpa's Notebook on the device, and sent to
// Matthew's Google Sheet when an endpoint is configured. Unsent ones retry on launch.

export function addDispute({ sceneId, ref, excerpt, note }) {
  const d = {
    id: `d${Date.now().toString(36)}`,
    sceneId, ref, excerpt: (excerpt || '').slice(0, 300), note,
    at: new Date().toISOString(),
    sent: false
  };
  getState().disputes.push(d);
  save();
  send(d);
  return d;
}

export async function send(d) {
  if (!CONFIG.endpoint) return false;
  try {
    await fetch(CONFIG.endpoint, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'feedback', key: syncKey(), entry: { kind: 'dispute', ...d } })
    });
    d.sent = true;
    save();
    return true;
  } catch { return false; }
}

export function retryUnsent() {
  for (const d of getState().disputes) if (!d.sent) send(d);
}

export function sendMark(ref, sceneId, mark) {
  if (!CONFIG.endpoint) return;
  fetch(CONFIG.endpoint, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'feedback', key: syncKey(), entry: { kind: 'mark', ref, sceneId, mark, at: new Date().toISOString() } })
  }).catch(() => {});
}
