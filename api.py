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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.context_agent import identify_context
from agents.reconstruction_agent import reconstruct_sentence
from agents.validation_agent import validate_translation


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

    return {
        "signs": signs,
        "context": context,
        "sentence": sentence,
        "validation": validation,
    }
