import type { SEOAnalysis as SEOAnalysisType, SEOData, SEOIssue } from '../types/seo';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaThumbsUp,
  FaClipboardList,
  FaExclamationTriangle,
  FaGoogle, // For SEO
  FaShareSquare, // For SMO
  FaClipboardCheck, // Replaced FaListCheck
} from 'react-icons/fa';

interface Props {
  analysis: SEOAnalysisType;
  rawData: SEOData; // We need rawData to count passed checks
}

const SEO_FIELDS: (keyof SEOData)[] = ['title', 'description', 'keywords', 'canonical', 'robots', 'viewport', 'charset', 'language', 'author', 'favicon'];
const SMO_FIELDS: (keyof SEOData)[] = ['ogTitle', 'ogDescription', 'ogImage', 'twitterCard', 'twitterTitle', 'twitterDescription', 'twitterImage'];

// Helper function to count how many of the specified fields are present in the rawData
const countPresentFields = (data: SEOData, fields: (keyof SEOData)[]) => {
  let count = 0;
  if (!data) return 0; // Guard against null or undefined data
  for (const field of fields) {
    const value = data[field];
    if (value) {
      if (Array.isArray(value) && value.length === 0) {
        // Special case for empty arrays (like keywords) - don't count as present for a pass
        continue;
      }
      if (typeof value === 'string' && value.trim() === '') {
        // Special case for empty strings - don't count as present for a pass
        continue;
      }
      count++;
    }
  }
  return count;
};

