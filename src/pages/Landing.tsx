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
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-bright rounded-lg flex items-center justify-center font-bold text-xl px-1 text-gray-200 shadow-lg shadow-brand-bright/20">PU</div>
          <div className="text-xl font-bold tracking-tight text-brand-primary">
            SMK <span className="text-brand-primary">Prima Unggul</span>
          </div>
        </div>
        <Link 
          to="/login" 
          className="bg-brand-primary hover:bg-brand-accent px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
        >
          Login Portal
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-brand-dark overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-accent rounded-full blur-[100px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-brand-primary">Portal Ujian Online</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              CBT SMK Prima Unggul
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sistem Computer Based Test (CBT) yang aman, transparan, dan terintegrasi untuk mendukung proses penilaian hasil belajar siswa secara digital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-accent transition-all group shadow-lg shadow-brand-primary/20"
            >
              Mulai Ujian <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Majors Grid */}
        <div className="relative z-10 mt-24 w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-white mb-10 opacity-60 uppercase tracking-widest">Program Keahlian</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {majors.map((major, idx) => (
              <motion.div 
                key={major.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-brand-secondary/30 hover:border-brand-primary/50 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 bg-brand-primary/20 text-brand-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {major.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{major.id}</h3>
                <p className="text-gray-400 leading-relaxed">{major.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/10 py-10 px-6 text-center text-gray-500">
        <p>&copy; 2024 SMK Prima Unggul. All rights reserved.</p>
      </footer>
    </div>
  );
}
