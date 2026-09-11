import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { SemanticDifference } from './components/SemanticDifference';
import { HumanCentredPurpose } from './components/HumanCentredPurpose';
import { ProductPreview } from './components/ProductPreview';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { WorkspaceModal } from './components/WorkspaceModal';

export default function App() {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('vaani-theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);

  // Synchronize theme with <html> element class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vaani-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenWorkspace = () => {
    setIsWorkspaceModalOpen(true);
  };

  const handleGoToProductPreview = () => {
    const previewEl = document.getElementById('product-preview');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSeeHowItWorks = () => {
    const howItWorksEl = document.getElementById('how-it-works');
    if (howItWorksEl) {
      howItWorksEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-night text-[#1F2923] dark:text-[#EDE8E1] font-sans antialiased selection:bg-terracotta selection:text-white transition-colors duration-300">
      
      {/* 1. Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenWorkspace={handleOpenWorkspace}
      />

      <main id="main-content">
        {/* 2. Hero Section */}
        <Hero
          onOpenWorkspace={handleOpenWorkspace}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        {/* 3. How Vaani Works (SIGN → UNDERSTAND → COMMUNICATE) */}
        <HowItWorks />

        {/* 4. The Semantic Difference */}
        <SemanticDifference />

        {/* 5. Human-Centred Purpose */}
        <HumanCentredPurpose />

        {/* 6. Product Preview */}
        <ProductPreview onEnterWorkspace={handleOpenWorkspace} />

        {/* 7. Final Closing CTA */}
        <FinalCTA
          onEnterVaani={handleOpenWorkspace}
          onExploreDemo={handleGoToProductPreview}
        />
      </main>

      {/* 8. Footer */}
      <Footer onOpenWorkspace={handleOpenWorkspace} />

      {/* 9. Floating Back to Top Button */}
      <BackToTop />

      {/* 10. Workspace Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onGoToLivePreview={handleGoToProductPreview}
      />

    </div>
  );
}
