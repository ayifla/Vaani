import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Smartphone, 
  Video, 
  VideoOff, 
  FlipHorizontal, 
  Sun, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Pause, 
  Play, 
  RefreshCw, 
  Edit3, 
  History, 
  BookOpen, 
  Settings, 
  Accessibility,
  Battery, 
  Wifi, 
  Signal, 
  ArrowRight,
  Hand,
  RotateCcw
} from 'lucide-react';
import { ConceptToken, ConversationExchange, MobileScreen, SimulationScenario } from '../types';
import { SIMULATION_SCENARIOS, PRACTICE_DICTIONARY, VOICE_OPTIONS } from '../data/mockData';
import { speakText } from '../utils/speech';

interface MobileAppMockupProps {
  onBackToWeb: () => void;
  currentScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  selectedVoice: string;
  speed: number;
  conversationHistory: ConversationExchange[];
  onShowToast: (message: string) => void;
}

export const MobileAppMockup: React.FC<MobileAppMockupProps> = ({
  onBackToWeb,
  currentScenario,
  onSelectScenario,
  selectedVoice,
  speed,
  conversationHistory,
  onShowToast,
}) => {
  // Mobile app tab navigation
  const [activeTab, setActiveTab] = useState<MobileScreen>('sign');

  // Handle ESC key to close overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToWeb();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onBackToWeb]);

  // Sign tab states
  const [mobileMode, setMobileMode] = useState<'camera' | 'demo'>('camera');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Reconstructed sentence & tokens
  const [tokens, setTokens] = useState<ConceptToken[]>(currentScenario.tokens);
  const [sentence, setSentence] = useState<string>(currentScenario.sentence);
  const [altIndex, setAltIndex] = useState<number>(0);

  useEffect(() => {
    setTokens(currentScenario.tokens);
    setSentence(currentScenario.sentence);
    setAltIndex(0);
  }, [currentScenario]);

  const handleSpeakAloud = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    speakText(sentence, {
      rate: speed,
      pitch: 1.05,
      voiceName: selectedVoice,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });

    onShowToast(`Mobile Voice: "${sentence.replace(/[“”"]/g, '')}"`);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(sentence.replace(/[“”]/g, ''));
    setIsCopied(true);
    onShowToast('Copied on mobile clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReweave = () => {
    const next = (altIndex + 1) % (currentScenario.alternates.length + 1);
    setAltIndex(next);
    if (next === 0) {
      setSentence(currentScenario.sentence);
    } else {
      setSentence(currentScenario.alternates[next - 1]);
    }
    onShowToast('Rewoven mobile phrasing');
  };

  const handleEdit = () => {
    const edit = prompt('Edit mobile translation phrasing:', sentence.replace(/[“”]/g, ''));
    if (edit && edit.trim()) {
      setSentence(`“${edit.trim()}”`);
      onShowToast('Updated phrasing');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      
      {/* Close button hint */}
      <button
        onClick={onBackToWeb}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all text-sm font-medium z-50"
      >
        Press ESC to close
      </button>

      {/* SMARTPHONE DEVICE CONTAINER - Centered */}
      <div className="relative w-[320px] h-[660px] max-h-[90vh] rounded-[42px] bg-[#1E2822] p-3 shadow-2xl border-[4px] border-[#2C3B32] flex flex-col justify-between shrink-0">
        
        {/* Phone Side Buttons Visual Mockup */}
        <div className="absolute -left-[6px] top-24 w-[3px] h-6 bg-[#2C3B32] rounded-l" />
        <div className="absolute -left-[6px] top-32 w-[3px] h-10 bg-[#2C3B32] rounded-l" />
        <div className="absolute -left-[6px] top-44 w-[3px] h-10 bg-[#2C3B32] rounded-l" />
        <div className="absolute -right-[6px] top-30 w-[3px] h-12 bg-[#2C3B32] rounded-r" />

        {/* Dynamic Island / Top Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
          <div className="w-2 h-2 rounded-full bg-[#152019] flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#2C3B32]" />
          </div>
          <div className="w-2 h-2 rounded-full bg-[#152019]" />
        </div>

        {/* INNER SMARTPHONE SCREEN */}
        <div className="w-full h-full rounded-[34px] bg-[#FDFBF7] overflow-hidden flex flex-col relative text-[#343832]">
          
          {/* Mobile Status Bar (9:41, Wi-Fi, 5G, Battery) */}
          <div className="h-9 w-full px-6 pt-1.5 flex items-center justify-between text-[10px] font-semibold text-[#1E3A2B] select-none z-30 shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-2.5 h-2.5 text-[#1E3A2B]" />
              <Wifi className="w-2.5 h-2.5 text-[#1E3A2B]" />
              <Battery className="w-3 h-3 text-[#1E3A2B]" />
            </div>
          </div>

          {/* MOBILE APP HEADER */}
          <div className="h-11 px-3 flex items-center justify-between border-b border-[#E3DAC9] bg-white/95 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#1E3A2B] flex items-center justify-center">
                <Hand className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1E3A2B] leading-none">Vaani</span>
                <span className="text-[10px] text-[#C87A5B] leading-tight font-medium">Sign</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF3EE] border border-[#D5E4DB]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2B] animate-pulse" />
                <span className="text-[10px] font-bold text-[#1E3A2B]">60FPS</span>
              </div>

              <button
                onClick={() => onShowToast('Accessibility options active')}
                className="w-7 h-7 rounded-full bg-[#F2ECE1] text-[#1E3A2B] flex items-center justify-center border border-[#E3DAC9]"
              >
                <Accessibility className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE MOBILE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
            
            {/* TAB 1: SIGN (MAIN CAMERA WORKSPACE) */}
            {activeTab === 'sign' && (
              <div className="flex flex-col gap-3 p-3">
                
                {/* Segmented Mode Switcher & Voice Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex bg-[#F2ECE1] p-0.5 rounded-full border border-[#E3DAC9]">
                    <button
                      onClick={() => setMobileMode('camera')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        mobileMode === 'camera'
                          ? 'bg-[#1E3A2B] text-white shadow-xs'
                          : 'text-[#72786F]'
                      }`}
                    >
                      Live Camera
                    </button>
                    <button
                      onClick={() => setMobileMode('demo')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        mobileMode === 'demo'
                          ? 'bg-[#1E3A2B] text-white shadow-xs'
                          : 'text-[#72786F]'
                      }`}
                    >
                      Simulate Demo
                    </button>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E3DAC9] text-[10px] text-[#1E3A2B] font-semibold">
                    <Volume2 className="w-3 h-3" />
                    <span className="truncate max-w-[85px]">{selectedVoice}</span>
                  </div>
                </div>

                {/* Quick Simulation Chips Strip (Shown in Demo mode) */}
                {mobileMode === 'demo' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {Object.values(SIMULATION_SCENARIOS).map((scen) => (
                      <button
                        key={scen.key}
                        onClick={() => {
                          onSelectScenario(scen);
                          onShowToast(`Simulating: ${scen.buttonLabel}`);
                        }}
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                          currentScenario.key === scen.key
                            ? 'bg-[#1E3A2B] text-white border-[#1E3A2B] shadow-xs'
                            : 'bg-white text-[#1E3A2B] border-[#E3DAC9]'
                        }`}
                      >
                        ⚡ {scen.tokens.map((t) => t.word).slice(0, 2).join(' ')}...
                      </button>
                    ))}
                  </div>
                )}

                {/* 1. Mobile Signing Viewfinder */}
                <div className="relative w-full aspect-[4/3] rounded-[1.25rem] overflow-hidden bg-[#152019] border border-white shadow-md">
                  <img
                    alt="Camera feed of signing hands"
                    className={`w-full h-full object-cover select-none ${isMirrored ? 'scale-x-[-1]' : ''} ${isFrozen ? 'filter brightness-75' : ''}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7L_BctFp2Go_GIN6d_xL2c560XyTq1wWlkE1WEy7G8rJtiHFMijTWmK0JjC9rngxSMhR_ZyjL-0Q8YnEB9GMfEnrdTDfvaSCxXb24TMZgVMjnx8CorSsAJXYDcVSkmunluH_uXyTJzdj8imKFFPHxGqrB40WhVDAkYdLbIECDT0LBx3GIectC-YLvm2m4m3BkSAh-btiJs3kFywbtrNJhEzFbfe8IWGLWf6oC_WfzNCXFbF-V0ChRw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152019]/90 via-transparent to-[#152019]/30 pointer-events-none" />

                  {/* AR Hand Tracking Lattice Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                    <path
                      d="M140,210 L155,160 L180,120 L210,135 L225,185 L180,225 Z"
                      fill="rgba(30,58,43,0.2)"
                      stroke="#E3DAC9"
                      strokeDasharray="3 2"
                      strokeWidth="1.2"
                      className="animate-pulse"
                    />
                    <path d="M210,135 L245,100 L275,130 L250,170" fill="none" stroke="#C87A5B" strokeWidth="1.5" />
                    <circle cx="165" cy="90" r="3.5" fill="#E3DAC9" />
                    <circle cx="245" cy="100" r="4.5" fill="#C87A5B" className="animate-pulse" />
                    <circle cx="275" cy="130" r="3" fill="#E3DAC9" />
                    <circle cx="210" cy="135" r="3.5" fill="#E5B25D" />
                  </svg>

                  {/* Top HUD Float Bar */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none text-[10px]">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5B25D] animate-ping" />
                      <span>TRACKING</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      <Sun className="w-3 h-3 text-[#E5B25D]" />
                      <span>Optimal Lux</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white font-bold">{tokens.length} Signs</span>
                    </div>
                  </div>

                  {/* Right Action Rail (Flip, Flash, Freeze) */}
                  <div className="absolute right-2 top-10 flex flex-col gap-1.5">
                    <button
                      onClick={() => setIsMirrored(!isMirrored)}
                      className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-md active:scale-90 border border-white/20"
                      title="Flip Camera"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setIsFlashOn(!isFlashOn);
                        onShowToast(isFlashOn ? 'Flash Off' : 'Flash On');
                      }}
                      className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 border border-white/20 ${
                        isFlashOn ? 'bg-[#1E3A2B] text-white' : 'bg-white/20 text-white'
                      }`}
                      title="Assist Light"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setIsFrozen(!isFrozen);
                        onShowToast(isFrozen ? 'Feed Resumed' : 'Feed Frozen');
                      }}
                      className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 border border-white/20 ${
                        isFrozen ? 'bg-[#C87A5B] text-white' : 'bg-white/20 text-white'
                      }`}
                      title="Freeze Stream"
                    >
                      {isFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Live Recognized Sign Badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B25D]" />
                    <span className="text-white/70">Gesture:</span>
                    <span className="font-bold text-white">
                      {tokens.length > 0 ? `"${tokens[tokens.length - 1].word}"` : '"idle"'}
                    </span>
                    <span className="text-white/60">0.2s</span>
                  </div>
                </div>

                {/* 2. Spatial Gloss Stream (Horizontal Scrollable Tokens) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="uppercase tracking-wider text-[#72786F] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E5B25D]" />
                      Spatial Gloss Stream
                    </span>
                    <span className="text-[#1E3A2B] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2B]" />
                      Synchronized
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {tokens.map((tok, idx) => {
                      const isLast = idx === tokens.length - 1;
                      return (
                        <React.Fragment key={tok.id}>
                          <div
                            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs shadow-xs ${
                              isLast
                                ? 'bg-[#1E3A2B] text-white font-bold'
                                : 'bg-white border border-[#E3DAC9] text-[#1E3A2B]'
                            }`}
                          >
                            <span>{tok.word}</span>
                            <span className={`text-[9px] ${isLast ? 'text-white/70' : 'text-[#9DA39A]'}`}>{tok.time}</span>
                          </div>
                          {idx < tokens.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-[#9DA39A] shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* 3. The Reconstructed Translation Card */}
                <div className="relative rounded-2xl bg-white p-4 border border-[#E3DAC9] shadow-xs flex flex-col gap-2 overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#1E3A2B]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Intent Synthesis</span>
                    </div>
                    <span className="text-[10px] text-[#C87A5B] bg-[#FAF0EB] px-2 py-0.5 rounded-full border border-[#F2D7CB] font-semibold">
                      99.4% Certainty
                    </span>
                  </div>

                  <p className="font-serif text-lg text-[#1E3A2B] leading-snug">
                    {sentence}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] bg-[#F2ECE1] text-[#1E3A2B] px-2 py-0.5 rounded-full border border-[#E3DAC9]">
                      Tone: Casual & Direct
                    </span>
                    <span className="text-[10px] bg-[#F2ECE1] text-[#1E3A2B] px-2 py-0.5 rounded-full border border-[#E3DAC9]">
                      ASL Topicalized
                    </span>
                  </div>
                </div>

                {/* 4. Primary Speak Aloud Button */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSpeakAloud}
                    className="w-full h-12 rounded-2xl bg-[#1E3A2B] hover:bg-[#152A1F] text-white font-bold text-base flex items-center justify-between px-5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-white" />
                      <span>{isSpeaking ? 'Speaking Voice...' : 'Speak'}</span>
                    </div>

                    {/* Audio Waveform */}
                    <div className="flex items-center gap-1 h-4">
                      <span className={`w-1 rounded-full bg-white transition-all ${isSpeaking ? 'h-4 animate-pulse' : 'h-2'}`} />
                      <span className={`w-1 rounded-full bg-white transition-all ${isSpeaking ? 'h-5 animate-pulse' : 'h-3'}`} />
                      <span className={`w-1 rounded-full bg-white transition-all ${isSpeaking ? 'h-4 animate-pulse' : 'h-2'}`} />
                      <span className={`w-1 rounded-full bg-white transition-all ${isSpeaking ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                    </div>
                  </button>

                  {/* Utility Button Row: Reweave, Edit, Copy */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleReweave}
                      className="py-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#E3DAC9] text-xs font-semibold text-[#1E3A2B] flex items-center justify-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#C87A5B]" />
                      <span>Reweave</span>
                    </button>

                    <button
                      onClick={handleEdit}
                      className="py-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#E3DAC9] text-xs font-semibold text-[#1E3A2B] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#1E3A2B]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="py-2 rounded-xl bg-white hover:bg-[#F2ECE1] border border-[#E3DAC9] text-xs font-semibold text-[#1E3A2B] flex items-center justify-center gap-1 transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#1E3A2B]" /> : <Copy className="w-3.5 h-3.5 text-[#1E3A2B]" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* 5. Previous Phrase Quick Drawer */}
                <div className="rounded-xl bg-white p-2.5 border border-[#E3DAC9] flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#F2ECE1] flex items-center justify-center text-[#1E3A2B] shrink-0">
                      <History className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-[#72786F]">Previous phrase • 10:14 AM</span>
                      <p className="text-xs text-[#1E3A2B] truncate font-serif">
                        “Could you repeat the assignment deadlines for Friday?”
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      speakText('Could you repeat the assignment deadlines for Friday?', {
                        rate: speed,
                        voiceName: selectedVoice,
                      });
                      onShowToast('Replaying 10:14 AM phrase');
                    }}
                    className="w-7 h-7 rounded-full bg-[#F2ECE1] text-[#1E3A2B] flex items-center justify-center shrink-0 border border-[#E3DAC9]"
                    title="Replay"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: HISTORY (MOBILE) */}
            {activeTab === 'history' && (
              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#E3DAC9]">
                  <h3 className="text-sm font-bold text-[#1E3A2B]">Logged Conversations</h3>
                  <span className="text-xs text-[#1E3A2B] font-semibold">{conversationHistory.length} saved</span>
                </div>

                <div className="flex flex-col gap-2">
                  {conversationHistory.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-white border border-[#E3DAC9] flex flex-col gap-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#72786F]">
                        <span>{item.time} • {item.tokens.length} signs</span>
                        <span className="text-[#C87A5B] font-bold">{item.confidence}</span>
                      </div>
                      <p className="font-serif text-sm text-[#1E3A2B]">{item.sentence}</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-[#72786F] truncate max-w-[200px]">{item.tokens.join(' • ')}</span>
                        <button
                          onClick={() => {
                            speakText(item.sentence, { rate: speed, voiceName: selectedVoice });
                            onShowToast(`Replaying: ${item.sentence}`);
                          }}
                          className="text-[#C87A5B] flex items-center gap-1 font-bold"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Replay</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PRACTICE (MOBILE) */}
            {activeTab === 'practice' && (
              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#E3DAC9]">
                  <h3 className="text-sm font-bold text-[#1E3A2B]">Sign Flashcard Trainer</h3>
                  <span className="text-xs text-[#1E3A2B] font-bold">91% Mastery</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {PRACTICE_DICTIONARY.map((w) => (
                    <div key={w.id} className="p-3 rounded-xl bg-white border border-[#E3DAC9] flex flex-col gap-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1E3A2B]">{w.signName}</span>
                        <span className="text-xs font-bold text-[#C87A5B]">{w.masteryScore}%</span>
                      </div>
                      <span className="text-xs text-[#1E3A2B] font-mono">{w.gloss}</span>
                      <p className="text-[11px] text-[#72786F] mt-0.5">{w.handshape}</p>
                      <button
                        onClick={() => {
                          speakText(w.exampleSentence, { rate: speed, voiceName: selectedVoice });
                          onShowToast(`Sample audio: ${w.signName}`);
                        }}
                        className="mt-1 py-1.5 rounded-lg bg-[#F2ECE1] text-xs text-[#1E3A2B] font-semibold text-center border border-[#E3DAC9]"
                      >
                        Audition Sign Sentence
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS (MOBILE) */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-3 p-3">
                <div className="flex items-center justify-between pb-1 border-b border-[#E3DAC9]">
                  <h3 className="text-sm font-bold text-[#1E3A2B]">Mobile Preferences</h3>
                  <span className="text-xs text-[#72786F]">v1.4</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E3DAC9] flex flex-col gap-2 shadow-xs">
                  <span className="text-xs font-bold text-[#1E3A2B]">Synthesizer Voice Profile</span>
                  <div className="flex flex-col gap-1.5">
                    {VOICE_OPTIONS.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onShowToast(`Mobile Voice: ${v.name}`)}
                        className={`p-2 rounded-lg text-left text-xs flex items-center justify-between ${
                          selectedVoice === v.name
                            ? 'bg-[#F2ECE1] text-[#1E3A2B] font-semibold border border-[#1E3A2B]'
                            : 'bg-[#FDFBF7] text-[#343832] border border-[#E3DAC9]'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="text-[10px] text-[#72786F]">{v.gender}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E3DAC9] flex flex-col gap-1 shadow-xs">
                  <span className="text-xs font-bold text-[#1E3A2B]">Haptic Gesture Vibration</span>
                  <p className="text-[11px] text-[#72786F]">Vibrate on successful landmark detection lock</p>
                </div>
              </div>
            )}

          </div>

          {/* MOBILE BOTTOM NAVIGATION DOCK (FIXED INSIDE PHONE) */}
          <div className="absolute bottom-0 w-full h-16 bg-white/95 backdrop-blur-xl border-t border-[#E3DAC9] px-4 flex items-center justify-around z-30">
            
            <button
              onClick={() => setActiveTab('sign')}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] transition-colors ${
                activeTab === 'sign' ? 'text-[#1E3A2B]' : 'text-[#9DA39A] hover:text-[#1E3A2B]'
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="text-[10px] font-bold">Sign</span>
              {activeTab === 'sign' && <span className="w-1 h-1 rounded-full bg-[#1E3A2B]" />}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] transition-colors ${
                activeTab === 'history' ? 'text-[#1E3A2B]' : 'text-[#9DA39A] hover:text-[#1E3A2B]'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="text-[10px] font-bold">History</span>
              {activeTab === 'history' && <span className="w-1 h-1 rounded-full bg-[#1E3A2B]" />}
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] transition-colors ${
                activeTab === 'practice' ? 'text-[#1E3A2B]' : 'text-[#9DA39A] hover:text-[#1E3A2B]'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-bold">Practice</span>
              {activeTab === 'practice' && <span className="w-1 h-1 rounded-full bg-[#1E3A2B]" />}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] transition-colors ${
                activeTab === 'settings' ? 'text-[#1E3A2B]' : 'text-[#9DA39A] hover:text-[#1E3A2B]'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-bold">Settings</span>
              {activeTab === 'settings' && <span className="w-1 h-1 rounded-full bg-[#1E3A2B]" />}
            </button>

          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1E3A2B]/30 rounded-full z-40 pointer-events-none" />

        </div>

      </div>

    </div>
  );
};
