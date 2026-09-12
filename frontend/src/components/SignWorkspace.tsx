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
  Lightbulb,
  Gauge,
  Mic2,
  ChevronUp
} from 'lucide-react';
import { ConceptToken, ConversationExchange, SimulationScenario } from '../types';
import { SIMULATION_SCENARIOS } from '../data/mockData';
import { speakText } from '../utils/speech';

interface SignWorkspaceProps {
  currentScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  conversationHistory: ConversationExchange[];
  onAddExchange: (exchange: ConversationExchange) => void;
  onShowToast: (message: string) => void;
  onSelectScreen: (screen: string) => void;
}

export const SignWorkspace: React.FC<SignWorkspaceProps> = ({
  currentScenario,
  onSelectScenario,
  conversationHistory,
  onAddExchange,
  onShowToast,
  onSelectScreen,
}) => {
  // Vision & Camera states
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [assistiveLight, setAssistiveLight] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [sensitivity, setSensitivity] = useState<'High' | 'Normal' | 'Strict'>('High');
  const [registerMode, setRegisterMode] = useState<'Casual' | 'Academic' | 'Medical'>('Casual');
  const [dialect, setDialect] = useState<string>('ISL / ASL Dual');

  // Context Popover state
  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const onShowToastRef = useRef(onShowToast);
  onShowToastRef.current = onShowToast;

  // Voice & Speech state (local, no longer from props)
  const [selectedVoice, setSelectedVoice] = useState<'Mira' | 'Rian'>('Mira');
  const [speed, setSpeed] = useState<number>(1.0);

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
          setIsCameraActive(false);
          onShowToastRef.current('Webcam unavailable. Switched to high-fidelity simulated camera feed.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLiveCamera, isCameraActive]);

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

    // Map friendly voice names to actual SpeechSynthesis voice preferences
    const voiceMap: Record<string, string[]> = {
      Mira: ['Samantha', 'Karen', 'Google UK English Female', 'Google US English Female', 'Microsoft Zira'],
      Rian: ['Daniel', 'Google UK English Male', 'Google US English Male', 'Microsoft David'],
    };
    const preferredNames = voiceMap[selectedVoice] || voiceMap.Mira;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith('en') && preferredNames.some((n) => v.name.includes(n)));

    speakText(sentenceText, {
      rate: speed,
      pitch: 1.05,
      voiceName: voice?.name,
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

  const handleReplayPast = (phrase: string) => {
    // Map friendly voice names to actual SpeechSynthesis voice preferences
    const voiceMap: Record<string, string[]> = {
      Mira: ['Samantha', 'Karen', 'Google UK English Female', 'Google US English Female', 'Microsoft Zira'],
      Rian: ['Daniel', 'Google UK English Male', 'Google US English Male', 'Microsoft David'],
    };
    const preferredNames = voiceMap[selectedVoice] || voiceMap.Mira;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith('en') && preferredNames.some((n) => v.name.includes(n)));

    speakText(phrase, {
      rate: speed,
      pitch: 1.05,
      voiceName: voice?.name,
    });
    onShowToast(`Replaying: ${phrase}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-1 lg:py-2 max-w-[1600px] mx-auto flex flex-col gap-3 lg:gap-4 font-sans text-[#343832]">
      
      {/* 2. TWO COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
        
        {/* LEFT COLUMN: SPATIAL CAMERA VISION HUD (7 COLUMNS) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif italic text-[#1E3A2B]">
              Sign
            </h2>
            <div className="flex items-center gap-2">
              {isLiveCamera && isCameraActive && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E7EFEA]/60 text-[#1E3A2B] rounded-full text-[10px] font-semibold uppercase border border-[#CDE0D4]/60">
                  <span className="w-1.5 h-1.5 bg-[#1E3A2B] rounded-full animate-pulse"></span>
                  Camera Active
                </span>
              )}
              {/* Camera Toggle Button */}
              <button
                onClick={() => {
                  if (isLiveCamera && isCameraActive) {
                    setIsLiveCamera(false);
                    setIsCameraActive(false);
                    onShowToast('Camera stopped');
                  } else {
                    setIsLiveCamera(true);
                    setIsCameraActive(true);
                    onShowToast('Starting camera...');
                  }
                }}
                className={`p-2 rounded-xl transition-colors flex items-center justify-center ${
                  isLiveCamera && isCameraActive
                    ? 'bg-[#1E3A2B] text-white hover:bg-[#152A1F]'
                    : 'bg-[#F2ECE1] text-[#1E3A2B] hover:bg-[#EBE3D4] border border-[#E3DAC9]'
                }`}
                title={isLiveCamera && isCameraActive ? 'Stop Camera' : 'Start Camera'}
                aria-label={isLiveCamera && isCameraActive ? 'Stop Camera' : 'Start Camera'}
              >
                {isLiveCamera && isCameraActive ? (
                  <VideoOff className="w-4 h-4" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Camera Viewport Container with Forest Slate backdrop */}
          <div className="relative w-full rounded-[32px] overflow-hidden bg-[#152019] border-4 border-white shadow-xl aspect-[16/9]">
            
            {/* Real Live Camera Feed - only when active */}
            {isLiveCamera && isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover select-none ${isMirrored ? 'scale-x-[-1]' : ''}`}
              />
            ) : (
              <div className="absolute inset-0 bg-[#152019] flex flex-col items-center justify-center text-white gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-white/60" />
                </div>
                <div className="text-center px-6">
                  <p className="text-lg font-medium text-white">Camera Off</p>
                  <p className="text-sm text-white/60 mt-1">Allow camera access to begin signing</p>
                </div>
                <button
                  onClick={() => {
                    setIsLiveCamera(true);
                    setIsCameraActive(true);
                  }}
                  className="px-6 py-3 rounded-full bg-[#1E3A2B] text-white text-sm font-semibold shadow-lg hover:bg-[#152A1F] transition-colors flex items-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Start Camera</span>
                </button>
              </div>
            )}

            {/* Subtle Vignette Overlay - only when camera active */}
            {isLiveCamera && isCameraActive && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#152019]/90 via-transparent to-[#152019]/40 pointer-events-none" />
            )}

            {/* AR Skeletal Tracking Overlay - only when camera active */}
            {isLiveCamera && isCameraActive && (
              <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between">
                
                {/* Top Row: Detection Badges */}
                <div className="flex justify-between items-start">
                  <div className="px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-[10px] border border-white/15 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B25D] animate-pulse" />
                    <span>Tracking: <strong className="text-[#E5B25D]">99%</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <div className="px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-[10px] border border-white/15">
                      <span className="text-[#E5B25D] font-bold">Hand OK</span>
                    </div>
                    <div className="hidden sm:block px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-[10px] border border-white/15">
                      <span className="text-[#E7EFEA] font-bold">Optimal Light</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Skeletal Hand Mesh Landmarks Overlay */}
                {showLandmarks && (
                  <div className="relative w-full h-32 flex items-center justify-center pointer-events-none">
                    <svg className="w-full h-full max-w-sm opacity-70" viewBox="0 0 300 120" fill="none">
                      {/* Interconnected Neural Filaments */}
                      <path
                        d="M60,95 L85,60 L120,40 L150,55 L180,35 L210,65 L235,95"
                        stroke="#E3DAC9"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="opacity-50"
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
                      <circle cx="145" cy="5" r="14" stroke="#C87A5B" strokeWidth="1.5" className="animate-ping opacity-40" />
                    </svg>
                  </div>
                )}

                {/* Bottom Spatial Guidance Banner */}
                <div className="flex justify-between items-end">
                  <div className="px-3 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-[10px] border border-white/15 flex items-center gap-1.5">
                    <Hand className="w-3 h-3 text-white/80" />
                    <span className="text-white/90">Position hands within frame</span>
                  </div>

                  <div className="hidden sm:block text-[9px] text-white/50 font-mono">
                    FPS: 60 • 42ms
                  </div>
                </div>

              </div>
            )}

            {/* Active Recognizing Strip at Bottom of Camera Viewport - only when camera active */}
            {isLiveCamera && isCameraActive && (
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[#152019] via-[#152019]/85 to-transparent flex items-center justify-between text-white">
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
            )}

          </div>

          {/* Camera Tactile Control Bar - only when camera active */}
          {isLiveCamera && isCameraActive && (
            <div className="w-full flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E3DAC9] shadow-xs">
              
              {/* Viewport tool icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsLiveCamera(false);
                    setIsCameraActive(false);
                    onShowToast('Camera stopped');
                  }}
                  className="p-2.5 rounded-xl bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] border border-[#E3DAC9] transition-colors"
                  title="Stop Camera"
                >
                  <VideoOff className="w-4 h-4 text-[#9DA39A]" />
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

              {/* Sensitivity */}
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
              </div>

          </div>
)}

        </div>

        {/* RIGHT COLUMN: THE UNDERSTANDING MOMENT & COMMUNICATION CANVAS (5 COLUMNS) */}
        <div className="lg:col-span-5 flex flex-col">
          
          {/* UNIFIED UNDERSTAND + COMMUNICATE SECTION */}
          <div className="bg-white border border-[#E3DAC9] rounded-[32px] p-5 flex flex-col gap-4 shadow-md">
            
            {/* UNDERSTAND HEADING & CONTROLS */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-[#E3DAC9]/40">
              <h2 className="text-xl font-serif italic text-[#1E3A2B]">Understand</h2>
              <div className="flex items-center gap-2">
                {/* Clear Button */}
                <button
                  onClick={handleClearTokens}
                  className="text-xs text-[#72786F] hover:text-[#C87A5B] transition-colors flex items-center gap-1"
                  title="Clear tokens"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
                {/* Context Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsContextOpen(!isContextOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] text-xs font-semibold border border-[#E3DAC9] transition-colors whitespace-nowrap"
                    title="Translation Context"
                    aria-expanded={isContextOpen}
                    aria-haspopup="true"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Context</span>
                    <span className="text-[10px] text-[#72786F] font-medium hidden sm:inline">({registerMode})</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isContextOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Context Popover */}
                  {isContextOpen && (
                    <div className="absolute right-0 top-full mt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                      <div className="bg-white border border-[#E3DAC9] rounded-xl shadow-lg p-1.5 min-w-[140px]">
                        {(['Casual', 'Academic', 'Medical'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => {
                              setRegisterMode(mode);
                              setIsContextOpen(false);
                              onShowToast(`Switched translation register to ${mode}`);
                            }}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              registerMode === mode
                                ? 'bg-[#1E3A2B] text-white'
                                : 'text-[#343832] hover:bg-[#F2ECE1]'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                      <div className="absolute right-2 -top-1 w-2 h-2 bg-white border-l border-t border-[#E3DAC9] rotate-45" />
                    </div>
                  )}

                  {/* Click outside to close */}
                  {isContextOpen && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsContextOpen(false)}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Concept Chips */}
            <div className="flex flex-wrap gap-1.5 items-center min-h-[32px]">
              {tokens.length === 0 ? (
                <div className="text-[11px] text-[#9DA39A] py-1 italic font-medium leading-relaxed">
                  Reconstructing sign intent into natural syntax...
                </div>
              ) : (
                tokens.map((token, index) => {
                  const isLast = index === tokens.length - 1;
                  return (
                    <React.Fragment key={token.id}>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                          isLast
                            ? 'bg-[#1E3A2B] text-white shadow-xs'
                            : 'bg-white border border-[#E3DAC9] text-[#1E3A2B] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <span>{token.word}</span>
                        <span className={`text-[9px] ${isLast ? 'text-white/70' : 'text-[#9DA39A]'}`}>
                          {token.time}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveToken(token.id);
                          }}
                          className="hover:opacity-80 transition-opacity ml-0.5"
                          title="Remove concept"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>

                      {index < tokens.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-[#9DA39A] shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* COMMUNICATE HEADING & CERTAINTY */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E3DAC9]/40">
              <h2 className="text-xl font-serif italic text-[#1E3A2B]">Communicate</h2>
              <span className="px-3 py-1 rounded-full bg-[#FAF0EB] text-[#C87A5B] border border-[#F2D7CB] text-xs font-bold">
                {certainty} Certainty
              </span>
            </div>

            {/* Synthesized Sentence - Direct Display */}
            <div className="py-2">
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

            {/* Voice & Speed Controls Row */}
            <div className="pt-3 border-t border-[#E3DAC9]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                  {/* Voice Selector - Custom Dropdown */}
                  <div className="relative">
                    <button
                      ref={dropdownRef}
                      onClick={() => setIsVoiceOpen(!isVoiceOpen)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#FAF3E3] rounded-xl border border-[#F2D7CB] transition-colors"
                      aria-expanded={isVoiceOpen}
                      aria-haspopup="listbox"
                    >
                      <Mic2 className="w-4 h-4 text-[#C87A5B] shrink-0" />
                      <span className="text-sm font-medium text-[#1E3A2B]">{selectedVoice}</span>
                      <ChevronDown className={`w-4 h-4 text-[#72786F] transition-transform ${isVoiceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isVoiceOpen && (
                      <div className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-150" style={{
                        top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
                        right: dropdownRef.current ? window.innerWidth - dropdownRef.current.getBoundingClientRect().right : 0
                      }}>
                        <div className="bg-white border border-[#E3DAC9] rounded-xl shadow-lg py-1 min-w-[140px]">
                          {(['Mira', 'Rian'] as const).map((voice) => (
                            <button
                              key={voice}
                              onClick={() => {
                                setSelectedVoice(voice);
                                setIsVoiceOpen(false);
                                onShowToast(`Voice changed to ${voice}`);
                              }}
                              className={`w-full px-3 py-2 text-sm font-medium text-left transition-colors ${
                                selectedVoice === voice
                                  ? 'bg-[#1E3A2B] text-white'
                                  : 'text-[#343832] hover:bg-[#F2ECE1]'
                              }`}
                            >
                              {voice}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {isVoiceOpen && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsVoiceOpen(false)}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Speed Slider - Clean Track with Green Knob */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F2ECE1] rounded-xl border border-[#E3DAC9] min-w-[200px]">
                    <Gauge className="w-4 h-4 text-[#1E3A2B] shrink-0" />
                    <div className="flex-1 relative" style={{ height: '28px' }}>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-full h-full appearance-none bg-transparent cursor-pointer"
                        aria-label="Speech speed"
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center">
                        <div className="w-full h-2 bg-[#E3DAC9] rounded-full" />
                      </div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ left: `${((speed - 0.5) / 1.5) * 100}%` }}
                      >
                        <div className="w-5 h-5 bg-[#1E3A2B] rounded-full shadow-lg -translate-x-1/2 border-2 border-white" />
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#72786F] w-12 text-right">{speed.toFixed(1)}x</span>
                  </div>
                </div>

                {/* Rephrase Button */}
                <button
                  onClick={handleReweave}
                  className="text-xs text-[#C87A5B] hover:text-[#B56B4E] font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                  title="Cycle alternate phrasing"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rephrase</span>
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-[#E3DAC9]/40 grid grid-cols-2 gap-3">
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

            {/* Recent Library Logs - compact */}
            <div className="pt-3 border-t border-[#E3DAC9]/40">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-xs font-bold text-[#1E3A2B] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#1E3A2B]" />
                  <span>Recent Library Logs</span>
                </span>
                <button
                  onClick={() => onSelectScreen?.('conversation-history')}
                  className="text-[11px] text-[#C87A5B] hover:underline flex items-center gap-0.5 font-medium"
                >
                  <span>View all in Library</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {conversationHistory.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-white border border-[#E3DAC9]/50 shadow-xs flex flex-col gap-1 hover:border-[#1E3A2B]/40 transition-colors"
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

    </div>
  </div>
  );
};
