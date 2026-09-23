import React, { useState } from 'react';
import { Volume2, Check, ArrowDown, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEMANTIC_SCENARIOS } from '../data/scenarios';
import { SemanticScenario } from '../../../src/types';

export const SemanticDifference: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SemanticScenario>(SEMANTIC_SCENARIOS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handlePlayVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <section
      id="semantic-difference"
      className="py-20 sm:py-28 border-b border-ivory-border dark:border-night-border transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/3 -right-36 w-96 h-96 bg-mauve/10 dark:bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mauve dark:text-mauve block mb-3">
            The Semantic Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium text-forest dark:text-ivory tracking-tight leading-[1.12]">
            Sign language isn’t broken English. <br />
            It’s a rich, expressive grammatical system.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#55635B] dark:text-[#A7A0AF] leading-relaxed">
            Conventional tools produce robotic, fragmented word strings that fail the person signing and misunderstand the true grammar of sign languages. Vaani preserves intended meaning, topical markers, and emotional nuance.
          </p>
        </div>

        {/* Interactive Scenario Selector Tabs */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto mb-8 border-b border-ivory-border dark:border-night-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-mauve mr-2 flex-shrink-0">
            Explore Scenarios:
          </span>
          {SEMANTIC_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(scenario);
                  if (isPlayingAudio && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-forest dark:bg-terracotta text-white shadow-sm'
                    : 'bg-ivory-card dark:bg-night-card border border-ivory-border dark:border-night-border text-[#4D5A53] dark:text-[#C5BFCB] hover:bg-ivory-dim dark:hover:bg-night-surface'
                }`}
              >
                {scenario.contextTag}
              </button>
            );
          })}
        </div>

        {/* The Core Comparison Experience */}
        <div className="p-6 sm:p-10 rounded-3xl bg-ivory-card dark:bg-night-card border-2 border-forest/15 dark:border-night-border shadow-xl space-y-8 transition-colors">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScenario.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Step 1: Raw Detected Concepts */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-mauve uppercase tracking-wider mb-2.5">
                  <span>Detected Sign Concepts</span>
                  <span className="text-forest dark:text-ivory font-mono text-[11px]">
                    Vision Layer Output
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border">
                  {selectedScenario.concepts.map((concept, idx) => (
                    <React.Fragment key={concept}>
                      <span className="px-3 py-1.5 rounded-lg bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-surface text-xs font-mono font-semibold">
                        [ {concept} ]
                      </span>
                      {idx < selectedScenario.concepts.length - 1 && (
                        <span className="text-mauve/60 font-mono text-sm">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step 2: Mechanical Word-for-Word (The Wrong Way) */}
              <div className="p-5 rounded-2xl bg-ivory-dim/60 dark:bg-night-surface/60 border border-dashed border-rose-300 dark:border-rose-900/50">
                <div className="flex items-center justify-between text-xs font-semibold text-[#7A6E7D] uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mechanical Word-for-Word Conversion</span>
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                    Stiff & disjointed
                  </span>
                </div>
                
                <div className="font-mono text-base text-[#4E4452] dark:text-[#C5BFCB] bg-white dark:bg-night-card p-3 rounded-xl border border-ivory-border dark:border-night-border">
                  “{selectedScenario.literalOutput}”
                </div>
                
                <p className="text-xs text-[#7A6E7D] dark:text-[#9A93A3] mt-2 italic">
                  Critique: {selectedScenario.literalCritique}
                </p>
              </div>

              {/* Transformation Indicator */}
              <div className="flex items-center justify-center -my-3">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest dark:bg-terracotta text-white text-xs font-semibold uppercase tracking-widest shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-sunlit" />
                  <span>Vaani Context & Semantic Synthesis</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 3: What Vaani Reconstructs (The Human Way) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-forest dark:bg-forest-deep text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs font-semibold text-sunlit uppercase tracking-wider mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sunlit animate-pulse" />
                    <span>Reconstructed Meaning & Expressive Voice</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-white">
                    {selectedScenario.registerName}
                  </span>
                </div>

                {/* The Reconstructed Sentence */}
                <p className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-white leading-snug">
                  “{selectedScenario.reconstructedSentence}”
                </p>

                {/* Linguistic Insights */}
                <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-white/90">
                  {selectedScenario.linguisticHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <Check className="w-3.5 h-3.5 text-sunlit flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Voice Playback Bar */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-white/80 font-medium">
                    Voice Delivery: {selectedScenario.voiceTone}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePlayVoice(selectedScenario.reconstructedSentence)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sunlit hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingAudio ? 'Speaking Voice...' : 'Listen to Spoken Sentence'}</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <span className={`w-0.5 h-2 rounded-full bg-sunlit ${isPlayingAudio ? 'wave-anim-1' : ''}`} />
                      <span className={`w-0.5 h-3.5 rounded-full bg-sunlit ${isPlayingAudio ? 'wave-anim-2' : ''}`} />
                      <span className={`w-0.5 h-1.5 rounded-full bg-sunlit ${isPlayingAudio ? 'wave-anim-3' : ''}`} />
                      <span className={`w-0.5 h-3 rounded-full bg-sunlit ${isPlayingAudio ? 'wave-anim-4' : ''}`} />
                    </div>
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
