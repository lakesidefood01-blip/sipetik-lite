import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Sapi, BeratBadan } from '@/src/types';
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
  Scale, 
  Loader2,
  Trash2,
  TrendingUp,
  TrendingDown
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
import { Badge } from '@/src/components/ui/badge';
import { toast } from 'sonner';

export default function Berat() {
  const { user } = useAppStore();
  const [sapiList, setSapiList] = useState<Sapi[]>([]);
  const [beratList, setBeratList] = useState<(BeratBadan & { sapi: Sapi })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sapi_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    berat: '',
    catatan: ''
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: sapiData } = await supabase.from('sapi').select('*').eq('user_id', user.id);
      const { data: beratData } = await supabase
        .from('berat_badan')
        .select('*, sapi(*)')
        .order('tanggal', { ascending: false });

      setSapiList(sapiData || []);
      setBeratList(beratData as any || []);
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
      const beratVal = parseFloat(formData.berat);
      
      const { error } = await supabase.from('berat_badan').insert([{
        sapi_id: formData.sapi_id,
        tanggal: formData.tanggal,
        berat: beratVal,
        catatan: formData.catatan
      }]);

      if (error) throw error;

      // Update current weight in sapi table
      await supabase.from('sapi').update({
        berat_sekarang: beratVal,
        updated_at: new Date().toISOString()
      }).eq('id', formData.sapi_id);

      toast.success('Pencatatan berat berhasil.');
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        sapi_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        berat: '',
        catatan: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sapiId: string) => {
    if (!confirm('Hapus rincian timbang ini?')) return;
    try {
      const { error } = await supabase.from('berat_badan').delete().eq('id', id);
      if (error) throw error;
      
      // Fetch latest weight to update sapi table again
      const { data: latestWeight } = await supabase
        .from('berat_badan')
        .select('berat')
        .eq('sapi_id', sapiId)
        .order('tanggal', { ascending: false })
        .limit(1)
        .single();
      
      await supabase.from('sapi').update({
        berat_sekarang: latestWeight?.berat || 0
      }).eq('id', sapiId);

      toast.success('Pencatatan berat dihapus.');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timbang Sapi</h1>
          <p className="text-muted-foreground">Catat dan pantau pertumbuhan berat badan ternak.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2">
            <Plus className="h-4 w-4" /> Catat Berat
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timbang Sapi Baru</DialogTitle>
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
                  <Label>Tanggal Timbang</Label>
                  <Input 
                    type="date" 
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Berat (Kg)</Label>
                  <Input 
                    type="number"
                    step="0.1" 
                    placeholder="0"
                    value={formData.berat}
                    onChange={(e) => setFormData({...formData, berat: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Input 
                  placeholder="Kondisi sapi saat ditimbang..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Data Timbang'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Timbang</TableHead>
              <TableHead>Sapi</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : beratList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <Scale className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  Belum ada catatan berat badan.
                </TableCell>
              </TableRow>
            ) : (
              beratList.map((item, i) => {
                const prevWeight = i < beratList.length - 1 ? beratList[i + 1].berat : item.sapi?.berat_awal;
                const diff = (prevWeight && item.berat) ? (item.berat - prevWeight) : 0;
                
                return (
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
                    <TableCell className="font-bold text-lg">{item.berat} kg</TableCell>
                    <TableCell>
                      {diff > 0 ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
                          <TrendingUp className="h-3 w-3" /> +{diff.toFixed(1)} kg
                        </Badge>
                      ) : diff < 0 ? (
                        <Badge variant="destructive" className="gap-1">
                          <TrendingDown className="h-3 w-3" /> {diff.toFixed(1)} kg
                        </Badge>
                      ) : (
                        <Badge variant="outline">Stabil</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id, item.sapi_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
