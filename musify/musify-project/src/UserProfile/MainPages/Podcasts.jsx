import React, { useState, useRef } from 'react';
// import { CiPlay1 , FaPause, FaBackward, FaForward, FaVolumeUp, FaHeart, FaPlus } from 'react-icons/fa';
import {  FaPause, FaBackward, FaForward, FaRandom, FaRedo, FaList, FaChartLine, FaVolumeUp, FaExpand } from "react-icons/fa";
// import { CiPlay1 } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
// import { FaPause1 } from "react-icons/ci";



import { FaHeadphones,FaPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';


const Podcasts = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(new Audio());


              //!Lists of songs
  const songs = [
    { id: 1, title: 'Idhazhin Oram', artist: 'Anirudh', src: './src/Idhazhin Oram (The Innocence of Love) - Anirudh Ravichander,.mp3', image: './src/3.jpg' },
    { id: 2, title: 'Pathikichu', artist: 'Vidaamuyarchi', src: './src/Pathikichu.mp3', image: './src/ak.jpg' },
    { id: 3, title: 'Amaran', artist: 'Vennilavu Saaral', src: './src/Vennilavu Saaral.mp3', image: './src/Amaran.jpg' },
    { id: 5, title: 'Lubber Panthu', artist: 'Chillanjirukkiye', src: './src/Chillanjirukkiye.mp3', image: './src/Screenshot 2025-03-09 160238.png' },
    { id: 6, title: 'Devara', artist: 'Pathavaikum', src: './src/Paththavaikkum.mp3', image: './src/devara.jpg' },
    { id: 4, title: 'Dragon', artist: 'Vazhithunaiye', src: './src/Vazhithunaiye.mp3', image: './src/drangon.jpg' },
    { id: 7, title: 'Aadukalam', artist: 'Ayyayo', src: './src/Ayyayo - G.V. Prakash Kumar, S. P. Balasubrahmanyam, S.P.B.mp3', image: './src/ayyoyo.webp' },
    { id: 8, title: 'NEEk', artist: 'Golden Spaarow', src: './src/Golden-Sparrow-MassTamilan.dev.mp3', image: './src/neek.jpg' },
    { id: 9, title: 'Retro', artist: 'Kannadi Poove', src: './src/Kannadi-Poove-MassTamilan.dev.mp3', image: './src/retro.jpg' },
    { id: 10, title: 'Kingston', artist: 'Yelavalele', src: './src/Yelavalele.mp3', image: './src/Screenshot 2025-03-09 160446.png' },
    { id: 11, title: 'Once more', artist: 'Vaa Kannama', src: './src/Vaa-Kannamma-MassTamilan.dev.mp3', image: './src/vaa.jpg' },
    { id: 12, title: 'Ayyogya', artist: 'Kanne-Kanne', src: './src/Kanne-Kanne-MassTamilan.org.mp3', image: './src/ayogya.webp' },
    { id: 13, title: 'Sema', artist: 'Sandalee', src: './src/Sandalee-MassTamilan.com.mp3', image: './src/sandalee.jpg' },
    { id: 14, title: 'Jilla', artist: 'Kandaangi Kandaangi', src: './src/Kandangi-Kandangi.mp3', image: './src/jilla.jpg' },
    { id: 15, title: 'Thiruchitrambalam', artist: 'Megam Karukatha', src: './src/Megham_Karukatha_From_Thiruchitrambalam_Dhanush,_Anirudh_R.mp3', image: './src/megam.jpg' },
  <br></br>
  ];

  const chunkSongs = (songsArray, size) => {
    let chunkedArray = [];
    for (let i = 0; i < songsArray.length; i += size) {
      chunkedArray.push(songsArray.slice(i, i + size));
    }
    return chunkedArray;
  };

  const playSong = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = song.src;
      audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
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

  audioRef.current.ontimeupdate = () => {
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value / 100;
  };

  return (
    <div className="w-full h-[calc(100vh-70px)] flex">
      {/* Sidebar and navlinks */}
      <aside className="w-60 h-full bg-gray-900 text-white p-5 flex flex-col space-y-4 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <h2 className="text-xl font-bold">BROWSE</h2>
        <nav className="space-y-5">

         <p>
          <NavLink to="/newreleases" className="cursor-pointer hover:text-gray-400 ">🔥
           New Releases</NavLink><br></br>
           </p>

          <NavLink to="/topcharts" className="cursor-pointer hover:text-gray-400 flex items-center">
            <FaChartLine className="mr-2 text-orange-400" /> Top Charts
          </NavLink>
          <NavLink to="/playlists" className="cursor-pointer hover:text-gray-400 flex items-center">
            <FaList className="mr-2 text-yellow-400" /> Top Playlists
          </NavLink>
          <NavLink to="/podcasts" className="cursor-pointer hover:text-gray-400 flex items-center">
            <FaHeadphones className="mr-2 text-blue-400" /> Podcasts
          </NavLink>
          <p>
          <NavLink to="/radio" className="cursor-pointer hover:text-gray-400">📻 Radio</NavLink>
          </p>
          <br/>
          <h2 className="text-xl font-bold">MY LIBRARY</h2>
          <p className="cursor-pointer hover:text-gray-400">📜 History</p>
          <p className="cursor-pointer hover:text-gray-400">🎵 Liked Songs</p>
          <p className="cursor-pointer hover:text-gray-400">📀 Albums</p>
          <p className="cursor-pointer hover:text-gray-400">🎧 Podcasts</p>
          <p className="cursor-pointer hover:text-gray-400">🎤 Artists</p>
          <button className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 flex items-center">
            <FaPlus className="mr-2" /> Add New Playlist
          </button>
          <br />
        </nav>
      </aside>

      {/* Main Content of the Podcasts */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-4 text-white">Trending Now</h1>
        <div className="space-y-5">
          {chunkSongs(songs, 5).map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-start gap-7 flex-wrap space-x-3 space-y-10">
              {row.map((song) => (
                <div key={song.id} className="relative group w-[150px] h-[100px]">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full rounded-lg transition-opacity duration-300 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                      onClick={() => playSong(song)}
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <FaPause className="h-9 w-9 bg-black bg-opacity-50  p-2 rounded-full" />
                      ) : (
                        <FaPlay  className="h-9 w-9 bg-black bg-opacity-50 e p-2 rounded-full" />
                      )}
                    </button>
                  </div>
                  <p className="text-center mt-0.5">{song.artist}</p>
                  <p className="text-center mt-0.5 text-[15px] text-[#5f70cc]">{song.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      

      {/* Music Player Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-[80px] bg-gray-900 text-white px-6 flex items-center justify-between z-50">
  {/* Song Info */}
  <div className="flex items-center gap-4 w-[25%]">
    <img
      src={currentSong?.image || "/default-song.jpg"}
      alt={currentSong?.title || "Song"}
      className="w-14 h-14 object-cover rounded"
    />
    <div>
      <h4 className="text-sm font-semibold">{currentSong?.title || "Song Title"}</h4>
      <p className="text-xs text-gray-400">{currentSong?.artist || "Artist"}</p>
    </div>
  </div>

  {/* Controls */}
  <div className="flex flex-col items-center gap-1 w-[50%]">
    <div className="flex items-center space-x-6 justify-center">
      <FaRandom
        className={`text-lg cursor-pointer ${shuffle ? "text-green-400" : "hover:text-gray-400"}`}
        onClick={toggleShuffle}
      />
      <FaBackward
        className="text-2xl cursor-pointer hover:text-gray-400"
        onClick={handleSkipBackward}
      />
      <button
        onClick={togglePlayPause}
        className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition"
      >
        {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl" />}
      </button>
      <FaForward
        className="text-2xl cursor-pointer hover:text-gray-400"
        onClick={handleSkipForward}
      />
      <FaRedo
        className={`text-lg cursor-pointer ${repeat ? "text-green-400" : "hover:text-gray-400"}`}
        onClick={toggleRepeat}
      />
    </div>

    {/* Progress Bar */}
    <input
      type="range"
      className="w-full mt-2 cursor-pointer"
      value={progress}
      onChange={handleProgressChange}
    />
  </div>

  {/* Volume + Fullscreen */}
  <div className="flex items-center space-x-4 w-[25%] justify-end">
    <FaList className="text-lg cursor-pointer hover:text-gray-400" />
    <FaChartLine className="text-lg cursor-pointer hover:text-gray-400" />
    <FaVolumeUp className="text-xl" />
    <input
      type="range"
      min="0"
      max="100"
      value={volume}
      onChange={handleVolumeChange}
      className="w-24 cursor-pointer"
    />
    <FaExpand
      className="text-xl cursor-pointer hover:text-gray-400"
      onClick={() => document.documentElement.requestFullscreen()}
    />
  </div>
</footer>

    </div>
  ); 
};

export default Podcasts;
