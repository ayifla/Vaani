import { Hands, type Results } from "@mediapipe/hands";
import type { HandData } from "./preprocessing";

export type LandmarkCallback = (
  hands: HandData[]
) => void;

export class VaaniHandTracker {
  private detector: Hands;
  private callback: LandmarkCallback;

  constructor(callback: LandmarkCallback) {
    this.callback = callback;

    this.detector = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.detector.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.35,
      minTrackingConfidence: 0.35,
    });

    this.detector.onResults((results: Results) => {
      const hands: HandData[] = [];

      const landmarks = results.multiHandLandmarks || [];
      const handedness = results.multiHandedness || [];

      landmarks.forEach((points, index) => {
        const label = handedness[index]?.label;

        if (label === "Left" || label === "Right") {
          hands.push({
            landmarks: points.map((point) => ({
              x: point.x,
              y: point.y,
              z: point.z,
            })),
            handedness: label,
          });
        }
      });

      this.callback(hands);
    });
  }

  async processFrame(video: HTMLVideoElement) {
    await this.detector.send({ image: video });
  }

  async close() {
    await this.detector.close();
  }
}