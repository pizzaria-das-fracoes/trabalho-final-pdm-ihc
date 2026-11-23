import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { HatId } from "@/model/entities/progress";
import { ActionButton } from "@/view/components/actionButton";
import { ChipButton } from "@/view/components/chipButton";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { theme } from "@/view/theme";

type StageHeaderProps = {
  title: string;
  roundIndex: number;
  totalRounds: number;
  coins: number;
  streak: number;
  onBackToMap: () => void;
};

export const StageHeader = ({
  title,
  roundIndex,
  totalRounds,
  coins,
  streak,
  onBackToMap
}: StageHeaderProps) => {
  const progress = Math.min(100, Math.round(((roundIndex + 1) / totalRounds) * 100));

  return (
    <View style={styles.headerCard}>
      <View style={styles.headerRow}>
        <ChipButton
          label="← Mapa"
          variant="neutral"
          accessibilityLabel="Voltar para o Mapa"
          onPress={onBackToMap}
          style={styles.backChip}
        />

        <View style={styles.progressCol}>
          <View style={styles.progressMeta}>
            <Text style={styles.stageTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.roundCounter}>
              Pedido {roundIndex + 1}/{totalRounds}
            </Text>
          </View>
          <View style={styles.progressTrack} accessibilityLabel="Progresso da fase">
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <Text style={styles.streakText}>
          {streak >= 2 ? `Combo ×${streak}` : `${coins} Q`}
        </Text>
      </View>
    </View>
  );
};

type VictoryCardProps = {
  worldTitle: string;
  stars: number;
  chefName: string;
  hat: HatId;
  onReplay: () => void;
  onMap: () => void;
};

export const VictoryCard = ({
  worldTitle,
  stars,
  chefName,
  hat,
  onReplay,
  onMap
}: VictoryCardProps) => {
  const starScales = useRef([
    new Animated.Value(0.5),
    new Animated.Value(0.5),
    new Animated.Value(0.5)
  ]).current;

  useEffect(() => {
    starScales.forEach((anim, index) => {
      anim.setValue(0.5);
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 110,
        friction: 5,
        tension: 120,
        useNativeDriver: true
      }).start();
    });
  }, [starScales, stars]);

  return (
    <View style={styles.victoryCard}>
      <PizzaAvatar size={116} hat={hat} mood="excited" animated />

      <View style={styles.victoryHeading}>
        <Text style={styles.victoryKicker}>Turno Concluído · {chefName}</Text>
        <Text style={styles.victoryTitle}>Fornada Completa!</Text>
        <Text style={styles.victorySub}>
          Você entregou todos os pedidos de {worldTitle}!
        </Text>
      </View>

      <View style={styles.starsRow} accessibilityLabel={`${stars} de 3 estrelas`}>
        {[1, 2, 3].map((n, index) => {
          const earned = n <= stars;
          return (
            <Animated.View
              key={n}
              style={earned ? { transform: [{ scale: starScales[index] }] } : undefined}
            >
              <Svg width={50} height={50} viewBox="0 0 24 24">
                <Path
                  fill={earned ? theme.color.gold : theme.color.surfaceHigh}
                  stroke={theme.color.onSurface}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                  d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"
                />
              </Svg>
            </Animated.View>
          );
        })}
      </View>

      <Text style={styles.victoryBonus}>+25 XP bônus · Estrelas salvas no seu mapa</Text>

      <View style={styles.victoryActions}>
        <View style={styles.victoryBtnWrap}>
          <ActionButton label="Novo Turno" variant="outline" onPress={onReplay} />
        </View>
        <View style={styles.victoryBtnWrap}>
          <ActionButton label="Voltar ao Mapa" variant="success" onPress={onMap} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.sm,
    borderRadius: 15,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.outlineVariant
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md
  },
  backChip: {
    minHeight: 32,
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.tiny
  },
  progressCol: {
    flex: 1,
    gap: theme.space.tiny
  },
  progressMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.sm
  },
  stageTitle: {
    flex: 1,
    fontFamily: theme.font.display,
    fontSize: 13.5,
    color: theme.color.onSurface
  },
  roundCounter: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11.5,
    color: theme.color.onSurfaceMuted
  },
  progressTrack: {
    height: 9,
    borderRadius: theme.shape.full,
    backgroundColor: theme.color.surfaceMid,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.color.success,
    borderRadius: theme.shape.full
  },
  streakText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.goldInk
  },
  victoryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xl,
    padding: theme.space.xxl,
    borderRadius: 24,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.gold
  },
  victoryHeading: {
    alignItems: "center",
    gap: theme.space.xs
  },
  victoryKicker: {
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.goldInk
  },
  victoryTitle: {
    fontFamily: theme.font.display,
    fontSize: 28,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  victorySub: {
    fontFamily: theme.font.body,
    fontSize: 15,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.lg
  },
  victoryBonus: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 14,
    color: theme.color.successInk,
    textAlign: "center"
  },
  victoryActions: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.base
  },
  victoryBtnWrap: {
    flex: 1,
    minWidth: 150
  }
});
