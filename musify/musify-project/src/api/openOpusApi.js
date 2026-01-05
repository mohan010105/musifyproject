const BASE = 'https://api.openopus.org';

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('openOpusApi fetch error', err, url);
    return null;
  }
}

export async function fetchPopularComposers() {
  const json = await safeFetch(`${BASE}/composer/list/pop.json`);
  return (json && Array.isArray(json.composers)) ? json.composers : [];
}

export async function fetchAllComposers() {
  // Open Opus exposes a few composer lists; combine popular and recommended to form a broad set
  const [pop, rec] = await Promise.all([fetchPopularComposers(), safeFetch(`${BASE}/composer/list/rec.json`).then(j => j?.composers || [])]);
  const all = [...(pop || []), ...((rec && Array.isArray(rec)) ? rec : [])];
  // dedupe by id
  const seen = new Map();
  all.forEach(c => { if (c && c.id) seen.set(String(c.id), c); });
  return Array.from(seen.values());
}

export async function fetchComposerWorks(composerId) {
  if (!composerId) return [];
  const id = String(composerId).replace(/^openopus:/, '');
  const json = await safeFetch(`${BASE}/work/list/composer/${encodeURIComponent(id)}/genre/all.json`);
  return (json && Array.isArray(json.works)) ? json.works : [];
}

export default {
  fetchPopularComposers,
  fetchAllComposers,
  fetchComposerWorks
};
