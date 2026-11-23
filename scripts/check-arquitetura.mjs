import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

const ALLOWED_SRC_FOLDERS = new Set(["app", "view", "viewmodel", "usecase", "model", "infra", "di"]);
const ALLOWED_MODEL_ENTRIES = new Set(["entities", "datasources", "services", "errors.ts"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPath = (abs) => toPosix(path.relative(ROOT, abs));

const listFilesRecursive = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results.sort();
};

const formatError = ({ rule, file, line = 1, problem, fix, ref }) =>
  `[ERRO] ${rule}\n${file}:${line}\n${problem}\nComo corrigir: ${fix}\nReferência: ${ref}`;

const stripCommentsKeepLines = (source) => {
  let out = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        out += "\n";
      } else {
        out += " ";
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        out += "  ";
        i += 2;
      } else {
        out += ch === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      out += ch;
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1];
        i += 2;
        continue;
      }
      if (ch === "'") inSingle = false;
      i += 1;
      continue;
    }

    if (inDouble) {
      out += ch;
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1];
        i += 2;
        continue;
      }
      if (ch === '"') inDouble = false;
      i += 1;
      continue;
    }

    if (inTemplate) {
      out += ch;
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1];
        i += 2;
        continue;
      }
      if (ch === "`") inTemplate = false;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      out += "  ";
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      out += "  ";
      i += 2;
      continue;
    }

    if (ch === "'") inSingle = true;
    else if (ch === '"') inDouble = true;
    else if (ch === "`") inTemplate = true;

    out += ch;
    i += 1;
  }

  return out;
};

const stripStringsAndCommentsKeepLines = (source) => {
  let out = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        out += "\n";
      } else {
        out += " ";
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        out += "  ";
        i += 2;
      } else {
        out += ch === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }

    if (inSingle) {
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1] === "\n" ? "\n" : "  ";
        i += 2;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
        out += " ";
      } else {
        out += ch === "\n" ? "\n" : " ";
      }
      i += 1;
      continue;
    }

    if (inDouble) {
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1] === "\n" ? "\n" : "  ";
        i += 2;
        continue;
      }
      if (ch === '"') {
        inDouble = false;
        out += " ";
      } else {
        out += ch === "\n" ? "\n" : " ";
      }
      i += 1;
      continue;
    }

    if (inTemplate) {
      if (ch === "\\" && i + 1 < source.length) {
        out += source[i + 1] === "\n" ? "\n" : "  ";
        i += 2;
        continue;
      }
      if (ch === "`") {
        inTemplate = false;
        out += " ";
      } else {
        out += ch === "\n" ? "\n" : " ";
      }
      i += 1;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      out += "  ";
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      out += "  ";
      i += 2;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      out += " ";
      i += 1;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      out += " ";
      i += 1;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      out += " ";
      i += 1;
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
};

const lineOfIndex = (text, index) => {
  if (index <= 0) return 1;
  return text.slice(0, index).split("\n").length;
};

const parseImports = (codeNoComments) => {
  const imports = [];
  const regex = /import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']\s*;?/g;
  let match;
  while ((match = regex.exec(codeNoComments)) !== null) {
    const isTypeOnly = Boolean(match[1]);
    const clause = match[2].trim();
    const specifier = match[3];
    const line = lineOfIndex(codeNoComments, match.index);
    imports.push({ isTypeOnly, clause, specifier, line });
  }

  const sideEffectRegex = /^\s*import\s+["']([^"']+)["']\s*;?/gm;
  while ((match = sideEffectRegex.exec(codeNoComments)) !== null) {
    imports.push({
      isTypeOnly: false,
      clause: "",
      specifier: match[1],
      line: lineOfIndex(codeNoComments, match.index)
    });
  }
  return imports;
};

const getLayerInfo = (rel) => {
  if (!rel.startsWith("src/")) return null;
  const sub = rel.slice("src/".length);
  const parts = sub.split("/");
  const layer = parts[0];
  const isTest = /\.(test|spec)\.(ts|tsx)$/.test(sub);
  return { rel, sub, parts, layer, isTest };
};

