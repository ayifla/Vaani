import cv2
import mediapipe as mp
from pathlib import Path


class HandDetector:

    def __init__(self):

        # Locate the MediaPipe model
        model_path = Path(__file__).parent / "hand_landmarker.task"

        print(f"Loading model from: {model_path}")

        # Create MediaPipe Hand Landmarker
        self.detector = (
            mp.tasks.vision.HandLandmarker
            .create_from_model_path(str(model_path))
        )

        print("✅ MediaPipe Hand Landmarker loaded!")

    def detect(self, frame):

        # OpenCV: BGR
        # MediaPipe: RGB
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        # Create MediaPipe image
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame
        )

        # Detect hands
        results = self.detector.detect(mp_image)

        # Number of detected hands
        hand_count = len(results.hand_landmarks)

        # Display detection status
        cv2.putText(
            frame,
            f"Hands detected: {hand_count}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        # Draw landmarks
        for hand in results.hand_landmarks:

            h, w, _ = frame.shape

            # Draw 21 landmark points
            for landmark in hand:

                x = int(landmark.x * w)
                y = int(landmark.y * h)

                cv2.circle(
                    frame,
                    (x, y),
                    6,
                    (0, 255, 0),
                    -1
                )

            # Connections between landmarks
            connections = [
                (0, 1), (1, 2), (2, 3), (3, 4),
                (0, 5), (5, 6), (6, 7), (7, 8),
                (5, 9), (9, 10), (10, 11), (11, 12),
                (9, 13), (13, 14), (14, 15), (15, 16),
                (13, 17), (17, 18), (18, 19), (19, 20),
                (0, 17)
            ]

            for start, end in connections:

                x1 = int(hand[start].x * w)
                y1 = int(hand[start].y * h)

                x2 = int(hand[end].x * w)
                y2 = int(hand[end].y * h)

                cv2.line(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

        return frame, results.hand_landmarks