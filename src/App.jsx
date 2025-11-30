import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AuthLayout from './layouts/authLayout'
import RegisterCover from './pages/RegisterCover'
import LoginCover from './pages/LoginCover'
import DashboardLayout from './layouts/dashboardLayout'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage';
import FriendsPage from './pages/Friends/FriendsPage'
import DiscoverPage from './pages/Discover/DiscoverPage'
import MessagesPage from './pages/MessagesPage';
import { selectAuthToken } from './states/authSlice'

function App() {
  const accessToken = useSelector(selectAuthToken);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes with Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterCover />} />
          <Route path="/login" element={<LoginCover />} />
        </Route>
        
        {/* Dashboard Routes with Layout */}
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<Navigate to="/messages" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:friendId" element={<MessagesPage />} />
          <Route path="notifications" element={<div>Notifications Page - Coming Soon!</div>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 - Catch all */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
