import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Student } from '../types';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  GraduationCap,
  Filter
} from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [jurusan, setJurusan] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = { nis, nama, kelas, jurusan };

    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', editingStudent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([studentData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchStudents();
      alert('Data siswa berhasil disimpan!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setNis(student.nis);
    setNama(student.nama);
    setKelas(student.kelas);
    setJurusan(student.jurusan);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setNis('');
    setNama('');
    setKelas('');
    setJurusan('');
  };

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.includes(searchQuery) ||
    s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Data Siswa</h1>
          <p className="text-gray-400">Kelola informasi seluruh siswa SMK Prima Unggul.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Siswa
        </button>
      </div>

      <div className="bg-white/5 rounded-3xl p-4 shadow-sm border border-white/10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari berdasarkan nama, NIS, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-300">Filter Jurusan</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-navy/20 border-b border-white/10">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">NIS</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kelas</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Jurusan</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-gray-500">{student.nis}</td>
                    <td className="px-8 py-5 font-bold text-white">{student.nama}</td>
                    <td className="px-8 py-5 text-gray-400">{student.kelas}</td>
                    <td className="px-8 py-5">
                      <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-primary/20">
                        {student.jurusan}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(student)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-dark/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-dark border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-brand-navy/30 p-6 text-white flex items-center justify-between border-b border-white/10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-brand-primary" />
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">NIS</label>
                  <input 
                    type="text" 
                    required
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-primary"
                    placeholder="Contoh: 2122001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kelas</label>
                  <input 
                    type="text" 
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-primary"
                    placeholder="Contoh: XII TKJ 1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="Masukkan nama lengkap siswa"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Jurusan</label>
                <select 
                  required
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="" className="bg-brand-dark">Pilih Jurusan</option>
                  <option value="TKJ" className="bg-brand-dark">TKJ (Teknik Komputer & Jaringan)</option>
                  <option value="DKV" className="bg-brand-dark">DKV (Desain Komunikasi Visual)</option>
                  <option value="AK" className="bg-brand-dark">AK (Akuntansi)</option>
                  <option value="BC" className="bg-brand-dark">BC (Broadcasting)</option>
                  <option value="MPLB" className="bg-brand-dark">MPLB (Manajemen Perkantoran)</option>
                  <option value="BD" className="bg-brand-dark">BD (Bisnis Digital)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Data
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