const checkStructureAndMirror = () => {
  const errors = [];

  if (!fs.existsSync(SRC_DIR)) {
    errors.push(
      formatError({
        rule: "ESTRUTURA-PASTA",
        file: "src",
        problem: "Pasta src/ não encontrada na raiz do projeto.",
        fix: "Crie a estrutura de camadas MVVM em src/ (app, view, viewmodel, usecase, model, infra, di).",
        ref: "AGENTS.md §2"
      })
    );
    return errors;
  }

  for (const entry of fs.readdirSync(SRC_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && !ALLOWED_SRC_FOLDERS.has(entry.name)) {
      errors.push(
        formatError({
          rule: "ESTRUTURA-PASTA",
          file: `src/${entry.name}`,
          problem: `Pasta não prevista diretamente em src/: "${entry.name}".`,
          fix: `Mova os arquivos para uma das camadas oficiais (${Array.from(ALLOWED_SRC_FOLDERS).join(", ")}).`,
          ref: "AGENTS.md §2"
        })
      );
    } else if (entry.isFile()) {
      errors.push(
        formatError({
          rule: "ESTRUTURA-PASTA",
          file: `src/${entry.name}`,
          problem: `Arquivo solto diretamente em src/: "${entry.name}".`,
          fix: "Coloque cada arquivo dentro da respectiva camada em src/.",
          ref: "AGENTS.md §2"
        })
      );
    }
  }

  const modelDir = path.join(SRC_DIR, "model");
  if (fs.existsSync(modelDir)) {
    for (const entry of fs.readdirSync(modelDir, { withFileTypes: true })) {
      if (!ALLOWED_MODEL_ENTRIES.has(entry.name)) {
        errors.push(
          formatError({
            rule: "ESTRUTURA-MODEL",
            file: `src/model/${entry.name}`,
            problem: `Item não previsto em src/model/: "${entry.name}".`,
            fix: "src/model/ só pode conter entities/, datasources/, services/ e errors.ts.",
            ref: "AGENTS.md §2"
          })
        );
      }
    }
  }

  const themeFile = path.join(SRC_DIR, "view", "theme.ts");
  if (!fs.existsSync(themeFile)) {
    errors.push(
      formatError({
        rule: "TEMA-OBRIGATORIO",
        file: "src/view/theme.ts",
        problem: "Arquivo src/view/theme.ts não encontrado.",
        fix: "Crie src/view/theme.ts com os tokens semânticos do Design System.",
        ref: "AGENTS.md §2 · docs/harness/04-views-e-design-system.md"
      })
    );
  }

  const configPath = path.join(ROOT, "harness.config.json");
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const dsRel = config.designSystem || "docs/design-system";
      const dsDir = path.join(ROOT, dsRel);
      if (!fs.existsSync(dsDir)) {
        errors.push(
          formatError({
            rule: "DESIGN-SYSTEM-AUSENTE",
            file: dsRel,
            problem: `Pasta do Design System configurada em harness.config.json não existe: "${dsRel}".`,
            fix: "Restaure o kit de Design System ou corrija o caminho em harness.config.json.",
            ref: "docs/harness/04-views-e-design-system.md"
          })
        );
      }
    } catch {
      errors.push(
        formatError({
          rule: "HARNESS-CONFIG-INVALIDO",
          file: "harness.config.json",
          problem: "Não foi possível ler harness.config.json como JSON válido.",
          fix: "Corrija a sintaxe JSON de harness.config.json.",
          ref: "docs/harness/04-views-e-design-system.md"
        })
      );
    }
  }

  const appDir = path.join(SRC_DIR, "app");
  const viewDir = path.join(SRC_DIR, "view");
  const appRoutes = new Map();
  const viewScreens = new Map();

  for (const abs of listFilesRecursive(appDir)) {
    const route = toPosix(path.relative(appDir, abs));
    if (route === "_layout.tsx" || /(^|\/)_layout\.tsx$/.test(route)) continue;
    appRoutes.set(route, abs);
  }

  for (const abs of listFilesRecursive(viewDir)) {
    const sub = toPosix(path.relative(viewDir, abs));
    if (sub === "theme.ts" || sub.startsWith("components/")) continue;
    viewScreens.set(sub, abs);
  }

  for (const [route] of appRoutes) {
    if (!viewScreens.has(route)) {
      errors.push(
        formatError({
          rule: "ESPELHO-SEM-TELA",
          file: `src/app/${route}`,
          problem: `Rota "src/app/${route}" não tem tela espelhada em "src/view/${route}".`,
          fix: `Crie a tela correspondente em src/view/${route} seguindo o espelhamento 1:1.`,
          ref: "AGENTS.md §3 (Regra 2)"
        })
      );
    }
  }

  for (const [screen] of viewScreens) {
    if (!appRoutes.has(screen)) {
      errors.push(
        formatError({
          rule: "ESPELHO-SEM-ROTA",
          file: `src/view/${screen}`,
          problem: `Tela "src/view/${screen}" não tem rota espelhada em "src/app/${screen}".`,
          fix: `Crie a rota fina correspondente em src/app/${screen} ou remova a tela órfã.`,
          ref: "AGENTS.md §3 (Regra 2)"
        })
      );
    }
  }

  return errors;
};

