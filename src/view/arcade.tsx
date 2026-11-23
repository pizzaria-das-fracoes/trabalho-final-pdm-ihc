import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { ActionButton } from "@/view/components/actionButton";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { SegmentedTabs } from "@/view/components/segmentedTabs";
import { heartSvgColors, theme } from "@/view/theme";
import { ARCADE_MAX_LIVES, useArcadeViewModel } from "@/viewmodel/useArcadeViewModel";

type HeartIconProps = {
  filled: boolean;
  shaking: boolean;
  urgent: boolean;
};

const HeartIcon = ({ filled, shaking, urgent }: HeartIconProps) => {
  const shakeX = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!active || reduced) return;
      if (shaking) {
        Animated.sequence([
          Animated.timing(shakeX, { toValue: -5, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 5, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: -4, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 0, duration: 55, useNativeDriver: true })
        ]).start();
      }
    });
    return () => {
      active = false;
    };
  }, [shaking, shakeX]);

  useEffect(() => {
    if (!filled || !urgent) {
      pulse.setValue(1);
      return;
    }
    let loop: Animated.CompositeAnimation | null = null;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.15, duration: 360, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 360, useNativeDriver: true })
        ])
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [filled, urgent, pulse]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeX }, { scale: pulse }] }}>
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={filled ? heartSvgColors.filled : heartSvgColors.empty}
          stroke={heartSvgColors.stroke}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        {filled && <Circle cx={7.8} cy={7.5} r={1.6} fill={heartSvgColors.shine} />}
      </Svg>
    </Animated.View>
  );
};

