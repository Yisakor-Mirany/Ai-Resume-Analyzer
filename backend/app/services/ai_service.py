"""
AI analysis service.

Sends the resume text and job description to OpenAI and parses
the structured JSON response into an AnalyzeResponse-compatible dict.
"""

import os
import json
import re
from openai import AsyncOpenAI

from app.utils.helpers import truncate_text

# Instantiate the async client once (reads OPENAI_API_KEY from environment)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Fallback model if env var is not set
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

# ── Prompt template ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) and career coach.
Your job is to analyze a candidate's resume against a job description and return
a structured evaluation. Always respond with valid JSON only — no markdown, no prose."""

USER_PROMPT_TEMPLATE = """Analyze the resume below against the job description and return ONLY a JSON object with this exact structure:

{{
  "score": <integer 0-100 representing ATS match percentage>,
  "matched_keywords": [<list of important keywords/skills present in both resume and JD>],
  "missing_keywords": [<list of important keywords/skills in JD but absent from resume>],
  "strengths": [<list of 3-5 sentences highlighting strong points of the resume for this role>],
  "improvements": [<list of 3-5 actionable suggestions to improve the resume for this role>]
}}

Rules:
- Return ONLY the JSON object. No explanation, no markdown code fences.
- Keywords should be specific skills, tools, or qualifications (e.g. "Python", "team leadership", "REST APIs").
- Score should reflect realistic ATS keyword matching and relevance, not general resume quality.
- Strengths and improvements must be specific to the job description provided.

---
JOB DESCRIPTION:
{job_description}

---
RESUME:
{resume_text}
"""


# ── Main function ──────────────────────────────────────────────────────────────

async def analyze_resume(resume_text: str, job_description: str) -> dict:
    """
    Call OpenAI with the resume and job description, then parse and return
    a structured analysis dict.

    Args:
        resume_text:      Plain text extracted from the candidate's PDF.
        job_description:  The target job description pasted by the user.

    Returns:
        Dict with keys: score, matched_keywords, missing_keywords,
                        strengths, improvements.
    """
    # Truncate to avoid blowing past the context window
    resume_trimmed = truncate_text(resume_text, max_chars=5000)
    jd_trimmed = truncate_text(job_description, max_chars=2000)

    user_message = USER_PROMPT_TEMPLATE.format(
        job_description=jd_trimmed,
        resume_text=resume_trimmed,
    )

    response = await client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        # Force deterministic output for consistent scoring
        temperature=0.2,
        # Limit response length — the JSON should never be enormous
        max_tokens=1500,
    )

    raw_content = response.choices[0].message.content.strip()

    # Defensively strip any accidental markdown code fences
    raw_content = _strip_code_fences(raw_content)

    try:
        data = json.loads(raw_content)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"OpenAI returned non-JSON content: {raw_content[:200]}"
        ) from exc

    return _validate_response(data)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _strip_code_fences(text: str) -> str:
    """Remove ```json ... ``` or ``` ... ``` wrappers if the model adds them."""
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _validate_response(data: dict) -> dict:
    """
    Ensure the response has all required keys and sensible types.
    Fills in safe defaults for any missing/malformed fields so the
    API never crashes due to an unexpected model response.
    """
    return {
        "score": int(data.get("score", 0)),
        "matched_keywords": list(data.get("matched_keywords", [])),
        "missing_keywords": list(data.get("missing_keywords", [])),
        "strengths": list(data.get("strengths", [])),
        "improvements": list(data.get("improvements", [])),
    }
