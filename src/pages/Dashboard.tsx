import { Profile } from '../types';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  TrendingUp,
  Settings,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  profile: Profile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    todayAttendance: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // In a real app, these would be real queries
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: employeeCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    
    setStats({
      totalStudents: studentCount || 0,
      totalEmployees: employeeCount || 0,
      todayAttendance: 85, // Mock
      pendingTasks: 3
    });
  };

  const cards = [
    { 
      title: 'Total Siswa', 
      value: stats.totalStudents, 
      icon: <GraduationCap className="w-6 h-6" />, 
      color: 'bg-blue-500',
      roles: ['admin', 'guru']
    },
    { 
      title: 'Bank Soal', 
      value: '42', 
      icon: <FileText className="w-6 h-6" />, 
      color: 'bg-purple-500',
      roles: ['admin', 'guru']
    },
    { 
      title: 'Ujian Aktif', 
      value: '3', 
      icon: <CheckCircle2 className="w-6 h-6" />, 
      color: 'bg-green-500',
      roles: ['admin', 'guru', 'staff']
    },
    { 
      title: 'Hasil Menunggu', 
      value: '12', 
      icon: <Clock className="w-6 h-6" />, 
      color: 'bg-orange-500',
      roles: ['admin', 'guru']
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-20 blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary opacity-20 blur-[80px] -ml-32 -mb-32"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Halo, {profile?.full_name}! 👋</h1>
          <p className="text-gray-400">Selamat datang kembali di sistem CBT SMK Prima Unggul.</p>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
              <CalendarIcon className="w-4 h-4 text-brand-primary" />
              <span>{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>{format(new Date(), 'HH:mm')} WIB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.filter(c => profile && c.roles.includes(profile.role)).map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 p-6 rounded-3xl shadow-sm border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
          >
            <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${card.color.split('-')[1]}-200`}>
              {card.icon}
            </div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{card.title}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 rounded-3xl p-8 shadow-sm border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              Aktivitas Terbaru
            </h3>
            <button className="text-brand-primary text-sm font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-10 h-10 bg-brand-secondary/20 rounded-full flex items-center justify-center text-brand-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Ujian Akhir Semester Ganjil - Produktif TKJ</p>
                  <p className="text-xs text-gray-400">Dimulai oleh Guru Budi • 10 menit yang lalu</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/20">Sedang Berlangsung</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark opacity-30 blur-3xl"></div>
          <h3 className="text-xl font-bold mb-6">Akses Cepat</h3>
          <div className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-left transition-all flex items-center justify-between group border border-white/5">
              <div>
                <p className="font-bold">Presensi Pengawas</p>
                <p className="text-xs text-gray-300">Lakukan presensi kehadiran pengawas</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
            </button>
            {profile?.role !== 'staff' && (
              <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-left transition-all flex items-center justify-between group border border-white/5">
                <div>
                  <p className="font-bold">Mulai Ujian</p>
                  <p className="text-xs text-gray-300">Aktifkan soal ujian untuk siswa</p>
                </div>
                <GraduationCap className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              </button>
            )}
            {profile?.role === 'admin' && (
              <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-left transition-all flex items-center justify-between group border border-white/5">
                <div>
                  <p className="font-bold">Kelola User</p>
                  <p className="text-xs text-gray-300">Tambah/edit akun</p>
                </div>
                <Settings className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
