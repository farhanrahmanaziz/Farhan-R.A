import { Profile } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  TrendingUp,
  Settings,
  FileText,
  Library,
  CalendarClock,
  BookOpen,
  BarChart3,
  ClipboardList
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
      title: 'Total Peserta', 
      value: stats.totalStudents, 
      icon: <Users className="w-6 h-6" />, 
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
      title: 'Jadwal Aktif', 
      value: '3', 
      icon: <CheckCircle2 className="w-6 h-6" />, 
      color: 'bg-green-500',
      roles: ['admin', 'guru', 'staff']
    },
    { 
      title: 'Laporan Masuk', 
      value: '12', 
      icon: <Clock className="w-6 h-6" />, 
      color: 'bg-orange-500',
      roles: ['admin', 'guru']
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Navigation & Quick Actions */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-8 space-y-8 order-2 lg:order-1">
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-800 shadow-sm relative overflow-hidden border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2 font-serif tracking-tighter">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
              Menu Utama
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/app/bank-soal" className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-[2.5rem] border border-slate-200/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-3 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Library className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-center leading-tight">Bank Soal</span>
              </Link>
              <Link to="/app/jadwal" className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-[2.5rem] border border-slate-200/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-3 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-center leading-tight">Jadwal</span>
              </Link>
              <Link to="/app/subjects" className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-[2.5rem] border border-slate-200/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-3 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-center leading-tight">Mapel</span>
              </Link>
              <Link to="/app/rekap" className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 rounded-[2.5rem] border border-slate-200/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-3 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-center leading-tight">Hasil</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 text-slate-800 shadow-sm relative overflow-hidden border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900 font-serif tracking-tighter">Akses Cepat</h3>
            <div className="space-y-4">
              <Link to="/app/students" className="w-full bg-slate-50 hover:bg-slate-100 p-4 rounded-3xl text-left transition-all flex items-center justify-between group border border-slate-200/50">
                <div>
                  <p className="font-bold text-slate-900">Data Peserta</p>
                  <p className="text-xs text-slate-500">Kelola informasi siswa</p>
                </div>
                <Users className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/app/users" className="w-full bg-slate-50 hover:bg-slate-100 p-4 rounded-3xl text-left transition-all flex items-center justify-between group border border-slate-200/50">
                  <div>
                    <p className="font-bold text-slate-900">Manajemen User</p>
                    <p className="text-xs text-slate-500">Atur akun dan hak akses</p>
                  </div>
                  <Settings className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Welcome & Content */}
        <div className="w-full lg:w-2/3 space-y-8 order-1 lg:order-2">
          {/* Welcome Header */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary opacity-20 blur-[100px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent opacity-20 blur-[100px] -ml-40 -mb-40"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3 text-white font-serif tracking-tight">Halo, {profile?.full_name || 'Pengguna'}! 👋</h1>
              <p className="text-slate-400 text-lg">Selamat datang kembali di sistem CBT SMK Prima Unggul.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                  <CalendarIcon className="w-5 h-5 text-brand-primary" />
                  <span className="text-white font-medium">{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  <span className="text-white font-medium">{format(new Date(), 'HH:mm')} WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid moved here for density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.filter(c => !profile || c.roles.includes(profile.role)).map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1 group"
              >
                <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-dark/10 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{card.title}</p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{card.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 font-serif tracking-tighter">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
                Aktivitas Terbaru
              </h3>
              <button className="text-brand-primary text-sm font-black uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="w-14 h-14 bg-brand-primary/5 rounded-[1.25rem] flex items-center justify-center text-brand-primary border border-brand-primary/10 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">Ujian Akhir Semester Ganjil - Produktif TKJ</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Dimulai oleh Guru Budi • 10 menit yang lalu</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] font-black px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 uppercase tracking-widest shadow-sm">Berlangsung</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
