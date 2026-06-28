import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentEnrollments, getStudentAssignments, getStudentProgress } from '../../api';
import { Spinner } from '../../components/UI';

const diffStyle = (level) => {
  if (!level) return 'bg-gray-100 text-gray-500';
  const l = level.toLowerCase();
  if (l === 'beginner')     return 'bg-emerald-100 text-emerald-700';
  if (l === 'intermediate') return 'bg-amber-100 text-amber-700';
  if (l === 'advanced')     return 'bg-red-100 text-red-600';
  return 'bg-gray-100 text-gray-500';
};

const submissionStyle = (status) => {
  if (!status || status === 'Not Submitted' || status === 'Pending') return 'bg-amber-100 text-amber-700';
  if (status === 'Submitted') return 'bg-emerald-100 text-emerald-700';
  if (status === 'Late')      return 'bg-red-100 text-red-600';
  return 'bg-gray-100 text-gray-500';
};

const gradeStyle = (grade) => {
  if (grade === 'A') return 'bg-emerald-100 text-emerald-700';
  if (grade === 'B') return 'bg-blue-100 text-blue-700';
  if (grade === 'C') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-500';
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progress,    setProgress]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentEnrollments(user.id),
      getStudentAssignments(user.id),
      getStudentProgress(user.id),
    ]).then(([e, a, p]) => {
      setEnrollments(e.data);
      setAssignments(a.data);
      setProgress(p.data);
    }).finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <Spinner />;

  const pending   = assignments.filter(a => !a.submission_status || a.submission_status === 'Not Submitted');
  const weakAreas = progress.filter(p => p.weak_area);
  const avgScore  = progress.filter(p => p.score).length
    ? Math.round(progress.reduce((s, p) => s + (p.score || 0), 0) / progress.filter(p => p.score).length)
    : null;

  const statCards = [
    { label: 'Courses Enrolled',    value: enrollments.length,                        icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Assignments',  value: pending.length,                             icon: '📝', color: 'from-amber-500 to-orange-500' },
    { label: 'Topics Completed',     value: progress.filter(p => p.is_completed).length, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Avg Score',            value: avgScore ? `${avgScore}%` : '—',            icon: '🎯', color: 'from-violet-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Student Dashboard</p>
        <h1 className="text-3xl font-bold text-gray-800">Good day, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Here's your learning overview</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-md`}>
            <span className="text-2xl">{card.icon}</span>
            <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
            <p className="text-xs text-white/80 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* MY COURSES */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Enrolled</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">My Courses</h3>
          <div className="space-y-4">
            {enrollments.map(e => {
              const pct = e.total_topics > 0
                ? Math.round((e.completed_topics / e.total_topics) * 100)
                : 0;
              return (
                <div key={e.enrollment_id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{e.course_name}</span>
                      <span className="text-xs text-gray-400 ml-2">{e.course_code}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${diffStyle(e.difficulty_level)}`}>
                      {e.difficulty_level}
                    </span>
                  </div>
                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{pct}% complete · {e.teacher_name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI TUTOR SUGGESTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Personalized</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">AI Tutor Suggestions</h3>
          {weakAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <span className="text-3xl mb-2">🎉</span>
              <p className="text-sm">No weak areas identified yet. Keep going!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weakAreas.slice(0, 3).map(p => (
                <div key={p.progress_id} className="border-l-4 border-teal-400 pl-4 py-1 bg-teal-50 rounded-r-xl">
                  <p className="text-xs font-semibold text-teal-700">{p.course_code} · {p.topic_name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Weak area: {p.weak_area}</p>
                  {p.ai_suggestion && (
                    <p className="text-xs text-gray-400 mt-1 italic">{p.ai_suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ASSIGNMENTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Tasks</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Assignments</h3>
          <div className="space-y-1">
            {assignments.slice(0, 5).map(a => (
              <div key={a.assignment_id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.course_code} · Due {new Date(a.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.grade && (
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${gradeStyle(a.grade)}`}>
                      {a.grade}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${submissionStyle(a.submission_status)}`}>
                    {a.submission_status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT TOPIC ACTIVITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Progress</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Recent Topic Activity</h3>
          <div className="space-y-1">
            {progress.slice(0, 5).map(p => (
              <div key={p.progress_id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.topic_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.course_name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.score != null && (
                    <span className="text-xs font-semibold text-gray-600">{p.score}%</span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.is_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.is_completed ? 'Done' : 'In progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}