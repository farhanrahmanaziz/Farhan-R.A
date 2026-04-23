/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import StudentAttendance from './pages/StudentAttendance';
import Students from './pages/Students';
import UserManagement from './pages/UserManagement';
import Recap from './pages/Recap';
import MataPelajaran from './pages/MataPelajaran';
import BankSoal from './pages/BankSoal';
import JadwalUjian from './pages/JadwalUjian';
import Layout from './components/Layout';
import { Profile } from './types';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App mounting...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session fetched:', !!session);
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    }).catch(err => {
      console.error('Session error:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, maybe it's the first user?
        // In a real app, we'd handle this with a trigger or edge function.
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-brand-dark text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={session ? <Navigate to="/app" /> : <Login />} />
        
        <Route path="/app" element={session ? <Layout profile={profile} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="absensi-karyawan" element={<EmployeeAttendance profile={profile} />} />
          
          {/* CBT Pages */}
          <Route path="subjects" element={<MataPelajaran />} />
          <Route path="bank-soal" element={<BankSoal />} />
          <Route path="jadwal" element={<JadwalUjian />} />
          
          {/* Guru & Admin Only */}
          <Route path="absensi-siswa" element={
            profile?.role === 'guru' || profile?.role === 'admin' 
              ? <StudentAttendance profile={profile} /> 
              : <Navigate to="/app" />
          } />
          
          {/* Admin & Guru Access */}
          <Route path="students" element={
            profile?.role === 'admin' || profile?.role === 'guru'
              ? <Students /> 
              : <Navigate to="/app" />
          } />
          
          {/* Admin Only */}
          <Route path="users" element={
            profile?.role === 'admin' 
              ? <UserManagement /> 
              : <Navigate to="/app" />
          } />
          
          <Route path="rekap" element={<Recap profile={profile} />} />
        </Route>
      </Routes>
    </Router>
  );
}
