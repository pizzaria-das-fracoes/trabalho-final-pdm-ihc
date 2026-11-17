import { ActivityShell } from "@/view/components/ActivityShell";
import { useActivityViewModel } from "@/viewmodel/use-activity-view-model";

const definition = {
  questionId: "operations-half-plus-third",
  skillCode: "EF06MA10",
  expected: "5/6",
  explanation: "1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
  hint: "use 6 como denominador comum antes de somar."
};

export default function OperationsScreen() {
  const model = useActivityViewModel(definition);
  return (
    <ActivityShell
      definition={definition}
      screenTitle="Soma e subtração"
      visual="operations"
      prompt="Resolva 1/2 + 1/3"
      instruction="Escolha o resultado simplificado da operação."
      options={["2/5", "5/6", "1/6"]}
      answer={model.answer}
      onSelect={model.setAnswer}
      onSubmit={() => void model.submit()}
      feedback={model.feedback}
    />
  );
}
