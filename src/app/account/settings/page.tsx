
'use client';

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, updateUserPassword, updateUserProfileImage } from '@/lib/firebase/actions';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters.')
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
});


type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateUser: updateAuthContextUser } = useAuth();
  const { toast } = useToast();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsProfileSubmitting(true);
    try {
      await updateUserProfile(user.uid, data);
      updateAuthContextUser(data);
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;
    setIsPasswordSubmitting(true);
    try {
        await updateUserPassword(data.currentPassword, data.newPassword);
        toast({
            title: 'Password Changed',
            description: 'Your password has been updated successfully.',
        });
        passwordForm.reset();
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Change Failed',
            description: error.message,
        });
    } finally {
        setIsPasswordSubmitting(false);
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const newProfile = await updateUserProfileImage(user.uid, formData);

        updateAuthContextUser({ profileImage: newProfile.profileImage });
        toast({
            title: 'Photo Updated',
            description: 'Your new profile picture has been saved.',
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: error.message || 'Could not upload your photo. Please try again.',
        });
    } finally {
        setIsUploadingPhoto(false);
        if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and profile settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={user.profileImage} alt={user.name} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button type="button" size="icon" className="absolute bottom-0 right-0 rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isUploadingPhoto}>
                        {isUploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin"/> : <Camera className="h-4 w-4"/>}
                        <span className="sr-only">Change photo</span>
                    </Button>
                    <input type="file" ref={fileInputRef} className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoChange}/>
                </div>
                 <div className="text-sm text-muted-foreground">
                    <p>Click the camera to change your profile picture.</p>
                    <p>Recommended: Square image, under 2MB.</p>
                </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...profileForm.register('name')} />
                    {profileForm.formState.errors.name && <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user.email || ''} disabled />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="e.g., +2348012345678" {...profileForm.register('phone')} />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isProfileSubmitting}>
                    {isProfileSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password. Make sure it is a strong one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} />
                     {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
                    {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
                    {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
            </div>
             <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordSubmitting || user.provider !== 'email/password'}>
                    {isPasswordSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Change Password
                </Button>
            </div>
             {user.provider !== 'email/password' && (
                <p className="text-sm text-muted-foreground text-right">Password can't be changed for accounts created via social login.</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
