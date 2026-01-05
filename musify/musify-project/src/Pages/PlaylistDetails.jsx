import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSongs } from '../Contex/SongContext';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const ctx = useSongs();
  const [playlist, setPlaylist] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const foundPlaylist = ctx.playlists.find(p => p.id === playlistId);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setNewName(foundPlaylist.name);
    } else {
      navigate('/home/playlists');
    }
  }, [playlistId, ctx.playlists, navigate]);

  const handleRename = async () => {
    if (newName.trim() && newName !== playlist.name) {
      await ctx.renamePlaylist(playlistId, newName);
      setIsEditingName(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      await ctx.deletePlaylist(playlistId);
      navigate('/home/playlists');
    }
  };

  const handleRemoveSong = async (songId) => {
    await ctx.removeFromPlaylist(playlistId, songId);
  };

  const resolveImage = (p) => {
    if (!p) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60';
    try {
      if (p.startsWith('http://') || p.startsWith('https://')) return p;
      return p;
    } catch (e) {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60';
    }
  };

  if (!playlist) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/home/playlists')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Playlists</span>
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Delete Playlist
        </button>
      </div>

      {/* Playlist Info */}
      <div className="flex items-start space-x-6 mb-8">
        <img
          src={resolveImage(playlist.coverImage || playlist.songs[0]?.image)}
          alt={playlist.name}
          className="w-48 h-48 object-cover rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                />
                <button
                  onClick={handleRename}
                  className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setNewName(playlist.name);
                    setIsEditingName(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{playlist.name}</h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-400 mb-4">
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </p>

          {playlist.songs.length > 0 && (
            <button
              onClick={() => ctx.playSong(playlist.songs[0])}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play</span>
            </button>
          )}
        </div>
      </div>

      {/* Songs List */}
      {playlist.songs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">This playlist is empty</div>
          <p className="text-gray-500">Add some songs to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {playlist.songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition group"
            >
              <div className="w-8 text-center text-gray-400">
                {index + 1}
              </div>

              <img
                src={resolveImage(song.image)}
                alt={song.title}
                className="w-12 h-12 object-cover rounded"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>

              <div className="flex items-center space-x-2">
              <button
                  onClick={() => {
                    if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                      ctx.togglePlayPause();
                    } else {
                      ctx.playSong(song);
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition"
              >
                  {ctx.currentSong?.id === song.id && ctx.isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={() => handleRemoveSong(song.id)}
                  className="text-gray-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  title="Remove from playlist"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetails;
