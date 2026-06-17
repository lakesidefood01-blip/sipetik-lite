import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Sapi } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/src/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Beef
} from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/src/components/ui/dropdown-menu';
import { Badge } from '@/src/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/src/components/ui/skeleton';
import { canCreateCow } from '@/src/lib/subscription';
import UpgradeModal from '@/src/components/UpgradeModal';

export default function SapiList() {
  const { user, profile } = useAppStore();
  const navigate = useNavigate();
  const [sapi, setSapi] = useState<Sapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const fetchSapi = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('sapi')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSapi(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSapi();
  }, [user]);

  const filteredSapi = sapi.filter(s => 
    s.kode_sapi.toLowerCase().includes(search.toLowerCase()) || 
    (s.nama_sapi?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data sapi ini?')) return;
    
    try {
      const { error } = await supabase.from('sapi').delete().eq('id', id);
      if (error) throw error;
      toast.success('Data sapi berhasil dihapus.');
      fetchSapi();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddSapi = () => {
    if (!canCreateCow(profile, sapi.length)) {
      setShowUpgradeModal(true);
      return;
    }
    navigate('/sapi/new');
  };

  return (
    <div className="space-y-6">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        message="Anda telah mencapai batas maksimal 3 sapi pada paket Gratis. Upgrade ke SIPETIK Pro untuk menambah sapi tanpa batas."
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Data Sapi</h1>
          <p className="text-muted-foreground">Kelola semua daftar sapi Anda di sini.</p>
        </div>
        <Button onClick={handleAddSapi} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Sapi
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Cari kode atau nama sapi..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Kode</TableHead>
              <TableHead>Nama/Jenis</TableHead>
              <TableHead>Berat (Kg)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Beli</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredSapi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Beef className="h-12 w-12 opacity-20" />
                    <p>Belum ada data sapi.</p>
                    <Button variant="link" onClick={() => navigate('/sapi/new')}>Tambah Sekarang</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSapi.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">#{item.kode_sapi}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.nama_sapi || '-'}</span>
                      <span className="text-xs text-muted-foreground capitalize">{item.jenis_sapi || 'Lokal'} - {item.jenis_kelamin}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{item.berat_sekarang || item.berat_awal} kg</span>
                      <span className="text-[10px] text-muted-foreground">Target: {item.target_berat} kg</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === 'aktif' ? 'default' : 
                      item.status === 'sakit' ? 'destructive' : 
                      'secondary'
                    } className="capitalize">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.tanggal_beli ? new Date(item.tanggal_beli).toLocaleDateString('id-ID') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/sapi/${item.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/sapi/edit/${item.id}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Ubah Data
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
