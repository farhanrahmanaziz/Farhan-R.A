import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  BookOpen,
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  created_at?: string;
}

export default function MataPelajaran() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        // Handle table not existing yet by providing defaults if needed, 
        // but for now we expect it to exist or we'll get an error
        throw error;
      }
      setSubjects(data || []);
    } catch (err: any) {
      console.error(err.message);
      // Fallback for demo if table doesn't exist
      setSubjects([
        { id: '1', name: 'Bahasa Indonesia', code: 'BIN' },
        { id: '2', name: 'Matematika', code: 'MAT' },
        { id: '3', name: 'Bahasa Inggris', code: 'BIG' },
        { id: '4', name: 'Pendidikan Agama', code: 'AGM' },
        { id: '5', name: 'Produktif TJK', code: 'TJK-P' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, code };

    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update(data)
          .eq('id', editingSubject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert([data]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchSubjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus mata pelajaran ini?')) return;
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchSubjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setCode(subject.code);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif lowercase tracking-tighter"><span className="capitalize">M</span>ata <span className="capitalize">P</span>elajaran</h1>
          <p className="text-slate-500">Kelola daftar mata pelajaran untuk ujian SMK Prima Unggul.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Mapel
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari mata pelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Kode Mapel</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Mata Pelajaran</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-black bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-tighter">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900 tracking-tight">{subject.name}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(subject)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(subject.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-slate-50 p-6 text-slate-900 flex items-center justify-between border-b border-slate-200">
              <h3 className="text-xl font-bold flex items-center gap-2 font-serif">
                <BookOpen className="w-6 h-6 text-brand-primary" />
                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kode Mapel</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner uppercase"
                  placeholder="Contoh: BIN"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Mata Pelajaran</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  placeholder="Contoh: Bahasa Indonesia"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all border border-slate-200"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Mapel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
