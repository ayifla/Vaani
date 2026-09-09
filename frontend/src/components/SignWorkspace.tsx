import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  FlipHorizontal, 
  Sun, 
  Sparkles, 
  Volume2, 
  Copy, 
  Share2, 
  RotateCcw, 
  Check, 
  Pause, 
  Play, 
  RefreshCw, 
  History, 
  BrainCircuit, 
  Sliders, 
  Hand,
  ArrowRight,
  Layers,
  ChevronDown,
  X,
  Edit3,
  Lightbulb
} from 'lucide-react';
import { ConceptToken, ConversationExchange, SimulationScenario } from '../types';
import { SIMULATION_SCENARIOS } from '../data/mockData';
import { speakText } from '../utils/speech';

interface SignWorkspaceProps {
  currentScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  selectedVoice: string;
  speed: number;
  conversationHistory: ConversationExchange[];
  onAddExchange: (exchange: ConversationExchange) => void;
  contrastMode: boolean;
  onShowToast: (message: string) => void;
}

export const SignWorkspace: React.FC<SignWorkspaceProps> = ({
  currentScenario,
  onSelectScenario,
  selectedVoice,
  speed,
  conversationHistory,
  onAddExchange,
  contrastMode,
  onShowToast,
}) => {
  // Vision & Camera states
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [assistiveLight, setAssistiveLight] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<'High' | 'Normal' | 'Strict'>('High');
  const [registerMode, setRegisterMode] = useState<'Casual' | 'Academic' | 'Medical'>('Casual');
  const [dialect, setDialect] = useState<string>('ISL / ASL Dual');

  // Interactive Tokens & Sentence
  const [tokens, setTokens] = useState<ConceptToken[]>(currentScenario.tokens);
  const [sentenceText, setSentenceText] = useState<string>(currentScenario.sentence);
  const [currentTone, setCurrentTone] = useState<string>(currentScenario.tone);
  const [syntacticBridge, setSyntacticBridge] = useState<string>(currentScenario.bridge);
  const [certainty, setCertainty] = useState<string>(currentScenario.certainty);
  const [alternateIndex, setAlternateIndex] = useState<number>(0);

  // Audio / Speech states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedInput, setEditedInput] = useState<string>(currentScenario.sentence);

  // Video element ref for real camera
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync with currentScenario prop when changed
  useEffect(() => {
    setTokens(currentScenario.tokens);
    setSentenceText(currentScenario.sentence);
    setCurrentTone(currentScenario.tone);
    setSyntacticBridge(currentScenario.bridge);
    setCertainty(currentScenario.certainty);
    setEditedInput(currentScenario.sentence);
    setAlternateIndex(0);
  }, [currentScenario]);

  // Handle Real Camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveCamera && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user', width: 1280, height: 720 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access not granted or unavailable:', err);
          setIsLiveCamera(false);
          onShowToast('Webcam unavailable. Switched to high-fidelity simulated camera feed.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLiveCamera, isCameraActive, onShowToast]);

  // Spacebar shortcut to Speak Aloud
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSpeakAloud();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sentenceText, speed, isSpeaking]);

  const handleSpeakAloud = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    speakText(sentenceText, {
      rate: speed,
      pitch: 1.05,
      voiceName: selectedVoice,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });

    onShowToast(`Speaking: "${sentenceText.replace(/[“”"]/g, '')}"`);
  };

  const handleCopy = () => {
    const plainText = sentenceText.replace(/[“”"]/g, '');
    navigator.clipboard?.writeText(plainText);
    setIsCopied(true);
    onShowToast('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReweave = () => {
    const nextIdx = (alternateIndex + 1) % (currentScenario.alternates.length + 1);
    setAlternateIndex(nextIdx);

    if (nextIdx === 0) {
      setSentenceText(currentScenario.sentence);
      setCurrentTone(currentScenario.tone);
    } else {
      const altSentence = currentScenario.alternates[nextIdx - 1];
      setSentenceText(altSentence);
      setCurrentTone(nextIdx === 1 ? 'Academic • Formal' : nextIdx === 2 ? 'Direct • Concise' : 'Polite • Nuanced');
    }
    onShowToast('Syntactic style rewoven');
  };

  const handleSaveEdit = () => {
    if (editedInput.trim()) {
      setSentenceText(editedInput.trim().startsWith('“') ? editedInput.trim() : `“${editedInput.trim()}”`);
      setIsEditing(false);
      onShowToast('Updated phrasing');
    }
  };

  const handleRemoveToken = (id: string) => {
    const filtered = tokens.filter((t) => t.id !== id);
    setTokens(filtered);
    onShowToast('Removed concept from active gloss stream');
  };

  const handleClearTokens = () => {
    setTokens([]);
    onShowToast('Cleared concept buffer');
  };

  const callTranslateAPI = async (scenario: SimulationScenario) => {
  try {
    const signWords = scenario.tokens.map((t) => t.word);

    const response = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signs: signWords }),
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();

    setSentenceText(data.sentence);
    onShowToast(`Live API translation: "${data.sentence}"`);
  } catch (err) {
    console.warn('Could not reach SignaAI API, using simulated sentence instead:', err);
    onShowToast('API unavailable — showing simulated result instead.');
  }
};

  const handleReplayPast = (phrase: string) => {
    speakText(phrase, {
      rate: speed,
      pitch: 1.05,
      voiceName: selectedVoice,
    });
    onShowToast(`Replaying: ${phrase}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans text-[#343832]">
      
      {/* 1. PIPELINE STATUS & CONTROL SUB-HEADER */}
      <section className="w-full flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-5 rounded-[28px] bg-[#FDFBF7] border border-[#E3DAC9] shadow-xs">
        
        {/* Breadcrumb Stage Pipeline */}
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
          {/* Step 1: Tracking */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3DAC9] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#1E3A2B] animate-pulse"></span>
            <span className="text-[#343832] font-medium">
              Hands in Frame: <strong className="text-[#1E3A2B]">Tracking</strong>
            </span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#9DA39A]" />

          {/* Step 2: Concepts */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3DAC9] shadow-xs">
            <span className="font-bold text-[#1E3A2B]">{tokens.length}</span>
            <span className="text-[#72786F]">Concepts Captured</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#9DA39A]" />

          {/* Step 3: Context Weaved */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3DAC9] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
            <span className="text-[#343832]">
              Context Weaved: <span className="text-[#C87A5B] font-bold">98%</span>
            </span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#9DA39A]" />

          {/* Step 4: Ready to Speak */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2B] text-white shadow-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#E5B25D]"></span>
            <span className="tracking-wide">Ready to Speak</span>
          </div>
        </div>

        {/* Right Mode & Context Tuning Controls */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* Register Mode Selection */}
          <div className="flex items-center bg-[#F2ECE1] p-1 rounded-full border border-[#E3DAC9]">
            {(['Casual', 'Academic', 'Medical'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setRegisterMode(mode);
                  onShowToast(`Switched translation register to ${mode}`);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  registerMode === mode
                    ? 'bg-[#1E3A2B] text-white shadow-xs'
                    : 'text-[#72786F] hover:text-[#1E3A2B]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Camera Feed Mode Toggle */}
          <div className="flex items-center bg-[#F2ECE1] p-1 rounded-full border border-[#E3DAC9]">
            <button
              onClick={() => {
                setIsLiveCamera(false);
                onShowToast('Active feed: Simulated Spatial Demo stream');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                !isLiveCamera
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'text-[#72786F] hover:text-[#1E3A2B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulated Stream</span>
            </button>

            <button
              onClick={() => {
                setIsLiveCamera(true);
                onShowToast('Requesting Live Camera permission...');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                isLiveCamera
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'text-[#72786F] hover:text-[#1E3A2B]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. TWO COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SPATIAL CAMERA VISION HUD (7 COLUMNS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif italic text-[#1E3A2B]">
              Sign <span className="text-xs font-sans not-italic text-[#9DA39A] ml-2 uppercase tracking-widest">— Workspace 01</span>
            </h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E7EFEA] text-[#1E3A2B] rounded-full text-[11px] font-bold uppercase border border-[#CDE0D4]">
                <span className="w-2 h-2 bg-[#1E3A2B] rounded-full animate-pulse"></span>
                Camera Active
              </span>
            </div>
          </div>

          {/* Camera Viewport Container with Forest Slate backdrop */}
          <div className="relative w-full rounded-[32px] overflow-hidden bg-[#152019] border-4 border-white shadow-xl aspect-[16/10] sm:aspect-[16/9] flex items-end">
            
            {/* Real or Simulated Video Feed */}
            {isLiveCamera && isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover select-none ${isMirrored ? 'scale-x-[-1]' : ''}`}
              />
            ) : isCameraActive ? (
              <img
                alt="Live spatial sign tracking stream"
                className={`absolute inset-0 w-full h-full object-cover select-none ${isMirrored ? 'scale-x-[-1]' : ''} ${isPaused ? 'filter saturate-50 brightness-75' : ''}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7L_BctFp2Go_GIN6d_xL2c560XyTq1wWlkE1WEy7G8rJtiHFMijTWmK0JjC9rngxSMhR_ZyjL-0Q8YnEB9GMfEnrdTDfvaSCxXb24TMZgVMjnx8CorSsAJXYDcVSkmunluH_uXyTJzdj8imKFFPHxGqrB40WhVDAkYdLbIECDT0LBx3GIectC-YLvm2m4m3BkSAh-btiJs3kFywbtrNJhEzFbfe8IWGLWf6oC_WfzNCXFbF-V0ChRw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#152019] flex flex-col items-center justify-center text-white gap-3">
                <VideoOff className="w-12 h-12 text-[#9DA39A]" />
                <p className="text-sm font-medium">Camera Feed Paused</p>
                <button
                  onClick={() => setIsCameraActive(true)}
                  className="px-4 py-2 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold shadow-xs hover:bg-[#152A1F]"
                >
                  Resume Camera
                </button>
              </div>
            )}

            {/* Subtle Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#152019]/90 via-transparent to-[#152019]/40 pointer-events-none" />

            {/* AR Skeletal Tracking Overlay */}
            <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between">
              
              {/* Top Row: Detection Badges */}
              <div className="flex justify-between items-start">
                <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E5B25D] animate-pulse" />
                  <span>Tracking: <strong className="text-[#E5B25D]">99.2% Accuracy</strong></span>
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs border border-white/20">
                    Detected: <span className="text-[#E5B25D] font-bold ml-1">Hand Position OK</span>
                  </div>
                  <div className="hidden sm:block px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs border border-white/20">
                    Lighting: <span className="text-[#E7EFEA] font-bold ml-1">Optimal</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Skeletal Hand Mesh Landmarks Overlay */}
              {showLandmarks && isCameraActive && (
                <div className="relative w-full h-32 flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full max-w-sm" viewBox="0 0 300 120" fill="none">
                    {/* Interconnected Neural Filaments */}
                    <path
                      d="M60,95 L85,60 L120,40 L150,55 L180,35 L210,65 L235,95"
                      stroke="#E3DAC9"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="opacity-70"
                    />
                    <path d="M85,60 L95,20 L110,12" stroke="#1E3A2B" strokeWidth="2" />
                    <path d="M120,40 L130,10 L145,5" stroke="#C87A5B" strokeWidth="2" />
                    <path d="M150,55 L165,15 L178,10" stroke="#8D656E" strokeWidth="2" />
                    <path d="M180,35 L195,22 L205,18" stroke="#E3DAC9" strokeWidth="1.5" />

                    {/* Joint Landmark Nodes with Brand Identity Accents */}
                    <circle cx="110" cy="12" r="4" fill="#E3DAC9" className="animate-pulse" />
                    <circle cx="145" cy="5" r="5" fill="#C87A5B" />
                    <circle cx="178" cy="10" r="4" fill="#E5B25D" />
                    <circle cx="205" cy="18" r="3.5" fill="#8D656E" />
                    <circle cx="120" cy="40" r="3.5" fill="#1E3A2B" />
                    <circle cx="150" cy="55" r="3.5" fill="#C87A5B" />

                    {/* Spatial Ripple Wave */}
                    <circle cx="145" cy="5" r="14" stroke="#C87A5B" strokeWidth="1.5" className="animate-ping opacity-60" />
                  </svg>
                </div>
              )}

              {/* Bottom Spatial Guidance Banner */}
              <div className="flex justify-between items-end">
                <div className="px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs border border-white/20 flex items-center gap-2">
                  <Hand className="w-3.5 h-3.5 text-white" />
                  <span>Position hands within the frame</span>
                </div>

                <div className="hidden sm:block text-[11px] text-white/70 font-mono">
                  FPS: 60 • Latency: 42ms
                </div>
              </div>

            </div>

            {/* Active Recognizing Strip at Bottom of Camera Viewport */}
            <div className="relative z-10 w-full p-4 bg-gradient-to-t from-[#152019] via-[#152019]/85 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C87A5B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C87A5B]"></span>
                </span>
                
                <span className="text-xs uppercase tracking-widest text-[#E3DAC9] font-bold">
                  RECOGNIZING SIGN:
                </span>

                <span className="text-sm font-semibold text-white bg-white/15 px-3 py-1 rounded-lg border border-white/20 shadow-xs">
                  {tokens.length > 0 ? `“${tokens[tokens.length - 1].word}”` : '“calibrating...”'}{' '}
                  <span className="text-white/70 font-normal text-xs">
                    (captured 0.2s ago)
                  </span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[#E5B25D] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[#E3DAC9]">ISL/ASL Engine</span>
              </div>
            </div>

          </div>

          {/* Camera Tactile Control Bar in Ivory and Forest Green */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E3DAC9] shadow-xs">
            
            {/* Viewport tool icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsCameraActive(!isCameraActive);
                  onShowToast(isCameraActive ? 'Camera muted' : 'Camera resumed');
                }}
                className="p-2.5 rounded-xl bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] border border-[#E3DAC9] transition-colors"
                title="Toggle Camera Stream"
              >
                {isCameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-[#9DA39A]" />}
              </button>

              <button
                onClick={() => {
                  setIsMirrored(!isMirrored);
                  onShowToast(isMirrored ? 'Mirror view disabled' : 'Mirror view active');
                }}
                className="p-2.5 rounded-xl bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] border border-[#E3DAC9] transition-colors"
                title="Mirror Camera View"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setAssistiveLight(!assistiveLight);
                  onShowToast(assistiveLight ? 'Assistive lighting dimmed' : 'Assistive lighting enhanced');
                }}
                className={`p-2.5 rounded-xl border border-[#E3DAC9] transition-colors ${
                  assistiveLight ? 'bg-[#1E3A2B] text-white' : 'bg-[#F2ECE1] text-[#1E3A2B]'
                }`}
                title="Assistive Optical Lighting"
              >
                <Sun className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setShowLandmarks(!showLandmarks);
                  onShowToast(showLandmarks ? 'Skeletal points hidden' : 'Skeletal landmarks visible');
                }}
                className={`p-2.5 rounded-xl border border-[#E3DAC9] transition-colors ${
                  showLandmarks ? 'bg-[#1E3A2B] text-white' : 'bg-[#F2ECE1] text-[#1E3A2B]'
                }`}
                title="Toggle Skeletal Landmark Mesh"
              >
                <BrainCircuit className="w-4 h-4" />
              </button>
            </div>

            {/* Sensitivity & Pause Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const modes: ('High' | 'Normal' | 'Strict')[] = ['High', 'Normal', 'Strict'];
                  const next = modes[(modes.indexOf(sensitivity) + 1) % modes.length];
                  setSensitivity(next);
                  onShowToast(`Spatial Sensitivity: ${next}`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] text-xs font-semibold border border-[#E3DAC9] transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-[#1E3A2B]" />
                <span>Sensitivity: {sensitivity}</span>
              </button>

              <button
                onClick={() => {
                  setIsPaused(!isPaused);
                  onShowToast(isPaused ? 'Vision processing resumed' : 'Vision stream paused');
                }}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold shadow-xs transition-all ${
                  isPaused
                    ? 'bg-[#C87A5B] text-white'
                    : 'bg-[#1E3A2B] hover:bg-[#152A1F] text-white'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume Vision' : 'Pause Vision'}</span>
              </button>
            </div>

          </div>

          {/* Vision Analytics Micro Panel */}
          <div className="grid grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">
                Spatial Range
              </span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#1E3A2B]">1.8 m</span>
                <span className="w-2 h-2 rounded-full bg-[#1E3A2B]" />
              </div>
              <div className="w-full h-1.5 bg-[#F2ECE1] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#1E3A2B] rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">
                Fingerspelling Mode
              </span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#C87A5B]">Auto-Blend</span>
                <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
              </div>
              <div className="w-full h-1.5 bg-[#F2ECE1] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#C87A5B] rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">
                Dialect Engine
              </span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#8D656E] truncate">{dialect}</span>
                <Hand className="w-3.5 h-3.5 text-[#8D656E]" />
              </div>
              <div className="w-full h-1.5 bg-[#F2ECE1] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#8D656E] rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: THE UNDERSTANDING MOMENT & COMMUNICATION CANVAS (5 COLUMNS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* STAGE 1: DETECTED CONCEPTS FLOW (UNDERSTAND) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-[#1E3A2B]">Understand</h2>

              <button
                onClick={handleClearTokens}
                className="text-xs text-[#72786F] hover:text-[#C87A5B] transition-colors flex items-center gap-1"
                title="Clear tokens"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            {/* Dynamic Concept Chips in Vaani Brand Palette */}
            <div className="flex flex-wrap gap-2 items-center min-h-[44px]">
              {tokens.length === 0 ? (
                <div className="text-xs text-[#9DA39A] py-2 italic font-medium leading-relaxed">
                  Reconstructing sign intent into natural syntax...
                </div>
              ) : (
                tokens.map((token, index) => {
                  const isLast = index === tokens.length - 1;
                  return (
                    <React.Fragment key={token.id}>
                      <span
                        className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isLast
                            ? 'bg-[#1E3A2B] text-white shadow-sm'
                            : 'bg-white border border-[#E3DAC9] text-[#1E3A2B] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <span>{token.word}</span>
                        <span className={`text-[10px] ${isLast ? 'text-white/70' : 'text-[#9DA39A]'}`}>
                          {token.time}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveToken(token.id);
                          }}
                          className="hover:opacity-80 transition-opacity ml-1"
                          title="Remove concept"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>

                      {index < tokens.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-[#9DA39A] shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>

            <p className="text-xs text-[#9DA39A] font-medium leading-relaxed italic">
              Reconstructing sign intent into natural syntax...
            </p>
          </div>

          {/* STAGE 2: COMMUNICATE & SYNTHESIS CARD */}
          <div className="flex-1 flex flex-col bg-white border border-[#E3DAC9] rounded-[32px] p-6 shadow-md relative overflow-hidden">
            
            {/* Background circular decoration in warm ivory cream */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F5EE] -mr-16 -mt-16 rounded-full opacity-60 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif italic text-[#1E3A2B]">Communicate</h2>
              <span className="px-3 py-1 rounded-full bg-[#FAF0EB] text-[#C87A5B] border border-[#F2D7CB] text-xs font-bold">
                {certainty} Certainty
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {/* Synthesized quote box in warm ivory surface */}
              <div className="p-5 bg-[#FDFBF7] border border-[#F2ECE1] rounded-2xl shadow-xs">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editedInput}
                      onChange={(e) => setEditedInput(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#1E3A2B] text-[#1E3A2B] font-serif text-lg focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 rounded-lg text-xs text-[#72786F] hover:bg-[#F2ECE1]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1 rounded-lg bg-[#1E3A2B] text-white text-xs font-bold shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl leading-relaxed text-[#1E3A2B] font-serif">
                    {sentenceText}
                  </p>
                )}
              </div>

              {/* Ready to Broadcast badge row */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F2ECE1] flex items-center justify-center text-[#1E3A2B]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1E3A2B] uppercase tracking-widest">
                      Ready to Broadcast
                    </span>
                    <span className="text-[11px] text-[#72786F]">
                      Voice: {selectedVoice} • {speed.toFixed(1)}x
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReweave}
                  className="text-xs text-[#C87A5B] hover:text-[#B56B4E] font-medium flex items-center gap-1 transition-colors"
                  title="Cycle alternate phrasing"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reweave</span>
                </button>
              </div>

              {/* Syntactic Bridge Explanation Box in Mauve supporting tint */}
              <div className="p-3.5 rounded-xl bg-[#F5ECEE] border border-[#ECD9DE] flex items-start gap-2.5">
                <BrainCircuit className="w-4 h-4 text-[#8D656E] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#8D656E] uppercase tracking-wider">
                    Syntactic Bridge
                  </span>
                  <p className="text-xs text-[#5C4249] mt-0.5 leading-relaxed">
                    {syntacticBridge}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-auto pt-6 border-t border-[#F2ECE1] grid grid-cols-2 gap-3">
              <button
                onClick={handleSpeakAloud}
                className="px-4 py-3.5 bg-[#1E3A2B] hover:bg-[#152A1F] text-white rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                id="btn-speak-aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Vaani Translation',
                      text: sentenceText,
                    }).catch(() => {});
                  } else {
                    handleCopy();
                  }
                }}
                className="px-4 py-3.5 bg-white border border-[#E3DAC9] text-[#1E3A2B] rounded-2xl font-bold text-sm shadow-xs hover:bg-[#FDFBF7] flex items-center justify-center gap-2 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-[#1E3A2B]" /> : <Share2 className="w-4 h-4" />}
                <span>{isCopied ? 'Copied' : 'Share'}</span>
              </button>
            </div>

          </div>

          {/* Session Recorded Bar */}
          <div className="flex items-center justify-between p-4 bg-[#F2ECE1]/60 rounded-2xl border border-[#E3DAC9]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1E3A2B] rounded-full"></div>
              <span className="text-[10px] uppercase font-bold text-[#1E3A2B] tracking-tighter">
                Session Recorded
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#72786F]">
              ID: VN-2025-819
            </span>
          </div>

          {/* Past Exchanges Mini Stream */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#1E3A2B] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#1E3A2B]" />
                <span>Recent Library Logs</span>
              </span>
              <span className="text-[11px] text-[#72786F]">Today • {conversationHistory.length} items</span>
            </div>

            {conversationHistory.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-1 hover:border-[#1E3A2B]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-[#72786F]">
                  <span>{item.time} • {item.tokens.length} signs</span>
                  <button
                    onClick={() => handleReplayPast(item.sentence)}
                    className="text-[#C87A5B] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Replay</span>
                  </button>
                </div>

                <p className="font-serif text-sm text-[#1E3A2B]">
                  {item.sentence}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 3. INTERACTIVE SIMULATION DOCK: TRY SAMPLE SIGNS */}
      <div className="w-full p-5 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E3] border border-[#E5B25D]/30 flex items-center justify-center text-[#E5B25D]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1E3A2B]">Simulate Sign Sequence</span>
            <span className="text-xs text-[#72786F]">
              Test the AI neural translation pipeline with sample sign streams
            </span>
          </div>
        </div>

        {/* Quick sample scenario triggers */}
        <div className="flex items-center flex-wrap gap-2">
          {Object.values(SIMULATION_SCENARIOS).map((scenario) => {
            const isSelected = currentScenario.key === scenario.key;
            return (
              <button
                key={scenario.key}
                onClick={() => {
  onSelectScenario(scenario);
  callTranslateAPI(scenario);
}}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs active:scale-95 ${
                  isSelected
                    ? 'bg-[#1E3A2B] text-white font-bold shadow-sm'
                    : 'bg-[#FDFBF7] text-[#1E3A2B] hover:bg-[#F2ECE1] border border-[#E3DAC9]'
                }`}
              >
                {scenario.buttonLabel}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
