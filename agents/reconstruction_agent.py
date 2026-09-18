"""
Vaani Reconstruction Agent

Converts recognized ASL sign concepts into natural English
while preserving as many recognized concepts as possible.

V1:
- Rule-based semantic reconstruction
- Supports single signs
- Supports multi-sign combinations
- Preserves previous Vaani conversation/medical patterns
- Removes immediate duplicate predictions
"""


def reconstruct_sentence(signs, context):

    signs = [
        str(sign).strip().lower()
        for sign in signs
        if str(sign).strip()
    ]

    if not signs:
        return "I could not understand the signs."

    # Remove immediate duplicate predictions.
    # Example:
    # ["want", "want", "help"] -> ["want", "help"]
    cleaned = []

    for sign in signs:
        if not cleaned or cleaned[-1] != sign:
            cleaned.append(sign)

    signs = cleaned
    sign_set = set(signs)

    # =========================================================
    # MEDICAL / EXISTING VAANI PATTERNS
    # =========================================================

    if "pain" in sign_set and "stomach" in sign_set:

        if "morning" in sign_set:
            return "I have been experiencing stomach pain since morning."

        return "I am experiencing stomach pain."

    if "pain" in sign_set and "doctor" in sign_set:
        return "I need to see a doctor because I am in pain."

    # =========================================================
    # STRONG MULTI-CONCEPT V1 PATTERNS
    #
    # These are checked BEFORE shorter patterns so that
    # important concepts are not discarded.
    # =========================================================

    # FAMILY + WHO + LIKE + HELP
    if {
        "family",
        "who",
        "like",
        "help",
    }.issubset(sign_set):

        return "I want to know who in my family can help me."

    # FAMILY + WHO + HELP
    if {
        "family",
        "who",
        "help",
    }.issubset(sign_set):

        return "Who in my family can help?"

    # FAMILY + LIKE + HELP
    if {
        "family",
        "like",
        "help",
    }.issubset(sign_set):

        return "I like my family and I need help."

    # WANT + WHO + HELP
    if {
        "want",
        "who",
        "help",
    }.issubset(sign_set):

        return "I want to know who can help."

    # WANT + WHAT
    if "want" in sign_set and "what" in sign_set:
        return "What do you want?"

    # WANT + HELP
    if "want" in sign_set and "help" in sign_set:
        return "I want help."

    # WANT + COMPUTER
    if "want" in sign_set and "computer" in sign_set:
        return "I want to use the computer."

    # WANT + STUDY
    if "want" in sign_set and "study" in sign_set:
        return "I want to study."

    # WANT + WORK
    if "want" in sign_set and "work" in sign_set:
        return "I want to work."

    # WANT + DRINK
    if "want" in sign_set and "drink" in sign_set:
        return "I want a drink."

    # WANT + GO
    if "want" in sign_set and "go" in sign_set:
        return "I want to go."

    # =========================================================
    # EXISTING DAILY CONVERSATION PATTERNS
    # =========================================================

    # HELLO + HELP
    if "hello" in sign_set and "help" in sign_set:
        return "Hello, I need some help."

    # WANT + WATER
    if "want" in sign_set and "water" in sign_set:
        return "I would like some water."

    # =========================================================
    # FAMILY
    # =========================================================

    if "family" in sign_set and "mother" in sign_set:
        return "My mother is in my family."

    if "family" in sign_set and "like" in sign_set:
        return "I like my family."

    # =========================================================
    # QUESTIONS
    # =========================================================

    if "who" in sign_set and "help" in sign_set:
        return "Who can help?"

    if "who" in sign_set:
        return "Who is it?"

    if "what" in sign_set:
        return "What is it?"

    # =========================================================
    # COMPUTER
    # =========================================================

    if "computer" in sign_set and "work" in sign_set:
        return "I work on the computer."

    if "computer" in sign_set and "study" in sign_set:
        return "I study using the computer."

    if "computer" in sign_set:
        return "I want to use the computer."

    # =========================================================
    # STUDY / WORK
    # =========================================================

    if "study" in sign_set and "work" in sign_set:
        return "I study and work."

    if "study" in sign_set:
        return "I want to study."

    if "work" in sign_set:
        return "I want to work."

    # =========================================================
    # SIMPLE ACTIONS
    # =========================================================

    if "drink" in sign_set:
        return "I want a drink."

    if "go" in sign_set:
        return "I want to go."

    # =========================================================
    # LIKE
    # =========================================================

    if "like" in sign_set and "mother" in sign_set:
        return "I like my mother."

    if "like" in sign_set:
        return "I like it."

    # =========================================================
    # EXISTING SIMPLE RESPONSES
    # =========================================================

    if signs == ["thank you"]:
        return "Thank you."

    if signs == ["yes"]:
        return "Yes."

    if signs == ["no"]:
        return "No."

    if signs == ["hello"]:
        return "Hello."

    if signs == ["help"]:
        return "I need help."

    if signs == ["mother"]:
        return "My mother."

    # =========================================================
    # FALLBACK
    # =========================================================

    return " ".join(signs).capitalize() + "."


if __name__ == "__main__":

    tests = [
        ["want", "help"],
        ["want", "computer"],
        ["family", "like"],
        ["who", "help"],
        ["want", "study"],
        ["family", "who", "like", "help"],
        ["help"],
        ["pain", "stomach"],
        ["pain", "stomach", "morning"],
        ["pain", "doctor"],
        ["hello", "help"],
        ["want", "water"],
        ["thank you"],
        ["yes"],
        ["no"],
        ["hello"],
    ]

    print("=" * 60)
    print("VAANI RECONSTRUCTION AGENT TEST")
    print("=" * 60)

    context = {
        "name": "Daily Conversation",
        "confidence": 0.9,
    }

    for test in tests:

        result = reconstruct_sentence(test, context)

        print()
        print("Signs :", test)
        print("Output:", result)

    print()
    print("=" * 60)
