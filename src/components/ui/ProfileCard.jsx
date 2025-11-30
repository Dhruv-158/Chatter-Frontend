import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useProfilePicture, useProfileUpdate, useFriendsList } from '@/hooks';
import { selectFullProfilePictureUrl } from '@/states/userSlice';
import { Camera, Edit2, LogOut, Mail, User, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileCard = () => {
    const navigate = useNavigate();
    const { profile } = useUserProfile();
    const profilePicture = useSelector(selectFullProfilePictureUrl);
    const { uploadPicture, isUploading } = useProfilePicture();
    const { friendsCount, isLoading: isLoadingFriends } = useFriendsList({ fetchOnMount: true });
    
    const { 
        formData, 
        updateField, 
        updateProfile,
        isUpdating 
    } = useProfileUpdate({
        bio: profile?.bio || '',
    });

    const [isEditingBio, setIsEditingBio] = useState(false);

    // Handle profile picture upload
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const result = await uploadPicture(file);
            if (result.success) {
                console.log('Profile picture updated successfully');
            }
        }
    };

    // Handle bio update
    const handleBioSave = async () => {
        const result = await updateProfile({ bio: formData.bio });
        if (result.success) {
            setIsEditingBio(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className="w-full h-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Main Glass Card */}
            <div className="relative h-full bg-card/30 dark:bg-card/20 backdrop-blur-xl border-x border-white/20 dark:border-white/10 md:border-y md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-primary/20 via-accent/10 to-background opacity-50 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 h-full overflow-y-auto no-scrollbar">
                    {/* Header / Cover Area */}
                    <div className="h-48 relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>

                    <div className="px-8 pb-8">
                        {/* Profile Header Section */}
                        <div className="flex flex-col md:flex-row gap-6 items-start -mt-20">
                            
                            {/* Profile Picture Container */}
                            <div className="relative group mx-auto md:mx-0">
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary via-white to-accent rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative w-40 h-40 rounded-full p-1 bg-background shadow-2xl">
                                    <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
                                        <img
                                            src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'User')}&background=random`}
                                            alt={profile?.username}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        
                                        {/* Upload Overlay */}
                                        <label 
                                            htmlFor="profile-upload"
                                            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                                        >
                                            <Camera className="w-8 h-8 text-white mb-1" />
                                            <span className="text-xs font-medium text-white">Change Photo</span>
                                        </label>
                                        
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </div>
                                        )}
                                        
                                        <input 
                                            id="profile-upload" 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden" 
                                            onChange={handleProfilePictureChange}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                                
                                {/* Online Status Indicator */}
                                <div className="absolute bottom-3 right-3 w-6 h-6 bg-emerald-500 border-4 border-background rounded-full shadow-lg" title="Online"></div>
                            </div>

                            {/* User Info & Stats */}
                            <div className="flex-1 pt-20 md:pt-24 text-center md:text-left space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                                            {profile?.username || 'User'}
                                        </h1>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{profile?.email || 'No email provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center justify-center md:justify-start gap-8 mt-6 py-4 border-y border-border/50">
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-0.5">
                                            <Users className="w-4 h-4" />
                                            Friends
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {isLoadingFriends ? <Skeleton className="h-8 w-8 inline-block" /> : friendsCount}
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-border/50" />
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-0.5">
                                            <User className="w-4 h-4" />
                                            Status
                                        </div>
                                        <div className="text-2xl font-bold text-emerald-500">
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    About Me
                                </h3>
                                {!isEditingBio && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setIsEditingBio(true)}
                                        className="text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Bio
                                    </Button>
                                )}
                            </div>

                            <div className={`
                                relative rounded-2xl transition-all duration-300 overflow-hidden
                                ${isEditingBio ? 'ring-2 ring-primary bg-background' : 'bg-muted/30 hover:bg-muted/50'}
                            `}>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => updateField('bio', e.target.value)}
                                    disabled={!isEditingBio}
                                    placeholder="Write something about yourself..."
                                    className={`
                                        w-full p-6 bg-transparent border-none focus:ring-0 resize-none text-base leading-relaxed
                                        ${!isEditingBio ? 'cursor-default text-muted-foreground' : 'text-foreground min-h-[150px]'}
                                    `}
                                    rows={isEditingBio ? 5 : 3}
                                />
                                
                                {isEditingBio && (
                                    <div className="flex items-center justify-end gap-3 p-4 bg-muted/20 border-t border-border/50">
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                setIsEditingBio(false);
                                                updateField('bio', profile?.bio || '');
                                            }}
                                            className="hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleBioSave}
                                            disabled={isUpdating}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                                        >
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-10 pt-6 border-t border-border/50 flex justify-end gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate('/settings')}
                                className="rounded-full px-6 hover:bg-muted transition-all"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleLogout}
                                className="rounded-full px-6 shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;