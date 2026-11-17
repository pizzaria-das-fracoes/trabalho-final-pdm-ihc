#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1] / "src"
violations = []
for layer in ("view", "viewmodel", "model", "usecase"):
    for path in (root / layer).rglob("*"):
        if path.suffix not in (".ts", ".tsx"):
            continue
        text = path.read_text()
        if re.search(r'from ["\']@/infra/', text):
            violations.append(f"{path.relative_to(root)} imports infra")
print("Arquitetura:", "FALHOU" if violations else "PASSOU")
for violation in violations:
    print(" -", violation)
sys.exit(bool(violations))
