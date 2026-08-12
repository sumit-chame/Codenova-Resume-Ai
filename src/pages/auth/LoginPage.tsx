import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, loginWithGoogle, loginDemo } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toastSuccess('Welcome back!', 'Successfully signed into your account.');
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        loginDemo();
        toastInfo('Switched to Demo Session', 'Domain not authorized in Firebase Console. Logged in via local session.');
        navigate('/dashboard');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Login failed';
      toastError('Authentication Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toastSuccess('Welcome!', 'Signed in via Google account.');
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        loginDemo();
        toastInfo('Switched to Demo Session', 'Domain not authorized in Firebase Console. Logged in via local session.');
        navigate('/dashboard');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed';
      toastError('Sign In Error', msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-400">Sign in to your ResumeForge AI account to continue</p>
      </div>

      {/* Quick Demo Mode Button */}
      <Button
        type="button"
        variant="glass"
        className="w-full justify-center bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30"
        onClick={() => {
          loginDemo();
          toastSuccess('Demo Account Active!', 'Exploration mode enabled.');
          navigate('/dashboard');
        }}
        leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
      >
        ⚡ Instant Quick Demo Login
      </Button>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200"
        isLoading={isGoogleLoading}
        onClick={handleGoogleSignIn}
        leftIcon={
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        }
      >
        Sign in with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-950 px-3 text-[11px] font-semibold uppercase text-slate-500 tracking-wider shrink-0">
          Or with email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1">
            Sign up for free <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
