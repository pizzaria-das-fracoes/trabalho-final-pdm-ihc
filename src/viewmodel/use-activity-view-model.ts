import { useState } from "react";
import { container } from "@/di/container";
import { recordAttempt } from "@/usecase/record-attempt";

export type ActivityDefinition = {
  questionId: string;
  skillCode: string;
  expected: string;
  explanation: string;
  hint: string;
};

export const useActivityViewModel = (definition: ActivityDefinition) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = async () => {
    if (answer === null) return;
    const correct = answer === definition.expected;
    await recordAttempt(container.progressRepository, {
      questionId: definition.questionId,
      skillCode: definition.skillCode,
      correct,
      answer
    });
    setFeedback(correct ? `Muito bem! ${definition.explanation}` : `Quase! Dica: ${definition.hint}`);
  };

  return { answer, setAnswer, feedback, submit };
};
