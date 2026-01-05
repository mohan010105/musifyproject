import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaHeart, FaRegHeart, FaTimes, FaTrash, FaVolumeUp } from 'react-icons/fa';
import { useSongs } from '../Contex/SongContext';

const FullScreenPlayer = () => {
  const ctx = useSongs();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(ctx.volume);

  // Initialize audio context and start soundwave animation
  useEffect(() => {
    if (ctx.isPlaying && ctx.currentSong) {
      ctx.initAudioContext();
      const animate = () => {
        const data = ctx.getFrequencyData();
        setFrequencyData(new Uint8Array(data));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ctx.isPlaying, ctx.currentSong, ctx]);

  // Draw soundwave on canvas
  useEffect(() => {
    if (canvasRef.current && frequencyData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = ctx.isPlaying ? '#1db954' : '#666';
      ctx.strokeStyle = ctx.isPlaying ? '#1db954' : '#666';

      const barWidth = width / frequencyData.length;
      let barHeight;
      let x = 0;

      for (let i = 0; i < frequencyData.length; i++) {
        barHeight = (frequencyData[i] / 255) * height;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth;
      }
    }
  }, [frequencyData, ctx.isPlaying]);

  // Get upcoming songs (exclude current song)
  const getUpcomingSongs = () => {
    if (!ctx.currentSong || !ctx.activeQueue.length) return [];
    const currentIndex = ctx.activeQueue.findIndex(s => s.id === ctx.currentSong.id);
    if (currentIndex === -1) return ctx.activeQueue.slice(0, 10);

    const upcoming = [];
    for (let i = 1; i <= 10; i++) {
      const idx = (currentIndex + i) % ctx.activeQueue.length;
      upcoming.push(ctx.activeQueue[idx]);
    }
    return upcoming;
  };

  const upcomingSongs = getUpcomingSongs();

  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        ctx.setIsFullScreenPlayerOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [ctx]);

  const toggleMute = () => {
    if (muted) {
      ctx.handleVolumeChange(prevVolume);
      setMuted(false);
    } else {
      setPrevVolume(ctx.volume);
      ctx.handleVolumeChange(0);
      setMuted(true);
    }
  };

  if (!ctx.currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex">
      {/* Background with album art blur */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${ctx.currentSong.image || '/default-album.png'})`,
          filter: 'blur(20px) brightness(0.3)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Color wash overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 215, 96, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />

      {/* 2-Column Layout */}
      <div className="relative z-10 flex w-full h-full">
        {/* Left Column: Artwork/Soundwave/Progress/Controls */}
        <div className="flex-[2] flex flex-col justify-center items-center p-8 relative">
          {/* Close Button - Top Right */}
          <button
            onClick={() => ctx.setIsFullScreenPlayerOpen(false)}
            className="absolute top-4 right-4 p-3 hover:bg-black hover:bg-opacity-5 rounded-full transition-colors z-20"
          >
            <FaTimes size={24} />
          </button>

          {/* Song Info - Top */}
          <div className="text-white text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{ctx.currentSong.title}</h1>
            <p className="text-xl opacity-20">{ctx.currentSong.artist}</p>
          </div>
          {/* Album Artwork */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <motion.img
              src={ctx.currentSong.image || '/default-album.png'}
              alt={ctx.currentSong.title}
              className="w-[150px] h-[100px] object-cover rounded-lg shadow-2xl"
              initial={{ scale: 0.9, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
            <motion.button
              onClick={ctx.togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {ctx.isPlaying ? <FaPause size={48} className="text-white" /> : <FaPlay size={48} className="text-white ml-2" />}
            </motion.button>
          </motion.div>

          {/* Soundwave Visualization */}
          <div className="w-full max-w-md mb-8">
            <canvas
              ref={canvasRef}
              width={400}
              height={100}
              className="w-full h-24"
              style={{
                background: 'transparent',
                filter: ctx.isPlaying ? 'none' : 'grayscale(100%) opacity(0.5)'
              }}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span>{formatTime(ctx.currentTime)}</span>
              <span>{formatTime(ctx.duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ctx.progress}
              onChange={ctx.handleProgressChange}
              className="w-full h-2 bg-black bg-opacity-7 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <button
              onClick={ctx.toggleShuffle}
              className={`p-3 rounded-full transition-colors ${ctx.shuffle ? 'text-green-500' : 'text-white hover:bg-black hover:bg-opacity-5'}`}
            >
              <FaRandom size={20} />
            </button>

            <button
              onClick={ctx.playPrev}
              className="p-3 text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
            >
              <FaStepBackward size={24} />
            </button>

            <button
              onClick={ctx.togglePlayPause}
              className="p-4 bg-green-500 hover:bg-green-600 text-black rounded-full transition-colors"
            >
              {ctx.isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
            </button>

            <button
              onClick={ctx.playNext}
              className="p-3 text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
            >
              <FaStepForward size={24} />
            </button>

            <button
              onClick={() => ctx.setRepeat((ctx.repeat + 1) % 3)}
              className={`p-3 rounded-full transition-colors ${
                ctx.repeat === 0 ? 'text-white hover:bg-black hover:bg-opacity-20' :
                ctx.repeat === 1 ? 'text-green-500' : 'text-green-500'
              }`}
            >
              <FaRedo size={20} />
              {ctx.repeat === 2 && <span className="absolute text-xs">1</span>}
            </button>
          </div>

          {/* Additional Controls Row */}
          <div className="flex items-center justify-center space-x-12 w-full max-w-lg">
            {/* Like Button */}
            <button
              onClick={() => ctx.toggleLike(ctx.currentSong)}
              className="p-3 text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              title="Like"
            >
              {ctx.isLiked(ctx.currentSong) ? <FaHeart className="text-green-500" size={24} /> : <FaRegHeart size={24} />}
            </button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-4 flex-1 max-w-xs">
              <button
                onClick={toggleMute}
                className="p-3 text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
                title={muted ? 'Unmute' : 'Mute'}
              >
                <FaVolumeUp size={20} />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={Number(ctx.volume || 0)}
                onChange={(e) => ctx.handleVolumeChange(e)}
                className="flex-1 h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Songs */}
        <div className="flex-1 flex flex-col p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Upcoming Songs</h2>
          <div className="flex-1 overflow-y-auto">
            {upcomingSongs.length > 0 ? (
              upcomingSongs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center p-3 hover:bg-black hover:bg-opacity-10 rounded-lg cursor-pointer transition-colors mb-2 group"
                  onClick={() => {
                    if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                      ctx.togglePlayPause();
                    } else {
                      ctx.playSong(song);
                    }
                  }}
                >
                  <img
                    src={song.image || '/default-album.png'}
                    alt={song.title}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{song.title}</p>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      ctx.removeFromQueue(song.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-400">No Upcoming Songs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
