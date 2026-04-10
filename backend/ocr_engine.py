import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import os

# Set Tesseract path (change if needed)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")   # Try normal text extraction first
        
        if text.strip():  
            full_text += text + "\n"
        else:
            # Fallback: Render page as image and use OCR
            pix = page.get_pixmap(dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            text = pytesseract.image_to_string(img, lang='eng')
            full_text += text + "\n"
    
    doc.close()
    return full_text.strip()

def extract_text_from_image(image_path):
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img, lang='eng')
    return text.strip()

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        text = extract_text_from_pdf(file_path)
        if text and len(text.strip()) > 50:   # If we got decent text
            return text
        else:
            print("PDF text extraction weak, trying OCR fallback...")
            # Optional: convert PDF pages to images and OCR (advanced)
            return "Could not extract sufficient text from PDF. Please try a clearer scan."
    
    elif ext in ['.jpg', '.jpeg', '.png', '.bmp']:
        return extract_text_from_image(file_path)
    
    else:
        return "Unsupported file type"

print("OCR Engine loaded successfully")