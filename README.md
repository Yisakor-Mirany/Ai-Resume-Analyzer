# AI Resume Analyzer

A full-stack web application that analyzes resumes against job descriptions using OpenAI, providing an ATS-style match score, keyword analysis, and actionable feedback.

---

## Features

- Upload a PDF resume (drag-and-drop or click to browse)
- Paste a job description
- Receive a structured AI analysis:
  - **Match score** (0–100)
  - **Matched keywords** found in both resume and JD
  - **Missing keywords** present in JD but absent from resume
  - **Strengths** specific to the role
  - **Improvement suggestions** with actionable advice

---

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS  |
| Backend   | FastAPI (Python 3.11+)          |
| AI        | OpenAI API (`gpt-4o`)           |
| PDF parse | pdfplumber                      |

---

## Project Structure

```
Ai-Resume-Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, router mounting
│   │   ├── routes/
│   │   │   └── resume.py        # POST /upload-resume, POST /analyze
│   │   ├── services/
│   │   │   ├── pdf_service.py   # PDF text extraction via pdfplumber
│   │   │   └── ai_service.py    # OpenAI prompt + response parsing
│   │   └── utils/
│   │       └── helpers.py       # Text cleaning / truncation utils
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx          # Upload form
    │   │   └── Results.jsx       # Analysis display
    │   ├── components/
    │   │   ├── FileUpload.jsx    # Drag-and-drop PDF uploader
    │   │   ├── ScoreDisplay.jsx  # Circular score gauge
    │   │   ├── KeywordList.jsx   # Matched / missing keyword chips
    │   │   ├── ResultsCard.jsx   # Strengths / improvements card
    │   │   └── LoadingSpinner.jsx
    │   ├── services/
    │   │   └── api.js            # Axios calls to the backend
    │   └── App.jsx               # Router setup
    ├── package.json
    ├── vite.config.js            # Dev proxy → FastAPI
    └── tailwind.config.js
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- An OpenAI API key

---

### 1. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

### 2. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (proxies /api → localhost:8000)
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and set:

| Variable         | Description                    | Default  |
|------------------|--------------------------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) | —        |
| `OPENAI_MODEL`   | Model to use for analysis      | `gpt-4o` |

---

## API Reference

### `POST /api/upload-resume`

**Request:** `multipart/form-data` with field `file` (PDF).

**Response:**
```json
{
  "filename": "resume.pdf",
  "extracted_text": "John Doe\nSoftware Engineer...",
  "char_count": 3241
}
```

---

### `POST /api/analyze`

**Request:**
```json
{
  "resume_text": "John Doe\nSoftware Engineer with 5 years...",
  "job_description": "We are looking for a Senior Python Developer..."
}
```

**Response:**
```json
{
  "score": 78,
  "matched_keywords": ["Python", "REST APIs", "team leadership", "PostgreSQL"],
  "missing_keywords": ["Kubernetes", "Terraform", "CI/CD pipelines"],
  "strengths": [
    "Strong Python background with 5 years of hands-on experience aligns well with the role.",
    "Demonstrated experience with REST API design matches the core technical requirement."
  ],
  "improvements": [
    "Add specific experience with Kubernetes or Docker orchestration, which is listed as required.",
    "Mention any CI/CD tools (GitHub Actions, Jenkins) to address the listed requirement.",
    "Quantify achievements (e.g. 'reduced API latency by 30%') to strengthen impact."
  ]
}
```

---

## Future Improvements

- **Authentication** — Add user accounts to save and compare analyses over time.
- **Resume scoring history** — Track score improvements across multiple iterations.
- **Streaming responses** — Use OpenAI streaming to show results progressively.
- **Multiple file formats** — Support `.docx` files via `python-docx`.
- **ATS keyword density chart** — Visualize keyword frequency distribution.
- **Export as PDF** — Let users download the analysis report.
- **Job board integration** — Paste a job URL instead of the full description.
