"""Check content files against the rules in CLAUDE.md. Run: python3 tools/validate.py"""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / 'content'
idx = json.load(open(root / 'index.json'))
problems = []
for mid, mp in idx.get('maps', {}).items():
    if not (root.parent / mp['src']).exists(): problems.append(f"map {mid}: missing file {mp['src']}")
CONF = {'attested', 'inferred', 'reconstructed', 'counterfactual'}
for w in idx['wings']:
    for c in w['campaigns']:
        if c.get('map') and c['map'] not in idx.get('maps', {}): problems.append(f"campaign {c['id']}: missing map {c['map']}")
        for s in c['scenes']:
            if s.get('site') and not s['site'].get('pleiades'): problems.append(f"{s['id']}: site without Pleiades id")
            if not s.get('file'):
                continue
            sc = json.load(open(root / s['file']))
            ids = set()
            def check(b, where):
                if b['id'] in ids: problems.append(f"{sc['id']}: duplicate id {b['id']}")
                ids.add(b['id'])
                if b.get('confidence') not in CONF: problems.append(f"{sc['id']}:{b['id']} bad confidence")
                if b.get('confidence') != 'counterfactual' and not b.get('cites'): problems.append(f"{sc['id']}:{b['id']} no cites")
                f = b.get('figure')
                if f and not f.get('alt'): problems.append(f"{sc['id']}:{b['id']} figure without alt text")
                if f and f.get('src', '').startswith('http') and not f.get('credit'): problems.append(f"{sc['id']}:{b['id']} external figure without credit")
                if f and not f.get('src', '').startswith('http') and not (root.parent / f['src']).exists(): problems.append(f"{sc['id']}:{b['id']} missing file {f['src']}")
                q = b.get('quote')
                if q and not all(q.get(k) for k in ('la', 'en', 'en_src', 'it', 'cite')): problems.append(f"{sc['id']}:{b['id']} incomplete quote")
            card_ids = {c['id'] for c in sc.get('cards', [])}
            for st in sc['steps']:
                for b in st.get('blocks', []): check(b, st['id'])
                if st.get('kind') == 'decision':
                    if st.get('outcome'): check(st['outcome'], st['id'])
                    else: problems.append(f"{sc['id']}: decision {st['id']} has no outcome (needed for the campaign record)")
                    if not any(o.get('kind') == 'historical' for o in st['options']): problems.append(f"{sc['id']}: decision {st['id']} has no historical option")
                if st.get('map'):
                    mp = idx.get('maps', {}).get(st['map']['id'])
                    if not mp: problems.append(f"{sc['id']}: step {st['id']} names missing map {st['map']['id']}")
                    pids = {p['id'] for p in st['map']['places']}
                    for p in st['map']['places']:
                        if not p.get('pleiades'): problems.append(f"{sc['id']}: map place {p['id']} without Pleiades id")
                        if mp and 'lon' in p and not (mp['bounds'][0] <= p['lon'] <= mp['bounds'][1] and mp['bounds'][2] <= p['lat'] <= mp['bounds'][3]): problems.append(f"{sc['id']}: map place {p['id']} outside the map")
                    for o in st['options']:
                        if o.get('place') and o['place'] not in pids: problems.append(f"{sc['id']}: option {o['id']} names missing place {o['place']}")
                    if st['map'].get('caption'): check(st['map']['caption'], st['id'])
                    else: problems.append(f"{sc['id']}: map in {st['id']} has no caption")
                for o in st.get('options', []):
                    for b in o['consequence']: check(b, o['id'])
                for cid in st.get('cards', []):
                    if cid not in card_ids: problems.append(f"{sc['id']}: step {st['id']} names missing card {cid}")
            for cd in sc.get('cards', []):
                for b in cd['blocks']: check(b, cd['id'])
            if sc.get('status') != 'checked': problems.append(f"{sc['id']}: status is {sc.get('status')} (not shippable)")
print('\n'.join(problems) or 'All content passes.')
sys.exit(1 if problems else 0)
