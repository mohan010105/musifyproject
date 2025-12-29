// Frontend API client for user history (uses JWT from localStorage)
// Prefer explicit VITE_API_BASE; otherwise use production URL when PROD is truthy, else localhost
const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.PROD ? 'https://your-backend-url.com' : 'http://localhost:5000');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
};

export const fetchHistory = async () => {
  const res = await fetch(`${API_BASE}/api/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to fetch history');
  }
  const body = await res.json();
  return body;
};

export const toggleLike = async (songId) => {
  const res = await fetch(`${API_BASE}/api/history/like/${songId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to toggle like');
  }
  return res.json();
};

export const recordPlay = async (payload) => {
  const res = await fetch(`${API_BASE}/api/history/play`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to record play');
  }
  return res.json();
};

export default { fetchHistory, toggleLike, recordPlay };