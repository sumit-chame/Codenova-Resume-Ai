import React from 'react';
import { QrCode, Copy, Share2, Download, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';

export interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioUrl: string;
  userName: string;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  onClose,
  portfolioUrl,
  userName,
}) => {
  const { toastSuccess } = useToast();

  // Generate SVG QR code representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    portfolioUrl
  )}&color=0f172a&bgcolor=ffffff`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toastSuccess('Link Copied!', 'Portfolio link copied to clipboard.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Career Fair QR Share"
      description="Let recruiters scan your digital resume & web portfolio instantly."
    >
      <div className="space-y-6 text-center pt-2">
        {/* QR Code Container */}
        <div className="p-6 rounded-3xl bg-white text-slate-950 inline-block shadow-2xl border-4 border-indigo-500/30">
          <img
            src={qrSvgUrl}
            alt="Career Fair Portfolio QR Code"
            className="w-48 h-48 mx-auto rounded-xl"
          />
          <p className="text-xs font-bold text-slate-800 mt-3">{userName}'s Live Portfolio</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all">
            {portfolioUrl}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" className="flex-1 justify-center" onClick={handleCopy} leftIcon={<Copy className="w-4 h-4" />}>
            Copy Portfolio Link
          </Button>
          <Button variant="outline" className="flex-1 justify-center" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
