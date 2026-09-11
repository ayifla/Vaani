import React from 'react';
import { X, ArrowRight, Camera, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { VaaniLogo } from './VaaniLogo';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLivePreview: () => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onGoToLivePreview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-ivory-card dark:bg-night-card border-2 border-forest/20 dark:border-night-border shadow-2xl p-6 sm:p-8 text-left transition-colors">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-mauve hover:text-forest dark:hover:text-ivory hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <VaaniLogo size="sm" showTagline={true} />
          <h3 className="font-serif text-2xl font-medium text-forest dark:text-ivory mt-4">
            Welcome to the Vaani Workspace
          </h3>
          <p className="text-sm text-[#55635B] dark:text-[#A7A0AF] mt-1.5 leading-relaxed">
            Ready to experience signs that speak? Choose how you would like to test sign recognition and contextual reconstruction.
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToLivePreview();
            }}
            className="w-full p-4 rounded-2xl bg-forest/5 dark:bg-terracotta/10 border border-forest/20 dark:border-terracotta/30 hover:border-forest dark:hover:border-terracotta flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest dark:bg-terracotta text-white flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-semibold text-sm text-forest dark:text-ivory group-hover:text-terracotta transition-colors">
                  Live Interactive Sign Studio
                </span>
                <span className="text-xs text-[#6A7870] dark:text-[#9A93A3]">
                  Test sign concepts, test webcam or simulation, and hear reconstructed voice
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-forest dark:text-terracotta group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
          </button>

          <div className="p-4 rounded-2xl bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-mauve block">
              Session Checklist
            </span>
            <div className="space-y-1.5 text-xs text-[#526058] dark:text-[#B0A9B7]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>On-device vision processing (private, local)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Semantic reconstruction engine active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Voice inflection synthesis ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Modal Action */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onGoToLivePreview();
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-forest dark:bg-terracotta text-white font-semibold text-sm shadow-md hover:bg-forest-light dark:hover:bg-terracotta-deep transition-all cursor-pointer"
        >
          <span>Enter Live Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
