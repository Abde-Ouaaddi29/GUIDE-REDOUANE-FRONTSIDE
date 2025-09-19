"use client";
import { useEffect, useState, useCallback } from 'react';
import { URL_SERVER } from '@/app/constants';

const API_BASE = `${URL_SERVER}/api/v1`;

interface AuthUser { id:number; username?:string; email?:string; role?:string }

export function useTokenAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  const verify = useCallback(async () => {
    const token = getToken();
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}/verify`, { headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) {
        if (resp.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
        setUser(null);
        setError('Unauthorized');
      } else {
        const data = await resp.json();
        setUser(data.user || null);
        setError(null);
      }
    } catch (e:any) {
      setError('Network error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { verify(); }, [verify]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refresh: verify,
    logout: () => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
    }
  };
}

export default useTokenAuth;