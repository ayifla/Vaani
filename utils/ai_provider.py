def generate_response(
    translated_sentence,
    conversation_history
):

    sentence = translated_sentence.lower()

    if "help" in sentence:
        return (
            "Of course! I'm here to help. "
            "What do you need assistance with?"
        )

    if "water" in sentence:
        return (
            "Sure! I'll help you get some water."
        )

    if "doctor" in sentence:
        return (
            "Of course. Would you like me to "
            "help you communicate with the doctor?"
        )

    if "pain" in sentence:
        return (
            "I'm sorry you're experiencing pain. "
            "Would you like medical assistance?"
        )

    if "hello" in sentence:
        return (
            "Hello! How can I help you?"
        )

    if "thank" in sentence:
        return (
            "You're welcome!"
        )

    return (
        "I understand. How can I help you further?"
    )