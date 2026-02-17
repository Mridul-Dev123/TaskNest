
// Local: uses VITE_SERVER_URL (e.g. "http://localhost:5000")
// Production: defaults to "/api" which goes through Netlify's proxy to Railway
export const API_BASE_URL = import.meta.env.VITE_SERVER_URL
    ? `${import.meta.env.VITE_SERVER_URL}/api`
    : "/api";
