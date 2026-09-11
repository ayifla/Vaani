import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { VaaniLogo } from './VaaniLogo';

interface FinalCTAProps {
  onEnterVaani: () => void;
  onExploreDemo: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onEnterVaani, onExploreDemo }) => {
  return (
    <section
      id="final-cta"
      className="py-20 sm:py-32 relative overflow-hidden transition-colors duration-300"
    >
      {/* Radiant ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/5 dark:via-night-surface to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-terracotta/10 dark:bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        
        {/* Brand Symbol Icon */}
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <VaaniLogo size="lg" showTagline={false} />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta dark:text-terracotta block mb-3">
          Begin the Conversation
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl font-medium text-forest dark:text-ivory tracking-tight leading-[1.12] max-w-3xl mx-auto">
          Ready to see what your signs can say?
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-[#55635B] dark:text-[#B1AAB8] max-w-2xl mx-auto leading-relaxed">
          Step into the Vaani workspace. Experience how context and generative understanding reconstruct your signs into clear, natural, and dignified spoken sentences.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="final-enter-vaani-btn"
            type="button"
            onClick={onEnterVaani}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-forest dark:bg-terracotta text-white font-semibold text-lg shadow-xl hover:bg-forest-light dark:hover:bg-terracotta-deep transition-all transform hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta cursor-pointer"
          >
            <span>Enter Vaani</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="final-explore-demo-btn"
            type="button"
            onClick={onExploreDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-5 rounded-full border border-forest/30 dark:border-ivory-border/40 text-forest dark:text-ivory font-medium text-base hover:bg-ivory-dim dark:hover:bg-night-card transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>Explore Demo Simulation</span>
          </button>
        </div>

        {/* Respectful Platform Reassurance */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#707E76] dark:text-[#948C9D]">
          <span>Desktop & Mobile Browsers</span>
          <span>•</span>
          <span>On-device camera processing</span>
          <span>•</span>
          <span>No external sensors or hardware required</span>
        </div>

      </div>
    </section>
  );
};
