import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "@/view/tokens";

type Props = { size?: number; label?: string };

export const PizzaAvatar = ({ size = 72, label = "Mascote Fatia, personagem de pizza" }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" accessible accessibilityRole="image" accessibilityLabel={label}>
    <Path d="M24 44 Q60 24 96 44 L62 104 Q60 109 58 104 Z" fill={tokens.color.accentSoft} stroke={tokens.color.onSurface} strokeWidth={3} strokeLinejoin="round" />
    <Circle cx={36} cy={50} r={6} fill={tokens.color.action} stroke={tokens.color.onSurface} strokeWidth={2} />
    <Circle cx={84} cy={52} r={6} fill={tokens.color.action} stroke={tokens.color.onSurface} strokeWidth={2} />
    <Circle cx={60} cy={94} r={6} fill={tokens.color.action} stroke={tokens.color.onSurface} strokeWidth={2} />
    <Path d="M20 44 Q60 20 100 44" fill="none" stroke={tokens.pizza.crust} strokeWidth={12} strokeLinecap="round" />
    <Path d="M20 39 Q60 15 100 39" fill="none" stroke={tokens.color.onSurface} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M23 49 Q60 27 97 49" fill="none" stroke={tokens.color.onSurface} strokeWidth={2.5} strokeLinecap="round" />
    <Circle cx={48} cy={62} r={7} fill={tokens.color.surface} stroke={tokens.color.onSurface} strokeWidth={2} />
    <Circle cx={72} cy={62} r={7} fill={tokens.color.surface} stroke={tokens.color.onSurface} strokeWidth={2} />
    <Circle cx={49} cy={63} r={3.2} fill={tokens.color.onSurface} />
    <Circle cx={73} cy={63} r={3.2} fill={tokens.color.onSurface} />
    <Path d="M52 77 Q60 86 68 77" fill="none" stroke={tokens.color.onSurface} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);
