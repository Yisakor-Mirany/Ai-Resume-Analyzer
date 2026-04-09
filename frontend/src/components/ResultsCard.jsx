/**
 * A card that renders a titled list of bullet points.
 * Used for both "Strengths" and "Improvements" sections.
 *
 * Props:
 *  title   {string}   — card heading
 *  items   {string[]} — bullet point text items
 *  variant {"success" | "warning"} — color scheme
 */
function ResultsCard({ title, items, variant = "success" }) {
  const styles = {
    success: {
      header: "bg-green-50 text-green-800",
      bullet: "text-green-500",
      icon: (
        <svg className="mr-2 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      header: "bg-amber-50 text-amber-800",
      bullet: "text-amber-500",
      icon: (
        <svg className="mr-2 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
      ),
    },
  };

  const s = styles[variant];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      {/* Card header */}
      <div className={`flex items-center px-6 py-4 ${s.header}`}>
        {s.icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      {/* Card body */}
      <ul className="divide-y divide-slate-50 px-6 py-2">
        {items.length === 0 ? (
          <li className="py-3 text-sm italic text-slate-400">None identified.</li>
        ) : (
          items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 py-3">
              {/* Bullet dot */}
              <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${s.bullet} bg-current`} />
              <p className="text-sm leading-relaxed text-slate-600">{item}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ResultsCard;
