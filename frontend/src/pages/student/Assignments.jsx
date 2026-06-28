import { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);

  // ✅ NEW STATE
  const [text, setText] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/assignments/1");
      setAssignments(res.data);
    } catch (err) {
      console.log("ERROR FETCHING ASSIGNMENTS:", err);
    }
  };

  // ✅ NEW FUNCTION
  const submitAssignment = async (assignmentId) => {
    try {
      const res = await axios.post("/api/submissions", {
        assignment_id: assignmentId,
        student_id: 1,
        content: text[assignmentId]
      });

      if (res.data.success) {
        alert("Submitted ✅");
        setText({ ...text, [assignmentId]: "" });
      } else {
        alert("Failed ❌");
      }
    } catch (err) {
      console.log(err);
      alert("Error submitting");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📚 My Assignments
      </h1>

      {assignments.length === 0 ? (
        <p className="text-gray-500">
          No assignments available
        </p>
      ) : (
        assignments.map((a) => (   // ✅ FIXED (removed extra {})
          <div
            key={a.assignment_id}
            className="bg-white p-5 rounded-lg shadow mb-5 border"
          >
            <h2 className="text-lg font-semibold">{a.title}</h2>

            <p className="text-sm text-gray-600">
              📘 Course: {a.course_name}
            </p>

            <p className="text-sm text-gray-700 mb-2">
              {a.description}
            </p>

            <p className="text-sm text-red-500 mb-3">
              ⏳ Due: {new Date(a.due_date).toLocaleDateString()}
            </p>

            {/* TEXTAREA */}
            <textarea
              placeholder="Write your answer..."
              value={text[a.assignment_id] || ""}
              onChange={(e) =>
                setText({
                  ...text,
                  [a.assignment_id]: e.target.value
                })
              }
              className="border p-2 w-full mb-2 rounded"
            />

            {/* BUTTON */}
            <button
              onClick={() => submitAssignment(a.assignment_id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Submit
            </button>
          </div>
        ))
      )}
    </div>
  );
}