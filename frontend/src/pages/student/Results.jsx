import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentResults } from '../../api';
import { Badge, Card, SectionTitle, Spinner, gradeVariant } from '../../components/UI';

export default function StudentResults() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentResults(user.id).then(r => setResults(r.data)).finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <Spinner />;

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + (r.marks_obtained / r.total_marks) * 100, 0) / results.length)
    : 0;

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">My Results</h1>
        <p className="text-sm text-gray-400 mt-0.5">Overall average: {avg}%</p>
      </div>
      <Card>
        <SectionTitle>All graded assignments</SectionTitle>
        {results.length === 0 ? (
          <p className="text-sm text-gray-400">No results yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {results.map(r => (
              <div key={r.result_id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.assignment_title}</p>
                    <p className="text-xs text-gray-400">{r.course_name} · Graded {new Date(r.graded_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{r.marks_obtained}/{r.total_marks}</span>
                    <Badge label={r.grade} variant={gradeVariant(r.grade)} />
                  </div>
                </div>
                {r.feedback && (
                  <p className="text-xs text-gray-500 mt-1 border-l-2 border-gray-200 pl-2">{r.feedback}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
