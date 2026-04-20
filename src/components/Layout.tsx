import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Profile } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  profile: Profile | null;
}

export default function Layout({ profile }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/app', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'guru', 'staff']
    },
    { 
      name: 'Presensi Guru', 
      path: '/app/absensi-karyawan', 
      icon: <UserCheck className="w-5 h-5" />,
      roles: ['admin', 'guru', 'staff']
    },
    { 
      name: 'Bank Soal / Ujian', 
      path: '/app/absensi-siswa', 
      icon: <GraduationCap className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Data Siswa', 
      path: '/app/students', 
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      name: 'User Management', 
      path: '/app/users', 
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      name: 'Hasil & Rekap', 
      path: '/app/rekap', 
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-brand-dark text-white transition-all duration-300 ease-in-out flex flex-col z-40 border-r border-white/5",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-brand-secondary/20">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-bright rounded-lg flex items-center justify-center font-bold shadow-lg shadow-brand-bright/20 text-xs text-gray-200">PU</div>
              <span className="font-bold text-lg tracking-tight">SMK Prima Unggul</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-brand-bright rounded-lg flex items-center justify-center font-bold mx-auto shadow-lg shadow-brand-bright/20 text-xs text-gray-200">PU</div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "text-gray-400 hover:bg-brand-secondary/50 hover:text-white"
                )}
              >
                <div className={cn("flex-shrink-0", isActive ? "text-white" : "group-hover:text-white")}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
                {!isSidebarOpen && isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-brand-secondary/10">
          {isSidebarOpen && (
            <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Logged in as</p>
              <p className="font-bold text-sm truncate">{profile?.full_name}</p>
              <p className="text-xs text-brand-primary font-bold uppercase mt-1">{profile?.role}</p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-brand-secondary/50 text-gray-400 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-brand-dark border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {filteredMenu.find(m => m.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-white">{profile?.full_name}</span>
              <span className="text-xs text-brand-primary font-bold capitalize">{profile?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-brand-primary text-white px-4 py-2 rounded-xl font-medium transition-all border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-brand-dark">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
