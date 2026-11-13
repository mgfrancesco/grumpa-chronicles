"""Check content files against the rules in CLAUDE.md. Run: python3 tools/validate.py"""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / 'content'
idx = json.load(open(root / 'index.json'))
problems = []
CONF = {'attested', 'inferred', 'reconstructed', 'counterfactual'}
for w in idx['wings']:
    for c in w['campaigns']:
        for s in c['scenes']:
            if not s.get('file'):
                continue
            sc = json.load(open(root / s['file']))
            ids = set()
            def check(b, where):
                if b['id'] in ids: problems.append(f"{sc['id']}: duplicate id {b['id']}")
                ids.add(b['id'])
                if b.get('confidence') not in CONF: problems.append(f"{sc['id']}:{b['id']} bad confidence")
                if b.get('confidence') != 'counterfactual' and not b.get('cites'): problems.append(f"{sc['id']}:{b['id']} no cites")
                q = b.get('quote')
                if q and not all(q.get(k) for k in ('la', 'en', 'en_src', 'it', 'cite')): problems.append(f"{sc['id']}:{b['id']} incomplete quote")
            card_ids = {c['id'] for c in sc.get('cards', [])}
            for st in sc['steps']:
                for b in st.get('blocks', []): check(b, st['id'])
                for o in st.get('options', []):
                    for b in o['consequence']: check(b, o['id'])
                for cid in st.get('cards', []):
                    if cid not in card_ids: problems.append(f"{sc['id']}: step {st['id']} names missing card {cid}")
            for cd in sc.get('cards', []):
                for b in cd['blocks']: check(b, cd['id'])
            if sc.get('status') != 'checked': problems.append(f"{sc['id']}: status is {sc.get('status')} (not shippable)")
print('\n'.join(problems) or 'All content passes.')
sys.exit(1 if problems else 0)
