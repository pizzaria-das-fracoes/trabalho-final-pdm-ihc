import { ActivityShell } from "@/view/components/ActivityShell";
import { useActivityViewModel } from "@/viewmodel/use-activity-view-model";

const definition = {
  questionId: "equivalent-2-3-4-6",
  skillCode: "EF06MA07",
  expected: "4/6",
  explanation: "2/3 e 4/6 representam a mesma quantidade porque numerador e denominador foram multiplicados por 2.",
  hint: "multiplique o numerador e o denominador pelo mesmo número."
};

export default function EquivalentScreen() {
  const model = useActivityViewModel(definition);
  return (
    <ActivityShell
      definition={definition}
      screenTitle="Frações equivalentes"
      visual="equivalent"
      fractionOptions={{ "3/5": { numerator: 3, denominator: 5 }, "4/6": { numerator: 4, denominator: 6 }, "2/5": { numerator: 2, denominator: 5 } }}
      prompt="Encontre uma fração equivalente a 2/3"
      instruction="Escolha uma opção que represente a mesma quantidade."
      options={["3/5", "4/6", "2/5"]}
      answer={model.answer}
      onSelect={model.setAnswer}
      onSubmit={() => void model.submit()}
      feedback={model.feedback}
    />
  );
}
