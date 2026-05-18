import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Beef, 
  UtensilsCrossed, 
  Scale, 
  Wallet, 
  HeartPulse, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/src/store/useAppStore';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { supabase } from '@/src/lib/supabase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Beef, label: 'Data Sapi', path: '/sapi' },
  { icon: UtensilsCrossed, label: 'Pakan Harian', path: '/pakan' },
  { icon: Scale, label: 'Timbang Sapi', path: '/berat' },
  { icon: Wallet, label: 'Keuangan', path: '/keuangan' },
  { icon: HeartPulse, label: 'Kesehatan', path: '/kesehatan' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 hidden md:block",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="mb-8 flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <Beef className="h-8 w-8" />
                <span>SIPETIK<span className="text-foreground/60">Lite</span></span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="ml-auto"
            >
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground",
                  !isSidebarOpen && "justify-center px-0"
                )}
                title={item.label}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t pt-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600",
              !isSidebarOpen && "justify-center p-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Keluar</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
