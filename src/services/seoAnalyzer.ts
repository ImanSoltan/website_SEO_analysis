import axios from 'axios';
import type { SEOData, SEOAnalysis, SEOIssue } from '../types/seo';

export async function fetchWebsiteData(url: string): Promise<SEOData> {
  try {
    // Using cors.sh as a more reliable CORS proxy
    const corsProxy = 'https://cors.sh/';
    const response = await axios.get(`${corsProxy}${url}`, {
      headers: {
        'x-cors-api-key': 'temp_f0e6a1fcacf0b73ab3c81a36d63d3915', // Free tier API key
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    
    const html = response.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const seoData: SEOData = {
      title: getMetaContent(doc, 'title') || doc.title || '',
      description: getMetaContent(doc, 'description'),
      keywords: getMetaContent(doc, 'keywords').split(',').map(k => k.trim()).filter(Boolean),
      ogTitle: getMetaContent(doc, 'og:title'),
      ogDescription: getMetaContent(doc, 'og:description'),
      ogImage: getMetaContent(doc, 'og:image'),
      twitterCard: getMetaContent(doc, 'twitter:card'),
      twitterTitle: getMetaContent(doc, 'twitter:title'),
      twitterDescription: getMetaContent(doc, 'twitter:description'),
      twitterImage: getMetaContent(doc, 'twitter:image'),
      canonical: getCanonicalUrl(doc),
      robots: getMetaContent(doc, 'robots'),
      viewport: getMetaContent(doc, 'viewport'),
      charset: getCharset(doc),
      language: getLanguage(doc),
      author: getMetaContent(doc, 'author'),
      favicon: getFavicon(doc, url),
    };

    return seoData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      } else if (error.response?.status === 403) {
        throw new Error('Access to this website is forbidden. Please try another URL.');
      } else if (error.response?.status === 404) {
        throw new Error('Website not found. Please check the URL and try again.');
      } else if (!error.response) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
    }
    throw new Error('Failed to analyze the website. Please try again.');
  }
}

export function analyzeSEO(data: SEOData): SEOAnalysis {
  const issues: SEOIssue[] = [];
  const recommendations: string[] = [];

  // Title analysis
  if (!data.title) {
    issues.push({ type: 'error', message: 'Missing title tag', field: 'title' });
  } else if (data.title.length < 30 || data.title.length > 60) {
    issues.push({
      type: 'warning',
      message: 'Title length should be between 30-60 characters',
      field: 'title',
    });
  }

  // Description analysis
  if (!data.description) {
    issues.push({ type: 'error', message: 'Missing meta description', field: 'description' });
  } else if (data.description.length < 120 || data.description.length > 160) {
    issues.push({
      type: 'warning',
      message: 'Description length should be between 120-160 characters',
      field: 'description',
    });
  }

  // Keywords analysis
  if (!data.keywords.length) {
    issues.push({ type: 'warning', message: 'Missing meta keywords', field: 'keywords' });
  }

  // Open Graph analysis
  if (!data.ogTitle || !data.ogDescription || !data.ogImage) {
    issues.push({
      type: 'warning',
      message: 'Missing Open Graph meta tags',
      field: 'ogTitle',
    });
    recommendations.push('Add Open Graph meta tags for better social media sharing');
  }

  // Twitter Card analysis
  if (!data.twitterCard || !data.twitterTitle || !data.twitterDescription || !data.twitterImage) {
    issues.push({
      type: 'warning',
      message: 'Missing Twitter Card meta tags',
      field: 'twitterCard',
    });
    recommendations.push('Add Twitter Card meta tags for better Twitter sharing');
  }

  // Calculate score based on issues
  const score = calculateScore(issues);

  return {
    score,
    issues,
    recommendations,
  };
}

function getMetaContent(doc: Document, name: string): string {
  const metaTag = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return metaTag?.getAttribute('content') || '';
}

function getCanonicalUrl(doc: Document): string {
  const canonicalTag = doc.querySelector('link[rel="canonical"]');
  return canonicalTag?.getAttribute('href') || '';
}

function getCharset(doc: Document): string {
  const charsetTag = doc.querySelector('meta[charset]');
  return charsetTag?.getAttribute('charset') || '';
}

function getLanguage(doc: Document): string {
  const htmlTag = doc.querySelector('html');
  return htmlTag?.getAttribute('lang') || '';
}

function getFavicon(doc: Document, baseUrl: string): string {
  const faviconTag = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  const faviconHref = faviconTag?.getAttribute('href') || '/favicon.ico';
  
  if (faviconHref.startsWith('http')) {
    return faviconHref;
  }
  
  const url = new URL(baseUrl);
  return `${url.origin}${faviconHref}`;
}

function calculateScore(issues: SEOIssue[]): number {
  let score = 100;
  
  issues.forEach(issue => {
    if (issue.type === 'error') {
      score -= 15;
    } else if (issue.type === 'warning') {
      score -= 5;
    }
  });

  return Math.max(0, Math.min(100, score));
} 