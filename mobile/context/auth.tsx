import { createContext, useContext, useState, useEffect} from "react";
import * as SecureStore from "expo-secure-store";

type AuthUser = {
  id: number;
  fullName: string;
  username: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  lastWorkoutSaved: number;
  markWorkoutSaved: () => void; 
};

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastWorkoutSaved, setLastWorkoutSaved] = useState(0);

   useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedUser = await SecureStore.getItemAsync("user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

   const login = async (user: AuthUser, token: string) => {
    await SecureStore.setItemAsync("token", String(token));
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setUser(null);
    setToken(null);
  };

  const markWorkoutSaved = () => setLastWorkoutSaved(Date.now());

    return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, lastWorkoutSaved, markWorkoutSaved }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
