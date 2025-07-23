// context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const setTokens = (newToken) => {
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded); // decoded contains { id: ..., role: ... }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
