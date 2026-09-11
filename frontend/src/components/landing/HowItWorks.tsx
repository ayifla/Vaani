import React, { useState, useEffect } from 'react';
import { Camera, BrainCircuit, MessageSquareText, ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const stages = [
    {
      id: 'sign',
      stepNumber: '01',
      title: 'Sign Naturally.',
      shortLabel: 'SIGN',
      leadDescription: 'The user signs naturally in front of a camera.',
      detailedExplanation:
        'The vision and sign-recognition layer recognizes hand shapes, movements, and spatial references—converting physical gestures into discrete sign concepts without requiring specialized gloves or markers.',
      technicalBadge: 'Vision & Sign Recognition Layer',
      icon: Camera,
      color: 'forest',
      visualPreview: {
        type: 'vision',
        detectedWords: ['can\'t', 'class', 'today', 'stomach ache'],
        note: 'Signs detected as discrete semantic concepts'
      }
    },
    {
      id: 'understand',
      stepNumber: '02',
      title: 'Vaani connects the concepts and context.',
      shortLabel: 'UNDERSTAND',
      leadDescription: 'Generative AI understands relationship and intended meaning.',
      detailedExplanation:
        'Crucial technical distinction: AI does not analyze raw pixels directly. Instead, the contextual generative model takes the detected sign concepts and applies situational understanding, syntactic rules, and implied registers to reconstruct complete intent.',
      technicalBadge: 'Generative Semantic Reconstruction',
      icon: BrainCircuit,
      color: 'terracotta',
      visualPreview: {
        type: 'synthesis',
        activeTransforms: [
          'Implied Pronoun Restoration: [ "I" ]',
          'Causal Synthesis: [ "because" ]',
          'Temporal Flow: [ "today" → subordinate clause ]'
        ],
        note: 'Contextual synthesis of grammatical architecture'
      }
    },
    {
      id: 'communicate',
      stepNumber: '03',
      title: 'Your meaning becomes a natural sentence.',
      shortLabel: 'COMMUNICATE',
      leadDescription: 'Vaani produces a natural sentence you can review, edit, speak, or share.',
      detailedExplanation:
        'Rather than a flat, robotic translation, you receive a full, expressive sentence. Choose an authentic voice tone, make instant edits if you wish, and share or speak aloud with genuine human inflection.',
      technicalBadge: 'Natural Expression & Voice Delivery',
      icon: MessageSquareText,
      color: 'sunlit',
      visualPreview: {
        type: 'speech',
        finalSentence: '“I can\'t come to class today because I have a stomach ache.”',
        tone: 'Warm Alto Voice',
        note: 'Natural voice output with human cadence'
      }
    }
  ];

  // Auto-cycle through the steps gently if user hasn't manually clicked
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, stages.length]);

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-ivory-dim/60 dark:bg-night-surface/50 border-b border-ivory-border dark:border-night-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta dark:text-terracotta block mb-3">
            Core Product Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-forest dark:text-ivory tracking-tight">
            SIGN <span className="text-terracotta font-sans text-2xl sm:text-4xl">→</span> UNDERSTAND{' '}
            <span className="text-terracotta font-sans text-2xl sm:text-4xl">→</span> COMMUNICATE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#55635B] dark:text-[#A7A0AF] leading-relaxed">
            Vaani is not simply a sign-to-word translator. Vision detects sign concepts; generative AI reconstructs the authentic human meaning.
          </p>
        </div>

        {/* Step Navigation Pill Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-ivory-card dark:bg-night-card border border-ivory-border dark:border-night-border shadow-sm max-w-full overflow-x-auto">
            {stages.map((stage, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveStep(idx);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-forest dark:bg-terracotta text-white shadow-md'
                      : 'text-[#58675F] dark:text-[#A8A1B0] hover:text-forest dark:hover:text-ivory'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{stage.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Transformation Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Active Stage Details */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-5"
              >
                {/* Stage Tag */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-terracotta/15 dark:bg-terracotta/25 text-terracotta">
                    Stage {stages[activeStep].stepNumber} of 03
                  </span>
                  <span className="text-xs font-medium text-mauve dark:text-[#9F96A6]">
                    {stages[activeStep].technicalBadge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-3xl sm:text-4xl font-medium text-forest dark:text-ivory leading-tight">
                  {stages[activeStep].title}
                </h3>

                {/* Lead sentence */}
                <p className="text-lg font-medium text-terracotta dark:text-terracotta">
                  {stages[activeStep].leadDescription}
                </p>

                {/* Detailed description */}
                <p className="text-base text-[#55635B] dark:text-[#B0A9B7] leading-relaxed">
                  {stages[activeStep].detailedExplanation}
                </p>

                {/* Key takeaway bullet */}
                <div className="p-4 rounded-2xl bg-ivory-card dark:bg-night-card border border-ivory-border dark:border-night-border flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest/10 dark:bg-terracotta/20 text-forest dark:text-terracotta flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#46544D] dark:text-[#C5BECC] font-medium">
                    {activeStep === 0 && 'Signs are captured as raw semantic concepts, not locked into rigid 1-to-1 word dictionaries.'}
                    {activeStep === 1 && 'The AI layer receives recognized concepts and uses contextual grammar to reconstruct the natural message.'}
                    {activeStep === 2 && 'The speaker maintains full agency: edit any word, select voice inflection, speak aloud or share.'}
                  </span>
                </div>

                {/* Interactive Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveStep((prev) => (prev + 1) % stages.length);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-forest dark:text-ivory hover:text-terracotta dark:hover:text-terracotta transition-colors cursor-pointer"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="inline-flex items-center gap-1.5 text-xs text-mauve hover:text-forest dark:hover:text-ivory transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAutoPlaying ? 'animate-spin' : ''}`} />
                    <span>{isAutoPlaying ? 'Auto-cycling' : 'Play Flow'}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Flowing Interactive Transformation Canvas */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-ivory-card dark:bg-night-card border-2 border-forest/15 dark:border-night-border shadow-xl relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-mauve mb-6 pb-3 border-b border-ivory-border dark:border-night-border">
                <span>Transformation Pipeline</span>
                <span className="text-terracotta flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-time Semantic Shift</span>
                </span>
              </div>

              {/* Visual State Representation */}
              <div className="space-y-6">
                
                {/* 1. Concepts Stage */}
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    activeStep === 0
                      ? 'bg-forest/10 dark:bg-forest/25 border-2 border-forest/30 dark:border-forest/50 ring-2 ring-forest/10'
                      : 'bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2 text-forest dark:text-forest-surface">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>1. Vision Detection (Sign Concepts)</span>
                    </span>
                    {activeStep === 0 && <span className="text-[10px] uppercase font-bold text-terracotta">Active Focus</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['can\'t', 'class', 'today', 'stomach ache'].map((word) => (
                      <span
                        key={word}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          activeStep === 0
                            ? 'bg-forest dark:bg-forest-light text-white shadow-sm scale-105'
                            : 'bg-forest/10 dark:bg-forest/20 text-forest dark:text-forest-surface'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flow Arrow */}
                <div className="flex justify-center -my-3">
                  <div className="w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center text-xs shadow-sm">
                    ↓
                  </div>
                </div>

                {/* 2. Understanding & Context Synthesis Stage */}
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    activeStep === 1
                      ? 'bg-terracotta/15 dark:bg-terracotta/25 border-2 border-terracotta/50 ring-2 ring-terracotta/15'
                      : 'bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2 text-terracotta-deep dark:text-terracotta">
                    <span className="flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>2. Semantic Reconstruction (Context + Grammar)</span>
                    </span>
                    {activeStep === 1 && <span className="text-[10px] uppercase font-bold text-terracotta">Synthesizing</span>}
                  </div>
                  <div className="text-xs space-y-1.5 text-[#4E5B54] dark:text-[#C0B9C6] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-terracotta">✓</span>
                      <span>Subject inferred: <strong>“I”</strong> (First-person signer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-terracotta">✓</span>
                      <span>Connector inferred: <strong>“because”</strong> (Causal relationship)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-terracotta">✓</span>
                      <span>Verb agreement: <strong>“come to class”</strong> + <strong>“have a”</strong></span>
                    </div>
                  </div>
                </div>

                {/* Flow Arrow */}
                <div className="flex justify-center -my-3">
                  <div className="w-6 h-6 rounded-full bg-sunlit text-white flex items-center justify-center text-xs shadow-sm">
                    ↓
                  </div>
                </div>

                {/* 3. Spoken Sentence Stage */}
                <div
                  className={`p-5 rounded-2xl transition-all duration-300 ${
                    activeStep === 2
                      ? 'bg-forest dark:bg-forest-deep text-white border-2 border-sunlit/40 shadow-lg ring-2 ring-sunlit/20'
                      : 'bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="flex items-center gap-1.5 text-sunlit">
                      <MessageSquareText className="w-3.5 h-3.5" />
                      <span>3. Communicated Natural Sentence</span>
                    </span>
                    <span className="text-[11px] opacity-80">Alto Register</span>
                  </div>
                  <p className={`font-serif text-lg sm:text-xl font-medium leading-snug italic ${
                    activeStep === 2 ? 'text-white' : 'text-forest dark:text-ivory'
                  }`}>
                    “I can't come to class today because I have a stomach ache.”
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/20 dark:border-night-border flex items-center justify-between text-[11px] opacity-80">
                    <span>Editable • Voice Spoken • Sharable</span>
                    <span className="text-sunlit font-semibold">Ready to communicate</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
