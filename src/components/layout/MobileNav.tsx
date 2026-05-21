import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Beef, 
  UtensilsCrossed, 
  Scale, 
  Wallet
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const mobileItems = [
  { icon: LayoutDashboard, label: 'Beranda', path: '/dashboard' },
  { icon: Beef, label: 'Sapi', path: '/sapi' },
  { icon: UtensilsCrossed, label: 'Pakan', path: '/pakan' },
  { icon: Scale, label: 'Berat', path: '/berat' },
  { icon: Wallet, label: 'Uang', path: '/keuangan' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background shadow-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 text-[10px] transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
