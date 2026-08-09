import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';

export const VerifyEmailPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, resendVerification } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendVerification();
      toastSuccess('Email Sent!', 'A new verification link has been dispatched to your inbox.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Resend failed';
      toastError('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
        <MailCheck className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Verify Your Email</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          We've sent a verification link to{' '}
          <span className="font-semibold text-slate-200">{currentUser?.email || 'your email address'}</span>. Please click the link to confirm your account.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="outline"
          className="w-full justify-center"
          isLoading={isLoading}
          onClick={handleResend}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Resend Verification Email
        </Button>

        <Link to="/dashboard">
          <Button variant="primary" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
