import React, { useRef } from "react";
import { ThemeConfig } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useDragControls } from "motion/react";
import { 
  faPlus, 
  faCommentAlt, 
  faSearch, 
  faMagic, 
  faEllipsisH, 
  faChevronDown, 
  faThLarge, 
  faUser, 
  faMicrophone, 
  faImage, 
  faMusic, 
  faPen, 
  faQuestionCircle,
  faRobot,
  faPlay,
  faGripVertical
} from "@fortawesome/free-solid-svg-icons";

interface ChatPreviewProps {
  theme: ThemeConfig;
  platform: "chatgpt" | "gemini";
  onElementClick?: (section: string) => void;
  onWidgetPositionChange?: (position: { x: number; y: number }) => void;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ 
  theme, 
  platform, 
  onElementClick,
  onWidgetPositionChange 
}) => {
  const { colors, fontFamily, borderRadius } = theme;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const isChatGPT = platform === "chatgpt";

  return (
    <div 
      ref={containerRef}
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
          className="absolute inset-0 z-0 transition-opacity duration-500 cursor-pointer"
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
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
              </div>
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>New chat</span>
            </button>
            {isChatGPT && <button className="p-2 text-zinc-500"><FontAwesomeIcon icon={faCommentAlt} className="text-xs" /></button>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 text-xs font-semibold uppercase tracking-wider opacity-50" style={{ color: colors.textSecondary }}>
              {isChatGPT ? <><FontAwesomeIcon icon={faSearch} className="text-[10px]" /> Search chats</> : "Gems"}
            </div>
            {!isChatGPT && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: colors.textPrimary }}>
                  <FontAwesomeIcon icon={faMagic} className="text-xs" /> drive organizer
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: colors.textPrimary }}>
                  <FontAwesomeIcon icon={faMagic} className="text-xs" /> Storybook
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
            <FontAwesomeIcon icon={faEllipsisH} className="text-xs opacity-50" />
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
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] opacity-50" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-white/5"><FontAwesomeIcon icon={faThLarge} className="text-sm opacity-50" /></button>
              <button className="p-2 rounded-full hover:bg-white/5"><FontAwesomeIcon icon={faUser} className="text-sm opacity-50" /></button>
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
                  <FontAwesomeIcon icon={faPlus} className="text-sm opacity-50" />
                  {!isChatGPT && <FontAwesomeIcon icon={faThLarge} className="text-sm opacity-50" />}
                  <div className="flex-1 text-base opacity-40" style={{ color: colors.textPrimary }}>
                    {isChatGPT ? "Ask anything" : "Ask Gemini"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMicrophone} className="text-sm opacity-50" />
                  {isChatGPT ? (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-sm" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 text-xs font-medium opacity-50">
                      Pro <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestion Chips (Gemini Only) */}
              {!isChatGPT && (
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { icon: <FontAwesomeIcon icon={faImage} className="text-[10px]" />, label: "Create image" },
                    { icon: <FontAwesomeIcon icon={faMusic} className="text-[10px]" />, label: "Create music" },
                    { icon: <FontAwesomeIcon icon={faPen} className="text-[10px]" />, label: "Write anything" },
                    { icon: <FontAwesomeIcon icon={faQuestionCircle} className="text-[10px]" />, label: "Help me learn" }
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

      {/* Music Widget Overlay */}
      {theme.musicWidget?.isVisible && theme.musicWidget.playlistId && (
        <motion.div 
          drag
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={containerRef}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            onWidgetPositionChange?.({ x: info.offset.x, y: info.offset.y });
          }}
          className="absolute bottom-24 right-6 z-20 w-64 shadow-2xl group/widget"
          initial={false}
          animate={{ 
            x: theme.musicWidget.position?.x || 0, 
            y: theme.musicWidget.position?.y || 0,
            opacity: 1
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div 
            className="p-1 rounded-2xl border backdrop-blur-xl overflow-hidden relative"
            style={{ 
              backgroundColor: `${colors.bgSecondary}dd`,
              borderColor: colors.border
            }}
          >
            {/* Drag Handle */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="absolute top-1 right-1 z-30 opacity-0 group-hover/widget:opacity-100 transition-opacity cursor-move"
            >
              <div className="bg-black/50 rounded-full p-1 px-2 flex items-center gap-1">
                <FontAwesomeIcon icon={faGripVertical} className="text-[10px] text-white/50" />
              </div>
            </div>

            {theme.musicWidget.provider === 'spotify' && (
              <iframe
                src={`https://open.spotify.com/embed/playlist/${theme.musicWidget.playlistId.split('/').pop()?.split('?')[0]}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            )}
            {theme.musicWidget.provider === 'youtube' && (
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${theme.musicWidget.playlistId.split('list=')[1]?.split('&')[0] || theme.musicWidget.playlistId}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              />
            )}
            {theme.musicWidget.provider === 'pandora' && (
              <div className="h-[80px] flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl">
                <FontAwesomeIcon icon={faPlay} className="text-xl text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400">Pandora</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
