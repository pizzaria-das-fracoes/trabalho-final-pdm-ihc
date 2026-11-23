import { ActivityShell } from "@/view/components/activityShell";
import { useQuizActivityViewModel } from "@/viewmodel/useQuizActivityViewModel";

const OperationsScreen = () => {
  const [state, actions] = useQuizActivityViewModel("operations");

  return (
    <ActivityShell
      screenTitle="Receita Secreta"
      visual="operations"
      coins={state.profile.coins}
      streak={state.profile.streak}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      equippedHat={state.profile.equippedHat}
      chefName={state.profile.chefName}
      activeRoute={state.activeRoute}
      challenge={state.challenge}
      roundIndex={state.roundIndex}
      totalRounds={state.totalRounds}
      answer={state.answer}
      wrongAttempts={state.wrongAttempts}
      feedback={state.feedback}
      completed={state.completed}
      earnedStars={state.earnedStars}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
      onBackToMap={actions.handleBackToMap}
      onSelectAnswer={actions.handleSelectAnswer}
      onSubmit={actions.handleSubmit}
      onNextRound={actions.handleNextRound}
      onRestart={actions.handleRestart}
    />
  );
};

export default OperationsScreen;
