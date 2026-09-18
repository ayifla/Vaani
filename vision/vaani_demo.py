import cv2
import time
import requests

from lstm_recognizer import VaaniLSTMRecognizer


API_URL = "http://127.0.0.1:8000/translate"

MIN_CONFIDENCE = 0.50
STABLE_FRAMES = 5
SIGN_COOLDOWN = 1.5


def translate_signs(signs):
    print()
    print("=" * 60)
    print("SENDING SIGNS TO VAANI GENAI")
    print("=" * 60)
    print("Signs:", signs)

    try:
        response = requests.post(
            API_URL,
            json={"signs": signs},
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        print()
        print("CONTEXT:", data.get("context"))
        print()
        print("GENERATED SENTENCE:")
        print(data.get("sentence"))
        print()
        print("VALIDATION:")
        print(data.get("validation"))
        print("=" * 60)

        return data

    except Exception as e:
        print()
        print("❌ Translation request failed:")
        print(e)
        print("=" * 60)

        return None


def main():

    print("=" * 60)
    print("VAANI — LIVE ASL → ENGLISH DEMO")
    print("=" * 60)
    print()
    print("Sign one word at a time.")
    print("Hold each sign steady for a few seconds.")
    print()
    print("Example:")
    print("    WANT → HELP")
    print()
    print("R = reset current sign")
    print("C = clear sentence")
    print("T = translate current sentence")
    print("Q = quit")
    print("=" * 60)

    recognizer = VaaniLSTMRecognizer()

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("❌ Could not open camera.")
        recognizer.close()
        return

    recorded = []

    candidate = None
    candidate_count = 0

    last_recorded = None
    last_record_time = 0

    while True:

        ok, frame = camera.read()

        if not ok:
            print("❌ Could not read camera.")
            break

        # Give original frame to MediaPipe/LSTM.
        recognizer.add_frame(frame)

        label = recognizer.stable_label
        confidence = recognizer.stable_confidence
        hands = recognizer.hand_count
        progress = len(recognizer.sequence)

        display = cv2.flip(frame, 1)

        # ----------------------------------------------------
        # Stability
        # ----------------------------------------------------

        if label and confidence >= MIN_CONFIDENCE:

            if label == candidate:
                candidate_count += 1
            else:
                candidate = label
                candidate_count = 1

        else:
            candidate = None
            candidate_count = 0

        # ----------------------------------------------------
        # Accept sign
        # ----------------------------------------------------

        now = time.time()

        if (
            candidate
            and candidate_count >= STABLE_FRAMES
            and confidence >= MIN_CONFIDENCE
            and candidate != last_recorded
            and now - last_record_time >= SIGN_COOLDOWN
        ):

            recorded.append(candidate)

            last_recorded = candidate
            last_record_time = now

            print(
                f"✅ SIGN RECORDED: "
                f"{candidate.upper()} "
                f"({confidence:.0%})"
            )

            print(
                "CURRENT SEQUENCE:",
                " → ".join(recorded)
            )

            recognizer.reset()

            candidate = None
            candidate_count = 0

        # ----------------------------------------------------
        # Display
        # ----------------------------------------------------

        cv2.putText(
            display,
            "VAANI",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (0, 255, 255),
            2,
        )

        cv2.putText(
            display,
            f"Hands: {hands}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
        )

        cv2.putText(
            display,
            f"Frames: {progress}/32",
            (20, 115),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
        )

        current = label.upper() if label else "WAITING"

        cv2.putText(
            display,
            f"Current: {current}",
            (20, 155),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2,
        )

        cv2.putText(
            display,
            f"Confidence: {confidence:.0%}",
            (20, 190),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
        )

        sequence_text = (
            " → ".join(recorded).upper()
            if recorded
            else "NONE"
        )

        cv2.putText(
            display,
            "SIGNS:",
            (20, 240),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (0, 255, 255),
            2,
        )

        cv2.putText(
            display,
            sequence_text[:45],
            (20, 280),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 255, 255),
            2,
        )

        cv2.putText(
            display,
            "T: TRANSLATE   R: RESET   C: CLEAR   Q: QUIT",
            (20, display.shape[0] - 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (255, 255, 255),
            2,
        )

        cv2.imshow(
            "Vaani — ASL to English",
            display
        )

        key = cv2.waitKey(1) & 0xFF

        # ----------------------------------------------------
        # Controls
        # ----------------------------------------------------

        if key == ord("r"):

            recognizer.reset()

            candidate = None
            candidate_count = 0

            print("🔄 Current sign reset.")

        elif key == ord("c"):

            recorded.clear()

            last_recorded = None
            last_record_time = 0

            recognizer.reset()

            candidate = None
            candidate_count = 0

            print("🧹 Complete sequence cleared.")

        elif key == ord("t"):

            if recorded:
                translate_signs(recorded)
            else:
                print("No signs recorded yet.")

        elif key == ord("q"):
            break

    camera.release()
    cv2.destroyAllWindows()
    recognizer.close()

    print()
    print("=" * 60)
    print("VAANI DEMO FINISHED")
    print("=" * 60)

    if recorded:
        print(
            "Final signs:",
            " → ".join(recorded).upper()
        )


if __name__ == "__main__":
    main()
