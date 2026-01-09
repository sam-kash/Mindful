"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { loginUser, registerUser } from "@/services/auth.service";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load → check existing session
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get("/api/me");
        setUser(res.data);
      } catch {
        sessionStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    sessionStorage.setItem("accessToken", res.accessToken);
    setUser(res.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    await registerUser(name, email, password);
    // no auto-login by design
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
