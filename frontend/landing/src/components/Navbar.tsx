import React, { useState } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { VaaniLogo } from './VaaniLogo';
import { Theme } from '../../../src/types';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenWorkspace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'The Semantic Difference', href: '#semantic-difference' },
    { label: 'Why Vaani', href: '#purpose' },
    { label: 'Product Preview', href: '#product-preview' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="top-navbar"
      className="sticky top-0 z-50 backdrop-blur-md bg-ivory/90 dark:bg-night/90 border-b border-ivory-border dark:border-night-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#hero"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-lg"
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          <VaaniLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#46534C] dark:text-[#C5BFCB]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-forest dark:hover:text-ivory transition-colors py-1 relative group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-terracotta transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-desktop"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-full border border-ivory-border dark:border-night-border bg-ivory-card dark:bg-night-card text-forest dark:text-sunlit hover:bg-ivory-dim dark:hover:bg-night-surface transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-sunlit" />
            ) : (
              <Moon className="w-4 h-4 text-forest" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            id="nav-open-vaani-btn"
            type="button"
            onClick={onOpenWorkspace}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest dark:bg-terracotta text-white font-semibold text-sm tracking-wide shadow-sm hover:bg-forest-light dark:hover:bg-terracotta-deep transition-all transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta cursor-pointer"
          >
            <span>Open Vaani</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            id="theme-toggle-mobile"
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-ivory-border dark:border-night-border bg-ivory-card dark:bg-night-card text-forest dark:text-sunlit"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="p-2 rounded-lg border border-ivory-border dark:border-night-border bg-ivory-card dark:bg-night-card text-forest dark:text-ivory"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-ivory-border dark:border-night-border bg-ivory dark:bg-night-surface px-4 pt-3 pb-6 space-y-3 transition-colors">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-forest dark:text-ivory hover:bg-ivory-dim dark:hover:bg-night-card transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forest dark:bg-terracotta text-white font-semibold text-sm shadow-md"
            >
              <span>Open Vaani</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
