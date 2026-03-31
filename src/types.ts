export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  userBubble: string;
  aiBubble: string;
  border: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  backgroundPosition?: string;
  backgroundSize?: string;
}

export type MusicProvider = "spotify" | "pandora" | "youtube" | "none";

export interface MusicWidgetConfig {
  provider: MusicProvider;
  playlistId?: string;
  isVisible: boolean;
  isUnlocked?: boolean;
  position?: { x: number; y: number };
}

export interface ThemeConfig {
  id: string;
  name: string;
  author: string;
  authorId?: string;
  price?: number;
  colors: ThemeColors;
  fontFamily: string;
  borderRadius: string;
  isPurchased?: boolean;
  canCustomize?: boolean;
  musicWidget?: MusicWidgetConfig;
}
