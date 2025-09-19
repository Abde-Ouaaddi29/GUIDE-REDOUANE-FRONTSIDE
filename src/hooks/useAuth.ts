import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { URL_SERVER } from '@/app/constants';

const API_BASE = `${URL_SERVER}/api/v1`;

interface User {
  id: number;
  username?: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) { setUser(null); setIsLoading(false); return; }
      try {
        // Use /userAuth (protected) to validate
        const resp = await fetch(`${API_BASE}/userAuth`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok) {
          const u = await resp.json();
            setUser(u);
        } else {
          localStorage.removeItem('token'); sessionStorage.removeItem('token'); setUser(null);
        }
      } catch {
        setUser(null);
      } finally { setIsLoading(false); }
    };
    checkAuth();
  }, []);

  const login = async (loginValue: string, password: string, rememberMe: boolean) => {
    try {
      const resp = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ login: loginValue, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success:false, message: data.message || 'Login failed' };
      }
      localStorage.setItem('token', data.token);
      sessionStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success:true };
    } catch {
      return { success:false, message:'Could not connect to server' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE}/logout`, {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${token}` }
        });
      } catch { /* ignore */ }
    }
    localStorage.clear(); sessionStorage.clear();
    setUser(null);
    router.push('/login');
  };

  return { user, isAuthenticated: !!user, isLoading, login, logout };
};