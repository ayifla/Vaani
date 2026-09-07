import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FDFBF7] border-t border-[#E3DAC9] py-6 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#72786F]">
        
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm text-[#1E3A2B]">Vaani</span>
          <span className="text-[#E3DAC9]">•</span>
          <span>Spatial AI & Sign Language Translation Engine</span>
        </div>

        {/* Right framework & copyright info */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="text-[#9DA39A]">Accessible Communication Framework</span>
          <span className="text-[#E3DAC9]">•</span>
          <span className="text-[#1E3A2B] font-semibold">Signs that Speak</span>
          <span className="text-[#E3DAC9]">•</span>
          <span className="text-[#9DA39A]">© 2025 Vaani. Voice of Hands.</span>
        </div>

      </div>
    </footer>
  );
};
