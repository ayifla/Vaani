import { VaaniHandTracker } from "./mediapipe";
import {
  VaaniRecognitionPipeline,
  type SignPrediction,
} from "./pipeline";

export class VaaniRecognitionController {
  private tracker: VaaniHandTracker;
  private pipeline: VaaniRecognitionPipeline;
  private processing = false;
  private closed = false;

  constructor(
    onPrediction: (result: SignPrediction) => void,
    private onError: (error: Error) => void = console.error
  ) {
    this.pipeline = new VaaniRecognitionPipeline(onPrediction);

    this.tracker = new VaaniHandTracker((hands) => {
      if (this.closed) return;

      // Send detected landmarks through preprocessing
      // and into the 32-frame recognition pipeline.
      void this.pipeline.addHands(hands).catch(this.onError);
    });
  }

  // Load the TensorFlow.js model before processing frames.
  async initialize(): Promise<void> {
    await this.pipeline.initialize();
  }

  // Process one video frame using MediaPipe.
  // The recognition pipeline receives the detected hands
  // automatically through the tracker callback.
async processFrame(
  video: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<void> {
    if (this.processing || this.closed) return;

    this.processing = true;

    try {
      await this.tracker.processFrame(video);
    } catch (error) {
      this.onError(
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      this.processing = false;
    }
  }

  getProgress(): number {
    return this.pipeline.getProgress();
  }

  reset(): void {
    this.pipeline.reset();
  }

  async close(): Promise<void> {
    this.closed = true;
    this.pipeline.reset();
    await this.tracker.close();
  }
}