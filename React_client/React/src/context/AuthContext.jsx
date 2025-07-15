import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    prenom: "Valentin",
    nom: "Faker",
    role: "Boulangerie du Parc",
    avatar: "/dora.png",
    identifiant: "valentin.f",
    motdepasse: "mdp123"
  });

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}