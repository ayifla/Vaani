DEMO_VOCABULARY = {
    "OPEN PALM": "HELLO",
    "TWO / PEACE": "WANT",
    "THUMBS UP": "YES",
    "THUMBS DOWN": "NO",
    "FIST": "HELP",
    "ONE": "WATER",
    "THREE": "PAIN",
    "FOUR": "DOCTOR",
    "OK": "THANK YOU",
}


def convert_gestures_to_concepts(gestures):
    """
    Converts prototype gesture labels into
    semantic concepts for the MVP.

    NOTE:
    These are demo mappings, NOT official ISL/ASL signs.
    """

    concepts = []

    for gesture in gestures:
        concept = DEMO_VOCABULARY.get(
            gesture,
            gesture
        )

        concepts.append(concept)

    return concepts