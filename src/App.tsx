import { useState } from 'react'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import type { SEOData, SEOAnalysis as SEOAnalysisType } from './types/seo'
import { fetchWebsiteData, analyzeSEO } from './services/seoAnalyzer'
import { SocialPreview } from './components/SocialPreview'
import { SEOAnalysis } from './components/SEOAnalysis'
import './App.css'

function App() {
  const [url, setUrl] = useState('https://')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [analysis, setAnalysis] = useState<SEOAnalysisType | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!url.startsWith('http')) {
        throw new Error('Please enter a valid URL starting with http:// or https://')
      }

      const data = await fetchWebsiteData(url)
      setSeoData(data)
      const analysisResult = analyzeSEO(data)
      setAnalysis(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the website')
      setSeoData(null)
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Website SEO Analyzer
            </h1>
            <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <FaSearch className="h-5 w-5 sm:mr-2" />
                      <span className="hidden sm:inline">Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
                {error}
              </div>
            )}
          </div>

          {seoData && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Google Preview</h2>
                  <SocialPreview type="google" data={seoData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Facebook Preview</h2>
                  <SocialPreview type="facebook" data={seoData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-1 md:col-span-2 lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Twitter Preview</h2>
                  <SocialPreview type="twitter" data={seoData} />
                </div>
              </div>

              {analysis && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <SEOAnalysis analysis={analysis} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
