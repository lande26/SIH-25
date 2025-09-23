

// import { useState } from 'react'
// import Head from 'next/head'
// import Navbar from '../components/utils/navbar'

// export default function Home() {
//   const [file, setFile] = useState(null)
//   const [extractedText, setExtractedText] = useState('')
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [error, setError] = useState('')

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0]
//     if (selectedFile) {
//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
//       if (!allowedTypes.includes(selectedFile.type)) {
//         setError('Please upload a JPG, PNG, or PDF file.')
//         return
//       }
      
//       setFile(selectedFile)
//       setError('')
//       setExtractedText('')
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!file) {
//       setError('Please select a file to upload.')
//       return
//     }

//     setIsProcessing(true)
//     setError('')

//     try {
//       const formData = new FormData()
//       formData.append('file', file)

//       // Call your OCR + translation API
//       const response = await fetch('/api/ocr', {
//         method: 'POST',
//         body: formData,
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.error || 'OCR processing failed')
//       }

//       // The API returns paired original + English translation text
//       setExtractedText(result.text)
//     } catch (err) {
//       setError(err.message || 'An error occurred while processing the file.')
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   // Optional: parse the extracted text into structured lines
//   const parseLines = (text) => {
//     return text.split('\n').filter(line => line.trim())
//   }

//   const lines = extractedText ? parseLines(extractedText) : []

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar></Navbar>
//       <Head>
//         <title>Nepali & Sinhalese OCR + Translation</title>
//         <meta name="description" content="Extract text from Nepali/Sinhalese images or PDFs and translate to English" />
//         <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
//       </Head>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
//             Nepali & Sinhalese OCR + English Translation
//           </h1>
          
//           {/* Upload Form */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Upload Image or PDF
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
//                   Select File (JPG, PNG, or PDF)
//                 </label>
//                 <input
//                   type="file"
//                   id="file"
//                   accept=".jpg,.jpeg,.png,.pdf"
//                   onChange={handleFileChange}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={!file || isProcessing}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {isProcessing ? 'Processing...' : 'Extract & Translate'}
//               </button>
//             </form>

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
//                 <p className="text-red-600">{error}</p>
//               </div>
//             )}
//           </div>

//           {/* Results Section */}
//           {lines.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                 Extracted & Translated Text
//               </h2>
//               <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
//                 <pre className="text-sm text-gray-700 whitespace-pre-wrap">
//                   {lines.map((line, index) => (
//                     <span key={index}>
//                       {line}
//                       {'\n'}
//                     </span>
//                   ))}
//                 </pre>
//               </div>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="mt-8 bg-blue-50 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-blue-800 mb-3">
//               How to Use
//             </h3>
//             <ul className="text-blue-700 space-y-2">
//               <li>• Upload a Nepali or Sinhalese image/PDF file</li>
//               <li>• Click "Extract & Translate" to process the document</li>
//               <li>• The system uses Google Gemini AI for OCR and translation</li>
//               <li>• View the extracted original text with English translation immediately below each line</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"
import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../components/utils/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  ImageIcon, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Languages,
  FileImage,
  Copy,
  RefreshCw
} from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a JPG, PNG, or PDF file.')
        return
      }
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.')
        return
      }
      
      setFile(selectedFile)
      setError('')
      setExtractedText('')
    }
  }

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
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
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev)
      }, 200)

      // Call your OCR + translation API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

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
      setUploadProgress(0)
    }
  }

  const copyToClipboard = async () => {
    if (extractedText) {
      try {
        await navigator.clipboard.writeText(extractedText)
        setCopySuccess(true)
        // Hide the success message after 2 seconds
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  }

  const downloadResults = () => {
    if (extractedText) {
      const blob = new Blob([extractedText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translation-${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-muted-foreground" />
    
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-12 w-12 text-blue-500" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-12 w-12 text-red-500" />
    }
    return <FileText className="h-12 w-12 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Parse lines for better display
  const parseLines = (text) => {
    return text.split('\n').filter(line => line.trim())
  }

  const lines = extractedText ? parseLines(extractedText) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <Head>
        <title>Nepali & Sinhalese OCR + Translation</title>
        <meta name="description" content="Extract text from Nepali/Sinhalese images or PDFs and translate to English" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Languages className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              OCR + Translation
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Extract and translate text from Nepali and Sinhalese documents using advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Upload images (JPG, PNG) or PDF files for text extraction and translation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    {getFileIcon()}
                    
                    {file ? (
                      <div className="text-center">
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {file.type.startsWith('image/') ? 'Image' : 'PDF'}
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-lg font-medium text-slate-900 mb-2">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG, and PDF files up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Input */}
                <div className="space-y-2">
                  <Label htmlFor="file">Choose File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleInputChange}
                    className="cursor-pointer"
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Processing document...
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!file || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Languages className="mr-2 h-4 w-4" />
                      Extract & Translate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-blue-800">Upload a Nepali or Sinhalese image or PDF file</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-blue-800">Click "Extract & Translate" to process the document</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-blue-800">View extracted text with English translation in real-time</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {lines.length > 0 ? (
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Translation Results
                      </CardTitle>
                      <CardDescription>
                        Extracted and translated text from your document
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className={copySuccess ? "bg-green-50 border-green-200" : ""}
                      >
                        {copySuccess ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="ml-1 text-green-600">Copied!</span>
                          </>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadResults}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{lines.length} lines extracted</span>
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                        {lines.map((line, index) => (
                          <div key={index} className="mb-2 pb-2 border-b border-slate-200 last:border-b-0">
                            {line}
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-fit bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No results yet
                  </h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    Upload a document and click "Extract & Translate" to see your results here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Languages className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-sm text-muted-foreground">
                Advanced OCR for Nepali and Sinhalese scripts with high accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Processing</h3>
              <p className="text-sm text-muted-foreground">
                Instant text extraction and translation using Google Gemini AI
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Support for images (JPG, PNG) and PDF documents up to 10MB
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}