import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "@/view/tokens";

type Props = { denominator: number; selected: number[]; label: string; size?: number; showSummary?: boolean };

const sectorPath = (index: number, denominator: number) => {
  const center = 100;
  const radius = 86;
  const start = (Math.PI * 2 * index) / denominator - Math.PI / 2;
  const end = (Math.PI * 2 * (index + 1)) / denominator - Math.PI / 2;
  const startX = center + radius * Math.cos(start);
  const startY = center + radius * Math.sin(start);
  const endX = center + radius * Math.cos(end);
  const endY = center + radius * Math.sin(end);
  const largeArc = 360 / denominator > 180 ? 1 : 0;
  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
};

export const Pizza = ({ denominator, selected, label, size = tokens.pizza.size, showSummary = true }: Props) => {
  const safeDenominator = Math.min(8, Math.max(2, denominator));

  return (
    <View style={styles.wrapper}>
      <View accessible accessibilityRole="image" accessibilityLabel={label}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx={100} cy={100} r={98} fill={tokens.pizza.crust} />
          <Circle cx={100} cy={100} r={88} fill={tokens.pizza.unselected} />
          {Array.from({ length: safeDenominator }, (_, index) => (
            <Path
              key={`slice-${index}`}
              d={sectorPath(index, safeDenominator)}
              fill={selected.includes(index) ? tokens.pizza.selected : tokens.pizza.unselected}
              stroke={tokens.pizza.separator}
              strokeWidth={tokens.pizza.separatorWidth}
              strokeLinejoin="round"
            />
          ))}
          {selected.filter((index) => index < safeDenominator).flatMap((index) => {
            const angle = (Math.PI * 2 * (index + 0.5)) / safeDenominator - Math.PI / 2;
            const point = (radius: number, offset = 0) => ({
              x: 100 + radius * Math.cos(angle) + offset * Math.sin(angle),
              y: 100 + radius * Math.sin(angle) - offset * Math.cos(angle)
            });
            const topping = point(52);
            const toppingSmall = point(70, 7);
            const basil = point(33, -6);
            return [
              <Circle key={`pepperoni-${index}`} cx={topping.x} cy={topping.y} r={7} fill={tokens.pizza.topping} stroke={tokens.color.onSurface} strokeWidth={2} />,
              <Circle key={`pepperoni-small-${index}`} cx={toppingSmall.x} cy={toppingSmall.y} r={5} fill={tokens.pizza.topping} stroke={tokens.color.onSurface} strokeWidth={2} />,
              <Circle key={`basil-${index}`} cx={basil.x} cy={basil.y} r={3.4} fill={tokens.color.success} />
            ];
          })}
          <Circle cx={100} cy={100} r={88} fill="none" stroke={tokens.pizza.separator} strokeWidth={tokens.pizza.separatorWidth} />
          <Circle cx={100} cy={100} r={4} fill={tokens.color.onSurface} />
        </Svg>
      </View>
      {showSummary && <Text style={styles.summary}>{selected.length}/{safeDenominator}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: tokens.pizza.gap },
  summary: { color: tokens.color.onSurface, fontSize: tokens.pizza.summaryFont, lineHeight: 24, fontWeight: "700" }
});
