# 📊 PROGRESS.md — Vaani
> Paste this file into every new Claude chat to restore full context instantly.
> Update this after every completed step.
---

## 🧠 Project Summary

**From Signs to Meaning: Generative AI for Context-Aware Sign Language Translation.**

Product name: **Vaani** bridges communication between sign-language users and people who don't know sign language. Instead of producing telegraphic, word-by-word output like `pain — stomach — since — morning`, the system reconstructs natural, grammatically complete sentences like `I have been experiencing stomach pain since morning.`

**Current focus is ASL only** (larger public datasets — WLASL etc. — make it far more practical to build and evaluate against right now). **ISL support is future scope**, added once the ASL pipeline is validated and a suitable ISL dataset (e.g. INCLUDE) is integrated. Real-time video-call/FaceTime-style integration and the Telegram bot are also future scope, not part of the current MVP.

**Live camera integration currently works for ~15–20 ASL signs.** Growing the vocabulary is the slowest part of the project — each new sign needs enough clean, consistent training examples before it can be added without hurting recognition accuracy, so vocabulary growth is deliberately gradual, prioritizing accuracy over sign count.

**Live URLs**
- Deployed via Cloudflare Tunnel (`cloudflared`)
- Frontend tunnel: `[Cloudflare Tunnel URL — frontend]`
- Backend/API tunnel: `[Cloudflare Tunnel URL — backend]`
- GitHub: `https://github.com/ayifla/Vaani` (public, branch: `vaani-new-frontend`)

---

## 🛠️ Stack

| Layer            | Tool                                          |
| ---------------- | ---------------------------------------------- |
| Vision            | OpenCV + MediaPipe Hand Landmarker (Tasks API) |
| Gesture Recognition | Custom geometry-based prototype classifier   |
| Context / Reconstruction / Validation | Rule-based multi-agent pipeline (Python) |
| Speech Output     | gTTS                                          |
| UI (prototype)    | Streamlit                                     |
| AI Provider (planned) | Anthropic SDK (installed, not yet wired in) |
| Env               | macOS (Apple Silicon) + Python 3.13.15 + venv  |

---

## ✅ Completed Steps

### Phase 1 — MVP Foundation ✅

- [x] Python 3.13 environment set up in `venv`
- [x] Project structure scaffolded (`app.py`, `agents/`, `vision/`, `utils/`, `data/`, `models/`, `docs/`)
- [x] Packages installed: `streamlit`, `mediapipe==0.10.35`, `opencv-python`, `gTTS`, `python-dotenv`, `anthropic`
- [x] Webcam access via OpenCV — frame capture, horizontal flip, overlay drawing, keyboard controls
- [x] MediaPipe Hand Landmarker (Tasks API) integrated — `vision/hand_landmarker.task`
- [x] Working pipeline: Webcam → RGB conversion → MediaPipe Hand Landmarker → 21 hand landmarks detected and displayed
- [x] `vision/landmarks.py` — geometric feature extraction (joint angles, distances, finger extension states, fingertip separation, thumb position)
- [x] `vision/recognizer.py` — custom deterministic, geometry-based gesture classifier (NOT a trained ISL/ASL model) recognizing: `TWO/PEACE`, `OK`, `THUMBS UP`, `THUMBS DOWN`, `FIST`, `ONE`, `THREE`, `FOUR`, `OPEN PALM`, `UNKNOWN`
- [x] `vision/camera.py` — sequence buffer with 12-frame stability threshold to avoid every frame becoming a separate sign
- [x] Camera controls: `C` = clear, `S` = save, `Q` = quit
- [x] Sequence persistence to `data/current_sequence.json`
- [x] Demo vocabulary mapping (artificial, not official ISL/ASL) connecting gesture labels → concepts (`OPEN PALM → HELLO`, `FIST → HELP`, `THREE → PAIN`, etc.)
- [x] `agents/context_agent.py` — broad context classification: Medical, Emergency, Daily Conversation, Assistance, General Conversation
- [x] `agents/reconstruction_agent.py` — rule-based sentence reconstruction (e.g. `pain + stomach + morning → "I have been experiencing stomach pain since morning."`)
- [x] `agents/validation_agent.py` — checks whether key concepts (pain, stomach, morning, water, help, want, doctor, yes, no, hello, thank you) survive reconstruction
- [x] Speech output wired: Natural sentence → `gTTS` → MP3 → Streamlit audio player
- [x] `utils/ai_provider.py` — provider abstraction scaffolded so the rule-based chatbot can later be swapped for a real LLM
- [x] **Git commit: initial MVP pipeline (vision → agents → speech) working end to end**

---

## 🔄 Current Status

**Currently on:** Phase 1 MVP — live camera integration working for ~15–20 ASL signs, stabilizing and preparing for Phase 2 (trained recognizer, larger vocabulary)

**Last completed action:**
> Full local pipeline demonstrated: webcam → MediaPipe landmarks → geometry-based recognizer → sequence buffer → JSON storage → context agent → rule-based reconstruction → validation → gTTS speech, surfaced through a Streamlit UI.

