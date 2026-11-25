import { type ComponentRef, useRef, useCallback } from "react";
import { type GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import type { ToppingId } from "@/model/entities/progress";
import { pizzaSvgColors, pizzaToppingColors, theme } from "@/view/theme";

type PizzaProps = {
  denominator: number;
  selected: number[];
  label: string;
  size?: number;
  showSummary?: boolean;
  topping?: ToppingId;
  onToggleSlice?: (index: number) => void;
};

const sectorPath = (index: number, denominator: number, radius = 84): string => {
  const center = 100;
  const start = (Math.PI * 2 * index) / denominator - Math.PI / 2;
  const end = (Math.PI * 2 * (index + 1)) / denominator - Math.PI / 2;
  const startX = center + radius * Math.cos(start);
  const startY = center + radius * Math.sin(start);
  const endX = center + radius * Math.cos(end);
  const endY = center + radius * Math.sin(end);
  const largeArc = 360 / denominator > 180 ? 1 : 0;
  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
};

const getSliceFromCoords = (localX: number, localY: number, size: number, safeDenominator: number): number | null => {
  const center = size / 2;
  const dx = localX - center;
  const dy = localY - center;
  const dist = Math.hypot(dx, dy);
  if (dist > center * 0.99) return null;

  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += Math.PI * 2;

  return Math.min(
    safeDenominator - 1,
    Math.max(0, Math.floor((angle / (Math.PI * 2)) * safeDenominator))
  );
};

export const Pizza = ({
  denominator,
  selected,
  label,
  size = theme.pizza.size,
  showSummary = true,
  topping = "pepperoni",
  onToggleSlice
}: PizzaProps) => {
  const safeDenominator = Math.min(100, Math.max(1, Math.round(denominator)));
  const palette = pizzaToppingColors[topping];

  const handleToggle = (index: number) => {
    if (!onToggleSlice) return;
    onToggleSlice(index);
  };

  const handlePizzaPressIn = useCallback(
    (event: GestureResponderEvent) => {
      if (!onToggleSlice) return;
      if (safeDenominator === 1) {
        handleToggle(0);
        return;
      }

      const native = (event.nativeEvent ?? {}) as unknown as {
        locationX?: number;
        locationY?: number;
        changedTouches?: ReadonlyArray<{ locationX?: number; locationY?: number }>;
        offsetX?: number;
        offsetY?: number;
      };

      let localX: number | undefined;
      let localY: number | undefined;

      if (
        typeof native.locationX === "number" &&
        typeof native.locationY === "number" &&
        !Number.isNaN(native.locationX) &&
        !Number.isNaN(native.locationY)
      ) {
        localX = native.locationX;
        localY = native.locationY;
      } else if (
        native.offsetX !== undefined &&
        native.offsetY !== undefined &&
        !Number.isNaN(native.offsetX) &&
        !Number.isNaN(native.offsetY)
      ) {
        localX = native.offsetX;
        localY = native.offsetY;
      } else if (
        native.changedTouches &&
        native.changedTouches.length > 0 &&
        typeof native.changedTouches[0].locationX === "number" &&
        typeof native.changedTouches[0].locationY === "number"
      ) {
        localX = native.changedTouches[0].locationX!;
        localY = native.changedTouches[0].locationY!;
      }

      if (localX === undefined || localY === undefined) return;

      const sliceIndex = getSliceFromCoords(localX, localY, size, safeDenominator);
      if (sliceIndex !== null) handleToggle(sliceIndex);
    },
    [onToggleSlice, safeDenominator, size]
  );

  const dividerStroke =
    safeDenominator <= 12 ? 2.4 : safeDenominator <= 24 ? 1.4 : safeDenominator <= 50 ? 0.85 : 0.5;
  const showFullToppings = safeDenominator <= 16;
  const showMiniGarnish = safeDenominator > 16 && safeDenominator <= 36;

  const svgContent = (
    <View pointerEvents="none" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Circle cx={100} cy={103} r={96} fill={pizzaSvgColors.trayShadow} />
        <Circle cx={100} cy={100} r={96} fill={pizzaSvgColors.crustOuter} stroke={pizzaSvgColors.strokeInk} strokeWidth={2.5} />
        <Circle cx={100} cy={100} r={90} fill={pizzaSvgColors.crustInner} />
        <Circle cx={42} cy={38} r={3} fill={pizzaSvgColors.crustSpeck} opacity={0.65} />
        <Circle cx={158} cy={46} r={3.5} fill={pizzaSvgColors.crustSpeck} opacity={0.65} />
        <Circle cx={166} cy={140} r={3} fill={pizzaSvgColors.crustSpeck} opacity={0.65} />
        <Circle cx={36} cy={142} r={3.5} fill={pizzaSvgColors.crustSpeck} opacity={0.65} />

        <Circle cx={100} cy={100} r={84} fill={pizzaSvgColors.dough} />

        {safeDenominator === 1 ? (
          <G>
            <Circle
              cx={100}
              cy={100}
              r={84}
              fill={selected.includes(0) ? palette.cheese : pizzaSvgColors.dough}
            />
            {selected.includes(0) && <Circle cx={100} cy={100} r={76} fill={palette.sauce} />}
          </G>
        ) : (
          Array.from({ length: safeDenominator }, (_, index) => {
            const isSelected = selected.includes(index);
            return (
              <G key={`slice-${index}`}>
                <Path
                  d={sectorPath(index, safeDenominator, 84)}
                  fill={isSelected ? palette.cheese : pizzaSvgColors.dough}
                />
                {isSelected && (
                  <Path d={sectorPath(index, safeDenominator, 76)} fill={palette.sauce} />
                )}
              </G>
            );
          })
        )}

        {safeDenominator > 1 &&
          Array.from({ length: safeDenominator }, (_, index) => {
            const angle = (Math.PI * 2 * index) / safeDenominator - Math.PI / 2;
            const x2 = 100 + 84 * Math.cos(angle);
            const y2 = 100 + 84 * Math.sin(angle);
            return (
              <Line
                key={`div-${index}`}
                x1={100}
                y1={100}
                x2={x2}
                y2={y2}
                stroke={pizzaSvgColors.strokeInk}
                strokeWidth={dividerStroke}
                strokeLinecap="round"
              />
            );
          })}

        {showMiniGarnish &&
          selected
            .filter((index) => index < safeDenominator)
            .map((index) => {
              const angle = (Math.PI * 2 * (index + 0.5)) / safeDenominator - Math.PI / 2;
              const x = 100 + 56 * Math.cos(angle);
              const y = 100 + 56 * Math.sin(angle);
              return (
                <Circle
                  key={`mini-${index}`}
                  cx={x}
                  cy={y}
                  r={safeDenominator <= 24 ? 3.2 : 2}
                  fill={
                    topping === "olive"
                      ? pizzaSvgColors.oliveInk
                      : topping === "berry"
                        ? pizzaSvgColors.berryPink
                        : pizzaSvgColors.pepperoniRed
                  }
                />
              );
            })}

        {showFullToppings &&
          selected
            .filter((index) => index < safeDenominator)
            .flatMap((index) => {
              const angle = (Math.PI * 2 * (index + 0.5)) / safeDenominator - Math.PI / 2;
              const point = (radius: number, offset = 0) => ({
                x: 100 + radius * Math.cos(angle) + offset * Math.sin(angle),
                y: 100 + radius * Math.sin(angle) - offset * Math.cos(angle)
              });
              const scale = safeDenominator > 10 ? 0.68 : 1;
              const p1 = point(48);
              const p2 = point(64, 9 * scale);
              const p3 = point(32, -7 * scale);

              if (topping === "olive") {
                return [
                  <Circle
                    key={`ol1-${index}`}
                    cx={p1.x}
                    cy={p1.y}
                    r={7 * scale}
                    fill="none"
                    stroke={pizzaSvgColors.oliveInk}
                    strokeWidth={4.5 * scale}
                  />,
                  <Circle
                    key={`ol2-${index}`}
                    cx={p2.x}
                    cy={p2.y}
                    r={5 * scale}
                    fill="none"
                    stroke={pizzaSvgColors.oliveInk}
                    strokeWidth={3.5 * scale}
                  />,
                  <Circle key={`ol3-${index}`} cx={p3.x} cy={p3.y} r={3 * scale} fill={palette.cheese} />
                ];
              }

              if (topping === "berry") {
                return [
                  <Circle
                    key={`b1-${index}`}
                    cx={p1.x}
                    cy={p1.y}
                    r={6.5 * scale}
                    fill={pizzaSvgColors.berryPink}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={1.8 * scale}
                  />,
                  <Circle
                    key={`b2-${index}`}
                    cx={p2.x}
                    cy={p2.y}
                    r={5 * scale}
                    fill={pizzaSvgColors.berryGold}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={1.8 * scale}
                  />,
                  <Circle
                    key={`b3-${index}`}
                    cx={p3.x}
                    cy={p3.y}
                    r={4 * scale}
                    fill={pizzaSvgColors.berryMint}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={1.5 * scale}
                  />
                ];
              }

              if (topping === "mushroom") {
                return [
                  <G key={`m1-${index}`}>
                    <Rect
                      x={p1.x - 2.5 * scale}
                      y={p1.y}
                      width={5 * scale}
                      height={7 * scale}
                      rx={1.5}
                      fill={pizzaSvgColors.mushroomStem}
                      stroke={pizzaSvgColors.strokeInk}
                      strokeWidth={1.6 * scale}
                    />
                    <Path
                      d={`M ${p1.x - 8 * scale} ${p1.y + 1} A ${8 * scale} ${8 * scale} 0 0 1 ${p1.x + 8 * scale} ${p1.y + 1} Z`}
                      fill={pizzaSvgColors.mushroomCap}
                      stroke={pizzaSvgColors.strokeInk}
                      strokeWidth={1.6 * scale}
                    />
                  </G>,
                  <Circle
                    key={`m2-${index}`}
                    cx={p2.x}
                    cy={p2.y}
                    r={3.8 * scale}
                    fill={pizzaSvgColors.mushroomHerb}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={1.2 * scale}
                  />
                ];
              }

              return [
                <G key={`pep1-${index}`}>
                  <Circle
                    cx={p1.x}
                    cy={p1.y}
                    r={7.5 * scale}
                    fill={pizzaSvgColors.pepperoniRed}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={2 * scale}
                  />
                  <Circle cx={p1.x - 2 * scale} cy={p1.y - 2 * scale} r={1.8 * scale} fill={pizzaSvgColors.pepperoniHighlight} />
                </G>,
                <G key={`pep2-${index}`}>
                  <Circle
                    cx={p2.x}
                    cy={p2.y}
                    r={5.5 * scale}
                    fill={pizzaSvgColors.pepperoniRed}
                    stroke={pizzaSvgColors.strokeInk}
                    strokeWidth={1.8 * scale}
                  />
                  <Circle cx={p2.x - 1.4 * scale} cy={p2.y - 1.4 * scale} r={1.3 * scale} fill={pizzaSvgColors.pepperoniHighlight} />
                </G>,
                <Ellipse
                  key={`basil-${index}`}
                  cx={p3.x}
                  cy={p3.y}
                  rx={4.5 * scale}
                  ry={2.8 * scale}
                  transform={`rotate(${(index * 45) % 180} ${p3.x} ${p3.y})`}
                  fill={pizzaSvgColors.basilFill}
                  stroke={pizzaSvgColors.oliveInk}
                  strokeWidth={1.3 * scale}
                />
              ];
            })}

        <Circle cx={100} cy={100} r={84} fill="none" stroke={pizzaSvgColors.strokeInk} strokeWidth={2.5} />
        <Circle cx={100} cy={100} r={safeDenominator > 24 ? 3 : 4.5} fill={pizzaSvgColors.strokeInk} />
      </Svg>
    </View>
  );

  return (
    <View style={styles.container}>
      {onToggleSlice ? (
        <Pressable
          onPress={handlePizzaPressIn}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Toque em uma fatia da pizza para pintar ou limpar"
          style={({ pressed }) => [
            styles.interactiveBox,
            { width: size, height: size, borderRadius: size / 2 },
            pressed && styles.interactivePressed
          ]}
        >
          {svgContent}
        </Pressable>
      ) : (
        <View accessible accessibilityRole="image" accessibilityLabel={label}>
          {svgContent}
        </View>
      )}

      {showSummary && (
        <Text style={styles.summary} selectable={false}>
          {selected.length}/{safeDenominator}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: theme.space.xs
  },
  interactiveBox: {
    alignItems: "center",
    justifyContent: "center"
  },
  interactivePressed: {
    transform: [{ scale: 0.985 }]
  },
  summary: {
    fontFamily: theme.font.display,
    fontSize: 17,
    color: theme.color.onSurface
  }
});