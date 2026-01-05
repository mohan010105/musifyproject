import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSongs } from '../../../../Contex/SongContext';

const Playlists = () => {
  const ctx = useSongs();
  const navigate = useNavigate();
  const playlists = ctx.playlists || [];
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [newName, setNewName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const resolveImage = (p) => {
    if (!p) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60';
    try {
      if (p.startsWith('http://') || p.startsWith('https://')) return p;
      return p;
    } catch (e) { return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60'; }
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      ctx.deletePlaylist(playlistId);
    }
  };

  const handleRemoveSong = (playlistId, songId) => {
    ctx.removeFromPlaylist(playlistId, songId);
  };

  const handleRenamePlaylist = async (playlistId, newName) => {
    if (newName.trim()) {
      await ctx.renamePlaylist(playlistId, newName.trim());
      setEditingPlaylist(null);
      setNewName('');
    }
  };

  const startEditing = (playlist) => {
    setEditingPlaylist(playlist.id);
    setNewName(playlist.name);
  };

  const cancelEditing = () => {
    setEditingPlaylist(null);
    setNewName('');
  };

  const handleCreatePlaylist = async () => {
    if (playlistName.trim()) {
      await ctx.createPlaylist(playlistName.trim());
      setPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const cancelCreate = () => {
    setPlaylistName('');
    setShowCreateForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Playlists</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Create New Playlist</h3>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-3"
            onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCreatePlaylist}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={cancelCreate}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {playlists.length === 0 ? (
        <p className="text-gray-400">No playlists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition relative">
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => startEditing(playlist)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full text-xs"
                  title="Rename Playlist"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                  title="Delete Playlist"
                >
                  ×
                </button>
              </div>

              {editingPlaylist === playlist.id ? (
                <div className="mt-8">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleRenamePlaylist(playlist.id, newName)}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRenamePlaylist(playlist.id, newName)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={resolveImage(playlist.songs[0]?.image)}
                    alt={playlist.name}
                    className="w-full h-32 object-cover rounded mb-3 cursor-pointer"
                    onClick={() => navigate(`/home/playlist/${playlist.id}`)}
                  />
                  <h3
                    className="font-semibold text-sm mb-1 truncate cursor-pointer hover:text-blue-400"
                    onClick={() => navigate(`/home/playlist/${playlist.id}`)}
                  >
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{playlist.songs.length} songs</p>
                  {expandedPlaylist === playlist.id && (
                    <div className="mt-3 space-y-2">
                      {playlist.songs.map((song) => (
                        <div key={song.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{song.title}</h4>
                            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                                  ctx.togglePlayPause();
                                } else {
                                  ctx.playSong(song);
                                }
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
                            >
                              {ctx.currentSong?.id === song.id && ctx.isPlaying ? 'Pause' : 'Play'}
                            </button>
                            <button
                              onClick={() => handleRemoveSong(playlist.id, song.id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                              title="Remove from Playlist"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
