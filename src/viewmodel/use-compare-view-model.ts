import { useState } from "react";
import { compareFractions, fraction } from "@/model/fraction";
import { container } from "@/di/container";
import { recordAttempt } from "@/usecase/record-attempt";

export const useCompareViewModel = () => {
  const [choice, setChoice] = useState<"left" | "right" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const check = async () => {
    const result = compareFractions(fraction(3, 4), fraction(2, 3));
    const correct = choice === (result > 0 ? "left" : "right");
    await recordAttempt(container.progressRepository, {
      questionId: "compare-3-4-2-3",
      skillCode: "EF06MA07",
      correct,
      answer: choice ?? "none"
    });
    setFeedback(
      correct
        ? "Muito bem! 3/4 é maior que 2/3."
        : "Quase! Compare os produtos cruzados: 3 × 3 é maior que 2 × 4."
    );
  };

  return { choice, setChoice, check, feedback };
};