const checkSingleFile = (absPath) => {
  const errors = [];
  if (!fs.existsSync(absPath)) return errors;
  const info = getLayerInfo(relPath(absPath));
  if (!info) return errors;

  const { rel, sub, parts, layer, isTest } = info;
  const ext = path.extname(rel);

  if (ext === ".js" || ext === ".jsx") {
    errors.push(
      formatError({
        rule: "ARQUIVO-JS",
        file: rel,
        problem: "Arquivos .js/.jsx não são permitidos dentro de src/.",
        fix: "Converta o arquivo para TypeScript (.ts ou .tsx) totalmente tipado.",
        ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
      })
    );
    return errors;
  }

  if (ext !== ".ts" && ext !== ".tsx") {
    return errors;
  }

  const raw = fs.readFileSync(absPath, "utf8");
  const noComments = stripCommentsKeepLines(raw);
  const codeOnly = stripStringsAndCommentsKeepLines(raw);
  const imports = parseImports(noComments);

  // Regra 11: importações sempre com @/, nunca ./ ou ../
  for (const imp of imports) {
    if (imp.specifier.startsWith("./") || imp.specifier.startsWith("../")) {
      errors.push(
        formatError({
          rule: "IMPORT-RELATIVO",
          file: rel,
          line: imp.line,
          problem: `Import relativo proibido: "${imp.specifier}".`,
          fix: 'Substitua por caminho absoluto usando o alias "@/...".',
          ref: "AGENTS.md §3 (Regra 11) · docs/harness/02-convencoes-de-codigo.md"
        })
      );
    }
  }

  // Regra 12: proibido any
  const anyPatterns = [
    /:\s*any\b/g,
    /\bas\s+any\b/g,
    /<\s*any\s*>/g,
    /\bArray\s*<\s*any\s*>/g,
    /\bany\s*\[\s*\]/g
  ];
  for (const pattern of anyPatterns) {
    let m;
    while ((m = pattern.exec(codeOnly)) !== null) {
      errors.push(
        formatError({
          rule: "TS-ANY",
          file: rel,
          line: lineOfIndex(codeOnly, m.index),
          problem: `Uso proibido do tipo "any" (${m[0].trim()}).`,
          fix: "Defina um type específico ou use unknown com narrow/validação explícita.",
          ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
        })
      );
    }
  }

  // Regra 12: proibido React.FC / FC<
  const fcMatch = /\bReact\.FC\b|:\s*FC\s*</.exec(codeOnly);
  if (fcMatch) {
    errors.push(
      formatError({
        rule: "REACT-FC",
        file: rel,
        line: lineOfIndex(codeOnly, fcMatch.index),
        problem: "Uso proibido de React.FC / FC.",
        fix: "Declare componente como arrow function com props tipadas via `type`: `const Nome = (props: NomeProps) => ...`.",
        ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
      })
    );
  }

  // Regra 12: proibido export default function
  const edfMatch = /\bexport\s+default\s+function\b/.exec(codeOnly);
  if (edfMatch) {
    errors.push(
      formatError({
        rule: "EXPORT-DEFAULT-FUNCTION",
        file: rel,
        line: lineOfIndex(codeOnly, edfMatch.index),
        problem: "Uso proibido de `export default function`.",
        fix: "Declare `const Nome = () => { ... };` e exporte ao final com `export default Nome;`.",
        ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
      })
    );
  }

  // Vocabulário obrigatório (§5): proibido Repository, repositório, Connector
  const vocabRegex = /\b(\w*Repository\w*|reposit[oó]rio\w*|\w*Connector\w*)\b/i;
  if (vocabRegex.test(path.basename(rel))) {
    errors.push(
      formatError({
        rule: "VOCABULARIO-PROIBIDO",
        file: rel,
        problem: `Nome de arquivo contém termo proibido (${path.basename(rel)}).`,
        fix: "Use o vocabulário obrigatório: DataSource, Service, Use Case ou Entidade.",
        ref: "AGENTS.md §5"
      })
    );
  }
  const vocabCodeMatch = vocabRegex.exec(codeOnly);
  if (vocabCodeMatch) {
    errors.push(
      formatError({
        rule: "VOCABULARIO-PROIBIDO",
        file: rel,
        line: lineOfIndex(codeOnly, vocabCodeMatch.index),
        problem: `Termo proibido no código: "${vocabCodeMatch[1]}".`,
        fix: 'Substitua Repository / repositório / Connector por DataSource ou Service.',
        ref: "AGENTS.md §5"
      })
    );
  }

  // Regras de todo .tsx (§3 Regra 12 + docs/harness/02)
  if (ext === ".tsx") {
    const propsInterfaceMatch = /\binterface\s+[A-Za-z0-9_]*Props\b/.exec(codeOnly);
    if (propsInterfaceMatch) {
      errors.push(
        formatError({
          rule: "PROPS-INTERFACE",
          file: rel,
          line: lineOfIndex(codeOnly, propsInterfaceMatch.index),
          problem: "Props declaradas com `interface` em arquivo .tsx.",
          fix: "Use `type NomeProps = { ... };` para props de componentes.",
          ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
        })
      );
    }

    const fnCompRegex = /^(?:\s*export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*\(/gm;
    let fnMatch;
    while ((fnMatch = fnCompRegex.exec(codeOnly)) !== null) {
      errors.push(
        formatError({
          rule: "COMPONENTE-FUNCTION",
          file: rel,
          line: lineOfIndex(codeOnly, fnMatch.index),
          problem: `Componente "${fnMatch[1]}" declarado com \`function\`.`,
          fix: `Declare como arrow function: \`const ${fnMatch[1]} = (...) => { ... };\`.`,
          ref: "AGENTS.md §3 (Regra 12) · docs/harness/02-convencoes-de-codigo.md"
        })
      );
    }
  }

  // Regras por camada
  if (layer === "app") {
    const routeSub = sub.slice("app/".length);
    const isLayout = routeSub === "_layout.tsx" || /(^|\/)_layout\.tsx$/.test(routeSub);

    if (isLayout) {
      for (const imp of imports) {
        if (/^@\/(model|usecase|infra|di)\b/.test(imp.specifier)) {
          errors.push(
            formatError({
              rule: "LAYOUT-IMPORT",
              file: rel,
              line: imp.line,
              problem: `_layout.tsx importa camada proibida: "${imp.specifier}".`,
              fix: "_layout.tsx só pode importar expo-router, @/view/theme, @/viewmodel/* e libs de UI Expo.",
              ref: "AGENTS.md §4"
            })
          );
        }
      }
    } else {
      const expectedTarget = `@/view/${routeSub.replace(/\.(ts|tsx)$/, "")}`;
      const normalized = noComments.trim();
      const thinPattern = /^import\s+([A-Za-z0-9_]+)\s+from\s+["']([^"']+)["']\s*;?\s*export\s+default\s+([A-Za-z0-9_]+)\s*;?$/;
      const thinMatch = thinPattern.exec(normalized);
      if (!thinMatch || thinMatch[1] !== thinMatch[3] || thinMatch[2] !== expectedTarget) {
        errors.push(
          formatError({
            rule: "APP-ROTA-FINA",
            file: rel,
            problem: `Rota não é fina ou não espelha "${expectedTarget}".`,
            fix: `Deixe o arquivo apenas com:\n  import Tela from "${expectedTarget}";\n  export default Tela;`,
            ref: "AGENTS.md §3 (Regras 1 e 2) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
    }
  } else if (layer === "view") {
    const viewSub = sub.slice("view/".length);
    const isTheme = viewSub === "theme.ts";
    const isComponent = viewSub.startsWith("components/");

    // Proibido expo-router, usecase, infra, di em qualquer arquivo de view/
    for (const imp of imports) {
      if (imp.specifier === "expo-router" || imp.specifier.startsWith("expo-router/")) {
        errors.push(
          formatError({
            rule: "VIEW-NAVEGACAO",
            file: rel,
            line: imp.line,
            problem: "A View importa `expo-router`.",
            fix: "Toda a navegação (router, useLocalSearchParams) fica na ViewModel; exponha uma ação (actions.handle...).",
            ref: "AGENTS.md §3 (Regras 3 e 4) · §4"
          })
        );
      } else if (/^@\/(usecase|infra|di)\b/.test(imp.specifier)) {
        errors.push(
          formatError({
            rule: "VIEW-IMPORT",
            file: rel,
            line: imp.line,
            problem: `A View importa camada proibida: "${imp.specifier}".`,
            fix: "A View só consome sua ViewModel (`@/viewmodel/*`), componentes (`@/view/components/*`) e `@/view/theme`.",
            ref: "AGENTS.md §4"
          })
        );
      } else if (imp.specifier.startsWith("@/model")) {
        if (!imp.isTypeOnly || !imp.specifier.startsWith("@/model/entities/")) {
          errors.push(
            formatError({
              rule: "VIEW-ENTIDADE-IMPORT",
              file: rel,
              line: imp.line,
              problem: `A View só pode usar \`import type\` de \`@/model/entities/*\` (encontrado "${imp.specifier}").`,
              fix: "Converta para `import type { ... } from \"@/model/entities/...\"` ou mova constantes/funções para ViewModel.",
              ref: "AGENTS.md §4"
            })
          );
        }
      } else if (
        /@react-native-async-storage\/async-storage|expo-sqlite|\bfirebase\b|supabase/.test(imp.specifier)
      ) {
        errors.push(
          formatError({
            rule: "VIEW-DADOS",
            file: rel,
            line: imp.line,
            problem: `A View importa biblioteca de dados/infraestrutura: "${imp.specifier}".`,
            fix: "Mova acesso a dados e bibliotecas externas para `src/infra/` por trás de DataSource/Use Case.",
            ref: "AGENTS.md §3 (Regra 3) · §4"
          })
        );
      }

      if (isComponent && imp.specifier.startsWith("@/viewmodel")) {
        errors.push(
          formatError({
            rule: "COMPONENTE-VIEWMODEL",
            file: rel,
            line: imp.line,
            problem: `Componente em view/components/ importa ViewModel: "${imp.specifier}".`,
            fix: "Componentes recebem todos os dados e callbacks por props; mova a conexão com ViewModel para a tela em view/.",
            ref: "AGENTS.md §4 · docs/harness/04-views-e-design-system.md"
          })
        );
      }
    }

    if (!isTheme) {
      // Sem try/catch ou fetch na View
      const tryMatch = /\btry\s*\{/.exec(codeOnly);
      if (tryMatch) {
        errors.push(
          formatError({
            rule: "VIEW-TRY-CATCH",
            file: rel,
            line: lineOfIndex(codeOnly, tryMatch.index),
            problem: "A View contém bloco `try/catch`.",
            fix: "Mova operações com erro e captura de `DomainError` para a ViewModel.",
            ref: "AGENTS.md §3 (Regra 3) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }

      const fetchMatch = /\bfetch\s*\(/.exec(codeOnly);
      if (fetchMatch) {
        errors.push(
          formatError({
            rule: "VIEW-FETCH",
            file: rel,
            line: lineOfIndex(codeOnly, fetchMatch.index),
            problem: "A View chama `fetch(...)` diretamente.",
            fix: "Crie um DataSource em `src/infra/datasources/` e exponha via Use Case + ViewModel.",
            ref: "AGENTS.md §3 (Regra 3) · §4"
          })
        );
      }

      // Estilos: sem cor literal (#hex, rgb(), rgba(), cores nomeadas CSS) e sem número solto em padding*
      const hexRegex = /["']#[0-9a-fA-F]{3,8}["']/g;
      let hm;
      while ((hm = hexRegex.exec(noComments)) !== null) {
        errors.push(
          formatError({
            rule: "TEMA-COR-LITERAL",
            file: rel,
            line: lineOfIndex(noComments, hm.index),
            problem: `Cor literal proibida na View: ${hm[0]}.`,
            fix: "Use apenas tokens semânticos de `@/view/theme`. Se faltar token, peça ao usuário antes de adicionar em theme.ts.",
            ref: "AGENTS.md §3 (Regra 10) · docs/harness/04-views-e-design-system.md"
          })
        );
      }

      const rgbRegex = /["']rgba?\([^"']*\)["']/gi;
      let rm;
      while ((rm = rgbRegex.exec(noComments)) !== null) {
        errors.push(
          formatError({
            rule: "TEMA-COR-LITERAL",
            file: rel,
            line: lineOfIndex(noComments, rm.index),
            problem: `Cor rgb/rgba literal proibida na View: ${rm[0]}.`,
            fix: "Use tokens de `@/view/theme`.",
            ref: "AGENTS.md §3 (Regra 10) · docs/harness/04-views-e-design-system.md"
          })
        );
      }

      const cssColorPropRegex =
        /\b(?:color|backgroundColor|borderColor|borderTopColor|borderBottomColor|borderLeftColor|borderRightColor|shadowColor|tintColor|fill|stroke)\s*[:=]\s*["'](red|blue|green|white|black|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|silver|gold|transparent)["']/gi;
      let cm;
      while ((cm = cssColorPropRegex.exec(noComments)) !== null) {
        errors.push(
          formatError({
            rule: "TEMA-COR-LITERAL",
            file: rel,
            line: lineOfIndex(noComments, cm.index),
            problem: `Cor nomeada literal proibida na View: "${cm[1]}".`,
            fix: "Use tokens de `@/view/theme` (ex.: theme.color.transparent, theme.color.error).",
            ref: "AGENTS.md §3 (Regra 10) · docs/harness/04-views-e-design-system.md"
          })
        );
      }

      const paddingLiteralRegex =
        /\bpadding(?:Top|Bottom|Left|Right|Horizontal|Vertical)?\s*:\s*([1-9]\d*(?:\.\d+)?)\b/g;
      let pm;
      while ((pm = paddingLiteralRegex.exec(noComments)) !== null) {
        errors.push(
          formatError({
            rule: "TEMA-ESPACO-SOLTO",
            file: rel,
            line: lineOfIndex(noComments, pm.index),
            problem: `Número solto em padding (${pm[0]}).`,
            fix: "Use tokens de espaçamento de `@/view/theme` (`theme.space.sm`, `theme.space.md`, etc.).",
            ref: "AGENTS.md §3 (Regra 10) · docs/harness/04-views-e-design-system.md"
          })
        );
      }

      if (isComponent) {
        const expDefMatch = /\bexport\s+default\b/.exec(codeOnly);
        if (expDefMatch) {
          errors.push(
            formatError({
              rule: "COMPONENTE-EXPORT-NOMEADO",
              file: rel,
              line: lineOfIndex(codeOnly, expDefMatch.index),
              problem: "Componente em src/view/components/ usa `export default`.",
              fix: "Componentes auxiliares devem usar apenas export nomeado (`export const MeuComponente = ...`).",
              ref: "docs/harness/02-convencoes-de-codigo.md"
            })
          );
        }
      } else if (ext === ".tsx") {
        // Tela em view/ deve usar ViewModel [state, actions] e export default Nome
        const vmTupleRegex = /\bconst\s*\[\s*state\s*,\s*actions\s*\]\s*=\s*use[A-Z][A-Za-z0-9_]*ViewModel\s*\(/;
        if (!vmTupleRegex.test(noComments)) {
          errors.push(
            formatError({
              rule: "VIEW-VIEWMODEL",
              file: rel,
              problem: "Tela em src/view/ não consome sua ViewModel no formato `const [state, actions] = useXViewModel()`.",
              fix: "Conecte a tela à sua ViewModel usando a tupla `const [state, actions] = useXViewModel();`.",
              ref: "AGENTS.md §3 (Regra 5) · docs/harness/01-arquitetura-mvvm.md"
            })
          );
        }
        if (!/\bexport\s+default\s+[A-Z][A-Za-z0-9_]*\s*;?/.test(codeOnly)) {
          errors.push(
            formatError({
              rule: "VIEW-DEFAULT-EXPORT",
              file: rel,
              problem: "Tela em src/view/ não possui `export default Nome;` ao final.",
              fix: "Declare `const NomeScreen = () => { ... };` e exporte com `export default NomeScreen;`.",
              ref: "docs/harness/02-convencoes-de-codigo.md"
            })
          );
        }
      }
    }
  } else if (layer === "viewmodel") {
    const fileName = path.basename(rel);
    if (!isTest && !/^use[A-Z][A-Za-z0-9_]*ViewModel\.ts$/.test(fileName)) {
      errors.push(
        formatError({
          rule: "VM-NOME-ARQUIVO",
          file: rel,
          problem: `Nome/extensão inválido na camada viewmodel/: "${fileName}".`,
          fix: "Arquivos em viewmodel/ devem ser `.ts` (sem JSX) seguindo o padrão `useXViewModel.ts`.",
          ref: "AGENTS.md §2 e §3 (Regra 5) · docs/harness/01-arquitetura-mvvm.md"
        })
      );
    }

    for (const imp of imports) {
      if (
        imp.specifier === "react-native" ||
        imp.specifier.startsWith("react-native/") ||
        imp.specifier.startsWith("@/view") ||
        imp.specifier.startsWith("@/infra")
      ) {
        errors.push(
          formatError({
            rule: "VM-IMPORT",
            file: rel,
            line: imp.line,
            problem: `ViewModel importa módulo proibido: "${imp.specifier}".`,
            fix: "ViewModel não pode importar react-native, view ou infra; dependa apenas de interfaces de Use Case e `@/di/container`.",
            ref: "AGENTS.md §4"
          })
        );
      } else if (imp.specifier.startsWith("@/usecase/")) {
        const target = path.basename(imp.specifier);
        if (!target.startsWith("i")) {
          errors.push(
            formatError({
              rule: "VM-IMPORT-CONCRETO",
              file: rel,
              line: imp.line,
              problem: `ViewModel importa implementação concreta de Use Case: "${imp.specifier}".`,
              fix: "Importe apenas o contrato (`@/usecase/iXUseCases`) como tipo e receba a instância padrão do `@/di/container`.",
              ref: "AGENTS.md §4 · docs/harness/01-arquitetura-mvvm.md"
            })
          );
        }
      }
    }

    if (!isTest) {
      if (!/\bexport\s+type\s+[A-Z][A-Za-z0-9_]*State\b/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "VM-CONTRATO-STATE",
            file: rel,
            problem: "ViewModel não exporta `type XState = { ... }`.",
            fix: "Exporte o tipo `XState` descrevendo todo o estado lido pela View.",
            ref: "AGENTS.md §3 (Regra 5) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
      if (!/\bexport\s+type\s+[A-Z][A-Za-z0-9_]*Actions\b/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "VM-CONTRATO-ACTIONS",
            file: rel,
            problem: "ViewModel não exporta `type XActions = { ... }`.",
            fix: "Exporte o tipo `XActions` com ações iniciadas por `handle...`.",
            ref: "AGENTS.md §3 (Regra 5) · docs/harness/02-convencoes-de-codigo.md"
          })
        );
      }
      if (!/\[\s*[A-Z][A-Za-z0-9_]*State\s*,\s*[A-Z][A-Za-z0-9_]*Actions\s*\]/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "VM-CONTRATO-TUPLA",
            file: rel,
            problem: "Hook da ViewModel não declara retorno em tupla `[XState, XActions]`.",
            fix: "Retorne a tupla `[state, actions]` tipada como `[XState, XActions]`.",
            ref: "AGENTS.md §3 (Regra 5) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
    }
  } else if (layer === "usecase") {
    for (const imp of imports) {
      if (!imp.specifier.startsWith("@/model/") && !imp.specifier.startsWith("@/usecase/")) {
        errors.push(
          formatError({
            rule: "USECASE-IMPORT",
            file: rel,
            line: imp.line,
            problem: `Use Case importa dependência proibida: "${imp.specifier}".`,
            fix: "Use Case só pode importar `@/model/*` e `@/usecase/*`; bibliotecas e infra ficam em `src/infra/`.",
            ref: "AGENTS.md §4 · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
    }

    if (!isTest) {
      const fileName = path.basename(rel);
      const isContract = /^i[A-Z][A-Za-z0-9_]*UseCases\.ts$/.test(fileName);
      const isImpl = !isContract && /^[a-z][A-Za-z0-9_]*UseCases\.ts$/.test(fileName);
      if (!isContract && !isImpl) {
        errors.push(
          formatError({
            rule: "USECASE-NOME-ARQUIVO",
            file: rel,
            problem: `Arquivo fora do padrão em usecase/: "${fileName}".`,
            fix: "Use `iXUseCases.ts` para o contrato (`interface`) e `xUseCases.ts` para a implementação.",
            ref: "AGENTS.md §2 · docs/harness/02-convencoes-de-codigo.md"
          })
        );
      }
      if (isContract && !/\bexport\s+interface\s+I[A-Z][A-Za-z0-9_]*\b/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "USECASE-CONTRATO-INTERFACE",
            file: rel,
            problem: "Contrato em usecase/ não exporta `interface I...`.",
            fix: "Exporte `export interface IXUseCases { ... }`.",
            ref: "AGENTS.md §2 · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
      if (isImpl && !/\bclass\s+[A-Z][A-Za-z0-9_]*\s+implements\s+I[A-Z][A-Za-z0-9_]*\b/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "USECASE-IMPLEMENTS",
            file: rel,
            problem: "Classe de Use Case não implementa seu contrato `I...UseCases`.",
            fix: "Declare `export class XUseCases implements IXUseCases { ... }`.",
            ref: "docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
      const newInfraMatch = /\bnew\s+[A-Za-z0-9_]*(DataSource|Service)\b/.exec(codeOnly);
      if (newInfraMatch) {
        errors.push(
          formatError({
            rule: "USECASE-NEW-DEPENDENCIA",
            file: rel,
            line: lineOfIndex(codeOnly, newInfraMatch.index),
            problem: `Use Case instancia dependência diretamente (${newInfraMatch[0]}).`,
            fix: "Receba interfaces de DataSource/Service pelo construtor e conecte no `src/di/container.ts`.",
            ref: "AGENTS.md §3 (Regra 9) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
    }
  } else if (layer === "model") {
    for (const imp of imports) {
      if (!imp.specifier.startsWith("@/model/")) {
        errors.push(
          formatError({
            rule: "MODEL-IMPORT",
            file: rel,
            line: imp.line,
            problem: `Domínio puro (model/) importa módulo externo: "${imp.specifier}".`,
            fix: "src/model/ só pode importar `@/model/*`; zero bibliotecas externas.",
            ref: "AGENTS.md §3 (Regra 7) · §4"
          })
        );
      }
    }

    if (!isTest) {
      const folder = parts[1];
      const fileName = path.basename(rel);
      if (folder === "entities") {
        const classMatch = /\bclass\s+[A-Za-z0-9_]+\b/.exec(codeOnly);
        if (classMatch) {
          errors.push(
            formatError({
              rule: "MODEL-ENTIDADE-CLASS",
              file: rel,
              line: lineOfIndex(codeOnly, classMatch.index),
              problem: `Entidade em model/entities/ declarada com \`class\` (${classMatch[0]}).`,
              fix: "Entidades de domínio devem usar `type` em objeto literal, nunca `class` ou `new`.",
              ref: "AGENTS.md §3 (Regra 7) · §5"
            })
          );
        }
      } else if (folder === "datasources" || folder === "services") {
        if (!/^i[A-Z][A-Za-z0-9_]*\.ts$/.test(fileName)) {
          errors.push(
            formatError({
              rule: "MODEL-CONTRATO-NOME",
              file: rel,
              problem: `Arquivo de contrato sem prefixo \`i\`: "${fileName}".`,
              fix: "Contratos em model/datasources/ e model/services/ devem começar com `i` (ex.: `iProgressDataSource.ts`).",
              ref: "docs/harness/01-arquitetura-mvvm.md · docs/harness/02-convencoes-de-codigo.md"
            })
          );
        }
        if (!/\bexport\s+interface\s+I[A-Z][A-Za-z0-9_]*\b/.test(codeOnly)) {
          errors.push(
            formatError({
              rule: "MODEL-CONTRATO-INTERFACE",
              file: rel,
              problem: "Contrato em model/ não exporta `interface I...`.",
              fix: "Use `export interface INome { ... }` (contratos sempre com interface).",
              ref: "AGENTS.md §2 · §3 (Regra 7)"
            })
          );
        }
      } else if (sub === "model/errors.ts") {
        if (!/\bexport\s+class\s+DomainError\s+extends\s+Error\b/.test(codeOnly)) {
          errors.push(
            formatError({
              rule: "MODEL-ERRORS",
              file: rel,
              problem: "src/model/errors.ts não exporta `DomainError extends Error`.",
              fix: "Exporte `DomainError extends Error` e subclasses específicas do domínio.",
              ref: "docs/harness/01-arquitetura-mvvm.md"
            })
          );
        }
      }
    }
  } else if (layer === "infra") {
    for (const imp of imports) {
      if (/^@\/(usecase|viewmodel|view|di)\b/.test(imp.specifier)) {
        errors.push(
          formatError({
            rule: "INFRA-IMPORT",
            file: rel,
            line: imp.line,
            problem: `Infraestrutura importa camada superior proibida: "${imp.specifier}".`,
            fix: "src/infra/ só pode importar `@/model/*` e bibliotecas de dados/hardware.",
            ref: "AGENTS.md §4"
          })
        );
      }
    }

    if (!isTest && (parts[1] === "datasources" || parts[1] === "services")) {
      if (!/\bclass\s+[A-Z][A-Za-z0-9_]*\s+implements\s+I[A-Z][A-Za-z0-9_]*\b/.test(codeOnly)) {
        errors.push(
          formatError({
            rule: "INFRA-IMPLEMENTS",
            file: rel,
            problem: "Implementação em infra/ não declara `implements I...`.",
            fix: "Implemente explicitamente o contrato do domínio: `export class MemoryXDataSource implements IXDataSource`.",
            ref: "AGENTS.md §3 (Regra 8) · docs/harness/01-arquitetura-mvvm.md"
          })
        );
      }
    }
  } else if (layer === "di") {
    for (const imp of imports) {
      if (/^@\/(view|viewmodel)\b/.test(imp.specifier)) {
        errors.push(
          formatError({
            rule: "DI-IMPORT",
            file: rel,
            line: imp.line,
            problem: `Container de DI importa camada de apresentação: "${imp.specifier}".`,
            fix: "src/di/ só pode importar `@/infra/*`, `@/usecase/*` e `@/model/*`.",
            ref: "AGENTS.md §4"
          })
        );
      }
    }
  }

  // Regra 9: somente src/di/container.ts (e testes) pode importar @/infra
  if (layer !== "di" && layer !== "infra" && !isTest) {
    for (const imp of imports) {
      if (imp.specifier.startsWith("@/infra")) {
        errors.push(
          formatError({
            rule: "INFRA-FORA-DI",
            file: rel,
            line: imp.line,
            problem: `Importação direta de @/infra fora do container: "${imp.specifier}".`,
            fix: "Somente `src/di/container.ts` (e arquivos `*.test.ts`) podem importar `@/infra`.",
            ref: "AGENTS.md §3 (Regra 9) · §4"
          })
        );
      }
    }
  }

  return errors;
};

const runFullCheck = () => {
  const errors = [...checkStructureAndMirror()];
  for (const abs of listFilesRecursive(SRC_DIR)) {
    errors.push(...checkSingleFile(abs));
  }
  return errors;
};

const readStdin = () => {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
};

const args = process.argv.slice(2);
const isHook = args.includes("--hook");
const isStop = args.includes("--stop");

if (isHook) {
  const raw = readStdin().trim();
  let filePath = "";
  if (raw) {
    try {
      const payload = JSON.parse(raw);
      filePath = payload?.tool_input?.file_path || "";
    } catch {
      filePath = "";
    }
  }
  if (!filePath) {
    process.exit(0);
  }
  const absTarget = path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath);
  const rel = relPath(absTarget);
  if (!rel.startsWith("src/")) {
    process.exit(0);
  }
  const errors = [...checkSingleFile(absTarget)];
  if (rel.startsWith("src/app/") || rel.startsWith("src/view/")) {
    errors.push(...checkStructureAndMirror());
  }
  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n\n")}\n`);
    process.exit(2);
  }
  process.exit(0);
}

if (isStop) {
  const raw = readStdin().trim();
  if (raw) {
    try {
      const payload = JSON.parse(raw);
      if (payload?.stop_hook_active) {
        process.exit(0);
      }
    } catch {
      // ignora payload inválido
    }
  }

  const errors = runFullCheck();
  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n\n")}\n`);
    process.exit(2);
  }

  try {
    execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
  } catch (err) {
    const stdout = err?.stdout ? String(err.stdout) : "";
    const stderr = err?.stderr ? String(err.stderr) : "";
    const msg = (stdout + "\n" + stderr).trim() || "Falha em npx tsc --noEmit";
    process.stderr.write(`[ERRO] TSC\n${msg}\n`);
    process.exit(2);
  }

  process.exit(0);
}

const errors = runFullCheck();
if (errors.length > 0) {
  console.log(errors.join("\n\n"));
  process.exit(1);
}
console.log("Arquitetura OK");
process.exit(0);
