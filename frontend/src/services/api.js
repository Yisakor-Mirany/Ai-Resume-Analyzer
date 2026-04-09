/**
 * API service layer.
 * Centralizes all HTTP calls to the FastAPI backend.
 * The Vite proxy forwards /api/* → http://localhost:8000 in development.
 */

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000, // 60 s — AI calls can take a few seconds
});

/**
 * Upload a PDF file and receive the extracted text.
 *
 * @param {File} file - The PDF File object from an <input type="file">
 * @returns {Promise<{ filename: string, extracted_text: string, char_count: number }>}
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

/**
 * Analyze a resume against a job description.
 *
 * @param {string} resumeText     - Plain text extracted from the resume PDF
 * @param {string} jobDescription - Job description entered by the user
 * @returns {Promise<{
 *   score: number,
 *   matched_keywords: string[],
 *   missing_keywords: string[],
 *   strengths: string[],
 *   improvements: string[]
 * }>}
 */
export async function analyzeResume(resumeText, jobDescription) {
  const response = await api.post("/analyze", {
    resume_text: resumeText,
    job_description: jobDescription,
  });

  return response.data;
}
