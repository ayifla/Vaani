/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignWorkspace } from './components/SignWorkspace';
import { ConversationHistoryView } from './components/ConversationHistoryView';
import { PracticeVocabularyView } from './components/PracticeVocabularyView';
import { SettingsView } from './components/SettingsView';
import { MobileAppMockup } from './components/MobileAppMockup';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AppMode, ConversationExchange, SimulationScenario, WebScreen, Theme } from './types';
import { INITIAL_CONVERSATION_HISTORY, SIMULATION_SCENARIOS } from './data/mockData';

export default function App() {
  // Landing / Login / main App switcher
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Theme - shared across landing, login, and workspace
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vaani-theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

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

  // Main view mode: 'web' is default as requested!
  const [appMode, setAppMode] = useState<AppMode>('web');
  const [currentWebScreen, setCurrentWebScreen] = useState<WebScreen>('sign-workspace');

  // Shared application state
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(SIMULATION_SCENARIOS.cant_class);
  const [selectedVoice, setSelectedVoice] = useState<string>('Warm Amber Alto');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [contrastMode, setContrastMode] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationExchange[]>(INITIAL_CONVERSATION_HISTORY);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleToggleSpeed = () => {
    const speeds = [0.8, 1.0, 1.2, 1.5];
    const currentIndex = speeds.indexOf(speechSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] || 1.0;
    setSpeechSpeed(nextSpeed);
    showToast(`Speech rate: ${nextSpeed.toFixed(1)}x`);
  };

  const handleToggleContrast = () => {
    setContrastMode(!contrastMode);
    showToast(!contrastMode ? 'High Contrast theme active' : 'Standard contrast restored');
  };

  const handleAddConversationExchange = (exchange: ConversationExchange) => {
    setConversationHistory((prev) => [exchange, ...prev]);
  };

  const handleClearHistory = () => {
    setConversationHistory([]);
  };

  // Landing page "Get Started" -> go to Login
  if (showLanding) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLanding(false);
          setShowLogin(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Login page -> on success, go to main app
  if (showLogin) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setShowLogin(false);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8F5EE] dark:bg-[#0E1612] text-[#343832] dark:text-[#EDE8E1] transition-colors duration-300 ${contrastMode ? 'contrast-125 saturate-110' : ''}`}>

      {/* Top Header - Always visible with navigation and "Vaani App" trigger */}
      <Header
        currentScreen={currentWebScreen}
        onSelectScreen={(screen) => {
          setCurrentWebScreen(screen);
          if (appMode === 'mobile_mockup') {
            setAppMode('web');
          }
        }}
        onOpenMobileMockup={() => {
          setAppMode('mobile_mockup');
          showToast('Opening Vaani Mobile App interactive preview...');
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Experience View Switcher */}
      <main className="flex-1 w-full pt-10 bg-[#F8F5EE] dark:bg-[#0E1612] transition-colors duration-300">
        {appMode === 'mobile_mockup' ? (
          /* DEDICATED SMARTPHONE APP PREVIEW */
          <MobileAppMockup
            onBackToWeb={() => {
              setAppMode('web');
              showToast('Returned to Web Application');
            }}
            currentScenario={currentScenario}
            onSelectScenario={setCurrentScenario}
            selectedVoice={selectedVoice}
            speed={speechSpeed}
            conversationHistory={conversationHistory}
            onShowToast={showToast}
          />
        ) : (
          /* FULL DESKTOP WEB APPLICATION SCREENS */
          <>
{currentWebScreen === 'sign-workspace' && (
                <SignWorkspace
                  currentScenario={currentScenario}
                  onSelectScenario={setCurrentScenario}
                  conversationHistory={conversationHistory}
                  onAddExchange={handleAddConversationExchange}
                  onShowToast={showToast}
                  onSelectScreen={setCurrentWebScreen}
                />
              )}

            {currentWebScreen === 'conversation-history' && (
              <ConversationHistoryView
                history={conversationHistory}
                onClearHistory={handleClearHistory}
                selectedVoice={selectedVoice}
                speed={speechSpeed}
                onShowToast={showToast}
              />
            )}

            {currentWebScreen === 'practice-vocabulary' && (
              <PracticeVocabularyView
                onShowToast={showToast}
                speed={speechSpeed}
                selectedVoice={selectedVoice}
              />
            )}

            {currentWebScreen === 'settings' && (
              <SettingsView
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                speed={speechSpeed}
                onSetSpeed={setSpeechSpeed}
                contrastMode={contrastMode}
                onToggleContrast={handleToggleContrast}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Standard Desktop Web Footer */}
      {appMode === 'web' && <Footer />}

      {/* Interactive Toast Notifications */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}