"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  Languages,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Upload,
  Eye,
  X,
  FileImage,
  FileType
} from 'lucide-react'
import Navbar from '../components/utils/navbar'
import { supabaseBrowser } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTranslations: 0,
    recentDocuments: [],
    processingStatus: 'idle',
    activeJobs: 0,
    successRate: 0,
    avgProcessingTime: 0
  })
  const [translations, setTranslations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [previewContent, setPreviewContent] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: translationsData, error } = await supabaseBrowser()
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTranslations(translationsData)

      // Calculate stats from real data
      const completedJobs = translationsData.filter(t => t.status === 'completed').length
      const totalJobs = translationsData.length
      const avgTime = translationsData
        .filter(t => t.status === 'completed' && t.processing_time)
        .reduce((acc, t) => acc + t.processing_time, 0) / (completedJobs || 1)

      const newStats = {
        totalTranslations: totalJobs,
        activeJobs: translationsData.filter(t => t.status === 'processing').length,
        recentDocuments: translationsData.slice(0, 5).map(t => ({
          id: t.id,
          name: t.file_name || 'Untitled Document',
          status: t.status || 'completed',
          date: new Date(t.created_at).toISOString().split('T')[0],
          language: t.original_language || 'Unknown',
          size: t.file_size ? `${(t.file_size / 1024).toFixed(1)} KB` : 'N/A',
          progress: t.status === 'processing' ? (t.progress || 68) : 100,
          filePath: t.file_path,
          originalText: t.original_text,
          translatedText: t.translated_text,
          fileType: t.file_type || 'text'
        })),
        processingStatus: translationsData.some(t => t.status === 'processing') ? 'active' : 'idle',
        avgProcessingTime: Number(avgTime.toFixed(1)) || 2.3,
        successRate: totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0
      }

      setStats(newStats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = async (doc) => {
    setPreviewFile(doc)
    setPreviewLoading(true)
    setPreviewContent('')

    try {
      // If we have text content in database, use it
      if (doc.originalText || doc.translatedText) {
        setPreviewContent({
          original: doc.translatedText || 'Translation not available',
          translated: doc.originalText || 'No original text available'
        })
        setPreviewLoading(false)
        return
      }

      // Otherwise, try to fetch from file
      if (doc.filePath) {
        const s = supabaseBrowser()
        const { data, error } = await s
          .storage
          .from('SIH25')
          .download(doc.filePath)

        if (error) throw error

        const text = await data.text()
        setPreviewContent({
          original: text.substring(0, 2000) + (text.length > 2000 ? '...' : ''),
          translated: 'Translation not available'
        })
      } else {
        setPreviewContent({
          original: 'File content not available',
          translated: 'Translation not available'
        })
      }
    } catch (error) {
      console.error('Error loading preview:', error)
      setPreviewContent({
        original: 'Error loading file content',
        translated: 'Translation not available'
      })
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleDownload = async (filePath) => {
    if (!filePath) return
    try {
      const s = supabaseBrowser()
      const { data, error } = await s
        .storage
        .from('SIH25')
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = filePath.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      setError('Failed to download file. Please try again.')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
      queued: 'outline'
    }
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    )
  }

  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return <FileImage className="h-4 w-4" />
    }
    return <FileType className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Translation Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Monitor and manage your Nepali/Sinhalese text translations
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Last updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : '--:--:--'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Translations
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.totalTranslations.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.successRate}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active Jobs
              </CardTitle>
              <Activity className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.activeJobs}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Currently processing
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg. Processing Time
              </CardTitle>
              <Clock className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.avgProcessingTime}m
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Per document
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Alert */}
        {stats.processingStatus === 'active' && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>System Active:</strong> Currently processing {stats.activeJobs} documents.
              Processing times may be slightly longer than usual.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
              <CardDescription>
                Latest translation jobs and their current status (click file name to preview)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentDocuments.map((doc, index) => (
                <div key={doc.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="font-medium text-slate-900 hover:text-blue-600 cursor-pointer transition-colors truncate text-left"
                          >
                            {doc.name}
                          </button>
                          {getStatusBadge(doc.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-2">
                          <span className="flex items-center">
                            <Languages className="h-3 w-3 mr-1" />
                            {doc.language}
                          </span>
                          <span>{doc.size}</span>
                          <span>{doc.date}</span>
                        </div>
                        {doc.status === 'processing' && (
                          <div className="flex items-center space-x-2">
                            <Progress value={doc.progress} className="flex-1 h-2" />
                            <span className="text-sm text-slate-600 min-w-0">{doc.progress}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePreview(doc)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {doc.status === 'completed' && doc.filePath && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownload(doc.filePath)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < stats.recentDocuments.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Language Support & Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Supported Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Nepali</p>
                    <p className="text-sm text-slate-600">नेपाली भाषा</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sinhalese</p>
                    <p className="text-sm text-slate-600">සිංහල භාෂාව</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Translations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-3">
                {getFileTypeIcon(previewFile.fileType)}
                <div>
                  <CardTitle className="text-lg">{previewFile.name}</CardTitle>
                  <CardDescription>
                    {previewFile.language} • {previewFile.size} • {previewFile.date}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(previewFile.status)}
                <Button variant="ghost" size="sm" onClick={() => setPreviewFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {previewLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Translated Text</Badge>
                    <span className="text-sm text-slate-500">(English)</span>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {typeof previewContent === 'object' ? previewContent.original : 'Translation not available'}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}