**Next action to take:**
> Finish testing the Streamlit chatbot integration end-to-end, then continue growing the ASL vocabulary past the current ~15–20 live signs — carefully, since each new sign needs enough clean training data to avoid dropping recognition accuracy.

---

## 🧩 What's Fully Built ✅

### Computer Vision
- OpenCV webcam capture, flip, overlays, live window, keyboard controls
- MediaPipe Hand Landmarker (Tasks API) — 21 landmarks per detected hand
- Geometry-based feature extraction (angles, distances, extension states)
- Custom prototype gesture classifier (10 labels, no training data — deterministic rules)
- Gesture sequence buffer with stability threshold (12 frames) and JSON export

### Semantic Pipeline
- Context Agent — 5 broad context categories
- Reconstruction Agent — rule-based, converts concept sets into full sentences
- Validation Agent — checks concept preservation across the reconstructed sentence
- Demo vocabulary layer connecting prototype gesture labels to semantic concepts

### Output
- gTTS speech synthesis wired into the Streamlit app
- Streamlit UI: camera sequence loading → context → reconstruction → validation → speech, plus a basic chatbot interface

### Infrastructure
- Clean modular structure (`vision/`, `agents/`, `utils/`, `data/`)
- AI provider abstraction layer scaffolded for future LLM swap-in (Anthropic SDK installed, not yet called live)

---

## 🧭 What Needs to Be Built (Priority Order)

### 🔴 Critical
1. Finish and stabilize the Streamlit chatbot integration end-to-end
2. Select a constrained **ASL** vocabulary (a few hundred common signs) and source/build a dataset (WLASL / custom recordings) — ASL first, since public data is far more abundant

### 🟡 High Priority
3. Preprocess ASL sign videos and extract normalized temporal landmark sequences
4. Train an LSTM baseline recognizer to replace the current geometry-based prototype
5. Evaluate the trained recognizer and replace the current demo gesture→concept mapping with real predictions

### 🟠 Medium Priority
6. Upgrade to MediaPipe Holistic (hands + face + pose) for multimodal, two-hand recognition
7. Wire a real instruction-tuned LLM into the reconstruction step via `utils/ai_provider.py` (replacing rule-based reconstruction), with few-shot examples and conversation memory
8. Strengthen the Validation Agent — negation, intent, semantic similarity, confidence, regeneration on failure

### 🟢 Later / Future Scope
9. **ISL support** — once ASL pipeline is validated, integrate an ISL dataset (e.g. INCLUDE) and extend the vocabulary/recognizer to cover it
10. **Real-time video-call/FaceTime-style integration** — live sign translation during video calls
11. **Telegram bot** interface (and other external channels like WhatsApp/Discord) beyond the Streamlit chatbot
12. Multi-agent orchestration via LangChain/LangGraph or equivalent
13. Formal evaluation — rule-based vs. LSTM vs. LLM reconstruction, scored on BLEU / ROUGE / BERTScore / latency, plus recognition accuracy and confusion-matrix analysis

---

## 📁 Files Created

```
Vaani/
├── app.py                          ✅ Streamlit demo UI (camera → context → reconstruction → validation → speech → chat)
├── agents/
│   ├── __init__.py                 ✅
│   ├── context_agent.py            ✅ context classification (Medical/Emergency/Daily/Assistance/General)
│   ├── reconstruction_agent.py     ✅ rule-based sentence reconstruction
│   └── validation_agent.py         ✅ concept-preservation validation
├── data/
│   └── current_sequence.json       ✅ saved gesture sequence from camera.py
├── docs/                           ✅ problem statement + reference docs
├── models/                         🔲 reserved for trained recognizer (Phase 2)
├── utils/
│   └── ai_provider.py              ✅ provider abstraction (LLM not yet live)
├── vision/
│   ├── camera.py                   ✅ webcam capture + sequence buffer (12-frame stability)
│   ├── landmarks.py                ✅ geometric feature extraction
│   ├── recognizer.py               ✅ geometry-based prototype classifier
│   └── hand_landmarker.task        ✅ MediaPipe pretrained model file
├── README.md                       ✅
├── requirements.txt                ✅
└── .gitignore                      ✅
```

---

## 🐛 Gotchas (Bugs & Fixes — Never Repeat These)

