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
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1600px] mx-auto flex flex-col gap-6 text-[#343832]">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif italic text-[#1E3A2B]">Practice & Vocabulary</h1>
        <p className="text-sm text-[#72786F]">
          Master signs with spatial guidance and voice feedback
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Vocabulary List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Search & Category Filter */}
          <div className="bg-white rounded-2xl border border-[#E3DAC9] p-4 flex flex-col gap-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9DA39A]" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] text-sm text-[#1E3A2B] placeholder-[#9DA39A] focus:outline-none focus:border-[#1E3A2B]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'bg-[#FDFBF7] text-[#72786F] hover:bg-[#F2ECE1] hover:text-[#1E3A2B] border border-[#E3DAC9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Word List */}
          <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredWords.map((word) => {
              const isSelected = activeWord.id === word.id;
              return (
                <button
                  key={word.id}
                  onClick={() => handleSelectWord(word)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-[#F2ECE1] border-[#1E3A2B] shadow-sm'
                      : 'bg-white border-[#E3DAC9] hover:border-[#1E3A2B]/40 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#1E3A2B]">{word.signName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FDFBF7] text-[#1E3A2B] border border-[#E3DAC9]">
                        {word.gloss}
                      </span>
                    </div>
                    <span className="text-xs text-[#72786F]">{word.category}</span>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#1E3A2B]' : 'text-[#9DA39A]'}`} />
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Sign Details & Practice (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Sign Profile Card */}
          <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-sm flex flex-col gap-5">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wide text-[#72786F]">
                  {activeWord.category}
                </span>
                <h2 className="text-3xl font-serif italic text-[#1E3A2B] mt-1">{activeWord.signName}</h2>
                <span className="text-xs font-mono text-[#1E3A2B] bg-[#F2ECE1] px-3 py-1 rounded-full border border-[#E3DAC9] inline-block mt-2">
                  {activeWord.gloss}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-[#72786F]">Mastery</span>
                <span className="text-3xl font-bold text-[#C87A5B] font-serif">{simulatedScore}%</span>
              </div>
            </div>

            {/* Sign Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold text-[#1E3A2B] flex items-center gap-1.5">
                  <Hand className="w-4 h-4" />
                  <span>Handshape</span>
                </span>
                <p className="text-sm text-[#72786F] leading-relaxed">
                  {activeWord.handshape}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold text-[#1E3A2B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E5B25D]" />
                  <span>Movement</span>
                </span>
                <p className="text-sm text-[#72786F] leading-relaxed">
                  {activeWord.movement}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            <div className="pt-4 border-t border-[#E3DAC9]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-[#72786F]">
                  Example Sentence
                </span>
                <button
                  onClick={() => handlePlayAudio(activeWord.exampleSentence)}
                  className="text-xs text-[#C87A5B] hover:text-[#B56B4E] flex items-center gap-1 font-semibold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Voice</span>
                </button>
              </div>
              <p className="font-serif text-lg text-[#1E3A2B] leading-relaxed">
                {activeWord.exampleSentence}
              </p>
            </div>

          </div>

          {/* Spatial Pose Evaluator */}
          <div className="rounded-[28px] bg-white border border-[#E3DAC9] p-5 shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#1E3A2B]" />
                <span className="text-sm font-bold text-[#1E3A2B]">Spatial Pose Evaluator</span>
              </div>
              <span className="text-xs text-[#72786F]">
                {isPracticing ? 'Analyzing...' : 'Ready'}
              </span>
            </div>

            {/* Practice Stage */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#152019] border-4 border-white shadow-lg flex items-center justify-center">
              <img
                alt="Signing practice reference"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7L_BctFp2Go_GIN6d_xL2c560XyTq1wWlkE1WEy7G8rJtiHFMijTWmK0JjC9rngxSMhR_ZyjL-0Q8YnEB9GMfEnrdTDfvaSCxXb24TMZgVMjnx8CorSsAJXYDcVSkmunluH_uXyTJzdj8imKFFPHxGqrB40WhVDAkYdLbIECDT0LBx3GIectC-YLvm2m4m3BkSAh-btiJs3kFywbtrNJhEzFbfe8IWGLWf6oC_WfzNCXFbF-V0ChRw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#152019] via-transparent to-transparent pointer-events-none" />

              {/* Status Overlay */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-black/60 p-5 rounded-2xl backdrop-blur-md border border-white/20 text-center max-w-xs text-white">
                {isPracticing ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-[#C87A5B] animate-ping" />
                    <span className="text-sm font-bold text-white">Analyzing pose...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-[#E5B25D]" />
                    <span className="text-sm font-bold text-white">{activeWord.signName}</span>
                    <span className="text-xs text-white/70">
                      Click Practice to evaluate your sign
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-[#72786F]">
                Accuracy: <strong className="text-[#C87A5B]">{simulatedScore}%</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSimulatedScore(activeWord.masteryScore);
                    setIsPracticing(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#F2ECE1] text-[#1E3A2B] hover:bg-[#E3DAC9] border border-[#E3DAC9] transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStartPractice}
                  disabled={isPracticing}
                  className="px-5 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#152A1F] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E5B25D]" />
                  <span>{isPracticing ? 'Practicing...' : 'Practice Sign'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
