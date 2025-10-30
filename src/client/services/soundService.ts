// Sound Service for Game Audio Effects
// Manages all sound effects and audio feedback using actual audio files

export class SoundService {
  private static audioContext: AudioContext | null = null;
  private static sounds: Map<string, AudioBuffer> = new Map();
  private static isEnabled = true;
  private static volume = 0.3;

  // Map sound names to actual audio files
  private static soundFiles = {
    click: '/assets/mixkit-game-click-1114.wav',
    enter: '/assets/mixkit-cool-interface-click-tone-2568.wav',
    success: '/assets/mixkit-quick-win-video-game-notification-269.wav',
    failure: '/assets/mixkit-player-losing-or-failing-2042.wav',
    hint: '/assets/mixkit-shop-scanner-beeps-1073.wav',
    celebration: '/assets/mixkit-fantasy-game-success-notification-270.wav',
    button: '/assets/mixkit-cool-interface-click-tone-2568.wav',
    correct: '/assets/mixkit-quick-win-video-game-notification-269.wav',
    wrong: '/assets/mixkit-click-error-1110.wav',
    newQuiz: '/assets/mixkit-alarm-clock-beep-988.wav'
  };

  // Initialize audio context
  static async initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadSounds();
      console.log('🔊 Sound system initialized with audio files');
    } catch (error) {
      console.warn('Sound system initialization failed:', error);
    }
  }

  // Load all sound effects from audio files
  static async loadSounds() {
    for (const [name, filePath] of Object.entries(this.soundFiles)) {
      try {
        const buffer = await this.loadAudioFile(filePath);
        this.sounds.set(name, buffer);
        console.log(`✅ Loaded ${name} sound from ${filePath}`);
      } catch (error) {
        console.warn(`Failed to load ${name} sound from ${filePath}:`, error);
        // Fallback to generated sound if file loading fails
        try {
          const fallbackBuffer = await this.generateFallbackSound(name);
          this.sounds.set(name, fallbackBuffer);
          console.log(`🔄 Using fallback sound for ${name}`);
        } catch (fallbackError) {
          console.warn(`Failed to generate fallback for ${name}:`, fallbackError);
        }
      }
    }
  }

  // Load audio file and decode it
  static async loadAudioFile(filePath: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio file: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  // Generate fallback sound if audio file fails to load
  static async generateFallbackSound(soundName: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Simple fallback sounds based on type
    let frequency = 440;
    let envelope = (t: number) => Math.exp(-t * 5);

    switch (soundName) {
      case 'click':
      case 'button':
        frequency = 800;
        break;
      case 'success':
      case 'correct':
      case 'celebration':
        frequency = 880;
        break;
      case 'failure':
      case 'wrong':
        frequency = 220;
        break;
      case 'hint':
        frequency = 1200;
        break;
      case 'enter':
      case 'newQuiz':
        frequency = 1000;
        break;
    }

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope(t) * 0.3;
    }

    return buffer;
  }

  // Play a sound effect
  static play(soundName: string, volumeMultiplier: number = 1) {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return;
    }

    try {
      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = this.volume * volumeMultiplier;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.warn(`Failed to play ${soundName}:`, error);
    }
  }



  // Control methods
  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  static setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  static getEnabled(): boolean {
    return this.isEnabled;
  }

  static getVolume(): number {
    return this.volume;
  }

  // Resume audio context (required for user interaction)
  static async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}
