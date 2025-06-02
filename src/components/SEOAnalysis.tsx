import type { SEOAnalysis as SEOAnalysisType } from '../types/seo';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaChartLine,
  FaShareAlt,
  FaSearch,
  FaThumbsUp,
  FaClipboardList,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface Props {
  analysis: SEOAnalysisType;
}

export function SEOAnalysis({ analysis }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent! Your website is well-optimized.';
    if (score >= 70) return 'Good, but some areas need improvement.';
    return 'Needs significant improvement for better SEO.';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 90) return 'stroke-green-500';
    if (score >= 70) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <FaExclamationCircle className="text-red-500 text-2xl" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500 text-2xl" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 text-2xl" />;
    }
  };

  const getIssuePriorityText = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'High Priority';
      case 'warning':
        return 'Medium Priority';
      case 'info':
        return 'Low Priority';
    }
  };

  const getIssueCardStyle = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const numErrors = analysis.issues.filter(issue => issue.type === 'error').length;
  const numWarnings = analysis.issues.filter(issue => issue.type === 'warning').length;
  const numRecommendations = analysis.recommendations.length;

  const scorePercentage = analysis.score;
  const circumference = 2 * Math.PI * 40; // 2 * pi * radius (radius is 40)
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Score Section */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">Overall SEO Health</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">{getScoreDescription(analysis.score)}</p>
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              {/* Progress Circle */}
              <circle
                className={`${getScoreRingColor(analysis.score)} stroke-current`}
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              ></circle>
              {/* Score Text */}
              <text
                x="50"
                y="50"
                fontFamily="Verdana"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                className={getScoreColor(analysis.score)}
              >
                {analysis.score}
              </text>
            </svg>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 text-sm sm:text-base">
            <div className="flex items-center p-3 bg-red-50 rounded-lg shadow-sm">
              <FaExclamationTriangle className="w-5 h-5 mr-3 text-red-500" />
              <div>
                <div className="font-semibold text-red-700">{numErrors} Errors</div>
                <div className="text-xs text-gray-500">High impact issues</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg shadow-sm">
              <FaExclamationCircle className="w-5 h-5 mr-3 text-yellow-500" />
              <div>
                <div className="font-semibold text-yellow-700">{numWarnings} Warnings</div>
                <div className="text-xs text-gray-500">Medium impact issues</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg shadow-sm">
              <FaThumbsUp className="w-5 h-5 mr-3 text-blue-500" />
              <div>
                <div className="font-semibold text-blue-700">{numRecommendations} Recommendations</div>
                <div className="text-xs text-gray-500">Suggestions for improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights (Previously social/ranking icons) */}
      {analysis.issues.length > 0 && (
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Key Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <FaSearch className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="text-base font-semibold">Search Visibility</div>
              <p className="text-xs text-gray-500">How easily users find you.</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <FaChartLine className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="text-base font-semibold">Ranking Potential</div>
              <p className="text-xs text-gray-500">Your site's ability to rank.</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <FaShareAlt className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="text-base font-semibold">Social Sharing</div>
              <p className="text-xs text-gray-500">How content appears on social.</p>
            </div>
          </div>
        </div>
      )}

      {/* Issues Found Section */}
      {analysis.issues.length > 0 && (
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Issues to Address</h2>
          <div className="space-y-5">
            {analysis.issues.map((issue, index) => (
              <div
                key={index}
                className={`${getIssueCardStyle(issue.type)} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 break-words">{issue.message}</h3>
                      <span className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap mt-1 sm:mt-0 ${
                        issue.type === 'error' ? 'bg-red-200 text-red-700' :
                        issue.type === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-blue-200 text-blue-700'
                      }`}>
                        {getIssuePriorityText(issue.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 break-words">
                      {getIssueDescription(issue.field, issue.type)}
                    </p>
                    <div className="text-xs text-gray-500">
                      Field: <span className="font-medium text-gray-700">{issue.field}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.issues.length === 0 && (
         <div className="bg-green-50 p-6 rounded-xl shadow-lg flex items-center gap-4">
            <FaCheckCircle className="text-green-500 text-3xl" />
            <div>
                <h2 className="text-xl font-bold text-green-700">All Clear!</h2>
                <p className="text-green-600">No critical SEO issues found. Keep up the great work!</p>
            </div>
        </div>
      )}

      {/* Recommendations Section */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Recommendations</h2>
          <div className="space-y-4">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200">
                <FaClipboardList className="text-blue-500 mt-1 text-xl flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 break-words">{recommendation}</p>
                  {getRecommendationDetails(recommendation)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getIssueDescription(field: string, type: 'error' | 'warning' | 'info'): string {
  const descriptions: Record<string, string> = {
    title: 'The title tag is crucial for search engines and users to understand your page content. It should be concise and descriptive, ideally between 30-60 characters.',
    description: 'Meta descriptions appear in search results and should accurately summarize your page content to encourage clicks. Aim for 120-160 characters.',
    keywords: 'While less important for ranking today, meta keywords can still help categorize your content for some search engines or internal site search.',
    ogTitle: 'Open Graph (OG) title controls how your content appears when shared on social media like Facebook. Make it compelling.',
    ogDescription: 'The OG description provides a summary when shared on social media. It should be engaging and concise.',
    ogImage: 'An OG image makes your shared content more visually appealing on social platforms, increasing click-through rates.',
    twitterCard: 'Twitter Cards define how your content is displayed on Twitter, enabling rich media experiences.',
    twitterTitle: 'This title is used when your content is shared on Twitter. Keep it concise and relevant.',
    twitterDescription: 'The Twitter description summarizes your content on Twitter. Aim for engaging and informative text.',
    twitterImage: 'An image specifically for Twitter shares can significantly boost engagement.',
    canonical: 'A canonical URL specifies the preferred version of a web page, helping to prevent duplicate content issues.',
    robots: 'The robots meta tag instructs search engine crawlers on how to crawl or index page content.',
    viewport: 'The viewport meta tag ensures your page is responsive and displays correctly on all devices.',
    charset: 'Character set declaration ensures proper text rendering across different browsers and languages.',
    language: 'Declaring the page language helps search engines and browsers understand the content\'s language.',
    author: 'Specifying an author can be beneficial for credibility and is sometimes used by search engines.',
    favicon: 'A favicon is a small icon that represents your website in browser tabs and bookmarks, aiding brand recognition.'
  };
  return descriptions[field.toLowerCase()] || `This ${type} relates to the \'${field}\' field and is important for your site\'s SEO.`;
}

function getRecommendationDetails(recommendation: string): JSX.Element | null {
  if (recommendation.toLowerCase().includes('open graph')) {
    return (
      <p className="text-sm text-gray-600 mt-1 break-words">
        Ensure OG tags (og:title, og:description, og:image) are present and optimized for platforms like Facebook and LinkedIn.
      </p>
    );
  }
  if (recommendation.toLowerCase().includes('twitter card')) {
    return (
      <p className="text-sm text-gray-600 mt-1 break-words">
        Implement Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) for better appearance on Twitter.
      </p>
    );
  }
  return null;
} 