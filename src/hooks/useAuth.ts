import { useState, useEffect } from 'react';
import { TokenStorage, getUserFromToken } from '../utils/jwt';

type UserType = "admin" | "student" | "mentor" | null;

interface UserInfo {
  type: UserType;
  name: string;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ type: null, name: "" });
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const checkAuthStatus = () => {
    if (TokenStorage.isLoggedIn()) {
      const token = TokenStorage.getAccessToken();
      if (token) {
        const user = getUserFromToken(token);
        if (user) {
          setIsLoggedIn(true);
          setUserInfo({ 
            type: user.role.toLowerCase() as UserType, 
            name: user.email 
          });
          return true;
        }
      }
    }
    
    setIsLoggedIn(false);
    setUserInfo({ type: null, name: "" });
    return false;
  };

  const updateAuthStatus = () => {
    checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
    setIsInitialized(true);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check token expiry periodically
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    isLoggedIn,
    userInfo,
    isInitialized,
    updateAuthStatus,
    checkAuthStatus
  };
};