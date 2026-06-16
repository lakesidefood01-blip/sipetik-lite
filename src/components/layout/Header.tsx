import { useAppStore } from '@/src/store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { supabase } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, ReceiptText, Settings, Beef } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { isActiveProPlan } from '@/src/lib/subscription';

export default function Header() {
  const { user, profile } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userInitial = user?.email?.[0].toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="md:hidden flex items-center gap-2 font-bold text-lg text-primary">
        <Beef className="h-6 w-6" />
        <span>SIPETIK</span>
      </div>
      
      <div className="hidden md:block">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold capitalize">
            Selamat Datang, {user?.email?.split('@')[0]}
          </h2>
          <Badge variant={isActiveProPlan(profile) ? "default" : "secondary"} className={isActiveProPlan(profile) ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
             {isActiveProPlan(profile) ? 'PRO' : 'FREE'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 text-xs">
                  <AvatarImage src="" alt={user?.email || ""} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0]}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/billing')}>
              <ReceiptText className="mr-2 h-4 w-4" />
              <span>Langganan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}