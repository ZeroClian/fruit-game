import { useAudioStore } from '../stores/audioStore';

export function useAudio() {
  const { musicEnabled, sfxEnabled, playSfx, playBgm, stopBgm, toggleMusic, toggleSfx } = useAudioStore();

  return {
    musicEnabled,
    sfxEnabled,
    playSfx: sfxEnabled ? playSfx : () => {},
    playBgm: musicEnabled ? playBgm : () => {},
    stopBgm,
    toggleMusic,
    toggleSfx,
  };
}
