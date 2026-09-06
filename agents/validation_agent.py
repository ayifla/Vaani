def validate_translation(signs, sentence, context):

    sentence_lower = sentence.lower()

    concept_mapping = {
        "pain": ["pain", "ache", "aching"],
        "stomach": ["stomach", "abdominal"],
        "morning": ["morning"],
        "water": ["water"],
        "help": ["help", "assistance"],
        "want": ["want", "need", "would like"],
        "doctor": ["doctor", "physician"],
        "yes": ["yes"],
        "no": ["no", "not"],
        "hello": ["hello", "hi"],
        "thank you": ["thank", "thanks"]
    }

    preserved = []
    missing = []

    for sign in signs:

        sign = sign.lower().strip()

        if sign not in concept_mapping:
            continue

        possible_words = concept_mapping[sign]

        found = any(
            word in sentence_lower
            for word in possible_words
        )

        if found:
            preserved.append(sign)
        else:
            missing.append(sign)

    valid = len(missing) == 0

    return {
        "valid": valid,
        "preserved": preserved,
        "missing": missing,
        "context": context["name"]
    }