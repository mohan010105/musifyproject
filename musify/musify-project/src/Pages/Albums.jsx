import React, { useState } from 'react';
import { useSongs } from '../Contex/SongContext';

const Albums = () => {
  const ctx = useSongs();
  const playlists = ctx.playlists || [];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      ctx.createPlaylist(playlistName.trim(), playlistDescription.trim());
      setPlaylistName('');
      setPlaylistDescription('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Playlists</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {showCreateForm ? 'Cancel' : 'Create Playlist'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Create New Playlist</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
            />
            <textarea
              placeholder="Description (optional)"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
              rows="3"
            />
            <button
              onClick={handleCreatePlaylist}
              disabled={!playlistName.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <p className="text-gray-400">No playlists created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
              <img
                src={playlist.image || '/default-playlist.png'}
                alt={playlist.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-sm mb-1 truncate">{playlist.name}</h3>
              <p className="text-xs text-gray-400 truncate">{playlist.description || 'User created playlist'}</p>
              <button
                onClick={() => ctx.playSong(playlist)}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
              >
                Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;
