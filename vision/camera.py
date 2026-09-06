import cv2
import json
from pathlib import Path

from landmarks import HandDetector
from recognizer import recognize_gesture


# File used to send the recognized sequence to Streamlit
SEQUENCE_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "current_sequence.json"
)


class SequenceBuffer:

    def __init__(self, stable_frames=12):

        # Number of consecutive frames required
        # before a gesture is considered stable
        self.stable_frames = stable_frames

        # Gesture currently being observed
        self.current_gesture = None

        # Number of consecutive frames
        # containing the current gesture
        self.frame_count = 0

        # Last gesture added to the sequence
        self.last_recorded_gesture = None

        # Complete gesture sequence
        self.sequence = []


    def update(self, gesture):

        """
        Add a gesture to the sequence only once
        after it becomes stable.

        Holding the same gesture will NOT create
        duplicate entries.
        """

        # Ignore unknown gestures
        if gesture in ["UNKNOWN", "NO HAND"]:

            self.current_gesture = None
            self.frame_count = 0

            # Removing the hand allows the same
            # gesture to be recorded again later.
            self.last_recorded_gesture = None

            return


        # -----------------------------------------
        # SAME GESTURE AS PREVIOUS FRAME
        # -----------------------------------------

        if gesture == self.current_gesture:

            self.frame_count += 1


        # -----------------------------------------
        # NEW GESTURE
        # -----------------------------------------

        else:

            self.current_gesture = gesture
            self.frame_count = 1


        # -----------------------------------------
        # CHECK IF GESTURE IS STABLE
        # -----------------------------------------

        if (
            self.frame_count >= self.stable_frames
            and gesture != self.last_recorded_gesture
        ):

            # Add gesture to sequence
            self.sequence.append(gesture)

            # Remember it so it isn't added again
            # while the user continues holding it
            self.last_recorded_gesture = gesture

            print(
                f"🤟 Gesture added: {gesture}"
            )

            # Reset frame counter
            self.frame_count = 0

            # Keep maximum 10 gestures
            if len(self.sequence) > 10:

                self.sequence.pop(0)


    def clear(self):

        """
        Clear the entire sequence.
        """

        self.sequence = []

        self.current_gesture = None

        self.frame_count = 0

        self.last_recorded_gesture = None

        print("🗑️ Sequence cleared.")


    def save(self):

        """
        Save the current gesture sequence
        so that Streamlit can read it.
        """

        # Make sure data folder exists
        SEQUENCE_FILE.parent.mkdir(
            parents=True,
            exist_ok=True
        )


        # Save sequence as JSON
        with open(
            SEQUENCE_FILE,
            "w"
        ) as file:

            json.dump(
                {
                    "sequence": self.sequence
                },
                file,
                indent=4
            )


        print(
            "💾 Sequence saved:",
            " → ".join(self.sequence)
        )


def start_camera():

    # -----------------------------------------
    # OPEN CAMERA
    # -----------------------------------------

    camera = cv2.VideoCapture(0)


    if not camera.isOpened():

        print(
            "❌ Could not access the camera."
        )

        return


    # -----------------------------------------
    # INITIALIZE MEDIAPIPE
    # -----------------------------------------

    detector = HandDetector()


    # -----------------------------------------
    # INITIALIZE SEQUENCE BUFFER
    # -----------------------------------------

    buffer = SequenceBuffer(
        stable_frames=12
    )


    # -----------------------------------------
    # START MESSAGE
    # -----------------------------------------

    print(
        "==================================="
    )

    print(
        "        🤟 SignaAI Camera"
    )

    print(
        "==================================="
    )

    print(
        "Show gestures one at a time."
    )

    print()

    print(
        "Controls:"
    )

    print(
        "  C = Clear sequence"
    )

    print(
        "  S = Save sequence"
    )

    print(
        "  Q = Quit"
    )

    print(
        "==================================="
    )


    # -----------------------------------------
    # CAMERA LOOP
    # -----------------------------------------

    while True:

        success, frame = camera.read()


        if not success:

            print(
                "❌ Could not read camera frame."
            )

            break


        # Mirror camera
        frame = cv2.flip(
            frame,
            1
        )


        # -------------------------------------
        # MEDIAPIPE HAND DETECTION
        # -------------------------------------

        frame, hands = detector.detect(
            frame
        )


        # -------------------------------------
        # DEFAULT GESTURE
        # -------------------------------------

        current_gesture = "NO HAND"


        # -------------------------------------
        # RECOGNIZE GESTURE
        # -------------------------------------

        if hands:

            # For now we use the first detected hand
            hand = hands[0]

            current_gesture = recognize_gesture(
                hand
            )

            # Send gesture to sequence buffer
            buffer.update(
                current_gesture
            )


        else:

            # Tell buffer that the hand disappeared
            buffer.update(
                "NO HAND"
            )


        # -------------------------------------
        # DISPLAY CURRENT GESTURE
        # -------------------------------------

        cv2.putText(
            frame,
            f"Current: {current_gesture}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 255, 0),
            2
        )


        # -------------------------------------
        # DISPLAY SEQUENCE LABEL
        # -------------------------------------

        cv2.putText(
            frame,
            "Sequence:",
            (20, 125),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )


        # -------------------------------------
        # DISPLAY ACTUAL SEQUENCE
        # -------------------------------------

        sequence_text = " -> ".join(
            buffer.sequence
        )


        cv2.putText(
            frame,
            sequence_text[-70:],
            (20, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2
        )


        # -------------------------------------
        # DISPLAY STABILITY
        # -------------------------------------

        stability_text = (
            f"Stable frames: "
            f"{buffer.frame_count}/"
            f"{buffer.stable_frames}"
        )


        cv2.putText(
            frame,
            stability_text,
            (20, 200),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )


        # -------------------------------------
        # DISPLAY CONTROLS
        # -------------------------------------

        cv2.putText(
            frame,
            "C: Clear | S: Save | Q: Quit",
            (20, frame.shape[0] - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )


        # -------------------------------------
        # SHOW CAMERA
        # -------------------------------------

        cv2.imshow(
            "SignaAI - Live Sign Recognition",
            frame
        )


        # -------------------------------------
        # KEYBOARD INPUT
        # -------------------------------------

        key = cv2.waitKey(1) & 0xFF


        # Clear sequence
        if key == ord("c"):

            buffer.clear()


        # Save sequence
        elif key == ord("s"):

            buffer.save()


        # Quit
        elif key == ord("q"):

            break


    # -----------------------------------------
    # RELEASE CAMERA
    # -----------------------------------------

    camera.release()

    cv2.destroyAllWindows()


if __name__ == "__main__":

    start_camera()