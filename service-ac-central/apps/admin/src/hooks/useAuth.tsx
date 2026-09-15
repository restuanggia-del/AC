import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiClient, tokenStorage } from "../services/apiClient";
import type { AdminUser, ApiResponse } from "../types";

interface AuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get<ApiResponse<AdminUser>>("/auth/me")
      .then((res) => setAdmin(res.data.data))
      .catch(() => {
        tokenStorage.clear();
        setAdmin(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        admin: AdminUser;
      }>
    >("/auth/login", { email, password });

    const { accessToken, refreshToken, admin: adminData } = res.data.data;
    tokenStorage.setTokens(accessToken, refreshToken);
    setAdmin(adminData);
  }

  function logout() {
    tokenStorage.clear();
    setAdmin(null);
    apiClient.post("/auth/logout").catch(() => {});
  }

  async function updateProfile(payload: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const res = await apiClient.put<ApiResponse<AdminUser>>(
      "/auth/me",
      payload,
    );
    setAdmin(res.data.data);
  }

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}
