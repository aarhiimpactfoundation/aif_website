// API configuration for both local development and Vercel deployment
// On Vercel, both frontend and API are on the same domain, so we use relative URLs
// In local development, we use the REACT_APP_BACKEND_URL environment variable

export const getApiUrl = () => {
  // If REACT_APP_BACKEND_URL is set, use it (local development)
  // Otherwise, use empty string for relative URLs (Vercel production)
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  // If we're on Vercel (production), use relative URLs
  if (!backendUrl || backendUrl === '') {
    return '';
  }
  
  return backendUrl;
};

// Helper for making API calls
export const apiUrl = (path) => {
  const baseUrl = getApiUrl();
  // Ensure path starts with /api
  const apiPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`;
  return `${baseUrl}${apiPath}`;
};

export default getApiUrl;
