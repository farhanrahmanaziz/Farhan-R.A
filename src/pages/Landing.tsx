import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Monitor, Camera, Calculator, Briefcase, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Landing() {
  const majors = [
    { id: 'TKJ', name: 'Teknik Komputer & Jaringan', icon: <Monitor className="w-6 h-6" /> },
    { id: 'DKV', name: 'Desain Komunikasi Visual', icon: <Camera className="w-6 h-6" /> },
    { id: 'AK', name: 'Akuntansi', icon: <Calculator className="w-6 h-6" /> },
    { id: 'BC', name: 'Broadcasting', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'MPLB', name: 'Manajemen Perkantoran & Layanan Bisnis', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'BD', name: 'Bisnis Digital', icon: <ShoppingBag className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-primary selection:text-white bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center font-bold text-xl px-1 text-slate-100 shadow-lg shadow-red-900/10">PU</div>
          <div className="text-xl font-bold tracking-tight text-brand-primary">
            SMK <span className="text-slate-900">Prima Unggul</span>
          </div>
        </div>
        <Link 
          to="/login" 
          className="bg-brand-primary hover:bg-brand-accent text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md shadow-brand-primary/10"
        >
          Login Portal
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-white overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-serif">
            <span className="text-brand-primary">Portal Ujian Online</span> <br />
            <span className="text-slate-900">
              CBT SMK Prima Unggul
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sistem Computer Based Test (CBT) yang aman, transparan, dan terintegrasi untuk mendukung proses penilaian hasil belajar siswa secara digital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-accent transition-all group shadow-xl shadow-brand-primary/20"
            >
              Mulai Ujian <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* CBT Hero Image / Mockup Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 relative px-4"
        >
          <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 p-8 text-left">
              <div className="inline-flex items-center gap-2 bg-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-brand-primary/10">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                Sistem Terpadu
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">Pengalaman Ujian yang Luar Biasa.</h3>
              <p className="text-slate-400 leading-relaxed mb-8">Ujian aman dengan sistem monitoring real-time, bank soal terpusat, dan penilaian otomatis yang akurat.</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">100%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital</span>
                </div>
                <div className="w-px h-10 bg-slate-800 mx-2"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">Anti</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cheating</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-slate-800 rounded-3xl h-64 md:h-80 overflow-hidden relative border border-slate-700 shadow-inner group-hover:border-brand-primary/50 transition-colors">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#7f1d1d_0%,transparent_100%)] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              {/* Abstract UI representation */}
              <div className="p-6 space-y-4">
                <div className="w-2/3 h-4 bg-slate-700 rounded-full"></div>
                <div className="w-full h-24 bg-slate-700/50 rounded-2xl border border-slate-600/50"></div>
                <div className="grid grid-cols-4 gap-3">
                   {[1,2,3,4].map(btn => <div key={btn} className="h-10 bg-slate-700 rounded-lg"></div>)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Majors Grid */}
        <div className="relative z-10 mt-24 w-full max-w-6xl">
          <h2 className="text-sm font-bold text-slate-400 mb-10 uppercase tracking-[0.2em] font-sans">Program Keahlian</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {majors.map((major, idx) => (
              <motion.div 
                key={major.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 bg-white text-brand-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {major.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{major.id}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{major.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6 text-center text-slate-400">
        <p className="text-sm tracking-tight">&copy; 2024 SMK Prima Unggul. All rights reserved.</p>
      </footer>
    </div>
  );
}
