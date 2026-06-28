import { useEffect, useState } from "react";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [difficulty, setDifficulty] = useState("easy");

  const [weakTopics, setWeakTopics] = useState([]);
  const [studyPlan, setStudyPlan] = useState("");

  // ================= COURSES =================

  const fetchMyCourses = () => {
    axios.get("/api/students/1/enrollments")
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  };

  const fetchAllCourses = () => {
    axios.get("/api/courses")
      .then(res => setAllCourses(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMyCourses();
    fetchAllCourses();
  }, []);

  const enrollCourse = async (courseId) => {
    try {
      const res = await axios.post("/api/courses/enroll", {
        student_id: 1,
        course_id: courseId
      });

      if (res.data.success) {
        fetchMyCourses();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= QUIZ =================

  const generateQuiz = async () => {
    const res = await axios.get(
      `/api/quiz/generate/DBMS?difficulty=${difficulty}`
    );

    setQuiz(Array.isArray(res.data.quiz) ? res.data.quiz : []);
    setAnswers({});
    setSubmitted(false);
    setWeakTopics([]);
    setStudyPlan("");
  };

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const submitQuiz = async () => {
    setSubmitted(true);

    const weak = quiz
      .map((q, i) => ({
        question: q.question,
        correct: answers[i] === q.answerIndex,
      }))
      .filter(q => !q.correct)
      .map(q => {
        const text = q.question.toLowerCase();
        if (text.includes("normalization")) return "Normalization";
        if (text.includes("sql")) return "SQL";
        if (text.includes("index")) return "Indexing";
        if (text.includes("dbms")) return "DBMS basics";
        return "General DBMS";
      });

    const uniqueWeak = [...new Set(weak)];
    setWeakTopics(uniqueWeak);

    try {
      await axios.post("/api/quiz/weak", { weakTopics: weak });
    } catch (err) {
      console.log(err);
    }
  };

  const score = quiz.reduce((acc, q, i) => {
    return acc + (answers[i] === q.answerIndex ? 1 : 0);
  }, 0);

  // ================= UI =================

  return (
    <div className="p-6">

      {/* ===== MY COURSES ===== */}
      <h1 className="text-xl font-bold mb-4">My Courses</h1>

      {courses.map(course => (
        <div key={course.course_id} className="p-4 border mb-3 rounded bg-white shadow">
          <h2 className="font-semibold">{course.course_name}</h2>
          <p className="text-sm text-gray-600">Teacher: {course.teacher_name}</p>
          <p className="text-sm">
            Progress: {course.completed_topics} / {course.total_topics}
          </p>
        </div>
      ))}

      {/* ===== AVAILABLE COURSES ===== */}
      <h1 className="text-xl font-bold mt-8 mb-4">Available Courses</h1>

      {allCourses.map(course => {
        const isEnrolled = courses.some(c => c.course_id === course.course_id);

        return (
          <div key={course.course_id}
            className="p-4 border mb-3 rounded bg-white shadow flex justify-between items-center">

            <div>
              <h2 className="font-semibold">{course.course_name}</h2>
              <p className="text-sm text-gray-600">{course.course_code}</p>
            </div>

            {isEnrolled ? (
              <span className="text-green-600 font-semibold">Enrolled ✅</span>
            ) : (
              <button
                onClick={() => enrollCourse(course.course_id)}
                className="bg-blue-500 text-white px-3 py-1 rounded">
                Enroll
              </button>
            )}
          </div>
        );
      })}

      {/* ===== QUIZ ===== */}
      <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">AI Quiz</h1>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border px-3 py-2 rounded mb-4 mr-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={generateQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Generate AI Quiz
        </button>

        {quiz.map((q, i) => (
          <div key={i} className="mb-6 border p-4 rounded bg-white">
            <h2 className="font-semibold mb-2">
              Q{i + 1}. {q.question}
            </h2>

            {q.options.map((opt, j) => (
              <label key={j} className="block">
                <input
                  type="radio"
                  name={`q-${i}`}
                  disabled={submitted}
                  checked={answers[i] === j}
                  onChange={() => handleSelect(i, j)}
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}

            {/* RESULT */}
            {submitted && (
              <div className="mt-2">
                {answers[i] === q.answerIndex ? (
                  <p className="text-green-600 font-semibold">Correct ✅</p>
                ) : (
                  <>
                    <p className="text-red-600 font-semibold">
                      Wrong ❌ (Correct: {q.options[q.answerIndex]})
                    </p>
                    <p className="text-gray-600 text-sm">
                      {q.explanation}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* SUBMIT */}
        {quiz.length > 0 && !submitted && (
          <button
            onClick={submitQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Quiz
          </button>
        )}

        {/* SCORE */}
        {submitted && (
          <h2 className="mt-4 text-lg font-bold">
            Score: {score} / {quiz.length}
          </h2>
        )}

        {/* WEAK AREAS + AI */}
        {submitted && weakTopics.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border rounded">

            <h3 className="font-semibold text-yellow-700">Weak Areas:</h3>

            <ul className="list-disc ml-5 text-sm">
              {weakTopics.map((t, i) => <li key={i}>{t}</li>)}
            </ul>

            <button
              onClick={async () => {
                const res = await axios.get("/api/quiz/generate/weak");
                setQuiz(res.data.quiz);
                setAnswers({});
                setSubmitted(false);
                setWeakTopics([]);
                setStudyPlan("");
              }}
              className="bg-purple-500 text-white px-4 py-2 rounded mt-3"
            >
              Generate Weak Area Quiz
            </button>

            <button
              onClick={async () => {
                const res = await axios.post(
                  "http://localhost:5000/api/study",
                  { weakTopics }
                );
                setStudyPlan(res.data.plan);
              }}
              className="bg-indigo-500 text-white px-4 py-2 rounded mt-3 ml-2"
            >
              Generate Study Plan
            </button>

          {studyPlan && (
  <div className="mt-4 p-5 bg-white border rounded shadow-sm">

    {studyPlan.split("\n").map((line, i) => {

      const clean = line.replace(/[*#]/g, "").trim();

      // Title
      if (clean.toLowerCase().includes("study plan")) {
        return (
          <h2 key={i} className="text-xl font-bold mb-3">
            {clean}
          </h2>
        );
      }

      // Day headings
      if (clean.toLowerCase().startsWith("day")) {
        return (
          <h3 key={i} className="text-lg font-semibold mt-4 mb-1 text-blue-600">
            {clean}
          </h3>
        );
      }

      // Bullet points
      if (clean.startsWith("•") || clean.startsWith("-")) {
        return (
          <p key={i} className="ml-4 text-gray-700">
            • {clean.replace(/^[-•]/, "").trim()}
          </p>
        );
      }

      // Normal text
      if (clean !== "") {
        return (
          <p key={i} className="text-gray-800">
            {clean}
          </p>
        );
      }

      return null;
    })}
  </div>
)}
          </div>
        )}

      </div>
    </div>
  );
}