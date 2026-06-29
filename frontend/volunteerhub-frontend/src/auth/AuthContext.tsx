import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

interface User {
  emailId: string;
  userRole: "VOLUNTEER" | "ORGANIZER";
  phoneNumber?: number;
  address?: string;
}


interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (token: string) => {
    // 1️⃣ Save token
    localStorage.setItem("token", token);
    setToken(token);

    // 2️⃣ Fetch profile
    const res = await api.get("/user/profile");

    // 3️⃣ Save user
    localStorage.setItem("user", JSON.stringify(res.data.data));
    setUser(res.data.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
