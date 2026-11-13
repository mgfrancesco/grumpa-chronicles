/**
 * Grumpa's Chronicle — dispute inbox and save sync.
 *
 * Paste into Extensions > Apps Script of a Google Sheet you own, set the script
 * property KEYS to Grumpa's personal key, and deploy as a web app (see docs/setup.md).
 * Only requests carrying a key listed in KEYS are accepted.
 */

function doGet(e) {
  var key = (e.parameter.key || '').trim();
  if (e.parameter.action === 'load') {
    if (!allowed_(key)) return json_({ error: 'unknown key' });
    var row = findSaveRow_(key);
    if (!row) return json_({ state: null });
    var raw = saves_().getRange(row, 3).getValue();
    return json_({ state: raw ? JSON.parse(raw) : null });
  }
  return json_({ ok: true });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents || '{}');
  var key = (body.key || '').trim();
  if (!allowed_(key)) return json_({ error: 'unknown key' });

  if (body.action === 'feedback') {
    var f = body.entry || {};
    feedback_().appendRow([
      new Date(), f.kind || '', f.sceneId || '', f.ref || '',
      f.excerpt || '', f.note || '', f.mark || '', f.id || ''
    ]);
    return json_({ ok: true });
  }

  if (body.action === 'save') {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = saves_();
      var row = findSaveRow_(key);
      var incoming = body.state || {};
      if (row) {
        var current = sheet.getRange(row, 3).getValue();
        var cur = current ? JSON.parse(current) : {};
        if ((incoming.updatedAt || 0) >= (cur.updatedAt || 0)) {
          sheet.getRange(row, 2, 1, 2).setValues([[new Date(), JSON.stringify(incoming)]]);
        }
      } else {
        sheet.appendRow([key, new Date(), JSON.stringify(incoming)]);
      }
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  }

  return json_({ error: 'unknown action' });
}

function allowed_(key) {
  var keys = (PropertiesService.getScriptProperties().getProperty('KEYS') || '')
    .split(',').map(function (k) { return k.trim(); }).filter(String);
  return key && keys.indexOf(key) !== -1;
}

function feedback_() {
  return sheet_('Disputes', ['When', 'Kind', 'Scene', 'Passage id', 'Passage', 'Grumpa\'s note', 'Mark', 'Dispute id']);
}

function saves_() {
  return sheet_('Saves', ['Key', 'Updated', 'State (JSON)']);
}

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
  }
  return sh;
}

function findSaveRow_(key) {
  var sh = saves_();
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var keys = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) if (keys[i][0] === key) return i + 2;
  return 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
