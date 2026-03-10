import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, Calendar, BookOpen, CreditCard, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users',         icon: Users,           label: 'Users' },
  { to: '/trainers',      icon: Dumbbell,        label: 'Trainers' },
  { to: '/classes',       icon: Calendar,        label: 'Classes' },
  { to: '/bookings',      icon: BookOpen,        label: 'Bookings' },
  { to: '/subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  { to: '/notifications', icon: Bell,            label: 'Notifications' },
];

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">FitPulse</span>
          <span className="text-xs text-muted-foreground ml-1">Admin</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}>
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
