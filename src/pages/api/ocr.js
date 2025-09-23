// import formidable from 'formidable'
// import fs from 'fs'
// import fetch from 'node-fetch'

// // Update this with your Gemini API key
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   try {
//     // Validate API key
//     if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
//       return res.status(500).json({ error: 'Missing Gemini API key' })
//     }

//     const form = formidable({
//       keepExtensions: true,
//       maxFileSize: 10 * 1024 * 1024, // 10MB limit
//     })

//     const [fields, files] = await form.parse(req)
//     const file = files.file?.[0]

//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' })
//     }

//     // Read file as base64
//     const fileBuffer = fs.readFileSync(file.filepath)
//     const base64Image = fileBuffer.toString('base64')

//     // Prepare request for Gemini API
//    const requestBody = {
//   contents: [{
//     parts: [
//       {
//         text: `Extract all text from this image or document.
// - The content may be in Nepali or Sinhalese languages.
// - Translate the extracted text into English.
// - Provide a **refined, natural, and fluent translation** that preserves meaning, context, and cultural nuances.
// - Maintain paragraph/line structure: for each original line, provide the English translation immediately below.
// - Avoid literal word-for-word translation; instead, make it read naturally in English.
// - Return only the output text (original line + English translation), without extra explanations or formatting.`
//       },
//       {
//         inline_data: {
//           mime_type: file.mimetype,
//           data: base64Image
//         }
//       }
//     ]
//   }]
// }



//     // Send to Gemini API
//     const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestBody)
//     })

//     // Clean up temporary file
//     fs.unlinkSync(file.filepath)

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.error?.message || `Gemini API responded with status: ${response.status}`)
//     }

//     const data = await response.json()
//     res.status(200).json({
//       text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text extracted',
//       raw: data // Include raw response for debugging
//     })

//   } catch (error) {
//     console.error('OCR processing error:', error)
//     res.status(500).json({ 
//       error: error.message || 'Failed to process the file' 
//     })
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }


import formidable from 'formidable'
import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google GenAI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

    // Read file as buffer
    const fileBuffer = fs.readFileSync(file.filepath)

    // Get the Gemini vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Prepare prompt for Nepali/Sinhalese OCR + translation
   const prompt = `Translate all text from this image or document into English.
- The content may be in Nepali or Sinhalese languages.
- Provide only the English translation.
- Maintain the meaning, context, and cultural nuances.
- Ensure the translation is fluent and natural, not word-for-word.`;

// Send request to the model
const result = await model.generateContent([
  prompt,
  {
    inline_data: {
      data: fileBuffer.toString('base64'),
      mime_type: file.mimetype
    }
  }
])

// Correct way to get text
const translatedText = result.response.text()


    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.status(200).json({
      success: true,
      text: translatedText,
      fileName: file.originalFilename,
      fileType: file.mimetype,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('GenAI processing error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process the file'
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
