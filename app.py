import json
from pathlib import Path
from io import BytesIO

import streamlit as st
from gtts import gTTS

from agents.context_agent import identify_context
from agents.reconstruction_agent import reconstruct_sentence
from agents.validation_agent import validate_translation
from agents.demo_vocabulary import convert_gestures_to_concepts
from utils.ai_provider import generate_response


st.set_page_config(
    page_title="SignaAI",
    page_icon="🤟",
    layout="wide"
)


# ---------------------------------------
# SESSION STATE
# ---------------------------------------

if "conversation" not in st.session_state:
    st.session_state.conversation = []


# ---------------------------------------
# TITLE
# ---------------------------------------

st.title("🤟 SignaAI")

st.subheader(
    "From Signs to Meaning — Context-Aware Communication"
)

st.write(
    "A prototype communication bridge between "
    "sign-language users and non-sign-language users."
)


# ---------------------------------------
# SIDEBAR
# ---------------------------------------

st.sidebar.title("⚙️ SignaAI")

st.sidebar.info(
    """
    LEVEL 1 MVP

    ✓ Multi-gesture recognition
    ✓ Sign sequence
    ✓ Context detection
    ✓ Semantic reconstruction
    ✓ Meaning validation
    ✓ Text output
    ✓ Speech output
    ✓ Conversational response
    """
)


# ---------------------------------------
# LOAD CAMERA SEQUENCE
# ---------------------------------------

sequence_file = (
    Path(__file__).parent
    / "data"
    / "current_sequence.json"
)


st.header("🤟 Sign Input")

col1, col2 = st.columns([2, 1])


with col1:

    sign_input = st.text_input(
        "Recognized sign concepts",
        value="HELLO, HELP",
        help=(
            "For now this can be entered manually. "
            "Later it will come directly from the camera."
        )
    )


with col2:

    if st.button("📷 Load Camera Sequence"):

        if sequence_file.exists():

            with open(sequence_file, "r") as file:
                data = json.load(file)

            gestures = data.get("sequence", [])

            concepts = convert_gestures_to_concepts(
                gestures
            )

            sign_input = ", ".join(concepts)

            st.session_state.camera_signs = sign_input

        else:

            st.warning(
                "No saved camera sequence found. "
                "Run camera.py and press S."
            )


if "camera_signs" in st.session_state:

    sign_input = st.session_state.camera_signs

    st.info(
        f"Camera sequence loaded: {sign_input}"
    )


# ---------------------------------------
# TRANSLATE
# ---------------------------------------

if st.button(
    "✨ Translate & Understand",
    type="primary"
):

    signs = [
        sign.strip()
        for sign in sign_input.split(",")
        if sign.strip()
    ]

    # Context
    context = identify_context(signs)

    # Reconstruction
    sentence = reconstruct_sentence(
        signs,
        context
    )

    # Validation
    validation = validate_translation(
        signs,
        sentence,
        context
    )

    # Save result
    st.session_state.last_translation = sentence
    st.session_state.last_context = context
    st.session_state.last_validation = validation

    # -----------------------------------
    # RESULTS
    # -----------------------------------

    st.divider()

    st.header("🧠 SignaAI Understanding")

    result1, result2, result3 = st.columns(3)

    with result1:

        st.metric(
            "Signs",
            len(signs)
        )

    with result2:

        st.metric(
            "Context",
            context["name"]
        )

    with result3:

        if validation["valid"]:
            st.metric(
                "Validation",
                "✓ Valid"
            )
        else:
            st.metric(
                "Validation",
                "⚠ Review"
            )

    # -----------------------------------
    # RECOGNIZED CONCEPTS
    # -----------------------------------

    st.markdown("### 🤟 Recognized Concepts")

    st.write(
        " → ".join(signs)
    )

    # -----------------------------------
    # NATURAL LANGUAGE
    # -----------------------------------

    st.markdown("### 💬 Reconstructed Meaning")

    st.success(sentence)

    # -----------------------------------
    # VALIDATION
    # -----------------------------------

    st.markdown("### ✅ Meaning Validation")

    if validation["valid"]:

        st.success(
            "All important concepts were preserved."
        )

    else:

        st.warning(
            "Some concepts may not have been preserved."
        )

        st.write(
            "Missing:",
            validation["missing"]
        )

    # -----------------------------------
    # SPEECH
    # -----------------------------------

    st.markdown("### 🔊 Spoken Translation")

    try:

        audio_buffer = BytesIO()

        tts = gTTS(
            text=sentence,
            lang="en",
            slow=False
        )

        tts.write_to_fp(audio_buffer)

        st.audio(
            audio_buffer.getvalue(),
            format="audio/mp3"
        )

    except Exception:

        st.warning(
            "Speech generation is unavailable. "
            "Check your internet connection."
        )


# ---------------------------------------
# CHATBOT
# ---------------------------------------

st.divider()

st.header("💬 SignaAI Conversation")

st.caption(
    "The translated meaning can continue into a "
    "two-way conversation."
)


# Show previous messages

for message in st.session_state.conversation:

    with st.chat_message(message["role"]):

        st.write(message["content"])


# Automatically add translation to chat

if (
    "last_translation" in st.session_state
    and st.button("➕ Send Translation to Chat")
):

    user_message = st.session_state.last_translation

    st.session_state.conversation.append(
        {
            "role": "user",
            "content": user_message
        }
    )

    response = generate_response(
        user_message,
        st.session_state.conversation
    )

    st.session_state.conversation.append(
        {
            "role": "assistant",
            "content": response
        }
    )

    st.rerun()


# Normal user can type

user_message = st.chat_input(
    "Type a response..."
)


if user_message:

    st.session_state.conversation.append(
        {
            "role": "user",
            "content": user_message
        }
    )

    response = generate_response(
        user_message,
        st.session_state.conversation
    )

    st.session_state.conversation.append(
        {
            "role": "assistant",
            "content": response
        }
    )

    st.rerun()