import React, { useState } from 'react';
import { 
  BookOpen, 
  Hand, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  Search, 
  ArrowRight,
  RotateCcw,
  Volume2,
  Award
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
    }, 1800);
  };

  const handlePlayAudio = (phrase: string) => {
    speakText(phrase, {
      rate: speed,
      pitch: 1.05,
      voiceName: selectedVoice,
    });
    onShowToast(`Pronouncing: ${phrase}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6 text-[#343832]">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-serif font-bold text-[#1E3A2B]">Practice & Vocabulary Studio</h1>
            <span className="px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2B] text-xs font-bold border border-[#D5E4DB]">
              Interactive Sign Guide
            </span>
          </div>
          <p className="text-xs text-[#72786F] mt-1 font-medium">
            Master spatial syntax, handshapes, and non-manual markers with real-time pose evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2ECE1] border border-[#E3DAC9] text-xs">
            <Award className="w-4 h-4 text-[#E5B25D]" />
            <span className="text-[#72786F]">Average Mastery:</span>
            <span className="font-bold text-[#1E3A2B]">91%</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Dictionary List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Search & Category Filter */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3DAC9] shadow-xs flex flex-col gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9DA39A]" />
              <input
                type="text"
                placeholder="Search vocabulary signs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] text-xs text-[#1E3A2B] placeholder-[#9DA39A] focus:outline-none focus:border-[#1E3A2B]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
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

          {/* Word Cards List */}
          <div className="flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredWords.map((word) => {
              const isSelected = activeWord.id === word.id;
              return (
                <div
                  key={word.id}
                  onClick={() => handleSelectWord(word)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs ${
                    isSelected
                      ? 'bg-[#F2ECE1] border-[#1E3A2B] shadow-sm'
                      : 'bg-white border-[#E3DAC9] hover:border-[#1E3A2B]/40'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E3A2B]">{word.signName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FDFBF7] text-[#1E3A2B] border border-[#E3DAC9]">
                        {word.gloss}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#72786F] line-clamp-1">{word.handshape}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end text-xs">
                      <span className="text-[10px] text-[#9DA39A]">Mastery</span>
                      <span className="font-bold text-[#C87A5B]">{word.masteryScore}%</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-[#1E3A2B]' : 'text-[#9DA39A]'}`} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Sign Anatomy & Camera Trainer Studio (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Sign Details & Anatomy Card */}
          <div className="p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs flex flex-col gap-4">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1E3A2B]">
                  {activeWord.category} Sign Profile
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#1E3A2B] mt-0.5">{activeWord.signName}</h2>
                <span className="text-xs font-mono text-[#1E3A2B] bg-[#F2ECE1] px-3 py-0.5 rounded-full border border-[#E3DAC9] inline-block mt-1">
                  Gloss Notation: {activeWord.gloss}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-[#72786F]">Current Mastery</span>
                <span className="text-2xl font-bold text-[#C87A5B] font-serif">{simulatedScore}%</span>
                <div className="w-24 h-1.5 bg-[#F2ECE1] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#C87A5B]" style={{ width: `${simulatedScore}%` }} />
                </div>
              </div>
            </div>

            {/* Visual breakdown grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] flex flex-col gap-1">
                <span className="text-[11px] uppercase font-bold text-[#1E3A2B] flex items-center gap-1.5">
                  <Hand className="w-3.5 h-3.5 text-[#1E3A2B]" />
                  <span>Handshape Formation</span>
                </span>
                <p className="text-xs text-[#72786F] leading-relaxed mt-1">
                  {activeWord.handshape}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] flex flex-col gap-1">
                <span className="text-[11px] uppercase font-bold text-[#1E3A2B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
                  <span>Spatial Trajectory</span>
                </span>
                <p className="text-xs text-[#72786F] leading-relaxed mt-1">
                  {activeWord.movement}
                </p>
              </div>
            </div>

            {/* Contextual Usage */}
            <div className="p-4 rounded-xl bg-[#F5ECEE] border border-[#ECD9DE] flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8D656E] tracking-widest">
                  Example Syntactic Sentence
                </span>
                <button
                  onClick={() => handlePlayAudio(activeWord.exampleSentence)}
                  className="text-xs text-[#8D656E] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Voice</span>
                </button>
              </div>
              <p className="font-serif text-lg text-[#1E3A2B]">
                {activeWord.exampleSentence}
              </p>
            </div>

          </div>

          {/* Interactive Practice Camera / Spatial Matcher */}
          <div className="relative rounded-[28px] overflow-hidden bg-white border border-[#E3DAC9] p-6 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#1E3A2B]" />
                <span className="text-sm font-bold text-[#1E3A2B]">Spatial Pose Evaluator</span>
              </div>
              <span className="text-xs text-[#72786F]">
                {isPracticing ? 'Evaluating hand landmarks in frame...' : 'Ready to capture sign'}
              </span>
            </div>

            {/* Evaluator Stage Box with subtle Forest Green undertone */}
            <div className="relative w-full aspect-[16/9] rounded-[24px] overflow-hidden bg-[#152019] border-4 border-white shadow-lg flex items-center justify-center">
              <img
                alt="Signing practice reference"
                className="absolute inset-0 w-full h-full object-cover opacity-70 filter brightness-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7L_BctFp2Go_GIN6d_xL2c560XyTq1wWlkE1WEy7G8rJtiHFMijTWmK0JjC9rngxSMhR_ZyjL-0Q8YnEB9GMfEnrdTDfvaSCxXb24TMZgVMjnx8CorSsAJXYDcVSkmunluH_uXyTJzdj8imKFFPHxGqrB40WhVDAkYdLbIECDT0LBx3GIectC-YLvm2m4m3BkSAh-btiJs3kFywbtrNJhEzFbfe8IWGLWf6oC_WfzNCXFbF-V0ChRw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#152019] via-transparent to-transparent pointer-events-none" />

              {/* AR Target Outline Simulation */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-white/20 text-center max-w-xs text-white">
                {isPracticing ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-[#C87A5B] animate-ping" />
                    <span className="text-xs font-bold text-[#F2ECE1]">Analyzing Landmark Vectors</span>
                    <span className="text-[11px] text-white/70">Hold hand in spatial focus zone...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-[#E5B25D]" />
                    <span className="text-xs font-bold text-white">Target: {activeWord.signName}</span>
                    <span className="text-[11px] text-white/70">
                      Click button below to trigger real-time gesture match evaluation
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-[#72786F]">
                Pose Accuracy: <strong className="text-[#C87A5B]">{simulatedScore}% match</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSimulatedScore(activeWord.masteryScore);
                    setIsPracticing(false);
                  }}
                  className="p-2.5 rounded-full bg-[#F2ECE1] text-[#1E3A2B] hover:bg-[#E3DAC9] border border-[#E3DAC9]"
                  title="Reset score"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStartPractice}
                  className="px-6 py-2.5 rounded-full bg-[#1E3A2B] hover:bg-[#152A1F] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E5B25D]" />
                  <span>{isPracticing ? 'Re-evaluating...' : 'Practice Sign in Camera'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
