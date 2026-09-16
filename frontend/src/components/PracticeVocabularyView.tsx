import React, { useState } from 'react';
import { 
  Hand, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  Search, 
  ArrowRight,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { PracticeWord } from '../types';
import { PRACTICE_DICTIONARY } from '../data/mockData';
import { speakText } from '../utils/speech';

interface PracticeVocabularyViewProps {
  onShowToast: (message: string) => void;
  speed: number;
  selectedVoice: string;
}

export const PracticeVocabularyView: React.FC<PracticeVocabularyViewProps> = ({
  onShowToast,
  speed,
  selectedVoice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeWord, setActiveWord] = useState<PracticeWord>(PRACTICE_DICTIONARY[0]);
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [simulatedScore, setSimulatedScore] = useState<number>(activeWord.masteryScore);

  const categories = ['All', 'Everyday', 'Campus', 'Health', 'Dining', 'Social'];

  const filteredWords = PRACTICE_DICTIONARY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.signName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gloss.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectWord = (word: PracticeWord) => {
    setActiveWord(word);
    setSimulatedScore(word.masteryScore);
    setIsPracticing(false);
  };

  const handleStartPractice = () => {
    setIsPracticing(true);
    onShowToast(`Calibrating spatial tracking for "${activeWord.signName}"...`);
    setTimeout(() => {
      setSimulatedScore(Math.min(100, Math.floor(Math.random() * 10) + 90));
      onShowToast(`Gesture recognized! Match accuracy evaluated.`);
      setIsPracticing(false);
    }, 1800);
  };

  const handlePlayAudio = (phrase: string) => {
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
    onShowToast(`Speaking: "${phrase}"`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1600px] mx-auto flex flex-col gap-6 text-[#343832] dark:text-[#EDE8E1]">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif italic text-[#1E3A2B] dark:text-[#EDE8E1]">Practice & Vocabulary</h1>
        <p className="text-xs text-[#72786F] dark:text-[#9BB0A4]">
          Master signs with spatial guidance
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Vocabulary List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* Search & Category Filter */}
          <div className="bg-white dark:bg-[#15221C] rounded-2xl border border-[#E3DAC9] dark:border-[#283D33] p-3 flex flex-col gap-2 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9DA39A] dark:text-[#9BB0A4]" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] dark:bg-[#1B2C24] border border-[#E3DAC9] dark:border-[#283D33] text-sm text-[#1E3A2B] dark:text-[#EDE8E1] placeholder-[#9DA39A] dark:placeholder-[#9BB0A4] focus:outline-none focus:border-[#1E3A2B] dark:focus:border-[#2A4F3C]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A2B] dark:bg-[#24523C] text-white shadow-xs'
                      : 'bg-[#FDFBF7] dark:bg-[#1B2C24] text-[#72786F] dark:text-[#9BB0A4] hover:bg-[#F2ECE1] dark:hover:bg-[#15221C] hover:text-[#1E3A2B] dark:hover:text-[#EDE8E1] border border-[#E3DAC9] dark:border-[#283D33]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Word List */}
          <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredWords.map((word) => {
              const isSelected = activeWord.id === word.id;
              return (
                <button
                  key={word.id}
                  onClick={() => handleSelectWord(word)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-[#F2ECE1] dark:bg-[#1B2C24] border-[#1E3A2B] dark:border-[#2A4F3C] shadow-sm'
                      : 'bg-white dark:bg-[#15221C] border-[#E3DAC9] dark:border-[#283D33] hover:border-[#1E3A2B]/40 dark:hover:border-[#2A4F3C] shadow-xs'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-[#1E3A2B] dark:text-[#EDE8E1]">{word.signName}</span>
                    <span className="text-xs text-[#72786F] dark:text-[#9BB0A4]">{word.category}</span>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#1E3A2B] dark:text-[#EDE8E1]' : 'text-[#9DA39A] dark:text-[#9BB0A4]'}`} />
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Sign Details & Practice (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Sign Profile Card */}
          <div className="p-5 rounded-[28px] bg-white dark:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] shadow-sm flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wide text-[#72786F] dark:text-[#9BB0A4]">
                  {activeWord.category}
                </span>
                <h2 className="text-2xl font-serif italic text-[#1E3A2B] dark:text-[#EDE8E1] mt-0.5">{activeWord.signName}</h2>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-[#72786F] dark:text-[#9BB0A4]">Mastery</span>
                <span className="text-2xl font-bold text-[#C87A5B] dark:text-[#DE795D] font-serif">{simulatedScore}%</span>
              </div>
            </div>

            {/* Sign Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-[#1E3A2B] dark:text-[#EDE8E1] flex items-center gap-1.5">
                  <Hand className="w-3.5 h-3.5" />
                  <span>Handshape</span>
                </span>
                <p className="text-sm text-[#72786F] dark:text-[#9BB0A4] leading-relaxed">
                  {activeWord.handshape}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-[#1E3A2B] dark:text-[#EDE8E1] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
                  <span>Movement</span>
                </span>
                <p className="text-sm text-[#72786F] dark:text-[#9BB0A4] leading-relaxed">
                  {activeWord.movement}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            <div className="pt-3 border-t border-[#E3DAC9]/40 dark:border-[#283D33]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-[#72786F] dark:text-[#9BB0A4]">
                  Example Sentence
                </span>
                <button
                  onClick={() => handlePlayAudio(activeWord.exampleSentence)}
                  className="text-xs text-[#C87A5B] dark:text-[#DE795D] hover:text-[#B56B4E] dark:hover:text-[#C85A3E] flex items-center gap-1 font-semibold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
              <p className="font-serif text-base text-[#1E3A2B] dark:text-[#EDE8E1] leading-relaxed">
                {activeWord.exampleSentence}
              </p>
            </div>

          </div>

          {/* Spatial Pose Evaluator */}
          <div className="rounded-[28px] bg-white dark:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] p-4 shadow-sm flex flex-col gap-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#1E3A2B] dark:text-[#EDE8E1]" />
                <span className="text-sm font-bold text-[#1E3A2B] dark:text-[#EDE8E1]">Practice Evaluator</span>
              </div>
              <span className="text-xs text-[#72786F] dark:text-[#9BB0A4]">
                {isPracticing ? 'Analyzing...' : 'Ready'}
              </span>
            </div>

            {/* Practice Stage */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#152019] border-2 border-[#E3DAC9] dark:border-[#283D33] flex items-center justify-center">
              <img
                alt="Signing practice reference"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7L_BctFp2Go_GIN6d_xL2c560XyTq1wWlkE1WEy7G8rJtiHFMijTWmK0JjC9rngxSMhR_ZyjL-0Q8YnEB9GMfEnrdTDfvaSCxXb24TMZgVMjnx8CorSsAJXYDcVSkmunluH_uXyTJzdj8imKFFPHxGqrB40WhVDAkYdLbIECDT0LBx3GIectC-YLvm2m4m3BkSAh-btiJs3kFywbtrNJhEzFbfe8IWGLWf6oC_WfzNCXFbF-V0ChRw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#152019] via-transparent to-transparent pointer-events-none" />

              {/* Status Overlay */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-white/20 text-center max-w-xs text-white">
                {isPracticing ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-[#C87A5B] animate-ping" />
                    <span className="text-sm font-bold text-white">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-[#E5B25D]" />
                    <span className="text-sm font-bold text-white">{activeWord.signName}</span>
                    <span className="text-xs text-white/70">
                      Click Practice to evaluate
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-[#72786F] dark:text-[#9BB0A4]">
                Accuracy: <strong className="text-[#C87A5B] dark:text-[#DE795D]">{simulatedScore}%</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSimulatedScore(activeWord.masteryScore);
                    setIsPracticing(false);
                  }}
                  className="p-2 rounded-xl bg-[#F2ECE1] dark:bg-[#1B2C24] text-[#1E3A2B] dark:text-[#EDE8E1] hover:bg-[#E3DAC9] dark:hover:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33] transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStartPractice}
                  disabled={isPracticing}
                  className="px-4 py-2 rounded-xl bg-[#1E3A2B] dark:bg-[#24523C] hover:bg-[#152A1F] dark:hover:bg-[#2A4F3C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E5B25D]" />
                  <span>{isPracticing ? 'Practicing...' : 'Practice'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
