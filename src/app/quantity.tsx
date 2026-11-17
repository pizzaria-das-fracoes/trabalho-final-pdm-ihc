import { ActivityShell } from "@/view/components/ActivityShell";
import { useActivityViewModel } from "@/viewmodel/use-activity-view-model";

const definition = {
  questionId: "quantity-3-4-20",
  skillCode: "EF06MA09",
  expected: "15",
  explanation: "3/4 de 20 é 15: primeiro dividimos 20 em quatro grupos de 5 e tomamos três grupos.",
  hint: "divida 20 por 4 e multiplique o resultado por 3."
};

export default function QuantityScreen() {
  const model = useActivityViewModel(definition);
  return (
    <ActivityShell
      definition={definition}
      screenTitle="Fração de quantidade"
      visual="quantity"
      prompt="Calcule 3/4 de 20"
      instruction="Escolha o resultado da partição da quantidade."
      options={["12", "15", "18"]}
      answer={model.answer}
      onSelect={model.setAnswer}
      onSubmit={() => void model.submit()}
      feedback={model.feedback}
    />
  );
}
