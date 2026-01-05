import React from 'react';
import { useSongs } from '../Contex/SongContext';

const Classical = () => {
  const { songs, loading, playSong } = useSongs();

  const composers = (songs || []).filter(s => s && s.source === 'openopus');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Classical Composers</h2>
      {loading && <p>Loading composers…</p>}
      {!loading && composers.length === 0 && <p>No composers available.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {composers.map(c => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition">
            <img src={c.cover} alt={c.title} className="w-full h-48 object-cover" />
            <div className="p-3">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.artist || 'Classical'}</p>
              <div className="mt-3">
                {c.audio ? (
                  <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => playSong(c)}>Play Preview</button>
                ) : (
                  <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed" disabled>Preview not available</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classical;
