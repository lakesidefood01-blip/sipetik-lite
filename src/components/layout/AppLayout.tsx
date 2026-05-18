import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useAppStore } from '@/src/store/useAppStore';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout() {
  const { isSidebarOpen } = useAppStore();

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
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        <MobileNav />
      </div>
    </div>
  );
}
