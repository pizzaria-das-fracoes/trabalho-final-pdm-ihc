import { ActivityShell } from "@/view/components/ActivityShell";
import { useActivityViewModel } from "@/viewmodel/use-activity-view-model";

const definition = {
  questionId: "number-line-3-2",
  skillCode: "EF06MA08",
  expected: "1,5",
  explanation: "3/2 é igual a 1,5, então fica entre 1 e 2 na reta numérica.",
  hint: "divida 3 por 2 e localize o ponto entre 1 e 2."
};

export default function NumberLineScreen() {
  const model = useActivityViewModel(definition);
  return (
    <ActivityShell
      definition={definition}
      screenTitle="Reta numérica"
      visual="numberLine"
      prompt="Posicione 3/2 na reta de 0 a 2"
      instruction="Escolha a posição correta na reta numérica."
      options={["0,5", "1,5", "2"]}
      answer={model.answer}
      onSelect={model.setAnswer}
      onSubmit={() => void model.submit()}
      feedback={model.feedback}
    />
  );
}
