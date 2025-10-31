// JWT Utility functions for token handling

export interface JWTPayload {
  iss: string; // issuer
  sub: string; // subject (email)
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
  jti: string; // JWT ID
  scope: 'ADMIN' | 'STUDENT' | 'MENTOR'; // user role
}

export interface DecodedJWT {
  payload: JWTPayload;
  isExpired: boolean;
  isValid: boolean;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for reading token payload only, not for verification
 */
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1])) as JWTPayload;
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    return {
      payload,
      isExpired,
      isValid: !isExpired
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get user info from JWT token
 */
export const getUserFromToken = (token: string) => {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.isValid) {
    return null;
  }

  return {
    email: decoded.payload.sub,
    role: decoded.payload.scope,
    isAdmin: decoded.payload.scope === 'ADMIN',
    isStudent: decoded.payload.scope === 'STUDENT',
    isMentor: decoded.payload.scope === 'MENTOR'
  };
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  return decoded ? decoded.isExpired : true;
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = decodeJWT(token);
  return decoded ? new Date(decoded.payload.exp * 1000) : null;
};

/**
 * Token storage utilities
 */
export const TokenStorage = {
  // Access token
  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },
  
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  
  // Refresh token
  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  
  // Clear all tokens
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    return !isTokenExpired(token);
  }
};