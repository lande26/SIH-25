import { GoogleGenerativeAI } from '@google/generative-ai'
import formidable from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export default async function handler(req, res) {
  // ...existing method and API key checks...

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type. Please upload JPG, PNG, or PDF.' })
    }

    let extractedText
    let translatedText

    if (file.mimetype === 'application/pdf') {
      console.log('Processing PDF file:', file.originalFilename)
      const pdfBuffer = fs.readFileSync(file.filepath)
      const data = await pdf(pdfBuffer)
      extractedText = data.text.trim()
      
      if (!extractedText || extractedText.length === 0) {
        return res.status(400).json({
          error: "No text could be extracted. If this is a scanned PDF, please upload it as an image instead."
        })
      }

      // Translate extracted PDF text
      translatedText = await translateWithGemini(extractedText)
    } else {
      // For images, use enhanced Gemini Vision API
      console.log('Processing image file:', file.originalFilename)
      const result = await processImageWithGemini(file)
      extractedText = result.original
      translatedText = result.translation
    }

    // Clean up the temporary file
    fs.unlinkSync(file.filepath)

    res.status(200).json({ 
      success: true,
      data: {
        original: extractedText,
        translation: translatedText,
        fileName: file.originalFilename,
        fileType: file.mimetype,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Processing error:', error)
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to process file' 
    })
  }
}

async function processImageWithGemini(file) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
    const imageBuffer = fs.readFileSync(file.filepath)
    const base64Image = imageBuffer.toString('base64')

    const prompt = `Analyze this image and:
1. Extract all text, especially focusing on Nepali (नेपाली) and Sinhalese (සිංහල) text.
2. Provide a fluent and natural English translation only.
3. Maintain proper names, numbers, and special characters exactly as they appear.
4. Preserve the paragraph and line structure from the original text.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Split response into original and translation
    const parts = text.split('ENGLISH TRANSLATION:')
    const original = parts[0].replace('ORIGINAL TEXT:', '').trim()
    const translation = parts[1]?.trim() || 'Translation not available'

    return { original, translation }
  } catch (error) {
    throw new Error(`Gemini Vision processing failed: ${error.message}`)
  }
}

async function translateWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Translate the following Nepali or Sinhalese text to English:
    
${text}

Provide a natural, fluent translation while preserving:
- Names and proper nouns
- Numbers and dates
- Document formatting
- Cultural context and nuances`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    throw new Error(`Translation failed: ${error.message}`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}