import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart2,
  Users,
  FileText,
  LogOut,
  Brain
} from "lucide-react";

const studentLinks = [
  { to: '/student',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/courses',     icon: BookOpen,         label: 'My Courses' },
  { to: '/student/assignments', icon: ClipboardList,    label: 'Assignments' },
  { to: '/student/results',     icon: BarChart2,        label: 'Results' },
  { to: '/student/chat',        icon: Brain,            label: 'AI Assistant' },
];

const teacherLinks = [
  { to: '/teacher',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/courses',     icon: BookOpen,         label: 'My Courses' },
  { to: '/teacher/submissions', icon: FileText,         label: 'Submissions' },
];

const adminLinks = [
  { to: '/admin',               icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/courses',       icon: BookOpen,         label: 'Courses' },
  { to: '/admin/students',      icon: Users,            label: 'Students' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const links =
    user?.role === 'student'
      ? studentLinks
      : user?.role === 'teacher'
      ? teacherLinks
      : adminLinks;

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-100 bg-white px-4 py-6">
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <Brain size={16} color="white" />
        </div>
        <span className="font-medium text-gray-900 text-sm">LearnAI</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5 mb-6">
        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-800">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
          <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
               ${
                 isActive
                   ? 'bg-brand-50 text-brand-700 font-medium'
                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
               }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mt-2"
      >
        <LogOut size={14} />
        Sign out
      </button>
    </aside>
  );
}