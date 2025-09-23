# Certificate AI Text Extraction

A Next.js application that extracts text from certificate images and PDFs using Google Gemini AI and traditional OCR.

## Features

- Upload certificate files (JPG, PNG, PDF)
- Extract text using OCR (Optical Character Recognition)
- Parse common certificate fields (name, roll number, marks, etc.)
- Modern UI with TailwindCSS
- Responsive design with TailwindCSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Google Gemini AI API key:
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env.local` file in the project root
   - Add your API key: `GEMINI_API_KEY=your_api_key_here`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a certificate file (JPG, PNG, or PDF)
2. Click "Extract Text" to process the document
3. View the extracted data and raw text

## Technology Stack

- Next.js 14
- React 18
- Google Gemini AI for advanced text extraction from images
- Tesseract.js for OCR (fallback)
- Formidable for file upload handling
- pdf-parse for direct PDF text extraction
- TailwindCSS for styling

## API Endpoints

- `POST /api/gemini-ocr` - Processes uploaded files using Gemini AI and returns extracted text
- `POST /api/ocr` - Legacy OCR endpoint using Tesseract.js
