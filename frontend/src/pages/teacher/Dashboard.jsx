import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(""); // ✅ FIX 1

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      setSelectedCourse(courses[0].course_id);
    }
  }, [courses]); // ✅ FIX 2 (safe default)

  const fetchData = async () => {
    try {
      const courseRes = await axios.get("/api/teachers/1/courses");
      const subRes = await axios.get("/api/teachers/1/submissions");
      setCourses(courseRes.data);
      setSubmissions(subRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.student_count || 0), 0);

  const performanceData = [
    { topic: "Supervised", score: 82 },
    { topic: "Deep Learning", score: 74 },
    { topic: "Model Eval", score: 68 },
  ];

  const getGradeColor = (grade) => {
    if (grade === "A") return "bg-emerald-100 text-emerald-700";
    if (grade === "B") return "bg-blue-100 text-blue-700";
    if (grade === "C") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const statCards = [
    { label: "My Courses", value: courses.length, icon: "📚", color: "from-blue-500 to-blue-600" },
    { label: "Total Students", value: totalStudents, icon: "👩‍🎓", color: "from-violet-500 to-violet-600" },
    { label: "Pending Grading", value: submissions.length, icon: "📝", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Teacher Dashboard</p>
        <h1 className="text-3xl font-bold text-gray-800">Dr. Riya Sharma</h1>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/80 mb-1">{card.label}</p>
                <h2 className="text-4xl font-bold">{card.value}</h2>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CLASS PERFORMANCE CHART */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          
          {/* ✅ FIX 3: Properly closed div */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Class Performance</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-0.5">Topic Scores</h3>
            </div>

            <select
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name || course.title || course.name}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="topic"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: "13px"
                }}
                formatter={(val) => [`${val}%`, "Avg Score"]}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT SUBMISSIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Recent Submissions</p>
            <h3 className="text-lg font-semibold text-gray-800 mt-0.5">Latest Activity</h3>
          </div>

          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <span className="text-4xl mb-2">📭</span>
              <p className="text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 6).map((s, i) => (
                <div
                  key={s.submission_id || i}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                      {s.student_name?.charAt(0) || "S"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{s.student_name}</p>
                      <p className="text-xs text-gray-400">{s.assignment_title}</p>
                    </div>
                  </div>

                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getGradeColor("A")}`}>
                    A
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}