/**
 * Enhanced Authentication System with Google Apps Script Integration
 * Uses Google Apps Script as primary storage via Next.js API proxy
 * Features: Session management, password validation, user roles, auto-logout
 */

// Use Next.js API proxy to avoid CORS issues
const AUTH_PROXY_URL = '/api/auth/proxy';

export interface User {
  id: string;
  name: string;
  usn: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

const CURRENT_USER_KEY = 'workshop_current_user';
const SESSION_KEY = 'workshop_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Password validation
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  if (password.length > 50) {
    return { valid: false, error: 'Password must be less than 50 characters' };
  }
  return { valid: true };
};

// Email validation
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
};

// Session management
interface Session {
  userId: string;
  expiresAt: number;
  createdAt: number;
}

const createSession = (userId: string): void => {
  const session: Session = {
    userId,
    expiresAt: Date.now() + SESSION_DURATION,
    createdAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  const session: Session = JSON.parse(sessionData);
  
  // Check if session expired
  if (Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }
  
  return session;
};

const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Signup function with Google Apps Script integration
export const signup = async (
  name: string,
  usn: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { success: false, error: emailValidation.error };
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error };
  }
  
  if (!name.trim()) {
    return { success: false, error: 'Name is required' };
  }
  
  if (!usn.trim()) {
    return { success: false, error: 'USN is required' };
  }
  
  try {
    // Call Next.js API proxy (which calls Google Apps Script)
    const response = await fetch(AUTH_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'signup',
        name: name.trim(),
        usn: usn.trim().toUpperCase(),
        email: email.toLowerCase().trim(),
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === 'exists') {
      return { success: false, error: 'Email already registered' };
    }

    if (result.status === 'success') {
      // Create user object
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        usn: usn.trim().toUpperCase(),
        email: email.toLowerCase().trim(),
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Create session and store user
      createSession(newUser.id);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return { success: true, user: newUser };
    }

    return { success: false, error: 'Signup failed. Please try again.' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};

// Login function with Google Apps Script integration
export const login = async (email: string, password: string): Promise<AuthResult> => {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }
  
  try {
    // Call Next.js API proxy (which calls Google Apps Script)
    const response = await fetch(AUTH_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: email.toLowerCase().trim(),
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === 'invalid') {
      return { success: false, error: 'Invalid email or password' };
    }

    if (result.status === 'success') {
      // Create user object
      const user: User = {
        id: `user-${Date.now()}`,
        name: result.name,
        usn: result.usn,
        email: email.toLowerCase().trim(),
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Create session and store user
      createSession(user.id);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { success: true, user };
    }

    return { success: false, error: 'Login failed. Please try again.' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};

// Logout function
export const logout = (): void => {
  clearSession();
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  // Check session validity
  const session = getSession();
  if (!session) {
    return null;
  }
  
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;
  
  try {
    const user: User = JSON.parse(userStr);
    return user;
  } catch {
    clearSession();
    return null;
  }
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Get all users (admin only) with Google Apps Script integration
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Call Next.js API proxy to get users
    const response = await fetch(`${AUTH_PROXY_URL}?action=getUsers`, {
      method: 'GET',
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      // Convert Google Sheets data to User objects
      // Data format: [timestamp, name, usn, email, password]
      return data.map((row: any[], index: number) => ({
        id: `user-${index}`,
        name: row[1] || '',
        usn: row[2] || '',
        email: row[3] || '',
        role: 'student' as const,
        createdAt: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
        lastLogin: '',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
