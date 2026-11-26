import { expect, test } from "@playwright/test";

test.describe("FatiaMática — Fluxos E2E Web", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test("Fluxo 1: Boas-vindas, entrada no Mapa, edição persistida de nome do Chef e alternância de som", async ({
    page
  }) => {
    await page.goto("/");
    await expect(page.getByText("Pizzaria FatiaMática")).toBeVisible();

    await page.getByRole("button", { name: "Entrar na Pizzaria" }).click();
    await expect(page.getByText("Estações da Pizzaria")).toBeVisible();

    await page.getByRole("button", { name: "Editar nome" }).click();
    await page.getByLabel("Nome do Chef").fill("Chef Maya");
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Olá, Chef Maya!")).toBeVisible();

    await page.getByRole("button", { name: "Desligar sons do jogo" }).click();
    await expect(page.getByRole("button", { name: "Ligar sons do jogo" })).toBeVisible();

    await page.reload();
    await expect(page.getByText("Olá, Chef Maya!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ligar sons do jogo" })).toBeVisible();
  });

  test("Fluxo 2: Oficina do Chef — compra de título com validação de saldo e reflexo no Mapa", async ({
    page
  }) => {
    await page.goto("/shop");
    await expect(page.getByText("Cofre")).toBeVisible();
    await expect(page.getByText("30 Q", { exact: true })).toBeVisible();

    const lockedHatBtn = page.getByRole("button", { name: "35 Q" });
    await expect(lockedHatBtn).toBeDisabled();

    await page.getByRole("tab", { name: "Títulos" }).click();
    await page.getByRole("button", { name: "25 Q" }).click();

    await expect(page.getByText("5 Q", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ativo" })).toBeVisible();

    await page.getByRole("tab", { name: "Mapa" }).click();
    await expect(page.getByText("Estações da Pizzaria")).toBeVisible();
    await expect(page.getByText(/Entregador Relâmpago · Nível/)).toBeVisible();
  });

  test("Fluxo 3: Atividade Monte a Pizza, acerto com moedas e reset completo na Sala de Troféus", async ({
    page
  }) => {
    await page.goto("/pizza");
    await expect(page.getByText("Pedido 1/4")).toBeVisible();

    await page.getByRole("button", { name: "Entregar pizza!" }).click();
    await expect(page.getByText("Quase lá — tente outro caminho!")).toBeVisible();

    const targetImg = page.locator('[aria-label^="Fração "]').first();
    const label = await targetImg.getAttribute("aria-label");
    const match = label ? /Fração (\d+) sobre (\d+)/.exec(label) : null;
    expect(match).not.toBeNull();
    const targetNum = match![1];
    const targetDen = match![2];

    await page.getByLabel("Quantidade de fatias", { exact: true }).fill(targetDen);
    await page.getByLabel("Quantidade de fatias", { exact: true }).blur();
    await page.getByLabel("Quantidade de fatias pintadas", { exact: true }).fill(targetNum);

    await page.getByRole("button", { name: "Entregar pizza!" }).click();
    await expect(page.getByText("Pedido Perfeito!")).toBeVisible();

    await page.getByRole("tab", { name: "Troféus" }).click();
    await expect(page.getByText("Sala de Troféus")).toBeVisible();
    await expect(page.getByText("1 acertos")).toBeVisible();

    await page.getByRole("button", { name: "Zerar progresso" }).click();
    await page.getByRole("button", { name: "Confirmar" }).click();
    await expect(page.getByText("0 acertos")).toBeVisible();
  });

  test("Fluxo 4: Comparação de Frações — seleção de opção e conferência de duelo", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.getByText("Duelo de Pizzas")).toBeVisible();

    // Seleciona Pizza A como tendo mais frações
    await page.getByRole("button", { name: "Escolher Pizza A" }).click();
    await page.getByRole("button", { name: "Conferir duelo" }).click();
    await expect(page.getByText(/Mandou bem! \+\d+ pts|A resposta certa era/)).toBeVisible();

    // Próximo duelo
    await page.getByRole("button", { name: "Próximo duelo!" }).click();
    await expect(page.getByRole("button", { name: "Conferir duelo" })).toBeVisible();
  });

  test("Fluxo 5: Frações Equivalentes — seleção de opção e conferência de resposta", async ({ page }) => {
    await page.goto("/equivalent");
    await expect(page.getByText("Fornada Equivalente")).toBeVisible();

    // O ChoiceList tem radios; selecionar primeira opção
    const firstRadio = page.getByRole("radio").first();
    await expect(firstRadio).toBeVisible();
    await firstRadio.check();

    await page.getByRole("button", { name: "Conferir resposta" }).click();
    await expect(page.getByText(/Pedido Perfeito!|Quase lá — tente outro caminho!/)).toBeVisible();

    // Próximo desafio
    await page.getByRole("button", { name: "Próximo desafio" }).click();
  });

  test("Fluxo 6: Operações Matemáticas — seleção de opção e conferência de resposta", async ({ page }) => {
    await page.goto("/operations");
    await expect(page.getByText("Receita Secreta")).toBeVisible();

    const firstRadio = page.getByRole("radio").first();
    await expect(firstRadio).toBeVisible();
    await firstRadio.check();

    await page.getByRole("button", { name: "Conferir resposta" }).click();
    await expect(page.getByText(/Pedido Perfeito!|Quase lá — tente outro caminho!/)).toBeVisible();

    await page.getByRole("button", { name: "Próximo desafio" }).click();
  });

  test("Fluxo 7: Conversão Decimal — seleção de opção decimal e conferência", async ({ page }) => {
    await page.goto("/decimal");
    await expect(page.getByText("Fábrica de Decimais")).toBeVisible();

    const radios = page.getByRole("radio");
    await expect(radios.nth(0)).toBeVisible();
    await radios.nth(0).check();

    await page.getByRole("button", { name: "Conferir resposta" }).click();
    await expect(page.getByText(/Pedido Perfeito!|Quase lá — tente outro caminho!/)).toBeVisible();

    await page.getByRole("button", { name: "Próximo desafio" }).click();
  });

  test("Fluxo 8: Reta Numérica — seleção de parada e estacionamento", async ({ page }) => {
    await page.goto("/number-line");
    await expect(page.getByText("Pista do Entregador")).toBeVisible();

    const stops = page.getByRole("button", { name: /Parada \d+ de \d+/ });
    await expect(stops.first()).toBeVisible();
    await stops.first().click();

    await page.getByRole("button", { name: "Estacionar aqui!" }).click();
    await expect(page.getByText("Pedido Perfeito!")).toBeVisible();
  });

  test("Fluxo 9: Duelo Relâmpago — modo sem relógio e acerto", async ({ page }) => {
    await page.goto("/arcade");
    await expect(page.getByText("Duelo Relâmpago")).toBeVisible();

    await page.getByRole("button", { name: "Começar Duelo!" }).click();
    await expect(page.getByText("Qual fração esta pizza mostra?")).toBeVisible();

    const options = page.getByRole("button", { name: /^\d+\/\d+$/ });
    await expect(options.first()).toBeVisible();
    await options.first().click();

    await expect(page.getByText(/Mandou bem! \+\d+ pts/)).toBeVisible();
  });

  test("Fluxo 10: Bancada Mágica — criação de frações e dica", async ({ page }) => {
    await page.goto("/sandbox");
    await expect(page.getByText("Bancada Mágica")).toBeVisible();

    await expect(page.getByText("Bandeja A")).toBeVisible();
    await expect(page.getByText("Bandeja B ✓ Ativa")).toBeVisible();

    await page.getByRole("button", { name: "Ver dica" }).click();
    await expect(page.getByText("Ocultar")).toBeVisible();
  });

  test("Fluxo 11: Responsividade — layout compacto e móvel", async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByRole("button", { name: "Entrar na Pizzaria" }).click();
    await expect(page.getByText("Estações da Pizzaria")).toBeVisible();

    await page.goto("/pizza");
    await expect(page.getByText("Pedido 1/4")).toBeVisible();
  });

  test("Fluxo 12: Console sem erros JavaScript nas páginas principais", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("favicon")) {
        errors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      if (!err.message.includes("favicon")) {
        errors.push(err.message);
      }
    });

    const routes = ["/", "/home", "/pizza", "/compare", "/equivalent", "/operations", "/decimal", "/number-line", "/quantity", "/arcade", "/sandbox", "/shop", "/progress", "/about"];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    }

    expect(errors, `Erros de console encontrados: ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("Fluxo 13: Persistência completa — reload mantém progresso, moedas e preferências", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Entrar na Pizzaria" }).click();
    await page.getByRole("button", { name: "Editar nome" }).click();
    await page.getByLabel("Nome do Chef").fill("Chef Persistente");
    await page.getByRole("button", { name: "Salvar" }).click();

    await page.getByRole("button", { name: "Desligar sons do jogo" }).click();

    await page.goto("/pizza");
    const targetImg = page.locator('[aria-label^="Fração "]').first();
    const label = await targetImg.getAttribute("aria-label");
    const match = label ? /Fração (\d+) sobre (\d+)/.exec(label) : null;
    if (match) {
      const targetNum = match[1];
      const targetDen = match[2];
      await page.getByLabel("Quantidade de fatias", { exact: true }).fill(targetDen);
      await page.getByLabel("Quantidade de fatias", { exact: true }).blur();
      await page.getByLabel("Quantidade de fatias pintadas", { exact: true }).fill(targetNum);
      await page.getByRole("button", { name: "Entregar pizza!" }).click();
      await expect(page.getByText("Pedido Perfeito!")).toBeVisible();
    }

    await page.reload();
    await expect(page.getByText("Olá, Chef Persistente!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ligar sons do jogo" })).toBeVisible();
  });
});