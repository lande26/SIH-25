

import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../components/utils/navbar'

export default function Home() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a JPG, PNG, or PDF file.')
        return
      }
      
      setFile(selectedFile)
      setError('')
      setExtractedText('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Call your OCR + translation API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'OCR processing failed')
      }

      // The API returns paired original + English translation text
      setExtractedText(result.text)
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Optional: parse the extracted text into structured lines
  const parseLines = (text) => {
    return text.split('\n').filter(line => line.trim())
  }

  const lines = extractedText ? parseLines(extractedText) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar></Navbar>
      <Head>
        <title>Nepali & Sinhalese OCR + Translation</title>
        <meta name="description" content="Extract text from Nepali/Sinhalese images or PDFs and translate to English" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Nepali & Sinhalese OCR + English Translation
          </h1>
          
          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload Image or PDF
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Select File (JPG, PNG, or PDF)
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <button
                type="submit"
                disabled={!file || isProcessing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Extract & Translate'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {lines.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Extracted & Translated Text
              </h2>
              <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {lines.map((line, index) => (
                    <span key={index}>
                      {line}
                      {'\n'}
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              How to Use
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Upload a Nepali or Sinhalese image/PDF file</li>
              <li>• Click "Extract & Translate" to process the document</li>
              <li>• The system uses Google Gemini AI for OCR and translation</li>
              <li>• View the extracted original text with English translation immediately below each line</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
