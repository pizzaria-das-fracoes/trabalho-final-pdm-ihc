#!/usr/bin/env python3
"""
Validação do harness — fase de implementação parcial.

Verifica:
  1. Documentos obrigatórios presentes
  2. Habilidades BNCC (EF06MA07–10) citadas nos docs de engenharia
  3. RFs e UCs identificados nos documentos
  4. Camadas src/ obrigatórias existem
  5. Arquivos de rota exportam default (smoke check textual)
  6. Nenhuma rota importa infra diretamente

Não testa comportamento em dispositivo (gate G2+).
"""
import pathlib
import json
import re
import sys

root = pathlib.Path(__file__).resolve().parents[1]
cfg = json.loads((root / "harness.config.json").read_text(encoding="utf-8"))
errors = []
warnings = []

# ── 1. Config sanity ────────────────────────────────────────────────────────
if cfg.get("activeGate") == "G1" and cfg.get("appImplementationAllowed") is True:
    errors.append("G1 está aberto: appImplementationAllowed deve ser false")
if cfg.get("activeGate") == "G1" and cfg.get("gateApproved") is True:
    errors.append("G1 não pode estar simultaneamente ativo e aprovado")

# ── 2. Documentos obrigatórios ───────────────────────────────────────────────
required_files = [
    "AGENTS.md",
    "CLAUDE.md",
    ".github/copilot-instructions.md",
    "docs/harness/00-estado-e-gates.md",
    "docs/harness/02-mapa-erros.md",
    "docs/engenharia/requisitos.md",
    "docs/engenharia/casos-de-uso.md",
    "docs/engenharia/matriz-bncc.md",
    "docs/engenharia/plano-testes.md",
    "docs/harness/07-registro-de-mudancas.md",
    "docs/design-system/README.md",
    "docs/publicacao/guia-android.md",
    ".claude/skills/nova-atividade-bncc/SKILL.md",
]
for f in required_files:
    if not (root / f).is_file():
        errors.append(f"Documento ausente: {f}")

# ── 3. Habilidades BNCC presentes nos docs de engenharia ────────────────────
bncc_codes = ("EF06MA07", "EF06MA08", "EF06MA09", "EF06MA10")
bncc_docs = ("docs/engenharia/requisitos.md", "docs/engenharia/matriz-bncc.md")
for code in bncc_codes:
    for doc in bncc_docs:
        path = root / doc
        if path.is_file() and code not in path.read_text(encoding="utf-8"):
            errors.append(f"{code} ausente em {doc}")

# ── 4. RFs e UCs identificados ───────────────────────────────────────────────
req_text = (root / "docs/engenharia/requisitos.md").read_text(encoding="utf-8") if (root / "docs/engenharia/requisitos.md").is_file() else ""
uc_text  = (root / "docs/engenharia/casos-de-uso.md").read_text(encoding="utf-8") if (root / "docs/engenharia/casos-de-uso.md").is_file() else ""
rfs = set(re.findall(r"RF\d{2}", req_text))
ucs = set(re.findall(r"UC\d{2}", uc_text))
if not rfs:
    errors.append("Nenhum RF identificado em requisitos.md")
if not ucs:
    errors.append("Nenhum UC identificado em casos-de-uso.md")

# ── 5. Camadas src/ obrigatórias ─────────────────────────────────────────────
src = root / "src"
if not src.is_dir():
    errors.append("src/ ausente — implementação parcial esperada")
else:
    for layer in cfg.get("requiredSrcLayers", []):
        if not (src / layer).is_dir():
            errors.append(f"Camada src/{layer}/ ausente")

# ── 6. Rotas têm export default (smoke textual) ──────────────────────────────
app_dir = src / "app" if src.is_dir() else None
if app_dir and app_dir.is_dir():
    for route in app_dir.rglob("*.tsx"):
        if route.name.startswith("_"):
            continue  # _layout.tsx não precisa de export default de tela
        text = route.read_text(encoding="utf-8")
        if "export default" not in text:
            errors.append(
                f"Rota sem export default: src/app/{route.relative_to(app_dir)}"
            )

# ── 7. Importações proibidas (view/viewmodel/model/usecase → infra) ──────────
forbidden: dict = cfg.get("forbiddenImports", {})
if src.is_dir():
    for layer, blocked in forbidden.items():
        layer_dir = src / layer
        if not layer_dir.is_dir():
            continue
        for path in layer_dir.rglob("*.ts"):
            text = path.read_text(encoding="utf-8")
            for bad in blocked:
                # captura tanto @/infra quanto caminhos relativos ../../infra
                if re.search(rf"from [\"'](?:@/)?(?:\.\./)*{bad}/", text):
                    errors.append(
                        f"Violação de camada: {path.relative_to(root)} importa '{bad}'"
                    )
        for path in layer_dir.rglob("*.tsx"):
            text = path.read_text(encoding="utf-8")
            for bad in blocked:
                if re.search(rf"from [\"'](?:@/)?(?:\.\./)*{bad}/", text):
                    errors.append(
                        f"Violação de camada: {path.relative_to(root)} importa '{bad}'"
                    )

# ── 8. harness.config.json coerente ─────────────────────────────────────────
if cfg.get("activeGate") not in ("G1", "G2", "G3", "G4", "G5"):
    warnings.append(
        "harness.config.json: activeGate não definido ou fora de G1–G5"
    )

# ── 9. Registro rastreável de mudanças ──────────────────────────────────────
change_log_path = root / "docs/harness/07-registro-de-mudancas.md"
if change_log_path.is_file():
    change_log = change_log_path.read_text(encoding="utf-8")
    change_ids = re.findall(r"^### (CHG-\d{3})\b", change_log, re.M)
    for required in ("Escopo", "Arquivos", "Verificações", "Evidência"):
        if required not in change_log:
            errors.append(f"Registro de mudanças: campo obrigatório ausente: {required}")
    if not change_ids:
        errors.append("Registro de mudanças: nenhum ID CHG-NNN encontrado")
    if len(change_ids) != len(set(change_ids)):
        errors.append("Registro de mudanças: ID CHG duplicado")

# ── Relatório ────────────────────────────────────────────────────────────────
phase = cfg.get("phase", "desconhecida")
gate  = cfg.get("activeGate", "?")
rfs_impl = cfg.get("implementedRFs", [])
rfs_pend = cfg.get("pendingRFs", [])

print(f"Harness [{phase} / gate ativo: {gate}]:", "FALHOU" if errors else "PASSOU")
for e in errors:
    print(" ✗", e)
for w in warnings:
    print(" ⚠", w)
if not errors:
    print(f"  RFs implementados : {', '.join(rfs_impl)}")
    print(f"  RFs pendentes     : {', '.join(rfs_pend)}")
    print(f"  RFs identificados : {', '.join(sorted(rfs))}")
    print(f"  UCs identificados : {', '.join(sorted(ucs))}")
print("Limite: verifica estrutura/texto; não valida UI, IHC, matemática, BNCC ou execução Android.")
sys.exit(bool(errors))
