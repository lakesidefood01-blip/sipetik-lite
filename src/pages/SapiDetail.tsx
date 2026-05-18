import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Sapi, BeratBadan, Pakan, Kesehatan } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { 
  ChevronLeft, 
  Edit, 
  Calendar, 
  Beef, 
  TrendingUp, 
  History, 
  Utensils, 
  Stethoscope,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { formatCurrency } from '@/src/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

export default function SapiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sapi, setSapi] = useState<Sapi | null>(null);
  const [beratHist, setBeratHist] = useState<BeratBadan[]>([]);
  const [pakanHist, setPakanHist] = useState<Pakan[]>([]);
  const [kesehatanHist, setKesehatanHist] = useState<Kesehatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Sapi
        const { data: sapiData, error: sapiError } = await supabase
          .from('sapi')
          .select('*')
          .eq('id', id)
          .single();
        if (sapiError) throw sapiError;
        setSapi(sapiData);

        // Fetch Histories
        const [beratRes, pakanRes, kesehatanRes] = await Promise.all([
          supabase.from('berat_badan').select('*').eq('sapi_id', id).order('tanggal', { ascending: true }),
          supabase.from('pakan').select('*').eq('sapi_id', id).order('tanggal', { ascending: false }).limit(10),
          supabase.from('kesehatan').select('*').eq('sapi_id', id).order('tanggal', { ascending: false })
        ]);

        setBeratHist(beratRes.data || []);
        setPakanHist(pakanRes.data || []);
        setKesehatanHist(kesehatanRes.data || []);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!sapi) return <div>Data tidak ditemukan.</div>;

  const currentWeight = beratHist.length > 0 ? beratHist[beratHist.length - 1].berat : (sapi.berat_awal || 0);
  const weightGain = currentWeight - (sapi.berat_awal || 0);
  const profitEst = (currentWeight * 55000) - (sapi.harga_beli || 0) - (pakanHist.reduce((acc, curr) => acc + curr.harga, 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sapi')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Detail Sapi #{sapi.kode_sapi}</h1>
        </div>
        <Button onClick={() => navigate(`/sapi/edit/${sapi.id}`)} variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-sm border-none">
          <CardHeader className="p-0 overflow-hidden rounded-t-xl h-48 bg-muted flex items-center justify-center">
            {sapi.foto_url ? (
              <img src={sapi.foto_url} alt={sapi.nama_sapi || ""} className="h-full w-full object-cover" />
            ) : (
              <Beef className="h-24 w-24 text-muted-foreground/20" />
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{sapi.nama_sapi || 'Tanpa Nama'}</h2>
                <p className="text-sm text-muted-foreground">{sapi.jenis_sapi} - {sapi.jenis_kelamin}</p>
              </div>
              <Badge variant={sapi.status === 'aktif' ? 'default' : 'secondary'} className="capitalize">{sapi.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Tgl Beli</p>
                <p className="text-sm flex items-center gap-1 mt-1 font-medium">
                  <Calendar className="h-3 w-3" /> {sapi.tanggal_beli || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Harga Beli</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(sapi.harga_beli || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Berat Awal</p>
                <p className="text-sm font-medium mt-1">{sapi.berat_awal} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Berat Saat Ini</p>
                <p className="text-sm font-bold text-primary mt-1">{currentWeight} kg</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kenaikan Berat:</span>
                <span className="font-bold text-green-600">+{weightGain.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Estimasi Profit:</span>
                <span className="font-bold text-primary">{formatCurrency(profitEst)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white p-1 border shadow-sm">
              <TabsTrigger value="growth" className="rounded-lg">Pertumbuhan</TabsTrigger>
              <TabsTrigger value="feed" className="rounded-lg">Pakan</TabsTrigger>
              <TabsTrigger value="health" className="rounded-lg">Kesehatan</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-lg">Catatan</TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Grafik Berat Badan
                  </CardTitle>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="h-3 w-3" /> Timbang
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={beratHist.map(b => ({ date: b.tanggal, weight: b.berat }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feed" className="mt-4">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <Utensils className="h-5 w-5 text-primary" />
                    Riwayat Pakan
                  </CardTitle>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="h-3 w-3" /> Tambah Pakan
                  </Button>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      {pakanHist.length === 0 ? <p className="text-center text-muted-foreground py-8">Belum ada riwayat pakan.</p> : pakanHist.map(p => (
                        <div key={p.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                           <div>
                              <p className="font-medium">{p.jenis_pakan}</p>
                              <p className="text-xs text-muted-foreground">{p.tanggal} • {p.jumlah_kg} kg</p>
                           </div>
                           <p className="font-bold">{formatCurrency(p.harga)}</p>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="mt-4">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <Stethoscope className="h-5 w-5 text-red-500" />
                    Riwayat Kesehatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kesehatanHist.map(k => (
                      <div key={k.id} className="flex justify-between items-center p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                           <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white text-xs", k.status === 'selesai' ? 'bg-green-500' : 'bg-red-400')}>
                              <HeartPulse className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="font-medium text-sm">{k.jenis}</p>
                              <p className="text-xs text-muted-foreground">{k.tanggal}</p>
                           </div>
                        </div>
                        <Badge variant={k.status === 'selesai' ? 'default' : 'outline'}>{k.status}</Badge>
                      </div>
                    ))}
                    {kesehatanHist.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada riwayat kesehatan.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Catatan Khusus</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 italic">
                      {sapi.catatan || 'Tidak ada catatan khusus untuk sapi ini.'}
                   </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/src/lib/utils';
import { HeartPulse } from 'lucide-react';
