import React, { useState, useEffect } from "react";
import { ThemeConfig } from "./types";
import { DEFAULT_THEMES } from "./constants";
import { ThemeEditor } from "./components/ThemeEditor";
import { ChatPreview } from "./components/ChatPreview";
import { Marketplace } from "./components/Marketplace";
import { motion, AnimatePresence } from "motion/react";
import { Layout, ShoppingBag, Plus, CheckCircle2, X, Github } from "lucide-react";

type View = "editor" | "marketplace";

export default function App() {
  const [view, setView] = useState<View>("editor");
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(DEFAULT_THEMES[0]);
  const [platform, setPlatform] = useState<"chatgpt" | "gemini">("chatgpt");
  const [marketplaceThemes, setMarketplaceThemes] = useState<ThemeConfig[]>(DEFAULT_THEMES);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    const css = `
/* SkinCraft Theme: ${activeTheme.name} */
/* NOTE: This skin is optimized for Desktop versions of ChatGPT/Gemini */

:root {
  --skincraft-bg: ${activeTheme.colors.bgPrimary};
  --skincraft-surface: ${activeTheme.colors.bgSecondary};
  --skincraft-text: ${activeTheme.colors.textPrimary};
  --skincraft-accent: ${activeTheme.colors.accent};
  --skincraft-radius: ${activeTheme.borderRadius};
  --skincraft-wallpaper: ${activeTheme.colors.backgroundImage ? `url('${activeTheme.colors.backgroundImage}')` : 'none'};
  --skincraft-wallpaper-opacity: ${activeTheme.colors.backgroundOpacity ?? 0.5};
  --skincraft-wallpaper-size: ${activeTheme.colors.backgroundSize || 'cover'};
  --skincraft-wallpaper-position: ${activeTheme.colors.backgroundPosition || 'center'};
}

/* ChatGPT Desktop Overrides */
@media (min-width: 768px) {
  .dark .bg-gray-800 { 
    background-color: var(--skincraft-bg) !important; 
    background-image: var(--skincraft-wallpaper) !important;
    background-size: var(--skincraft-wallpaper-size) !important;
    background-position: var(--skincraft-wallpaper-position) !important;
    position: relative !important;
  }
  
  .dark .bg-gray-800::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--skincraft-bg);
    opacity: calc(1 - var(--skincraft-wallpaper-opacity));
    z-index: 0;
  }

  .dark .text-gray-100 { color: var(--skincraft-text) !important; position: relative; z-index: 1; }
}
    `;
    
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, "-")}.css`;
    a.click();
    showNotification("CSS Theme exported successfully!");
  };

  const handlePublish = () => {
    const newTheme = { ...activeTheme, id: Math.random().toString(36).substr(2, 9) };
    setMarketplaceThemes([newTheme, ...marketplaceThemes]);
    showNotification("Theme published to marketplace!");
    setView("marketplace");
  };

  const handleBuy = (theme: ThemeConfig) => {
    showNotification(`Successfully purchased ${theme.name}!`, "success");
  };

  const handleDeleteTheme = (id: string) => {
    setMarketplaceThemes(marketplaceThemes.filter(t => t.id !== id));
    showNotification("Theme removed from marketplace", "info");
  };

  const handleElementClick = (section: string) => {
    setActiveSection(section);
    // Reset highlight after a delay
    setTimeout(() => setActiveSection(null), 2000);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-20 border-r border-zinc-900 flex flex-col items-center py-8 gap-8 z-50 bg-zinc-950">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
          <Layout className="text-white w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-4 flex-1">
          <button 
            onClick={() => setView("editor")}
            className={`p-4 rounded-2xl transition-all ${view === "editor" ? "bg-zinc-900 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Plus className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setView("marketplace")}
            className={`p-4 rounded-2xl transition-all ${view === "marketplace" ? "bg-zinc-900 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <a href="#" className="p-4 text-zinc-500 hover:text-zinc-300 transition-all">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "editor" ? (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full"
            >
              <div className="w-96 flex-shrink-0">
                <ThemeEditor 
                  theme={activeTheme} 
                  onChange={setActiveTheme} 
                  onExport={handleExport}
                  onPublish={handlePublish}
                  activeSection={activeSection}
                />
              </div>
              
              <div className="flex-1 bg-zinc-950 p-12 flex flex-col items-center justify-center relative">
                {/* Platform Switcher */}
                <div className="absolute top-8 flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
                  <button 
                    onClick={() => setPlatform("chatgpt")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${platform === "chatgpt" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    ChatGPT
                  </button>
                  <button 
                    onClick={() => setPlatform("gemini")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${platform === "gemini" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    Gemini
                  </button>
                </div>

                <div className="w-full max-w-4xl aspect-[16/10] relative">
                  <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full" />
                  <ChatPreview 
                    theme={activeTheme} 
                    platform={platform} 
                    onElementClick={handleElementClick}
                  />
                </div>

                <div className="mt-12 flex gap-8 text-zinc-500 text-xs uppercase tracking-widest font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Real-time Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> CSS Injection Ready
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="marketplace"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto custom-scrollbar bg-zinc-950"
            >
              <Marketplace 
                themes={marketplaceThemes} 
                onSelect={(t) => { setActiveTheme(t); setView("editor"); }}
                onBuy={handleBuy}
                onDelete={handleDeleteTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl"
            >
              <CheckCircle2 className="text-green-500 w-6 h-6" />
              <span className="font-medium">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-4 text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
