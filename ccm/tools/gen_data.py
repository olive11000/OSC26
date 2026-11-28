# Génère src/data_fiche.js (fiches en cartes) et src/data_quiz.js (QCM) pour Mission CCM.
# Sources : tools/fiche1.md … fiche5.md (une section « @@ id » par mission) et ../qcm/data/ccm.json
import re, json, os, markdown
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src')
md = markdown.Markdown(extensions=['tables', 'sane_lists'])
def html(s):
    md.reset(); h = md.convert(s.strip())
    h = h.replace('<table>', '<table>').replace('\n</', '</')
    return h
fiche = {}
for n in range(1, 6):
    txt = open(os.path.join(HERE, f'fiche{n}.md'), encoding='utf-8').read()
    for part in re.split(r'^@@ ', txt, flags=re.M)[1:]:
        mid, _, body = part.partition('\n')
        mid = mid.strip()
        cards, oral = [], []
        for blk in re.split(r'^## ', body, flags=re.M)[1:]:
            title, _, content = blk.partition('\n')
            title = title.strip()
            if title.startswith('?'):
                oral = [re.sub(r'^- ', '', l).strip() for l in content.strip().splitlines() if l.startswith('- ')]
                continue
            kind = 'trap' if title.startswith('!') else 'info'
            cards.append({'t': title.lstrip('!').strip(), 'kind': kind, 'html': html(content)})
        fiche[mid] = {'cards': cards, 'oral': oral}
with open(os.path.join(SRC, 'data_fiche.js'), 'w', encoding='utf-8') as f:
    f.write('// Généré par tools/gen_data.py à partir de tools/fiche*.md : ne pas modifier à la main\n')
    f.write('export const FICHE = ' + json.dumps(fiche, ensure_ascii=False) + ';\n')
qd = json.load(open(os.path.join(HERE, '..', '..', 'qcm', 'data', 'ccm.json'), encoding='utf-8'))
quiz = {}
for q in qd['questions']:
    quiz.setdefault(q['c'], []).append([q['t'], q['o'], 0, q['e'] or ''])
with open(os.path.join(SRC, 'data_quiz.js'), 'w', encoding='utf-8') as f:
    f.write('// Généré par tools/gen_data.py à partir de qcm/data/ccm.json (la bonne réponse est la première option)\n')
    f.write('export const QUIZ = ' + json.dumps(quiz, ensure_ascii=False) + ';\n')
    f.write('export const CHAPTERS = ' + json.dumps({c['id']: c['titre'] for c in qd['chapitres']}, ensure_ascii=False) + ';\n')
print({k: (len(v['cards']), len(v['oral'])) for k, v in fiche.items()})
print(len(fiche), 'missions ;', sum(len(v) for v in quiz.values()), 'QCM')
