import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, EmployeeAttendance as AttendanceType } from '../types';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  profile: Profile | null;
}

export default function EmployeeAttendance({ profile }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'Hadir' | 'Izin' | 'Sakit'>('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [todayAttendance, setTodayAttendance] = useState<AttendanceType | null>(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, [profile]);

  const fetchTodayAttendance = async () => {
    if (!profile) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('attendance_employees')
      .select('*')
      .eq('user_id', profile.id)
      .gte('check_in', `${today}T00:00:00`)
      .lte('check_in', `${today}T23:59:59`)
      .maybeSingle();

    if (data) setTodayAttendance(data);
  };

  const handleAbsen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('attendance_employees')
        .insert([{ 
          user_id: profile.id, 
          status, 
          keterangan,
          check_in: new Date().toISOString()
        }]);

      if (error) throw error;
      
      alert('Absensi berhasil dicatat!');
      fetchTodayAttendance();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Presensi Pengawas</h1>
          <p className="text-gray-400">Silakan lakukan presensi kehadiran Anda sebagai pengawas ujian.</p>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-2xl shadow-sm border border-white/10 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-brand-primary" />
          <span className="font-bold text-gray-200">{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 rounded-3xl p-8 shadow-sm border border-white/10"
        >
          {todayAttendance ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Presensi Berhasil!</h3>
              <p className="text-gray-400 mb-6">Anda telah tercatat sebagai pengawas hari ini pada pukul:</p>
              <div className="bg-white/5 inline-block px-8 py-4 rounded-2xl font-mono text-2xl font-bold text-white border border-white/10">
                {format(new Date(todayAttendance.check_in), 'HH:mm:ss')}
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Status Pengawas:</span>
                  <span className="font-bold text-green-400">{todayAttendance.status}</span>
                </div>
                {todayAttendance.keterangan && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Keterangan:</span>
                    <span className="font-bold text-white">{todayAttendance.keterangan}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAbsen} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Status Kehadiran</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Hadir', 'Izin', 'Sakit'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        status === s 
                          ? 'bg-brand-primary/20 border-brand-primary text-white shadow-lg shadow-brand-primary/10' 
                          : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Keterangan (Opsional)</label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-all min-h-[120px] text-white"
                  placeholder="Contoh: Sedang dinas luar, atau alasan sakit..."
                />
              </div>

              <div className="bg-blue-500/10 p-4 rounded-2xl flex gap-3 text-blue-400 text-sm border border-blue-500/20">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <p>Lokasi Anda akan dicatat secara otomatis untuk keperluan verifikasi.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-accent text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim Presensi Sekarang'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="bg-brand-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark opacity-30 blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-brand-primary" />
              Waktu Real-time
            </h3>
            <div className="text-5xl font-mono font-bold tracking-tighter mb-2">
              {format(new Date(), 'HH:mm')}
            </div>
            <p className="text-gray-300 text-sm">Pastikan Anda melakukan presensi sebelum waktu ujian dimulai.</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 shadow-sm border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Instruksi Pengawas
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Presensi hanya dapat dilakukan saat jadwal ujian aktif.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Laporkan segala bentuk kecurangan melalui kolom keterangan.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Pastikan koneksi internet stabil sebelum memulai ujian.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
