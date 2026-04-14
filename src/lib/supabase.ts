import { createClient } from '@supabase/supabase-js';

// Fungsi untuk mengambil config dari environment
const getSupabaseConfig = () => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  return { url, key };
};

// Menggunakan Proxy untuk inisialisasi malas (lazy initialization).
// Ini mencegah aplikasi crash saat startup jika variabel lingkungan belum diatur.
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const { url, key } = getSupabaseConfig();
    
    if (!url || !key) {
      // Memberikan pesan error yang informatif jika config belum diisi
      console.error("Konfigurasi Supabase tidak ditemukan. Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di panel Secrets.");
      
      // Mengembalikan objek dummy agar tidak langsung crash pada akses properti pertama,
      // namun akan tetap error saat fungsi dipanggil.
      return () => {
        throw new Error("Supabase URL dan Anon Key diperlukan. Periksa pengaturan environment variables Anda.");
      };
    }

    // Inisialisasi client hanya sekali (singleton)
    if (!target._instance) {
      target._instance = createClient(url, key);
    }
    
    return target._instance[prop];
  }
});
