import React from "react";
import { ThemeConfig } from "../types";
import { ShoppingCart, Star, User, ExternalLink, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface MarketplaceProps {
  themes: ThemeConfig[];
  onSelect: (theme: ThemeConfig) => void;
  onBuy: (theme: ThemeConfig) => void;
  onDelete: (id: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ themes, onSelect, onBuy, onDelete }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Skin Market</h2>
          <p className="text-zinc-500">Premium interfaces for the AI era</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400">Trending</div>
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400">Newest</div>
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
            <div 
              className="h-48 w-full p-4 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: theme.colors.bgPrimary }}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
              
              <div className="relative z-10 space-y-2 w-full max-w-[200px]">
                <div 
                  className="h-8 rounded-full w-3/4" 
                  style={{ backgroundColor: theme.colors.aiBubble }}
                />
                <div 
                  className="h-8 rounded-full w-1/2 ml-auto" 
                  style={{ backgroundColor: theme.colors.userBubble }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{theme.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                    <User className="w-3 h-3" /> {theme.author}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">4.9</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <div className="text-2xl font-black">
                  {theme.price === 0 ? "FREE" : `$${theme.price}`}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onDelete(theme.id)}
                    className="p-3 bg-zinc-800 text-zinc-500 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                    title="Delete Theme"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onSelect(theme)}
                    className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                    title="Preview"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onBuy(theme)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" /> {theme.price === 0 ? "Get" : "Buy"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
