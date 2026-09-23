export type Landmark = {
  x: number;
  y: number;
  z: number;
};

export type HandData = {
  landmarks: Landmark[];
  handedness: "Left" | "Right";
};

// Normalize 21 landmarks into 63 features.
export function normalizeHand(landmarks: Landmark[]): number[] {
  if (landmarks.length !== 21) {
    throw new Error("Expected exactly 21 hand landmarks");
  }

  const wrist = landmarks[0];

  const points = landmarks.map((point) => [
    point.x - wrist.x,
    point.y - wrist.y,
    point.z - wrist.z,
  ]);

  // Wrist-to-middle-finger MCP distance.
  const scale = Math.hypot(
    points[9][0],
    points[9][1],
    points[9][2]
  );

  const normalized = points.map((point) =>
    scale > 1e-6
      ? point.map((coordinate) => coordinate / scale)
      : point
  );

  return normalized.flat();
}

// Create 126 features: LEFT 63 + RIGHT 63.
export function extractFeatures(hands: HandData[]): number[] {
  let left = new Array<number>(63).fill(0);
  let right = new Array<number>(63).fill(0);

  for (const hand of hands) {
    const features = normalizeHand(hand.landmarks);

    if (hand.handedness === "Left") {
      left = features;
    } else if (hand.handedness === "Right") {
      right = features;
    }
  }

  return [...left, ...right];
}