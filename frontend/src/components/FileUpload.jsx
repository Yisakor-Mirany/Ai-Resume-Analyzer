import { useRef, useState } from "react";

/**
 * Drag-and-drop + click-to-browse PDF upload component.
 *
 * Props:
 *  onFileSelect(file) — called with the selected File object
 *  selectedFile       — currently selected File (or null)
 */
function FileUpload({ onFileSelect, selectedFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Open the native file picker
  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex cursor-pointer flex-col items-center justify-center
        rounded-xl border-2 border-dashed px-6 py-10 transition-colors
        ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"
        }
      `}
    >
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile ? (
        <>
          {/* Show selected file name */}
          <svg
            className="mb-3 h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-semibold text-green-700">{selectedFile.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            Click to replace · PDF only
          </p>
        </>
      ) : (
        <>
          {/* Upload icon */}
          <svg
            className="mb-3 h-10 w-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="font-semibold text-slate-600">
            Drop your resume here, or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">PDF files only</p>
        </>
      )}
    </div>
  );
}

export default FileUpload;