export function SEOAnalysis({ analysis, rawData }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getScoreDescriptionText = (score: number) => {
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
        return <FaExclamationTriangle className="text-red-500 text-2xl flex-shrink-0" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500 text-2xl flex-shrink-0" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 text-2xl flex-shrink-0" />;
    }
  };

  const getIssuePriorityText = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return 'High Priority';
      case 'warning': return 'Medium Priority';
      case 'info': return 'Low Priority';
    }
  };

  const getIssueCardStyle = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return 'border-l-4 border-red-500 bg-red-50';
      case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  // Categorize Issues
  const seoIssues = analysis.issues.filter(issue => SEO_FIELDS.includes(issue.field as keyof SEOData));
  const smoIssues = analysis.issues.filter(issue => SMO_FIELDS.includes(issue.field as keyof SEOData));

  // Categorize Recommendations (simple keyword based)
  const seoRecommendations = analysis.recommendations.filter(
    rec => !rec.toLowerCase().includes('open graph') && !rec.toLowerCase().includes('twitter card')
  );
  const smoRecommendations = analysis.recommendations.filter(
    rec => rec.toLowerCase().includes('open graph') || rec.toLowerCase().includes('twitter card')
  );

  // Calculate stats for SEO
  const seoErrors = seoIssues.filter(i => i.type === 'error').length;
  const seoWarnings = seoIssues.filter(i => i.type === 'warning').length;
  const seoPresentFields = countPresentFields(rawData, SEO_FIELDS);
  const seoFieldsWithIssues = new Set(seoIssues.map(i => i.field));
  const seoPassedChecks = SEO_FIELDS.reduce((acc, field) => {
    if (rawData && rawData[field] && (typeof rawData[field] !== 'string' || (rawData[field] as string).trim() !== '') && 
        !(field === 'keywords' && Array.isArray(rawData[field]) && (rawData[field] as string[]).length === 0) && 
        !seoFieldsWithIssues.has(field)) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // Calculate stats for SMO
  const smoErrors = smoIssues.filter(i => i.type === 'error').length;
  const smoWarnings = smoIssues.filter(i => i.type === 'warning').length;
  const smoPresentFields = countPresentFields(rawData, SMO_FIELDS);
  const smoFieldsWithIssues = new Set(smoIssues.map(i => i.field));
  const smoPassedChecks = SMO_FIELDS.reduce((acc, field) => {
    if (rawData && rawData[field] && (typeof rawData[field] !== 'string' || (rawData[field] as string).trim() !== '') && 
        !(field === 'keywords' && Array.isArray(rawData[field]) && (rawData[field] as string[]).length === 0) && // Though keywords not in SMO, good to keep logic consistent
        !smoFieldsWithIssues.has(field)) {
      return acc + 1;
    }
    return acc;
  }, 0);
  
  const totalErrors = analysis.issues.filter(i => i.type === 'error').length;
  const totalWarnings = analysis.issues.filter(i => i.type === 'warning').length;

  const scorePercentage = analysis.score;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  const renderIssueList = (issues: SEOIssue[], categoryName: string) => {
    if (issues.length === 0) {
      return (
        <div className="p-4 my-4 text-sm text-green-700 bg-green-50 rounded-lg flex items-center">
          <FaCheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          No {categoryName.toLowerCase()} issues found.
        </div>
      );
    }
    return (
      <div className="space-y-4 mt-4">
        {issues.map((issue, index) => (
          <div
            key={`${issue.field}-${categoryName}-${index}`}
            className={`${getIssueCardStyle(issue.type)} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIssueIcon(issue.type)}</div>
              <div className="flex-1 min-w-0"> {/* Added min-w-0 for better flex truncation */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-700 break-words mr-2">
                    {issue.message}
                  </h3>
                  <span className={`text-xs whitespace-nowrap font-medium px-2.5 py-1 rounded-full mt-1 sm:mt-0 ${
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
    );
  };

  const renderRecommendationList = (recommendations: string[], categoryName: string) => {
    if (recommendations.length === 0) {
      return (
        <div className="p-4 my-4 text-sm text-gray-500 bg-gray-50 rounded-lg flex items-center">
          <FaInfoCircle className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
          No specific {categoryName.toLowerCase()} recommendations.
        </div>
      );
    }
    return (
      <div className="space-y-3 mt-4">
        {recommendations.map((recommendation, index) => (
          <div key={`${categoryName}-rec-${index}`} className="flex items-start gap-3 bg-blue-50 p-3.5 rounded-lg border-l-4 border-blue-400 shadow-sm">
            <FaClipboardList className="text-blue-500 mt-1 text-xl flex-shrink-0" />
            <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
              <p className="font-medium text-gray-700 break-words">{recommendation}</p>
              {getRecommendationDetails(recommendation)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Score Section */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-gray-800">Overall Analysis Summary</h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">{getScoreDescriptionText(analysis.score)}</p>
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-gray-200 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
              <circle className={`${getScoreRingColor(analysis.score)} stroke-current`} strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 50 50)"></circle>
              <text x="50" y="50" fontFamily="Verdana, sans-serif" fontSize="20" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" className={getScoreColor(analysis.score)}>{analysis.score}</text>
            </svg>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm w-full lg:w-auto">
            <div className="flex items-center p-3 bg-red-50 rounded-lg shadow-sm border border-red-100">
              <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-base sm:text-lg text-red-600">{totalErrors} Total Error(s)</div>
                <div className="text-xs text-gray-500 truncate">Critical issues needing attention</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg shadow-sm border border-yellow-100">
              <FaExclamationCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-base sm:text-lg text-yellow-600">{totalWarnings} Total Warning(s)</div>
                <div className="text-xs text-gray-500 truncate">Potential issues to review</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
              <FaThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-base sm:text-lg text-blue-600">{analysis.recommendations.length} Recommendation(s)</div>
                <div className="text-xs text-gray-500 truncate">Suggestions for improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Engine Optimization Section */}
      <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-5">
            <FaGoogle className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-blue-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Search Engine Optimization</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-center">
            <div className="p-3 bg-red-50 rounded-lg shadow-sm border border-red-100">
                <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-red-500" />
                <div className="text-xl sm:text-2xl font-bold text-red-600">{seoErrors}</div>
                <div className="text-xs text-gray-500">Error(s)</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg shadow-sm border border-yellow-100">
                <FaExclamationCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-yellow-500" />
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">{seoWarnings}</div>
                <div className="text-xs text-gray-500">Warning(s)</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg shadow-sm border border-green-100">
                <FaClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-green-500" />
                <div className="text-xl sm:text-2xl font-bold text-green-600">{seoPassedChecks}<span className="text-base text-gray-500">/{SEO_FIELDS.length}</span></div>
                <div className="text-xs text-gray-500">Checks Passed</div>
            </div>
        </div>
        <div>
            <h3 className="text-md sm:text-lg font-semibold text-gray-700 mt-4 pt-3 border-t border-gray-200">Identified SEO Issues</h3>
            {renderIssueList(seoIssues, "SEO")}
        </div>
        {seoRecommendations.length > 0 && (
          <div className="mt-5 sm:mt-6">
              <h3 className="text-md sm:text-lg font-semibold text-gray-700 pt-3 border-t border-gray-200">SEO Recommendations</h3>
              {renderRecommendationList(seoRecommendations, "SEO")}
          </div>
        )}
      </div>

      {/* Social Media Optimization Section */}
      <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6">
         <div className="flex items-center mb-4 sm:mb-5">
            <FaShareSquare className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-purple-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Social Media Optimization</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-center">
            <div className="p-3 bg-red-50 rounded-lg shadow-sm border border-red-100">
                <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-red-500" />
                <div className="text-xl sm:text-2xl font-bold text-red-600">{smoErrors}</div>
                <div className="text-xs text-gray-500">Error(s)</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg shadow-sm border border-yellow-100">
                <FaExclamationCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-yellow-500" />
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">{smoWarnings}</div>
                <div className="text-xs text-gray-500">Warning(s)</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg shadow-sm border border-green-100">
                <FaClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-green-500" />
                <div className="text-xl sm:text-2xl font-bold text-green-600">{smoPassedChecks}<span className="text-base text-gray-500">/{SMO_FIELDS.length}</span></div>
                <div className="text-xs text-gray-500">Checks Passed</div>
            </div>
        </div>
        <div>
            <h3 className="text-md sm:text-lg font-semibold text-gray-700 mt-4 pt-3 border-t border-gray-200">Identified SMO Issues</h3>
            {renderIssueList(smoIssues, "SMO")}
        </div>
        {smoRecommendations.length > 0 && (
          <div className="mt-5 sm:mt-6">
              <h3 className="text-md sm:text-lg font-semibold text-gray-700 pt-3 border-t border-gray-200">SMO Recommendations</h3>
              {renderRecommendationList(smoRecommendations, "Social Media")}
          </div>
        )}
      </div>

      {analysis.issues.length === 0 && analysis.recommendations.length === 0 && (
         <div className="bg-green-50 p-6 rounded-xl shadow-lg flex items-center gap-4 border border-green-200">
            <FaCheckCircle className="text-green-500 text-3xl flex-shrink-0" />
            <div className="min-w-0">
                <h2 className="text-xl font-bold text-green-700">All Clear!</h2>
                <p className="text-green-600">No SEO or SMO issues found. Your website looks great!</p>
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
      <p className="text-sm text-gray-500 mt-1 break-words">
        Ensure OG tags (og:title, og:description, og:image) are present and optimized for platforms like Facebook and LinkedIn.
      </p>
    );
  }
  if (recommendation.toLowerCase().includes('twitter card')) {
    return (
      <p className="text-sm text-gray-500 mt-1 break-words">
        Implement Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) for better appearance on Twitter.
      </p>
    );
  }
  return null;
} 