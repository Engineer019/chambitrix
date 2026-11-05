import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import OmnitrixDial from './src/components/OmnitrixDial';
import useSounds from './src/hooks/useSounds';
import { aliens, RECHARGE_SECONDS } from './src/data/aliens';
import { colors } from './src/theme';

const mod = (n) => ((n % aliens.length) + aliens.length) % aliens.length;

export default function App() {
  const { playClick, playTransform, playTimeout, playReady } = useSounds();

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('idle'); // idle | transformed | recharge
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [now, setNow] = useState(new Date());

  // El alien que se ve es el que elegiste deslizando
  const alien = aliens[mod(step)];

  // Reloj normal
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Cuenta regresiva (transformación y recarga)
  useEffect(() => {
    if (mode === 'idle') return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [mode]);

  // Cambio de fase cuando llega a 0
  useEffect(() => {
    if (mode === 'idle' || secondsLeft > 0) return;
    if (mode === 'transformed') {
      setMode('recharge');
      setSecondsLeft(RECHARGE_SECONDS);
      playTimeout();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      setMode('idle');
      playReady();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [secondsLeft, mode]);

  // Deslizar para elegir alien
  const handleChange = (delta) => {
    if (mode !== 'idle') return;
    setStep((s) => s + delta);
    playClick();
    Haptics.selectionAsync();
  };

  // Tocar el centro: transformarte en el alien elegido o volver a la normalidad
  const handlePress = () => {
    if (mode === 'idle') {
      setMode('transformed');
      setSecondsLeft(alien.duration);
      playTransform();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (mode === 'transformed') {
      setMode('recharge');
      setSecondsLeft(RECHARGE_SECONDS);
      playTimeout();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  let hint;
  if (mode === 'idle') hint = 'Desliza para elegir · toca para transformarte';
  else if (mode === 'transformed') hint = 'Toca para volver a la normalidad';
  else hint = 'El Omnitrix se está recargando...';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.clock}>{mode === 'idle' ? time : alien.name.toUpperCase()}</Text>

      <OmnitrixDial
        alien={alien}
        mode={mode}
        secondsLeft={secondsLeft}
        step={step}
        onChange={handleChange}
        onPress={handlePress}
      />

      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  hint: {
    color: colors.greenDark,
    fontSize: 14,
    marginTop: 30,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
});