import Chatbot from './pages/student/Chatbot';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentResults   from './pages/student/Results';
import StudentCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';

// Teacher pages
import TeacherDashboard   from './pages/teacher/Dashboard';
import TeacherSubmissions from './pages/teacher/Submissions';
import TeacherCourses from './pages/teacher/TeacherCourses';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents  from './pages/admin/Students';
import AdminCourses from './pages/admin/AdminCourses';

function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Student routes */}
          <Route path="/student"             element={<StudentDashboard />} />
          <Route path="/student/courses"     element={<StudentCourses />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/results"     element={<StudentResults />} />
          <Route path="/student/chat" element={<Chatbot />} />

          {/* Teacher routes */}
          <Route path="/teacher"             element={<TeacherDashboard />} />
          <Route path="/teacher/courses"     element={<TeacherCourses />} />
          <Route path="/teacher/submissions" element={<TeacherSubmissions />} />

          {/* Admin routes */}
          <Route path="/admin"               element={<AdminDashboard />} />
          <Route path="/admin/courses"       element={<AdminCourses />} />
          <Route path="/admin/students"      element={<AdminStudents />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={`/${user.role}`} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*"     element={<ProtectedLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
