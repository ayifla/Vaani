import React from 'react';
import { 
  Sliders, 
  Volume2, 
  Contrast, 
  Hand, 
  Sparkles, 
  Check, 
  Cpu
} from 'lucide-react';
import { VOICE_OPTIONS } from '../data/mockData';
import { speakText } from '../utils/speech';

interface SettingsViewProps {
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  contrastMode: boolean;
  onToggleContrast: () => void;
  onShowToast: (message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedVoice,
  onSelectVoice,
  speed,
  onSetSpeed,
  contrastMode,
  onToggleContrast,
  onShowToast,
}) => {
  const [dialect, setDialect] = React.useState('ISL / ASL Dual');
  const [autoSpeak, setAutoSpeak] = React.useState(false);
  const [lowLightBoost, setLowLightBoost] = React.useState(true);
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  const [fontSize, setFontSize] = React.useState<'Standard' | 'Large' | 'Extra Large'>('Standard');

  const handleTestVoice = (voiceName: string) => {
    speakText('Hello, this is Vaani testing your vocal synthesizer output.', {
      rate: speed,
      pitch: 1.05,
      voiceName,
    });
    onShowToast(`Testing voice: ${voiceName}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto flex flex-col gap-6 text-[#343832]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1E3A2B]">Engine & Accessibility Settings</h1>
          <p className="text-xs text-[#72786F] mt-1 font-medium">
            Configure spatial vision parameters, synthetic voice models, and dialect engines
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-[#EBF3EE] border border-[#D5E4DB] text-[#1E3A2B] text-xs font-bold">
          v1.4 Neural Ready
        </div>
      </div>

      {/* 1. Sign Language Dialect Engine */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-[#1E3A2B]" />
          <h2 className="text-base font-serif font-bold text-[#1E3A2B]">Sign Language Dialect Engine</h2>
        </div>
        <p className="text-xs text-[#72786F]">
          Select the sign language morphology and grammar parser. Vaani supports real-time multi-dialect blending.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'ISL / ASL Dual', name: 'ISL / ASL Dual Blend', desc: 'Auto-detects between Indian Sign Language and American Sign Language' },
            { id: 'ASL Standard', name: 'ASL Topicalized', desc: 'American Sign Language with topic-comment grammatical order' },
            { id: 'ISL Standard', name: 'ISL Standard', desc: 'Indian Sign Language regional lexicon and two-handed alphabets' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setDialect(item.id);
                onShowToast(`Dialect updated: ${item.name}`);
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                dialect === item.id
                  ? 'bg-[#F2ECE1] border-[#1E3A2B] text-[#1E3A2B] shadow-xs'
                  : 'bg-[#FDFBF7] border-[#E3DAC9] text-[#343832] hover:bg-[#F2ECE1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E3A2B]">{item.name}</span>
                {dialect === item.id && <Check className="w-4 h-4 text-[#1E3A2B]" />}
              </div>
              <span className="text-[11px] text-[#72786F] leading-relaxed">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Synthetic Voice Profile */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#1E3A2B]" />
            <h2 className="text-base font-serif font-bold text-[#1E3A2B]">Synthesizer Voice Profile</h2>
          </div>
          <span className="text-xs text-[#C87A5B] font-semibold">Web Speech & Neural Audio</span>
        </div>
        <p className="text-xs text-[#72786F]">
          Choose the vocal timbre and cadence that represents your voice when communicating aloud.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {VOICE_OPTIONS.map((voice) => {
            const isSelected = selectedVoice === voice.name;
            return (
              <div
                key={voice.id}
                onClick={() => {
                  onSelectVoice(voice.name);
                  onShowToast(`Selected voice: ${voice.name}`);
                }}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-2 transition-all ${
                  isSelected
                    ? 'bg-[#F2ECE1] border-[#1E3A2B] shadow-xs'
                    : 'bg-[#FDFBF7] border-[#E3DAC9] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E3A2B]">{voice.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5ECEE] text-[10px] font-semibold text-[#8D656E] border border-[#ECD9DE]">
                      {voice.gender}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1E3A2B]" />}
                </div>

                <span className="text-xs text-[#72786F]">{voice.tone}</span>

                <div className="flex items-center justify-between pt-1 mt-auto">
                  <span className="text-[10px] text-[#9DA39A]">{voice.description}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoice(voice.name);
                    }}
                    className="px-3 py-1 rounded-full bg-white hover:bg-[#1E3A2B] text-[#1E3A2B] hover:text-white text-xs font-semibold border border-[#E3DAC9] transition-colors"
                  >
                    Audition
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speech Speed Slider */}
        <div className="mt-3 p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1E3A2B]">Speech Rate / Speed</span>
            <span className="font-bold text-[#1E3A2B]">{speed.toFixed(1)}x Normal</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.1"
            value={speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#1E3A2B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#9DA39A]">
            <span>0.7x (Deliberate)</span>
            <span>1.0x (Standard)</span>
            <span>1.5x (Rapid)</span>
          </div>
        </div>

        {/* Auto speak toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9] mt-1">
          <div>
            <span className="text-sm font-semibold text-[#1E3A2B]">Auto-Speak on Full Sentence</span>
            <p className="text-xs text-[#72786F]">Automatically trigger voice synthesis once punctuation lock is reached</p>
          </div>
          <button
            onClick={() => {
              setAutoSpeak(!autoSpeak);
              onShowToast(autoSpeak ? 'Auto-speak disabled' : 'Auto-speak enabled');
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              autoSpeak ? 'bg-[#1E3A2B]' : 'bg-[#E3DAC9]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform block ${
                autoSpeak ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Vision & Accessibility */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Contrast className="w-5 h-5 text-[#1E3A2B]" />
          <h2 className="text-base font-serif font-bold text-[#1E3A2B]">Vision & Accessibility Toggles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9]">
            <div>
              <span className="text-sm font-semibold text-[#1E3A2B]">High Contrast Mode</span>
              <p className="text-xs text-[#72786F]">Enhance border sharpness & contrast ratio</p>
            </div>
            <button
              onClick={onToggleContrast}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                contrastMode
                  ? 'bg-[#1E3A2B] text-white'
                  : 'bg-[#F2ECE1] text-[#1E3A2B]'
              }`}
            >
              {contrastMode ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Low Light Boost */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9]">
            <div>
              <span className="text-sm font-semibold text-[#1E3A2B]">Low-Light Sensor Boost</span>
              <p className="text-xs text-[#72786F]">Enhance contrast in dim room lighting</p>
            </div>
            <button
              onClick={() => {
                setLowLightBoost(!lowLightBoost);
                onShowToast(lowLightBoost ? 'Low-light boost disabled' : 'Low-light boost active');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                lowLightBoost
                  ? 'bg-[#1E3A2B] text-white'
                  : 'bg-[#F2ECE1] text-[#72786F]'
              }`}
            >
              {lowLightBoost ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Haptic feedback */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9]">
            <div>
              <span className="text-sm font-semibold text-[#1E3A2B]">Audio Chime on Sign Lock</span>
              <p className="text-xs text-[#72786F]">Gentle audio cue upon successful sign capture</p>
            </div>
            <button
              onClick={() => {
                setHapticFeedback(!hapticFeedback);
                onShowToast(hapticFeedback ? 'Audio cue off' : 'Audio cue on');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                hapticFeedback
                  ? 'bg-[#1E3A2B] text-white'
                  : 'bg-[#F2ECE1] text-[#72786F]'
              }`}
            >
              {hapticFeedback ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-[#E3DAC9]">
            <div>
              <span className="text-sm font-semibold text-[#1E3A2B]">Subtitles Display Size</span>
              <p className="text-xs text-[#72786F]">Size of translated text</p>
            </div>
            <div className="flex items-center gap-1 bg-[#F2ECE1] p-1 rounded-full border border-[#E3DAC9]">
              {(['Standard', 'Large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    fontSize === s ? 'bg-[#1E3A2B] text-white' : 'text-[#72786F]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Backend Architecture Integration Notice */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex items-start gap-4">
        <Cpu className="w-6 h-6 text-[#1E3A2B] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-[#1E3A2B]">Vaani Architecture & Python AI Backend Hook</span>
          <p className="text-xs text-[#72786F] leading-relaxed">
            This frontend is architected for drop-in connection to the existing Vaani Python/MediaPipe inference service and neural sequence transformer. Real-time WebSocket endpoints or HTTP RPC hooks dispatch tokens to the concept pipeline state.
          </p>
        </div>
      </div>

    </div>
  );
};
