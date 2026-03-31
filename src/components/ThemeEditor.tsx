import React, { useEffect, useRef } from "react";
import { ThemeConfig } from "../types";
import { Palette, Type, Square, Download, Share2, DollarSign, Image as ImageIcon, Monitor, X } from "lucide-react";

interface ThemeEditorProps {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
  onExport: () => void;
  onPublish: () => void;
  activeSection?: string | null;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange, onExport, onPublish, activeSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    if (activeSection && sectionsRef.current[activeSection]) {
      sectionsRef.current[activeSection]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [activeSection]);

  const updateColor = (key: keyof ThemeConfig["colors"], value: string | number) => {
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

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 p-6 overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Palette className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Theme Editor</h2>
            <p className="text-xs text-zinc-500">Customize your AI experience</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700" title="Desktop Optimized">
          <Monitor className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Desktop</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Identity</h3>
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
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Wallpaper</h3>
          <div className="space-y-4">
            <div className="relative group">
              <label className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all overflow-hidden">
                {theme.colors.backgroundImage ? (
                  <img src={theme.colors.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Wallpaper preview" />
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 text-zinc-500 mb-2 group-hover:text-blue-500" />
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
                  <X className="w-3 h-3" />
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

        {/* Colors */}
        <section 
          ref={el => sectionsRef.current['colors'] = el}
          className={`transition-all duration-500 rounded-xl p-2 -m-2 ${['bgPrimary', 'bgSecondary', 'textPrimary', 'textSecondary', 'accent', 'userBubble', 'aiBubble', 'border'].includes(activeSection || '') ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
        >
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Color Palette</h3>
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
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Style</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block flex items-center gap-2">
                <Type className="w-4 h-4" /> Font Family
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
                <Square className="w-4 h-4" /> Border Radius
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

        {/* Actions */}
        <div className="pt-6 space-y-3">
          <button 
            onClick={onExport}
            className="w-full bg-zinc-100 text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSS
          </button>
          <button 
            onClick={onPublish}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Share2 className="w-4 h-4" /> Publish to Market
          </button>
        </div>
      </div>
    </div>
  );
};
