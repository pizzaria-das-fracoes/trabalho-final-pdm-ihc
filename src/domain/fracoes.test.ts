import {
  compararFracoes,
  conferirRepresentacao,
  criarFracao,
  ehFracaoValida,
  formatarFracao,
  saoEquivalentes,
} from "./fracoes";

describe("ehFracaoValida", () => {
  it.each([
    [1, 2],
    [3, 4],
    [0, 2],
    [8, 8],
    [1, 8],
  ])("aceita %i/%i", (numerador, denominador) => {
    expect(ehFracaoValida(numerador, denominador)).toBe(true);
  });

  it.each([
    [1, 1, "denominador abaixo de 2"],
    [1, 9, "denominador acima de 8"],
    [1, 0, "denominador zero"],
    [-1, 4, "numerador negativo"],
    [5, 4, "numerador maior que o denominador"],
    [1.5, 4, "numerador decimal"],
    [1, 4.5, "denominador decimal"],
    [Number.NaN, 4, "numerador não numérico"],
  ])("rejeita %s/%s (%s)", (numerador, denominador) => {
    expect(ehFracaoValida(numerador, denominador)).toBe(false);
  });
});

describe("criarFracao", () => {
  it("cria a fração quando os valores são válidos", () => {
    expect(criarFracao(3, 4)).toEqual({ numerador: 3, denominador: 4 });
  });

  it("lança erro informando a fração inválida", () => {
    expect(() => criarFracao(5, 4)).toThrow(RangeError);
    expect(() => criarFracao(5, 4)).toThrow("Fração inválida: 5/4");
  });
});

describe("compararFracoes", () => {
  it("indica que 3/4 é maior que 1/2", () => {
    expect(compararFracoes(criarFracao(3, 4), criarFracao(1, 2))).toBe(1);
  });

  it("indica que 1/2 é menor que 3/4", () => {
    expect(compararFracoes(criarFracao(1, 2), criarFracao(3, 4))).toBe(-1);
  });

  it("indica que 1/2 e 2/4 são iguais", () => {
    expect(compararFracoes(criarFracao(1, 2), criarFracao(2, 4))).toBe(0);
  });

  it("compara denominadores diferentes por produto cruzado (5/6 contra 7/8)", () => {
    expect(compararFracoes(criarFracao(5, 6), criarFracao(7, 8))).toBe(-1);
  });
});

describe("saoEquivalentes", () => {
  it("reconhece 2/4 como equivalente a 1/2", () => {
    expect(saoEquivalentes(criarFracao(2, 4), criarFracao(1, 2))).toBe(true);
  });

  it("não considera 2/3 equivalente a 1/2", () => {
    expect(saoEquivalentes(criarFracao(2, 3), criarFracao(1, 2))).toBe(false);
  });

  it("trata 0/2 e 0/8 como equivalentes (caso de borda)", () => {
    expect(saoEquivalentes(criarFracao(0, 2), criarFracao(0, 8))).toBe(true);
  });

  it("trata 8/8 e 2/2 como equivalentes (pizza inteira)", () => {
    expect(saoEquivalentes(criarFracao(8, 8), criarFracao(2, 2))).toBe(true);
  });
});

describe("formatarFracao", () => {
  it("escreve a fração no formato numerador/denominador", () => {
    expect(formatarFracao(criarFracao(3, 4))).toBe("3/4");
  });
});

describe("conferirRepresentacao (Monte sua pizza)", () => {
  const alvo = criarFracao(3, 4);

  it("acerta quando marca 3 de 4 partes", () => {
    expect(conferirRepresentacao(alvo, 3, 4)).toBe(true);
  });

  it("erra quando marca partes de menos", () => {
    expect(conferirRepresentacao(alvo, 2, 4)).toBe(false);
  });

  it("erra quando a pizza tem outro número de partes", () => {
    expect(conferirRepresentacao(alvo, 3, 8)).toBe(false);
  });

  it("aceita nenhuma parte marcada para a fração 0/2", () => {
    expect(conferirRepresentacao(criarFracao(0, 2), 0, 2)).toBe(true);
  });
});
