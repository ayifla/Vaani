import React from 'react';
import { 
  Volume2, 
  Hand, 
  Check
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

  const handleTestVoice = (voiceName: string) => {
    speakText('Hello, this is Vaani testing your voice.', {
      rate: speed,
      pitch: 1.05,
      voiceName,
    });
    onShowToast(`Testing voice: ${voiceName}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-4xl mx-auto flex flex-col gap-6 text-[#343832] dark:text-[#EDE8E1]">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif italic text-[#1E3A2B] dark:text-[#EDE8E1]">Settings</h1>
        <p className="text-xs text-[#72786F] dark:text-[#9BB0A4]">
          Configure your voice and sign language preferences
        </p>
      </div>

      {/* 1. Sign Language Selection */}
      <div className="p-5 rounded-[28px] bg-white dark:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-[#1E3A2B] dark:text-[#EDE8E1]" />
          <h2 className="text-base font-serif font-bold text-[#1E3A2B] dark:text-[#EDE8E1]">Sign Language</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'ISL / ASL Dual', name: 'ISL / ASL', desc: 'Auto-detect both languages' },
            { id: 'ASL Standard', name: 'ASL', desc: 'American Sign Language' },
            { id: 'ISL Standard', name: 'ISL', desc: 'Indian Sign Language' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setDialect(item.id);
                onShowToast(`Language updated: ${item.name}`);
              }}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                dialect === item.id
                  ? 'bg-[#F2ECE1] dark:bg-[#1B2C24] border-[#1E3A2B] dark:border-[#2A4F3C] text-[#1E3A2B] dark:text-[#EDE8E1] shadow-xs'
                  : 'bg-[#FDFBF7] dark:bg-[#15221C] border-[#E3DAC9] dark:border-[#283D33] text-[#343832] dark:text-[#EDE8E1] hover:bg-[#F2ECE1] dark:hover:bg-[#1B2C24]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E3A2B] dark:text-[#EDE8E1]">{item.name}</span>
                {dialect === item.id && <Check className="w-4 h-4 text-[#1E3A2B] dark:text-[#EDE8E1]" />}
              </div>
              <span className="text-xs text-[#72786F] dark:text-[#9BB0A4]">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Voice Selection */}
      <div className="p-5 rounded-[28px] bg-white dark:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#1E3A2B] dark:text-[#EDE8E1]" />
          <h2 className="text-base font-serif font-bold text-[#1E3A2B] dark:text-[#EDE8E1]">Voice</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    ? 'bg-[#F2ECE1] dark:bg-[#1B2C24] border-[#1E3A2B] dark:border-[#2A4F3C] shadow-xs'
                    : 'bg-[#FDFBF7] dark:bg-[#15221C] border-[#E3DAC9] dark:border-[#283D33] hover:bg-[#F2ECE1] dark:hover:bg-[#1B2C24]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E3A2B] dark:text-[#EDE8E1]">{voice.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5ECEE] dark:bg-[#1B2C24] text-[10px] font-semibold text-[#8D656E] dark:text-[#9BB0A4] border border-[#ECD9DE] dark:border-[#283D33]">
                      {voice.gender}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1E3A2B] dark:text-[#EDE8E1]" />}
                </div>

                <span className="text-xs text-[#72786F] dark:text-[#9BB0A4]">{voice.tone}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestVoice(voice.name);
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#15221C] hover:bg-[#1E3A2B] dark:hover:bg-[#24523C] text-[#1E3A2B] dark:text-[#EDE8E1] hover:text-white text-xs font-semibold border border-[#E3DAC9] dark:border-[#283D33] transition-colors self-start"
                >
                  Preview
                </button>
              </div>
            );
          })}
        </div>

        {/* Speech Speed */}
        <div className="mt-2 p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1B2C24] border border-[#E3DAC9] dark:border-[#283D33] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1E3A2B] dark:text-[#EDE8E1]">Speech Speed</span>
            <span className="font-bold text-[#1E3A2B] dark:text-[#EDE8E1]">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.1"
            value={speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#1E3A2B] dark:accent-[#24523C] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#9DA39A] dark:text-[#9BB0A4]">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>
      </div>

      {/* 3. Accessibility */}
      <div className="p-5 rounded-[28px] bg-white dark:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] shadow-sm flex flex-col gap-3">
        <h2 className="text-base font-serif font-bold text-[#1E3A2B] dark:text-[#EDE8E1]">Accessibility</h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1B2C24] border border-[#E3DAC9] dark:border-[#283D33]">
          <div>
            <span className="text-sm font-semibold text-[#1E3A2B] dark:text-[#EDE8E1]">High Contrast Mode</span>
            <p className="text-xs text-[#72786F] dark:text-[#9BB0A4]">Enhance borders and contrast</p>
          </div>
          <button
            onClick={onToggleContrast}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              contrastMode
                ? 'bg-[#1E3A2B] dark:bg-[#24523C] text-white'
                : 'bg-[#F2ECE1] dark:bg-[#15221C] text-[#1E3A2B] dark:text-[#9BB0A4]'
            }`}
          >
            {contrastMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

    </div>
  );
};
