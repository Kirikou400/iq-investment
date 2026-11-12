"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id?: string;
  name: string;
  email: string;
  initials: string;
  memberSince: string;
  planTier: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    pass: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    pass: string,
    planTier?: string,
    agreeTerms?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        setUser(data?.user ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn("Session check notice:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load session from server-side HTTP-only cookie on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (
    email: string,
    pass: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim(), password: pass, rememberMe }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        return {
          success: false,
          error: `Server responded with status ${res.status}. Please check your connection or database.`,
        };
      }

      if (!res.ok) {
        return { success: false, error: data?.error || "Sign in failed." };
      }

      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Network error during sign in.",
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    planTier: string = "TIER 1 Investor",
    agreeTerms = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: pass,
          planTier,
          agreeTerms,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        return {
          success: false,
          error: `Server responded with status ${res.status}. Please check your connection or database.`,
        };
      }

      if (!res.ok) {
        return { success: false, error: data?.error || "Registration failed." };
      }

      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Network error during sign up.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
    } catch {
      // Ignored
    } finally {
      setUser(null);
      window.location.href = "/signin";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
