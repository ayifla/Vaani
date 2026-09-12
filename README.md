# 🤟 Vaani — Signs that Speak

> AI-powered sign-language translator that reconstructs natural, grammatically complete sentences from signed concepts — instead of flat, word-by-word output.

---

## 🧠 What It Does

Most sign-language tools translate one sign at a time, producing broken output like:

```
pain — stomach — since — morning
```

**Vaani** captures signed concepts through a webcam, understands the context, and reconstructs a full, natural sentence:

```
"I have been experiencing stomach pain since morning."
```

It's built as a multi-agent pipeline — **Recognition → Context → Reconstruction → Validation → Speech** — so each stage can be inspected, tested, and upgraded independently as the project matures from prototype to a trained, production-grade system.

**Scope right now:** ASL only (public datasets like WLASL make it the practical starting point). Live camera integration currently works for **~15–20 ASL signs** — growing this is the slowest part of the project, since each new sign needs enough clean, consistent training data before it can be added without hurting recognition accuracy. **ISL support, live video-call/FaceTime-style translation, and a Telegram bot interface are planned future scope**, not part of the current build.

---

## 🎥 Demo

- Live demo: deployed via Cloudflare Tunnel — `[Cloudflare Tunnel URL]`
- GitHub: `https://github.com/ayifla/Vaani` (public, branch: `vaani-new-frontend`)

---

## 🛠️ Tech Stack

| Layer | Tool |
| --- | --- |
| Vision | OpenCV + MediaPipe Hand Landmarker (Tasks API) |
| Gesture Recognition | Custom geometry-based prototype classifier *(training a real ASL model is next)* |
| Context / Reconstruction / Validation | Rule-based multi-agent pipeline (Python) *(LLM swap-in planned)* |
| Speech Output | gTTS |
| UI | Streamlit |
| AI Provider (planned) | Anthropic SDK (installed, not yet wired into a live call) |
| Environment | macOS (Apple Silicon), Python 3.13, `venv` |

---

## ✨ Features

- 🖐️ Real-time hand-landmark detection via MediaPipe (21 landmarks per hand)
- 🧩 Geometry-based gesture recognition prototype, live for ~15–20 ASL signs today (10 base gesture labels mapped to a growing concept vocabulary)
- 🧠 Multi-agent semantic pipeline: context classification → sentence reconstruction → meaning validation
- 🔊 Text-to-speech output via gTTS
- 💬 Streamlit chat-style interface for demoing the full pipeline
- 🗂️ Gesture sequences saved to JSON for replay/testing without needing a live camera every time

---

## 🚧 Honest Project Status

This is an **early-stage prototype**, not a trained ISL/ASL recognition system yet. To be precise:

**What's true right now:**
> Vaani currently uses a pretrained MediaPipe Hand Landmarker for hand-landmark extraction, followed by a custom geometry-based gesture classifier and a rule-based semantic pipeline (context → reconstruction → validation).

**What's *not* true yet (don't assume this from the demo):**
- The recognizer is **not** trained on any ISL/ASL dataset — it's a deterministic, geometry-based prototype used to validate the pipeline.
- MediaPipe itself is pretrained by Google — it was not trained by this team.
- The demo gesture→concept mappings (e.g. `THUMBS UP → YES`) are **artificial placeholders**, not official ISL/ASL vocabulary.

**Where it's headed:**
> A trained sign-recognition model over temporal landmark sequences from a constrained ASL dataset, feeding an instruction-tuned LLM for context-aware sentence reconstruction and meaning validation — with ISL support, live video-call integration, and a Telegram bot as future extensions.

See [`PROGRESS.md`](./PROGRESS.md) for the full build log, phase-by-phase status, and roadmap.

---

## 📁 Project Structure

```
Vaani/
├── app.py                          # Streamlit demo UI
├── agents/
│   ├── context_agent.py            # context classification
│   ├── reconstruction_agent.py     # rule-based sentence reconstruction
│   └── validation_agent.py         # concept-preservation validation
├── data/
│   └── current_sequence.json       # saved gesture sequence
├── docs/                           # problem statement + reference docs
├── models/                         # reserved for trained recognizer (Phase 2)
├── utils/
│   └── ai_provider.py              # LLM provider abstraction (not yet live)
├── vision/
│   ├── camera.py                   # webcam capture + sequence buffer
│   ├── landmarks.py                # geometric feature extraction
│   ├── recognizer.py               # geometry-based prototype classifier
│   └── hand_landmarker.task        # MediaPipe pretrained model file
├── PROGRESS.md
├── README.md
├── requirements.txt
└── .gitignore
```

---

## ⚙️ Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/ayifla/Vaani.git
   cd Vaani
   git checkout vaani-new-frontend
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Streamlit app**
   ```bash
   streamlit run app.py
   ```

5. **(Optional) Run the standalone camera pipeline**
   ```bash
   python vision/camera.py
   ```
   Controls: `C` = clear sequence, `S` = save sequence to `data/current_sequence.json`, `Q` = quit.

---

## 🗺️ Roadmap

- [x] Webcam → MediaPipe landmarks → geometry-based recognizer → sequence buffer (MVP)
- [x] Rule-based context, reconstruction, and validation agents
- [x] gTTS speech output + Streamlit chatbot demo
- [ ] Grow the live ASL vocabulary past the current ~15–20 signs toward a few hundred, pacing additions against available clean training data per sign (WLASL / custom recordings) to protect accuracy
- [ ] Train an LSTM baseline recognizer, replacing the geometry-based prototype
- [ ] Upgrade to MediaPipe Holistic (hands + face + pose)
- [ ] Wire a real instruction-tuned LLM into sentence reconstruction
- [ ] Strengthen validation (negation, intent, semantic similarity)
- [ ] Formal evaluation — BLEU / ROUGE / BERTScore / latency
- [ ] *(Future scope)* ISL support via an ISL dataset (e.g. INCLUDE)
- [ ] *(Future scope)* Real-time video-call/FaceTime-style integration
- [ ] *(Future scope)* Telegram bot and other external interfaces

Full detail in [`PROGRESS.md`](./PROGRESS.md).

---

## 👥 Team

Built as an AICW mini-project by a four-person team, split across vision/preprocessing, backend/model, dataset collection, and integration/coordination.

