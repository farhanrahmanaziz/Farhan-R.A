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
  ChevronRight,
  ChevronLeft,
  Library,
  CalendarClock,
  BookOpen,
  BarChart3,
  ClipboardList
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      name: 'Mata Pelajaran', 
      path: '/app/subjects', 
      icon: <BookOpen className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Bank Soal', 
      path: '/app/bank-soal', 
      icon: <Library className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Jadwal Ujian', 
      path: '/app/jadwal', 
      icon: <CalendarClock className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Data Peserta', 
      path: '/app/students', 
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Hasil Ujian', 
      path: '/app/rekap', 
      icon: <BarChart3 className="w-5 h-5" />,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Data Guru', 
      path: '/app/absensi-karyawan', 
      icon: <UserCheck className="w-5 h-5" />,
      roles: ['admin']
    },
    { 
      name: 'User Management', 
      path: '/app/users', 
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin']
    },
  ];

  const filteredMenu = profile 
    ? menuItems.filter(item => item.roles.includes(profile.role))
    : menuItems.filter(item => item.roles.includes('guru')); // Fallback to guru menus while loading

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white text-slate-800 transition-all duration-300 ease-in-out flex flex-col z-40 border-r border-slate-200 shadow-sm",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-red-900/10 text-xs text-slate-100">PU</div>
              <span className="font-bold text-lg tracking-tight text-slate-900">SMK Prima Unggul</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center font-bold mx-auto shadow-lg shadow-red-900/10 text-xs text-slate-100">PU</div>
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
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/10" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className={cn("flex-shrink-0", isActive ? "text-white" : "group-hover:text-brand-primary")}>
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

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {isSidebarOpen && (
            <div className="bg-white rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-medium">Logged in as</p>
              <p className="font-bold text-sm truncate text-slate-900">{profile?.full_name}</p>
              <p className="text-xs text-brand-primary font-bold uppercase mt-1 tracking-wider">{profile?.role}</p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-dark">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            {location.pathname !== '/app' && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors flex items-center gap-2 group"
                title="Kembali"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-bold hidden sm:inline">Kembali</span>
              </button>
            )}
            <h2 className={cn(
              "text-xl font-bold text-slate-900",
              location.pathname !== '/app' && "border-l border-slate-200 pl-4"
            )}>
              {filteredMenu.find(m => m.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{profile?.full_name}</span>
              <span className="text-xs text-brand-primary font-bold capitalize">{profile?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white hover:bg-brand-primary hover:text-white text-slate-600 px-4 py-2 rounded-xl font-medium transition-all border border-slate-200 shadow-sm"
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
