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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['conv-2', 'conv-6']));

  const categories = ['All', 'Campus', 'Healthcare', 'Social', 'General'];

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.sentence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokens.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6 text-[#343832]">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-[#E3DAC9] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-serif font-bold text-[#1E3A2B]">Conversation Library</h1>
            <span className="px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2B] text-xs font-bold border border-[#D5E4DB]">
              {history.length} Sessions Logged
            </span>
          </div>
          <p className="text-xs text-[#72786F] mt-1 font-medium">
            Search, replay, and review real-time sign language translations with gloss morphology
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Analytics Micro Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">Total Signs Captured</span>
          <span className="text-2xl font-bold text-[#1E3A2B] mt-1 font-serif">128 Signs</span>
          <span className="text-[10px] text-[#1E3A2B] font-medium mt-0.5">Across 6 sessions today</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">Mean Pose Certainty</span>
          <span className="text-2xl font-bold text-[#C87A5B] mt-1 font-serif">98.9%</span>
          <span className="text-[10px] text-[#72786F] mt-0.5">ISL / ASL dual engine</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">Speech Synthesizer</span>
          <span className="text-2xl font-bold text-[#8D656E] mt-1 font-serif">Warm Alto</span>
          <span className="text-[10px] text-[#72786F] mt-0.5">Speed: {speed.toFixed(1)}x</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E3DAC9] shadow-xs flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#72786F] font-semibold">Saved Bookmarks</span>
          <span className="text-2xl font-bold text-[#1E3A2B] mt-1 font-serif">{bookmarkedIds.size}</span>
          <span className="text-[10px] text-[#72786F] mt-0.5">Quick access phrases</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E3DAC9] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#9DA39A]" />
          <input
            type="text"
            placeholder="Search phrases or individual signs (e.g. stomach ache, class)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FDFBF7] border border-[#E3DAC9] text-sm text-[#1E3A2B] placeholder-[#9DA39A] focus:outline-none focus:border-[#1E3A2B]"
          />
        </div>

        {/* Category Pills in Brand Palette */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-[#FDFBF7] text-[#72786F] hover:bg-[#F2ECE1] hover:text-[#1E3A2B] border border-[#E3DAC9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="flex flex-col gap-3">
        {filteredHistory.length === 0 ? (
          <div className="p-12 rounded-[28px] bg-white border border-[#E3DAC9] text-center flex flex-col items-center justify-center gap-2 shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#9DA39A]" />
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
                className="p-5 rounded-[24px] bg-white border border-[#E3DAC9] hover:border-[#1E3A2B]/40 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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

                  {/* Gloss Breakdown Tape */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#72786F] mr-1">
                      Glosses:
                    </span>
                    {item.tokens.map((token, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#FDFBF7] text-[#1E3A2B] text-xs font-medium border border-[#E3DAC9]"
                      >
                        {token}
                      </span>
                    ))}
                  </div>

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
