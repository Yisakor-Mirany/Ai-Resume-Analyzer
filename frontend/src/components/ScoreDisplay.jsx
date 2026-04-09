/**
 * Circular score gauge component.
 * Displays the ATS match score (0–100) as a colored arc + big number.
 *
 * Props:
 *  score {number} — value between 0 and 100
 */
function ScoreDisplay({ score }) {
  // Map score to a color: red → yellow → green
  const getColor = (s) => {
    if (s >= 75) return { ring: "text-green-500", bg: "bg-green-50", label: "Strong Match", labelColor: "text-green-700" };
    if (s >= 50) return { ring: "text-yellow-500", bg: "bg-yellow-50", label: "Moderate Match", labelColor: "text-yellow-700" };
    return { ring: "text-red-500", bg: "bg-red-50", label: "Weak Match", labelColor: "text-red-700" };
  };

  const { ring, bg, label, labelColor } = getColor(score);

  // SVG circle math for the progress arc
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center rounded-2xl ${bg} p-8`}>
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
        ATS Match Score
      </p>

      {/* SVG ring gauge */}
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          {/* Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          {/* Progress arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${ring} transition-all duration-700 ease-out`}
            stroke="currentColor"
          />
        </svg>

        {/* Score number in the center */}
        <span className={`absolute text-4xl font-bold ${ring}`}>{score}</span>
      </div>

      <span className={`mt-3 rounded-full px-4 py-1 text-sm font-semibold ${bg} ${labelColor} ring-1 ring-current/20`}>
        {label}
      </span>
    </div>
  );
}

export default ScoreDisplay;
