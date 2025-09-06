import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  name: string;
  phone: string;
  address: string;
  avatar?: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  clearAllData: () => void;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecofinds_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecofinds_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('ecofinds_users') || '[]');
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        console.log('User not found with email:', email);
        return false;
      }

      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      
      if (isPasswordValid) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('ecofinds_user', JSON.stringify(userWithoutPassword));
        console.log('User logged in successfully:', userWithoutPassword);
        return true;
      }
      
      console.log('Invalid password for email:', email);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('ecofinds_users') || '[]');
      
      // Check if user already exists (case-insensitive email check only)
      const existingUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        console.log('User already exists with email:', email);
        return false;
      }

      // Hash password with bcrypt
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        displayName,
        username: displayName.toLowerCase().replace(/\s+/g, '_'), // Generate username from display name
        name: displayName,
        phone: '',
        address: '',
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      };

      users.push(newUser);
      localStorage.setItem('ecofinds_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ecofinds_user', JSON.stringify(userWithoutPassword));
      
      // Send verification email
      await sendVerificationEmail(email);
      
      console.log('User registered successfully:', userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecofinds_user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('ecofinds_user', JSON.stringify(updatedUser));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('ecofinds_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        // Update display name and username if display name changes
        if (userData.displayName) {
          userData.username = userData.displayName.toLowerCase().replace(/\s+/g, '_');
        }
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('ecofinds_users', JSON.stringify(users));
      }
    }
  };

  const clearAllData = () => {
    setUser(null);
    localStorage.removeItem('ecofinds_user');
    localStorage.removeItem('ecofinds_users');
    console.log('All user data cleared');
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('ecofinds_users') || '[]');
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return false;
      }

      // In a real app, you would send an actual email here
      // For demo purposes, we'll simulate it and show the verification link in console
      const verificationLink = `${window.location.origin}/verify-email?token=${foundUser.verificationToken}`;
      
      console.log('=== EMAIL VERIFICATION ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify your EcoFinds account`);
      console.log(`Message: Please click the following link to verify your email: ${verificationLink}`);
      console.log('========================');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('ecofinds_users') || '[]');
      const foundUser = users.find((u: any) => u.verificationToken === token);
      
      if (!foundUser) {
        return false;
      }

      // Check if token is expired
      if (new Date() > new Date(foundUser.verificationTokenExpiry)) {
        return false;
      }

      // Update user verification status
      const userIndex = users.findIndex((u: any) => u.id === foundUser.id);
      if (userIndex !== -1) {
        users[userIndex].emailVerified = true;
        users[userIndex].verificationToken = undefined;
        users[userIndex].verificationTokenExpiry = undefined;
        localStorage.setItem('ecofinds_users', JSON.stringify(users));

        // Update current user if they're logged in
        if (user && user.id === foundUser.id) {
          const updatedUser = { ...user, emailVerified: true };
          setUser(updatedUser);
          localStorage.setItem('ecofinds_user', JSON.stringify(updatedUser));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    return await sendVerificationEmail(user.email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile, 
      clearAllData, 
      sendVerificationEmail, 
      verifyEmail, 
      resendVerificationEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};