'use client';
import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    // Force dark mode always — light mode removed
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return null;
}
