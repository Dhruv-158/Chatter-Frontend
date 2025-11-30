import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUserProfile } from '@/hooks';
import { selectFullProfilePictureUrl } from '@/states/userSlice';
import { 
    Bell, 
    Moon, 
    Sun, 
    Shield, 
    Key, 
    Smartphone, 
    Volume2, 
    Eye,
    ChevronRight,
    LogOut,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
    requestNotificationPermission, 
    getNotificationPermission 
} from '@/utils/notifications';

const SettingsPage = () => {
    const { profile } = useUserProfile();
    const profilePicture = useSelector(selectFullProfilePictureUrl);
    
    // Initialize state from localStorage or defaults
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('soundEnabled') !== 'false';
    });

    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        return getNotificationPermission() === 'granted';
    });

    // Effect to handle Theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Effect to handle Sound changes
    useEffect(() => {
        localStorage.setItem('soundEnabled', soundEnabled);
    }, [soundEnabled]);

    // Handle Notification Toggle
    const handleNotificationToggle = async (checked) => {
        if (checked) {
            const granted = await requestNotificationPermission();
            setNotificationsEnabled(granted);
        } else {
            // We can't revoke permission programmatically, but we can update our local state preference
            setNotificationsEnabled(false);
            // In a real app, you'd save this preference to the backend to stop sending push notifications
        }
    };

    const SettingSection = ({ title, children }) => (
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 px-2">{title}</h2>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
                {children}
            </div>
        </div>
    );

    const SettingItem = ({ icon: Icon, title, description, action, isLast, isStatic }) => (
        <div className={`p-4 flex items-center justify-between hover:bg-accent/5 transition-colors ${!isLast ? 'border-b border-border/50' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{title}</h3>
                        {isStatic && (
                            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                Coming Soon
                            </span>
                        )}
                    </div>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
            <div>{action}</div>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <img 
                        src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'User')}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{profile?.username}</h1>
                    <p className="text-muted-foreground">{profile?.email}</p>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-xl mb-8 flex items-start gap-3 text-sm">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                    Some settings below are currently placeholders. "Dark Mode" and "Notification Sounds" are fully functional and saved to your local device.
                </p>
            </div>

            <SettingSection title="Appearance & Sounds">
                <SettingItem 
                    icon={isDarkMode ? Moon : Sun}
                    title="Dark Mode"
                    description="Adjust the appearance of the app"
                    action={
                        <Switch 
                            checked={isDarkMode} 
                            onCheckedChange={setIsDarkMode} 
                        />
                    }
                />
                <SettingItem 
                    icon={Volume2}
                    title="Notification Sounds"
                    description="Play sounds for new messages"
                    action={
                        <Switch 
                            checked={soundEnabled} 
                            onCheckedChange={setSoundEnabled} 
                        />
                    }
                />
            </SettingSection>

            <SettingSection title="Privacy & Security">
                <SettingItem 
                    icon={Eye}
                    title="Last Seen"
                    description="Manage who can see your last seen status"
                    action={
                        <Button variant="ghost" size="sm" disabled>
                            Everyone <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    }
                    isStatic
                />
                <SettingItem 
                    icon={Key}
                    title="Change Password"
                    description="Update your account password"
                    action={
                        <Button variant="ghost" size="sm" disabled>
                            Update <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    }
                    isStatic
                />
                <SettingItem 
                    icon={Shield}
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    action={
                        <Switch disabled />
                    }
                    isLast
                    isStatic
                />
            </SettingSection>

            <SettingSection title="Notifications">
                <SettingItem 
                    icon={Bell}
                    title="Push Notifications"
                    description="Receive notifications on your device"
                    action={
                        <Switch 
                            checked={notificationsEnabled} 
                            onCheckedChange={handleNotificationToggle} 
                        />
                    }
                />
                <SettingItem 
                    icon={Smartphone}
                    title="Email Notifications"
                    description="Receive digest emails"
                    action={
                        <Switch disabled />
                    }
                    isLast
                    isStatic
                />
            </SettingSection>

            <div className="flex justify-center mt-8 mb-8">
                <p className="text-xs text-muted-foreground">
                    Chattr v1.0.0 • Built with ❤️
                </p>
            </div>
        </div>
    );
};

export default SettingsPage;
