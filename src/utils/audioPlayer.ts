// Browser audio helper for playing Gemini TTS base64 audio and managing speech

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private onStateChange: ((speaking: boolean) => void) | null = null;

  public subscribe(callback: (speaking: boolean) => void) {
    this.onStateChange = callback;
  }

  public playBase64Audio(base64Data: string, mimeType = 'audio/wav'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.stop();

        const audioUrl = `data:${mimeType};base64,${base64Data}`;
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        this.isSpeaking = true;
        this.onStateChange?.(true);

        audio.onended = () => {
          this.isSpeaking = false;
          this.currentAudio = null;
          this.onStateChange?.(false);
          resolve();
        };

        audio.onerror = (e) => {
          this.isSpeaking = false;
          this.currentAudio = null;
          this.onStateChange?.(false);
          reject(e);
        };

        audio.play().catch((err) => {
          this.isSpeaking = false;
          this.currentAudio = null;
          this.onStateChange?.(false);
          reject(err);
        });
      } catch (err) {
        this.isSpeaking = false;
        this.onStateChange?.(false);
        reject(err);
      }
    });
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio = null;
    }
    if (this.isSpeaking) {
      this.isSpeaking = false;
      this.onStateChange?.(false);
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const audioService = new AudioService();
