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

export interface ThemeConfig {
  id: string;
  name: string;
  author: string;
  price?: number;
  colors: ThemeColors;
  fontFamily: string;
  borderRadius: string;
}
