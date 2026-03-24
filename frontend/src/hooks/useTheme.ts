import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';

type Theme = 'dark' | 'light' | 'auto';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getResolvedTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  return theme;
}

export function useTheme(initialTheme: Theme = 'auto'): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return initialTheme;
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || initialTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    return getResolvedTheme(theme);
  });

  useEffect(() => {
    const root = document.documentElement;
    const resolved = getResolvedTheme(theme);

    root.classList.remove('dark', 'light');
    root.classList.add(resolved);

    localStorage.setItem('theme', theme);
    setResolvedTheme(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const resolved = getSystemTheme();
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setThemeState(nextTheme);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    theme: 'auto',
    notifications: true,
    refreshInterval: 30000,
  });

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.theme) {
      localStorage.setItem('theme', newSettings.theme);
    }
  }, []);

  return { settings, updateSettings };
}
