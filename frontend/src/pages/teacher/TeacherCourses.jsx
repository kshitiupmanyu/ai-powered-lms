import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // ✅ dynamic teacher

export default function TeacherCourses() {
  const { user } = useAuth(); // ✅ get logged-in teacher

  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(null);

  // ✅ separate form data per course
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`/api/teachers/${user.id}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, [user.id]);

  const createAssignment = async (courseId) => {
    const data = formData[courseId] || {};

    if (!data.title || !data.description || !data.due_date) {
      alert("Please fill all fields ❗");
      return;
    }

    try {
      const res = await axios.post("/api/assignments", {
        course_id: courseId,
        teacher_id: user.id, // ✅ dynamic
        title: data.title,
        description: data.description,
        due_date: data.due_date,
      });

      if (res.data.success) {
        alert("Assignment created ✅");

        setShowForm(null);
        setFormData((prev) => ({
          ...prev,
          [courseId]: { title: "", description: "", due_date: "" },
        }));
      } else {
        alert("Failed ❌");
      }
    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Teacher Courses Page
      </h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.course_id}
            className="bg-white p-5 rounded-lg shadow mb-5 border"
          >
            <h2 className="text-xl font-semibold mb-2">
              {course.course_name}
            </h2>

            <p className="text-sm text-gray-600">
              Code: {course.course_code}
            </p>

            <p className="text-sm text-gray-600">
              Duration: {course.duration_weeks} weeks
            </p>

            <p className="text-sm mb-2">
              Difficulty: {course.difficulty_level}
            </p>

            <div className="text-sm text-gray-700 mb-3">
              👨‍🎓 Students: {course.student_count} <br />
              📝 Assignments: {course.assignment_count} <br />
              ❓ Quizzes: {course.quiz_count}
            </div>

            {/* TOGGLE BUTTON */}
            <button
              onClick={() =>
                setShowForm(
                  showForm === course.course_id
                    ? null
                    : course.course_id
                )
              }
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {showForm === course.course_id
                ? "Cancel"
                : "Create Assignment"}
            </button>

            {/* FORM */}
            {showForm === course.course_id && (
              <div className="mt-4 border p-4 rounded bg-gray-50">

                <input
                  type="text"
                  placeholder="Title"
                  value={formData[course.course_id]?.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [course.course_id]: {
                        ...formData[course.course_id],
                        title: e.target.value,
                      },
                    })
                  }
                  className="border p-2 w-full mb-2 rounded"
                />

                <textarea
                  placeholder="Description"
                  value={formData[course.course_id]?.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [course.course_id]: {
                        ...formData[course.course_id],
                        description: e.target.value,
                      },
                    })
                  }
                  className="border p-2 w-full mb-2 rounded"
                />

                <input
                  type="date"
                  value={formData[course.course_id]?.due_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [course.course_id]: {
                        ...formData[course.course_id],
                        due_date: e.target.value,
                      },
                    })
                  }
                  className="border p-2 w-full mb-3 rounded"
                />

                <button
                  onClick={() =>
                    createAssignment(course.course_id)
                  }
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}