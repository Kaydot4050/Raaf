import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { useTheme } from './ThemeProvider.jsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="relative size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {theme === 'light' && <Sun className="size-4" />}
      {theme === 'dark' && <Moon className="size-4" />}
      {theme === 'system' && <Monitor className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
