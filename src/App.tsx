import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { ThemeConfig } from "./types";
import { DEFAULT_THEMES } from "./constants";
import { ThemeEditor } from "./components/ThemeEditor";
import { ChatPreview } from "./components/ChatPreview";
import { Marketplace } from "./components/Marketplace";
import { motion, AnimatePresence } from "motion/react";
import { Layout, ShoppingBag, Plus, CheckCircle2, X, Github, LogIn, LogOut, User as UserIcon, AlertTriangle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPalette, 
  faStore, 
  faPlus, 
  faCheckCircle, 
  faTimes, 
  faUserCircle, 
  faSignInAlt, 
  faSignOutAlt, 
  faExclamationTriangle,
  faRobot,
  faMagic,
  faGem,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { 
  auth, db, googleProvider, signInWithPopup, onAuthStateChanged, User, 
  handleFirestoreError, OperationType 
} from "./firebase";
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, query, where, serverTimestamp 
} from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type View = "editor" | "marketplace";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-zinc-400 text-sm">
              {this.state.error?.message.startsWith('{') 
                ? "A database error occurred. Please check your permissions." 
                : this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [view, setView] = useState<View>("editor");
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(DEFAULT_THEMES[0]);
  const [platform, setPlatform] = useState<"chatgpt" | "gemini">("chatgpt");
  const [marketplaceThemes, setMarketplaceThemes] = useState<ThemeConfig[]>(DEFAULT_THEMES);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userPurchases, setUserPurchases] = useState<Record<string, { canCustomize: boolean; musicUnlocked: boolean }>>({});
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isPushingLive, setIsPushingLive] = useState(false);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        showNotification(`Welcome back, ${currentUser.displayName}!`, "info");
      }
    });

    // Check for Stripe success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      const themeId = params.get('themeId');
      showNotification("Payment successful! Your skin is unlocked.", "success");
      if (themeId) {
        setMarketplaceThemes(prev => prev.map(t => 
          t.id === themeId ? { ...t, isPurchased: true, canCustomize: true } : t
        ));
      }
      window.history.replaceState({}, document.title, "/");
    }
    if (params.get('canceled')) {
      showNotification("Payment canceled.", "info");
      window.history.replaceState({}, document.title, "/");
    }

    return () => unsubscribe();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!isAuthReady) return;

    // Listen to Marketplace Themes
    const themesQuery = query(collection(db, "themes"));
    const unsubscribeThemes = onSnapshot(themesQuery, (snapshot) => {
      const firestoreThemes = snapshot.docs.map(doc => doc.data() as ThemeConfig);
      // Merge default themes with firestore themes (firestore overrides defaults if IDs match)
      const merged = [...DEFAULT_THEMES];
      firestoreThemes.forEach(ft => {
        const index = merged.findIndex(t => t.id === ft.id);
        if (index !== -1) merged[index] = ft;
        else merged.push(ft);
      });
      setMarketplaceThemes(merged);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "themes"));

    // Listen to User Purchases
    let unsubscribePurchases = () => {};
    if (user) {
      const purchasesPath = `users/${user.uid}/purchases`;
      unsubscribePurchases = onSnapshot(collection(db, purchasesPath), (snapshot) => {
        const purchases: Record<string, { canCustomize: boolean; musicUnlocked: boolean }> = {};
        snapshot.docs.forEach(doc => {
          purchases[doc.id] = doc.data() as { canCustomize: boolean; musicUnlocked: boolean };
        });
        setUserPurchases(purchases);
      }, (error) => handleFirestoreError(error, OperationType.LIST, purchasesPath));
    } else {
      setUserPurchases({});
    }

    return () => {
      unsubscribeThemes();
      unsubscribePurchases();
    };
  }, [user, isAuthReady]);

  // Apply purchase status to active theme and marketplace themes
  useEffect(() => {
    const applyStatus = (theme: ThemeConfig): ThemeConfig => {
      const purchase = userPurchases[theme.id];
      // Authors always have full access
      const isAuthor = user && theme.authorId === user.uid;
      
      return {
        ...theme,
        isPurchased: !!purchase || isAuthor || theme.price === 0 || theme.isPurchased,
        canCustomize: (purchase?.canCustomize) || isAuthor || theme.canCustomize,
        musicWidget: {
          ...(theme.musicWidget || { provider: "none", isVisible: false, isUnlocked: false }),
          isUnlocked: (purchase?.musicUnlocked) || isAuthor || theme.musicWidget?.isUnlocked
        }
      };
    };

    setMarketplaceThemes(prev => prev.map(applyStatus));
    setActiveTheme(prev => applyStatus(prev));
  }, [userPurchases, user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      showNotification("Login failed. Please try again.", "info");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    showNotification("Logged out successfully", "info");
  };

  const generateThemeCSS = (theme: ThemeConfig) => {
    return `
/* SkinCraft Theme: ${theme.name} */
/* NOTE: This skin is optimized for Desktop versions of ChatGPT/Gemini */

:root {
  --skincraft-bg: ${theme.colors.bgPrimary};
  --skincraft-surface: ${theme.colors.bgSecondary};
  --skincraft-text: ${theme.colors.textPrimary};
  --skincraft-accent: ${theme.colors.accent};
  --skincraft-radius: ${theme.borderRadius};
  --skincraft-wallpaper: ${theme.colors.backgroundImage ? `url('${theme.colors.backgroundImage}')` : 'none'};
  --skincraft-wallpaper-opacity: ${theme.colors.backgroundOpacity ?? 0.5};
  --skincraft-wallpaper-size: ${theme.colors.backgroundSize || 'cover'};
  --skincraft-wallpaper-position: ${theme.colors.backgroundPosition || 'center'};
}

/* ChatGPT Desktop Overrides */
@media (min-width: 768px) {
  .dark .bg-gray-800, 
  .dark .bg-token-main-surface-primary,
  .dark main { 
    background-color: var(--skincraft-bg) !important; 
    background-image: var(--skincraft-wallpaper) !important;
    background-size: var(--skincraft-wallpaper-size) !important;
    background-position: var(--skincraft-wallpaper-position) !important;
    position: relative !important;
  }
  
  .dark .bg-gray-800::before,
  .dark .bg-token-main-surface-primary::before,
  .dark main::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--skincraft-bg);
    opacity: calc(1 - var(--skincraft-wallpaper-opacity));
    z-index: 0;
    pointer-events: none;
  }

  .dark .text-gray-100,
  .dark .text-token-text-primary { 
    color: var(--skincraft-text) !important; 
    position: relative; 
    z-index: 1; 
  }
}
    `;
  };

  const handleExport = () => {
    const css = generateThemeCSS(activeTheme);
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, "-")}.css`;
    a.click();
    showNotification("CSS Theme exported successfully!");
  };

  const pushLiveTheme = async () => {
    if (!user) return;
    setIsPushingLive(true);
    try {
      const css = generateThemeCSS(activeTheme);
      const response = await fetch(`/api/theme/live/${user.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ css })
      });
      if (!response.ok) throw new Error("Failed to push live theme");
    } catch (error) {
      console.error("Error pushing live theme:", error);
    } finally {
      setIsPushingLive(false);
    }
  };

  // Auto-push live theme when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) pushLiveTheme();
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTheme, user]);

  const handlePublish = async () => {
    if (!user) {
      showNotification("Please login to publish themes", "info");
      return;
    }

    const themeId = Math.random().toString(36).substr(2, 9);
    const newTheme: ThemeConfig = { 
      ...activeTheme, 
      id: themeId,
      author: user.displayName || "Anonymous",
      authorId: user.uid,
      isPurchased: true,
      canCustomize: true 
    };

    try {
      await setDoc(doc(db, "themes", themeId), newTheme);
      showNotification("Theme published to marketplace!");
      setView("marketplace");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `themes/${themeId}`);
    }
  };

  const handleBuy = async (theme: ThemeConfig, customize: boolean) => {
    if (!user) {
      showNotification("Please login to purchase themes", "info");
      return;
    }

    const isUpgrade = theme.isPurchased && customize && !theme.canCustomize;
    const price = isUpgrade ? 1.5 : (customize ? (theme.price || 0) + 1.5 : (theme.price || 0));
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: theme.id,
          themeName: isUpgrade ? `${theme.name} (Edit Access Upgrade)` : theme.name,
          price: price,
          userId: user.uid
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      showNotification(error.message, "info");
    }
  };

  const handleBuyMusic = async (theme: ThemeConfig) => {
    if (!user) {
      showNotification("Please login to purchase add-ons", "info");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: theme.id,
          themeName: `${theme.name} (Music Add-on)`,
          price: 3.00,
          userId: user.uid
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error: any) {
      showNotification("Failed to initiate purchase.", "info");
    }
  };

  const handleDeleteTheme = async (id: string) => {
    const theme = marketplaceThemes.find(t => t.id === id);
    if (!theme) return;

    if (!user || (theme.authorId !== user.uid)) {
      showNotification("You don't have permission to delete this theme", "info");
      return;
    }

    try {
      await deleteDoc(doc(db, "themes", id));
      showNotification("Theme removed from marketplace", "info");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `themes/${id}`);
    }
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
          <FontAwesomeIcon icon={faPalette} className="text-white text-xl" />
        </div>
        
        <div className="flex flex-col gap-4 flex-1">
          <button 
            onClick={() => setView("editor")}
            className={`p-4 rounded-2xl transition-all ${view === "editor" ? "bg-zinc-900 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
            title="Theme Editor"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xl" />
          </button>
          <button 
            onClick={() => setView("marketplace")}
            className={`p-4 rounded-2xl transition-all ${view === "marketplace" ? "bg-zinc-900 text-blue-500" : "text-zinc-500 hover:text-zinc-300"}`}
            title="Theme Marketplace"
          >
            <FontAwesomeIcon icon={faStore} className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {user ? (
            <button 
              onClick={handleLogout}
              className="p-4 text-zinc-500 hover:text-red-500 transition-all"
              title={`Logout (${user.displayName})`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="p-4 text-zinc-500 hover:text-blue-500 transition-all"
              title="Login with Google"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="text-xl" />
            </button>
          )}
          <a href="#" className="p-4 text-zinc-500 hover:text-zinc-300 transition-all">
            <FontAwesomeIcon icon={faGithub} className="text-xl" />
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
                  onUnlock={() => handleBuy(activeTheme, true)}
                  onUnlockMusic={() => handleBuyMusic(activeTheme)}
                  activeSection={activeSection}
                  user={user}
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
                    onWidgetPositionChange={(pos) => {
                      setActiveTheme({
                        ...activeTheme,
                        musicWidget: {
                          ...(activeTheme.musicWidget || { provider: "none", isVisible: false, isUnlocked: false }),
                          position: pos
                        }
                      });
                    }}
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
                onBuyMusic={handleBuyMusic}
                onDelete={handleDeleteTheme}
                onExport={handleExport}
                user={user}
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
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="font-medium">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-4 text-zinc-500 hover:text-white">
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