| # | Bug | Fix | Discovered In |
| --- | --- | --- | --- |
| 1 | Adding new signs too quickly drops recognition accuracy on the whole vocabulary | Only add a new sign once it has enough clean, consistent training examples; grow the vocabulary gradually (currently ~15–20 signs) rather than all at once | Vocabulary expansion work |
| — | (add further entries here as bugs are fixed, so they're never re-introduced) | | — |

---

## 📝 Key Decisions Made

| Decision | Reason |
| --- | --- |
| MediaPipe Hand Landmarker (Tasks API) over legacy `mp.solutions` | Current, actively supported API for landmark extraction |
| Landmark geometry over raw pixel classification | Lightweight, structured representation suited to a prototype and to later temporal modelling |
| Geometry-based rule classifier for MVP, not a trained model | Verifies the full computer-vision pipeline before investing in dataset collection and training |
| Rule-based reconstruction for MVP, architected for LLM swap-in | Proves the semantic pipeline end-to-end while keeping the door open for `utils/ai_provider.py` to plug in a real LLM later |
| Streamlit chatbot over Discord/WhatsApp/Telegram integration first | Demonstrates the core idea with minimal integration overhead; external channels are future scope |
| Multi-agent separation (Recognition → Context → Reconstruction → Validation) | Each stage can be inspected, tested, and improved independently |
| No dataset training yet (WLASL deferred) | MVP prioritizes proving the pipeline shape before committing to dataset/training effort |
| **ASL prioritized over ISL** | Public datasets (WLASL etc.) for ASL are far larger and better documented, making ASL the practical starting point; ISL is planned as a future extension once the pipeline is validated |
| Telegram bot, live video-call/FaceTime integration deferred to future scope | Keeps current MVP scope focused on proving the core recognition → reconstruction → validation pipeline before adding external integrations |

---

## 🎯 What This Project Demonstrates (For Interviews/Viva)

> "Vaani reconstructs natural, grammatically complete sentences from sign-language input instead of flat word-by-word output. The current MVP uses a pretrained MediaPipe Hand Landmarker for 21-point hand-landmark extraction, a custom geometry-based gesture classifier, and a rule-based multi-agent semantic pipeline — Context → Reconstruction → Validation — with gTTS speech output, all demonstrated through a Streamlit app. The architecture is deliberately built so the geometry-based recognizer can be replaced by a trained LSTM/Transformer model, and the rule-based reconstruction by an instruction-tuned LLM, without changing the pipeline shape."

**Key concepts demonstrated:**
- Computer vision — OpenCV + MediaPipe landmark extraction
- Structured feature engineering — landmark geometry (angles, distances, extension states)
- Multi-agent pipeline design — Recognition / Context / Reconstruction / Validation as separable stages
- Rule-based NLP as a scaffolded placeholder for GenAI (instruction-tuned LLM planned)
- Speech synthesis integration (gTTS)
- Honest technical framing — clear separation between what's pretrained, what's custom, and what's not yet built

---

## ⚠️ Important Technical Honesty

Do **not** say:
> "The current system is trained on ISL/ASL." — it is not; the recognizer is a deterministic geometry-based prototype.
> "MediaPipe was trained by us." — it is pretrained by Google.

Do **not** present the demo gesture→concept mappings as official ISL/ASL meanings — they are artificial mappings used only to demonstrate the downstream semantic pipeline.

**Accurate current description:**
> "SignaAI currently uses a pretrained MediaPipe Hand Landmarker for hand landmark extraction, followed by a custom geometry-based gesture classifier and a rule-based semantic pipeline."

**Accurate intended final description:**
> "SignaAI will use a trained sign-language recognition model based on temporal landmark sequences from a constrained ASL dataset (with ISL support planned as a future extension), followed by context-aware generative semantic reconstruction and meaning validation."

---

## ⏭️ Remaining Tasks

- [ ] Finish testing Streamlit chatbot integration end-to-end
- [ ] Grow the live ASL vocabulary beyond the current ~15–20 signs toward a few hundred, pacing additions against available clean training data per sign to protect accuracy
- [ ] Source/build ASL dataset (WLASL or custom recordings)
- [ ] *(Future scope)* Source/build ISL dataset (e.g. INCLUDE) and extend vocabulary to ISL
- [ ] *(Future scope)* Real-time video-call/FaceTime-style integration
- [ ] *(Future scope)* Telegram bot interface
- [ ] Preprocess videos + extract normalized temporal landmark sequences
- [ ] Train LSTM baseline recognizer
- [ ] Evaluate LSTM baseline, replace demo mapping with real predictions
- [ ] Add MediaPipe Holistic (pose + face + two-hand support)
- [ ] Integrate a real instruction-tuned LLM into `reconstruction_agent.py` via `utils/ai_provider.py`
- [ ] Strengthen Validation Agent (negation, intent, semantic similarity, confidence, regeneration)
- [ ] Add conversation memory + few-shot examples to the LLM reconstruction step
- [ ] Run formal evaluation (BLEU / ROUGE / BERTScore / latency) across rule-based vs. LSTM vs. LLM
- [ ] Add external communication integration (WhatsApp/Discord) beyond Streamlit

---

## 📅 Session Log

| Date | What was done | Commits |
|------|--------------|---------|
| Sep 4, 2026 | Full local MVP pipeline working: webcam → MediaPipe landmarks → geometry-based recognizer → sequence buffer → JSON storage → context/reconstruction/validation agents → gTTS speech → Streamlit UI with basic chatbot | — |

---

## 💬 How to Use This File in a New Claude Chat

1. Open a new chat in the **Vaani** Claude Project
2. Paste this entire file as your first message
3. Say: **"Continue from where we left off. Next action: [paste Next action above]"**
4. Claude will pick up exactly where you stopped

---

*Last updated: September 11, 2026 — Phase 1 MVP complete, moving into Phase 2 (real ASL recognition; ISL, video-call integration, and Telegram bot are future scope).*
