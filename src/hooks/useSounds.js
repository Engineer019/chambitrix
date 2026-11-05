import { useEffect } from 'react';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

export default function useSounds() {
  const click = useAudioPlayer(require('../../assets/sound/omnitrix_click.mp3'));
  const transform = useAudioPlayer(require('../../assets/sound/omnitrix-transform.mp3'));
  const timeout = useAudioPlayer(
    require('../../assets/sound/prototype-omnitrix-time-out-sound-effect_160k.mp3')
  );
  const ready = useAudioPlayer(require('../../assets/sound/core-ready.mp3'));

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const play = (player) => {
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {}
  };

  return {
    playClick: () => play(click),
    playTransform: () => play(transform),
    playTimeout: () => play(timeout),
    playReady: () => play(ready),
  };
}