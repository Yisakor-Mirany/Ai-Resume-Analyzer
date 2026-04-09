"""
Resume-related API routes.

POST /upload-resume  — accepts a PDF, returns extracted text
POST /analyze        — accepts resume text + job description, returns AI analysis
"""

from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import analyze_resume

router = APIRouter()


# ── Request / Response models ─────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalyzeResponse(BaseModel):
    score: int
    matched_keywords: list[str]
    missing_keywords: list[str]
    strengths: list[str]
    improvements: list[str]


class UploadResponse(BaseModel):
    filename: str
    extracted_text: str
    char_count: int


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    Accept a PDF upload, extract its text, and return the plain text.
    The client can then pass this text directly to /analyze.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted. Please upload a .pdf file.",
        )

    pdf_bytes = await file.read()

    try:
        extracted_text = extract_text_from_pdf(pdf_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not parse PDF: {str(exc)}",
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="No readable text found in the PDF. It may be image-based or encrypted.",
        )

    return UploadResponse(
        filename=file.filename,
        extracted_text=extracted_text,
        char_count=len(extracted_text),
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    """
    Send resume text and a job description to OpenAI and return a structured
    ATS-style analysis: score, matched/missing keywords, strengths, improvements.
    """
    if len(payload.resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short. Please provide more content.",
        )

    if len(payload.job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide more detail.",
        )

    try:
        result = await analyze_resume(
            resume_text=payload.resume_text,
            job_description=payload.job_description,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI analysis failed: {str(exc)}",
        )

    return result
