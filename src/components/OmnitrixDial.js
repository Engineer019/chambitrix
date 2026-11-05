import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Pressable, Image } from 'react-native';
import { colors, sizes } from '../theme';
import HourglassSymbol from './HourglassSymbol';

const SWIPE_STEP = 40;
const DIAL = sizes.dial;

// Tamaño del círculo del centro respecto al reloj (0.0 a 1.0).
// Súbelo o bájalo hasta que tape justo el centro de tu imagen.
const FACE_RATIO = 0.62;
const FACE = DIAL * FACE_RATIO;

export default function OmnitrixDial({ alien, mode, secondsLeft, step, onChange, onPress }) {
  const rotation = useRef(new Animated.Value(step)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const done = useRef(0);
  const onChangeRef = useRef(onChange);
  const enabledRef = useRef(mode === 'idle');

  onChangeRef.current = onChange;
  enabledRef.current = mode === 'idle';

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: step,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [step]);

  useEffect(() => {
    if (mode === 'idle') return;
    flash.setValue(0.8);
    Animated.timing(flash, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  }, [mode]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) =>
        enabledRef.current && Math.abs(g.dx) > 8,
      onPanResponderGrant: () => {
        done.current = 0;
      },
      onPanResponderMove: (_, g) => {
        const steps = Math.trunc(g.dx / SWIPE_STEP);
        while (done.current < steps) {
          done.current += 1;
          onChangeRef.current(1);
        }
        while (done.current > steps) {
          done.current -= 1;
          onChangeRef.current(-1);
        }
      },
    })
  ).current;

  const glowColor = mode === 'recharge' ? colors.recharge : colors.green;

  // La cara se queda oscura mientras estás en idle o transformado,
  // para que el alien se vea bien; solo se pone roja en la recarga.
  const faceColor = mode === 'recharge' ? colors.recharge : colors.faceDark;

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-36deg'],
  });

  return (
    <View style={styles.container} {...pan.panHandlers}>
      {/* Imagen del Omnitrix: gira al deslizar */}
      <Animated.Image
        source={require('../assets/omnitrix.png')}
        style={[styles.dialImg, { transform: [{ rotate: spin }] }]}
        resizeMode="contain"
      />

      {/* Cara del centro: se queda fija y tapa el centro de la imagen */}
      <Pressable
        onPress={onPress}
        style={[
          styles.face,
          { backgroundColor: faceColor, borderColor: glowColor, shadowColor: glowColor },
        ]}
      >
        {mode === 'idle' && (
          <>
            <Image source={alien.image} style={styles.alienImg} resizeMode="contain" />
            <Text style={styles.holoName}>{alien.name}</Text>
          </>
        )}

        {mode === 'transformed' && (
          <>
            <Image source={alien.image} style={styles.alienImg} resizeMode="contain" />
            <Text style={styles.countAlien}>{secondsLeft}s</Text>
          </>
        )}

        {mode === 'recharge' && (
          <>
            <HourglassSymbol size={FACE * 0.55} color="#000" />
            <Text style={styles.count}>{secondsLeft}s</Text>
          </>
        )}
      </Pressable>

      <Animated.View
        pointerEvents="none"
        style={[styles.flash, { opacity: flash, backgroundColor: glowColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: DIAL,
    height: DIAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialImg: {
    position: 'absolute',
    width: DIAL,
    height: DIAL,
  },
  face: {
    width: FACE,
    height: FACE,
    borderRadius: FACE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  alienImg: {
    width: FACE * 0.62,
    height: FACE * 0.62,
  },
  holoName: {
    color: colors.green,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  count: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  countAlien: {
    color: colors.green,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DIAL / 2,
  },
});