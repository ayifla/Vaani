import React from 'react';
import { 
  Smartphone, 
  Activity, 
  Contrast, 
  Gauge, 
  Mic2, 
  Menu,
  X
} from 'lucide-react';
import { WebScreen } from '../types';

interface HeaderProps {
  currentScreen: WebScreen;
  onSelectScreen: (screen: WebScreen) => void;
  onOpenMobileMockup: () => void;
  selectedVoice: string;
  speed: number;
  onToggleSpeed: () => void;
  contrastMode: boolean;
  onToggleContrast: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenMobileMockup,
  selectedVoice,
  speed,
  onToggleSpeed,
  contrastMode,
  onToggleContrast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: WebScreen; label: string }[] = [
    { id: 'sign-workspace', label: 'Workspace' },
    { id: 'conversation-history', label: 'Library' },
    { id: 'practice-vocabulary', label: 'Practice & Vocabulary' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FDFBF7] border-b border-[#E3DAC9] shadow-xs">
      <div className="h-20 w-full px-6 sm:px-8 lg:px-10 max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo & Brand Identity in Vaani Brand Palette */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => onSelectScreen('sign-workspace')} 
            className="flex items-center gap-3 text-left group focus:outline-none"
            title="Vaani Home"
          >
            <div className="relative w-10 h-10 bg-[#1E3A2B] rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#152A1F] transition-colors">
              <span className="text-white text-xl font-serif italic">V</span>
              {/* Sunlit gold accent dot as seen in brand monogram */}
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E5B25D]" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1E3A2B]">
                  Vaani
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#E7EFEA] text-[#1E3A2B] border border-[#CDE0D4]">
                  Web
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#C87A5B] font-semibold">
                Signs that Speak.
              </p>
            </div>
          </button>

          {/* Ivory Brand Subtitle Pill */}
          <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2ECE1] text-[#1E3A2B] text-xs font-medium border border-[#E3DAC9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C87A5B]"></span>
            <span>Sign → Understand → Communicate</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`text-sm font-medium transition-all pb-1 ${
                  isActive
                    ? 'text-[#1E3A2B] border-b-2 border-[#1E3A2B] font-semibold'
                    : 'text-[#72786F] hover:text-[#1E3A2B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls & Dedicated "Vaani App" Button */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Active Camera Status Badge */}
          <div className="hidden 2xl:flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E7EFEA] text-[#1E3A2B] rounded-full text-[11px] font-bold uppercase border border-[#CDE0D4]">
              <span className="w-2 h-2 bg-[#1E3A2B] rounded-full animate-pulse"></span>
              Neural Vision 60 FPS
            </span>
          </div>

          {/* Quick HUD modifiers */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={onToggleContrast}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                contrastMode
                  ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
                  : 'bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] border-[#E3DAC9]'
              }`}
              title="Toggle Contrast"
            >
              <Contrast className="w-3.5 h-3.5" />
              <span>{contrastMode ? 'High Contrast' : 'Contrast'}</span>
            </button>

            <button
              onClick={onToggleSpeed}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F2ECE1] hover:bg-[#EBE3D4] text-[#1E3A2B] text-xs font-medium transition-colors border border-[#E3DAC9]"
              title="Change Speech Speed"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{speed.toFixed(1)}x</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F2ECE1] text-xs text-[#1E3A2B] border border-[#E3DAC9]">
              <Mic2 className="w-3.5 h-3.5 text-[#C87A5B]" />
              <span className="truncate max-w-[100px]">{selectedVoice}</span>
            </div>
          </div>

          {/* 🌟 FOREST GREEN "VAANI APP" PRIMARY BUTTON 🌟 */}
          <button
            onClick={onOpenMobileMockup}
            className="px-5 py-2.5 bg-[#1E3A2B] text-white rounded-full text-sm font-semibold shadow-xs hover:bg-[#152A1F] transition-all flex items-center gap-2"
            title="Open Dedicated Interactive Smartphone App Preview"
          >
            <span>Vaani App</span>
            <Smartphone className="w-4 h-4 text-[#E5B25D]" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center pl-1">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1E3A2B]/20 shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb67EXbaIm4QhLZ-9tEuqHsfW1JTlXsax0YWiWTszvsUkDWG9gdBypmMvUvc76BGWqLxI7Vni6392MoUWOpI9c4CohYKvzXl4aKs5LgQ9iQRoB4iJlg5RsaAVPQ8xqll_KmGNsMKw2e4YBTSm1KxIXz_fMoayWuxkhkrZu3TcqjHy8BZSLrc0QRXsEkC2_kB-DJqdmuGVc2OOsG-MNa6OTAywazoqrEjN1AYNmKj9Z1TYfUd9OmrwPPQ"
            />
          </div>

          {/* Mobile screen hamburger toggle for navigation */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F2ECE1] text-[#1E3A2B] hover:bg-[#EBE3D4] border border-[#E3DAC9]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown for Screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 bg-[#FDFBF7] border-b border-[#E3DAC9] flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectScreen(item.id);
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                currentScreen === item.id
                  ? 'bg-[#1E3A2B] text-white font-semibold'
                  : 'text-[#343832] hover:bg-[#F2ECE1]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E3DAC9] flex items-center justify-between text-xs text-[#1E3A2B]">
            <button 
              onClick={onToggleContrast} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2ECE1] border border-[#E3DAC9]"
            >
              <Contrast className="w-3.5 h-3.5" />
              <span>{contrastMode ? 'High Contrast ON' : 'High Contrast OFF'}</span>
            </button>
            <button 
              onClick={onToggleSpeed} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2ECE1] border border-[#E3DAC9]"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Speed: {speed.toFixed(1)}x</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
