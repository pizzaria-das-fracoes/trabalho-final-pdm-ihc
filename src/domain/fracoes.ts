// Lógica de frações do FatiaMática (TypeScript puro, sem dependência de React Native).
// Regras marcadas como [REPO] vêm do Design System v1.0.0; as demais são [PROPOSTA]
// e dependem de aprovação da equipe (ver docs/projeto/requisitos.md).

export type Fracao = {
  numerador: number;
  denominador: number;
};

// [REPO] PizzaFracao: de 2 a 8 partes iguais.
export const DENOMINADOR_MINIMO = 2;
export const DENOMINADOR_MAXIMO = 8;

// [PROPOSTA] Numerador inteiro de 0 até o denominador (uma pizza apenas).
export function ehFracaoValida(numerador: number, denominador: number): boolean {
  if (!Number.isInteger(numerador) || !Number.isInteger(denominador)) {
    return false;
  }
  if (denominador < DENOMINADOR_MINIMO || denominador > DENOMINADOR_MAXIMO) {
    return false;
  }
  return numerador >= 0 && numerador <= denominador;
}

export function criarFracao(numerador: number, denominador: number): Fracao {
  if (!ehFracaoValida(numerador, denominador)) {
    throw new RangeError(`Fração inválida: ${numerador}/${denominador}`);
  }
  return { numerador, denominador };
}

// [PROPOSTA] Comparação por produto cruzado, só com inteiros (sem divisão decimal).
// Retorna 1 se a é maior, -1 se a é menor e 0 se são iguais.
export function compararFracoes(a: Fracao, b: Fracao): -1 | 0 | 1 {
  const esquerda = a.numerador * b.denominador;
  const direita = b.numerador * a.denominador;
  if (esquerda > direita) return 1;
  if (esquerda < direita) return -1;
  return 0;
}

export function saoEquivalentes(a: Fracao, b: Fracao): boolean {
  return compararFracoes(a, b) === 0;
}

export function formatarFracao(fracao: Fracao): string {
  return `${fracao.numerador}/${fracao.denominador}`;
}

// [PROPOSTA] "Monte sua pizza": acerta quem marca exatamente o numerador
// de partes em uma pizza com o mesmo denominador da fração pedida.
export function conferirRepresentacao(
  alvo: Fracao,
  partesMarcadas: number,
  totalPartes: number,
): boolean {
  return totalPartes === alvo.denominador && partesMarcadas === alvo.numerador;
}
