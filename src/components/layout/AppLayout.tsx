import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useAppStore } from '@/src/store/useAppStore';
import { cn } from '@/src/lib/utils';

export default function AppLayout() {
  const { isSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      
      <div 
        className={cn(
          "flex flex-col transition-all duration-300",
          "md:pl-16",
          isSidebarOpen && "md:pl-64"
        )}
      >
        <Header />
        
        <main className="flex-1 pb-20 p-4 md:p-6 lg:p-8 md:pb-8">
          <Outlet />
        </main>
        
        <MobileNav />
      </div>
    </div>
  );
}
