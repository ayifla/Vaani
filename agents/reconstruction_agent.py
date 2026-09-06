def reconstruct_sentence(signs, context):

    signs = [
        sign.strip().lower()
        for sign in signs
    ]

    context_name = context["name"]

    # -----------------------------
    # MEDICAL
    # -----------------------------

    if (
        "pain" in signs
        and "stomach" in signs
    ):
        if "morning" in signs:
            return (
                "I have been experiencing "
                "stomach pain since morning."
            )

        return "I am experiencing stomach pain."

    if (
        "pain" in signs
        and "doctor" in signs
    ):
        return "I need to see a doctor because I am in pain."

    # -----------------------------
    # DAILY CONVERSATION
    # -----------------------------

    if (
        "hello" in signs
        and "help" in signs
    ):
        return "Hello, I need some help."

    if (
        "want" in signs
        and "water" in signs
    ):
        return "I would like some water."

    if "help" in signs:
        return "I need help."

    if "water" in signs:
        return "I would like some water."

    if "thank you" in signs:
        return "Thank you."

    if "yes" in signs:
        return "Yes."

    if "no" in signs:
        return "No."

    if "hello" in signs:
        return "Hello."

    # -----------------------------
    # FALLBACK
    # -----------------------------

    return " ".join(signs).capitalize() + "."