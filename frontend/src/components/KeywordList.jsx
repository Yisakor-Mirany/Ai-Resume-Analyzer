/**
 * Renders a labeled list of keyword chips.
 *
 * Props:
 *  title    {string}   — section heading
 *  keywords {string[]} — list of keyword strings
 *  variant  {"matched" | "missing"} — controls chip color
 */
function KeywordList({ title, keywords, variant = "matched" }) {
  const chipStyle =
    variant === "matched"
      ? "bg-green-100 text-green-800 ring-green-200"
      : "bg-red-100 text-red-800 ring-red-200";

  const icon =
    variant === "matched" ? (
      <svg className="mr-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      {/* Section header */}
      <div className="mb-4 flex items-center">
        {icon}
        <h3 className="text-base font-semibold text-slate-700">{title}</h3>
        {/* Count badge */}
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
          {keywords.length}
        </span>
      </div>

      {keywords.length === 0 ? (
        <p className="text-sm text-slate-400 italic">None identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, idx) => (
            <span
              key={idx}
              className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${chipStyle}`}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default KeywordList;
