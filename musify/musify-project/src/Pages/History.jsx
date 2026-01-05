import React, { useEffect } from 'react';
import { useSongs } from '../Contex/SongContext';
import { fetchHistory as fetchHistoryFromServer } from '../services/historyService';

const resolveImage = (p) => p || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60';

const History = () => {
  const { history, setHistory, playSong } = useSongs();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if ((!history || history.length === 0) && setHistory) {
          const res = await fetchHistoryFromServer();
          if (!mounted) return;
          if (Array.isArray(res)) {
            const mapped = res.map(h => ({ id: h.id || h._id || h.songId, title: h.title || h.name, artist: h.artist || h.performer, cover: h.cover || h.image, source: h.source || 'server', ts: h.ts || Date.now() }));
            setHistory(mapped);
          }
        }
      } catch (e) {
        // ignore; we'll show client-side history if available
        console.warn('fetchHistory failed', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [history, setHistory]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
      {!history || history.length === 0 ? (
        <p className="text-gray-400">No history yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {history.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded">
              <img src={resolveImage(item.cover)} alt={item.title} className="w-12 h-12 object-cover rounded" />
              <div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-gray-500">{item.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
