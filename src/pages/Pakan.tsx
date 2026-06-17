import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Sapi, Pakan as PakanType } from '@/src/types';
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
  Search, 
  UtensilsCrossed, 
  Calendar,
  Loader2,
  Trash2
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
import { toast } from 'sonner';
import { formatCurrency } from '@/src/lib/utils';

export default function Pakan() {
  const { user } = useAppStore();
  const [sapiList, setSapiList] = useState<Sapi[]>([]);
  const [pakanList, setPakanList] = useState<(PakanType & { sapi: Sapi })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sapi_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    jenis_pakan: '',
    jumlah_kg: '',
    harga: '',
    catatan: ''
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: sapiData } = await supabase.from('sapi').select('*').eq('user_id', user.id);
      const { data: pakanData } = await supabase
        .from('pakan')
        .select('*, sapi(*)')
        .order('tanggal', { ascending: false });

      setSapiList(sapiData || []);
      setPakanList(pakanData as any || []);
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
      const { error } = await supabase.from('pakan').insert([{
        sapi_id: formData.sapi_id,
        tanggal: formData.tanggal,
        jenis_pakan: formData.jenis_pakan,
        jumlah_kg: parseFloat(formData.jumlah_kg),
        harga: parseFloat(formData.harga),
        catatan: formData.catatan
      }]);

      if (error) throw error;

      // Also add to financial transactions
      await supabase.from('transaksi_keuangan').insert([{
        user_id: user?.id,
        tipe: 'pengeluaran',
        kategori: 'pakan',
        nominal: parseFloat(formData.harga),
        tanggal: formData.tanggal,
        keterangan: `Pakan ${formData.jenis_pakan} untuk ${sapiList.find(s => s.id === formData.sapi_id)?.kode_sapi}`,
        sapi_id: formData.sapi_id
      }]);

      toast.success('Data pakan berhasil dicatatkan.');
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        sapi_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        jenis_pakan: '',
        jumlah_kg: '',
        harga: '',
        catatan: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus rincian pakan ini?')) return;
    try {
      const { error } = await supabase.from('pakan').delete().eq('id', id);
      if (error) throw error;
      toast.success('Rincian pakan dihapus.');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pakan Harian</h1>
          <p className="text-muted-foreground">Monitor pengeluaran dan jenis pakan harian sapi.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2">
            <Plus className="h-4 w-4" /> Catat Pakan
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Catat Pemberian Pakan</DialogTitle>
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
                  <Label>Tanggal</Label>
                  <Input 
                    type="date" 
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Pakan</Label>
                  <Input 
                    placeholder="Konsentrat/Hijauan"
                    value={formData.jenis_pakan}
                    onChange={(e) => setFormData({...formData, jenis_pakan: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jumlah (Kg)</Label>
                  <Input 
                    type="number"
                    step="0.1" 
                    placeholder="0"
                    value={formData.jumlah_kg}
                    onChange={(e) => setFormData({...formData, jumlah_kg: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Harga (Rp)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={formData.harga}
                    onChange={(e) => setFormData({...formData, harga: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Input 
                  placeholder="Catatan tambahan..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Catatan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl</TableHead>
              <TableHead>Sapi</TableHead>
              <TableHead>Jenis Pakan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Biaya</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : pakanList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <UtensilsCrossed className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  Belum ada catatan pakan.
                </TableCell>
              </TableRow>
            ) : (
              pakanList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{new Date(item.tanggal).getFullYear()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">#{item.sapi?.kode_sapi}</span>
                      <span className="text-xs text-muted-foreground">{item.sapi?.nama_sapi}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.jenis_pakan}</TableCell>
                  <TableCell>{item.jumlah_kg} kg</TableCell>
                  <TableCell className="font-semibold text-primary">{formatCurrency(item.harga)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
