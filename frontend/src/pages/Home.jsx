import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import { uploadResume, analyzeResume } from "../services/api";

/**
 * Home page — the entry point of the application.
 *
 * Flow:
 *  1. User selects a PDF resume.
 *  2. User pastes a job description.
 *  3. On submit:
 *     a. POST /upload-resume  → extracts text from the PDF.
 *     b. POST /analyze        → sends text + JD to OpenAI.
 *     c. Navigate to /results with the analysis data.
 */
function Home() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);

  const canSubmit = selectedFile && jobDescription.trim().length >= 20 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Extract text from the PDF
      setLoadingMessage("Extracting text from your resume...");
      const uploadResult = await uploadResume(selectedFile);

      // Step 2: Run the AI analysis
      setLoadingMessage("Analyzing with AI — this takes a few seconds...");
      const analysis = await analyzeResume(
        uploadResult.extracted_text,
        jobDescription
      );

      // Step 3: Navigate to results, passing data via router state
      navigate("/results", {
        state: {
          analysis,
          filename: uploadResult.filename,
          jobDescription,
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Something went wrong. Please check your connection and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner message={loadingMessage} />}

      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            AI-Powered
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Resume Analyzer
          </h1>
          <p className="mt-3 max-w-lg text-slate-500">
            Upload your resume and paste a job description to get an instant
            ATS match score, keyword analysis, and personalized feedback.
          </p>
        </div>

        {/* ── Form card ── */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl space-y-6 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100"
        >
          {/* Error banner */}
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
              <strong>Error: </strong>{error}
            </div>
          )}

          {/* PDF upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Resume (PDF)
            </label>
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {/* Job description */}
          <div>
            <label
              htmlFor="jd"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Job Description
            </label>
            <textarea
              id="jd"
              rows={8}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-400">
              {jobDescription.trim().length} characters · minimum 20 required
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition
              ${
                canSubmit
                  ? "bg-blue-600 shadow-md hover:bg-blue-700 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-300"
              }
            `}
          >
            Analyze Resume
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          Your data is never stored. Analysis is processed in real-time.
        </p>
      </main>
    </>
  );
}

export default Home;
