import React from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { useUserProfile } from '@/hooks/useUserProfile';
import { selectFullProfilePictureUrl } from '@/states/userSlice';
import { useSelector } from 'react-redux';
import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

const Navbar = () => {
    const { toggle } = useSidebar();

    return (
        <header className="top-0 right-0 left-0 bg-white border-b border-gray-200 shadow-sm h-16">
            <div className="flex items-center justify-between px-4 h-full">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    {/* Hamburger menu */}
                    <Button
                        onClick={toggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </Button>

                </div>
            </div>
        </header>
    );
};

export default Navbar;