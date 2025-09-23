import { Button } from "@/components/ui/button"
import { FileText, Languages, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/utils/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Translate Nepali & Sinhalese Text <br />
          <span className="text-blue-600">with AI Precision</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Transform your documents from Nepali (नेपाली) and Sinhalese (සිංහල) to English instantly using advanced AI technology.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/Dashboard">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Powerful Translation Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
              <Languages className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Languages</h3>
              <p className="text-slate-600">
                Support for both Nepali and Sinhalese languages with accurate translations.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Document Processing</h3>
              <p className="text-slate-600">
                Handle various document formats including PDFs, images, and scanned texts.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
              <p className="text-slate-600">
                AI-powered translations maintaining context and cultural nuances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Translating?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in making Nepali and Sinhalese literature accessible to a global audience.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              Try It Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}