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
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Presensi Pengawas</h1>
          <p className="text-slate-500">Silakan lakukan presensi kehadiran Anda sebagai pengawas ujian.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-brand-primary" />
          <span className="font-bold text-slate-700">{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
        >
          {todayAttendance ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Presensi Berhasil!</h3>
              <p className="text-slate-500 mb-6">Anda telah tercatat sebagai pengawas hari ini pada pukul:</p>
              <div className="bg-slate-50 inline-block px-8 py-4 rounded-2xl font-mono text-2xl font-bold text-slate-900 border border-slate-200 shadow-inner">
                {format(new Date(todayAttendance.check_in), 'HH:mm:ss')}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium">Status Pengawas:</span>
                  <span className="font-bold text-green-600 uppercase tracking-wider">{todayAttendance.status}</span>
                </div>
                {todayAttendance.keterangan && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Keterangan:</span>
                    <span className="font-bold text-slate-700">{todayAttendance.keterangan}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAbsen} className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status Kehadiran</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Hadir', 'Izin', 'Sakit'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        status === s 
                          ? 'bg-brand-primary/5 border-brand-primary text-brand-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Keterangan (Opsional)</label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-brand-primary focus:bg-white transition-all min-h-[120px] text-slate-900 shadow-inner"
                  placeholder="Contoh: Sedang dinas luar, atau alasan sakit..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-700 text-sm border border-blue-200">
                <MapPin className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p className="font-medium">Lokasi Anda akan dicatat secara otomatis untuk keperluan verifikasi.</p>
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
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-20 blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-brand-primary" />
              Waktu Real-time
            </h3>
            <div className="text-5xl font-mono font-bold tracking-tighter mb-2">
              {format(new Date(), 'HH:mm')}
            </div>
            <p className="text-slate-400 text-sm">Pastikan Anda melakukan presensi sebelum waktu ujian dimulai.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 font-serif">
              <AlertCircle className="w-5 h-5 text-brand-primary" />
              Instruksi Pengawas
            </h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="font-medium">Presensi hanya dapat dilakukan saat jadwal ujian aktif.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="font-medium">Laporkan segala bentuk kecurangan melalui kolom keterangan.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="font-medium">Pastikan koneksi internet stabil sebelum memulai ujian.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
