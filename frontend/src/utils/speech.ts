/**
 * Speech synthesis and audio utilities for Vaani
 */

export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    voiceName?: string;
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  if (typeof window === 'undefined') return;

  const cleanText = text.replace(/[“""”]/g, '').trim();
  if (!cleanText) return;

  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options?.rate ?? 0.95;
      utterance.pitch = options?.pitch ?? 1.05;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to pick a pleasant natural English voice
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))
        );
        if (preferred) {
          utterance.voice = preferred;
        }
      }

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        options?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback simulated duration
      options?.onStart?.();
      setTimeout(() => {
        options?.onEnd?.();
      }, 2000);
    }
  } catch {
    // If blocked in sandboxed iframe, gracefully simulate onStart and onEnd
    options?.onStart?.();
    setTimeout(() => {
      options?.onEnd?.();
    }, 2000);
  }
}
