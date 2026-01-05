import React from "react";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { useSongs } from "../../Contex/SongContext";

const NewReleases = () => {
  const ctx = useSongs();
  const songs = ctx.filteredSongs || ctx.songs || [];
  const [likedIds, setLikedIds] = React.useState(() => {
    try {
      const raw = localStorage.getItem("likedSongs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try { localStorage.setItem("likedSongs", JSON.stringify(likedIds)); } catch {}
  }, [likedIds]);

  const toggleLike = (songId) => {
    setLikedIds(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]);
  };

  const chunkSongs = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  return (
    <div className="new-releases mb-6">
      <h2 className="text-2xl font-bold mb-3 text-white">New Releases</h2>
      <div className="song-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.length === 0 ? (
          <p className="text-white">No new releases yet</p>
        ) : (
          chunkSongs(songs, 3).map((row, ri) => (
            <div key={ri} className="flex gap-4">
              {row.map(song => (
                <div key={song.id} className="song-card bg-gray-800 p-3 rounded w-1/3">
                  <img src={song.cover || song.image || "/default-cover.jpg"} alt={song.title} className="w-full h-40 object-cover rounded" />
                  <h4 className="mt-2 font-semibold text-white">{song.title}</h4>
                  <p className="text-sm text-gray-300">{song.artist}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="p-2 rounded bg-black bg-opacity-40 text-white" onClick={() => {
                      if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                        ctx.togglePlayPause();
                      } else {
                        ctx.playSong(song);
                      }
                    }}>
                      {ctx.currentSong?.id === song.id && ctx.isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="p-2 rounded bg-black bg-opacity-40 text-white" onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}>
                      {likedIds.includes(song.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewReleases;
