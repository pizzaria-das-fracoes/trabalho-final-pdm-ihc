#!/usr/bin/env python3
"""Validação documental das fases do FatiaMática."""
import pathlib
import json
import re
import sys

root = pathlib.Path(__file__).resolve().parents[1]
cfg = json.loads((root / 'harness.config.json').read_text())
phase = cfg.get('phase', 'fase-0')

errors = []

# Common required docs for all phases
required_common = [
    'AGENTS.md',
    'docs/harness/00-estado-e-gates.md',
    'docs/harness/02-mapa-erros.md',
    'docs/engenharia/requisitos.md',
    'docs/engenharia/casos-de-uso.md',
    'docs/engenharia/matriz-bncc.md',
    'docs/engenharia/plano-testes.md',
    'docs/design-system/README.md',
]

# Phase-specific required docs
phase_docs = {
    'fase-0': [
        'CLAUDE.md',
        '.github/copilot-instructions.md',
        'docs/publicacao/guia-android.md',
        '.claude/skills/nova-atividade-bncc/SKILL.md',
    ],
    'implementation-partial': [
        'docs/harness/01-arquitetura-mvvm.md',
        'docs/harness/02-convencoes-de-codigo.md',
        'docs/harness/03-expo-e-react-native.md',
        'docs/harness/04-views-e-design-system.md',
        'docs/harness/04-checklist-entrega.md',
        'docs/harness/07-registro-de-mudancas.md',
    ],
}

# Check required docs
all_required = required_common + phase_docs.get(phase, [])
for file in all_required:
    if not (root / file).is_file():
        errors.append(f'Ausente: {file}')

# Check BNCC codes in key docs
for code in ('EF06MA07', 'EF06MA08', 'EF06MA09', 'EF06MA10'):
    for file in ('docs/engenharia/requisitos.md', 'docs/engenharia/matriz-bncc.md'):
        if code not in (root / file).read_text():
            errors.append(f'{code} ausente em {file}')

# Phase-specific checks
if phase == 'fase-0':
    if cfg.get('appImplementationAllowed') is not False:
        errors.append('Fase 0 deve bloquear implementação (appImplementationAllowed=false)')
    for name in ('src', 'node_modules', 'package.json', 'app.json'):
        if (root / name).exists():
            errors.append(f'Fase 0 não deve incluir {name}')

elif phase == 'implementation-partial':
    # Verify src exists and has required layers
    if not (root / 'src').is_dir():
        errors.append('implementation-partial requer pasta src/')
    else:
        for layer in cfg.get('requiredSrcLayers', []):
            if not (root / 'src' / layer).is_dir():
                errors.append(f'Camada src/{layer} ausente')
    # Verify forbidden vocabulary (exclude node_modules, .kilo, dist, build, .git)
    forbidden_vocab = cfg.get('forbiddenVocabulary', [])
    exclude_dirs = {'.kilo', 'node_modules', 'dist', 'build', '.git', '__tests__', '.expo'}
    for f in root.rglob('*.ts'):
        if any(part in exclude_dirs for part in f.parts):
            continue
        if f.is_file() and 'test' not in f.name:
            text = f.read_text()
            for word in forbidden_vocab:
                if word in text:
                    errors.append(f'Vocabulário proibido "{word}" em {f.relative_to(root)}')
    # Verify forbidden imports (simplified check)
    forbidden_imports = cfg.get('forbiddenImports', {})
    for layer, forbidden in forbidden_imports.items():
        layer_path = root / 'src' / layer
        if layer_path.is_dir():
            for f in layer_path.rglob('*.ts*'):
                if f.is_file():
                    text = f.read_text()
                    for forbidden_layer in forbidden:
                        pattern = f'@.*/{forbidden_layer}'
                        if re.search(pattern, text):
                            errors.append(f'Import proibido {forbidden_layer} em {f.relative_to(root)}')

# RF/UC identification
rf = set(re.findall(r'RF\d{2}', (root / 'docs/engenharia/requisitos.md').read_text()))
uc = set(re.findall(r'UC\d{2}', (root / 'docs/engenharia/casos-de-uso.md').read_text()))
for label, values in [('RF', rf), ('UC', uc)]:
    if not values:
        errors.append(f'Nenhum {label} identificado')

print(f'Fase: {phase}')
print('Harness documental:', 'FALHOU' if errors else 'PASSOU')
for error in errors:
    print(' -', error)

# App/Android/build status
if phase == 'fase-0':
    print('App/Android/build: NÃO EXECUTADO — fora do escopo da fase 0')
else:
    print('App/Android/build: PENDENTE — validar em dispositivo físico na G2+')

sys.exit(bool(errors))