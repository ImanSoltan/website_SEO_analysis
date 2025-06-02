import type { SEOAnalysis as SEOAnalysisType } from '../types/seo';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

interface Props {
  analysis: SEOAnalysisType;
}

export function SEOAnalysis({ analysis }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-xl font-semibold">SEO Score</h2>
          <p className="text-gray-500">Based on best practices</p>
        </div>
        <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
          {analysis.score}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Issues Found</h2>
        <div className="space-y-4">
          {analysis.issues.map((issue, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <div className="mt-1">
                {getIssueIcon(issue.type)}
              </div>
              <div>
                <p className="font-medium">{issue.message}</p>
                <p className="text-sm text-gray-500">Field: {issue.field}</p>
              </div>
            </div>
          ))}
          {analysis.issues.length === 0 && (
            <div className="flex items-center gap-2 text-green-500">
              <FaCheckCircle />
              <span>No issues found!</span>
            </div>
          )}
        </div>
      </div>

      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 