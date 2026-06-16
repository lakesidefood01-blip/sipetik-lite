import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { 
  Beef, 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  Scale, 
  Utensils, 
  Plus, 
  Activity,
  HeartPulse,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, cn } from '@/src/lib/utils';
import { Skeleton } from '@/src/components/ui/skeleton';
import { canExportPdf } from '@/src/lib/subscription';
import UpgradeModal from '@/src/components/UpgradeModal';

export default function Dashboard() {
  const { user, profile } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [stats, setStats] = useState({
    totalSapi: 0,
    totalExpenses: 0,
    totalFeedCostThisMonth: 0,
    avgAdg: 0,
    activeReminders: 0,
    sapiTrend: 0,
    feedTrend: 0
  });

  const [chartsData, setChartsData] = useState<{
    growth: any[];
    feedWeekly: any[];
    healthReminders: any[];
    topPerformers: any[];
  }>({
    growth: [],
    feedWeekly: [],
    healthReminders: [],
    topPerformers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Total Sapi
        const { count: currentSapiCount } = await supabase
          .from('sapi')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // 2. Financial Stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: finances } = await supabase
          .from('transaksi_keuangan')
          .select('jumlah, tipe, kategori, tanggal')
          .eq('user_id', user.id);

        let totalExp = 0;
        let feedMonth = 0;
        finances?.forEach(f => {
          if (f.tipe === 'Pengeluaran') {
            totalExp += f.jumlah;
            if (f.kategori === 'Pakan' && new Date(f.tanggal) >= startOfMonth) {
              feedMonth += f.jumlah;
            }
          }
        });

        // 3. Health Reminders
        const { data: health } = await supabase
          .from('kesehatan')
          .select('*, sapi(nama)')
          .eq('user_id', user.id)
          .eq('status', 'Pending')
          .order('tanggal_rencana', { ascending: true })
          .limit(3);

        const { count: pendingHealthCount } = await supabase
          .from('kesehatan')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'Pending');

        // 4. ADG Calculation & Growth Chart
        const { data: weights } = await supabase
          .from('berat_badan')
          .select('*, sapi(nama, id_sapi)')
          .order('tanggal_timbang', { ascending: true });

        // Group by sapi for ADG
        const sapiWeights: Record<string, any[]> = {};
        weights?.forEach(w => {
          if (!sapiWeights[w.sapi_id]) sapiWeights[w.sapi_id] = [];
          sapiWeights[w.sapi_id].push(w);
        });

        let totalAdg = 0;
        let adgCount = 0;
        const performers: any[] = [];

        Object.keys(sapiWeights).forEach(sId => {
          const wList = sapiWeights[sId];
          if (wList.length >= 2) {
            const first = wList[0];
            const last = wList[wList.length - 1];
            const weightDiff = last.berat - first.berat;
            const daysDiff = (new Date(last.tanggal_timbang).getTime() - new Date(first.tanggal_timbang).getTime()) / (1000 * 3600 * 24);
            
            if (daysDiff > 0) {
                const adg = weightDiff / daysDiff;
                totalAdg += adg;
                adgCount++;
                performers.push({
                  name: last.sapi.nama,
                  id: last.sapi.id_sapi,
                  weight: `+${adg.toFixed(1)}kg`,
                  adgVal: adg
                });
            }
          }
        });

        // Growth Chart Data from weights
        const dailyWeights: Record<string, { total: number, count: number }> = {};
        weights?.forEach(w => {
          const date = new Date(w.tanggal_timbang).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          if (!dailyWeights[date]) dailyWeights[date] = { total: 0, count: 0 };
          dailyWeights[date].total += w.berat;
          dailyWeights[date].count += 1;
        });

        const growthChart = Object.keys(dailyWeights).map(date => ({
          name: date,
          weight: Math.round(dailyWeights[date].total / dailyWeights[date].count)
        })).slice(-7); 

        // Weekly Feed
        const weeklyFeed = finances
          ?.filter(f => f.kategori === 'Pakan')
          .reduce((acc: any[], curr) => {
            const week = Math.ceil(new Date(curr.tanggal).getDate() / 7);
            const weekLabel = `Minggu ${week}`;
            const existing = acc.find(a => a.name === weekLabel);
            if (existing) existing.cost += curr.jumlah;
            else acc.push({ name: weekLabel, cost: curr.jumlah });
            return acc;
          }, []) || [];

        setStats({
          totalSapi: currentSapiCount || 0,
          totalExpenses: totalExp,
          totalFeedCostThisMonth: feedMonth,
          avgAdg: adgCount > 0 ? Number((totalAdg / adgCount).toFixed(2)) : 0,
          activeReminders: pendingHealthCount || 0,
          sapiTrend: 0,
          feedTrend: 0
        });

        setChartsData({
          growth: growthChart,
          feedWeekly: weeklyFeed.sort(),
          healthReminders: health || [],
          topPerformers: performers.sort((a, b) => b.adgVal - a.adgVal).slice(0, 4)
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px]" />
          <Skeleton className="col-span-3 h-[400px]" />
        </div>
      </div>
    );
  }

  const handleExportPdf = () => {
    if (!canExportPdf(profile)) {
      setShowUpgradeModal(true);
      return;
    }
    // Dummy action for export PDF
    alert('Export PDF dimulai...');
  };

  return (
    <div className="space-y-8">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        message="Fitur Ekspor Laporan Eksklusif hanya tersedia untuk paket Pro."
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ringkasan Peternakan</h1>
          <p className="text-muted-foreground">Update terakhir: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
        <Button onClick={handleExportPdf} variant="outline" className="gap-2 shrink-0 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
          <Download className="h-4 w-4" /> Cetak Laporan PDF
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Sapi" 
          value={stats.totalSapi.toString()} 
          icon={Beef} 
          trend="Status populasi aktif"
          color="bg-blue-600"
        />
        <StatCard 
          title="Biaya Pakan (Bln)" 
          value={formatCurrency(stats.totalFeedCostThisMonth)} 
          icon={Utensils} 
          trend="Pengeluaran bulan ini"
          color="bg-emerald-600"
        />
        <StatCard 
          title="Total Pengeluaran" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={Wallet} 
          trend="Total investasi"
          color="bg-orange-600"
        />
        <StatCard 
          title="Rerata ADG" 
          value={`${stats.avgAdg} kg/hari`} 
          icon={TrendingUp} 
          trend="Performa pertumbuhan"
          color="bg-indigo-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-full lg:col-span-4 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tren Pertumbuhan Sapi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData.growth}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="kg" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Side Widget - Health Reminders */}
        <Card className="col-span-full lg:col-span-3 shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-500" />
              Jadwal Kesehatan
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/kesehatan')}>Lihat Semua</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartsData.healthReminders.length > 0 ? (
                chartsData.healthReminders.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/50 transition-all cursor-pointer" onClick={() => navigate('/kesehatan')}>
                    <div className="flex gap-4 items-center">
                      <div className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-full text-white shrink-0",
                        item.kategori === 'Vaksin' ? "bg-rose-500" : item.kategori === 'Vitamin' ? "bg-cyan-500" : "bg-amber-500"
                      )}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{item.tindakan}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.sapi?.nama || 'Unknown Sapi'}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{new Date(item.tanggal_rencana).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{item.kategori}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <HeartPulse className="h-12 w-12 text-muted mx-auto mb-2 opacity-20" />
                  <p className="text-sm text-muted-foreground">Tidak ada jadwal terdekat</p>
                </div>
              )}
            </div>
            <Button className="w-full mt-6 gap-2 rounded-xl" onClick={() => navigate('/kesehatan')}>
              <Plus className="h-4 w-4" /> Tambah Jadwal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-500" />
              Biaya Pakan Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.feedWeekly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 4}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Bar dataKey="cost" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-4 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Performa Pertumbuhan Sapi
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {chartsData.topPerformers.length > 0 ? (
                  chartsData.topPerformers.map((sapi, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {sapi.id.slice(-2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{sapi.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {sapi.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-emerald-600">
                          <TrendingUp className="h-3 w-3" />
                          <p className="text-sm font-bold">{sapi.weight}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">ADG Harian</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Scale className="h-12 w-12 text-muted mx-auto mb-2 opacity-20" />
                    <p className="text-sm text-muted-foreground">Belum ada data timbangan yang cukup</p>
                  </div>
                )}
             </div>
             <Button variant="outline" className="w-full mt-6 rounded-xl" onClick={() => navigate('/sapi')}>
                Lihat Semua Sapi
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: { title: string, value: string, icon: any, trend: string, color: string }) {
  const isDown = trend.toLowerCase().includes('down');
  
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
          </div>
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {isDown ? (
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
          ) : (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          )}
          <span className={isDown ? "text-rose-500 font-semibold" : "text-emerald-500 font-semibold"}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
