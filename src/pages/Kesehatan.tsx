import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Kesehatan as KesehatanType, Sapi } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
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
  HeartPulse, 
  Loader2,
  Trash2,
  CheckCircle2,
  CalendarDays,
  Clock
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/src/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/src/components/ui/select';
import { badgeVariants, Badge } from '@/src/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

export default function Kesehatan() {
  const { user } = useAppStore();
  const [kesehatan, setKesehatan] = useState<(KesehatanType & { sapi: Sapi })[]>([]);
  const [sapiList, setSapiList] = useState<Sapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sapi_id: '',
    jenis: 'Vaksin',
    tanggal: new Date().toISOString().split('T')[0],
    catatan: ''
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: kesData } = await supabase
        .from('kesehatan')
        .select('*, sapi(*)')
        .order('tanggal', { ascending: true });

      const { data: sapiData } = await supabase.from('sapi').select('*').eq('user_id', user.id);

      setKesehatan(kesData as any || []);
      setSapiList(sapiData || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('kesehatan').insert([{
        sapi_id: formData.sapi_id,
        jenis: formData.jenis,
        tanggal: formData.tanggal,
        catatan: formData.catatan,
        status: 'pending'
      }]);

      if (error) throw error;

      toast.success('Jadwal kesehatan berhasil dibuat.');
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        sapi_id: '',
        jenis: 'Vaksin',
        tanggal: new Date().toISOString().split('T')[0],
        catatan: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'selesai' : 'pending';
    try {
      const { error } = await supabase.from('kesehatan').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success(`Jadwal ditandai sebagai ${newStatus}.`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus rincian kesehatan ini?')) return;
    try {
      const { error } = await supabase.from('kesehatan').delete().eq('id', id);
      if (error) throw error;
      toast.success('Rincian kesehatan dihapus.');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const pendingCount = kesehatan.filter(k => k.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kesehatan Sapi</h1>
          <p className="text-muted-foreground">Kelola jadwal vaksin, vitamin, dan pemeriksaan medis.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-100 shadow-sm">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-bold">{pendingCount} Jadwal Tertunda</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2">
                <Plus className="h-4 w-4" /> Buat Jadwal
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buat Jadwal Kesehatan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Pilih Sapi</Label>
                    <Select value={formData.sapi_id} onValueChange={(v) => setFormData({...formData, sapi_id: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Sapi" />
                      </SelectTrigger>
                      <SelectContent>
                        {sapiList.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.kode_sapi} - {s.nama_sapi}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Jenis</Label>
                      <Select value={formData.jenis} onValueChange={(v) => setFormData({...formData, jenis: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vaksin">Vaksin</SelectItem>
                          <SelectItem value="Vitamin">Vitamin</SelectItem>
                          <SelectItem value="Obat Cacing">Obat Cacing</SelectItem>
                          <SelectItem value="Cek Kesehatan">Cek Kesehatan</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal</Label>
                      <Input 
                        type="date" 
                        value={formData.tanggal}
                        onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan</Label>
                    <Input 
                      placeholder="Dosis atau merk obat..."
                      value={formData.catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buat Jadwal'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl</TableHead>
              <TableHead>Sapi</TableHead>
              <TableHead>Jenis Tindakan</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : kesehatan.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <HeartPulse className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  Belum ada jadwal kesehatan.
                </TableCell>
              </TableRow>
            ) : (
              kesehatan.map((item) => (
                <TableRow key={item.id} className={cn(item.status === 'selesai' && "opacity-60 bg-muted/20")}>
                  <TableCell className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        {item.tanggal}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold">#{item.sapi?.kode_sapi}</span>
                      <span className="text-muted-foreground truncate max-w-[100px]">{item.sapi?.nama_sapi}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                        item.jenis === 'Vaksin' ? "border-red-200 text-red-600 bg-red-50" :
                        item.jenis === 'Vitamin' ? "border-blue-200 text-blue-600 bg-blue-50" :
                        "border-gray-200"
                    )}>
                        {item.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs italic text-muted-foreground">{item.catatan || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'selesai' ? 'default' : 'secondary'} className="capitalize">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={item.status === 'selesai' ? "text-muted-foreground" : "text-green-500"} 
                            onClick={() => handleUpdateStatus(item.id, item.status)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
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
