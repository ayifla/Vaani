from collections import deque
from pathlib import Path
import time

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf


# ============================================================
# VAANI V1 — LSTM LIVE RECOGNIZER
# MATCHES COLAB LANDMARK PREPROCESSING
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "vaani_v1_lstm_augmented.keras"
)

HAND_MODEL_PATH = (
    Path(__file__).resolve().parent
    / "hand_landmarker.task"
)


# IMPORTANT:
# Exact class order used during Vaani V1 training.
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


SEQUENCE_LENGTH = 32


# Keep this reasonably low for webcam testing.
CONFIDENCE_THRESHOLD = 0.35


SMOOTHING_WINDOW = 5


STABLE_COUNT_REQUIRED = 3


# ============================================================
# RECOGNIZER
# ============================================================

class VaaniLSTMRecognizer:

    def __init__(self):

        print("=" * 70)
        print("VAANI V1 — LSTM LIVE RECOGNIZER")
        print("=" * 70)

        # ----------------------------------------------------
        # Load LSTM
        # ----------------------------------------------------

        if not MODEL_PATH.exists():

            raise FileNotFoundError(
                f"LSTM model not found:\n{MODEL_PATH}"
            )

        print("\nLoading LSTM model...")

        self.model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False
        )

        print("✅ LSTM model loaded")

        # ----------------------------------------------------
        # Load MediaPipe Hand Landmarker
        # ----------------------------------------------------

        if not HAND_MODEL_PATH.exists():

            raise FileNotFoundError(
                f"Hand Landmarker model not found:\n"
                f"{HAND_MODEL_PATH}"
            )

        print("\nLoading MediaPipe Hand Landmarker...")

        base_options = mp.tasks.BaseOptions(
            model_asset_path=str(HAND_MODEL_PATH)
        )

        options = mp.tasks.vision.HandLandmarkerOptions(
            base_options=base_options,
            running_mode=mp.tasks.vision.RunningMode.VIDEO,
            num_hands=2,

            # Match the Colab test configuration.
            min_hand_detection_confidence=0.35,
            min_hand_presence_confidence=0.35,
            min_tracking_confidence=0.35,
        )

        self.detector = (
            mp.tasks.vision.HandLandmarker
            .create_from_options(options)
        )

        print("✅ MediaPipe Hand Landmarker loaded")

        # ----------------------------------------------------
        # Sequence
        # ----------------------------------------------------

        self.sequence = deque(
            maxlen=SEQUENCE_LENGTH
        )

        self.prediction_history = deque(
            maxlen=SMOOTHING_WINDOW
        )

        # ----------------------------------------------------
        # Prediction state
        # ----------------------------------------------------

        self.stable_label = None
        self.stable_confidence = 0.0

        self.raw_label = None
        self.raw_confidence = 0.0

        self.candidate_label = None
        self.candidate_count = 0

        self.hand_count = 0

        # ----------------------------------------------------
        # Missing-hand handling
        # ----------------------------------------------------

        self.missed_hand_frames = 0

        self.max_missed_hand_frames = 8

        self.last_features = None

        # ----------------------------------------------------
        # Timestamp
        # ----------------------------------------------------

        self.start_time = time.monotonic()

        print("\n" + "=" * 70)
        print("✅ VAANI RECOGNIZER READY")
        print("=" * 70)

    # ========================================================
    # COLAB-COMPATIBLE HAND NORMALIZATION
    # ========================================================

    def normalize_hand(self, hand_landmarks):

        """
        EXACT preprocessing used by the Vaani Colab
        landmark pipeline.

        21 landmarks
            ↓
        x/y/z
            ↓
        wrist becomes origin
            ↓
        scale using wrist → middle MCP
            ↓
        63 normalized features
        """

        points = np.array(
            [
                [
                    lm.x,
                    lm.y,
                    lm.z
                ]
                for lm in hand_landmarks
            ],
            dtype=np.float32
        )

        if points.shape != (21, 3):

            raise ValueError(
                f"Expected hand shape (21,3), "
                f"got {points.shape}"
            )

        # ----------------------------------------------------
        # EXACT COLAB STEP 1:
        # Make wrist the origin.
        # ----------------------------------------------------

        wrist = points[0].copy()

        points = points - wrist

        # ----------------------------------------------------
        # EXACT COLAB STEP 2:
        # Scale using wrist -> middle MCP.
        #
        # Landmark 9 = middle finger MCP.
        # ----------------------------------------------------

        scale = np.linalg.norm(
            points[9]
        )

        if scale > 1e-6:

            points = points / scale

        # ----------------------------------------------------
        # 21 × 3 = 63
        # ----------------------------------------------------

        return points.reshape(-1).astype(
            np.float32
        )

    # ========================================================
    # CREATE 126 FEATURES
    # ========================================================

    def extract_features(self, results):

        left_features = np.zeros(
            63,
            dtype=np.float32
        )

        right_features = np.zeros(
            63,
            dtype=np.float32
        )

        for hand_idx, hand_landmarks in enumerate(
            results.hand_landmarks
        ):

            features = self.normalize_hand(
                hand_landmarks
            )

            # ------------------------------------------------
            # Match Colab handedness logic.
            # ------------------------------------------------

            if hand_idx < len(
                results.handedness
            ):

                category = results.handedness[
                    hand_idx
                ][0]

                handedness_name = (
                    category.category_name
                )

                if (
                    handedness_name.lower()
                    == "left"
                ):

                    left_features = features

                elif (
                    handedness_name.lower()
                    == "right"
                ):

                    right_features = features

                else:

                    # Same fallback idea as Colab.
                    if not np.any(
                        left_features
                    ):

                        left_features = features

                    else:

                        right_features = features

        # ----------------------------------------------------
        # EXACT FEATURE ORDER:
        #
        # LEFT 63 + RIGHT 63 = 126
        # ----------------------------------------------------

        frame_features = np.concatenate(
            [
                left_features,
                right_features
            ]
        )

        if frame_features.shape != (126,):

            raise ValueError(
                "Invalid feature shape: "
                f"{frame_features.shape}"
            )

        return frame_features.astype(
            np.float32
        )

    # ========================================================
    # ADD ONE CAMERA FRAME
    # ========================================================

    def add_frame(self, frame):

        # ----------------------------------------------------
        # BGR → RGB
        # ----------------------------------------------------

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame
        )

        # ----------------------------------------------------
        # MediaPipe VIDEO mode timestamp
        # ----------------------------------------------------

        timestamp_ms = int(
            (
                time.monotonic()
                - self.start_time
            )
            * 1000
        )

        results = self.detector.detect_for_video(
            mp_image,
            timestamp_ms
        )

        self.hand_count = len(
            results.hand_landmarks
        )

        # ====================================================
        # NO HAND
        # ====================================================

        if self.hand_count == 0:

            self.missed_hand_frames += 1

            # Brief detection loss:
            # preserve the current sequence.
            if (
                self.last_features is not None
                and self.missed_hand_frames
                <= self.max_missed_hand_frames
            ):

                self.sequence.append(
                    self.last_features.copy()
                )

                return {
                    "label": self.stable_label,
                    "confidence": self.stable_confidence,
                    "raw_label": self.raw_label,
                    "raw_confidence": self.raw_confidence,
                    "hands": 0,
                    "ready": (
                        len(self.sequence)
                        >= SEQUENCE_LENGTH
                    ),
                    "progress": len(self.sequence),
                    "temporary_loss": True,
                }

            # ------------------------------------------------
            # Long absence:
            # start a fresh sign.
            # ------------------------------------------------

            self.sequence.clear()

            self.prediction_history.clear()

            self.stable_label = None
            self.stable_confidence = 0.0

            self.raw_label = None
            self.raw_confidence = 0.0

            self.candidate_label = None
            self.candidate_count = 0

            self.last_features = None

            return {
                "label": None,
                "confidence": 0.0,
                "raw_label": None,
                "raw_confidence": 0.0,
                "hands": 0,
                "ready": False,
                "progress": 0,
                "temporary_loss": False,
            }

        # ====================================================
        # HAND DETECTED
        # ====================================================

        self.missed_hand_frames = 0

        frame_features = self.extract_features(
            results
        )

        self.last_features = (
            frame_features.copy()
        )

        self.sequence.append(
            frame_features
        )

        # ====================================================
        # WAIT FOR 32 FRAMES
        # ====================================================

        if len(self.sequence) < SEQUENCE_LENGTH:

            return {
                "label": None,
                "confidence": 0.0,
                "raw_label": None,
                "raw_confidence": 0.0,
                "hands": self.hand_count,
                "ready": False,
                "progress": len(self.sequence),
            }

        # ====================================================
        # LSTM
        # ====================================================

        sequence_array = np.asarray(
            self.sequence,
            dtype=np.float32
        )

        batch = np.expand_dims(
            sequence_array,
            axis=0
        )

        probabilities = self.model.predict(
            batch,
            verbose=0
        )[0]

        prediction_index = int(
            np.argmax(probabilities)
        )

        raw_confidence = float(
            probabilities[prediction_index]
        )

        raw_label = LABELS[
            prediction_index
        ]

        self.raw_label = raw_label
        self.raw_confidence = raw_confidence

        # ====================================================
        # TEMPORAL SMOOTHING
        # ====================================================

        self.prediction_history.append(
            (
                raw_label,
                raw_confidence
            )
        )

        # ----------------------------------------------------
        # Low confidence
        # ----------------------------------------------------

        if (
            raw_confidence
            < CONFIDENCE_THRESHOLD
        ):

            self.candidate_label = None
            self.candidate_count = 0

            return {
                "label": self.stable_label,
                "confidence": self.stable_confidence,
                "raw_label": raw_label,
                "raw_confidence": raw_confidence,
                "hands": self.hand_count,
                "ready": True,
                "progress": len(self.sequence),
                "low_confidence": True,
            }

        # ----------------------------------------------------
        # Majority vote
        # ----------------------------------------------------

        valid_labels = [
            label
            for label, confidence
            in self.prediction_history
            if confidence
            >= CONFIDENCE_THRESHOLD
        ]

        if valid_labels:

            counts = {}

            for label in valid_labels:

                counts[label] = (
                    counts.get(label, 0)
                    + 1
                )

            majority_label = max(
                counts,
                key=counts.get
            )

        else:

            majority_label = raw_label

        # ----------------------------------------------------
        # Stability
        # ----------------------------------------------------

        if (
            majority_label
            == self.candidate_label
        ):

            self.candidate_count += 1

        else:

            self.candidate_label = (
                majority_label
            )

            self.candidate_count = 1

        if (
            self.candidate_count
            >= STABLE_COUNT_REQUIRED
        ):

            self.stable_label = (
                majority_label
            )

            matching_confidences = [
                confidence
                for label, confidence
                in self.prediction_history
                if label == majority_label
            ]

            if matching_confidences:

                self.stable_confidence = float(
                    np.mean(
                        matching_confidences
                    )
                )

            else:

                self.stable_confidence = (
                    raw_confidence
                )

        return {
            "label": self.stable_label,
            "confidence": self.stable_confidence,
            "raw_label": raw_label,
            "raw_confidence": raw_confidence,
            "hands": self.hand_count,
            "ready": True,
            "progress": len(self.sequence),
            "low_confidence": False,
        }

    # ========================================================
    # RESET
    # ========================================================

    def reset(self):

        self.sequence.clear()

        self.prediction_history.clear()

        self.stable_label = None
        self.stable_confidence = 0.0

        self.raw_label = None
        self.raw_confidence = 0.0

        self.candidate_label = None
        self.candidate_count = 0

        self.hand_count = 0

        self.missed_hand_frames = 0

        self.last_features = None

    # ========================================================
    # CLOSE
    # ========================================================

    def close(self):

        if self.detector is not None:

            self.detector.close()
