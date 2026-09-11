import React from 'react';
import { Heart, Sparkles, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export const HumanCentredPurpose: React.FC = () => {
  const pillars = [
    {
      icon: Heart,
      title: 'Natural Communication',
      description:
        'Moving past cold word-by-word lookups to allow conversational flow that feels effortless, dignified, and authentic for everyday interaction.',
    },
    {
      icon: Sparkles,
      title: 'Preserving Context & Intent',
      description:
        'Recognizing the subtleties of situational registers—whether speaking to a professor, greeting an old friend, or answering a quick question.',
    },
    {
      icon: ShieldCheck,
      title: 'Reduced Friction',
      description:
        'Eliminating the need for clunky data gloves or proprietary sensors. Vision models run on-device right through a standard web camera.',
    },
    {
      icon: SlidersHorizontal,
      title: 'Expressive Accessibility',
      description:
        'Empowering the person signing with complete autonomy: custom synthesized tones, instant text editing, and clear multi-modal feedback.',
    },
  ];

  return (
    <section
      id="purpose"
      className="py-20 sm:py-28 bg-ivory-dim/60 dark:bg-night-surface/50 border-b border-ivory-border dark:border-night-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Human Anchor */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border-2 border-forest/15 dark:border-night-border shadow-xl">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1W7J3ZRREL_-tmY2eT9gFBQAq69t1XSIoo68iPPWwl9RKUtFBtL74oWo2RyRIY4Zf3neNi0enPC3yHIuO5bjUtCxxcejRqtJsiRUIqNcXsLVyV9VkAknRNlUqCGZvmeBZtCrz33tJz8s5Dnn20pLhGUACsEO4ehVWsq8RizG4lYUN29kcK_Q33dcNxfgyIkxupBvcsUOKOuxbosZLkwcCgYW3uVFb1F4hYm4cwvnTXSNlZnsiqBOIiuN8yM"
                alt="Portrait of a deaf young adult with a warm, confident smile"
                className="w-full aspect-square object-cover object-center filter brightness-95"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="block text-xs uppercase tracking-widest text-sunlit font-semibold mb-1">
                  Human-Centered Purpose
                </span>
                <p className="font-serif text-lg sm:text-xl font-medium italic leading-snug">
                  “Different hands. Same conversations. A more expressive and connected world.”
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-forest dark:text-terracotta block">
              Why Vaani Exists
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-forest dark:text-ivory tracking-tight leading-tight">
              Designed to bridge worlds without erasing individuality.
            </h2>
            <p className="text-base sm:text-lg text-[#55635B] dark:text-[#A7A0AF] leading-relaxed">
              Communication is much more than data exchange—it is relationship, personality, and human dignity. Traditional tools frequently reduce expressive signing into stiff, telegraphic fragments that misrepresent the speaker.
            </p>
            <p className="text-base sm:text-lg text-[#55635B] dark:text-[#A7A0AF] leading-relaxed">
              Vaani was created to preserve nuance. By coupling computer vision for concept capture with generative semantic reconstruction, the platform ensures that the depth and warmth of your signed thoughts are heard with natural clarity.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-2xl bg-ivory-card dark:bg-night-card border border-ivory-border dark:border-night-border transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-forest/10 dark:bg-terracotta/20 text-forest dark:text-terracotta flex items-center justify-center">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="font-serif text-base font-semibold text-forest dark:text-ivory">
                        {pillar.title}
                      </div>
                    </div>
                    <p className="text-xs text-[#5C6B63] dark:text-[#9A93A3] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
