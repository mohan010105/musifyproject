const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function normalizeSong(raw) {
  if (!raw) return null;
  const id = raw.id || raw._id || raw.songId || raw.id;
  const title = raw.title || raw.name || '';
  const artist = raw.artist || raw.artistName || '';
  const album = raw.album || raw.albumName || '';
  const genre = raw.genre || '';
  let audioUrl = raw.audioUrl || raw.audio || raw.url || raw.file || '';
  if (typeof audioUrl === 'string' && audioUrl.startsWith('/')) audioUrl = `${API_BASE}${audioUrl}`;
  // Firestore timestamp normalization
  let createdAt = raw.createdAt || raw.created_at || raw.timestamp || null;
  if (createdAt && typeof createdAt === 'object' && (createdAt.seconds || createdAt._seconds)) {
    const seconds = createdAt.seconds || createdAt._seconds;
    createdAt = new Date(seconds * 1000).toISOString();
  }
  if (createdAt && typeof createdAt === 'number') createdAt = new Date(createdAt).toISOString();

  return {
    id,
    title,
    artist,
    album,
    genre,
    audioUrl,
    coverArt: raw.coverArt || raw.cover || raw.image || null,
    createdAt,
    raw,
  };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getSongs(options = {}) {
  const { signal, forceRefresh = false } = options;
  const url = `${API_BASE}/api/songs`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await safeJson(res);
    const err = new Error(body?.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const json = await safeJson(res);
  let data = [];
  if (Array.isArray(json)) data = json;
  else if (json && Array.isArray(json.data)) data = json.data;
  else if (json && Array.isArray(json.songs)) data = json.songs;
  return data.map(normalizeSong).filter(Boolean);
}

export async function searchSongs(q, options = {}) {
  const { signal } = options;
  if (!q || q.trim() === '') return [];
  const url = `${API_BASE}/api/songs/search?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    return [];
  }
  const json = await safeJson(res);
  let data = [];
  if (Array.isArray(json)) data = json;
  else if (json && Array.isArray(json.data)) data = json.data;
  return data.map(normalizeSong).filter(Boolean);
}

export default {
  API_BASE,
  getSongs,
  searchSongs,
};
