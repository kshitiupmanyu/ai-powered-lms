import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_USERS = [
  { role: 'student', id: 1, name: 'Arjun Kumar',     label: 'Student', sub: 'View your courses & grades',    icon: '👩‍🎓', color: 'from-blue-500 to-blue-600' },
  { role: 'teacher', id: 1, name: 'Dr. Riya Sharma', label: 'Teacher', sub: 'Manage classes & grade work',   icon: '👨‍🏫', color: 'from-violet-500 to-violet-600' },
  { role: 'admin',   id: 0, name: 'Admin',            label: 'Admin',   sub: 'Platform-wide overview',        icon: '⚙️',  color: 'from-teal-500 to-teal-600' },
];

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleLogin = () => {
    if (!selected) return;
    login(selected.role, selected.id, selected.name);
    navigate(`/${selected.role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AI Learning Platform</h1>
          <p className="text-sm text-gray-400 mt-1">ai_learning_platform · DBMS Mini Project</p>
        </div>

        {/* ROLE LABEL */}
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Sign in as</p>

        {/* ROLE CARDS */}
        <div className="flex flex-col gap-3 mb-6">
          {DEMO_USERS.map(u => (
            <button
              key={u.role}
              onClick={() => setSelected(u)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                selected?.role === u.role
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              {/* AVATAR */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                {u.icon}
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{u.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.sub}</p>
              </div>

              {/* SELECTED INDICATOR */}
              {selected?.role === u.role && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleLogin}
          disabled={!selected}
          className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all ${
            selected
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {selected ? `Continue as ${selected.label} →` : 'Select a role to continue'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">Demo — no real auth required</p>
      </div>
    </div>
  );
}