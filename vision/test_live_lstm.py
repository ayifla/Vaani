import cv2

from lstm_recognizer import VaaniLSTMRecognizer


def main():

    print("=" * 60)
    print("VAANI LIVE LSTM CAMERA TEST")
    print("=" * 60)

    print("Keep your hand clearly visible.")
    print("Hold each sign for 3-4 seconds.")
    print("Press R to reset.")
    print("Press Q to quit.")
    print("=" * 60)

    recognizer = None
    camera = None

    try:

        recognizer = VaaniLSTMRecognizer()

        camera = cv2.VideoCapture(0)

        camera.set(
            cv2.CAP_PROP_FRAME_WIDTH,
            1280
        )

        camera.set(
            cv2.CAP_PROP_FRAME_HEIGHT,
            720
        )

        if not camera.isOpened():

            print("❌ Could not open camera.")
            return

        print("✅ Camera opened.")
        print("Show a sign...")

        while True:

            success, frame = camera.read()

            if not success:
                print("❌ Could not read frame.")
                break

            # IMPORTANT:
            # Feed the ORIGINAL frame to MediaPipe.
            # Do NOT mirror before recognition.
            result = recognizer.add_frame(
                frame
            )

            # Mirror ONLY the displayed image.
            display = cv2.flip(
                frame,
                1
            )

            hands = result.get(
                "hands",
                0
            )

            progress = result.get(
                "progress",
                0
            )

            ready = result.get(
                "ready",
                False
            )

            stable = result.get(
                "label"
            )

            stable_confidence = result.get(
                "confidence",
                0.0
            )

            raw = result.get(
                "raw_label"
            )

            raw_confidence = result.get(
                "raw_confidence",
                0.0
            )

            temporary_loss = result.get(
                "temporary_loss",
                False
            )

            low_confidence = result.get(
                "low_confidence",
                False
            )

            # ------------------------------------------------
            # UI
            # ------------------------------------------------

            cv2.putText(
                display,
                f"Hands: {hands}",
                (25, 45),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                (0, 255, 0),
                2
            )

            if not ready:

                cv2.putText(
                    display,
                    f"SEQUENCE: {progress}/32",
                    (25, 90),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (255, 255, 0),
                    2
                )

            else:

                cv2.putText(
                    display,
                    "SEQUENCE: 32/32",
                    (25, 90),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (255, 255, 0),
                    2
                )

                if stable:

                    cv2.putText(
                        display,
                        f"STABLE: {stable.upper()} "
                        f"{stable_confidence * 100:.1f}%",
                        (25, 135),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.85,
                        (0, 255, 0),
                        2
                    )

                else:

                    cv2.putText(
                        display,
                        "STABLE: ---",
                        (25, 135),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.85,
                        (0, 255, 255),
                        2
                    )

                if raw:

                    cv2.putText(
                        display,
                        f"RAW: {raw.upper()} "
                        f"{raw_confidence * 100:.1f}%",
                        (25, 175),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.75,
                        (255, 255, 255),
                        2
                    )

            if temporary_loss:

                cv2.putText(
                    display,
                    "HAND TEMPORARILY LOST",
                    (25, 215),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 165, 255),
                    2
                )

            elif low_confidence:

                cv2.putText(
                    display,
                    "LOW CONFIDENCE",
                    (25, 215),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 165, 255),
                    2
                )

            cv2.putText(
                display,
                "R = reset    Q = quit",
                (25, display.shape[0] - 25),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2
            )

            cv2.imshow(
                "Vaani - Live LSTM Recognition",
                display
            )

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):

                break

            if key == ord("r"):

                recognizer.reset()

                print("🔄 Sequence reset")

    except KeyboardInterrupt:

        print("\nCamera stopped.")

    except Exception as error:

        print("\n❌ ERROR:")
        print(error)

    finally:

        if camera is not None:
            camera.release()

        cv2.destroyAllWindows()

        if recognizer is not None:
            recognizer.close()

        print("=" * 60)
        print("VAANI CAMERA TEST FINISHED")
        print("=" * 60)


if __name__ == "__main__":
    main()
