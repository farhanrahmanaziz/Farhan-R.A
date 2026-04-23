import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  CalendarClock,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';

interface ExamSchedule {
  id: string;
  bank_title: string;
  class_name: string;
  start_time: string;
  end_time: string;
  status: 'Draft' | 'Aktif' | 'Selesai';
}

export default function JadwalUjian() {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [bankTitle, setBankTitle] = useState('');
  const [className, setClassName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Aktif' | 'Selesai'>('Draft');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_schedules')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err: any) {
      console.error(err.message);
      // Fallback
      setSchedules([
        { id: '1', bank_title: 'UAS Ganjil Bahasa Indonesia', class_name: 'XII TKJ 1', start_time: new Date().toISOString(), end_time: new Date(Date.now() + 7200000).toISOString(), status: 'Aktif' },
        { id: '2', bank_title: 'Matematika Tryout 01', class_name: 'XII DKV 2', start_time: new Date(Date.now() - 86400000).toISOString(), end_time: new Date(Date.now() - 86400000 + 7200000).toISOString(), status: 'Selesai' },
        { id: '3', bank_title: 'Pancasila Harian', class_name: 'XI AK 1', start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(), status: 'Draft' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { bank_title: bankTitle, class_name: className, start_time: startTime, end_time: endTime, status };

    try {
      if (editingSchedule) {
        const { error } = await supabase
          .from('exam_schedules')
          .update(data)
          .eq('id', editingSchedule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('exam_schedules')
          .insert([data]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchSchedules();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setBankTitle('');
    setClassName('');
    setStartTime('');
    setEndTime('');
    setStatus('Draft');
  };

  const openEditModal = (s: ExamSchedule) => {
    setEditingSchedule(s);
    setBankTitle(s.bank_title);
    setClassName(s.class_name);
    setStartTime(new Date(s.start_time).toISOString().slice(0, 16));
    setEndTime(new Date(s.end_time).toISOString().slice(0, 16));
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const filteredSchedules = schedules.filter(s => 
    s.bank_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif lowercase tracking-tighter"><span className="capitalize">J</span>adwal <span className="capitalize">U</span>jian</h1>
          <p className="text-slate-500">Atur jadwal pelaksanaan ujian untuk setiap kelas.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari jadwal ujian..."
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
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Waktu & Tanggal</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Ujian & Kelas</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Durasi</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{format(new Date(schedule.start_time), 'd MMM yyyy', { locale: id })}</p>
                          <p className="text-xs text-slate-400 font-mono tracking-tighter">{format(new Date(schedule.start_time), 'HH:mm')} - {format(new Date(schedule.end_time), 'HH:mm')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900 tracking-tight">{schedule.bank_title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="w-3 h-3 text-brand-primary" />
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{schedule.class_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm font-bold text-slate-500">
                        {Math.floor((new Date(schedule.end_time).getTime() - new Date(schedule.start_time).getTime()) / 60000)}m
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        schedule.status === 'Aktif' ? 'bg-green-50 text-green-600 border-green-200' :
                        schedule.status === 'Draft' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                        'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(schedule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
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
                <CalendarClock className="w-6 h-6 text-brand-primary" />
                {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Ujian'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paket Soal</label>
                <input 
                  type="text" 
                  required
                  value={bankTitle}
                  onChange={(e) => setBankTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  placeholder="Pilih paket soal..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kelas</label>
                <input 
                  type="text" 
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  placeholder="Contoh: XII TKJ 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mulai</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selesai</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                >
                  <option value="Draft">Draft</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all border border-slate-200">Batal</button>
                <button type="submit" className="flex-1 bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
