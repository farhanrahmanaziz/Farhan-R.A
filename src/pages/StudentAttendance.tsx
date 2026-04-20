import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, Student, StudentAttendance as AttendanceType } from '../types';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  profile: Profile | null;
}

export default function StudentAttendance({ profile }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alfa'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('nama', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
      
      // Extract unique classes
      const uniqueClasses = Array.from(new Set((data || []).map(s => s.kelas)));
      setClasses(uniqueClasses);
      if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);

      // Initialize attendance state
      const initialAttendance: Record<string, any> = {};
      data?.forEach(s => {
        initialAttendance[s.id] = 'Hadir';
      });
      setAttendance(initialAttendance);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: any) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const attendanceData = Object.entries(attendance)
        .filter(([studentId]) => {
          const student = students.find(s => s.id === studentId);
          return student && student.kelas === selectedClass;
        })
        .map(([studentId, status]) => ({
          student_id: studentId,
          guru_id: profile.id,
          status,
          tanggal: new Date().toISOString().split('T')[0]
        }));

      const { error } = await supabase
        .from('attendance_students')
        .insert(attendanceData);

      if (error) throw error;
      alert('Absensi siswa berhasil disimpan!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => s.kelas === selectedClass);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bank Soal & Pengaturan Ujian</h1>
          <p className="text-gray-400">Kelola daftar soal dan jadwal ujian untuk setiap kelas.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl shadow-sm border border-white/10 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-200 pr-8"
            >
              {classes.map(c => (
                <option key={c} value={c} className="bg-brand-dark">{c}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || filteredStudents.length === 0}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Memproses...' : 'Aktifkan Ujian'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white/5 rounded-3xl p-20 text-center border border-dashed border-white/10">
          <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Tidak ada data siswa</h3>
          <p className="text-gray-400">Silakan pilih kelas lain atau hubungi Admin.</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-secondary/20 border-b border-white/10">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">NIS</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Peserta</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-gray-500">{student.nis}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-white">{student.nama}</p>
                      <p className="text-xs text-gray-500">{student.jurusan}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        {(['Hadir', 'Izin', 'Sakit', 'Alfa'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(student.id, s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              attendance[student.id] === s
                                ? s === 'Hadir' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                  s === 'Izin' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                                  s === 'Sakit' ? 'bg-orange-500/20 border-orange-500 text-orange-400' :
                                  'bg-red-500/20 border-red-500 text-red-400'
                                : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-brand-secondary rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark opacity-30 blur-3xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold">Informasi Ujian</p>
            <p className="text-sm text-gray-300">{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</p>
          </div>
        </div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="text-center">
            <p className="text-2xl font-bold">{filteredStudents.length}</p>
            <p className="text-xs text-gray-300 uppercase tracking-widest">Peserta</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {Object.values(attendance).filter(v => v === 'Hadir').length}
            </p>
            <p className="text-xs text-gray-300 uppercase tracking-widest">Selesai</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {Object.values(attendance).filter(v => v === 'Alfa').length}
            </p>
            <p className="text-xs text-gray-300 uppercase tracking-widest">Belum Mengerjakan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
