"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Upload
} from 'lucide-react'
import Navbar from '../components/utils/navbar'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTranslations: 0,
    recentDocuments: [],
    processingStatus: 'idle',
    activeJobs: 0,
    successRate: 0,
    avgProcessingTime: 0
  })

  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalTranslations: 247,
        activeJobs: 3,
        successRate: 94.8,
        avgProcessingTime: 2.3,
        recentDocuments: [
          { 
            id: 1, 
            name: 'nepali_contract.pdf', 
            status: 'completed', 
            date: '2024-03-22',
            language: 'Nepali',
            size: '2.4 MB',
            progress: 100
          },
          { 
            id: 2, 
            name: 'sinhala_manuscript.jpg', 
            status: 'processing', 
            date: '2024-03-22',
            language: 'Sinhalese',
            size: '1.8 MB',
            progress: 68
          },
          { 
            id: 3, 
            name: 'nepali_letter.docx', 
            status: 'completed', 
            date: '2024-03-21',
            language: 'Nepali',
            size: '0.9 MB',
            progress: 100
          },
          { 
            id: 4, 
            name: 'sinhala_book_page.png', 
            status: 'failed', 
            date: '2024-03-21',
            language: 'Sinhalese',
            size: '3.2 MB',
            progress: 0
          },
          { 
            id: 5, 
            name: 'nepali_form.pdf', 
            status: 'queued', 
            date: '2024-03-22',
            language: 'Nepali',
            size: '1.1 MB',
            progress: 0
          }
        ],
        processingStatus: 'active'
      })
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1000)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar></Navbar>
      
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
                +12 from last week
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
                Latest translation jobs and their current status
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
                          <p className="font-medium text-slate-900 truncate">{doc.name}</p>
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
                        {doc.status === 'completed' && (
                          <Button variant="ghost" size="sm">
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
    </div>
  )
}