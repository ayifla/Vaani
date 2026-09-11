import React from 'react';
import {
  Smartphone,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { WebScreen, Theme } from '../types';

interface HeaderProps {
  currentScreen: WebScreen;
  onSelectScreen: (screen: WebScreen) => void;
  onOpenMobileMockup: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenMobileMockup,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: WebScreen; label: string }[] = [
    { id: 'sign-workspace', label: 'Workspace' },
    { id: 'conversation-history', label: 'Library' },
    { id: 'practice-vocabulary', label: 'Practice & Vocabulary' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F8F5EE] dark:bg-[#15221C] transition-colors duration-300">
      <div className="h-14 w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* Logo & Brand Identity in Vaani Brand Palette */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          <button
            onClick={() => onSelectScreen('sign-workspace')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none shrink-0"
            title="Vaani Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-[#1E3A2B] dark:bg-[#24523C] rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#152A1F] dark:group-hover:bg-[#2A4F3C] transition-colors shrink-0">
              <span className="text-white text-base sm:text-lg font-serif italic">V</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E5B25D]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#1E3A2B] dark:text-[#EDE8E1] whitespace-nowrap">
                  Vaani
                </h1>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#E7EFEA] dark:bg-[#1B2C24] text-[#1E3A2B] dark:text-[#9BB0A4] border border-[#CDE0D4] dark:border-[#283D33]">
                  Web
                </span>
              </div>
              <p className="hidden sm:block text-[10px] uppercase tracking-widest text-[#C87A5B] font-semibold">
                Signs that Speak.
              </p>
            </div>
          </button>

          </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink min-w-0">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`text-sm font-medium transition-all pb-1 whitespace-nowrap ${
                  isActive
                    ? 'text-[#1E3A2B] dark:text-[#EDE8E1] border-b-2 border-[#1E3A2B] dark:border-[#EDE8E1] font-semibold'
                    : 'text-[#72786F] dark:text-[#9BB0A4] hover:text-[#1E3A2B] dark:hover:text-[#EDE8E1]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls & Dedicated "Vaani App" Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full border border-[#E3DAC9] dark:border-[#283D33] bg-white dark:bg-[#1B2C24] text-[#1E3A2B] dark:text-[#E5A93C] hover:bg-[#F2ECE1] dark:hover:bg-[#15221C] transition-all shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* "VAANI APP" PRIMARY BUTTON */}
          <button
            onClick={onOpenMobileMockup}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1E3A2B] dark:bg-[#24523C] text-white rounded-full text-sm font-semibold shadow-xs hover:bg-[#152A1F] dark:hover:bg-[#2A4F3C] transition-all flex items-center gap-2 whitespace-nowrap"
            title="Open Dedicated Interactive Smartphone App Preview"
          >
            <span className="hidden sm:inline">Vaani App</span>
            <span className="sm:hidden">App</span>
            <Smartphone className="w-4 h-4 text-[#E5B25D] shrink-0" />
          </button>

          {/* User Profile Avatar */}
          <div className="hidden sm:flex items-center pl-1">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1E3A2B]/20 dark:ring-[#EDE8E1]/20 shadow-xs shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb67EXbaIm4QhLZ-9tEuqHsfW1JTlXsax0YWiWTszvsUkDWG9gdBypmMvUvc76BGWqLxI7Vni6392MoUWOpI9c4CohYKvzXl4aKs5LgQ9iQRoB4iJlg5RsaAVPQ8xqll_KmGNsMKw2e4YBTSm1KxIXz_fMoayWuxkhkrZu3TcqjHy8BZSLrc0QRXsEkC2_kB-DJqdmuGVc2OOsG-MNa6OTAywazoqrEjN1AYNmKj9Z1TYfUd9OmrwPPQ"
            />
          </div>

          {/* Mobile screen hamburger toggle for navigation */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F2ECE1] dark:bg-[#1B2C24] text-[#1E3A2B] dark:text-[#EDE8E1] hover:bg-[#EBE3D4] dark:hover:bg-[#15221C] border border-[#E3DAC9] dark:border-[#283D33]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown for Screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 bg-[#FDFBF7] dark:bg-[#1B2C24] border-b border-[#E3DAC9] dark:border-[#283D33] flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectScreen(item.id);
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                currentScreen === item.id
                  ? 'bg-[#1E3A2B] dark:bg-[#24523C] text-white font-semibold'
                  : 'text-[#343832] dark:text-[#EDE8E1] hover:bg-[#F2ECE1] dark:hover:bg-[#15221C]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};