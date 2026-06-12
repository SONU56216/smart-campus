import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import { UserState } from "@/types";

interface AuthStore {
  token: string | null;
  user: UserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(credentials);
          const { token, user } = res.data;
          
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (err: any) {
          const errMsg = err.message || "Credential authentication failed.";
          set({ error: errMsg, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchMe: async () => {
        const activeToken = get().token;
        if (!activeToken) return;

        set({ isLoading: true });
        try {
          const res = await authApi.getMe();
          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          // Token matches expired or blocked signature
          get().logout();
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "campuspass-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    token: store.token,
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    fetchMe: store.fetchMe,
    clearError: store.clearError,
  };
};
