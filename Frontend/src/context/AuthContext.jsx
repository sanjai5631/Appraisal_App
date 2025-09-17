import React, { createContext, useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
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

  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole || "";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  const normalizeRole = (rawRole) => {
    if (["Developer", "Tester", "Marketing", "ClientSupport"].includes(rawRole)) {
      return "employee";
    }
    if (rawRole === "HR & Finance") {
      return "hr";
    }
    if (rawRole === "Manager") {
      return "manager";
    }
    return ""; // fallback
  };

  const login = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const rawRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const userRole = normalizeRole(rawRole);

      localStorage.setItem("role", userRole);
      setRole(userRole);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    localStorage.clear(); // remove all auth data
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
