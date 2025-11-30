import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute'
import { selectAuthToken } from './states/authSlice'

// Component to redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const accessToken = useSelector(selectAuthToken);
  const location = useLocation();
  const token = accessToken || localStorage.getItem('accessToken');
  
  if (token) {
    // If user is already logged in, redirect to messages
    const from = location.state?.from?.pathname || '/messages';
    return <Navigate to={from} replace />;
  }
  
  return children;
};

function App() {
  const accessToken = useSelector(selectAuthToken);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes with Layout - Only accessible when NOT logged in */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/register" element={<RegisterCover />} />
          <Route path="/login" element={<LoginCover />} />
        </Route>
        
        {/* Dashboard Routes with Layout - Protected, requires authentication */}
        <Route path='/' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/messages" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:friendId" element={<MessagesPage />} />
          <Route path="notifications" element={<div>Notifications Page - Coming Soon!</div>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 - Catch all - Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
