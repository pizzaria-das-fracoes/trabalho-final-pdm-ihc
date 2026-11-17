import { ActivityShell } from "@/view/components/ActivityShell";
import { useActivityViewModel } from "@/viewmodel/use-activity-view-model";

const definition = {
  questionId: "decimal-1-4",
  skillCode: "EF06MA08",
  expected: "0,25",
  explanation: "1/4 corresponde a 0,25 porque um inteiro dividido em quatro partes vale vinte e cinco centésimos.",
  hint: "procure o decimal finito equivalente a 1 dividido por 4."
};

export default function DecimalScreen() {
  const model = useActivityViewModel(definition);
  return (
    <ActivityShell
      definition={definition}
      screenTitle="Fração e decimal"
      visual="decimal"
      prompt="Relacione 1/4 a um decimal"
      instruction="Escolha o decimal correspondente."
      options={["0,2", "0,25", "0,33"]}
      answer={model.answer}
      onSelect={model.setAnswer}
      onSubmit={() => void model.submit()}
      feedback={model.feedback}
    />
  );
}