const ArcadeScreen = () => {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 560;
  const isCompact = width < 480 || height < 740;
  const [state, actions] = useArcadeViewModel();

  return (
    <Screen
      title="Duelo Relâmpago"
      navigation
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      {state.error && <Text style={styles.errorText}>{state.error}</Text>}

      {state.phase === "ready" && (
        <View style={styles.readyCard}>
          <PizzaAvatar size={isWide ? 96 : 78} hat={state.profile.equippedHat} mood="excited" animated />
          <View style={styles.readyTexts}>
            <Text style={styles.readyTitle}>Duelo Relâmpago!</Text>
            <Text style={styles.readySub}>
              Cada partida traz perguntas novas! Você tem 3 corações e ganha bônus pelas vidas que sobrarem.
            </Text>
            <View style={styles.heartsRow} accessibilityLabel="3 vidas iniciais">
              {[0, 1, 2].map((i) => (
                <HeartIcon key={i} filled shaking={false} urgent={false} />
              ))}
            </View>
            <Text style={styles.highScoreText}>
              Recorde atual: {state.profile.arcadeHighScore} pontos
            </Text>
          </View>

          <View style={styles.timerSwitchWrap}>
            <SegmentedTabs
              value={state.timedMode ? "timed" : "untimed"}
              onChange={actions.handleSetTimedMode}
              items={[
                { id: "timed", label: "Com Relógio (45s)", activeColor: theme.color.magic },
                { id: "untimed", label: "Sem Relógio", activeColor: theme.color.success }
              ]}
            />
          </View>

          <View style={styles.startBtnWrap}>
            <ActionButton label="Começar Duelo!" variant="magic" onPress={actions.handleStartGame} />
          </View>
        </View>
      )}

      {state.phase === "playing" && state.current && (
        <View
          style={[
            styles.playCard,
            isCompact && styles.playCardCompact,
            state.reveal?.correct === true
              ? styles.playCardCorrect
              : state.reveal?.correct === false
                ? styles.playCardWrong
                : styles.playCardDefault
          ]}
        >
          <View style={[styles.hudRow, isCompact && styles.hudRowCompact]}>
            <View
              style={styles.heartsRow}
              accessibilityLabel={`${state.lives} de ${ARCADE_MAX_LIVES} vidas restantes`}
            >
              {[0, 1, 2].map((i) => (
                <HeartIcon
                  key={i}
                  filled={i < state.lives}
                  shaking={state.lostHeartIdx === i}
                  urgent={state.lives === 1 && i === 0}
                />
              ))}
              <Text style={styles.livesText}>
                {state.lives}/{ARCADE_MAX_LIVES}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statMuted}>
                {state.qIdx + 1}/{state.totalQuestions}
              </Text>
              <Text style={styles.statMagic}>{state.score} pts</Text>
              {state.combo >= 2 && <Text style={styles.statAction}>Combo ×{state.combo}</Text>}
              {state.timedMode && (
                <Text style={[styles.statTimer, state.timeLeft <= 10 && styles.statUrgent]}>
                  {state.timeLeft}s
                </Text>
              )}
            </View>
          </View>

          <View style={styles.coachRow}>
            <PizzaAvatar
              size={isCompact ? 36 : 46}
              hat={state.profile.equippedHat}
              mood={
                state.reveal?.correct
                  ? "excited"
                  : state.reveal?.correct === false || state.lives === 1
                    ? "thinking"
                    : "happy"
              }
            />
            <Text style={[styles.coachText, isCompact && styles.coachTextCompact]}>
              {state.reveal?.correct === true
                ? `Mandou bem! +${20 + state.combo * 5} pts`
                : state.reveal?.correct === false
                  ? `A resposta certa era ${state.current.answer}!`
                  : state.lives === 1
                    ? "Último coração! Pense com calma!"
                    : "Escolha a resposta certa!"}
            </Text>
          </View>

          <Text style={[styles.questionPrompt, isCompact && styles.questionPromptCompact]}>
            {state.current.prompt}
          </Text>

          {state.current.pizza && (
            <View style={styles.pizzaCenter}>
              <Pizza
                denominator={state.current.pizza.d}
                selected={Array.from({ length: state.current.pizza.n }, (_, i) => i)}
                label="Pizza do desafio"
                size={isCompact ? 92 : 126}
                showSummary={false}
                topping={state.profile.equippedTopping}
              />
            </View>
          )}

          {isWide ? (
            <View style={styles.optionsGridWide}>
              {state.current.options.map((opt) => {
                const isPicked = state.reveal?.picked === opt;
                const isAnswer = opt === state.current?.answer;
                let variant: "outline" | "success" | "danger" = "outline";
                if (state.reveal) {
                  if (isAnswer) variant = "success";
                  else if (isPicked && !state.reveal.correct) variant = "danger";
                }
                return (
                  <View key={opt} style={styles.optionCol}>
                    <ActionButton
                      label={opt}
                      variant={variant}
                      disabled={state.reveal !== null}
                      onPress={() => actions.handleAnswerQuestion(opt)}
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.optionsGrid}>
              {[0, 2].map((startIdx) => (
                <View key={startIdx} style={styles.optionsGridWide}>
                  {state.current?.options.slice(startIdx, startIdx + 2).map((opt) => {
                    const isPicked = state.reveal?.picked === opt;
                    const isAnswer = opt === state.current?.answer;
                    let variant: "outline" | "success" | "danger" = "outline";
                    if (state.reveal) {
                      if (isAnswer) variant = "success";
                      else if (isPicked && !state.reveal.correct) variant = "danger";
                    }
                    return (
                      <View key={opt} style={styles.optionCol}>
                        <ActionButton
                          label={opt}
                          variant={variant}
                          size="sm"
                          disabled={state.reveal !== null}
                          onPress={() => actions.handleAnswerQuestion(opt)}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {(state.phase === "won" || state.phase === "gameover") && (
        <View
          style={[
            styles.endCard,
            state.phase === "won" ? styles.endCardWon : styles.endCardOver
          ]}
        >
          <PizzaAvatar
            size={96}
            hat={state.profile.equippedHat}
            mood={state.phase === "won" ? "excited" : "thinking"}
            animated
          />
          <Text style={styles.endTitle}>
            {state.phase === "won"
              ? "Vitória no Duelo!"
              : state.lives <= 0
                ? "Acabaram as Vidas!"
                : "Tempo Esgotado!"}
          </Text>

          <View style={styles.heartsRow} accessibilityLabel={`${state.lives} vidas restantes`}>
            {[0, 1, 2].map((i) => (
              <HeartIcon key={i} filled={i < state.lives} shaking={false} urgent={false} />
            ))}
          </View>

          <Text style={styles.finalScore}>{state.score} pontos</Text>
          <Text style={styles.endSub}>
            {state.phase === "won"
              ? `Você fechou o duelo com ${state.lives} vida(s) e ganhou +${Math.max(5, Math.floor(state.score / 10))} Queijos!`
              : `Você marcou ${state.score} pontos e ganhou +${Math.max(5, Math.floor(state.score / 10))} Queijos. Jogue outra rodada com novas perguntas!`}
          </Text>

          <View style={styles.endActions}>
            <View style={styles.endBtnWrap}>
              <ActionButton label="Novo Duelo!" variant="magic" onPress={actions.handleStartGame} />
            </View>
            <View style={styles.endBtnWrap}>
              <ActionButton
                label="Ir à Oficina"
                variant="gold"
                onPress={() => actions.handleNavigate("/shop")}
              />
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.error
  },
  readyCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.lgPlus,
    padding: theme.space.xlPlus,
    borderRadius: 24,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.outlineVariant
  },
  readyTexts: {
    alignItems: "center",
    gap: theme.space.sm,
    maxWidth: 420
  },
  readyTitle: {
    fontFamily: theme.font.display,
    fontSize: 26,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  readySub: {
    fontFamily: theme.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm
  },
  highScoreText: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.magicInk
  },
  timerSwitchWrap: {
    width: "100%",
    maxWidth: 340
  },
  startBtnWrap: {
    width: "100%",
    maxWidth: 280
  },
  playCard: {
    flex: 1,
    padding: theme.space.lg,
    borderRadius: 22,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    justifyContent: "space-between",
    gap: theme.space.md
  },
  playCardCompact: {
    padding: theme.space.mdPlus,
    borderRadius: 18,
    gap: theme.space.sm
  },
  playCardDefault: {
    borderColor: theme.color.outlineVariant
  },
  playCardCorrect: {
    borderColor: theme.color.success,
    backgroundColor: theme.color.successSoftTint
  },
  playCardWrong: {
    borderColor: theme.color.error,
    backgroundColor: theme.color.errorSoftTint
  },
  hudRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md,
    paddingBottom: theme.space.md,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.color.outlineVariant
  },
  hudRowCompact: {
    paddingBottom: theme.space.sm
  },
  livesText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  statMuted: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.onSurfaceMuted
  },
  statMagic: {
    fontFamily: theme.font.display,
    fontSize: 16,
    color: theme.color.magicInk
  },
  statAction: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.action
  },
  statTimer: {
    fontFamily: theme.font.display,
    fontSize: 16,
    color: theme.color.onSurface
  },
  statUrgent: {
    color: theme.color.error
  },
  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.md
  },
  coachText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 14,
    color: theme.color.onSurfaceMuted,
    flexShrink: 1
  },
  coachTextCompact: {
    fontSize: 12.5
  },
  questionPrompt: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  questionPromptCompact: {
    fontSize: 16.5
  },
  pizzaCenter: {
    alignItems: "center"
  },
  optionsGrid: {
    gap: theme.space.md
  },
  optionsGridWide: {
    flexDirection: "row",
    gap: theme.space.md
  },
  optionCol: {
    flex: 1
  },
  endCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.lg,
    padding: theme.space.xxl,
    borderRadius: 24,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5
  },
  endCardWon: {
    borderColor: theme.color.magic
  },
  endCardOver: {
    borderColor: theme.color.error
  },
  endTitle: {
    fontFamily: theme.font.display,
    fontSize: 26,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  finalScore: {
    fontFamily: theme.font.display,
    fontSize: 24,
    color: theme.color.magicInk
  },
  endSub: {
    fontFamily: theme.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  endActions: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.base
  },
  endBtnWrap: {
    flex: 1,
    minWidth: 150
  }
});

export default ArcadeScreen;
