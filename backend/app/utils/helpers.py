"""
Shared utility helpers used across the application.
"""

import re


def clean_text(text: str) -> str:
    """
    Normalize whitespace in extracted text.
    Collapses multiple blank lines and strips leading/trailing space.
    """
    # Replace carriage returns
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Collapse 3+ consecutive newlines to two (keep paragraph breaks)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse multiple spaces/tabs on a single line
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def truncate_text(text: str, max_chars: int = 6000) -> str:
    """
    Truncate text to avoid exceeding the OpenAI context limit.
    Cuts at the nearest word boundary below max_chars.
    """
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    last_space = truncated.rfind(" ")
    if last_space > max_chars * 0.8:
        truncated = truncated[:last_space]
    return truncated + "\n\n[... truncated for length ...]"
