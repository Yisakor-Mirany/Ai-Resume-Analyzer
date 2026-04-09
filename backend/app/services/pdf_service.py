"""
PDF parsing service.

Uses pdfplumber to extract plain text from a PDF byte stream.
pdfplumber handles most modern PDFs reliably (including multi-column layouts).
"""

import io
import pdfplumber

from app.utils.helpers import clean_text


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract all text from a PDF supplied as raw bytes.

    Args:
        pdf_bytes: Raw bytes of the uploaded PDF file.

    Returns:
        A cleaned plain-text string of the entire resume.

    Raises:
        ValueError: If the PDF cannot be opened or contains no extractable text.
    """
    extracted_pages: list[str] = []

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        if len(pdf.pages) == 0:
            raise ValueError("The PDF file has no pages.")

        for page in pdf.pages:
            # extract_text() returns None for image-only pages
            page_text = page.extract_text()
            if page_text:
                extracted_pages.append(page_text)

    if not extracted_pages:
        raise ValueError(
            "Could not extract any text. The PDF may be scanned/image-based."
        )

    # Join pages with a clear separator, then normalize whitespace
    full_text = "\n\n".join(extracted_pages)
    return clean_text(full_text)
