import React, { useState } from 'react';
import { 
  Search, 
  Volume2, 
  Copy, 
  Download, 
  Check, 
  Clock, 
  MessageSquare, 
  Bookmark,
  Trash2
} from 'lucide-react';
import { ConversationExchange } from '../types';
import { speakText } from '../utils/speech';

interface ConversationHistoryViewProps {
  history: ConversationExchange[];
  onClearHistory: () => void;
  selectedVoice: string;
  speed: number;
  onShowToast: (message: string) => void;
}

export const ConversationHistoryView: React.FC<ConversationHistoryViewProps> = ({
  history,
  onClearHistory,
  selectedVoice,
  speed,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['conv-2', 'conv-6']));

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.sentence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokens.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    speakText(text, {
      rate: speed,
      pitch: 1.05,
      voiceName: selectedVoice,
      onEnd: () => setPlayingId(null),
    });
    onShowToast('Replaying synthesized speech');
  };

  const handleCopySentence = (text: string) => {
    navigator.clipboard?.writeText(text.replace(/[“”]/g, ''));
    onShowToast('Transcript copied to clipboard');
  };

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
      onShowToast('Removed bookmark');
    } else {
      next.add(id);
      onShowToast('Bookmarked exchange');
    }
    setBookmarkedIds(next);
  };

  const handleExport = () => {
    const transcriptText = history
      .map((item) => `[${item.time}] Signs: ${item.tokens.join(', ')}\nSpoken: ${item.sentence}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vaani-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Transcript exported as text file');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto flex flex-col gap-4 text-[#343832]">
      
      {/* Header Banner with Integrated Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[24px] bg-white border border-[#E3DAC9] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-serif font-bold text-[#1E3A2B]">Conversation Library</h1>
            <span className="px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2B] text-xs font-bold border border-[#D5E4DB]">
              {history.length} Sessions Logged
            </span>
          </div>
          
          {/* Compact Search Control */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA39A]" />
            <input
              type="text"
              placeholder="Search phrases"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] text-sm text-[#1E3A2B] placeholder-[#9DA39A] focus:outline-none focus:border-[#1E3A2B]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2ECE1] hover:bg-[#E3DAC9] text-[#1E3A2B] text-xs font-semibold border border-[#E3DAC9] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#1E3A2B]" />
            <span>Export Text</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear conversation history?')) {
                onClearHistory();
                onShowToast('History cleared');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F2ECE1] text-[#72786F] hover:text-[#C87A5B] text-xs font-semibold border border-[#E3DAC9] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
</div>
      
      {/* History Items List */}
      <div className="flex flex-col gap-2">
        {filteredHistory.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-[#E3DAC9] text-center flex flex-col items-center justify-center gap-2 shadow-xs">
            <MessageSquare className="w-6 h-6 text-[#9DA39A]" />
            <p className="text-sm font-semibold text-[#1E3A2B]">No conversational exchanges match your filter</p>
            <p className="text-xs text-[#9DA39A]">Try adjusting your search keywords or category filters</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isPlaying = playingId === item.id;
            const isBookmarked = bookmarkedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-[#E3DAC9] hover:border-[#1E3A2B]/40 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-2 flex-1">
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#1E3A2B] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1E3A2B]" />
                      {item.time}
                    </span>
                    <span className="text-[#E3DAC9]">•</span>
                    <span className="text-[#72786F]">{item.tokens.length} signs articulated</span>
                    {item.category && (
                      <>
                        <span className="text-[#E3DAC9]">•</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F5ECEE] text-[#8D656E] text-[10px] font-semibold border border-[#ECD9DE]">
                          {item.category}
                        </span>
                      </>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C87A5B] border border-[#F2D7CB] text-[10px] font-bold ml-auto sm:ml-2">
                      {item.confidence} Certainty
                    </span>
                  </div>

                  {/* Reconstructed Expression */}
                  <p className="font-serif text-lg sm:text-xl text-[#1E3A2B] leading-snug">
                    {item.sentence}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isBookmarked
                        ? 'bg-[#FAF0EB] border-[#F2D7CB] text-[#C87A5B]'
                        : 'bg-[#FDFBF7] border-[#E3DAC9] text-[#72786F] hover:text-[#1E3A2B]'
                    }`}
                    title={isBookmarked ? 'Bookmarked' : 'Bookmark this exchange'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopySentence(item.sentence)}
                    className="p-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#F2ECE1] border border-[#E3DAC9] text-[#72786F] hover:text-[#1E3A2B] transition-colors"
                    title="Copy phrase"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePlayAudio(item.id, item.sentence)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isPlaying
                        ? 'bg-[#C87A5B] text-white animate-pulse'
                        : 'bg-[#1E3A2B] hover:bg-[#152A1F] text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlaying ? 'Playing...' : 'Replay'}</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
