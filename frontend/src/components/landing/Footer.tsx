import React from 'react';
import { VaaniLogo } from './VaaniLogo';

interface FooterProps {
  onOpenWorkspace: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWorkspace }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-ivory-dim/90 dark:bg-night-card border-t border-ivory-border dark:border-night-border transition-colors duration-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-ivory-border dark:border-night-border/70">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <VaaniLogo size="md" showTagline={true} />
            <p className="text-sm text-[#55635B] dark:text-[#A7A0AF] max-w-sm leading-relaxed">
              Vaani is an AI-powered sign-language communication platform that reconstructs gestures and context into natural, expressive spoken meaning.
            </p>
            <div className="text-xs text-mauve dark:text-[#A7A0B0] flex items-center gap-2">
              <span>Signs that Speak.</span>
              <span>•</span>
              <span>Humanist Communication System</span>
            </div>
          </div>

          {/* Col 3: Product Navigation */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold text-forest dark:text-ivory">
              Product
            </div>
            <ul className="space-y-2 text-sm text-[#55635B] dark:text-[#A7A0AF]">
              <li>
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors text-left cursor-pointer"
                >
                  Vaani Workspace
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNav(e, '#how-it-works')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#semantic-difference"
                  onClick={(e) => handleNav(e, '#semantic-difference')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  The Semantic Difference
                </a>
              </li>
              <li>
                <a
                  href="#product-preview"
                  onClick={(e) => handleNav(e, '#product-preview')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  Interactive Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Principles & Ethics */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold text-forest dark:text-ivory">
              Principles & Ethics
            </div>
            <ul className="space-y-2 text-sm text-[#55635B] dark:text-[#A7A0AF]">
              <li>
                <a
                  href="#purpose"
                  onClick={(e) => handleNav(e, '#purpose')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  Deaf Linguistic Respect
                </a>
              </li>
              <li>
                <a
                  href="#purpose"
                  onClick={(e) => handleNav(e, '#purpose')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  Non-Literal Synthesis
                </a>
              </li>
              <li>
                <a
                  href="#purpose"
                  onClick={(e) => handleNav(e, '#purpose')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  On-Device Vision Privacy
                </a>
              </li>
              <li>
                <a
                  href="#purpose"
                  onClick={(e) => handleNav(e, '#purpose')}
                  className="hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  Accessible Design
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Brand Palette */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold text-forest dark:text-ivory">
              Brand Palette
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full bg-forest border border-black/10 shadow-sm"
                title="Forest Green (#183B2B)"
              />
              <span
                className="w-6 h-6 rounded-full bg-terracotta border border-black/10 shadow-sm"
                title="Terracotta (#DE795D)"
              />
              <span
                className="w-6 h-6 rounded-full bg-mauve border border-black/10 shadow-sm"
                title="Mauve (#8C7A8E)"
              />
              <span
                className="w-6 h-6 rounded-full bg-sunlit border border-black/10 shadow-sm"
                title="Sunlit Gold (#E5A93C)"
              />
              <span
                className="w-6 h-6 rounded-full bg-ivory border border-black/10 shadow-sm"
                title="Ivory (#FAF7F2)"
              />
            </div>
            <p className="text-[11px] text-[#78877E] dark:text-[#9A93A3] pt-1 leading-snug">
              Humanist palette: warm Ivory and deep Forest Green accented with Terracotta, Mauve, and Sunlit Gold.
            </p>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78877E] dark:text-[#9A93A3]">
          <p>© 2026 Vaani. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-forest dark:hover:text-ivory transition-colors">
              Privacy Principles
            </span>
            <span className="hover:text-forest dark:hover:text-ivory transition-colors">
              Linguistic Integrity
            </span>
            <span className="hover:text-forest dark:hover:text-ivory transition-colors">
              Accessibility Standards
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
