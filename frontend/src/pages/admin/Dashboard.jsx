import { useEffect, useState } from 'react';
import { getAdminStats, getAdminCourses, getAdminActivity } from '../../api';
import { Spinner } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GRADE_COLORS = { A: '#1d9e75', B: '#1a7af0', C: '#ef9f27', D: '#e24b4a', F: '#a32d2d' };

const difficultyVariant = (level) => {
  if (!level) return { bg: 'bg-gray-100', text: 'text-gray-500' };
  const l = level.toLowerCase();
  if (l === 'beginner')     return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (l === 'intermediate') return { bg: 'bg-amber-100',   text: 'text-amber-700' };
  if (l === 'advanced')     return { bg: 'bg-red-100',     text: 'text-red-600' };
  return { bg: 'bg-gray-100', text: 'text-gray-500' };
};

const statusStyle = (status) => {
  if (!status) return 'bg-gray-100 text-gray-500';
  const s = status.toLowerCase();
  if (s === 'active' || s === 'submitted') return 'bg-emerald-100 text-emerald-700';
  if (s === 'late' || s === 'dropped')     return 'bg-red-100 text-red-600';
  if (s === 'checked')                     return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-500';
};

const statCards = (stats) => [
  { label: 'Students',    value: stats.students,    icon: '👩‍🎓', color: 'from-blue-500 to-blue-600' },
  { label: 'Teachers',    value: stats.teachers,    icon: '👨‍🏫', color: 'from-violet-500 to-violet-600' },
  { label: 'Courses',     value: stats.courses,     icon: '📚', color: 'from-teal-500 to-teal-600' },
  { label: 'Enrollments', value: stats.enrollments, icon: '📋', color: 'from-amber-500 to-orange-500' },
  { label: 'Submissions', value: stats.submissions, icon: '📝', color: 'from-pink-500 to-rose-500' },
  { label: 'Quizzes',     value: stats.quizzes,     icon: '🧠', color: 'from-indigo-500 to-indigo-600' },
];

export default function AdminDashboard() {
  const [stats,    setStats]    = useState(null);
  const [courses,  setCourses]  = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminCourses(), getAdminActivity()])
      .then(([s, c, a]) => {
        setStats(s.data);
        setCourses(c.data);
        setActivity(a.data);
      }).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-gray-800">Platform Overview</h1>
        <p className="text-gray-400 text-sm mt-1">ai_learning_platform · All data live from MySQL</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards(stats).map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white shadow-md`}>
            <span className="text-2xl">{card.icon}</span>
            <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
            <p className="text-xs text-white/80 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* GRADE DISTRIBUTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Analytics</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.gradeDistribution} barSize={40} margin={{ left: -20 }}>
              <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }}
                formatter={(v) => [v, 'Students']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stats.gradeDistribution.map((entry) => (
                  <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Live Feed</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3 overflow-y-auto max-h-52">
            {activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <span className="text-3xl mb-2">📭</span>
                <p className="text-sm">No recent activity</p>
              </div>
            ) : activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  a.type === 'submission' ? 'bg-blue-500' : 'bg-teal-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 truncate">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {a.status && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(a.status)}`}>
                    {a.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COURSES TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Catalogue</p>
        <h3 className="text-lg font-semibold text-gray-800 mb-5">All Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 rounded-xl">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider rounded-l-xl">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Teacher</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Students</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider rounded-r-xl">Weeks</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => {
                const diff = difficultyVariant(c.difficulty_level);
                return (
                  <tr key={c.course_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-semibold">{c.course_code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.course_name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{c.course_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.teacher_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${diff.bg} ${diff.text}`}>
                        {c.difficulty_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{c.enrolled_students}</td>
                    <td className="px-4 py-3 text-gray-400">{c.duration_weeks}w</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}