import { useState } from 'react';

const ADMIN_KEY = 'machado_admin_auth';
const CREDENTIALS = { username: 'admin', password: 'machado2024' };

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_KEY) === 'true';
  });

  const login = (username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      localStorage.setItem(ADMIN_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
