import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import type { ToppingId } from "@/model/entities/progress";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Pizza } from "@/view/components/pizza";
import { theme } from "@/view/theme";

export type ActivityVisualKind = "equivalent" | "decimal" | "operations";

type SegmentedBarProps = {
  selected: number;
  total: number;
  color?: string;
  mystery?: boolean;
};

const SegmentedBar = ({
  selected,
  total,
  color = theme.color.action,
  mystery = false
}: SegmentedBarProps) => (
  <View style={[styles.barWrap, mystery ? styles.barMystery : styles.barSolid]}>
    {Array.from({ length: total }, (_, index) => {
      const filled = !mystery && index < selected;
      return (
        <View
          key={index}
          style={[
            styles.barCell,
            filled && { backgroundColor: color },
            index < total - 1 && (mystery ? styles.cellDividerMystery : styles.cellDivider)
          ]}
        >
          {mystery && <Text style={styles.mysteryChar}>?</Text>}
        </View>
      );
    })}
  </View>
);

type ActivityVisualProps = {
  kind: ActivityVisualKind;
  challenge: QuizChallenge;
  topping: ToppingId;
  answeredCorrectly?: boolean;
};

export const ActivityVisual = ({
  kind,
  challenge,
  topping,
  answeredCorrectly = false
}: ActivityVisualProps) => {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480 || height < 740;
  const v = challenge.visualData;

  if (kind === "equivalent") {
    const n = v.refNumerator ?? 2;
    const d = v.refDenominator ?? 3;
    return (
      <View style={[styles.panel, isCompact && styles.panelCompact]}>
        <View style={[styles.eqRow, isCompact && styles.eqRowCompact]}>
          <View style={styles.eqPizzaCol}>
            <Text style={[styles.mutedLabel, isCompact && styles.mutedLabelCompact]}>
              Comanda do Forno
            </Text>
            <Pizza
              denominator={d}
              selected={Array.from({ length: n }, (_, index) => index)}
              label={`Pizza de referência ${n}/${d}`}
              size={isCompact ? 68 : 106}
              showSummary={false}
              topping={topping}
            />
          </View>

          <View style={[styles.eqCard, isCompact && styles.eqCardCompact]}>
            <Text style={[styles.magicLabel, isCompact && styles.magicLabelCompact]}>
              Fração Equivalente
            </Text>
            <View style={[styles.eqFormulaRow, isCompact && styles.eqFormulaRowCompact]}>
              <FractionDisplay numerator={n} denominator={d} tone="magic" compact={isCompact} />
              <Text style={[styles.operatorText, isCompact && styles.operatorTextCompact]}>=</Text>
              <View style={[styles.mysteryAnswerBox, isCompact && styles.mysteryAnswerBoxCompact]}>
                <Text style={[styles.mysteryAnswerText, isCompact && styles.mysteryAnswerTextCompact]}>
                  {answeredCorrectly ? challenge.expected : "?"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (kind === "decimal") {
    const n = v.refNumerator ?? 1;
    const d = v.refDenominator ?? 4;
    const pct = Math.min(100, Math.max(0, Math.round((n / d) * 100)));

    return (
      <View style={[styles.panel, isCompact && styles.panelCompact]}>
        <View style={[styles.decTopRow, isCompact && styles.decTopRowCompact]}>
          <Pizza
            denominator={d}
            selected={Array.from({ length: n }, (_, index) => index)}
            label={`Pizza de ${n}/${d}`}
            size={isCompact ? 66 : 96}
            showSummary={false}
            topping={topping}
          />
          <FractionDisplay numerator={n} denominator={d} compact={isCompact} />
          <Text style={[styles.operatorText, isCompact && styles.operatorTextCompact]}>=</Text>
          <View style={[styles.digitalBoard, isCompact && styles.digitalBoardCompact]}>
            <Text style={[styles.digitalText, isCompact && styles.digitalTextCompact]}>
              {answeredCorrectly ? challenge.expected : "0,??"}
            </Text>
          </View>
        </View>

        <View style={styles.gaugeWrap}>
          <View style={[styles.gaugeTrack, isCompact && styles.gaugeTrackCompact]}>
            <View style={[styles.gaugeFill, { width: answeredCorrectly ? `${pct}%` : "0%" }]} />
          </View>
          <View style={styles.gaugeTicks}>
            {["0", "0,25", "0,50", "0,75", "1,00"].map((tick) => (
              <Text key={tick} style={[styles.tickText, isCompact && styles.tickTextCompact]}>
                {tick}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const left = v.leftFrac ?? { n: 3, d: 6 };
  const right = v.rightFrac ?? { n: 2, d: 6 };
  const res = v.resultFrac ?? { n: 5, d: 6 };

  return (
    <View style={[styles.panel, isCompact && styles.panelCompact]}>
      <Text style={[styles.opHint, isCompact && styles.opHintCompact]}>
        Partes do mesmo tamanho:{" "}
        {v.opSign === "-" ? "tire a segunda barra da primeira!" : "junte as duas barras!"}
      </Text>

      <View style={styles.opRow}>
        <Text style={[styles.opLabel, isCompact && styles.opLabelCompact]}>{v.leftLabel}</Text>
        <SegmentedBar selected={left.n} total={left.d} color={theme.color.action} />
      </View>

      <View style={styles.opRow}>
        <Text style={[styles.opLabel, isCompact && styles.opLabelCompact]}>
          {v.opSign ?? "+"} {v.rightLabel}
        </Text>
        <SegmentedBar selected={right.n} total={right.d} color={theme.color.magic} />
      </View>

      <View style={[styles.opResultRow, isCompact && styles.opResultRowCompact]}>
        <Text style={[styles.opResultLabel, isCompact && styles.opLabelCompact]}>
          {answeredCorrectly ? `= ${challenge.expected}` : "Resultado ?"}
        </Text>
        {answeredCorrectly ? (
          <SegmentedBar selected={res.n} total={res.d} color={theme.color.success} />
        ) : (
          <SegmentedBar selected={0} total={res.d} mystery />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 2,
    borderColor: theme.color.outlineVariant,
    gap: theme.space.md
  },
  panelCompact: {
    padding: theme.space.md,
    borderRadius: 14,
    gap: theme.space.sm
  },
  eqRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xlPlus
  },
  eqRowCompact: {
    flexWrap: "nowrap",
    justifyContent: "space-around",
    gap: theme.space.base
  },
  eqPizzaCol: {
    alignItems: "center",
    gap: theme.space.xs
  },
  mutedLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12.5,
    color: theme.color.onSurfaceMuted
  },
  mutedLabelCompact: {
    fontSize: 11
  },
  eqCard: {
    alignItems: "center",
    gap: theme.space.sm,
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.lg,
    borderRadius: 16,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant
  },
  eqCardCompact: {
    paddingHorizontal: theme.space.basePlus,
    paddingVertical: theme.space.smPlus,
    borderRadius: 14,
    gap: theme.space.xs
  },
  magicLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12.5,
    color: theme.color.magicInk
  },
  magicLabelCompact: {
    fontSize: 11
  },
  eqFormulaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  eqFormulaRowCompact: {
    gap: theme.space.smPlus
  },
  operatorText: {
    fontFamily: theme.font.display,
    fontSize: 24,
    color: theme.color.onSurface
  },
  operatorTextCompact: {
    fontSize: 20
  },
  mysteryAnswerBox: {
    minWidth: 54,
    height: 50,
    paddingHorizontal: theme.space.base,
    borderRadius: 12,
    backgroundColor: theme.color.magicSoft,
    borderWidth: 2,
    borderColor: theme.color.magicBorderSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  mysteryAnswerBoxCompact: {
    minWidth: 42,
    height: 40,
    paddingHorizontal: theme.space.md,
    borderRadius: 10
  },
  mysteryAnswerText: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.magicInk
  },
  mysteryAnswerTextCompact: {
    fontSize: 18
  },
  decTopRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.lgPlus
  },
  decTopRowCompact: {
    flexWrap: "nowrap",
    gap: theme.space.md
  },
  digitalBoard: {
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.md,
    borderRadius: 14,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderColor: theme.color.hudBorder
  },
  digitalBoardCompact: {
    paddingHorizontal: theme.space.basePlus,
    paddingVertical: theme.space.xsPlus,
    borderRadius: 11
  },
  digitalText: {
    fontFamily: theme.font.display,
    fontSize: 24,
    color: theme.color.hudGold
  },
  digitalTextCompact: {
    fontSize: 19
  },
  gaugeWrap: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: theme.space.xs
  },
  gaugeTrack: {
    height: 16,
    width: "100%",
    borderRadius: theme.shape.full,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.onSurface,
    overflow: "hidden"
  },
  gaugeTrackCompact: {
    height: 12
  },
  gaugeFill: {
    height: "100%",
    backgroundColor: theme.color.gold
  },
  gaugeTicks: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tickText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11.5,
    color: theme.color.onSurfaceMuted
  },
  tickTextCompact: {
    fontSize: 10.5
  },
  opHint: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12.5,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  opHintCompact: {
    fontSize: 11.5
  },
  opRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  opLabel: {
    width: 80,
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface
  },
  opLabelCompact: {
    width: 68,
    fontSize: 12.5
  },
  opResultRow: {
    paddingTop: theme.space.md,
    borderTopWidth: 1.5,
    borderTopColor: theme.color.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  opResultRowCompact: {
    paddingTop: theme.space.sm
  },
  opResultLabel: {
    width: 80,
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.successInk
  },
  barWrap: {
    flex: 1,
    height: 28,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: theme.color.surface
  },
  barSolid: {
    borderColor: theme.color.onSurface
  },
  barMystery: {
    borderColor: theme.color.outline,
    borderStyle: "dashed"
  },
  barCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  cellDivider: {
    borderRightWidth: 2,
    borderRightColor: theme.color.onSurface
  },
  cellDividerMystery: {
    borderRightWidth: 1,
    borderRightColor: theme.color.outlineVariant
  },
  mysteryChar: {
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  }
});
