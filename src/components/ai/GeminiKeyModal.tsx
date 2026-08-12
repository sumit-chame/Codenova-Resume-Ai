import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Key, Sparkles, Check, Trash2, ExternalLink } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../../services/aiService';
import { useToast } from '../../hooks/useToast';

export interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [testing, setTesting] = useState(false);
  const { toastSuccess, toastError } = useToast();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setGeminiApiKey('');
      toastSuccess('Cleared API Key', 'Using local heuristic AI engine.');
      if (onKeyUpdated) onKeyUpdated();
      onClose();
      return;
    }

    setTesting(true);
    try {
      // Test the API Key against Google Gemini API
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello Gemini API test' }] }],
          }),
        }
      );

      if (res.ok) {
        setGeminiApiKey(apiKey);
        toastSuccess('Gemini API Connected!', 'Live Google Gemini 1.5 Flash API is now active.');
        if (onKeyUpdated) onKeyUpdated();
        onClose();
      } else {
        const errorData = await res.json();
        const msg = errorData?.error?.message || `API returned status ${res.status}`;
        toastError('Invalid API Key', msg);
      }
    } catch (err: any) {
      toastError('Connection Error', err.message || 'Could not verify Gemini API Key');
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setGeminiApiKey('');
    setApiKey('');
    toastSuccess('API Key Cleared', 'Switched to local AI engine.');
    if (onKeyUpdated) onKeyUpdated();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Gemini API Key Settings"
      description="Connect your free Google Gemini API key to enable live AI resume generation, job fit analysis, and cover letter writing."
    >
      <div className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-bold text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Get a Free API Key from Google AI Studio
            </span>
            <Badge variant={getGeminiApiKey() ? 'success' : 'outline'}>
              {getGeminiApiKey() ? 'Live Key Active' : 'Heuristic Fallback'}
            </Badge>
          </div>
          <p className="text-[11px] leading-relaxed">
            Google provides a free Gemini 1.5 Flash API key with generous usage limits.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            <span>Get your free key at aistudio.google.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            Gemini API Key (AIzaSy...)
          </label>
          <Input
            type="password"
            placeholder="Paste your Gemini API Key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {getGeminiApiKey() ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            >
              Clear Key
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={testing}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              {testing ? 'Testing Key...' : 'Save & Connect'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
