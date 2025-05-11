'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(getApiUrl('/login'), { email, password });
      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        setToken(token);
        setUser(user);
        
        // Set cookies with expiration
        Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: res.data.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Login failed, please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const getToken = () => token;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 text-sm">Loading</p>
    </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
