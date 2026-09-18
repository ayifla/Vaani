from collections import deque
from pathlib import Path
import time

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "vaani_v1_lstm_augmented.keras"
)

HAND_MODEL_PATH = (
    Path(__file__).resolve().parent
    / "hand_landmarker.task"
)

LABELS = [
    "help",
    "what",
    "who",
    "yes",
    "no",
    "like",
    "go",
    "drink",
    "computer",
    "family",
    "mother",
    "study",
    "work",
    "want",
    "finish",
]


def extract_landmarks(results):

    left_hand = None
    right_hand = None

    for i, hand_landmarks in enumerate(results.hand_landmarks):

        if i >= len(results.handedness):
            continue

        if not results.handedness[i]:
            continue

        hand_type = (
            results.handedness[i][0]
            .category_name
            .lower()
        )

        if hand_type == "left":
            left_hand = hand_landmarks

        elif hand_type == "right":
            right_hand = hand_landmarks

    empty = np.zeros(
        63,
        dtype=np.float32
    )

    if left_hand is not None:

        left = np.array(
            [
                [lm.x, lm.y, lm.z]
                for lm in left_hand
            ],
            dtype=np.float32
        ).flatten()

    else:

        left = empty.copy()

    if right_hand is not None:

        right = np.array(
            [
                [lm.x, lm.y, lm.z]
                for lm in right_hand
            ],
            dtype=np.float32
        ).flatten()

    else:

        right = empty.copy()

    return np.concatenate(
        [left, right]
    ).astype(np.float32)


def main():

    print("=" * 70)
    print("VAANI LSTM DIAGNOSTIC")
    print("=" * 70)

    print("This test does NOT record a sentence.")
    print("It only checks what the trained LSTM predicts.")
    print()
    print("Try YES, NO, HELP and WANT.")
    print("Hold each sign for 3-4 seconds.")
    print("Press R to clear the 32-frame window.")
    print("Press Q to quit.")
    print("=" * 70)

    print("\nLoading model...")

    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False
    )

    print("✅ LSTM loaded")

    base_options = mp.tasks.BaseOptions(
        model_asset_path=str(HAND_MODEL_PATH)
    )

    options = mp.tasks.vision.HandLandmarkerOptions(
        base_options=base_options,
        running_mode=mp.tasks.vision.RunningMode.VIDEO,
        num_hands=2,
        min_hand_detection_confidence=0.25,
        min_hand_presence_confidence=0.25,
        min_tracking_confidence=0.25,
    )

    detector = (
        mp.tasks.vision.HandLandmarker.create_from_options(
            options
        )
    )

    print("✅ MediaPipe loaded")

    sequence = deque(
        maxlen=32
    )

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():

        print("❌ Camera could not be opened.")
        detector.close()
        return

    start_time = time.monotonic()

    print("✅ Camera opened")

    last_print = 0

    try:

        while True:

            success, frame = camera.read()

            if not success:
                print("❌ Camera frame failed")
                break

            # ORIGINAL frame goes into MediaPipe.
            rgb = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )

            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=rgb
            )

            timestamp_ms = int(
                (time.monotonic() - start_time)
                * 1000
            )

            results = detector.detect_for_video(
                mp_image,
                timestamp_ms
            )

            hand_count = len(
                results.hand_landmarks
            )

            if hand_count > 0:

                features = extract_landmarks(
                    results
                )

                sequence.append(features)

            else:

                features = None

            display = cv2.flip(
                frame,
                1
            )

            cv2.putText(
                display,
                f"Hands: {hand_count}",
                (25, 45),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                (0, 255, 0),
                2
            )

            cv2.putText(
                display,
                f"Sequence: {len(sequence)}/32",
                (25, 90),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (255, 255, 0),
                2
            )

            if len(sequence) == 32:

                batch = np.expand_dims(
                    np.asarray(
                        sequence,
                        dtype=np.float32
                    ),
                    axis=0
                )

                probabilities = model.predict(
                    batch,
                    verbose=0
                )[0]

                top_indices = np.argsort(
                    probabilities
                )[::-1][:5]

                # Print top predictions every ~1 second.
                now = time.monotonic()

                if now - last_print > 1:

                    print("\n" + "-" * 50)

                    print(
                        "TOP 5 PREDICTIONS"
                    )

                    for rank, index in enumerate(
                        top_indices,
                        start=1
                    ):

                        print(
                            f"{rank}. "
                            f"{LABELS[index]:10s} "
                            f"{probabilities[index] * 100:.2f}%"
                        )

                    print(
                        "Feature shape:",
                        batch.shape
                    )

                    print(
                        "Feature min:",
                        float(batch.min())
                    )

                    print(
                        "Feature max:",
                        float(batch.max())
                    )

                    print(
                        "Feature mean:",
                        float(batch.mean())
                    )

                    last_print = now

                # Draw top predictions.
                y = 135

                for rank, index in enumerate(
                    top_indices,
                    start=1
                ):

                    text = (
                        f"{rank}. "
                        f"{LABELS[index].upper()} "
                        f"{probabilities[index] * 100:.1f}%"
                    )

                    cv2.putText(
                        display,
                        text,
                        (25, y),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (255, 255, 255),
                        2
                    )

                    y += 35

            cv2.putText(
                display,
                "R = reset   Q = quit",
                (
                    25,
                    display.shape[0] - 25
                ),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2
            )

            cv2.imshow(
                "Vaani - LSTM Diagnostic",
                display
            )

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break

            if key == ord("r"):

                sequence.clear()

                print(
                    "\n🔄 32-frame window cleared."
                )

    finally:

        camera.release()
        cv2.destroyAllWindows()
        detector.close()

        print("\n" + "=" * 70)
        print("DIAGNOSTIC FINISHED")
        print("=" * 70)


if __name__ == "__main__":
    main()
