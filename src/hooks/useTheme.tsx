import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentPreset = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet' | 'slate';
export type UiDensity = 'comfortable' | 'compact';
export type FontPairing = 'Inter' | 'Plus Jakarta Sans' | 'Roboto' | 'Outfit';

interface ThemeContextType {
  theme: 'dark' | 'light';
  accentColor: string;
  accentPreset: AccentPreset;
  density: UiDensity;
  fontPairing: FontPairing;
  isStudioOpen: boolean;
  toggleTheme: () => void;
  setAccentPreset: (preset: AccentPreset) => void;
  setCustomAccentColor: (hex: string) => void;
  setDensity: (d: UiDensity) => void;
  setFontPairing: (f: FontPairing) => void;
  openStudio: () => void;
  closeStudio: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'resumeforge_theme_preference';
const ACCENT_KEY = 'resumeforge_accent_preference';
const DENSITY_KEY = 'resumeforge_density_preference';
const FONT_KEY = 'resumeforge_font_preference';

const ACCENT_MAP: Record<AccentPreset, string> = {
  indigo: '#6366f1',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  violet: '#8b5cf6',
  slate: '#64748b',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [accentPreset, setAccentPresetState] = useState<AccentPreset>(() => {
    const saved = localStorage.getItem(ACCENT_KEY) as AccentPreset;
    return saved && ACCENT_MAP[saved] ? saved : 'indigo';
  });

  const [customAccent, setCustomAccent] = useState<string | null>(null);

  const [density, setDensityState] = useState<UiDensity>(() => {
    const saved = localStorage.getItem(DENSITY_KEY) as UiDensity;
    return saved === 'compact' ? 'compact' : 'comfortable';
  });

  const [fontPairing, setFontPairingState] = useState<FontPairing>(() => {
    const saved = localStorage.getItem(FONT_KEY) as FontPairing;
    return saved || 'Inter';
  });

  const [isStudioOpen, setIsStudioOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Keyboard shortcut listener for Cmd+J / Ctrl+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsStudioOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setAccentPreset = (preset: AccentPreset) => {
    setAccentPresetState(preset);
    setCustomAccent(null);
    localStorage.setItem(ACCENT_KEY, preset);
  };

  const setCustomAccentColor = (hex: string) => {
    setCustomAccent(hex);
  };

  const setDensity = (d: UiDensity) => {
    setDensityState(d);
    localStorage.setItem(DENSITY_KEY, d);
  };

  const setFontPairing = (f: FontPairing) => {
    setFontPairingState(f);
    localStorage.setItem(FONT_KEY, f);
  };

  const activeAccentColor = customAccent || ACCENT_MAP[accentPreset];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor: activeAccentColor,
        accentPreset,
        density,
        fontPairing,
        isStudioOpen,
        toggleTheme,
        setAccentPreset,
        setCustomAccentColor,
        setDensity,
        setFontPairing,
        openStudio: () => setIsStudioOpen(true),
        closeStudio: () => setIsStudioOpen(false),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
