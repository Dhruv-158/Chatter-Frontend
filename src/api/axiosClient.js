import axios from "axios";
import store from "../store/store";
import { setLoading } from "../states/loadingSlice";
import { logoutUser } from "../states/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Counter to track ongoing requests
let ongoingRequests = 0;

// Cache for storing cancel tokens with timestamps
const cancelTokens = new Map();
const DUPLICATE_REQUEST_THRESHOLD = 500; // ms - consider requests within 500ms as duplicates

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosClient.interceptors.request.use(
    (config) => {
        // Create a unique key for this request
        const requestKey = `${config.method}-${config.url}`;
        const now = Date.now();
        
        // Check if there's a recent identical request
        // if (cancelTokens.has(requestKey)) {
        //     const { source, timestamp } = cancelTokens.get(requestKey);
            
        //     // Only cancel if the previous request was made very recently (within threshold)
        //     if (now - timestamp < DUPLICATE_REQUEST_THRESHOLD) {
        //         source.cancel('Duplicate request cancelled');
        //     }
        // }
        
        // Create new cancel token for this request
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        cancelTokens.set(requestKey, { source, timestamp: now });
        
        // Increment request counter
        ongoingRequests += 1;
        
        // Start global loading if this is the first request
        if (ongoingRequests === 1) {
            store.dispatch(setLoading(true));
        }
        
        // Add authentication token from Redux store or localStorage
        const state = store.getState();
        let token = state.auth?.token;
        
        // Fallback to localStorage if token not in Redux (e.g., after page refresh)
        if (!token) {
            token = localStorage.getItem('accessToken');
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development mode
        if (import.meta.env.DEV) {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
            if (token) {
                console.log(`🔑 Token: ${token.substring(0, 20)}...`);
            } else {
                console.log('⚠️ No token found in Redux or localStorage');
                
                // Check if we have refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    console.log('🔄 Refresh token available, but no access token');
                }
            }
        }
        
        return config;
    },
    (error) => {
        ongoingRequests -= 1;
        if (ongoingRequests === 0) {
            store.dispatch(setLoading(false));
        }
        
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosClient.interceptors.response.use(
    (response) => {
        // Remove cancel token from cache
        const requestKey = `${response.config.method}-${response.config.url}`;
        cancelTokens.delete(requestKey);
        
        // Decrement request counter
        ongoingRequests -= 1;
        
        // Stop global loading if all requests complete
        if (ongoingRequests === 0) {
            store.dispatch(setLoading(false));
        }
        
        // Log response in development mode
        if (import.meta.env.DEV) {
            console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        
        return response;
    },
    async (error) => {
        // Handle cancelled requests
        if (axios.isCancel(error)) {
            console.log('Request cancelled:', error.message);
            return Promise.reject(error);
        }
        
        // Remove cancel token from cache
        const requestKey = error.config ? `${error.config.method}-${error.config.url}` : null;
        if (requestKey) {
            cancelTokens.delete(requestKey);
        }
        
        // Decrement request counter
        ongoingRequests -= 1;
        
        // Stop global loading if all requests complete
        if (ongoingRequests === 0) {
            store.dispatch(setLoading(false));
        }
        
        // ============================================
        // ERROR HANDLING
        // ============================================
        
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    console.error('Bad Request:', data.message || 'Invalid request');
                    break;
                    
                case 401:
                    // Unauthorized - Token expired or invalid
                    console.error('🚨 401 Unauthorized - Token expired or invalid');
                    console.log('Request URL:', error.config?.url);
                    console.log('Request method:', error.config?.method);
                    
                    // Check if we have refresh token
                    const hasRefreshToken = localStorage.getItem('refreshToken');
                    console.log('📝 Refresh token available:', hasRefreshToken ? 'Yes' : 'No');
                    
                    // Don't retry refresh token requests
                    if (error.config.url.includes('auth/refresh')) {
                        console.error('❌ Refresh token also expired. Logging out...');
                        store.dispatch(logoutUser());
                        return Promise.reject(error);
                    }
                    
                    // If no refresh token, logout immediately
                    if (!hasRefreshToken) {
                        console.error('❌ No refresh token available. Logging out...');
                        store.dispatch(logoutUser());
                        return Promise.reject(error);
                    }
                    
                    // If already refreshing, queue this request
                    if (isRefreshing) {
                        console.log('⏳ Queueing request while refreshing token...');
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                        .then(token => {
                            error.config.headers['Authorization'] = 'Bearer ' + token;
                            return axiosClient(error.config);
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        });
                    }
                    
                    // Try to refresh the token
                    console.log('🔄 Starting token refresh process...');
                    error.config._retry = true;
                    isRefreshing = true;
                    
                    return new Promise((resolve, reject) => {
                        // Dynamic import to avoid circular dependency
                        import('../services/authServices.js')
                            .then(({ refreshTokenService }) => refreshTokenService())
                            .then((newToken) => {
                                console.log('✅ Token refreshed successfully');
                                
                                // Update the failed request with new token
                                error.config.headers['Authorization'] = 'Bearer ' + newToken;
                                
                                // Process all queued requests
                                processQueue(null, newToken);
                                
                                // Retry the original request
                                resolve(axiosClient(error.config));
                            })
                            .catch((refreshError) => {
                                console.error('❌ Token refresh failed. Logging out...');
                                processQueue(refreshError, null);
                                store.dispatch(logoutUser());
                                reject(refreshError);
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    });
                    
                case 403:
                    // Forbidden - User doesn't have permission
                    console.error('Forbidden: You don\'t have permission to access this resource');
                    break;
                    
                case 404:
                    console.error('Not Found:', error.config?.url);
                    break;
                    
                case 409:
                    // Conflict - Usually duplicate data
                    console.error('Conflict:', data.message || 'Resource conflict');
                    break;
                    
                case 422:
                    // Validation error
                    console.error('Validation Error:', data.errors || data.message);
                    break;
                    
                case 429:
                    // Too many requests - Rate limiting
                    console.error('Too Many Requests: Please slow down');
                    break;
                    
                case 500:
                    console.error('Server Error: Something went wrong on the server');
                    break;
                    
                case 502:
                    console.error('Bad Gateway: Server is unreachable');
                    break;
                    
                case 503:
                    console.error('Service Unavailable: Server is temporarily down');
                    break;
                    
                default:
                    console.error(`Error ${status}:`, data.message || 'An error occurred');
            }
            
        } else if (error.request) {
            // Request made but no response received
            console.error('Network Error: No response from server');
            
            // Check if it's a timeout
            if (error.code === 'ECONNABORTED') {
                console.error('Request Timeout: Server took too long to respond');
            }
            
        } else {
            // Error in request setup
            console.error('Request Setup Error:', error.message);
        }
        
        // Log full error in development
        if (import.meta.env.DEV) {
            console.error('Full Error:', error);
        }
        
        return Promise.reject(error);
    }
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Cancel all pending requests (useful on route change)
export const cancelAllRequests = (message = 'Operation cancelled by user') => {
    cancelTokens.forEach((source) => {
        source.cancel(message);
    });
    cancelTokens.clear();
    ongoingRequests = 0;
    store.dispatch(setLoading(false));
};

// Reset request counter (useful after errors)
export const resetRequestCounter = () => {
    ongoingRequests = 0;
    store.dispatch(setLoading(false));
};

export default axiosClient;