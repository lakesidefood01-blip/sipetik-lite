-- SCHEMA FOR SIPETIK Lite

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sapi (Cattle) Table
CREATE TABLE sapi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  kode_sapi TEXT NOT NULL,
  nama_sapi TEXT,
  jenis_sapi TEXT,
  jenis_kelamin TEXT CHECK (jenis_kelamin IN ('jantan', 'betina')),
  tanggal_beli DATE,
  harga_beli DECIMAL(15, 2),
  berat_awal DECIMAL(10, 2),
  berat_sekarang DECIMAL(10, 2),
  target_berat DECIMAL(10, 2),
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'dijual', 'sakit')),
  foto_url TEXT,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Pakan (Feed) Table
CREATE TABLE pakan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sapi_id UUID REFERENCES sapi ON DELETE CASCADE NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  jenis_pakan TEXT NOT NULL,
  jumlah_kg DECIMAL(10, 2) NOT NULL,
  harga DECIMAL(15, 2) NOT NULL,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Berat Badan (Weight History) Table
CREATE TABLE berat_badan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sapi_id UUID REFERENCES sapi ON DELETE CASCADE NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  berat DECIMAL(10, 2) NOT NULL,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Transaksi Keuangan (Finance) Table
CREATE TABLE transaksi_keuangan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tipe TEXT CHECK (tipe IN ('pemasukan', 'pengeluaran')) NOT NULL,
  kategori TEXT NOT NULL,
  nominal DECIMAL(15, 2) NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  keterangan TEXT,
  sapi_id UUID REFERENCES sapi ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Kesehatan (Health Reminders) Table
CREATE TABLE kesehatan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sapi_id UUID REFERENCES sapi ON DELETE CASCADE NOT NULL,
  jenis TEXT NOT NULL, -- vaksin, vitamin, obat, cek kesehatan
  tanggal DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'selesai')),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sapi
ALTER TABLE sapi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sapi" ON sapi FOR ALL USING (auth.uid() = user_id);

-- Pakan (Link to sapi, filter by sapi owner)
ALTER TABLE pakan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage pakan for their own sapi" ON pakan FOR ALL USING (
  EXISTS (SELECT 1 FROM sapi WHERE sapi.id = pakan.sapi_id AND sapi.user_id = auth.uid())
);

-- Berat Badan
ALTER TABLE berat_badan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage weight for their own sapi" ON berat_badan FOR ALL USING (
  EXISTS (SELECT 1 FROM sapi WHERE sapi.id = berat_badan.sapi_id AND sapi.user_id = auth.uid())
);

-- Transaksi Keuangan
ALTER TABLE transaksi_keuangan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own transactions" ON transaksi_keuangan FOR ALL USING (auth.uid() = user_id);

-- Kesehatan
ALTER TABLE kesehatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage health for their own sapi" ON kesehatan FOR ALL USING (
  EXISTS (SELECT 1 FROM sapi WHERE sapi.id = kesehatan.sapi_id AND sapi.user_id = auth.uid())
);

-- Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sapi_updated_at BEFORE UPDATE ON sapi FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Subscriptions & Billing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_expired_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS mayar_customer_id TEXT;

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  payment_provider TEXT,
  external_payment_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  expired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
