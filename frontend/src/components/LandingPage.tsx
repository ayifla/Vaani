import React from 'react';
import { Theme } from '../types';
import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { HowItWorks } from './landing/HowItWorks';
import { SemanticDifference } from './landing/SemanticDifference';
import { HumanCentredPurpose } from './landing/HumanCentredPurpose';
import { ProductPreview } from './landing/ProductPreview';
import { FinalCTA } from './landing/FinalCTA';
import { Footer } from './landing/Footer';
import { BackToTop } from './landing/BackToTop';

interface LandingPageProps {
  onGetStarted: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, theme, onToggleTheme }) => {
  const handleSeeHowItWorks = () => {
    const howItWorksEl = document.getElementById('how-it-works');
    if (howItWorksEl) {
      howItWorksEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToProductPreview = () => {
    const previewEl = document.getElementById('product-preview');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-night text-[#1F2923] dark:text-[#EDE8E1] font-sans antialiased selection:bg-terracotta selection:text-white transition-colors duration-300">

      <Navbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenWorkspace={onGetStarted}
      />

      <main id="main-content">
        <Hero
          onOpenWorkspace={onGetStarted}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        <HowItWorks />

        <SemanticDifference />

        <HumanCentredPurpose />

        <ProductPreview onEnterWorkspace={onGetStarted} />

        <FinalCTA
          onEnterVaani={onGetStarted}
          onExploreDemo={handleGoToProductPreview}
        />
      </main>

      <Footer onOpenWorkspace={onGetStarted} />

      <BackToTop />

    </div>
  );
};