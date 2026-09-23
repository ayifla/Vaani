import { extractFeatures, type HandData } from "./preprocessing";
import { loadVaaniModel, predictSign } from "./model";

const SEQUENCE_LENGTH = 32;

export const SIGN_LABELS = [
  "bad", "computer", "drink", "eat", "family",
  "finish", "friend", "go", "good", "hello",
  "help", "home", "how", "like", "mother",
  "name", "need", "no", "please", "school",
  "sorry", "study", "want", "water", "what",
  "where", "who", "work", "yes", "you"
];

export interface SignPrediction {
  label: string;
  confidence: number;
  classIndex: number;
  probabilities: number[];
}

export class VaaniRecognitionPipeline {
  private sequence: number[][] = [];
  private predicting = false;

  constructor(
    private onPrediction: (result: SignPrediction) => void
  ) {}

  // Initialize the trained model.
  async initialize() {
    await loadVaaniModel();
    console.log("Vaani recognition pipeline ready!");
  }

  // Accept landmarks from MediaPipe or recorded test data.
  async addHands(hands: HandData[]) {
    if (hands.length === 0) {
      this.sequence = [];
      return;
    }

    const features = extractFeatures(hands);

    if (features.length !== 126) {
      throw new Error("Invalid landmark feature count");
    }

    this.sequence.push(features);

    if (this.sequence.length > SEQUENCE_LENGTH) {
      this.sequence.shift();
    }

    if (
      this.sequence.length === SEQUENCE_LENGTH &&
      !this.predicting
    ) {
      await this.runPrediction();
    }
  }

  private async runPrediction() {
    this.predicting = true;

    try {
      const probabilities = await predictSign(
        this.sequence.map((frame) => [...frame])
      );

      if (probabilities.length !== SIGN_LABELS.length) {
        throw new Error("Model output does not match labels");
      }

      const confidence = Math.max(...probabilities);
      const classIndex = probabilities.indexOf(confidence);
      const label = SIGN_LABELS[classIndex];

      const result: SignPrediction = {
        label,
        confidence,
        classIndex,
        probabilities,
      };

      console.log("Vaani prediction:", result);

      this.onPrediction(result);
    } finally {
      this.predicting = false;
    }
  }

  reset() {
    this.sequence = [];
  }

  getProgress() {
    return this.sequence.length;
  }
}