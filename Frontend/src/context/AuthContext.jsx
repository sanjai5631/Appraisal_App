import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import works with Vite

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Normalize role function
  const normalizeRole = (rawRole) => {
    if (["Developer", "Tester", "Marketing", "ClientSupport"].includes(rawRole)) return "employee";
    if (rawRole === "HR & Finance") return "hr";
    if (rawRole === "Manager") return "manager";
    return "";
  };

  // State: isLoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.clear();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  });

  // State: role
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) return storedRole;

    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
      const decoded = jwtDecode(token);
      const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
      const userRole = normalizeRole(rawRole);
      localStorage.setItem("role", userRole);
      return userRole;
    } catch {
      return "";
    }
  });

  // Keep isLoggedIn in localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Login: optionally pass role from API
  const login = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
      const userRole = normalizeRole(rawRole);
      localStorage.setItem("role", userRole);
      setRole(userRole);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Failed to decode token", err);
      setIsLoggedIn(false);
      setRole("");
      localStorage.clear();
    }
  };

  // Logout: clear everything
  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  return useContext(AuthContext);
}
