#!/usr/bin/env python3
"""Valida os documentos e as restrições da fase de Harness."""

import json
import pathlib
import re
import sys
from typing import Any


ROOT = pathlib.Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "harness.config.json"
BASELINE_DOCS = (
    "AGENTS.md",
    "CLAUDE.md",
    ".github/copilot-instructions.md",
    "docs/harness/00-estado-e-gates.md",
    "docs/harness/02-mapa-erros.md",
    "docs/engenharia/requisitos.md",
    "docs/engenharia/casos-de-uso.md",
    "docs/engenharia/matriz-bncc.md",
    "docs/engenharia/plano-testes.md",
    "docs/design-system/README.md",
    "docs/publicacao/guia-android.md",
)


def load_config(errors: list[str]) -> dict[str, Any]:
    """Carrega a configuração e reporta erros de formato de forma acionável."""
    if not CONFIG_PATH.is_file():
        errors.append("Configuração ausente: harness.config.json")
        return {}
    try:
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"Configuração inválida em harness.config.json: {error}")
        return {}
    if not isinstance(config, dict):
        errors.append("Configuração inválida: a raiz deve ser um objeto JSON")
        return {}
    return config


def configured_paths(config: dict[str, Any], key: str, errors: list[str]) -> list[str]:
    """Valida uma lista de caminhos declarada na configuração."""
    value = config.get(key)
    if not isinstance(value, list) or not value:
        errors.append(f"Configuração inválida: {key} deve ser uma lista não vazia")
        return []
    if any(not isinstance(path, str) or not path.strip() for path in value):
        errors.append(f"Configuração inválida: {key} deve conter apenas caminhos de texto")
        return []
    return value


def check_paths(paths: list[str], label: str, errors: list[str]) -> None:
    """Verifica que cada caminho configurado existe dentro do repositório."""
    for path in paths:
        relative_path = pathlib.PurePosixPath(path)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            errors.append(f"{label} inválido (fora do repositório): {path}")
        elif not (ROOT / relative_path).is_file():
            errors.append(f"{label} ausente: {path}")


def main() -> int:
    errors: list[str] = []
    config = load_config(errors)
    required_docs = configured_paths(config, "requiredDocs", errors)
    required_skills = configured_paths(config, "requiredSkills", errors)

    check_paths(required_docs, "Documento requerido", errors)
    check_paths(required_skills, "Skill requerida", errors)
    check_paths(list(BASELINE_DOCS), "Documento base", errors)

    if config.get("appImplementationAllowed") is not False:
        errors.append("Configuração inválida: appImplementationAllowed deve ser false na fase Harness")

    for code in ("EF06MA07", "EF06MA08", "EF06MA09", "EF06MA10"):
        for file in ("docs/engenharia/requisitos.md", "docs/engenharia/matriz-bncc.md"):
            path = ROOT / file
            if path.is_file() and code not in path.read_text(encoding="utf-8"):
                errors.append(f"{code} ausente em {file}")

    for name in ("src", "node_modules", "package.json", "app.json"):
        if (ROOT / name).exists():
            errors.append(f"Fase Harness não deve incluir {name}")

    for label, file, pattern in (
        ("RF", "docs/engenharia/requisitos.md", r"RF\d{2}"),
        ("UC", "docs/engenharia/casos-de-uso.md", r"UC\d{2}"),
    ):
        path = ROOT / file
        if path.is_file() and not set(re.findall(pattern, path.read_text(encoding="utf-8"))):
            errors.append(f"Nenhum {label} identificado em {file}")

    print("Harness documental:", "FALHOU" if errors else "PASSOU")
    for error in errors:
        print(f" - {error}")
    print("App/Android/build: NÃO EXECUTADO — fora do escopo da fase Harness")
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
