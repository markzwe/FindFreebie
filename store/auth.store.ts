import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand'

/**
 * Authentication state type definition
 * Manages user authentication status and data throughout the app
 */
type AuthState = {
    isAuthenticated: boolean;           // Whether user is currently authenticated
    user: User | null;                  // Current user data from Appwrite account
    isLoading: boolean;                 // Loading state for auth operations
    setIsAuthenticated: (value: boolean) => void;  // Manually set authentication status
    setUser: (user: User | null) => void;          // Manually set user data
    setLoading: (loading: boolean) => void;        // Manually set loading state
    fetchAuthenticatedUser: () => Promise<void>;   // Fetch current user from Appwrite
}

/**
 * Zustand store for managing authentication state
 * Provides a simplified approach to handle user authentication status
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state - user starts unauthenticated with loading true
  isAuthenticated: false,
  user: null,
  isLoading: true,

  // Simple setter functions for manual state updates
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  /**
   * Fetches the currently authenticated user from Appwrite
   * This function checks if there's an active session and retrieves user data
   * Used on app startup or when checking authentication status
   */
  fetchAuthenticatedUser: async () => {
    // Set loading state while fetching user data
    set({ isLoading: true });

    try {
        // Attempt to get current user from Appwrite session
        const user = await getCurrentUser();

        if (user) {
          // User session exists - update store with authenticated state
          set({isAuthenticated: true, user: user as unknown as User})
        } else {
            // No active session - set unauthenticated state
            set({isAuthenticated: false, user: null})
        }

    } catch (error) {
        // Error occurred (likely no session) - log and set unauthenticated
        console.log('fetchAuthenticatedUser error', error)
        set({isAuthenticated: false, user: null})
    } finally {
        // Always stop loading regardless of success/failure
        set({ isLoading: false });
    }
  }
}));
