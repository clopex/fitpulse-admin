import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const user = useAuthStore((s) => s.user);
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <span className="text-sm font-medium">{user?.email}</span>
        </div>
      </div>
    </header>
  );
}
