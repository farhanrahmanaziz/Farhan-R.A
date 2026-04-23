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
  Library,
  FileText,
  Clock,
  HelpCircle
} from 'lucide-react';

interface QuestionBank {
  id: string;
  subject_name: string;
  title: string;
  total_questions: number;
  time_limit: number;
  created_at?: string;
}

export default function BankSoal() {
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [timeLimit, setTimeLimit] = useState(90);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('question_banks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanks(data || []);
    } catch (err: any) {
      console.error(err.message);
      // Fallback for demo
      setBanks([
        { id: '1', title: 'Ujian Akhir Semester Ganjil 2024', subject_name: 'Bahasa Indonesia', total_questions: 50, time_limit: 120 },
        { id: '2', title: 'Latihan Ujian Nasional Set 1', subject_name: 'Matematika', total_questions: 40, time_limit: 90 },
        { id: '3', title: 'Kuis Harian 01', subject_name: 'Bahasa Inggris', total_questions: 20, time_limit: 45 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, subject_name: subjectName, total_questions: totalQuestions, time_limit: timeLimit };

    try {
      if (editingBank) {
        const { error } = await supabase
          .from('question_banks')
          .update(data)
          .eq('id', editingBank.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('question_banks')
          .insert([data]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchBanks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket soal ini?')) return;
    try {
      const { error } = await supabase
        .from('question_banks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBanks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (bank: QuestionBank) => {
    setEditingBank(bank);
    setTitle(bank.title);
    setSubjectName(bank.subject_name);
    setTotalQuestions(bank.total_questions);
    setTimeLimit(bank.time_limit);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingBank(null);
    setTitle('');
    setSubjectName('');
    setTotalQuestions(40);
    setTimeLimit(90);
  };

  const filteredBanks = banks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif lowercase tracking-tighter text-balance"><span className="capitalize">B</span>ank <span className="capitalize">S</span>oal</h1>
          <p className="text-slate-500">Kelola paket soal ujian yang tersedia.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          Buat Paket Soal
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari paket soal..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanks.map((bank) => (
            <motion.div 
              key={bank.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-slate-100 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(bank)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(bank.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">{bank.subject_name}</p>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4">{bank.title}</h3>
                
                <div className="flex items-center gap-6 py-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">{bank.total_questions} Soal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">{bank.time_limit} Menit</span>
                  </div>
                </div>

                <button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <Library className="w-4 h-4" />
                  Kelola Soal
                </button>
              </div>
            </motion.div>
          ))}
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
                <Library className="w-6 h-6 text-brand-primary" />
                {editingBank ? 'Edit Paket Soal' : 'Paket Soal Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Judul Paket Soal</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  placeholder="Contoh: Ujian Tengah Semester Ganjil"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mata Pelajaran</label>
                <input 
                  type="text" 
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  placeholder="Nama mata pelajaran"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jumlah Soal</label>
                  <input 
                    type="number" 
                    required
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Waktu (Menit)</label>
                  <input 
                    type="number" 
                    required
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  />
                </div>
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
                  Simpan Paket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
