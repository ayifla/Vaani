import React, { useState } from 'react';
import { Play, Volume2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenWorkspace: () => void;
  onSeeHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWorkspace, onSeeHowItWorks }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sampleSentence = "I can't come to class today because I have a stomach ache.";

  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleSentence);
      utterance.pitch = 1.05;
      utterance.rate = 0.96;
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
      id="hero"
      className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 border-b border-ivory-border dark:border-night-border transition-colors duration-300"
    >
      {/* Subtle warm atmospheric lighting */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-terracotta/10 dark:bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-28 w-80 h-80 bg-sunlit/15 dark:bg-forest/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Value & Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 text-left space-y-7"
          >
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-forest/20 dark:border-terracotta/30 bg-forest/5 dark:bg-terracotta/10 text-forest dark:text-terracotta text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Contextual Sign-to-Speech Understanding</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-forest dark:text-ivory leading-[1.08]">
              Hands speak in depth. <br />
              <span className="italic font-normal text-terracotta dark:text-terracotta">Vaani</span>{' '}
              weaves their meaning into voice.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#4A5750] dark:text-[#B3ACB9] font-normal leading-relaxed max-w-2xl">
              Vaani is not a literal sign dictionary. It understands syntax, context, and human intent—organically reconstructing gestures into natural spoken sentences with expressive warmth.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-primary-cta"
                type="button"
                onClick={onOpenWorkspace}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-forest dark:bg-terracotta text-white font-semibold text-base shadow-md hover:bg-forest-light dark:hover:bg-terracotta-deep transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta"
              >
                <span>Try Vaani</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-secondary-cta"
                type="button"
                onClick={onSeeHowItWorks}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border border-forest/30 dark:border-ivory-border/40 text-forest dark:text-ivory font-medium text-base hover:bg-ivory-dim dark:hover:bg-night-card transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-terracotta fill-terracotta" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Honest Credibility Indicators */}
            <div className="pt-6 border-t border-ivory-border dark:border-night-border flex flex-wrap items-center gap-6 text-xs text-[#5D6B62] dark:text-[#9A93A3]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest dark:bg-sunlit" />
                <span>On-device vision layer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span>Deaf culture & linguistic respect</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mauve" />
                <span>Natural tone & inflection control</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Asset (Authentic Signer & Live Reconstruction) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Outer Framing Container */}
            <div className="relative p-3 sm:p-4 rounded-3xl bg-ivory-card dark:bg-night-card border-2 border-forest/15 dark:border-night-border shadow-2xl transition-colors">
              
              {/* Human Signer Image Frame */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0E1511]">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Xv1sXpFxgzXpeWhu7hX9Ahe4mP2s3kDVnDIolVEqkpJIBRQkkOorIcoonvzsECO5woybaguJ1BUNfjRI93BozSJOdclHCJKIk97phD7cffz_KRebcP1G9nAd56zcXuDnMWfOQdIZvHpr9hLi37MLKkvIZkH4AEpmAyagqcn8SqiMSc5AXgZP-nU2ijS79lBLTM39hH-u7RW0xuHGlcI9BGJpCiSwWRgow7yIzSMPWUIM1gvJZ3-660-2U"
                  alt="Deaf individual signing expressively and naturally in front of a camera"
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Respectful Spatial Cues */}
                <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[11px] text-white/90 font-medium">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Vision Ready & Listening</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[10px] tracking-wider uppercase font-semibold">
                      Natural Syntax
                    </span>
                  </div>

                  {/* Active Concept Tag */}
                  <div className="self-start px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-xs text-white border border-white/15 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-terracotta" />
                    <span>
                      Detected Concept: <strong className="font-semibold text-sunlit">“stomach ache”</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Transformation Overlay Card */}
              <div className="mt-3.5 p-4 rounded-2xl bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border shadow-md transition-colors">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-mauve dark:text-[#A7A0B0] font-semibold mb-2">
                  <span>Discrete Concepts Captured</span>
                  <span className="text-terracotta flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Semantic Reconstruction</span>
                  </span>
                </div>

                {/* Concept Chips Sequence */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-mauve/10 dark:bg-mauve/25 text-mauve dark:text-mauve-subtle text-xs font-mono font-medium">
                    can't
                  </span>
                  <span className="text-mauve/60 text-xs">→</span>
                  <span className="px-2.5 py-1 rounded-md bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-surface text-xs font-mono font-medium">
                    class
                  </span>
                  <span className="text-mauve/60 text-xs">→</span>
                  <span className="px-2.5 py-1 rounded-md bg-sunlit/15 dark:bg-sunlit/20 text-[#A66F17] dark:text-sunlit text-xs font-mono font-medium">
                    today
                  </span>
                  <span className="text-mauve/60 text-xs">→</span>
                  <span className="px-2.5 py-1 rounded-md bg-terracotta/15 dark:bg-terracotta/25 text-terracotta-deep dark:text-terracotta text-xs font-mono font-semibold ring-1 ring-terracotta/30">
                    stomach ache
                  </span>
                </div>

                {/* Reconstructed Sentence Display */}
                <div className="p-3.5 rounded-xl bg-ivory-card dark:bg-night-card border border-ivory-border dark:border-night-border/70 transition-colors">
                  <p className="font-serif text-lg sm:text-xl font-medium text-forest dark:text-ivory leading-snug italic">
                    “{sampleSentence}”
                  </p>
                  
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-ivory-border/60 dark:border-night-border/50 text-[11px]">
                    <span className="text-mauve dark:text-mauve font-medium">
                      Polite Register • Warm Inflection
                    </span>

                    <button
                      id="hero-replay-voice-btn"
                      type="button"
                      onClick={handlePlayVoice}
                      className="inline-flex items-center gap-1.5 text-terracotta hover:text-terracotta-deep dark:hover:text-sunlit font-semibold transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Speaking...' : 'Play Voice'}</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className={`w-0.5 h-2.5 rounded-full bg-terracotta ${isPlayingAudio ? 'wave-anim-1' : ''}`} />
                        <span className={`w-0.5 h-3.5 rounded-full bg-terracotta ${isPlayingAudio ? 'wave-anim-2' : ''}`} />
                        <span className={`w-0.5 h-2 rounded-full bg-terracotta ${isPlayingAudio ? 'wave-anim-3' : ''}`} />
                        <span className={`w-0.5 h-4 rounded-full bg-terracotta ${isPlayingAudio ? 'wave-anim-4' : ''}`} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle floating badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 p-3.5 rounded-2xl bg-forest dark:bg-forest-deep text-white shadow-xl items-center gap-3 border border-white/15">
              <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight pr-1">
                <span className="block text-xs font-semibold tracking-wider text-ivory">
                  Contextual Synthesis
                </span>
                <span className="text-[10px] text-[#C0B9C6]">
                  Preserving intent, not crude literal words
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
