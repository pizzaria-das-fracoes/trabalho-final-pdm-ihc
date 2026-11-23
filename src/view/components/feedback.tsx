import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { HatId } from "@/model/entities/progress";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { theme } from "@/view/theme";

type FeedbackProps = {
  correct: boolean;
  message: string;
  xp?: number;
  hat?: HatId;
};

export const Feedback = ({ correct, message, xp, hat = "chef" }: FeedbackProps) => {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480 || height < 740;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    scale.setValue(0.95);
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true
    }).start();
  }, [correct, message, scale]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.box,
        isCompact && styles.boxCompact,
        correct ? styles.boxCorrect : styles.boxWrong,
        { transform: [{ scale }] }
      ]}
    >
      <PizzaAvatar
        size={isCompact ? 34 : 42}
        hat={hat}
        mood={correct ? "excited" : "thinking"}
        label={correct ? "Chef Fatia comemorando" : "Chef Fatia dando uma dica"}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              isCompact && styles.titleCompact,
              correct ? styles.titleCorrect : styles.titleWrong
            ]}
          >
            {correct ? "Pedido Perfeito!" : "Quase lá — tente outro caminho!"}
          </Text>

          {correct && xp !== undefined && (
            <Text style={styles.xp}>+{xp} XP · +10 Q</Text>
          )}
        </View>
        <Text style={[styles.message, isCompact && styles.messageCompact]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.smPlus,
    borderRadius: 15,
    borderWidth: 2,
    borderBottomWidth: 3
  },
  boxCompact: {
    gap: theme.space.md,
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.xsPlus,
    borderRadius: 13
  },
  boxCorrect: {
    backgroundColor: theme.color.successSoft,
    borderColor: theme.color.success
  },
  boxWrong: {
    backgroundColor: theme.color.errorSoft,
    borderColor: theme.color.error
  },
  content: {
    flex: 1,
    gap: theme.space.hair
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.xs
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 14.5
  },
  titleCompact: {
    fontSize: 13
  },
  titleCorrect: {
    color: theme.color.successInk
  },
  titleWrong: {
    color: theme.color.error
  },
  xp: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11.5,
    color: theme.color.successInk
  },
  message: {
    fontFamily: theme.font.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: theme.color.onSurface
  },
  messageCompact: {
    fontSize: 11.5,
    lineHeight: 15
  }
});
