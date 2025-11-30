import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '@/states/authSlice';

/**
 * ProtectedRoute component that checks if user is authenticated
 * If not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children }) => {
  const accessToken = useSelector(selectAuthToken);
  const location = useLocation();
  
  // Check both Redux state and localStorage for token
  const token = accessToken || localStorage.getItem('accessToken');
  
  if (!token) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
