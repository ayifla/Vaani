import cv2
import time
from lstm_recognizer import VaaniLSTMRecognizer

MIN_CONFIDENCE = 0.45
STABLE_FRAMES = 4
SIGN_COOLDOWN = 1.5

recognizer = VaaniLSTMRecognizer()

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("ERROR: Could not open camera.")
    recognizer.close()
    raise SystemExit(1)

recorded = []
last_recorded = None
last_record_time = 0

stable_label_seen = None
stable_count = 0

print()
print("=" * 60)
print("VAANI - MULTI-SIGN DEMO")
print("=" * 60)
print("Sign ONE word at a time.")
print("Hold the sign steady for a few seconds.")
print()
print("Example:")
print("    WANT -> HELP -> COMPUTER")
print()
print("R = reset current sign")
print("C = clear complete sequence")
print("Q = quit")
print("=" * 60)
print()

while True:

    ok, frame = cap.read()

    if not ok:
        print("ERROR: Could not read camera frame.")
        break

    # IMPORTANT:
    # Give the ORIGINAL camera frame to MediaPipe.
    # Only mirror the frame for display.
    recognizer.add_frame(frame)

    label = recognizer.stable_label
    confidence = recognizer.stable_confidence
    hands = recognizer.hand_count
    sequence_length = len(recognizer.sequence)

    display = cv2.flip(frame, 1)

    # ---------------------------------------------------------
    # Stability tracking
    # ---------------------------------------------------------

    if label and confidence >= MIN_CONFIDENCE:

        if label == stable_label_seen:
            stable_count += 1
        else:
            stable_label_seen = label
            stable_count = 1

    else:
        stable_label_seen = None
        stable_count = 0

    # ---------------------------------------------------------
    # Record a sign
    # ---------------------------------------------------------

    now = time.time()

    if (
        stable_label_seen
        and stable_count >= STABLE_FRAMES
        and confidence >= MIN_CONFIDENCE
        and stable_label_seen != last_recorded
        and now - last_record_time >= SIGN_COOLDOWN
    ):

        recorded.append(stable_label_seen)

        last_recorded = stable_label_seen
        last_record_time = now

        print()
        print(f"✅ RECORDED: {stable_label_seen.upper()}")
        print(f"   SEQUENCE: {' -> '.join(recorded)}")

        # Start a fresh 32-frame window for the next sign.
        recognizer.reset()

        stable_label_seen = None
        stable_count = 0

    # ---------------------------------------------------------
    # UI
    # ---------------------------------------------------------

    cv2.putText(
        display,
        f"HANDS: {hands}",
        (20, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 255, 0),
        2,
    )

    cv2.putText(
        display,
        f"FRAMES: {sequence_length}/32",
        (20, 70),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 255, 0),
        2,
    )

    current = label.upper() if label else "WAITING..."

    cv2.putText(
        display,
        f"CURRENT: {current}",
        (20, 110),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.85,
        (255, 255, 255),
        2,
    )

    cv2.putText(
        display,
        f"CONFIDENCE: {confidence:.0%}",
        (20, 145),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.70,
        (255, 255, 255),
        2,
    )

    # Recorded sequence
    cv2.putText(
        display,
        "RECORDED:",
        (20, 195),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 255, 255),
        2,
    )

    sequence_text = " -> ".join(recorded) if recorded else "None"

    # Break long sequence into lines
    words = sequence_text.split(" -> ")

    line = ""
    y = 235

    for word in words:

        candidate = word if not line else line + " -> " + word

        if len(candidate) > 35:

            cv2.putText(
                display,
                line.upper(),
                (20, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (0, 255, 255),
                2,
            )

            y += 32
            line = word

        else:
            line = candidate

    if line:

        cv2.putText(
            display,
            line.upper(),
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 255, 255),
            2,
        )

    cv2.putText(
        display,
        "R: RESET   C: CLEAR   Q: QUIT",
        (20, display.shape[0] - 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.60,
        (255, 255, 255),
        2,
    )

    cv2.imshow("Vaani - Multi Sign Demo", display)

    key = cv2.waitKey(1) & 0xFF

    # Reset current sign
    if key == ord("r"):

        recognizer.reset()

        stable_label_seen = None
        stable_count = 0

        print("Current sign reset.")

    # Clear complete sequence
    elif key == ord("c"):

        recorded.clear()

        last_recorded = None
        last_record_time = 0

        recognizer.reset()

        stable_label_seen = None
        stable_count = 0

        print("Complete sequence cleared.")

    # Quit
    elif key == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()
recognizer.close()

print()
print("=" * 60)
print("FINAL VAANI SEQUENCE")
print("=" * 60)

if recorded:
    print(" -> ".join(recorded).upper())
else:
    print("No signs recorded.")

print("=" * 60)
