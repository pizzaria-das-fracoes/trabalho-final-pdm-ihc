import { StyleSheet, Text } from "react-native";
import { ActionButton } from "@/view/components/ActionButton";
import { ChoiceList } from "@/view/components/ChoiceList";
import { Feedback } from "@/view/components/Feedback";
import { Screen } from "@/view/layouts/Screen";
import { tokens } from "@/view/tokens";
import type { ActivityDefinition } from "@/viewmodel/use-activity-view-model";
import { ActivityVisual, type ActivityVisualKind } from "@/view/components/ActivityVisual";

type Props = {
  definition: ActivityDefinition;
  screenTitle: string;
  visual: ActivityVisualKind;
  fractionOptions?: Record<string, { numerator: number; denominator: number }>;
  options: string[];
  prompt: string;
  instruction: string;
  answer: string | null;
  onSelect: (answer: string) => void;
  onSubmit: () => void;
  feedback: string | null;
};

export const ActivityShell = ({ definition, screenTitle, visual, fractionOptions, options, prompt, instruction, answer, onSelect, onSubmit, feedback }: Props) => (
  <Screen title={screenTitle} navigation>
    <Text style={styles.title}>{prompt}</Text>
    <Text style={styles.body}>{instruction}</Text>
    <ActivityVisual kind={visual} />
    <ChoiceList options={options} selected={answer} onSelect={onSelect} fractionOptions={fractionOptions} />
    <ActionButton label="Conferir resposta" onPress={onSubmit} disabled={answer === null} />
    <Feedback message={feedback} />
  </Screen>
);

const styles = StyleSheet.create({
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, fontWeight: "700" },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 }
});
