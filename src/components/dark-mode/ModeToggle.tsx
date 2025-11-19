'use client';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="relative hover:rounded-full"
    >
      <Sun className="size-4 rotate-0   scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
