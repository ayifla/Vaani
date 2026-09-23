import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Video,
  VideoOff,
  Volume2,
  Copy,
  Check,
  Share2,
  Sparkles,
  Sliders,
  RotateCcw,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { SEMANTIC_SCENARIOS, TONE_OPTIONS } from "../../data/landing/scenarios";
import { ToneOption } from '../../types';

interface ProductPreviewProps {
  onEnterWorkspace: () => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ onEnterWorkspace }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const scenario = SEMANTIC_SCENARIOS[selectedScenarioIndex];

  const [currentSentence, setCurrentSentence] = useState<string>(scenario.reconstructedSentence);
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONE_OPTIONS[0]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isUsingRealCamera, setIsUsingRealCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sync sentence when scenario changes
  useEffect(() => {
    setCurrentSentence(scenario.reconstructedSentence);
  }, [scenario]);

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleToggleRealCamera = async () => {
    if (isUsingRealCamera) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setIsUsingRealCamera(false);
      setCameraError(null);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsUsingRealCamera(true);
      } catch (err) {
        setCameraError('Camera access unavailable. Using interactive visual preview.');
        setIsUsingRealCamera(false);
      }
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.pitch = selectedTone.speechPitch;
      utterance.rate = selectedTone.speechRate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSentence);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vaani — Signs that Speak',
          text: currentSentence,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section
      id="product-preview"
      className="py-20 sm:py-28 border-b border-ivory-border dark:border-night-border transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta dark:text-terracotta block mb-3">
            Product Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-forest dark:text-ivory tracking-tight">
            The Live Vaani Experience
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#55635B] dark:text-[#A7A0AF] leading-relaxed">
            See how the vision detector captures signs, passes concepts to the contextual semantic layer, and synthesizes living speech.
          </p>
        </div>

        {/* Product UI Shell (Looks like the real Vaani product workspace) */}
        <div className="rounded-3xl bg-ivory-card dark:bg-night-card border-2 border-forest/15 dark:border-night-border shadow-2xl overflow-hidden transition-colors">
          
          {/* Workspace App Header */}
          <div className="px-6 py-4 border-b border-ivory-border dark:border-night-border bg-ivory-dim/70 dark:bg-night-surface/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="h-4 w-px bg-ivory-border dark:bg-night-border" />
              <span className="font-serif text-base font-semibold text-forest dark:text-ivory">
                Vaani
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-mauve px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">
                Live Sign Session
              </span>
            </div>

            {/* Quick Scenario Preset Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-mauve hidden sm:inline font-medium">Scenario:</span>
              <div className="flex gap-1.5">
                {SEMANTIC_SCENARIOS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedScenarioIndex === idx
                        ? 'bg-forest dark:bg-terracotta text-white shadow-sm'
                        : 'bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border text-[#55635B] dark:text-[#A7A0B0]'
                    }`}
                  >
                    {s.contextTag.split('&')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workspace Body Grid: Left Camera/Vision & Right Synthesis/Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Sign Detection Viewport (7 cols) */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-ivory-border dark:border-night-border space-y-4">
              
              {/* Camera Frame */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#0C1410] border border-forest/10 dark:border-night-border shadow-inner">
                {isUsingRealCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <img
                    src="https://lh3.googleusercontent.com/aida/AEtjO1Xv1sXpFxgzXpeWhu7hX9Ahe4mP2s3kDVnDIolVEqkpJIBRQkkOorIcoonvzsECO5woybaguJ1BUNfjRI93BozSJOdclHCJKIk97phD7cffz_KRebcP1G9nAd56zcXuDnMWfOQdIZvHpr9hLi37MLKkvIZkH4AEpmAyagqcn8SqiMSc5AXgZP-nU2ijS79lBLTM39hH-u7RW0xuHGlcI9BGJpCiSwWRgow7yIzSMPWUIM1gvJZ3-660-2U"
                    alt="Active sign simulation stream"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Spatial landmark / gesture tracker overlay */}
                <div className="absolute inset-4 pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Vision Tracker: Active</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleRealCamera}
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      {isUsingRealCamera ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                      <span>{isUsingRealCamera ? 'Use Simulation' : 'Test My Webcam'}</span>
                    </button>
                  </div>

                  {cameraError && (
                    <div className="self-center px-3 py-1 rounded-lg bg-rose-900/80 text-rose-200 text-xs backdrop-blur-sm">
                      {cameraError}
                    </div>
                  )}

                  <div className="self-start px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-xs text-white border border-white/10">
                    <span className="text-mauve font-mono uppercase tracking-wider text-[10px] block">
                      Active Gesture Recognition
                    </span>
                    <span className="font-serif text-sm text-sunlit font-semibold">
                      “{scenario.concepts[scenario.concepts.length - 1]}”
                    </span>
                  </div>
                </div>
              </div>

              {/* Detected Concepts Stream */}
              <div className="p-4 rounded-2xl bg-ivory dark:bg-night-surface border border-ivory-border dark:border-night-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-mauve">
                  <span>Detected Concepts Pipeline</span>
                  <span className="text-terracotta text-[11px] font-mono">Vision → AI Hand-off</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {scenario.concepts.map((concept, index) => (
                    <motion.span
                      key={concept}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                      className="px-3 py-1 rounded-lg bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-surface font-mono text-xs font-semibold border border-forest/20"
                    >
                      {concept}
                    </motion.span>
                  ))}
                </div>
                
                <p className="text-[11px] text-[#6A7870] dark:text-[#938B9C] pt-1">
                  Each sign is captured as a discrete semantic concept, preserving topic and spatial references.
                </p>
              </div>

            </div>

            {/* Right Column: Semantic Reconstruction & Communication (5 cols) */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-ivory-dim/30 dark:bg-night-card/50">
              
              <div className="space-y-4">
                {/* Header of synthesis */}
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-mauve">
                  <span className="flex items-center gap-1.5 text-forest dark:text-ivory">
                    <Sparkles className="w-4 h-4 text-terracotta" />
                    <span>Reconstructed Sentence</span>
                  </span>
                  <span className="text-terracotta font-mono text-[11px]">
                    Contextual Synthesis
                  </span>
                </div>

                {/* Editable sentence box */}
                <div className="p-4 rounded-2xl bg-ivory-card dark:bg-night-surface border-2 border-forest/20 dark:border-night-border shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-mauve">
                    <span className="flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Review & Edit Intended Meaning</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentSentence(scenario.reconstructedSentence)}
                      title="Reset to recommended reconstruction"
                      className="hover:text-forest dark:hover:text-ivory transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={currentSentence}
                    onChange={(e) => setCurrentSentence(e.target.value)}
                    className="w-full bg-transparent font-serif text-lg sm:text-xl font-medium text-forest dark:text-ivory focus:outline-none resize-none leading-snug"
                    aria-label="Editable reconstructed sentence"
                  />

                  <div className="pt-2 border-t border-ivory-border/70 dark:border-night-border/70 flex items-center justify-between text-xs text-mauve">
                    <span>Register: <strong className="text-forest dark:text-ivory">{scenario.registerName}</strong></span>
                    <span className="text-sunlit font-semibold">Semantic Match</span>
                  </div>
                </div>

                {/* Tone Modulation Options */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-mauve">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Voice Inflection & Tone</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {TONE_OPTIONS.map((tone) => {
                      const isSelected = selectedTone.id === tone.id;
                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setSelectedTone(tone)}
                          className={`p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-forest dark:bg-terracotta text-white shadow-sm'
                              : 'bg-ivory-card dark:bg-night-surface border border-ivory-border dark:border-night-border text-[#4C5952] dark:text-[#C5BECC] hover:bg-ivory-dim'
                          }`}
                        >
                          <span className="block font-semibold truncate">{tone.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Speak, Copy, Share */}
              <div className="space-y-3 pt-4 border-t border-ivory-border dark:border-night-border">
                {/* Primary Speak Button */}
                <button
                  id="preview-speak-btn"
                  type="button"
                  onClick={handleSpeak}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-forest dark:bg-terracotta text-white font-semibold text-sm shadow-md hover:bg-forest-light dark:hover:bg-terracotta-deep transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'Speaking in Chosen Voice...' : 'Speak Sentence Aloud'}</span>
                  <div className="flex items-center gap-0.5 ml-2">
                    <span className={`w-0.5 h-3 rounded-full bg-white ${isSpeaking ? 'wave-anim-1' : ''}`} />
                    <span className={`w-0.5 h-4 rounded-full bg-white ${isSpeaking ? 'wave-anim-2' : ''}`} />
                    <span className={`w-0.5 h-2 rounded-full bg-white ${isSpeaking ? 'wave-anim-3' : ''}`} />
                  </div>
                </button>

                {/* Secondary Utility Controls: Copy & Share */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-ivory-border dark:border-night-border bg-ivory-card dark:bg-night-surface text-forest dark:text-ivory text-xs font-semibold hover:bg-ivory-dim dark:hover:bg-night-card transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-ivory-border dark:border-night-border bg-ivory-card dark:bg-night-surface text-forest dark:text-ivory text-xs font-semibold hover:bg-ivory-dim dark:hover:bg-night-card transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Meaning</span>
                  </button>
                </div>

                {/* Direct Entry to Full App */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={onEnterWorkspace}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline cursor-pointer"
                  >
                    <span>Launch Full Vaani Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
