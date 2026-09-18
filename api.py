"""
SignaAI - API layer

This wraps the existing agent functions (context detection,
sentence reconstruction, translation validation) as HTTP
endpoints, so any frontend (HTML, React, Telegram bot, etc.)
can call them instead of only working inside Streamlit.

Run with:
    uvicorn api:app --reload

Then open http://localhost:8000/docs to test it in the browser.
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client

from agents.context_agent import identify_context
from agents.reconstruction_agent import reconstruct_sentence
from agents.validation_agent import validate_translation
from agents.demo_vocabulary import convert_gestures_to_concepts


# Same file camera.py saves to when you press "S", and the same
# file app.py (Streamlit) already reads for "Load Camera Sequence".
SEQUENCE_FILE = Path(__file__).parent / "data" / "current_sequence.json"
load_dotenv()

supabase = None

if os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SECRET_KEY"):
    supabase = create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SECRET_KEY"],
    )


app = FastAPI(title="SignaAI API")

# Allow the frontend (running on a different port, e.g. Vite's
# localhost:5173, or just opening the HTML file directly) to call
# this API from the browser. For now this allows all origins,
# which is fine for local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------
# REQUEST / RESPONSE SHAPES
# -----------------------------------------

class TranslateRequest(BaseModel):
    # List of recognized sign concepts, e.g. ["HELLO", "HELP"]
    signs: list[str]


class TranslateResponse(BaseModel):
    signs: list[str]
    context: dict
    sentence: str
    validation: dict


# -----------------------------------------
# ROUTES
# -----------------------------------------

@app.get("/")
def health_check():
    """Simple route to confirm the API is running."""
    return {"status": "SignaAI API is running"}


@app.post("/translate", response_model=TranslateResponse)
def translate(request: TranslateRequest):
    """
    Takes a list of recognized signs and returns:
    - the detected context
    - the reconstructed natural-language sentence
    - a validation report (which concepts were preserved)

    Example request body:
        { "signs": ["HELLO", "HELP"] }
    """

    signs = [sign.strip() for sign in request.signs if sign.strip()]

    context = identify_context(signs)
    sentence = reconstruct_sentence(signs, context)
    validation = validate_translation(signs, sentence, context)

    if supabase:
        supabase.table("translations").insert({
            "signs": ", ".join(signs),
            "sentence": sentence,
            "context": context.get("name", ""),
        }).execute()

    return {
        "signs": signs,
        "context": context,
        "sentence": sentence,
        "validation": validation,
    }


@app.get("/detect", response_model=TranslateResponse)
def detect():
    """
    Reads the gesture sequence most recently saved by camera.py
    (when the user presses "S"), converts the raw gestures
    (e.g. "OPEN PALM") into vocabulary concepts (e.g. "HELLO"),
    and runs them through the same translation pipeline as /translate.

    This is the bridge between the live camera and the frontend:
    camera.py -> current_sequence.json -> this endpoint -> frontend.

    NOTE: This is a polling-style endpoint for now. The frontend
    calls it after the user has signed and pressed "S" in the
    camera window. A fully live/streaming version can replace
    this later without changing /translate or the agents.
    """

    if not SEQUENCE_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="No saved camera sequence found. Run camera.py and press S.",
        )

    with open(SEQUENCE_FILE, "r") as file:
        data = json.load(file)

    gestures = data.get("sequence", [])

    if not gestures:
        raise HTTPException(
            status_code=404,
            detail="Saved sequence is empty. Sign something and press S again.",
        )

    # Raw gestures (e.g. "OPEN PALM") -> vocabulary concepts (e.g. "HELLO")
    signs = convert_gestures_to_concepts(gestures)

    context = identify_context(signs)
    sentence = reconstruct_sentence(signs, context)
    validation = validate_translation(signs, sentence, context)

    if supabase:
        supabase.table("translations").insert({
            "signs": ", ".join(signs),
            "sentence": sentence,
            "context": context.get("name", ""),
        }).execute()

    return {
        "signs": signs,
        "context": context,
        "sentence": sentence,
        "validation": validation,
    }
