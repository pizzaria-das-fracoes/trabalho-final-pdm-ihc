import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Rect } from "react-native-svg";
import type { HatId } from "@/model/entities/progress";
import { avatarSvgColors } from "@/view/theme";

type PizzaAvatarProps = {
  size?: number;
  label?: string;
  hat?: HatId;
  mood?: "happy" | "excited" | "thinking";
  animated?: boolean;
};

export const PizzaAvatar = ({
  size = 72,
  label = "Chef Fatia, mascote do jogo",
  hat = "chef",
  mood = "happy",
  animated = false
}: PizzaAvatarProps) => {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      bob.setValue(0);
      return;
    }

    let loop: Animated.CompositeAnimation | null = null;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(bob, {
            toValue: -5,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(bob, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      );
      loop.start();
    });

    return () => {
      loop?.stop();
    };
  }, [animated, bob]);

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{ transform: [{ translateY: bob }] }}
    >
      <Svg width={size} height={size} viewBox="0 0 120 132">
        <Path
          d="M24 52 Q60 32 96 52 L62 114 Q60 119 58 114 Z"
          fill={avatarSvgColors.sliceCheese}
          stroke={avatarSvgColors.ink}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <Circle cx={36} cy={60} r={6} fill={avatarSvgColors.pepperoni} stroke={avatarSvgColors.ink} strokeWidth={2} />
        <Circle cx={84} cy={62} r={6} fill={avatarSvgColors.pepperoni} stroke={avatarSvgColors.ink} strokeWidth={2} />
        <Circle cx={60} cy={104} r={5.5} fill={avatarSvgColors.pepperoni} stroke={avatarSvgColors.ink} strokeWidth={2} />
        <Path d="M20 52 Q60 28 100 52" fill="none" stroke={avatarSvgColors.crust} strokeWidth={12} strokeLinecap="round" />
        <Path d="M20 47 Q60 23 100 47" fill="none" stroke={avatarSvgColors.ink} strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M23 57 Q60 35 97 57" fill="none" stroke={avatarSvgColors.ink} strokeWidth={2.5} strokeLinecap="round" />

        <Circle cx={48} cy={70} r={7.5} fill={avatarSvgColors.eyeWhite} stroke={avatarSvgColors.ink} strokeWidth={2} />
        <Circle cx={72} cy={70} r={7.5} fill={avatarSvgColors.eyeWhite} stroke={avatarSvgColors.ink} strokeWidth={2} />
        <Circle
          cx={mood === "thinking" ? 50 : 49}
          cy={mood === "thinking" ? 68 : 71}
          r={3.4}
          fill={avatarSvgColors.ink}
        />
        <Circle
          cx={mood === "thinking" ? 74 : 73}
          cy={mood === "thinking" ? 68 : 71}
          r={3.4}
          fill={avatarSvgColors.ink}
        />
        <Circle cx={47.5} cy={69} r={1.3} fill={avatarSvgColors.eyeWhite} />
        <Circle cx={71.5} cy={69} r={1.3} fill={avatarSvgColors.eyeWhite} />

        {mood === "excited" ? (
          <Path
            d="M51 84 Q60 97 69 84 Z"
            fill={avatarSvgColors.mouthExcited}
            stroke={avatarSvgColors.ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        ) : mood === "thinking" ? (
          <Path
            d="M54 86 Q60 83 66 86"
            fill="none"
            stroke={avatarSvgColors.ink}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ) : (
          <Path
            d="M52 84 Q60 93 68 84"
            fill="none"
            stroke={avatarSvgColors.ink}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}

        {hat === "chef" && (
          <G>
            <Path
              d="M40 36 C33 25 41 14 52 17 C56 10 66 10 70 17 C81 14 88 25 80 36 Z"
              fill={avatarSvgColors.eyeWhite}
              stroke={avatarSvgColors.ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <Rect
              x={40}
              y={33}
              width={40}
              height={8}
              rx={3}
              fill={avatarSvgColors.chefHatBrim}
              stroke={avatarSvgColors.ink}
              strokeWidth={2.5}
            />
          </G>
        )}
        {hat === "crown" && (
          <Path
            d="M39 38 L42 18 L53 28 L60 13 L67 28 L78 18 L81 38 Z"
            fill={avatarSvgColors.crownGold}
            stroke={avatarSvgColors.ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        )}
        {hat === "cap" && (
          <G>
            <Path
              d="M38 38 C40 20 80 20 82 38 Z"
              fill={avatarSvgColors.capPrimary}
              stroke={avatarSvgColors.ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            <Path
              d="M36 38 L94 38 C95 42 84 44 68 42 Z"
              fill={avatarSvgColors.capBrim}
              stroke={avatarSvgColors.ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </G>
        )}
        {hat === "stars" && (
          <G>
            <Polygon
              points="48,58 51,64 58,64 53,68 55,75 48,71 41,75 43,68 38,64 45,64"
              fill="none"
              stroke={avatarSvgColors.capPrimary}
              strokeWidth={2.5}
            />
            <Polygon
              points="72,58 75,64 82,64 77,68 79,75 72,71 65,75 67,68 62,64 69,64"
              fill="none"
              stroke={avatarSvgColors.capPrimary}
              strokeWidth={2.5}
            />
            <Line x1={57} y1={68} x2={63} y2={68} stroke={avatarSvgColors.capPrimary} strokeWidth={2.5} />
          </G>
        )}
      </Svg>
    </Animated.View>
  );
};
