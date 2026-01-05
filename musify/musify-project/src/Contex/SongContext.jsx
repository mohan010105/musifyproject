import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { recordPlay } from '../services/historyService';
import { DB } from '../Backend/Firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './AuthContex';

const SongContext = createContext(null);

export const SongProvider = ({ children }) => {
	const audioRef = useRef(new Audio());
	const { authUser } = useAuth();

	const [songs, setSongs] = useState([]);
	const [playlists, setPlaylists] = useState([]);
	const [podcasts, setPodcasts] = useState([]);
	const [radio, setRadio] = useState([]);
	const [likedSongs, setLikedSongs] = useState([]);
	const [currentSong, setCurrentSong] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(() => {
		try { const v = localStorage.getItem('musify_volume'); return v !== null ? Number(v) : 60; } catch { return 60; }
	});
	const [progress, setProgress] = useState(0);
	const [history, setHistory] = useState([]);
	const [audioError, setAudioError] = useState(null);
	const [shuffle, setShuffle] = useState(false);
	const [originalQueue, setOriginalQueue] = useState([]);
	const [activeQueue, setActiveQueue] = useState([]);
	const [repeat, setRepeat] = useState(0); // 0: off, 1: all, 2: one
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const sourceRef = useRef(null);

	// Load data from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem('musify_songs');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					setSongs(parsed);
				}
			} else {
				// Initialize with sample songs if none exist
				const sampleSongs = [
					{
						id: '1',
						title: 'Dragon',
						artist: 'Leon James',
						image: 'https://picsum.photos/seed/song1/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '3:20',
						category: 'newreleases'
					},
					{
						id: '2',
						title: 'Watermelon Sugar',
						artist: 'Harry Styles',
						image: 'https://picsum.photos/seed/song2/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '2:54',
						category: 'topcharts'
					},
					{
						id: '3',
						title: 'Levitating',
						artist: 'Dua Lipa',
						image: 'https://picsum.photos/seed/song3/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '3:23',
						category: 'newreleases'
					},
					{
						id: '4',
						title: 'Good 4 U',
						artist: 'Olivia Rodrigo',
						image: 'https://picsum.photos/seed/song4/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '2:58',
						category: 'topcharts'
					},
					{
						id: '5',
						title: 'Stay',
						artist: 'The Kid Laroi & Justin Bieber',
						image: 'https://picsum.photos/seed/song5/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '2:21',
						category: 'newreleases'
					},
					{
						id: '6',
						title: 'Peaches',
						artist: 'Justin Bieber ft. Daniel Caesar & Giveon',
						image: 'https://picsum.photos/seed/song6/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '3:18',
						category: 'topcharts'
					},
					{
						id: '7',
						title: 'Drivers License',
						artist: 'Olivia Rodrigo',
						image: 'https://picsum.photos/seed/song7/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '4:02',
						category: 'newreleases'
					},
					{
						id: '8',
						title: 'As It Was',
						artist: 'Harry Styles',
						image: 'https://picsum.photos/seed/song8/200/200',
						audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
						duration: '2:47',
						category: 'topcharts'
					}
				];
				setSongs(sampleSongs);
				localStorage.setItem('musify_songs', JSON.stringify(sampleSongs));
			}
		} catch (e) {
			console.error('Failed to load songs from localStorage', e);
		}

		try {
			const savedLiked = localStorage.getItem('musify_liked_songs');
			if (savedLiked) {
				const parsed = JSON.parse(savedLiked);
				if (Array.isArray(parsed)) {
					setLikedSongs(parsed);
				}
			}
		} catch (e) {
			console.error('Failed to load liked songs from localStorage', e);
		}

		// Playlists are now loaded from Firestore

		try {
			const savedPodcasts = localStorage.getItem('musify_podcasts');
			if (savedPodcasts) {
				const parsed = JSON.parse(savedPodcasts);
				if (Array.isArray(parsed)) {
					setPodcasts(parsed);
				}
			}
		} catch (e) {
			console.error('Failed to load podcasts from localStorage', e);
		}
	}, []);

	// Load playlists from Firestore when user is authenticated
	useEffect(() => {
		if (!authUser) {
			setPlaylists([]);
			return;
		}

		const playlistsRef = collection(DB, 'users', authUser.uid, 'playlists');
		const unsubscribe = onSnapshot(playlistsRef, (snapshot) => {
			const playlistsData = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			setPlaylists(playlistsData);
		}, (error) => {
			console.error('Error loading playlists from Firestore:', error);
		});

		return () => unsubscribe();
	}, [authUser]);

	// Add songs (plural) - merge without duplicates
	const addSongs = useCallback((newSongs = []) => {
		setSongs(prev => {
			const map = new Map(prev.map(s => [String(s.id), s]));
			(newSongs || []).forEach(s => { if (s && s.id) map.set(String(s.id), s); });
			return Array.from(map.values());
		});
	}, []);

	const addSong = useCallback((song) => {
		if (!song || !song.id) return;
		setSongs(prev => {
			const newSongs = prev.find(s => s.id === song.id) ? prev : [song, ...prev];
			// persist to localStorage (keep data URLs for audio and image)
			try {
				const toSave = newSongs.map(s => ({ ...s, audioUrl: undefined, src: undefined, preview: undefined }));
				localStorage.setItem('musify_songs', JSON.stringify(toSave));
			} catch (e) { console.error('Failed to save songs to localStorage', e); }
			return newSongs;
		});
	}, []);

	const addToHistory = useCallback((song) => {
		if (!song) return;
		setHistory(prev => {
			const without = prev.filter(s => s.id !== song.id);
			return [{ id: song.id, title: song.title, artist: song.artist, source: song.source, ts: Date.now() }, ...without].slice(0, 100);
		});
		// fire-and-forget server record
		(async () => { try { await recordPlay({ id: song.id, title: song.title, source: song.source }); } catch (e) { /* ignore */ } })();
	}, []);

	const _indexOfCurrent = useCallback(() => songs.findIndex(s => s && currentSong && s.id === currentSong.id), [songs, currentSong]);

	// Fisher-Yates shuffle algorithm
	const shuffleArray = useCallback((array) => {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}, []);

	// Initialize and manage queues
	useEffect(() => {
		if (songs.length > 0) {
			setOriginalQueue(songs);
			setActiveQueue(shuffle ? shuffleArray(songs) : songs);
		}
	}, [songs, shuffle, shuffleArray]);

	// Handle shuffle toggle
	const toggleShuffle = useCallback(() => {
		setShuffle(prev => {
			const newShuffle = !prev;
			if (newShuffle) {
				// Enable shuffle: create shuffled queue
				let shuffled = shuffleArray(originalQueue);
				if (currentSong) {
					// Ensure current song is in the queue and not first
					const currentIndex = shuffled.findIndex(s => s.id === currentSong.id);
					if (currentIndex !== -1) {
						shuffled.splice(currentIndex, 1);
						const insertPos = Math.floor(Math.random() * Math.min(shuffled.length, 5)) + 1;
						shuffled.splice(insertPos, 0, currentSong);
					} else {
						shuffled.unshift(currentSong);
					}
				}
				setActiveQueue(shuffled);
			} else {
				// Disable shuffle: use original queue
				setActiveQueue(originalQueue);
			}
			return newShuffle;
		});
	}, [originalQueue, currentSong, shuffleArray]);

	// Remove song from queue
	const removeFromQueue = useCallback((songId) => {
		setActiveQueue(prev => prev.filter(s => s.id !== songId));
	}, []);

	// Initialize Web Audio API for soundwave
	const initAudioContext = useCallback(() => {
		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
			analyserRef.current = audioContextRef.current.createAnalyser();
			sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
			sourceRef.current.connect(analyserRef.current);
			analyserRef.current.connect(audioContextRef.current.destination);
			analyserRef.current.fftSize = 256;
		}
	}, []);

	// Get frequency data for soundwave
	const getFrequencyData = useCallback(() => {
		if (!analyserRef.current) return new Uint8Array(0);
		const bufferLength = analyserRef.current.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyserRef.current.getByteFrequencyData(dataArray);
		return dataArray;
	}, []);

	// persist volume
	useEffect(() => {
		try { audioRef.current.volume = Math.max(0, Math.min(1, volume / 100)); localStorage.setItem('musify_volume', String(volume)); } catch (e) {}
	}, [volume]);

	// core playSong: sets currentSong always; only attempts audio playback when `audio` field exists
	function _guessMime(src) {
		if (!src) return '';
		const s = String(src).split('?')[0].toLowerCase();
		if (s.endsWith('.mp3')) return 'audio/mpeg';
		if (s.endsWith('.m4a')) return 'audio/mp4';
		if (s.endsWith('.wav')) return 'audio/wav';
		if (s.endsWith('.ogg')) return 'audio/ogg';
		if (s.endsWith('.aac')) return 'audio/aac';
		return '';
	}

	const playSong = useCallback(async (song, { autoplay = true } = {}) => {
		if (!song) return;
		try {
			setCurrentSong(song);
			setAudioError(null);
			// if no audio url, ensure UI reflects selection but do not attempt to play
			const src = (song.audio || song.audioUrl || song.src || song.preview) || '';
			if (!src) {
				// stop any playing audio
				try { audioRef.current.pause(); } catch (e) {}
				setIsPlaying(false);
				setAudioError({ message: 'No audio source available', src: '' });
				return;
			}

			// basic capability check
			try {
				const mime = _guessMime(src);
				let can = '';
				if (mime) can = audioRef.current.canPlayType ? audioRef.current.canPlayType(mime) : '';
				if (mime && can === '') {
					setAudioError({ message: 'Browser reports this audio MIME as unsupported', src, mime, canPlay: can });
					// set currentSong but do not try to play
					setIsPlaying(false);
					return;
				}
			} catch (e) {
				// continue, we'll catch play errors
			}

			// load new source
			try { audioRef.current.pause(); } catch (e) {}
			audioRef.current.src = src;
			try { audioRef.current.load(); } catch (e) {}
			if (autoplay) {
				try {
					await audioRef.current.play();
					setIsPlaying(true);
					setAudioError(null);
					addToHistory(song);
				} catch (err) {
					setIsPlaying(false);
					setAudioError({ name: err?.name, message: err?.message, src });
				}
			} else {
				setIsPlaying(false);
			}
		} catch (err) {
			console.error('playSong error', err);
			setAudioError({ name: err?.name, message: err?.message });
			setIsPlaying(false);
		}
	}, [addToHistory]);

	// Play song from queue (for clicking in queue)
	const playFromQueue = useCallback((song) => {
		playSong(song);
		// Update queue to start from this song
		setActiveQueue(prev => {
			const index = prev.findIndex(s => s.id === song.id);
			if (index === -1) return prev;
			return [...prev.slice(index), ...prev.slice(0, index)];
		});
	}, [playSong]);

	const togglePlayPause = useCallback(async () => {
		try {
			if (!currentSong) return;
			const src = audioRef.current.src || (currentSong && (currentSong.audio || currentSong.audioUrl || currentSong.src || currentSong.preview) || '');
			if (!src) { setAudioError({ message: 'No audio source to play', src: '' }); return; }
			setAudioError(null);
			const mime = _guessMime(src);
			if (mime) {
				const can = audioRef.current.canPlayType ? audioRef.current.canPlayType(mime) : '';
				if (can === '') { setAudioError({ message: 'Browser reports this audio MIME as unsupported', src, mime, canPlay: can }); return; }
			}
			if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
			else {
				try { await audioRef.current.play(); setIsPlaying(true); setAudioError(null); addToHistory(currentSong); }
				catch (err) { setIsPlaying(false); setAudioError({ name: err?.name, message: err?.message, src }); }
			}
		} catch (e) { console.error('togglePlayPause error', e); setAudioError({ name: e?.name, message: e?.message }); }
	}, [currentSong, isPlaying, addToHistory]);

	const playNext = useCallback(() => {
		if (!activeQueue || activeQueue.length === 0) return;
		const currentIndex = activeQueue.findIndex(s => s && currentSong && s.id === currentSong.id);
		if (currentIndex === -1) {
			// Current song not in queue, play first
			playSong(activeQueue[0]);
			return;
		}
		// Find next playable song in queue
		for (let i = 1; i <= activeQueue.length; i++) {
			const idx = (currentIndex + i) % activeQueue.length;
			const candidate = activeQueue[idx];
			if (!candidate) continue;
			const hasSrc = Boolean(candidate.audio || candidate.audioUrl || candidate.src || candidate.preview);
			if (hasSrc) {
				playSong(candidate);
				return;
			}
		}
		// If no playable songs found, just select next
		const nextIdx = (currentIndex + 1) % activeQueue.length;
		setCurrentSong(activeQueue[nextIdx]);
		setIsPlaying(false);
	}, [activeQueue, currentSong, playSong]);

	const playPrev = useCallback(() => {
		if (!activeQueue || activeQueue.length === 0) return;
		const currentIndex = activeQueue.findIndex(s => s && currentSong && s.id === currentSong.id);
		if (currentIndex === -1) {
			// Current song not in queue, play first
			playSong(activeQueue[0]);
			return;
		}
		// Find previous playable song in queue
		for (let i = 1; i <= activeQueue.length; i++) {
			const idx = (currentIndex - i + activeQueue.length) % activeQueue.length;
			const candidate = activeQueue[idx];
			if (!candidate) continue;
			const hasSrc = Boolean(candidate.audio || candidate.audioUrl || candidate.src || candidate.preview);
			if (hasSrc) {
				playSong(candidate);
				return;
			}
		}
		// If no playable songs found, just select prev
		const prevIdx = (currentIndex - 1 + activeQueue.length) % activeQueue.length;
		setCurrentSong(activeQueue[prevIdx]);
		setIsPlaying(false);
	}, [activeQueue, currentSong, playSong]);

	const handleProgressChange = useCallback((valueOrEvent) => {
		try {
			const val = typeof valueOrEvent === 'number' ? valueOrEvent : Number(valueOrEvent?.target?.value ?? valueOrEvent);
			if (isNaN(val)) return;
			const dur = audioRef.current.duration || 0;
			if (dur > 0) audioRef.current.currentTime = (val / 100) * dur;
			setProgress(val);
		} catch (e) { console.error('handleProgressChange', e); }
	}, []);

	const handleVolumeChange = useCallback((valueOrEvent) => {
		try {
			const val = typeof valueOrEvent === 'number' ? valueOrEvent : Number(valueOrEvent?.target?.value ?? valueOrEvent);
			if (isNaN(val)) return;
			setVolume(val);
		} catch (e) { console.error('handleVolumeChange', e); }
	}, []);

	// ensure audio element event listeners
	useEffect(() => {
		const audio = audioRef.current;
		const onTime = () => {
			try {
				setCurrentTime(audio.currentTime || 0);
				const dur = audio.duration || 0;
				const pct = dur > 0 ? (audio.currentTime / dur) * 100 : 0;
				setProgress(Number.isFinite(pct) ? pct : 0);
			} catch (e) { setProgress(0); setCurrentTime(0); }
		};
		const onDuration = () => {
			try {
				setDuration(audio.duration || 0);
			} catch (e) { setDuration(0); }
		};
		const onEnded = () => {
			if (repeat === 2) { // repeat one
				audio.currentTime = 0;
				audio.play().catch(() => {});
				return;
			}
			if (repeat === 1) { // repeat all
				playNext();
				return;
			}
			// repeat off - advance to next
			playNext();
		};
		audio.addEventListener('timeupdate', onTime);
		audio.addEventListener('loadedmetadata', onDuration);
		audio.addEventListener('ended', onEnded);
		return () => {
			audio.removeEventListener('timeupdate', onTime);
			audio.removeEventListener('loadedmetadata', onDuration);
			audio.removeEventListener('ended', onEnded);
		};
	}, [repeat, playNext]);

	const toggleLike = useCallback((song) => {
		if (!song || !song.id) return;
		setLikedSongs(prev => {
			const isCurrentlyLiked = prev.some(s => s.id === song.id);
			let newLiked;
			if (isCurrentlyLiked) {
				newLiked = prev.filter(s => s.id !== song.id);
			} else {
				newLiked = [...prev, song];
			}
			// persist to localStorage
			try {
				localStorage.setItem('musify_liked_songs', JSON.stringify(newLiked));
			} catch (e) {
				console.error('Failed to save liked songs to localStorage', e);
			}
			return newLiked;
		});
	}, []);

	const isLiked = useCallback((song) => {
		if (!song || !song.id) return false;
		return likedSongs.some(s => s.id === song.id);
	}, [likedSongs]);

	const createPlaylist = useCallback(async (name, description = '') => {
		if (!authUser) return;
		try {
			const newPlaylist = {
				userId: authUser.uid,
				name,
				coverImage: null,
				songs: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};
			await addDoc(collection(DB, 'users', authUser.uid, 'playlists'), newPlaylist);
		} catch (error) {
			console.error('Error creating playlist:', error);
		}
	}, [authUser]);

	const addToPlaylist = useCallback(async (playlistId, song) => {
		if (!authUser || !song || !song.id) return;
		try {
			const playlistRef = doc(DB, 'users', authUser.uid, 'playlists', playlistId);

			// Get current playlist data to check for duplicates and set cover image
			const playlistSnap = await getDocs(query(collection(DB, 'users', authUser.uid, 'playlists'), where('__name__', '==', playlistId)));
			if (!playlistSnap.empty) {
				const playlistData = playlistSnap.docs[0].data();
				const existingSongs = playlistData.songs || [];

				// Check if song already exists
				const songExists = existingSongs.some(existingSong => existingSong.id === song.id);
				if (songExists) {
					console.log('Song already exists in playlist');
					return;
				}

				// Prepare update data
				const updateData = {
					songs: [...existingSongs, song],
					updatedAt: new Date().toISOString()
				};

				// Set cover image if this is the first song
				if (existingSongs.length === 0 && song.image) {
					updateData.coverImage = song.image;
				}

				await updateDoc(playlistRef, updateData);
			}
		} catch (error) {
			console.error('Error adding song to playlist:', error);
		}
	}, [authUser]);

	const renamePlaylist = useCallback(async (playlistId, newName) => {
		if (!authUser || !newName.trim()) return;
		try {
			const playlistRef = doc(DB, 'users', authUser.uid, 'playlists', playlistId);
			await updateDoc(playlistRef, {
				name: newName.trim(),
				updatedAt: new Date().toISOString()
			});
		} catch (error) {
			console.error('Error renaming playlist:', error);
		}
	}, [authUser]);

	const deletePlaylist = useCallback(async (playlistId) => {
		if (!authUser) return;
		try {
			const playlistRef = doc(DB, 'users', authUser.uid, 'playlists', playlistId);
			await deleteDoc(playlistRef);
		} catch (error) {
			console.error('Error deleting playlist:', error);
		}
	}, [authUser]);

	const removeFromPlaylist = useCallback(async (playlistId, songId) => {
		if (!authUser) return;
		try {
			const playlistRef = doc(DB, 'users', authUser.uid, 'playlists', playlistId);
			// Get current playlist data to find the song to remove
			const playlistSnap = await getDocs(query(collection(DB, 'users', authUser.uid, 'playlists'), where('__name__', '==', playlistId)));
			if (!playlistSnap.empty) {
				const playlistData = playlistSnap.docs[0].data();
				const songToRemove = playlistData.songs.find(song => song.id === songId);
				if (songToRemove) {
					await updateDoc(playlistRef, {
						songs: arrayRemove(songToRemove)
					});
				}
			}
		} catch (error) {
			console.error('Error removing song from playlist:', error);
		}
	}, [authUser]);

	const addPodcast = useCallback((podcast) => {
		if (!podcast || !podcast.id) return;
		setPodcasts(prev => {
			const newPodcasts = prev.find(p => p.id === podcast.id) ? prev : [podcast, ...prev];
			try {
				localStorage.setItem('musify_podcasts', JSON.stringify(newPodcasts));
			} catch (e) {
				console.error('Failed to save podcasts to localStorage', e);
			}
			return newPodcasts;
		});
	}, []);

	// expose context
	return (
		<SongContext.Provider value={{
			songs,
			setSongs,
			addSongs,
			addSong,
			playlists,
			setPlaylists,
			podcasts,
			setPodcasts,
			radio,
			setRadio,
			likedSongs,
			setLikedSongs,
			playSong,
			togglePlayPause,
			playNext,
			playPrev,
			currentSong,
			isPlaying,
			volume,
			setVolume,
			progress,
			handleProgressChange,
			handleVolumeChange,
			history,
			setHistory,
			shuffle,
			toggleShuffle,
			repeat,
			setRepeat,
			audioError,
			setAudioError,
			retryPlay: () => { if (currentSong) playSong(currentSong, { autoplay: true }); },
			currentTime,
			duration,
			toggleLike,
			isLiked,
			createPlaylist,
			addToPlaylist,
			renamePlaylist,
			deletePlaylist,
			removeFromPlaylist,
			addPodcast,
			isFullScreenPlayerOpen,
			setIsFullScreenPlayerOpen,
			activeQueue,
			removeFromQueue,
			playFromQueue,
			initAudioContext,
			getFrequencyData
		}}>
			{children}
		</SongContext.Provider>
	);
};

export const useSongs = () => useContext(SongContext);

