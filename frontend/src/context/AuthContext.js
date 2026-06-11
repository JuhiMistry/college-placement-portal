"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load and verify session on mount
  useEffect(() => {
    async function initSession() {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify session validity & fetch fresh profile data from API
          const freshProfile = await apiService.profile.get();
          setUser(freshProfile);
          localStorage.setItem("user", JSON.stringify(freshProfile));
        } catch (error) {
          console.error("Session verification failed, logging out:", error);
          handleLogout();
        }
      }
      setLoading(false);
    }
    
    initSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await apiService.auth.login(email, password);
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Auto redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (payload) => {
    try {
      const data = await apiService.auth.register(payload);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const updateLocalUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: updateLocalUser,
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
