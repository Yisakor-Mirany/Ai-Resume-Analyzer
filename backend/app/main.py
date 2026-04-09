"""
Main FastAPI application entry point.
Configures CORS, mounts routers, and starts the server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.resume import router as resume_router

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes against job descriptions using OpenAI",
    version="1.0.0",
)

# Allow requests from the React dev server (and production domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all resume-related routes under /api
app.include_router(resume_router, prefix="/api")


@app.get("/")
def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok", "message": "AI Resume Analyzer API is running"}
