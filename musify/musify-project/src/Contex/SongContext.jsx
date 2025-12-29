import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { searchSongs } from '../services/api';
import { recordPlay } from '../services/historyService';

// Use Vite env variable if provided, otherwise default to localhost:5000 for dev
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const SongContext = createContext();

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSongContext must be used within a SongProvider');
  }
  return context;
};

// Backwards-compatible alias used by some components
export const useSongs = useSongContext;

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  const audioRef = useRef(new Audio());

  // Fetch songs from backend API
  const fetchSongsFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/songs`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      // Combine recent and popular for now
      const allSongs = [...(data.data.recent || []), ...(data.data.popular || [])];
      setSongs(allSongs);
      setFilteredSongs(allSongs);
    } catch (error) {
      console.error('Error fetching songs from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongsFromAPI();
  }, []);

  // Filter songs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      // Use backend search API for better performance
      const performSearch = async () => {
        try {
          const searchResults = await searchSongs(searchQuery);
          setFilteredSongs(searchResults);
        } catch (error) {
          console.error('Error searching songs:', error);
          // Fallback to local filtering
          const filtered = songs.filter(song =>
            song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.album?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredSongs(filtered);
        }
      };
      performSearch();
    }
  }, [searchQuery, songs]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      if (!repeat) {
        setIsPlaying(false);
      }
    });

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => {});
    };
  }, [repeat]);

  const playSong = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Resolve audio URL to backend host when needed (local /songs/... paths)
      let src = song.audioUrl || song.audio || '';
      if (src && src.startsWith('/')) {
        // If the path is relative to server (e.g. /songs/file.mp3), prefix API_BASE
        src = `${API_BASE}${src}`;
      }
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.src = src;
      audioRef.current.play().catch(err => {
        console.error('Playback failed:', err);
      });
      setCurrentSong(song);
      setIsPlaying(true);
      // Fire-and-forget: record this play in user's history
      // Do not block playback; log errors to console
      (async () => {
        try {
          await recordPlay(song);
        } catch (err) {
          console.error('Failed to record play:', err);
        }
      })();
    }
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBackward = () => {
    audioRef.current.currentTime -= 10;
  };

  const handleSkipForward = () => {
    audioRef.current.currentTime += 10;
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
    audioRef.current.loop = !repeat;
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const v = e.target.value;
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  // Keep audio element volume in sync with state on mount
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const value = {
    songs,
    loading,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    volume,
    progress,
    shuffle,
    repeat,
    searchQuery,
    setSearchQuery,
    filteredSongs,
    audioRef,
    playSong,
    togglePlayPause,
    handleSkipBackward,
    handleSkipForward,
    toggleShuffle,
    toggleRepeat,
    handleProgressChange,
    handleVolumeChange,
    formatTime,
    fetchSongsFromAPI
  };

  // Allow adding a song locally (useful for admin UI or dev); does not persist to backend
  const addSong = (song) => {
    setSongs((prev) => [{ ...song }, ...prev]);
  };

  // include addSong in the context value
  value.addSong = addSong;

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  );
};
