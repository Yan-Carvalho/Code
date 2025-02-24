import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, PlanLevel } from '../types/auth';

// Mock user database with different plan levels
const USERS = {
  'basic': { username: 'basic', password: 'basic123', planLevel: 1 as PlanLevel, email: 'basic@example.com' },
  'pro': { username: 'pro', password: 'pro123', planLevel: 2 as PlanLevel, email: 'pro@example.com' },
  'enterprise': { username: 'enterprise', password: 'enterprise123', planLevel: 3 as PlanLevel, email: 'enterprise@example.com' }
};

// Mock user passwords storage
let userPasswords: Record<string, string> = {
  'basic': 'basic123',
  'pro': 'pro123',
  'enterprise': 'enterprise123'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, password: string) => {
        const user = USERS[username as keyof typeof USERS];
        if (user && userPasswords[username] === password) {
          set({ 
            isAuthenticated: true, 
            user: { 
              username: user.username,
              email: user.email,
              planLevel: user.planLevel
            }
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      updateProfile: (data: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...data 
            } 
          });
        }
      },
      updatePassword: (currentPassword: string, newPassword: string) => {
        const currentUser = get().user;
        if (currentUser && userPasswords[currentUser.username] === currentPassword) {
          userPasswords[currentUser.username] = newPassword;
          return true;
        }
        return false;
      },
      updateUsername: (currentPassword: string, newUsername: string) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        
        // Check if password is correct
        if (userPasswords[currentUser.username] !== currentPassword) {
          return false;
        }

        // Check if new username already exists
        if (USERS[newUsername as keyof typeof USERS]) {
          return false;
        }

        // Update username
        const userData = USERS[currentUser.username as keyof typeof USERS];
        delete USERS[currentUser.username as keyof typeof USERS];
        USERS[newUsername as keyof typeof USERS] = {
          ...userData,
          username: newUsername
        };

        // Update passwords
        const oldPassword = userPasswords[currentUser.username];
        delete userPasswords[currentUser.username];
        userPasswords[newUsername] = oldPassword;

        // Update current user
        set({
          user: {
            ...currentUser,
            username: newUsername
          }
        });

        return true;
      },
      upgradePlan: (newPlanLevel: PlanLevel) => {
        const currentUser = get().user;
        if (currentUser && newPlanLevel > currentUser.planLevel) {
          set({
            user: {
              ...currentUser,
              planLevel: newPlanLevel
            }
          });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);