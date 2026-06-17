import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Save } from 'lucide-react';

export default function SapiForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_sapi: '',
    nama_sapi: '',
    jenis_sapi: 'Lokal',
    jenis_kelamin: 'jantan',
    tanggal_beli: '',
    harga_beli: '',
    berat_awal: '',
    target_berat: '',
    status: 'aktif',
    catatan: ''
  });

  useEffect(() => {
    if (isEdit && user) {
      const fetchSapi = async () => {
        const { data, error } = await supabase
          .from('sapi')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          toast.error('Gagal mengambil data sapi.');
          navigate('/sapi');
        } else if (data) {
          setFormData({
            kode_sapi: data.kode_sapi,
            nama_sapi: data.nama_sapi || '',
            jenis_sapi: data.jenis_sapi || 'Lokal',
            jenis_kelamin: data.jenis_kelamin || 'jantan',
            tanggal_beli: data.tanggal_beli || '',
            harga_beli: data.harga_beli?.toString() || '',
            berat_awal: data.berat_awal?.toString() || '',
            target_berat: data.target_berat?.toString() || '',
            status: data.status,
            catatan: data.catatan || ''
          });
        }
      };
      fetchSapi();
    }
  }, [id, isEdit, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        user_id: user.id,
        harga_beli: formData.harga_beli ? parseFloat(formData.harga_beli) : null,
        berat_awal: formData.berat_awal ? parseFloat(formData.berat_awal) : null,
        target_berat: formData.target_berat ? parseFloat(formData.target_berat) : null,
        berat_sekarang: isEdit ? undefined : (formData.berat_awal ? parseFloat(formData.berat_awal) : null)
      };

      let error;
      if (isEdit) {
        ({ error } = await supabase.from('sapi').update(payload).eq('id', id));
      } else {
        ({ error } = await supabase.from('sapi').insert([payload]));
      }

      if (error) throw error;

      toast.success(isEdit ? 'Data sapi berhasil diperbarui.' : 'Sapi baru berhasil ditambahkan.');
      navigate('/sapi');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/sapi')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Ubah Data Sapi' : 'Tambah Sapi Baru'}</h1>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kode_sapi">Kode Sapi <span className="text-red-500">*</span></Label>
                <Input 
                  id="kode_sapi" 
                  placeholder="Contoh: S-001" 
                  required 
                  value={formData.kode_sapi}
                  onChange={(e) => setFormData({...formData, kode_sapi: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama_sapi">Nama Sapi</Label>
                <Input 
                  id="nama_sapi" 
                  placeholder="Contoh: Si Putih" 
                  value={formData.nama_sapi}
                  onChange={(e) => setFormData({...formData, nama_sapi: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jenis_sapi">Jenis Sapi</Label>
                <Select 
                  value={formData.jenis_sapi} 
                  onValueChange={(v) => setFormData({...formData, jenis_sapi: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simmental">Simmental</SelectItem>
                    <SelectItem value="Limousin">Limousin</SelectItem>
                    <SelectItem value="Brahma">Brahma</SelectItem>
                    <SelectItem value="Bali">Bali</SelectItem>
                    <SelectItem value="Lokal">Lokal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                <Select 
                  value={formData.jenis_kelamin} 
                  onValueChange={(v) => setFormData({...formData, jenis_kelamin: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jantan">Jantan</SelectItem>
                    <SelectItem value="betina">Betina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tanggal_beli">Tanggal Beli</Label>
                <Input 
                  id="tanggal_beli" 
                  type="date" 
                  value={formData.tanggal_beli}
                  onChange={(e) => setFormData({...formData, tanggal_beli: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga_beli">Harga Beli (Rp)</Label>
                <Input 
                  id="harga_beli" 
                  type="number" 
                  placeholder="0"
                  value={formData.harga_beli}
                  onChange={(e) => setFormData({...formData, harga_beli: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="berat_awal">Berat Awal (Kg)</Label>
                <Input 
                  id="berat_awal" 
                  type="number" 
                  step="0.1" 
                  placeholder="0"
                  value={formData.berat_awal}
                  onChange={(e) => setFormData({...formData, berat_awal: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_berat">Target Berat (Kg)</Label>
                <Input 
                  id="target_berat" 
                  type="number" 
                  step="0.1" 
                  placeholder="0"
                  value={formData.target_berat}
                  onChange={(e) => setFormData({...formData, target_berat: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({...formData, status: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="dijual">Terjual</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Input 
                id="catatan" 
                placeholder="Catatan tambahan..." 
                value={formData.catatan}
                onChange={(e) => setFormData({...formData, catatan: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/sapi')}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEdit ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
