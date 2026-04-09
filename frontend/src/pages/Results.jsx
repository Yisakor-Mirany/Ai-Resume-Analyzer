import { useLocation, useNavigate } from "react-router-dom";
import ScoreDisplay from "../components/ScoreDisplay";
import KeywordList from "../components/KeywordList";
import ResultsCard from "../components/ResultsCard";

/**
 * Results page — displays the full AI analysis returned by the backend.
 *
 * Reads data from React Router's location.state (set by Home.jsx after a
 * successful analysis). If the user lands here directly (no state),
 * redirect them back to the home page.
 */
function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Guard: if navigated here without state, send back home
  const state = location.state;
  if (!state?.analysis) {
    navigate("/");
    return null;
  }

  const { analysis, filename, jobDescription } = state;
  const { score, matched_keywords, missing_keywords, strengths, improvements } =
    analysis;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* ── Page header ── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Analysis Results
          </h1>
          {filename && (
            <p className="mt-1 text-sm text-slate-500">
              File: <span className="font-medium text-slate-700">{filename}</span>
            </p>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          New Analysis
        </button>
      </div>

      {/* ── Score section ── */}
      <div className="mb-8">
        <ScoreDisplay score={score} />
      </div>

      {/* ── Keywords grid ── */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <KeywordList
          title="Matched Keywords"
          keywords={matched_keywords}
          variant="matched"
        />
        <KeywordList
          title="Missing Keywords"
          keywords={missing_keywords}
          variant="missing"
        />
      </div>

      {/* ── Qualitative feedback ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        <ResultsCard
          title="Strengths"
          items={strengths}
          variant="success"
        />
        <ResultsCard
          title="Suggested Improvements"
          items={improvements}
          variant="warning"
        />
      </div>

      {/* ── Job description accordion (collapsed by default) ── */}
      {jobDescription && (
        <details className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-600">
            View job description used for analysis
          </summary>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-500">
            {jobDescription}
          </p>
        </details>
      )}

      {/* ── Footer CTA ── */}
      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Analyze Another Resume
        </button>
      </div>
    </main>
  );
}

export default Results;
