import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, EmployeeAttendance, StudentAttendance } from '../types';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  profile: Profile | null;
}

export default function Recap({ profile }: Props) {
  const [activeTab, setActiveTab] = useState<'karyawan' | 'siswa'>('karyawan');
  const [employeeAttendance, setEmployeeAttendance] = useState<EmployeeAttendance[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'karyawan') fetchEmployeeAttendance();
    else fetchStudentAttendance();
  }, [activeTab]);

  const fetchEmployeeAttendance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*, profiles(*)')
        .order('check_in', { ascending: false });

      if (error) throw error;
      setEmployeeAttendance(data || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance_students')
        .select('*, students(*)')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      setStudentAttendance(data || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employeeAttendance.filter(a => 
    a.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = studentAttendance.filter(a => 
    a.students?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.students?.nis.includes(searchQuery) ||
    a.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Hasil & Rekap Ujian</h1>
          <p className="text-gray-400">Lihat dan unduh laporan hasil pengerjaan ujian siswa.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold border border-white/10 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Export PDF/Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
        {profile?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('karyawan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'karyawan' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Data Pengawas
          </button>
        )}
        {(profile?.role === 'admin' || profile?.role === 'guru') && (
          <button
            onClick={() => setActiveTab('siswa')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'siswa' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Data Peserta
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/5 rounded-3xl p-4 shadow-sm border border-white/10 flex flex-col md:flex-row gap-4 text-white">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all text-white"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-300">Pilih Tanggal</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'karyawan' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy/20 border-b border-white/10 text-gray-400">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Waktu</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Pengawas</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEmployees.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">{format(new Date(a.check_in), 'HH:mm')}</p>
                        <p className="text-xs text-gray-500">{format(new Date(a.check_in), 'd MMM yyyy', { locale: id })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">{a.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{a.profiles?.role}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          a.status === 'Hadir' ? 'bg-green-500/20 border-green-500 text-green-400' :
                          a.status === 'Izin' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                          'bg-orange-500/20 border-orange-500 text-orange-400'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 italic">
                        {a.keterangan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy/20 border-b border-white/10 text-gray-400">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Tanggal</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Peserta</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Kelas</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">{format(new Date(a.tanggal), 'd MMM yyyy', { locale: id })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">{a.students?.nama}</p>
                        <p className="text-xs text-gray-500">NIS: {a.students?.nis}</p>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-400">
                        {a.students?.kelas}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          a.status === 'Hadir' ? 'bg-green-500/20 border-green-500 text-green-400' :
                          a.status === 'Izin' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                          a.status === 'Sakit' ? 'bg-orange-500/20 border-orange-500 text-orange-400' :
                          'bg-red-500/20 border-red-500 text-red-400'
                        }`}>
                          {a.status === 'Hadir' ? 'Selesai' : a.status === 'Alfa' ? 'Belum' : a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
