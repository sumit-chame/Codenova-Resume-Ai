import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Save, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../hooks/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, userProfile, updateProfileData, logout, resendVerification } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || currentUser?.displayName || '',
      jobTitle: userProfile?.jobTitle || '',
      location: userProfile?.location || '',
      bio: userProfile?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfileData(data);
      toastSuccess('Profile Updated', 'Your profile details have been saved successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toastError('Update Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerify = async () => {
    try {
      await resendVerification();
      toastSuccess('Verification Sent', 'Please check your email inbox.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Resend failed';
      toastError('Error', msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400">Manage your personal details and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Account Badge */}
        <div className="md:col-span-4 space-y-6">
          <Card className="text-center p-6 space-y-4">
            <div className="flex justify-center pt-2">
              <Avatar
                src={currentUser?.photoURL}
                name={userProfile?.displayName || currentUser?.displayName || currentUser?.email}
                size="xl"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {userProfile?.displayName || currentUser?.displayName || 'User'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
              {currentUser?.emailVerified ? (
                <Badge variant="success" size="md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Email
                </Badge>
              ) : (
                <Badge variant="warning" size="md">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Unverified Email
                </Badge>
              )}
            </div>

            {!currentUser?.emailVerified && (
              <Button variant="outline" size="sm" onClick={handleResendVerify} className="w-full text-xs">
                Resend Verification Link
              </Button>
            )}
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-8">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Update your display name, title, and target job preferences.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input
                  label="Display Name"
                  placeholder="John Doe"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.displayName?.message}
                  {...register('displayName')}
                />

                <Input
                  label="Email Address"
                  value={currentUser?.email || ''}
                  disabled
                  leftIcon={<Mail className="w-4 h-4" />}
                  helperText="Email address is managed by Firebase Authentication"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Target Job Title"
                    placeholder="e.g. Senior Software Engineer"
                    {...register('jobTitle')}
                  />
                  <Input
                    label="Location"
                    placeholder="e.g. San Francisco, CA"
                    {...register('location')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                    Professional Bio
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Brief overview of your career background..."
                    className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    {...register('bio')}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="ghost" size="sm" type="button" onClick={() => logout()} leftIcon={<LogOut className="w-4 h-4 text-rose-400" />}>
                  Sign Out
                </Button>
                <Button variant="primary" size="md" type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
