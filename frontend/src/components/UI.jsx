// ─── Badge ────────────────────────────────────────────────
export function Badge({ label, variant = 'gray' }) {
  const styles = {
    green:  'bg-teal-50  text-teal-800',
    amber:  'bg-amber-50 text-amber-800',
    red:    'bg-red-50   text-red-800',
    blue:   'bg-blue-50  text-blue-800',
    gray:   'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Metric Card ──────────────────────────────────────────
export function MetricCard({ label, value, sub }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────
export function ProgressBar({ pct, color = '#1d9e75' }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
      <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all duration-500" />
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── Loading spinner ──────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

// ─── Grade color helper ───────────────────────────────────
export function gradeVariant(grade) {
  return { A: 'green', B: 'blue', C: 'amber', D: 'amber', F: 'red' }[grade] || 'gray';
}

// ─── Difficulty color helper ──────────────────────────────
export function difficultyVariant(level) {
  return { Beginner: 'green', Intermediate: 'amber', Advanced: 'red' }[level] || 'gray';
}
