import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import type { HatId, ToppingId } from "@/model/entities/progress";
import { ActionButton } from "@/view/components/actionButton";
import { ActivityVisual, type ActivityVisualKind } from "@/view/components/activityVisual";
import { ChoiceList } from "@/view/components/choiceList";
import { Feedback } from "@/view/components/feedback";
import { Screen } from "@/view/components/screen";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";
import { theme } from "@/view/theme";

type ActivityShellProps = {
  screenTitle: string;
  visual: ActivityVisualKind;
  coins: number;
  streak: number;
  soundEnabled: boolean;
  equippedTopping: ToppingId;
  equippedHat: HatId;
  chefName: string;
  activeRoute: string;
  challenge: QuizChallenge;
  roundIndex: number;
  totalRounds: number;
  answer: string | null;
  wrongAttempts: string[];
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  onNavigate: (route: string) => void;
  onToggleSound: () => void;
  onBackToMap: () => void;
  onSelectAnswer: (option: string) => void;
  onSubmit: () => void;
  onNextRound: () => void;
  onRestart: () => void;
};

export const ActivityShell = ({
  screenTitle,
  visual,
  coins,
  streak,
  soundEnabled,
  equippedTopping,
  equippedHat,
  chefName,
  activeRoute,
  challenge,
  roundIndex,
  totalRounds,
  answer,
  wrongAttempts,
  feedback,
  completed,
  earnedStars,
  onNavigate,
  onToggleSound,
  onBackToMap,
  onSelectAnswer,
  onSubmit,
  onNextRound,
  onRestart
}: ActivityShellProps) => {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480 || height < 740;

  return (
    <Screen
      title={screenTitle}
      navigation
      coins={coins}
      soundEnabled={soundEnabled}
      equippedTopping={equippedTopping}
      activeRoute={activeRoute}
      onNavigate={onNavigate}
      onToggleSound={onToggleSound}
    >
      <StageHeader
        title={screenTitle}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
        coins={coins}
        streak={streak}
        onBackToMap={onBackToMap}
      />

      {completed ? (
        <VictoryCard
          worldTitle={screenTitle}
          stars={earnedStars}
          chefName={chefName}
          hat={equippedHat}
          onReplay={onRestart}
          onMap={onBackToMap}
        />
      ) : (
        <View style={[styles.card, isCompact && styles.cardCompact]}>
          <View style={styles.promptTexts}>
            <Text style={[styles.promptTitle, isCompact && styles.promptTitleCompact]}>
              {challenge.prompt}
            </Text>
            <Text style={[styles.promptSub, isCompact && styles.promptSubCompact]} numberOfLines={2}>
              {challenge.instruction}
            </Text>
          </View>

          <ActivityVisual
            kind={visual}
            challenge={challenge}
            topping={equippedTopping}
            answeredCorrectly={Boolean(feedback?.correct)}
          />

          <ChoiceList
            options={challenge.options}
            selected={answer}
            wrongAttempts={wrongAttempts}
            onSelect={onSelectAnswer}
            fractionOptions={challenge.fractionOptions}
            topping={equippedTopping}
          />

          {feedback && (
            <Feedback
              correct={feedback.correct}
              message={feedback.message}
              xp={feedback.xp}
              hat={equippedHat}
            />
          )}

          {feedback?.correct ? (
            <ActionButton
              label={roundIndex + 1 < totalRounds ? "Próximo desafio" : "Pegar estrelas!"}
              variant="success"
              size={isCompact ? "sm" : "md"}
              onPress={onNextRound}
            />
          ) : (
            <ActionButton
              label="Conferir resposta"
              variant="primary"
              size={isCompact ? "sm" : "md"}
              onPress={onSubmit}
              disabled={answer === null}
            />
          )}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: theme.space.lg,
    borderRadius: 22,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.outlineVariant,
    justifyContent: "space-between",
    gap: theme.space.md
  },
  cardCompact: {
    padding: theme.space.mdPlus,
    borderRadius: 18,
    gap: theme.space.xsPlus
  },
  promptTexts: {
    gap: theme.space.xxs
  },
  promptTitle: {
    fontFamily: theme.font.display,
    fontSize: 18,
    lineHeight: 23,
    color: theme.color.onSurface
  },
  promptTitleCompact: {
    fontSize: 15.5,
    lineHeight: 20
  },
  promptSub: {
    fontFamily: theme.font.body,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.onSurfaceMuted
  },
  promptSubCompact: {
    fontSize: 11.5,
    lineHeight: 15
  }
});
