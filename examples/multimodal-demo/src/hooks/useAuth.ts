import { useState, useEffect } from 'react';
import { Provider } from '@/constants/messages';

interface UseAuthReturn {
  zentryApiKey: string;
  openaiApiKey: string;
  provider: Provider;
  user: string;
  setAuth: (zentry: string, openai: string, provider: Provider) => void;
  setUser: (user: string) => void;
  clearAuth: () => void;
  clearUser: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [zentryApiKey, setZentryApiKey] = useState<string>('');
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const [provider, setProvider] = useState<Provider>('openai');
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    const zentry = localStorage.getItem('zentryApiKey');
    const openai = localStorage.getItem('openaiApiKey');
    const savedProvider = localStorage.getItem('provider') as Provider;
    const savedUser = localStorage.getItem('user');

    if (zentry && openai && savedProvider) {
      setAuth(zentry, openai, savedProvider);
    }
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const setAuth = (zentry: string, openai: string, provider: Provider) => {
    setZentryApiKey(zentry);
    setOpenaiApiKey(openai);
    setProvider(provider);
    localStorage.setItem('zentryApiKey', zentry);
    localStorage.setItem('openaiApiKey', openai);
    localStorage.setItem('provider', provider);
  };

  const clearAuth = () => {
    localStorage.removeItem('zentryApiKey');
    localStorage.removeItem('openaiApiKey');
    localStorage.removeItem('provider');
    setZentryApiKey('');
    setOpenaiApiKey('');
    setProvider('openai');
  };

  const updateUser = (user: string) => {
    setUser(user);
    localStorage.setItem('user', user);
  };

  const clearUser = () => {
    localStorage.removeItem('user');
    setUser('');
  };

  return {
    zentryApiKey,
    openaiApiKey,
    provider,
    user,
    setAuth,
    setUser: updateUser,
    clearAuth,
    clearUser,
  };
}; 