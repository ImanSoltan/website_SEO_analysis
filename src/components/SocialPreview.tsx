import type { SEOData } from '../types/seo';

interface PreviewProps {
  type: 'google' | 'facebook' | 'twitter';
  data: SEOData;
}

export function SocialPreview({ type, data }: PreviewProps) {
  const getPreviewContent = () => {
    switch (type) {
      case 'google':
        return (
          <div className="max-w-2xl">
            <div className="text-blue-600 text-xl hover:underline cursor-pointer truncate">
              {data.title}
            </div>
            <div className="text-green-700 text-sm truncate">
              {window.location.origin}
            </div>
            <div className="text-gray-600 text-sm line-clamp-2">
              {data.description}
            </div>
          </div>
        );
      
      case 'facebook':
        return (
          <div className="max-w-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white">
            {data.ogImage && (
              <img
                src={data.ogImage}
                alt={data.ogTitle || data.title}
                className="w-full h-[261px] object-cover"
              />
            )}
            <div className="p-3">
              <div className="text-gray-500 text-xs uppercase tracking-wide">
                {window.location.hostname}
              </div>
              <h3 className="font-bold text-base mt-1">
                {data.ogTitle || data.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {data.ogDescription || data.description}
              </p>
            </div>
          </div>
        );
      
      case 'twitter':
        return (
          <div className="max-w-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white">
            {data.twitterImage && (
              <img
                src={data.twitterImage}
                alt={data.twitterTitle || data.title}
                className="w-full h-[261px] object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="font-bold text-base">
                {data.twitterTitle || data.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {data.twitterDescription || data.description}
              </p>
              <div className="text-gray-500 text-xs mt-2">
                {window.location.hostname}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="preview-container p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-3 capitalize">{type} Preview</h2>
      {getPreviewContent()}
    </div>
  );
} 