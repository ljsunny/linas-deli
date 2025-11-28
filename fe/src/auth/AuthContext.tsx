import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User } from "@/type"
import api from "@/api/axios";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider 생성
export const AuthProvider = ({ children }: {children:ReactNode}) => {
  const [user, setUser] = useState(() => {
    // 초기 user 값 설정
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      api
        .get('api/auth/session')
        .then((response) => {
          const data = response.data;
          if (data.authenticated) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("sessionId", data.user.sessionId);
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅 생성
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
