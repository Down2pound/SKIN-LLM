import React from "react";
import { ThemeConfig } from "../types";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Settings, 
  User, 
  Mic, 
  Image as ImageIcon, 
  Music, 
  PenTool, 
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  MoreHorizontal
} from "lucide-react";

interface ChatPreviewProps {
  theme: ThemeConfig;
  platform: "chatgpt" | "gemini";
  onElementClick?: (section: string) => void;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ theme, platform, onElementClick }) => {
  const { colors, fontFamily, borderRadius } = theme;

  const isChatGPT = platform === "chatgpt";

  return (
    <div 
      className="w-full h-full flex overflow-hidden border shadow-2xl transition-all duration-500 relative group/preview"
      style={{ 
        backgroundColor: colors.bgPrimary, 
        fontFamily,
        borderColor: colors.border,
        borderRadius: '1rem'
      }}
      onClick={() => onElementClick?.("bgPrimary")}
    >
      {/* Background Image Layer */}
      {colors.backgroundImage && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${colors.backgroundImage})`,
            backgroundSize: colors.backgroundSize || 'cover',
            backgroundPosition: colors.backgroundPosition || 'center',
            opacity: colors.backgroundOpacity ?? 0.5
          }}
          onClick={(e) => { e.stopPropagation(); onElementClick?.("backgroundImage"); }}
        />
      )}

      {/* Sidebar Layer */}
      <div 
        className="w-64 h-full border-r relative z-10 flex flex-col hidden md:flex cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all"
        style={{ 
          backgroundColor: colors.backgroundImage ? `${colors.bgPrimary}aa` : colors.bgPrimary,
          borderColor: colors.border,
          backdropFilter: colors.backgroundImage ? 'blur(12px)' : 'none'
        }}
        onClick={(e) => { e.stopPropagation(); onElementClick?.("bgPrimary"); }}
      >
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors w-full text-left">
              <div className="w-6 h-6 flex items-center justify-center">
                {isChatGPT ? <Plus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>New chat</span>
            </button>
            {isChatGPT && <button className="p-2 text-zinc-500"><MessageSquare className="w-4 h-4" /></button>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 text-xs font-semibold uppercase tracking-wider opacity-50" style={{ color: colors.textSecondary }}>
              {isChatGPT ? <><Search className="w-3 h-3" /> Search chats</> : "Gems"}
            </div>
            {!isChatGPT && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: colors.textPrimary }}>
                  <Sparkles className="w-4 h-4" /> drive organizer
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: colors.textPrimary }}>
                  <Sparkles className="w-4 h-4" /> Storybook
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2" style={{ color: colors.textSecondary }}>
            Recent
          </div>
          {["Life Insurance Payouts", "Eye soreness follow-up", "Fake Review Scam", "Cataract Surgery Delays", "Mind Map Redesign"].map((chat, i) => (
            <div key={i} className="p-2 rounded-lg hover:bg-white/5 text-sm truncate cursor-pointer" style={{ color: colors.textPrimary }}>
              {chat}
            </div>
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">JC</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>JeFF Chapin</div>
              <div className="text-[10px] opacity-50" style={{ color: colors.textSecondary }}>Plus</div>
            </div>
            <MoreHorizontal className="w-4 h-4 opacity-50" />
          </div>
        </div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* Header */}
        <div 
          className="px-4 py-3 flex items-center justify-between backdrop-blur-md"
          style={{ 
            backgroundColor: colors.backgroundImage ? 'transparent' : 'transparent', 
          }}
        >
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
              <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                {isChatGPT ? "ChatGPT" : "Gemini"}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-white/5"><LayoutGrid className="w-5 h-5 opacity-50" /></button>
              <button className="p-2 rounded-full hover:bg-white/5"><User className="w-5 h-5 opacity-50" /></button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Greeting */}
            <div 
              className="text-center space-y-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={(e) => { e.stopPropagation(); onElementClick?.("textPrimary"); }}
            >
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                {isChatGPT ? "How can I help, MOFUGGA?" : "Hi Jeffrey, What's new today?"}
              </h1>
            </div>

            {/* Mock Chat Bubbles */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="flex justify-end">
                <div 
                  className="px-4 py-2 max-w-[80%] cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all"
                  style={{ 
                    backgroundColor: colors.userBubble, 
                    color: "#fff",
                    borderRadius: theme.borderRadius 
                  }}
                  onClick={(e) => { e.stopPropagation(); onElementClick?.("userBubble"); }}
                >
                  <p className="text-sm">Can you help me design a custom skin for my AI?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div 
                  className="px-4 py-2 max-w-[80%] border cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all"
                  style={{ 
                    backgroundColor: colors.aiBubble === 'transparent' ? 'transparent' : colors.aiBubble, 
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    borderRadius: theme.borderRadius 
                  }}
                  onClick={(e) => { e.stopPropagation(); onElementClick?.("aiBubble"); }}
                >
                  <p className="text-sm">Of course! I can help you customize colors, fonts, and even add a custom wallpaper. What's your vibe?</p>
                </div>
              </div>
            </div>

            {/* Centered Input Bar */}
            <div className="w-full max-w-2xl space-y-4">
              <div 
                className="relative flex items-center p-4 border shadow-xl transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/30"
                style={{ 
                  backgroundColor: colors.bgSecondary, 
                  borderColor: colors.border,
                  borderRadius: isChatGPT ? '2rem' : '1.5rem'
                }}
                onClick={(e) => { e.stopPropagation(); onElementClick?.("bgSecondary"); }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Plus className="w-5 h-5 opacity-50" />
                  {!isChatGPT && <LayoutGrid className="w-5 h-5 opacity-50" />}
                  <div className="flex-1 text-base opacity-40" style={{ color: colors.textPrimary }}>
                    {isChatGPT ? "Ask anything" : "Ask Gemini"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 opacity-50" />
                  {isChatGPT ? (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-sm" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 text-xs font-medium opacity-50">
                      Pro <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestion Chips (Gemini Only) */}
              {!isChatGPT && (
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { icon: <ImageIcon className="w-3 h-3" />, label: "Create image" },
                    { icon: <Music className="w-3 h-3" />, label: "Create music" },
                    { icon: <PenTool className="w-3 h-3" />, label: "Write anything" },
                    { icon: <HelpCircle className="w-3 h-3" />, label: "Help me learn" }
                  ].map((chip, i) => (
                    <button 
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-xs font-medium hover:ring-2 hover:ring-blue-500/30"
                      style={{ color: colors.textPrimary }}
                      onClick={(e) => { e.stopPropagation(); onElementClick?.("accent"); }}
                    >
                      {chip.icon}
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-[10px] opacity-40" style={{ color: colors.textSecondary }}>
            {isChatGPT ? "ChatGPT can make mistakes. Check important info." : "Gemini may display inaccurate info, including about people."}
          </p>
        </div>
      </div>
    </div>
  );
};
