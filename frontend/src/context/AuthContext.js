import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// JWT Utility Functions
const jwtUtils = {
  // Decode JWT payload without verification (for reading user info)
  decode: (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  },

  // Check if JWT is expired
  isExpired: (token) => {
    try {
      const payload = jwtUtils.decode(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Get time until token expires (in seconds)
  getTimeUntilExpiry: (token) => {
    try {
      const payload = jwtUtils.decode(token);
      if (!payload || !payload.exp) return 0;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch {
      return 0;
    }
  },

  // Extract user info from token
  getUserFromToken: (token) => {
    try {
      const payload = jwtUtils.decode(token);
      if (!payload) return null;
      
      return {
        id: payload.sub || payload.userId,
        email: payload.email,
        name: payload.name,
        roles: payload.roles || [],
        exp: payload.exp,
        iat: payload.iat
      };
    } catch {
      return null;
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token refresh timer
  const [refreshTimer, setRefreshTimer] = useState(null);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Clear all auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
    
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }
  }, [refreshTimer]);

  // Set auth data and schedule refresh
  const setAuthData = useCallback((accessToken, newRefreshToken = null) => {
    try {
      // Validate token
      if (jwtUtils.isExpired(accessToken)) {
        throw new Error('Token is expired');
      }

      // Extract user data from token
      const userData = jwtUtils.getUserFromToken(accessToken);
      if (!userData) {
        throw new Error('Invalid token payload');
      }

      // Store tokens
      localStorage.setItem('authToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }

      setToken(accessToken);
      setUser(userData);
      setError(null);

      // Schedule token refresh (refresh 5 minutes before expiry)
      scheduleTokenRefresh(accessToken);

      console.log('Auth data set successfully:', {
        user: userData.email,
        expiresIn: jwtUtils.getTimeUntilExpiry(accessToken)
      });

    } catch (error) {
      console.error('Error setting auth data:', error);
      clearAuthData();
      throw error;
    }
  }, [clearAuthData]);

  // Schedule automatic token refresh
  const scheduleTokenRefresh = useCallback((currentToken) => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    const timeUntilExpiry = jwtUtils.getTimeUntilExpiry(currentToken);
    // Refresh 5 minutes before expiry (300 seconds)
    const refreshTime = Math.max(0, (timeUntilExpiry - 300) * 1000);

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        console.log('Auto-refreshing token...');
        refreshAuthToken();
      }, refreshTime);
      
      setRefreshTimer(timer);
      console.log(`Token refresh scheduled in ${Math.floor(refreshTime / 1000)} seconds`);
    } else {
      console.log('Token expires too soon, immediate refresh needed');
      refreshAuthToken();
    }
  }, [refreshTimer]);

  // Refresh the access token using refresh token
  const refreshAuthToken = async () => {
    try {
      const storedRefreshToken = refreshToken || localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refreshToken: storedRefreshToken 
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        setAuthData(data.accessToken, data.refreshToken);
        console.log('Token refreshed successfully');
        return true;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      setError('Session expired. Please log in again.');
      clearAuthData();
      return false;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (jwtUtils.isExpired(storedToken)) {
          console.log('Stored token is expired, attempting refresh...');
          
          if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
            const refreshSuccess = await refreshAuthToken();
            if (!refreshSuccess) {
              clearAuthData();
            }
          } else {
            console.log('No refresh token, clearing auth data');
            clearAuthData();
          }
        } else {
          // Token is still valid
          setRefreshToken(storedRefreshToken);
          setAuthData(storedToken);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthData, setAuthData]);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          rememberMe 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.accessToken) {
        throw new Error('No access token received');
      }

      // Set auth data
      setAuthData(data.accessToken, data.refreshToken);

      return { 
        success: true, 
        user: jwtUtils.getUserFromToken(data.accessToken),
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Optionally auto-login after signup
      if (data.accessToken) {
        setAuthData(data.accessToken, data.refreshToken);
      }

      return { 
        success: true, 
        message: data.message || 'Account created successfully'
      };

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const storedRefreshToken = refreshToken || localStorage.getItem('refreshToken');
      
      // Optional: Call logout endpoint to invalidate refresh token
      if (storedRefreshToken) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              refreshToken: storedRefreshToken 
            }),
          });
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with local logout even if API call fails
        }
      }

      clearAuthData();
      console.log('Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if there's an error
      clearAuthData();
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user && !jwtUtils.isExpired(token));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user?.roles || !Array.isArray(roles)) return false;
    return roles.some(role => user.roles.includes(role));
  };

  // Get authenticated headers for API calls
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Make authenticated API call
  const authenticatedFetch = async (url, options = {}) => {
    if (!isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshSuccess = await refreshAuthToken();
      if (refreshSuccess) {
        // Retry the request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        });
      } else {
        throw new Error('Authentication failed');
      }
    }

    return response;
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get token expiry info
  const getTokenInfo = () => {
    if (!token) return null;
    
    return {
      isExpired: jwtUtils.isExpired(token),
      expiresIn: jwtUtils.getTimeUntilExpiry(token),
      payload: jwtUtils.decode(token)
    };
  };

  const value = {
    // State
    user,
    token,
    loading,
    error,
    
    // Actions
    login,
    signup,
    logout,
    refreshAuthToken,
    updateProfile,
    
    // Helpers
    isAuthenticated,
    hasRole,
    hasAnyRole,
    getAuthHeaders,
    authenticatedFetch,
    getTokenInfo,
    
    // Utils
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for making authenticated API calls
export const useAuthenticatedFetch = () => {
  const { authenticatedFetch } = useAuth();
  return authenticatedFetch;
};

// Example usage component
export const AuthDebugPanel = () => {
  const { 
    user, 
    token, 
    loading, 
    error, 
    isAuthenticated, 
    getTokenInfo,
    refreshAuthToken 
  } = useAuth();

  if (loading) return <div>Loading auth state...</div>;

  const tokenInfo = getTokenInfo();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>Roles:</strong> {user?.roles?.join(', ') || 'None'}</p>
        <p><strong>Token Exists:</strong> {!!token ? 'Yes' : 'No'}</p>
        {tokenInfo && (
          <>
            <p><strong>Token Expired:</strong> {tokenInfo.isExpired ? 'Yes' : 'No'}</p>
            <p><strong>Expires In:</strong> {tokenInfo.expiresIn} seconds</p>
          </>
        )}
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
        
        <button 
          onClick={refreshAuthToken}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Refresh Token
        </button>
      </div>
    </div>
  );
};