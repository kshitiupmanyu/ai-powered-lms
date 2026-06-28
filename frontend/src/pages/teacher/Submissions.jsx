import { useEffect, useState } from "react";
import axios from "axios";

export default function Submissions() {
  const [subs, setSubs] = useState([]);
  const [grades, setGrades] = useState({});
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = () => {
    axios
      .get("/api/submissions/1")
      .then((res) => setSubs(res.data))
      .catch((err) => console.log(err));
  };

  const submitGrade = async (id) => {
    try {
      await axios.post("/api/submissions/grade", {
        submission_id: id,
        marks: grades[id],
        remarks: remarks[id],
      });

      alert("Submitted ✅");
      fetchSubs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📥 Student Submissions
      </h1>

      {subs.length === 0 ? (
        <p className="text-gray-500">No submissions yet</p>
      ) : (
        subs.map((s) => (
          <div
            key={s.submission_id}
            className="bg-white p-4 mb-4 rounded shadow border"
          >
            <h2 className="font-semibold">
              {s.assignment_title}
            </h2>

            <p className="text-sm text-gray-600">
              📘 {s.course_name}
            </p>

            <p className="text-sm text-gray-600">
              👨‍🎓 {s.student_name}
            </p>

            <p className="mt-2">
              📝 {s.content}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Submitted on:{" "}
              {new Date(s.submitted_at).toLocaleString()}
            </p>

            {/* GRADING SECTION */}
            <div className="mt-3">
              <input
                type="number"
                placeholder="Marks"
                value={grades[s.submission_id] || ""}
                onChange={(e) =>
                  setGrades({
                    ...grades,
                    [s.submission_id]: e.target.value,
                  })
                }
                className="border p-1 mr-2 w-24 rounded"
              />

              <input
                type="text"
                placeholder="Remarks"
                value={remarks[s.submission_id] || ""}
                onChange={(e) =>
                  setRemarks({
                    ...remarks,
                    [s.submission_id]: e.target.value,
                  })
                }
                className="border p-1 mr-2 rounded"
              />

              <button
                onClick={() => submitGrade(s.submission_id)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Submit
              </button>
            </div>

            {/* SHOW MARKS */}
            {s.marks && (
              <p className="text-green-600 mt-2">
                ✔ Marks: {s.marks} | {s.remarks}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}