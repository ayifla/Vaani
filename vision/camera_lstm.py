import cv2
import json
from pathlib import Path

from lstm_recognizer import VaaniLSTMRecognizer


# Same file the FastAPI /detect endpoint reads.
SEQUENCE_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "current_sequence.json"
)

# Max recognized words to keep in one sequence before it's sent
# to the reconstruction agent.
MAX_SEQUENCE_LENGTH = 10


class LSTMSequenceBuffer:
    """
    Wraps VaaniLSTMRecognizer's stable-label output and turns it
    into a growing list of recognized words, the same shape
    camera.py used to produce for current_sequence.json.
    """

    def __init__(self):
        self.sequence = []
        self.last_recorded_label = None

    def update(self, result):
        """
        result is the dict returned by recognizer.add_frame(frame):
        {"label": ..., "confidence": ..., "ready": ..., ...}
        """

        label = result.get("label")

        # No stable label yet, or hand missing -> nothing to record.
        if not label:
            # Hand fully gone (not just a brief flicker) resets
            # so the same sign can be recorded again next time.
            if result.get("hands", 0) == 0 and not result.get(
                "temporary_loss", False
            ):
                self.last_recorded_label = None
            return

        # Only record when the stable label changes, so holding
        # the same sign doesn't create duplicate entries.
        if label != self.last_recorded_label:
            self.sequence.append(label)
            self.last_recorded_label = label

            print(f"Recognized: {label}")

            if len(self.sequence) > MAX_SEQUENCE_LENGTH:
                self.sequence.pop(0)

    def clear(self):
        self.sequence = []
        self.last_recorded_label = None
        print("Sequence cleared.")

    def save(self):
        SEQUENCE_FILE.parent.mkdir(parents=True, exist_ok=True)

        with open(SEQUENCE_FILE, "w") as file:
            json.dump({"sequence": self.sequence}, file, indent=4)

        print("Sequence saved:", " -> ".join(self.sequence))


def start_camera():

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("Could not access the camera.")
        return

    recognizer = VaaniLSTMRecognizer()
    buffer = LSTMSequenceBuffer()

    print("===================================")
    print("        Vaani LSTM Camera")
    print("===================================")
    print("Show signs one at a time. Hold each sign steady.")
    print()
    print("Controls:")
    print("  C = Clear sequence")
    print("  S = Save sequence")
    print("  Q = Quit")
    print("===================================")

    while True:

        success, frame = camera.read()

        if not success:
            print("Could not read camera frame.")
            break

        frame = cv2.flip(frame, 1)

        result = recognizer.add_frame(frame)

        buffer.update(result)

        # -------------------------------------
        # DISPLAY CURRENT PREDICTION
        # -------------------------------------

        current_label = result.get("label") or "..."
        confidence = result.get("confidence", 0.0)

        cv2.putText(
            frame,
            f"Current: {current_label} ({confidence:.2f})",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 255, 0),
            2,
        )

        cv2.putText(
            frame,
            "Sequence:",
            (20, 125),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )

        sequence_text = " -> ".join(buffer.sequence)

        cv2.putText(
            frame,
            sequence_text[-70:],
            (20, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2,
        )

        progress_text = (
            f"Frames buffered: {result.get('progress', 0)}/32  "
            f"Hands: {result.get('hands', 0)}"
        )

        cv2.putText(
            frame,
            progress_text,
            (20, 200),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2,
        )

        cv2.putText(
            frame,
            "C: Clear | S: Save | Q: Quit",
            (20, frame.shape[0] - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2,
        )

        cv2.imshow("Vaani - LSTM Sign Recognition", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("c"):
            buffer.clear()
            recognizer.reset()

        elif key == ord("s"):
            buffer.save()

        elif key == ord("q"):
            break

    recognizer.close()
    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    start_camera()
