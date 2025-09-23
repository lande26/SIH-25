# Google Gemini AI Setup Guide

## Step 1: Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root directory
2. Add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Step 3: Restart the Development Server

```bash
npm run dev
```

## Step 4: Test the Application

1. Open http://localhost:3000
2. Upload a certificate image (JPG/PNG) or PDF
3. Click "Extract Text"
4. The system will use Google Gemini AI for better text extraction

## Benefits of Using Gemini AI

- **Better Accuracy**: AI-powered text extraction is more accurate than traditional OCR
- **Smart Parsing**: Can understand context and structure of certificates
- **Multi-language Support**: Works with certificates in different languages
- **Handwriting Recognition**: Can read handwritten text on certificates

## Troubleshooting

If you get a "Gemini API key not configured" error:
1. Make sure `.env.local` file exists in the project root
2. Check that the API key is correctly formatted
3. Restart the development server after adding the API key
4. Verify your API key is valid at Google AI Studio
