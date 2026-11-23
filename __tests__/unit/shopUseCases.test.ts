import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import type { HatId, TitleId, ToppingId } from "@/model/entities/progress";
import { ShopUseCases } from "@/usecase/shopUseCases";

describe("ShopUseCases — compra, equipamento e validação de saldo", () => {
  const setupWithCoins = async (coins: number) => {
    const dataSource = new MemoryProgressDataSource();
    const soundService = new MemorySoundService();
    const profile = await dataSource.getProfile();
    await dataSource.saveProfile({ ...profile, coins });
    const useCases = new ShopUseCases(dataSource, soundService);
    return { dataSource, soundService, useCases };
  };

  it("compra chapéu quando há saldo suficiente, equipa e desbloqueia conquista Chef Estiloso", async () => {
    const { useCases, soundService } = await setupWithCoins(50);

    const updated = await useCases.buyOrEquipHat("cap");
    expect(updated.coins).toBe(15);
    expect(updated.equippedHat).toBe("cap");
    expect(updated.unlockedHats).toContain("cap");
    expect(updated.achievements).toContain("fashion-chef");
    expect(soundService.played).toEqual(["coin"]);

    const switchedBack = await useCases.buyOrEquipHat("chef");
    expect(switchedBack.coins).toBe(15);
    expect(switchedBack.equippedHat).toBe("chef");
    expect(soundService.played).toEqual(["coin", "pop"]);
  });

  it("impede compra sem saldo suficiente e retorna perfil inalterado sem tocar som", async () => {
    const { useCases, soundService } = await setupWithCoins(10);

    const hatResult = await useCases.buyOrEquipHat("crown");
    const toppingResult = await useCases.buyOrEquipTopping("berry");
    const titleResult = await useCases.buyOrEquipTitle("lenda");

    expect(hatResult.coins).toBe(10);
    expect(hatResult.equippedHat).toBe("chef");
    expect(toppingResult.equippedTopping).toBe("pepperoni");
    expect(titleResult.equippedTitle).toBe("aprendiz");
    expect(soundService.played).toEqual([]);
  });

  it("compra e equipa sabores e títulos com atualização persistida", async () => {
    const { useCases, dataSource, soundService } = await setupWithCoins(100);

    const withTopping = await useCases.buyOrEquipTopping("mushroom");
    expect(withTopping.coins).toBe(60);
    expect(withTopping.equippedTopping).toBe("mushroom");
    expect(withTopping.unlockedToppings).toContain("mushroom");

    const reEquippedTopping = await useCases.buyOrEquipTopping("pepperoni");
    expect(reEquippedTopping.coins).toBe(60);
    expect(reEquippedTopping.equippedTopping).toBe("pepperoni");

    const withTitle = await useCases.buyOrEquipTitle("velocista");
    expect(withTitle.coins).toBe(35);
    expect(withTitle.equippedTitle).toBe("velocista");

    const reEquippedTitle = await useCases.buyOrEquipTitle("aprendiz");
    expect(reEquippedTitle.equippedTitle).toBe("aprendiz");

    const persisted = await dataSource.getProfile();
    expect(persisted.unlockedToppings).toContain("mushroom");
    expect(persisted.unlockedTitles).toContain("velocista");
    expect(soundService.played).toEqual(["coin", "pop", "coin", "pop"]);
  });

  it("ignora IDs inexistentes sem alterar o perfil nem lançar exceção inesperada", async () => {
    const { useCases, soundService } = await setupWithCoins(100);

    const p1 = await useCases.buyOrEquipHat("inexistente" as HatId);
    const p2 = await useCases.buyOrEquipTopping("inexistente" as ToppingId);
    const p3 = await useCases.buyOrEquipTitle("inexistente" as TitleId);

    expect(p1.coins).toBe(100);
    expect(p2.coins).toBe(100);
    expect(p3.coins).toBe(100);
    expect(soundService.played).toEqual([]);
  });
});
