import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function AlienSilhouette({ alien, size = 110 }) {
  const color = alien.accent;
  const fourArms = alien.id === 6; // Cuatrobrazos

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="20" r="13" fill={color} />
      <Path
        d="M32 38 L68 38 L74 68 L62 68 L60 98 L52 98 L50 74 L48 98 L40 98 L38 68 L26 68 Z"
        fill={color}
      />
      {fourArms && (
        <>
          <Path d="M30 46 L10 62 L16 70 L34 58 Z" fill={color} />
          <Path d="M70 46 L90 62 L84 70 L66 58 Z" fill={color} />
        </>
      )}
    </Svg>
  );
}