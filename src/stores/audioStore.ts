import { create } from 'zustand';

interface AudioStore {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;

  toggleMusic: () => void;
  toggleSfx: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  playSfx: (id: string) => void;
  playBgm: (id: string) => void;
  stopBgm: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.7,

  toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),
  toggleSfx: () => set(state => ({ sfxEnabled: !state.sfxEnabled })),
  setMusicVolume: (volume: number) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
  setSfxVolume: (volume: number) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),

  // Stub implementations - will be replaced when audio files are available
  playSfx: (_id: string) => {
    const { sfxEnabled, sfxVolume } = get();
    if (!sfxEnabled) return;
    // TODO: Implement actual SFX playback with Howler
    console.log(`[SFX] play: ${_id}, volume: ${sfxVolume}`);
  },

  playBgm: (_id: string) => {
    const { musicEnabled, musicVolume } = get();
    if (!musicEnabled) return;
    // TODO: Implement actual BGM playback with Howler
    console.log(`[BGM] play: ${_id}, volume: ${musicVolume}`);
  },

  stopBgm: () => {
    // TODO: Implement actual BGM stop with Howler
    console.log('[BGM] stop');
  },
}));
