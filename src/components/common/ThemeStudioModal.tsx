import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Sun, Moon, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useTheme, AccentPreset, FontPairing } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export const ThemeStudioModal: React.FC = () => {
  const {
    theme,
    toggleTheme,
    accentPreset,
    setAccentPreset,
    density,
    setDensity,
    fontPairing,
    setFontPairing,
    isStudioOpen,
    closeStudio,
  } = useTheme();

  const presets: { id: AccentPreset; name: string; color: string }[] = [
    { id: 'indigo', name: 'Indigo SaaS', color: '#6366f1' },
    { id: 'emerald', name: 'Emerald Growth', color: '#10b981' },
    { id: 'rose', name: 'Rose Executive', color: '#f43f5e' },
    { id: 'amber', name: 'Amber Gold', color: '#f59e0b' },
    { id: 'cyan', name: 'Cyan Tech', color: '#06b6d4' },
    { id: 'violet', name: 'Violet Creative', color: '#8b5cf6' },
    { id: 'slate', name: 'Slate Mono', color: '#64748b' },
  ];

  const fonts: FontPairing[] = ['Inter', 'Plus Jakarta Sans', 'Roboto', 'Outfit'];

  return (
    <AnimatePresence>
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStudio}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Slide-Over Studio Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md h-full glass-panel border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-100">Website Theme Studio</h3>
                    <p className="text-xs text-slate-400">Custom UI appearance & brand styling</p>
                  </div>
                </div>
                <button
                  onClick={closeStudio}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Color Mode */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
                  </button>
                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                      theme === 'light'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                  </button>
                </div>
              </div>

              {/* Accent Theme Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Accent Color Theme
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setAccentPreset(preset.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                        accentPreset === preset.id
                          ? 'bg-slate-800 border-indigo-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.color }} />
                        <span>{preset.name}</span>
                      </div>
                      {accentPreset === preset.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* UI Density */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  UI Density
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDensity('comfortable')}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      density === 'comfortable'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Comfortable
                  </button>
                  <button
                    onClick={() => setDensity('compact')}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      density === 'compact'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>

              {/* Typography Font */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Site Font Family
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontPairing(f)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        fontPairing === f
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-800 text-center space-y-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">⌘J</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Ctrl+J</kbd> to toggle Theme Studio anytime.
              </span>
              <Button variant="primary" className="w-full justify-center" onClick={closeStudio}>
                Apply Theme Preferences
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
