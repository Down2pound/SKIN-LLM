import React from "react";
import { ThemeConfig } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faShoppingCart, 
  faStar, 
  faUser, 
  faExternalLinkAlt, 
  faTrashAlt, 
  faPlus, 
  faLock, 
  faCheckCircle, 
  faUnlock,
  faFire,
  faClock,
  faPlay,
  faMagic,
  faInfoCircle,
  faQuestionCircle,
  faTimes,
  faCopy,
  faBolt,
  faHeart,
  faCheck,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";

interface MarketplaceProps {
  themes: ThemeConfig[];
  onSelect: (theme: ThemeConfig) => void;
  onBuy: (theme: ThemeConfig, customize: boolean) => void;
  onBuyMusic: (theme: ThemeConfig) => void;
  onDelete: (id: string) => void;
  onExport: (theme: ThemeConfig) => void;
  user?: any;
}

const ThemeThumbnail = ({ theme }: { theme: ThemeConfig }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundColor: theme.colors.bgPrimary }}
    >
      {/* Background Image if exists */}
      {theme.colors.backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url(${theme.colors.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (theme.colors.backgroundOpacity ?? 0.5) * 0.5
          }}
        />
      )}

      {/* Mini UI Layout */}
      <div className="absolute inset-0 flex z-10">
        {/* Sidebar */}
        <div 
          className="w-1/4 h-full border-r border-white/5"
          style={{ backgroundColor: theme.colors.bgPrimary, opacity: 0.8 }}
        >
          <div className="p-2 space-y-1">
            <div className="w-full h-1 rounded-full bg-white/10" />
            <div className="w-2/3 h-1 rounded-full bg-white/10" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-3 flex flex-col">
          <div className="flex-1 space-y-2">
            {/* AI Bubble */}
            <div 
              className="w-3/4 h-6 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.aiBubble === 'transparent' ? 'rgba(255,255,255,0.05)' : theme.colors.aiBubble,
                border: `1px solid ${theme.colors.border}`
              }}
            />
            {/* User Bubble */}
            <div 
              className="w-1/2 h-6 rounded-lg ml-auto"
              style={{ backgroundColor: theme.colors.userBubble }}
            />
          </div>
          
          {/* Input Bar */}
          <div 
            className="w-full h-4 rounded-full mt-2"
            style={{ 
              backgroundColor: theme.colors.bgSecondary,
              border: `1px solid ${theme.colors.border}`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Marketplace: React.FC<MarketplaceProps> = ({ themes, onSelect, onBuy, onBuyMusic, onDelete, onExport, user }) => {
  const [showGuide, setShowGuide] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copiedType, setCopiedType] = React.useState<"css" | "bolt" | null>(null);

  const handleCopy = (theme: ThemeConfig, type: "css" | "bolt") => {
    let text = "";
    if (type === "css") {
      // This is a simplified version, the actual CSS is generated in App.tsx
      // But for the marketplace, we can trigger the export or copy a placeholder
      onExport(theme);
      return;
    } else {
      text = `javascript:(function(){const s=document.createElement('link');s.rel='stylesheet';s.id='skincraft-live-theme';const url='${window.location.origin}/api/theme/live/${user?.uid}/css';s.href=url+'?t='+Date.now();const old=document.getElementById('skincraft-live-theme');if(old)old.remove();document.head.appendChild(s);if(!window.skincraftInterval){window.skincraftInterval=setInterval(()=>{const link=document.getElementById('skincraft-live-theme');if(link)link.href=url+'?t='+Date.now();},2000);}})()`;
    }
    
    navigator.clipboard.writeText(text);
    setCopiedId(theme.id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Skin Market</h2>
          <p className="text-zinc-500">Premium interfaces for the AI era</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-500 flex items-center gap-2 hover:bg-blue-600/20 transition-all"
          >
            <FontAwesomeIcon icon={faQuestionCircle} /> How to Use
          </button>
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faFire} className="text-orange-500" /> Trending
          </div>
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-blue-500" /> Newest
          </div>
        </div>
      </div>

      {/* Usage Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setShowGuide(false)} className="text-zinc-500 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FontAwesomeIcon icon={faInfoCircle} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">Usage Guide</h2>
                <p className="text-zinc-500 text-sm">How to apply your purchased skins</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Purchase & Unlock</h4>
                  <p className="text-zinc-400 text-sm">Browse the market and purchase your favorite skin. Once purchased, you can remix it or export it directly.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Customize (Optional)</h4>
                  <p className="text-zinc-400 text-sm">Click "Remix in Editor" to tweak colors, fonts, and wallpapers to match your personal setup.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Export CSS</h4>
                  <p className="text-zinc-400 text-sm">In the Theme Editor, click "Export CSS". This will generate a stylesheet compatible with popular browser extensions like Stylus or UserCSS.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-white mb-1">Apply to AI</h4>
                  <p className="text-zinc-400 text-sm">Open your AI chat (ChatGPT, Claude, etc.), open your CSS extension, and paste the exported code. Your new skin is now active!</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowGuide(false)}
              className="w-full mt-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Got it, let's shop!
            </button>
          </motion.div>
        </div>
      )}

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight uppercase italic">Featured Skins</h3>
            <p className="text-zinc-500 text-xs">Hand-picked by the community</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.slice(0, 3).map((theme, index) => (
            <motion.div 
              key={`featured-${theme.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all shadow-2xl"
            >
              <div className="h-40 w-full relative overflow-hidden cursor-pointer" onClick={() => onSelect(theme)}>
                <ThemeThumbnail theme={theme} />
                <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-black text-[8px] font-black rounded uppercase tracking-widest z-30">Featured</div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">{theme.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">by {theme.author}</span>
                  <button 
                    onClick={() => onSelect(theme)}
                    className="px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-lg hover:bg-zinc-200 transition-all"
                  >
                    View Skin
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <FontAwesomeIcon icon={faFire} className="text-orange-500" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight uppercase italic">Trending Now</h3>
          <p className="text-zinc-500 text-xs">Most popular this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme, index) => (
          <motion.div 
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-600 transition-all"
          >
            {/* Preview Card */}
            <div className="h-48 w-full relative overflow-hidden cursor-pointer" onClick={() => onSelect(theme)}>
              <ThemeThumbnail theme={theme} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                <div className="px-6 py-2 bg-white text-black text-xs font-black rounded-full uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Live Preview
                </div>
              </div>
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <div className="px-2 py-1 bg-blue-500 text-white text-[8px] font-black rounded uppercase tracking-widest shadow-lg">Live</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{theme.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <FontAwesomeIcon icon={faUser} className="text-[10px]" /> {theme.author}
                    </div>
                    {theme.musicWidget?.isUnlocked && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.5 rounded">
                        <FontAwesomeIcon icon={faPlay} className="text-[8px]" /> Music Ready
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FontAwesomeIcon icon={faStar} className="text-sm" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}?theme=${theme.id}`;
                        navigator.clipboard.writeText(url);
                        alert("Share link copied to clipboard!");
                      }}
                      className="text-[10px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center gap-1"
                      title="Share Theme"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} /> Share
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Like logic would go here
                      }}
                      className="text-[10px] text-zinc-600 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faHeart} /> 124
                    </button>
                  </div>
                </div>
              </div>

              {theme.isPurchased && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button 
                    onClick={() => handleCopy(theme, "css")}
                    className="flex items-center justify-center gap-2 py-2 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700"
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-[10px]" /> Export CSS
                  </button>
                  <button 
                    onClick={() => handleCopy(theme, "bolt")}
                    className="flex items-center justify-center gap-2 py-2 bg-blue-600/10 text-blue-500 text-[10px] font-bold rounded-lg hover:bg-blue-600/20 transition-all border border-blue-500/20"
                  >
                    <FontAwesomeIcon icon={copiedId === theme.id && copiedType === "bolt" ? faCheck : faBolt} className="text-[10px]" />
                    {copiedId === theme.id && copiedType === "bolt" ? "Copied!" : "Quick Apply"}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <div className="text-2xl font-black">
                  {theme.isPurchased ? (
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-sm" /> Purchased
                    </div>
                  ) : (
                    theme.price === 0 ? "FREE" : `$${theme.price}`
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onDelete(theme.id)}
                    className="p-3 bg-zinc-800 text-zinc-500 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                    title="Delete Theme"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
                  </button>
                  <button 
                    onClick={() => onSelect(theme)}
                    className="p-1 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 overflow-hidden w-11 h-11 flex items-center justify-center relative"
                    title="Preview"
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      <ThemeThumbnail theme={theme} />
                    </div>
                    {!theme.canCustomize && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <FontAwesomeIcon icon={faLock} className="text-[10px] text-white/70" />
                      </div>
                    )}
                  </button>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {!theme.isPurchased ? (
                      <>
                        <button 
                          onClick={() => onBuy(theme, false)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-xl hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-700"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="text-[10px]" /> {theme.price === 0 ? "Get Skin" : `Buy Skin`}
                        </button>
                        <button 
                          onClick={() => onBuy(theme, true)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> {theme.price === 0 ? "Get + Edit ($1.50)" : `Buy + Edit (+$1.50)`}
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        {!theme.canCustomize ? (
                          <button 
                            onClick={() => onBuy(theme, true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 w-full"
                          >
                            <FontAwesomeIcon icon={faUnlock} className="text-[10px]" /> Unlock Edit ($1.50)
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-500 text-xs font-bold rounded-xl border border-zinc-800 cursor-default">
                              <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" /> Fully Unlocked
                            </div>
                            <button 
                              onClick={() => onSelect(theme)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 w-full"
                            >
                              <FontAwesomeIcon icon={faMagic} className="text-[10px]" /> Remix in Editor
                            </button>
                          </div>
                        )}
                        
                        {!theme.musicWidget?.isUnlocked && (
                          <button 
                            onClick={() => onBuyMusic(theme)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-blue-400 text-xs font-bold rounded-xl hover:bg-zinc-700 transition-all active:scale-95 w-full border border-zinc-700"
                          >
                            <FontAwesomeIcon icon={faPlay} className="text-[10px]" /> Music Add-on ($3.00)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
