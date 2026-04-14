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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekap Absensi</h1>
          <p className="text-gray-500">Lihat dan unduh laporan kehadiran harian.</p>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl font-bold border border-gray-200 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Export PDF/Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200/50 rounded-2xl w-fit">
        {profile?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('karyawan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'karyawan' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Absensi Karyawan
          </button>
        )}
        {(profile?.role === 'admin' || profile?.role === 'guru') && (
          <button
            onClick={() => setActiveTab('siswa')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'siswa' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Absensi Siswa
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-600">Pilih Tanggal</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'karyawan' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Waktu</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Karyawan</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900">{format(new Date(a.check_in), 'HH:mm')}</p>
                        <p className="text-xs text-gray-500">{format(new Date(a.check_in), 'd MMM yyyy', { locale: id })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900">{a.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{a.profiles?.role}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          a.status === 'Hadir' ? 'bg-green-100 text-green-700' :
                          a.status === 'Izin' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
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
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Siswa</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Kelas</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900">{format(new Date(a.tanggal), 'd MMM yyyy', { locale: id })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900">{a.students?.nama}</p>
                        <p className="text-xs text-gray-500">NIS: {a.students?.nis}</p>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-600">
                        {a.students?.kelas}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          a.status === 'Hadir' ? 'bg-green-100 text-green-700' :
                          a.status === 'Izin' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'Sakit' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {a.status}
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
