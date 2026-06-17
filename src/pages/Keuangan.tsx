import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { TransaksiKeuangan, Sapi } from '@/src/types';
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
  Wallet, 
  Loader2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter
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
import { Card, CardContent } from '@/src/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency, cn } from '@/src/lib/utils';

export default function Keuangan() {
  const { user } = useAppStore();
  const [transaksi, setTransaksi] = useState<TransaksiKeuangan[]>([]);
  const [sapiList, setSapiList] = useState<Sapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tipe: 'pengeluaran',
    kategori: 'pakan',
    nominal: '',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    sapi_id: ''
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: transData } = await supabase
        .from('transaksi_keuangan')
        .select('*')
        .eq('user_id', user.id)
        .order('tanggal', { ascending: false });

      const { data: sapiData } = await supabase.from('sapi').select('*').eq('user_id', user.id);

      setTransaksi(transData || []);
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
      const { error } = await supabase.from('transaksi_keuangan').insert([{
        user_id: user?.id,
        tipe: formData.tipe,
        kategori: formData.kategori,
        nominal: parseFloat(formData.nominal),
        tanggal: formData.tanggal,
        keterangan: formData.keterangan,
        sapi_id: formData.sapi_id || null
      }]);

      if (error) throw error;

      toast.success('Transaksi berhasil dicatat.');
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        tipe: 'pengeluaran',
        kategori: 'pakan',
        nominal: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        sapi_id: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus rincian transaksi ini?')) return;
    try {
      const { error } = await supabase.from('transaksi_keuangan').delete().eq('id', id);
      if (error) throw error;
      toast.success('Transaksi dihapus.');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalPemasukan = transaksi.filter(t => t.tipe === 'pemasukan').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = transaksi.filter(t => t.tipe === 'pengeluaran').reduce((acc, curr) => acc + curr.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keuangan Peternakan</h1>
          <p className="text-muted-foreground">Kelola arus kas, laba rugi, dan biaya operasional.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2">
            <Plus className="h-4 w-4" /> Catat Transaksi
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipe</Label>
                  <Select value={formData.tipe} onValueChange={(v) => setFormData({...formData, tipe: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                      <SelectItem value="pemasukan">Pemasukan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.kategori} onValueChange={(v) => setFormData({...formData, kategori: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.tipe === 'pengeluaran' ? (
                        <>
                          <SelectItem value="pakan">Pakan</SelectItem>
                          <SelectItem value="vitamin">Vitamin/Obat</SelectItem>
                          <SelectItem value="kandang">Biaya Kandang</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="beli_sapi">Beli Sapi</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="jual_sapi">Penjualan Sapi</SelectItem>
                          <SelectItem value="jual_pupuk">Penjualan Pupuk</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label>Nominal (Rp)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={formData.nominal}
                    onChange={(e) => setFormData({...formData, nominal: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sapi (Opsional)</Label>
                <Select value={formData.sapi_id} onValueChange={(v) => setFormData({...formData, sapi_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Sapi (Opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak Ada</SelectItem>
                    {sapiList.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.kode_sapi} - {s.nama_sapi}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input 
                  placeholder="Keterangan transaksi..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Transaksi'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-blue-500 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm font-medium">Laba / Rugi Berjalan</p>
            <h3 className="text-3xl font-bold mt-1">{formatCurrency(saldo)}</h3>
            <div className="mt-4 flex items-center gap-1 text-xs text-blue-100">
               Total keuntungan atau kerugian saat ini
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Pemasukan</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">+{formatCurrency(totalPemasukan)}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Pengeluaran</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">-{formatCurrency(totalPengeluaran)}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <ArrowDownRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari transaksi..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : transaksi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  Belum ada catatan keuangan.
                </TableCell>
              </TableRow>
            ) : (
              transaksi.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">{item.tanggal}</TableCell>
                  <TableCell className="capitalize">{item.kategori.replace('_', ' ')}</TableCell>
                  <TableCell className="max-w-[300px] truncate underline text-muted-foreground italic text-xs">{item.keterangan || '-'}</TableCell>
                  <TableCell className={cn(
                    "text-right font-bold",
                    item.tipe === 'pemasukan' ? "text-green-600" : "text-red-500"
                  )}>
                    {item.tipe === 'pemasukan' ? '+' : '-'} {formatCurrency(item.nominal)}
                  </TableCell>
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
