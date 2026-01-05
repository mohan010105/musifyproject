import React from 'react';
import { useSongs } from '../../../../Contex/SongContext';

const TopCharts = () => {
  const ctx = useSongs();
  const songs = ctx.songs || [];

  // Filter for top charts
  const topCharts = songs.filter(song => song.category === 'topcharts');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Top Charts</h2>
      {topCharts.length === 0 ? (
        <p className="text-gray-400">No top charts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topCharts.map((song) => (
            <div key={song.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
              <img
                src={song.image || '/default-album.png'}
                alt={song.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-sm mb-1 truncate">{song.title}</h3>
              <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              <button
                onClick={() => ctx.playSong(song)}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
              >
                {ctx.currentSong?.id === song.id && ctx.isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default TopCharts;