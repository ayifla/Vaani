import * as tf from "@tensorflow/tfjs";

let cachedModel: tf.LayersModel | null = null;

const MODEL_PATH = "/models/vaani/";

export async function loadVaaniModel(): Promise<tf.LayersModel> {
  if (cachedModel) return cachedModel;

  console.log("Loading Vaani V2 model...");

  const response = await fetch(`${MODEL_PATH}model.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch Vaani model");
  }

  const modelJSON = await response.json();

  // Fix Keras 3 InputLayer compatibility.
  const layers =
    modelJSON.modelTopology.model_config.config.layers;

  if (layers[0].config.batch_shape) {
    layers[0].config.batch_input_shape =
      layers[0].config.batch_shape;

    delete layers[0].config.batch_shape;
  }

  const weightSpecs: tf.io.WeightsManifestEntry[] = [];
  const weightBuffers: ArrayBuffer[] = [];

  // Fix Keras 3 weight naming.
  const names: Record<string, string> = {
    forward_lstm: "bidirectional/forward_forward_lstm",
    backward_lstm: "bidirectional/backward_forward_lstm",
    forward_lstm_1: "bidirectional_1/forward_forward_lstm_1",
    backward_lstm_1: "bidirectional_1/backward_forward_lstm_1",
  };

  for (const group of modelJSON.weightsManifest) {
    for (const original of group.weights) {
      const weight = { ...original };
      const parts = weight.name.split("/");

      if (names[parts[0]]) {
        weight.name =
          names[parts[0]] +
          "/" +
          parts.slice(2).join("/");
      }

      weightSpecs.push(weight);
    }

    for (const file of group.paths) {
      const weightResponse = await fetch(MODEL_PATH + file);

      if (!weightResponse.ok) {
        throw new Error(`Failed to fetch ${file}`);
      }

      weightBuffers.push(await weightResponse.arrayBuffer());
    }
  }

  const totalBytes = weightBuffers.reduce(
    (sum, buffer) => sum + buffer.byteLength,
    0
  );

  const combined = new Uint8Array(totalBytes);
  let offset = 0;

  for (const buffer of weightBuffers) {
    combined.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  const model = await tf.loadLayersModel(
    tf.io.fromMemory({
      modelTopology: modelJSON.modelTopology,
      weightSpecs,
      weightData: combined.buffer,
    })
  );

  cachedModel = model;

  console.log("Vaani V2 model loaded successfully!");

  return model;
}

// Predict using 32 frames with 126 features each.
export async function predictSign(
  sequence: number[][]
): Promise<number[]> {
  if (sequence.length !== 32) {
    throw new Error("Expected exactly 32 frames");
  }

  if (sequence.some((frame) => frame.length !== 126)) {
    throw new Error("Each frame must contain 126 features");
  }

  const model = await loadVaaniModel();

  const input = tf.tensor3d([sequence], [1, 32, 126]);

  try {
    const prediction = model.predict(input) as tf.Tensor;
    try {
      return Array.from(await prediction.data());
    } finally {
      prediction.dispose();
    }
  } finally {
    input.dispose();
  }
}