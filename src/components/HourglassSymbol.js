import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

export default function HourglassSymbol({ size = 90, color = '#5CFF3A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points="18,12 82,12 50,50" fill={color} />
      <Polygon points="18,88 82,88 50,50" fill={color} />
    </Svg>
  );
}