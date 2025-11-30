import * as React from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserProfile } from '@/hooks/useUserProfile'
import { selectFullProfilePictureUrl } from '@/states/userSlice'
import { sidebarItems } from '@/utils/sidebarItems'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDarkMode, useSidebar } from '@/hooks'

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { profile } = useUserProfile()
  const profilePicture = useSelector(selectFullProfilePictureUrl)
  const { isDark, toggleDarkMode } = useDarkMode()
  const { toggle: toggleSidebarOpen } = useSidebar()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <Sidebar className="border-r border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-6">
            <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-110">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 relative z-10 border border-white/20 group-hover:rotate-3 transition-transform duration-300">
                <svg className="w-7 h-7 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.59 3.38 17.1L2.12 21.08C2.02 21.4 2.31 21.7 2.64 21.61L6.79 20.52C8.34 21.46 10.12 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.5 10.5H17L11 18.5V12.5H8.5L14.5 4.5V10.5Z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-center mt-2 group-data-[collapsible=icon]:hidden animate-fade-scale">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Chattr</span>
            </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNavigation(item.path)}
                      tooltip={item.label}
                      className={`
                        justify-start px-3 py-6 rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-primary/10 text-primary shadow-sm' 
                          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground'
                        }
                        group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
                      `}
                    >
                      <Icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="font-medium ml-3 group-data-[collapsible=icon]:hidden">{item.label}</span>
                      {isActive && (
                        <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full group-data-[collapsible=icon]:hidden" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm">
        <SidebarMenu className="flex flex-col gap-2">
          {/* Settings */}
          <SidebarMenuItem>
              <SidebarMenuButton
                    onClick={() => handleNavigation('/settings')}
                    tooltip="Settings"
                    className="justify-start px-3 py-2 rounded-xl hover:bg-sidebar-accent text-muted-foreground transition-colors group-data-[collapsible=icon]:justify-center"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="ml-3 group-data-[collapsible=icon]:hidden">Settings</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Dark Mode Toggle */}
          <SidebarMenuItem>
              <SidebarMenuButton
                    onClick={toggleDarkMode}
                    tooltip={isDark ? "Light Mode" : "Dark Mode"}
                    className="justify-start px-3 py-2 rounded-xl hover:bg-sidebar-accent text-muted-foreground transition-colors group-data-[collapsible=icon]:justify-center"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="ml-3 group-data-[collapsible=icon]:hidden">{isDark ? "Light Mode" : "Dark Mode"}</span>
              </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Profile */}
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton
              size="lg"
              onClick={() => handleNavigation('/profile')}
              className="w-full justify-start p-2 rounded-2xl hover:bg-sidebar-accent transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <AvatarImage src={profilePicture} alt={profile?.name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                    {profile?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-foreground">
                  {profile?.username || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  View Profile
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
