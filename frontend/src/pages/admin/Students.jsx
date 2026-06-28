import { useEffect, useState } from 'react';
import { getStudents } from '../../api';
import { Spinner } from '../../components/UI';

const avatarColor = (name) => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-teal-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-pink-400 to-rose-500',
    'from-indigo-400 to-indigo-600',
  ];
  const index = name?.charCodeAt(0) % colors.length || 0;
  return colors[index];
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    getStudents().then(r => setStudents(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = students.filter(s => s.is_active).length;
  const inactiveCount = students.length - activeCount;

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <p className="text-gray-400 text-sm mt-1">{students.length} registered students</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
          <span className="text-2xl">👩‍🎓</span>
          <h2 className="text-4xl font-bold mt-1">{students.length}</h2>
          <p className="text-xs text-white/80 mt-0.5">Total Students</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-md">
          <span className="text-2xl">✅</span>
          <h2 className="text-4xl font-bold mt-1">{activeCount}</h2>
          <p className="text-xs text-white/80 mt-0.5">Active Students</p>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white shadow-md">
          <span className="text-2xl">⏸️</span>
          <h2 className="text-4xl font-bold mt-1">{inactiveCount}</h2>
          <p className="text-xs text-white/80 mt-0.5">Inactive Students</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrolled</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  <span className="text-3xl block mb-2">🔍</span>
                  No students found
                </td>
              </tr>
            ) : filtered.map((s) => (
              <tr key={s.student_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                {/* ID */}
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                  S{String(s.student_id).padStart(3, '0')}
                </td>

                {/* NAME + AVATAR */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(s.full_name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {s.full_name?.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-800">{s.full_name}</span>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-500 text-xs">{s.email}</td>

                {/* GENDER */}
                <td className="px-6 py-4 text-gray-400 text-xs">{s.gender || '—'}</td>

                {/* ENROLLED DATE */}
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {s.enrollment_date ? new Date(s.enrollment_date).toLocaleDateString() : '—'}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}