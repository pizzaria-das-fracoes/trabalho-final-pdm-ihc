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

    // Recarrega a página real do navegador para validar persistência em LocalStorage/AsyncStorage
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

    // Boné Arcade (35 Q) começa desabilitado com saldo de 30 Q
    const lockedHatBtn = page.getByRole("button", { name: "35 Q" });
    await expect(lockedHatBtn).toBeDisabled();

    // Aba Títulos: Entregador Relâmpago (25 Q) pode ser comprado com saldo inicial
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

    // Envio vazio aciona orientação pedagógica sem premiar
    await page.getByRole("button", { name: "Entregar pizza!" }).click();
    await expect(page.getByText("Quase lá — tente outro caminho!")).toBeVisible();

    // Lê a fração pedida na comanda e preenche cortes + fatias pintadas
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

    // Navega até Troféus e valida o registro + reset
    await page.getByRole("tab", { name: "Troféus" }).click();
    await expect(page.getByText("Sala de Troféus")).toBeVisible();
    await expect(page.getByText("1 acertos")).toBeVisible();

    await page.getByRole("button", { name: "Zerar progresso" }).click();
    await page.getByRole("button", { name: "Confirmar" }).click();
    await expect(page.getByText("0 acertos")).toBeVisible();
  });
});
