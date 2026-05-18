export type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export type SapiStatus = 'aktif' | 'dijual' | 'sakit';
export type JenisKelamin = 'jantan' | 'betina';

export type Sapi = {
  id: string;
  user_id: string;
  kode_sapi: string;
  nama_sapi: string | null;
  jenis_sapi: string | null;
  jenis_kelamin: JenisKelamin | null;
  tanggal_beli: string | null;
  harga_beli: number | null;
  berat_awal: number | null;
  berat_sekarang: number | null;
  target_berat: number | null;
  status: SapiStatus;
  foto_url: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
};

export type Pakan = {
  id: string;
  sapi_id: string;
  tanggal: string;
  jenis_pakan: string;
  jumlah_kg: number;
  harga: number;
  catatan: string | null;
  created_at: string;
};

export type BeratBadan = {
  id: string;
  sapi_id: string;
  tanggal: string;
  berat: number;
  catatan: string | null;
  created_at: string;
};

export type TipeTransaksi = 'pemasukan' | 'pengeluaran';

export type TransaksiKeuangan = {
  id: string;
  user_id: string;
  tipe: TipeTransaksi;
  kategori: string;
  nominal: number;
  tanggal: string;
  keterangan: string | null;
  sapi_id: string | null;
  created_at: string;
};

export type StatusKesehatan = 'pending' | 'selesai';

export type Kesehatan = {
  id: string;
  sapi_id: string;
  jenis: string;
  tanggal: string;
  status: StatusKesehatan;
  catatan: string | null;
  created_at: string;
};
