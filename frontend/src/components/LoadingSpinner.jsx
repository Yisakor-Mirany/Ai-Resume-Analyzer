/**
 * Full-page loading overlay with a spinner and status message.
 * Shown while the PDF is uploading or the AI analysis is running.
 */
function LoadingSpinner({ message = "Analyzing your resume..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      {/* Spinning ring */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      {/* Status text */}
      <p className="mt-5 text-lg font-medium text-slate-700">{message}</p>
      <p className="mt-1 text-sm text-slate-400">
        This may take up to 15 seconds
      </p>
    </div>
  );
}

export default LoadingSpinner;
