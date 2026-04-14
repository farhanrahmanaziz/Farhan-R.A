export type UserRole = 'admin' | 'guru' | 'staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  check_in: string;
  status: 'Hadir' | 'Izin' | 'Sakit';
  keterangan?: string;
  profiles?: Profile;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  guru_id: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';
  tanggal: string;
  created_at: string;
  students?: Student;
}
