import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter((c) =>
    c.course_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (isActive) =>
    isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-600";

  const getDeptColor = (dept) => {
    const colors = {
      "Computer Science": "from-blue-500 to-blue-600",
      "Mathematics": "from-violet-500 to-violet-600",
      "Physics": "from-amber-500 to-orange-500",
      "Electronics": "from-teal-500 to-teal-600",
    };
    return colors[dept] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-gray-800">Courses Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {courses.length} total courses on the platform
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm text-white/80 mb-1">Total Courses</p>
          <h2 className="text-4xl font-bold">{courses.length}</h2>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm text-white/80 mb-1">Active Courses</p>
          <h2 className="text-4xl font-bold">
            {courses.filter((c) => c.is_active).length}
          </h2>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm text-white/80 mb-1">Total Enrollments</p>
          <h2 className="text-4xl font-bold">
            {courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0)}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by course name, teacher or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* COURSES TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <p>Loading courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-4xl mb-2">📭</span>
            <p className="text-sm">No courses found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Teacher</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Students</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course, i) => (
                <tr
                  key={course.course_id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  {/* COURSE NAME */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getDeptColor(course.department)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {course.course_name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{course.course_name}</p>
                        <p className="text-xs text-gray-400">ID: {course.course_id}</p>
                      </div>
                    </div>
                  </td>

                  {/* TEACHER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {course.teacher_name?.charAt(0) || "T"}
                      </div>
                      <span className="text-gray-700">{course.teacher_name}</span>
                    </div>
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{course.department || "—"}</span>
                  </td>

                  {/* STUDENTS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-800 font-medium">{course.enrolled_students || 0}</span>
                      <span className="text-gray-400 text-xs">enrolled</span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(course.is_active)}`}>
                      {course.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}