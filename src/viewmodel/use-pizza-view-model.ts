import { useMemo, useState } from "react";
import { fraction } from "@/model/fraction";
import { container } from "@/di/container";
import { recordAttempt } from "@/usecase/record-attempt";

export const usePizzaViewModel = () => {
  const [denominator, setDenominator] = useState(4);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleSlice = (slice: number) => {
    setSelected((current) =>
      current.includes(slice) ? current.filter((item) => item !== slice) : [...current, slice]
    );
    setFeedback(null);
  };

  const check = async () => {
    const answer = fraction(selected.length, denominator);
    const correct = answer.numerator === 3 && answer.denominator === 4;
    await recordAttempt(container.progressRepository, {
      questionId: "mount-3-of-4",
      skillCode: "EF06MA07",
      correct,
      answer: `${selected.length}/${denominator}`
    });
    setFeedback(
      correct
        ? "Muito bem! Você selecionou 3 de 4 partes iguais: isso representa 3/4."
        : `Quase! Você selecionou ${selected.length} de ${denominator}. Para representar 3/4, selecione três partes.`
    );
  };

  return useMemo(
    () => ({ denominator, setDenominator, selected, toggleSlice, check, feedback }),
    [denominator, selected, feedback]
  );
};
