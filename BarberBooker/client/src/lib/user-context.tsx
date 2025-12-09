import { useState, createContext, useContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "barber" | "admin";
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string, role: "customer" | "barber" | "admin") => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: "customer" | "barber" | "admin") => {
    const newUser: User = {
      id: Math.random().toString(),
      name: email.split("@")[0],
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
