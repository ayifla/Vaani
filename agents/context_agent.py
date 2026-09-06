def identify_context(signs):

    signs = [
        sign.strip().upper()
        for sign in signs
    ]

    medical_words = {
        "PAIN",
        "DOCTOR",
        "FEVER",
        "MEDICINE",
        "STOMACH",
        "HEAD"
    }

    emergency_words = {
        "EMERGENCY",
        "HELP"
    }

    daily_words = {
        "WATER",
        "FOOD",
        "WANT",
        "HELLO",
        "THANK YOU"
    }

    if any(word in signs for word in medical_words):

        return {
            "name": "Medical",
            "confidence": 0.95
        }

    if "EMERGENCY" in signs:

        return {
            "name": "Emergency",
            "confidence": 0.99
        }

    if any(word in signs for word in daily_words):

        return {
            "name": "Daily Conversation",
            "confidence": 0.90
        }

    if "HELP" in signs:

        return {
            "name": "Assistance",
            "confidence": 0.90
        }

    return {
        "name": "General Conversation",
        "confidence": 0.70
    }