#!/usr/bin/env python3
"""Validação documental da fase 0. Não testa um app inexistente."""
import pathlib, json, re, sys
root=pathlib.Path(__file__).resolve().parents[1]
cfg=json.loads((root/'harness.config.json').read_text())
required=['AGENTS.md','CLAUDE.md','.github/copilot-instructions.md','docs/harness/00-estado-e-gates.md','docs/harness/02-mapa-erros.md','docs/engenharia/requisitos.md','docs/engenharia/casos-de-uso.md','docs/engenharia/matriz-bncc.md','docs/engenharia/plano-testes.md','docs/design-system/README.md','docs/publicacao/guia-android.md','.claude/skills/nova-atividade-bncc/SKILL.md']
errors=[]
for file in required:
 if not (root/file).is_file():errors.append('Ausente: '+file)
for code in ('EF06MA07','EF06MA08','EF06MA09','EF06MA10'):
 for file in ('docs/engenharia/requisitos.md','docs/engenharia/matriz-bncc.md'):
  if code not in (root/file).read_text():errors.append(f'{code} ausente em {file}')
if cfg.get('appImplementationAllowed') is not False:errors.append('Fase deve bloquear implementação')
for name in ('src','node_modules','package.json','app.json'):
 if (root/name).exists():errors.append('Fase 0 não deve incluir '+name)
rf=set(re.findall(r'RF\d{2}',(root/'docs/engenharia/requisitos.md').read_text()))
uc=set(re.findall(r'UC\d{2}',(root/'docs/engenharia/casos-de-uso.md').read_text()))
for label,values in [('RF',rf),('UC',uc)]:
 if not values:errors.append(f'Nenhum {label} identificado')
print('Harness documental:', 'FALHOU' if errors else 'PASSOU')
for error in errors:print(' -',error)
print('App/Android/build: NÃO EXECUTADO — fora do escopo da fase 0')
sys.exit(bool(errors))
