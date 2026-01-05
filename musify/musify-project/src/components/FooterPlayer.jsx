import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaRandom, FaRedo, FaHeart, FaExpand, FaPlus } from 'react-icons/fa';
import { useSongs } from '../Contex/SongContext';
import { MdPlaylistAdd } from "react-icons/md";


const formatTime = (t) => {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const resolveImage = (p) => {
  if (!p) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60';
  try {
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    return p;
  } catch (e) { return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=60'; }
};

const FooterPlayer = () => {
  const ctx = useSongs();
  const shouldReduceMotion = useReducedMotion();
  if (!ctx) return null;

  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    progress,
    handleProgressChange,
    volume,
    handleVolumeChange,
    currentTime,
    duration,
    shuffle,
    toggleShuffle,
    repeat,
    setRepeat,
    toggleLike,
    isLiked,
    playlists,
    addToPlaylist,
  } = ctx;

  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  const previewAvailable = Boolean(currentSong && (currentSong.audio || currentSong.audioUrl || currentSong.src || currentSong.preview));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (currentSong) togglePlayPause();
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            seekForward();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            seekBackward();
          }
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSong, togglePlayPause]);

  const seekForward = () => {
    if (!currentSong || !duration) return;
    const newTime = Math.min(currentTime + 10, duration);
    handleProgressChange((newTime / duration) * 100);
  };

  const seekBackward = () => {
    if (!currentSong || !duration) return;
    const newTime = Math.max(currentTime - 10, 0);
    handleProgressChange((newTime / duration) * 100);
  };

  const toggleMute = () => {
    if (muted) {
      handleVolumeChange(prevVolume);
      setMuted(false);
    } else {
      setPrevVolume(volume);
      handleVolumeChange(0);
      setMuted(true);
    }
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    updateProgressFromMouse(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      updateProgressFromMouse(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const updateProgressFromMouse = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    handleProgressChange(percentage);
  };

  const cycleRepeat = () => {
    setRepeat((prev) => (prev + 1) % 3); // 0: off, 1: all, 2: one
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full h-[80px] bg-[#181818] border-t border-[#282828] text-white px-6 flex items-center justify-between z-50">
      {/* Left Section: Album Art, Title, Artist, Like Button */}
      <div className="flex items-center gap-4 w-[25%]">
        <img
          src={resolveImage(currentSong?.image)}
          alt={currentSong?.title || 'Song'}
          className="w-14 h-14 object-cover rounded cursor-pointer"
          onClick={() => ctx.setIsFullScreenPlayerOpen(true)}
          title="Open full screen player"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-[#FFFFFF] truncate">
            {currentSong?.title || 'No song selected'}
          </h4>
          <p className="text-xs text-[#B3B3B3] truncate">
            {currentSong?.artist || ''}
          </p>
        </div>
        {currentSong && (
          <>
            <motion.button
              onClick={() => toggleLike(currentSong)}
              className={`text-lg transition-colors ${
                isLiked(currentSong) ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
              title={isLiked(currentSong) ? 'Remove from liked songs' : 'Add to liked songs'}
              whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(29, 185, 84, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaHeart />
            </motion.button>
            <div className="relative">
              {/* <motion.button
                onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
                className="text-lg text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors hover:scale-110 ml-2"
                title="Add to playlist"
                whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(179, 179, 179, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FaPlus />
              </motion.button> */}
              {showPlaylistDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#282828] rounded-lg shadow-lg border border-[#404040] min-w-[200px] max-h-[200px] overflow-y-auto z-50">
                  <div className="p-2">
                    <h4 className="text-sm font-semibold text-[#FFFFFF] mb-2">Add to Playlist</h4>
                    {playlists.length > 0 ? (
                      playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => {
                            addToPlaylist(playlist.id, currentSong);
                            setShowPlaylistDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#404040] rounded transition-colors"
                        >
                          {playlist.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-[#B3B3B3] px-3 py-2">No playlists available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => ctx.setIsFullScreenPlayerOpen(true)}
              className="text-lg text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors hover:scale-110 ml-2"
              title="Open full screen player"
            >
              <FaExpand />
            </button>
          </>
        )}
      </div>

      {/* Center Section: Controls and Progress */}
      <div className="flex flex-col items-center gap-2 w-[50%]">
        <div className="flex items-center space-x-6">
          <motion.button
            onClick={toggleShuffle}
            disabled={!currentSong}
            className={`text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              shuffle ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
            }`}
            title="Shuffle"
            whileHover={{ scale: 1.1, boxShadow: shuffle ? '0 0 10px rgba(29, 185, 84, 0.5)' : '0 0 10px rgba(179, 179, 179, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaRandom />
          </motion.button>

          <button
            onClick={playPrev}
            disabled={!currentSong}
            className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous"
          >
            <FaBackward className="text-lg" />
          </button>

          {currentSong ? (
            <button
              onClick={togglePlayPause}
              className="bg-[#1DB954] hover:bg-[#1ed760] p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause className="text-2xl text-[#FFFFFF]" /> : <FaPlay className="text-2xl text-[#FFFFFF]" />}
            </button>
          ) : (
            <div className="bg-[#282828] p-3 rounded-full opacity-50 cursor-not-allowed" title="Select a song to play">
              <FaPlay className="text-2xl text-[#B3B3B3]" />
            </div>
          )}

          <button
            onClick={playNext}
            disabled={!currentSong}
            className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next"
          >
            <FaForward className="text-lg" />
          </button>

          <div className="relative">
            <button
              onClick={cycleRepeat}
              disabled={!currentSong}
              className={`text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                repeat > 0 ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
              title={
                repeat === 0 ? 'Repeat off' :
                repeat === 1 ? 'Repeat all' :
                'Repeat one'
              }
            >
              <FaRedo />
              {repeat === 2 && (
                <span className="absolute -top-1 -right-1 text-xs bg-[#1DB954] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-[#B3B3B3] w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-1 bg-[#282828] rounded-lg cursor-pointer relative"
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={handleProgressMouseUp}
          >
            <div
              className="h-full bg-[#B3B3B3] rounded-lg relative"
              style={{ width: `${progress || 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#FFFFFF] rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <span className="text-xs text-[#B3B3B3] w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* <div>
      <motion.button
                onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
                className="text-lg text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors hover:scale-110 ml-2"
                title="Add to playlist"
                whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(179, 179, 179, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FaPlus />
              </motion.button>
      </div> */}
      {/* Right Section: Volume */}
      <div>
      <motion.button
  onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
  className="text-lg text-[#B3B3B3] hover:text-white transition-colors ml-6 "
  title="Add to playlist"
  whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(179,179,179,0.5)" }}
  whileTap={{ scale: 0.95 }}
>
  <MdPlaylistAdd />
</motion.button>
      </div>
      <div className="flex items-center space-x-3 w-[25%] justify-end">
        <button
          onClick={toggleMute}
          disabled={!currentSong}
          className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={muted ? 'Unmute' : 'Mute'}
        >
          <FaVolumeUp />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={Number(volume || 0)}
          onChange={(e) => handleVolumeChange(e)}
          className="w-24 h-1 bg-[#282828] rounded-lg appearance-none cursor-pointer slider"
          disabled={!currentSong}
        />
      </div>
    </footer>
  );
};

export default FooterPlayer;
