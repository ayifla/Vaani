const tf = require("@tensorflow/tfjs");
const fs = require("fs");
const path = require("path");

async function testModel() {
  try {
    console.log("Loading Vaani V2 model...");

    const folder = path.join(__dirname, "public/models/vaani");

    const modelJSON = JSON.parse(
      fs.readFileSync(path.join(folder, "model.json"), "utf8")
    );
const layers = modelJSON.modelTopology.model_config.config.layers;

layers[0].config.batch_input_shape =
  layers[0].config.batch_shape;

delete layers[0].config.batch_shape;

    const weightSpecs = [];
    const weightBuffers = [];

    for (const group of modelJSON.weightsManifest) {
      weightSpecs.push(...group.weights);

      for (const file of group.paths) {
        weightBuffers.push(fs.readFileSync(path.join(folder, file)));
      }
    }
const names = {
  forward_lstm: "bidirectional/forward_forward_lstm",
  backward_lstm: "bidirectional/backward_forward_lstm",
  forward_lstm_1: "bidirectional_1/forward_forward_lstm_1",
  backward_lstm_1: "bidirectional_1/backward_forward_lstm_1"
};

for (const weight of weightSpecs) {
  const parts = weight.name.split("/");
  if (names[parts[0]]) {
    weight.name = names[parts[0]] + "/" + parts.slice(2).join("/");
  }
}

    const weights = Buffer.concat(weightBuffers);

    const model = await tf.loadLayersModel(
      tf.io.fromMemory({
        modelTopology: modelJSON.modelTopology,
        weightSpecs,
        weightData: Uint8Array.from(weights).buffer
      })
    );

    console.log("MODEL LOADED SUCCESSFULLY!");

    const input = tf.zeros([1, 32, 126]);

    const prediction = model.predict(input);
    const probabilities = await prediction.data();

    console.log("Output classes:", probabilities.length);
    console.log("Predicted class:", prediction.argMax(-1).dataSync()[0]);
    console.log("Confidence:", Math.max(...probabilities));

    input.dispose();
    prediction.dispose();
    model.dispose();

    console.log("TEST COMPLETE!");
  } catch (error) {
    console.error("TEST FAILED:", error);
    process.exitCode = 1;
  }
}

testModel();