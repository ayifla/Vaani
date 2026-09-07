import React from 'react';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white text-[#1E3A2B] border border-[#E3DAC9] shadow-lg backdrop-blur-xl">
        <Sparkles className="w-4 h-4 text-[#C87A5B] shrink-0" />
        <span className="text-xs font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-xs text-[#9DA39A] hover:text-[#1E3A2B] transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
