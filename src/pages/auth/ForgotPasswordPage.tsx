import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toastSuccess('Reset Link Sent', 'Check your inbox for password reset instructions.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset link';
      toastError('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400">
          Enter your registered email address and we'll send you a password reset link.
        </p>
      </div>

      {emailSent ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">Check Your Email</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We have sent password recovery instructions to your email address. Please follow the link in the email.
          </p>
          <Button variant="outline" size="sm" onClick={() => setEmailSent(false)} className="w-full">
            Try another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            isLoading={isLoading}
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
        </Link>
      </div>
    </div>
  );
};
