import React, { useEffect, useRef } from "react";
import { ThemeConfig } from "../types";
import { STYLE_PRESETS } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPalette, 
  faFont, 
  faSquare, 
  faDownload, 
  faShareAlt, 
  faDollarSign, 
  faImage, 
  faDesktop, 
  faTimes, 
  faLock, 
  faUnlock,
  faMagic,
  faFingerprint,
  faFillDrip,
  faPlay,
  faQuestionCircle,
  faBolt,
  faCopy,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import {
  faSpotify,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";

interface ThemeEditorProps {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
  onExport: () => void;
  onPublish: () => void;
  onUnlock?: () => void;
  onUnlockMusic?: () => void;
  activeSection?: string | null;
  user?: any;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange, onExport, onPublish, onUnlock, onUnlockMusic, activeSection, user }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const [copied, setCopied] = React.useState<"link" | "stylus" | null>(null);

  const handleCopyLink = () => {
    if (!user) return;
    const code = `javascript:(function(){const s=document.createElement('link');s.rel='stylesheet';s.id='skincraft-live-theme';const url='${window.location.origin}/api/theme/live/${user.uid}/css';s.href=url+'?t='+Date.now();const old=document.getElementById('skincraft-live-theme');if(old)old.remove();document.head.appendChild(s);if(!window.skincraftInterval){window.skincraftInterval=setInterval(()=>{const link=document.getElementById('skincraft-live-theme');if(link)link.href=url+'?t='+Date.now();},2000);}})()`;
    navigator.clipboard.writeText(code);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyStylus = () => {
    const css = `/* ==UserStyle==
@name           SkinCraft: ${theme.name}
@namespace      skincraft
@version        1.0.0
@description    Premium interface skin for ChatGPT
@author         ${theme.author}
@license        unlicense
==/UserStyle== */

@-moz-document domain("chatgpt.com"), domain("gemini.google.com") {
  ${generateThemeCSS(theme)}
}`;
    navigator.clipboard.writeText(css);
    setCopied("stylus");
    setTimeout(() => setCopied(null), 2000);
  };

  function generateThemeCSS(theme: ThemeConfig) {
    return `
:root {
  --skincraft-bg: ${theme.colors.bgPrimary};
  --skincraft-secondary: ${theme.colors.bgSecondary};
  --skincraft-text: ${theme.colors.text};
  --skincraft-accent: ${theme.colors.accent};
  --skincraft-border: ${theme.colors.border};
  --skincraft-user-bubble: ${theme.colors.userBubble};
  --skincraft-ai-bubble: ${theme.colors.aiBubble};
  --skincraft-wallpaper-opacity: ${theme.colors.backgroundOpacity ?? 0.5};
}

/* ChatGPT Selectors */
.dark .bg-token-main-surface-primary,
.dark main,
.dark .bg-gray-900 { 
  background-color: var(--skincraft-bg) !important; 
}

.dark .bg-token-main-surface-secondary,
.dark .bg-gray-800 { 
  background-color: var(--skincraft-secondary) !important; 
}

.dark .prose { 
  color: var(--skincraft-text) !important; 
}

/* Gemini Selectors */
body, .chat-container {
  background-color: var(--skincraft-bg) !important;
}
    `;
  }

  useEffect(() => {
    if (activeSection && sectionsRef.current[activeSection]) {
      sectionsRef.current[activeSection]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [activeSection]);

  const isLocked = !theme.canCustomize;

  const updateColor = (key: keyof ThemeConfig["colors"], value: string | number) => {
    if (isLocked) return;
    onChange({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value,
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newColors = {
          ...theme.colors,
          backgroundImage: reader.result as string,
        };
        
        if (newColors.backgroundOpacity === undefined) {
          newColors.backgroundOpacity = 0.5;
        }

        onChange({
          ...theme,
          colors: newColors
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomTheme = () => {
    if (isLocked) return;
    
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const fonts = ["Inter", "JetBrains Mono", "Georgia", "system-ui"];
    const radii = ["0px", "4px", "8px", "12px", "16px", "24px", "2rem"];
    
    // Generate a cohesive palette
    const hue = Math.floor(Math.random() * 360);
    const bgPrimary = `hsl(${hue}, 20%, 10%)`;
    const bgSecondary = `hsl(${hue}, 25%, 15%)`;
    const accent = `hsl(${hue}, 70%, 60%)`;
    const textPrimary = `hsl(${hue}, 10%, 95%)`;
    const textSecondary = `hsl(${hue}, 10%, 70%)`;
    
    onChange({
      ...theme,
      fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
      borderRadius: radii[Math.floor(Math.random() * radii.length)],
      colors: {
        ...theme.colors,
        bgPrimary,
        bgSecondary,
        textPrimary,
        textSecondary,
        accent,
        userBubble: accent,
        aiBubble: bgPrimary,
        border: `hsl(${hue}, 30%, 25%)`,
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 p-6 overflow-y-auto custom-scrollbar relative"
    >
      {/* Magic Button */}
      {!isLocked && (
        <button 
          onClick={generateRandomTheme}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-110 transition-all z-50 group"
          title="Surprise Me!"
        >
          <FontAwesomeIcon icon={faMagic} className="text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center p-8 text-center bg-zinc-950/40 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800 shadow-2xl">
            <FontAwesomeIcon icon={faLock} className="text-2xl text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Editor Locked</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-[200px]">
            You can preview this skin, but editing requires Customization Access.
          </p>
          <button 
            onClick={onUnlock}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <FontAwesomeIcon icon={faUnlock} className="text-sm" /> Unlock for $1.50
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {isLocked ? <FontAwesomeIcon icon={faLock} className="text-white text-lg" /> : <FontAwesomeIcon icon={faPalette} className="text-white text-lg" />}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{isLocked ? "View Only" : "Theme Editor"}</h2>
            <p className="text-xs text-zinc-500">{isLocked ? "Unlock to customize" : "Customize your AI experience"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700" title="Desktop Optimized">
          <FontAwesomeIcon icon={faDesktop} className="text-[10px] text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Desktop</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faFingerprint} className="text-[10px]" /> Identity
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block">Theme Name</label>
              <input 
                type="text" 
                value={theme.name}
                onChange={(e) => onChange({ ...theme, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block">Price ($)</label>
              <div className="relative">
                <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500" />
                <input 
                  type="number" 
                  value={theme.price || 0}
                  onChange={(e) => onChange({ ...theme, price: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Background Image */}
        <section 
          ref={el => sectionsRef.current['backgroundImage'] = el}
          className={`transition-all duration-500 rounded-xl p-2 -m-2 ${activeSection === 'backgroundImage' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
        >
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faImage} className="text-[10px]" /> Wallpaper
          </h3>
          <div className="space-y-4">
            <div className="relative group">
              <label className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all overflow-hidden">
                {theme.colors.backgroundImage ? (
                  <img src={theme.colors.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Wallpaper preview" />
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                  <FontAwesomeIcon icon={faImage} className="text-xl text-zinc-500 mb-2 group-hover:text-blue-500" />
                  <span className="text-xs text-zinc-500 group-hover:text-blue-500">
                    {theme.colors.backgroundImage ? "Change Wallpaper" : "Upload Background"}
                  </span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {theme.colors.backgroundImage && (
                <button 
                  onClick={() => updateColor("backgroundImage", "")}
                  className="absolute top-2 right-2 p-1 bg-zinc-900/80 rounded-md text-zinc-400 hover:text-white z-20"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                </button>
              )}
            </div>
            
            {theme.colors.backgroundImage && (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-zinc-400">Opacity</label>
                    <span className="text-[10px] text-zinc-500 font-mono">{(theme.colors.backgroundOpacity ?? 0.5).toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={theme.colors.backgroundOpacity ?? 0.5}
                    onChange={(e) => updateColor("backgroundOpacity", parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block uppercase tracking-wider">Size</label>
                    <select 
                      value={theme.colors.backgroundSize || "cover"}
                      onChange={(e) => updateColor("backgroundSize", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="auto">Auto</option>
                      <option value="100% 100%">Stretch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block uppercase tracking-wider">Position</label>
                    <select 
                      value={theme.colors.backgroundPosition || "center"}
                      onChange={(e) => updateColor("backgroundPosition", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Style Presets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <FontAwesomeIcon icon={faMagic} className="text-[10px]" /> Style Presets
            </h3>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full border border-blue-500/20">
              QUICK APPLY
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  if (isLocked) return;
                  onChange({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      ...preset.colors
                    },
                    borderRadius: preset.borderRadius,
                    fontFamily: preset.fontFamily
                  });
                }}
                className="group relative flex flex-col items-start p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-blue-500/50 hover:bg-zinc-800 transition-all text-left overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-12 h-12 -mr-4 -mt-4 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: preset.colors.accent }}
                />
                <span className="text-xs font-bold text-white mb-1 relative z-10">{preset.name}</span>
                <span className="text-[9px] text-zinc-500 leading-tight relative z-10">{preset.description}</span>
                
                <div className="mt-3 flex gap-1 relative z-10">
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.bgPrimary }} />
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.accent }} />
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.textPrimary }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section 
          ref={el => sectionsRef.current['colors'] = el}
          className={`transition-all duration-500 rounded-xl p-2 -m-2 ${['bgPrimary', 'bgSecondary', 'textPrimary', 'textSecondary', 'accent', 'userBubble', 'aiBubble', 'border'].includes(activeSection || '') ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
        >
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faFillDrip} className="text-[10px]" /> Color Palette
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Background", key: "bgPrimary" },
              { label: "Surface", key: "bgSecondary" },
              { label: "Text Main", key: "textPrimary" },
              { label: "Text Muted", key: "textSecondary" },
              { label: "Accent", key: "accent" },
              { label: "User Bubble", key: "userBubble" },
              { label: "AI Bubble", key: "aiBubble" },
              { label: "Border", key: "border" },
            ].map((item) => (
              <div 
                key={item.key}
                ref={el => sectionsRef.current[item.key] = el}
                className={`transition-all duration-500 rounded-lg p-1 ${activeSection === item.key ? 'ring-2 ring-blue-500 bg-blue-500/10 scale-105' : ''}`}
              >
                <label className="text-[11px] text-zinc-500 mb-1 block">{item.label}</label>
                <div className="flex items-center gap-2 bg-zinc-800 p-1.5 rounded-lg border border-zinc-700">
                  <input 
                    type="color" 
                    value={theme.colors[item.key as keyof ThemeConfig["colors"]] as string}
                    onChange={(e) => updateColor(item.key as keyof ThemeConfig["colors"], e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {theme.colors[item.key as keyof ThemeConfig["colors"]]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography & Shapes */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMagic} className="text-[10px]" /> Style
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block flex items-center gap-2">
                <FontAwesomeIcon icon={faFont} className="text-xs" /> Font Family
              </label>
              <select 
                value={theme.fontFamily}
                onChange={(e) => onChange({ ...theme, fontFamily: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inter">Inter (Modern)</option>
                <option value="JetBrains Mono">JetBrains Mono (Tech)</option>
                <option value="Georgia">Georgia (Classic)</option>
                <option value="system-ui">System UI</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block flex items-center gap-2">
                <FontAwesomeIcon icon={faSquare} className="text-xs" /> Border Radius
              </label>
              <input 
                type="range" 
                min="0" 
                max="24" 
                step="2"
                value={parseInt(theme.borderRadius) || 0}
                onChange={(e) => onChange({ ...theme, borderRadius: `${e.target.value}px` })}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>Sharp</span>
                <span>Rounded</span>
              </div>
            </div>
          </div>
        </section>

        {/* Music Widget */}
        <section className="relative">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlay} className="text-[10px]" /> Music Widget
          </h3>
          
          {!theme.musicWidget?.isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-[2px] rounded-xl border border-zinc-800 p-4 text-center">
              <FontAwesomeIcon icon={faLock} className="text-blue-500 mb-2" />
              <p className="text-[10px] text-zinc-400 mb-3">Music Widget is a premium add-on.</p>
              <button 
                onClick={onUnlockMusic}
                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                Unlock for $3.00
              </button>
            </div>
          )}

          <div className={`space-y-4 ${!theme.musicWidget?.isUnlocked ? 'opacity-20 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Enable Widget</label>
              <div className="flex items-center gap-2">
                {theme.musicWidget?.position && (
                  <button 
                    onClick={() => onChange({
                      ...theme,
                      musicWidget: {
                        ...theme.musicWidget!,
                        position: undefined
                      }
                    })}
                    className="text-[10px] text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Reset Position
                  </button>
                )}
                <button 
                  onClick={() => onChange({
                    ...theme,
                    musicWidget: {
                      ...theme.musicWidget!,
                      isVisible: !theme.musicWidget?.isVisible
                    }
                  })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${theme.musicWidget?.isVisible ? 'bg-blue-600' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${theme.musicWidget?.isVisible ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {theme.musicWidget?.isVisible && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wider">Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'spotify', icon: faSpotify, color: '#1DB954' },
                      { id: 'youtube', icon: faYoutube, color: '#FF0000' },
                      { id: 'pandora', icon: faPlay, color: '#00A0EE' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onChange({
                          ...theme,
                          musicWidget: {
                            ...theme.musicWidget!,
                            provider: p.id as any
                          }
                        })}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${theme.musicWidget?.provider === p.id ? 'bg-zinc-800 border-blue-500' : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'}`}
                      >
                        <FontAwesomeIcon icon={p.icon} style={{ color: p.color }} className="text-lg" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: theme.musicWidget?.provider === p.id ? '#fff' : '#71717a' }}>{p.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wider">Playlist ID / URL</label>
                  <input 
                    type="text" 
                    placeholder="Enter ID or URL"
                    value={theme.musicWidget?.playlistId || ""}
                    onChange={(e) => onChange({
                      ...theme,
                      musicWidget: {
                        ...theme.musicWidget!,
                        playlistId: e.target.value
                      }
                    })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <p className="text-[9px] text-zinc-500 mt-1.5 leading-relaxed">
                    Paste a public playlist ID or URL from your chosen provider to embed it.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* One-Click Integration */}
        <section className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-[10px]" /> One-Click Apply
            </h3>
            <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded uppercase">NEW</span>
          </div>
          
          <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
            Drag the button to your bookmarks bar, or copy the link and add it manually as a bookmark.
          </p>

          {user ? (
            <div className="space-y-3">
              <a 
                href={`javascript:(function(){const s=document.createElement('link');s.rel='stylesheet';s.id='skincraft-live-theme';const url='${window.location.origin}/api/theme/live/${user.uid}/css';s.href=url+'?t='+Date.now();const old=document.getElementById('skincraft-live-theme');if(old)old.remove();document.head.appendChild(s);if(!window.skincraftInterval){window.skincraftInterval=setInterval(()=>{const link=document.getElementById('skincraft-live-theme');if(link)link.href=url+'?t='+Date.now();},2000);}})()`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 cursor-move"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', e.currentTarget.href);
                }}
              >
                <FontAwesomeIcon icon={faBolt} /> Drag to Bookmarks
              </a>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={copied === "link" ? faCheck : faBolt} className={copied === "link" ? "text-green-500" : ""} />
                  {copied === "link" ? "Copied!" : "Copy Link"}
                </button>
                <button 
                  onClick={handleCopyStylus}
                  className="flex-1 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={copied === "stylus" ? faCheck : faCopy} className={copied === "stylus" ? "text-green-500" : ""} />
                  {copied === "stylus" ? "Copied!" : "Copy Stylus"}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-center">
              <p className="text-[10px] text-zinc-500 italic">Login to enable One-Click Apply</p>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="pt-6 space-y-3">
          <div className="space-y-2">
            <button 
              onClick={onExport}
              className="w-full bg-zinc-100 text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors"
            >
              <FontAwesomeIcon icon={faDownload} className="text-sm" /> Export CSS
            </button>
            <p className="text-[9px] text-zinc-500 flex items-center gap-1.5 px-1">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-500" />
              Use with Stylus or UserCSS extensions to apply to your AI chat.
            </p>
          </div>
          <button 
            onClick={onPublish}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            <FontAwesomeIcon icon={faShareAlt} className="text-sm" /> Publish to Market
          </button>
        </div>
      </div>
    </div>
  );
};
