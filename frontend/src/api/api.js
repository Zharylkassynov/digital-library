// In dev, use relative URLs so Vite proxy forwards to backend (localhost:5000)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';
const IMAGES_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/images`
  : '/images';

export const getImageUrl = (filename) => {
  if (!filename) return null;
  // Backend may return full path (/images/books/...) or just filename
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${IMAGES_BASE}/books/${filename}`;
};

export const fetchResources = async (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.type) searchParams.set('type', params.type);
  const query = searchParams.toString();
  const url = query ? `${API_BASE}/resources?${query}` : `${API_BASE}/resources`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
};

export const fetchResourceById = async (id) => {
  const res = await fetch(`${API_BASE}/resources/${id}`);
  if (!res.ok) throw new Error('Failed to fetch resource');
  return res.json();
};

export const fetchRandomResources = async () => {
  const res = await fetch(`${API_BASE}/resources/random`);
  if (!res.ok) throw new Error('Failed to fetch random resources');
  return res.json();
};

const ORIGIN = import.meta.env.VITE_API_URL || '';

export const checkHealth = async () => {
  const res = await fetch(`${ORIGIN}/api/health`);
  return res.ok;
};
