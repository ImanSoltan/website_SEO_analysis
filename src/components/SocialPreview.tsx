import type { SEOData } from '../types/seo';

interface PreviewProps {
  type: 'google' | 'facebook' | 'twitter';
  data: SEOData;
}

export function SocialPreview({ type, data }: PreviewProps) {
  const getPreviewContent = () => {
    // Helper to create a placeholder if essential data is missing
    const createPlaceholder = (message: string) => (
      <div className="text-center text-gray-500 text-xs p-4 bg-gray-100 rounded-md h-full flex items-center justify-center">
        {message}
      </div>
    );

    switch (type) {
      case 'google':
        return (
          <div className="max-w-2xl w-full p-2">
            <div className="text-blue-600 text-lg sm:text-xl hover:underline cursor-pointer truncate">
              {data.title || createPlaceholder('Title tag not found')}
            </div>
            <div className="text-green-700 text-xs sm:text-sm truncate mt-0.5">
              {data.canonical || new URL(window.location.href).hostname}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm line-clamp-2 break-words mt-1">
              {data.description || createPlaceholder('Meta description not found')}
            </div>
          </div>
        );
      
      case 'facebook':
        if (!data.ogTitle && !data.ogDescription && !data.ogImage) {
          return createPlaceholder('Open Graph tags (og:title, og:description, og:image) not found. Add them for a better Facebook preview.');
        }
        return (
          <div className="w-full max-w-[480px] border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
            {data.ogImage ? (
              <img
                src={data.ogImage}
                alt={data.ogTitle || data.title || 'Facebook Preview Image'}
                className="w-full h-auto aspect-[1.91/1] object-cover bg-gray-100"
              />
            ) : (
              <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center text-gray-400 text-xs p-2">
                og:image not found
              </div>
            )}
            <div className="p-2.5 flex-grow flex flex-col justify-between">
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide truncate">
                  {new URL(data.canonical || window.location.href).hostname}
                </div>
                <h3 className="font-bold text-sm sm:text-base mt-1 truncate break-words">
                  {data.ogTitle || data.title || <span className="text-gray-500 font-normal">og:title not found</span>}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 break-words flex-grow">
                  {data.ogDescription || data.description || <span className="text-gray-500">og:description not found</span>}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'twitter':
        if (!data.twitterTitle && !data.twitterDescription && !data.twitterImage && !data.twitterCard) {
           return createPlaceholder('Twitter Card tags (e.g., twitter:title, twitter:description, twitter:image) not found. Add them for a better Twitter preview.');
        }
        return (
          <div className="w-full max-w-[480px] border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
            {data.twitterImage ? (
              <img
                src={data.twitterImage}
                alt={data.twitterTitle || data.title || 'Twitter Preview Image'}
                className="w-full h-auto aspect-[1.91/1] object-cover bg-gray-100"
              />
            ) : (
              <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center text-gray-400 text-xs p-2">
                twitter:image not found
              </div>
            )}
            <div className="p-2.5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base truncate break-words">
                  {data.twitterTitle || data.title || <span className="text-gray-500 font-normal">twitter:title not found</span>}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 break-words flex-grow">
                  {data.twitterDescription || data.description || <span className="text-gray-500">twitter:description not found</span>}
                </p>
              </div>
              <div className="text-gray-500 text-xs mt-2 truncate">
                {new URL(data.canonical || window.location.href).hostname}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="preview-container bg-gray-50 rounded-lg w-full h-full flex flex-col">
      <div className="flex justify-center items-center flex-grow w-full p-1">
        {getPreviewContent()}
      </div>
    </div>
  );
} 