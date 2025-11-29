import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Ellipse, G, Polygon } from 'react-native-svg';
import { COLORS } from '../constants/theme';

type Props = {
  courseId: string;
  size?: number;
  color?: string;
};

// Detailed line art icons for each course type - teal themed
export default function CourseLineArt({ courseId, size = 80, color = COLORS.primary }: Props) {
  const sw = 1.5; // stroke width
  const lightColor = '#7fb5b5'; // lighter teal for accents

  const renderIcon = () => {
    switch (courseId) {
      case 'tailoring':
        // Detailed sewing machine with fabric
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Sewing machine body */}
            <Path d="M12 44 L12 28 Q12 20 20 20 L44 20 Q52 20 52 28 L52 44" stroke={color} strokeWidth={sw} fill="none" />
            <Rect x="8" y="44" width="48" height="8" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Machine head */}
            <Path d="M36 20 L36 12 L44 12 L44 20" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="40" cy="16" r="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Needle */}
            <Line x1="32" y1="28" x2="32" y2="40" stroke={color} strokeWidth={sw} />
            <Path d="M30 40 L32 44 L34 40" stroke={color} strokeWidth={sw} fill="none" />
            {/* Thread spool */}
            <Ellipse cx="24" cy="16" rx="4" ry="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Line x1="24" y1="14" x2="24" y2="10" stroke={lightColor} strokeWidth={sw} />
            {/* Fabric */}
            <Path d="M16 36 Q20 32 24 36 Q28 40 32 36" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Wheel */}
            <Circle cx="48" cy="36" r="4" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="48" cy="36" r="1" stroke={color} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'embroidery':
        // Embroidery hoop with needle and floral pattern
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Outer hoop */}
            <Circle cx="32" cy="32" r="22" stroke={color} strokeWidth={sw + 1} fill="none" />
            {/* Inner hoop */}
            <Circle cx="32" cy="32" r="18" stroke={color} strokeWidth={sw} fill="none" />
            {/* Flower pattern inside */}
            <Circle cx="32" cy="32" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M32 24 Q36 28 32 32 Q28 28 32 24" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M40 32 Q36 36 32 32 Q36 28 40 32" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M32 40 Q28 36 32 32 Q36 36 32 40" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M24 32 Q28 28 32 32 Q28 36 24 32" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Leaves */}
            <Path d="M26 26 Q24 24 22 26" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M38 26 Q40 24 42 26" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M38 38 Q40 40 42 38" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M26 38 Q24 40 22 38" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Needle with thread */}
            <Line x1="48" y1="16" x2="38" y2="26" stroke={color} strokeWidth={sw} />
            <Circle cx="50" cy="14" r="2" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M52 12 Q56 8 54 4" stroke={color} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'knitting':
        // Detailed yarn ball with knitting needles and pattern
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Yarn ball */}
            <Circle cx="36" cy="38" r="14" stroke={color} strokeWidth={sw} fill="none" />
            {/* Yarn texture lines */}
            <Path d="M26 34 Q36 28 46 34" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M24 40 Q36 32 48 40" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M26 46 Q36 40 46 46" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M30 30 Q36 36 30 42" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M42 30 Q36 36 42 42" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Knitting needles */}
            <Line x1="8" y1="8" x2="30" y2="30" stroke={color} strokeWidth={sw + 0.5} />
            <Circle cx="6" cy="6" r="3" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="56" y1="8" x2="42" y2="30" stroke={color} strokeWidth={sw + 0.5} />
            <Circle cx="58" cy="6" r="3" stroke={color} strokeWidth={sw} fill="none" />
            {/* Knitted fabric hint */}
            <Path d="M14 18 L18 14 L22 18 L26 14" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'mehendi':
        // Detailed hand with intricate mehndi patterns
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Hand outline */}
            <Path d="M24 56 L24 36 M20 32 L20 22 M28 32 L28 18 M36 32 L36 22 M44 32 L44 26" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M16 36 Q16 32 20 32 L44 32 Q48 32 48 36 L48 44 Q48 54 32 58 Q16 54 16 44 Z" stroke={color} strokeWidth={sw} fill="none" />
            {/* Mehndi patterns */}
            <Circle cx="32" cy="44" r="5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="44" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M24 48 Q28 52 32 48 Q36 52 40 48" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M26 40 L28 38 L30 40" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M34 40 L36 38 L38 40" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Finger patterns */}
            <Circle cx="20" cy="26" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="28" cy="22" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="36" cy="26" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Wrist pattern */}
            <Path d="M20 54 Q24 52 28 54 Q32 56 36 54 Q40 52 44 54" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'baking':
        // Detailed cupcake with frosting swirls and cherry
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Cupcake base/wrapper */}
            <Path d="M18 36 L22 54 L42 54 L46 36" stroke={color} strokeWidth={sw} fill="none" />
            {/* Wrapper lines */}
            <Line x1="20" y1="38" x2="23" y2="52" stroke={lightColor} strokeWidth={sw} />
            <Line x1="26" y1="36" x2="28" y2="54" stroke={lightColor} strokeWidth={sw} />
            <Line x1="32" y1="36" x2="32" y2="54" stroke={lightColor} strokeWidth={sw} />
            <Line x1="38" y1="36" x2="36" y2="54" stroke={lightColor} strokeWidth={sw} />
            <Line x1="44" y1="38" x2="41" y2="52" stroke={lightColor} strokeWidth={sw} />
            {/* Frosting swirls */}
            <Path d="M16 36 Q16 28 24 26 Q32 24 32 18 Q32 24 40 26 Q48 28 48 36 Z" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M22 32 Q26 28 30 32" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M34 32 Q38 28 42 32" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Cherry on top */}
            <Circle cx="32" cy="14" r="4" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M32 10 Q36 6 38 8" stroke={color} strokeWidth={sw} fill="none" />
            {/* Sprinkles */}
            <Line x1="24" y1="30" x2="26" y2="28" stroke={lightColor} strokeWidth={sw} />
            <Line x1="38" y1="30" x2="40" y2="28" stroke={lightColor} strokeWidth={sw} />
          </Svg>
        );

      case 'beauty':
        // Detailed makeup set with lipstick, brush, and mirror
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Lipstick */}
            <Rect x="10" y="32" width="12" height="22" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M10 32 L10 26 Q16 16 22 26 L22 32" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="10" y1="38" x2="22" y2="38" stroke={lightColor} strokeWidth={sw} />
            {/* Makeup brush */}
            <Rect x="28" y="28" width="8" height="26" rx="1" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M28 28 L28 20 Q32 10 36 20 L36 28" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="30" y1="22" x2="30" y2="28" stroke={lightColor} strokeWidth={sw} />
            <Line x1="34" y1="22" x2="34" y2="28" stroke={lightColor} strokeWidth={sw} />
            {/* Hand mirror */}
            <Circle cx="50" cy="24" r="10" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="50" cy="24" r="7" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Rect x="47" y="34" width="6" height="16" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Sparkles */}
            <Path d="M48 20 L50 18 L52 20 L50 22 Z" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'packaging':
        // Detailed gift box with ribbon and bow
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Box body */}
            <Rect x="12" y="26" width="40" height="30" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Box lid */}
            <Rect x="10" y="18" width="44" height="8" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Vertical ribbon */}
            <Rect x="29" y="18" width="6" height="38" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Horizontal ribbon */}
            <Rect x="12" y="38" width="40" height="6" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Bow loops */}
            <Ellipse cx="24" cy="14" rx="6" ry="4" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="40" cy="14" rx="6" ry="4" stroke={color} strokeWidth={sw} fill="none" />
            {/* Bow center */}
            <Circle cx="32" cy="14" r="3" stroke={color} strokeWidth={sw} fill="none" />
            {/* Ribbon tails */}
            <Path d="M26 18 Q22 22 20 18" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M38 18 Q42 22 44 18" stroke={color} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'beadwork':
        // Detailed necklace with various beads and pendant
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Necklace chain curve */}
            <Path d="M12 16 Q12 44 32 52 Q52 44 52 16" stroke={color} strokeWidth={sw} fill="none" />
            {/* Beads along chain */}
            <Circle cx="14" cy="22" r="3" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="18" cy="30" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="24" cy="38" r="3" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="50" cy="22" r="3" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="46" cy="30" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="40" cy="38" r="3" stroke={color} strokeWidth={sw} fill="none" />
            {/* Center pendant */}
            <Path d="M28 46 L32 56 L36 46" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="44" r="4" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="44" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Small accent beads */}
            <Circle cx="16" cy="26" r="1.5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="48" cy="26" r="1.5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="21" cy="34" r="1.5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="43" cy="34" r="1.5" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'macrame':
        // Detailed macrame wall hanging with knots
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Hanging rod */}
            <Line x1="12" y1="8" x2="52" y2="8" stroke={color} strokeWidth={sw + 1} />
            {/* Main cords */}
            <Line x1="20" y1="8" x2="20" y2="56" stroke={color} strokeWidth={sw} />
            <Line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth={sw} />
            <Line x1="44" y1="8" x2="44" y2="56" stroke={color} strokeWidth={sw} />
            {/* Decorative knots - top row */}
            <Path d="M20 16 Q26 20 32 16" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M32 16 Q38 20 44 16" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Square knot pattern */}
            <Rect x="22" y="24" width="8" height="6" rx="1" stroke={color} strokeWidth={sw} fill="none" />
            <Rect x="34" y="24" width="8" height="6" rx="1" stroke={color} strokeWidth={sw} fill="none" />
            {/* Middle decorative row */}
            <Path d="M20 36 Q26 40 32 36 Q38 40 44 36" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Diamond pattern */}
            <Path d="M26 44 L32 38 L38 44 L32 50 Z" stroke={color} strokeWidth={sw} fill="none" />
            {/* Fringe at bottom */}
            <Line x1="16" y1="52" x2="16" y2="60" stroke={lightColor} strokeWidth={sw} />
            <Line x1="24" y1="52" x2="24" y2="58" stroke={lightColor} strokeWidth={sw} />
            <Line x1="40" y1="52" x2="40" y2="58" stroke={lightColor} strokeWidth={sw} />
            <Line x1="48" y1="52" x2="48" y2="60" stroke={lightColor} strokeWidth={sw} />
          </Svg>
        );

      case 'candles':
        // Detailed decorative candles with flames
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Tall candle */}
            <Rect x="14" y="28" width="12" height="28" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="20" y1="28" x2="20" y2="20" stroke={color} strokeWidth={sw} />
            <Path d="M16 20 Q20 8 24 20" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="20" cy="14" rx="3" ry="5" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Dripping wax */}
            <Path d="M14 32 Q12 36 14 38" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M26 34 Q28 38 26 40" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Short candle */}
            <Rect x="32" y="40" width="12" height="16" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="38" y1="40" x2="38" y2="34" stroke={color} strokeWidth={sw} />
            <Path d="M34 34 Q38 24 42 34" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="38" cy="30" rx="2" ry="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Candle holder */}
            <Ellipse cx="50" cy="52" rx="8" ry="3" stroke={color} strokeWidth={sw} fill="none" />
            <Rect x="46" y="44" width="8" height="8" rx="1" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="50" y1="44" x2="50" y2="38" stroke={color} strokeWidth={sw} />
            <Ellipse cx="50" cy="36" rx="2" ry="3" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'quilling':
        // Detailed quilling art with paper coils and flower
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Main flower made of coils */}
            <Circle cx="32" cy="28" r="6" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="28" r="3" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Petal coils */}
            <Circle cx="22" cy="22" r="5" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="22" cy="22" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="42" cy="22" r="5" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="42" cy="22" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="24" cy="36" r="5" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="24" cy="36" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="40" cy="36" r="5" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="40" cy="36" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Stem */}
            <Line x1="32" y1="42" x2="32" y2="56" stroke={color} strokeWidth={sw} />
            {/* Leaves */}
            <Path d="M32 48 Q24 44 20 50" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M32 52 Q40 48 44 54" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Paper strip hint */}
            <Path d="M8 12 Q12 8 16 12 Q20 16 24 12" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Quilling tool */}
            <Line x1="48" y1="48" x2="56" y2="56" stroke={color} strokeWidth={sw} />
            <Circle cx="48" cy="48" r="2" stroke={color} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'meesho':
        // Detailed shopping/e-commerce icon with phone and products
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Smartphone */}
            <Rect x="8" y="12" width="20" height="40" rx="3" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="18" cy="48" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Rect x="12" y="18" width="12" height="24" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Product boxes */}
            <Rect x="36" y="32" width="20" height="16" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="36" y1="40" x2="56" y2="40" stroke={lightColor} strokeWidth={sw} />
            <Rect x="40" y="16" width="12" height="12" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Money/rupee symbol */}
            <Circle cx="46" cy="22" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Line x1="44" y1="20" x2="48" y2="20" stroke={lightColor} strokeWidth={sw} />
            <Line x1="44" y1="24" x2="48" y2="24" stroke={lightColor} strokeWidth={sw} />
            {/* Shopping cart hint */}
            <Path d="M14 24 L16 22 L20 22 L22 24" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="15" cy="26" r="1" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="21" cy="26" r="1" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Arrow indicating growth */}
            <Path d="M28 44 L32 36 L36 44" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="32" y1="36" x2="32" y2="52" stroke={color} strokeWidth={sw} />
          </Svg>
        );

      case 'cooking':
        // Detailed cooking scene with pan, steam, and ingredients
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Frying pan */}
            <Ellipse cx="28" cy="42" rx="18" ry="10" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="28" cy="42" rx="14" ry="7" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Pan handle */}
            <Rect x="46" y="38" width="14" height="8" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Steam lines */}
            <Path d="M18 32 Q16 28 18 24" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M28 30 Q26 26 28 22" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M38 32 Q36 28 38 24" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Food in pan */}
            <Circle cx="22" cy="42" r="3" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="40" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Spice container */}
            <Rect x="8" y="8" width="10" height="14" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="13" cy="8" rx="5" ry="2" stroke={color} strokeWidth={sw} fill="none" />
            {/* Dots for spices */}
            <Circle cx="11" cy="14" r="1" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="15" cy="16" r="1" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'pottery':
        // Detailed pottery with wheel and vase
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Pottery wheel base */}
            <Ellipse cx="32" cy="54" rx="20" ry="6" stroke={color} strokeWidth={sw} fill="none" />
            <Ellipse cx="32" cy="48" rx="16" ry="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Vase on wheel */}
            <Path d="M24 48 L22 36 L20 28 Q20 20 32 18 Q44 20 44 28 L42 36 L40 48" stroke={color} strokeWidth={sw} fill="none" />
            {/* Vase opening */}
            <Ellipse cx="32" cy="18" rx="8" ry="3" stroke={color} strokeWidth={sw} fill="none" />
            {/* Decorative bands */}
            <Ellipse cx="32" cy="26" rx="10" ry="3" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Ellipse cx="32" cy="36" rx="9" ry="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Pattern on vase */}
            <Path d="M26 30 Q28 28 30 30 Q32 32 34 30 Q36 28 38 30" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Hands shaping */}
            <Path d="M16 32 Q18 30 20 32" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M44 32 Q46 30 48 32" stroke={color} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'rangoli':
        // Detailed rangoli/kolam pattern
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Outer circle */}
            <Circle cx="32" cy="32" r="24" stroke={color} strokeWidth={sw} fill="none" />
            {/* Inner circles */}
            <Circle cx="32" cy="32" r="16" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="32" r="8" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="32" r="3" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Petal pattern */}
            <Path d="M32 8 Q40 16 32 24 Q24 16 32 8" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M56 32 Q48 40 40 32 Q48 24 56 32" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M32 56 Q24 48 32 40 Q40 48 32 56" stroke={color} strokeWidth={sw} fill="none" />
            <Path d="M8 32 Q16 24 24 32 Q16 40 8 32" stroke={color} strokeWidth={sw} fill="none" />
            {/* Diagonal petals */}
            <Path d="M15 15 Q24 20 20 28 Q16 20 15 15" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M49 15 Q40 20 44 28 Q48 20 49 15" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M49 49 Q40 44 44 36 Q48 44 49 49" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M15 49 Q24 44 20 36 Q16 44 15 49" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Dots */}
            <Circle cx="32" cy="16" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="48" cy="32" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="48" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="16" cy="32" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      case 'soap':
        // Detailed soap making with molds and bubbles
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            {/* Soap bar */}
            <Rect x="12" y="28" width="24" height="16" rx="4" stroke={color} strokeWidth={sw} fill="none" />
            {/* Soap pattern/stamp */}
            <Ellipse cx="24" cy="36" rx="8" ry="5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M20 36 Q24 32 28 36" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Bubbles */}
            <Circle cx="44" cy="16" r="6" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="52" cy="24" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="48" cy="32" r="3" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="54" cy="38" r="5" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Circle cx="42" cy="42" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Bubble shine */}
            <Path d="M42 14 Q44 12 46 14" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M52 36 Q54 34 56 36" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Soap mold */}
            <Rect x="12" y="48" width="40" height="8" rx="2" stroke={color} strokeWidth={sw} fill="none" />
            <Line x1="22" y1="48" x2="22" y2="56" stroke={lightColor} strokeWidth={sw} />
            <Line x1="32" y1="48" x2="32" y2="56" stroke={lightColor} strokeWidth={sw} />
            <Line x1="42" y1="48" x2="42" y2="56" stroke={lightColor} strokeWidth={sw} />
            {/* Flower decoration on soap */}
            <Circle cx="24" cy="36" r="2" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );

      default:
        // Default detailed craft icon
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64">
            <Circle cx="32" cy="32" r="22" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="32" r="14" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M24 32 L32 24 L40 32 L32 40 Z" stroke={color} strokeWidth={sw} fill="none" />
            <Circle cx="32" cy="32" r="4" stroke={lightColor} strokeWidth={sw} fill="none" />
            {/* Decorative corners */}
            <Path d="M18 18 L22 14 L26 18" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M38 18 L42 14 L46 18" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M18 46 L22 50 L26 46" stroke={lightColor} strokeWidth={sw} fill="none" />
            <Path d="M38 46 L42 50 L46 46" stroke={lightColor} strokeWidth={sw} fill="none" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
