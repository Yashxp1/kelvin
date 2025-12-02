'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" onClick={handleToggle}>
      {theme === 'dark' ? (
        <Sun strokeWidth="1.5" />
      ) : (
        <Moon strokeWidth="1.5" />
      )}
    </Button>
  );
}
