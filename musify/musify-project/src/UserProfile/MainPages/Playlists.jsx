import React, { useState, useRef, useEffect } from "react";
// import { CiPlay1 , FaPause, FaBackward, FaForward, FaVolumeUp, FaHeart, FaPlus } from 'react-icons/fa';
import {
  FaPause,
  FaBackward,
  FaForward,
  FaRandom,
  FaRedo,
  FaList,
  FaChartLine,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";
// import { CiPlay1 } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import song1 from "./HomeAssets/Idhazhin Oram (The Innocence of Love) - Anirudh Ravichander,.mp3";
import img1 from "/HomeAssets/";
import song2 from "./HomeAssets/pathikichu.mp3";
import song3 from "./HomeAssets/Vennilavu Saaral.mp3";
import song4 from "./HomeAssets/chillanjirukkiye.mp3";
import song5 from "./HomeAssets/Paththavaikkum.mp3";
import song6 from "./HomeAssets/ayyayo - G.V. Prakash Kumar, S. P. Balasubrahmanyam, S.P.B.mp3";
import song7 from "./HomeAssets/vazhithunaiye.mp3";
import song8 from "./HomeAssets/Kannadi-Poove-MassTamilan.dev.mp3";

import song9 from "./HomeAssets/Kanne-Kanne-MassTamilan.org.mp3";
import song10 from "./HomeAssets/Golden-Sparrow-MassTamilan.dev.mp3";
import song11 from "./HomeAssets/Sandalee-MassTamilan.com.mp3";
import song12 from "./HomeAssets/Vaa-Kannamma-MassTamilan.dev.mp3";
import song13 from "./HomeAssets/Kandangi-Kandangi.mp3";
import song14 from "./HomeAssets/Yelavalele.mp3";
import song15 from "./HomeAssets/Megham_Karukatha_From_Thiruchitrambalam_Dhanush,_Anirudh_R.mp3";
import img2 from "./HomeAssets/ak.jpg";
import img3 from "./HomeAssets/Amaran.jpg";
import img4 from "./HomeAssets/Screenshot 2025-03-09 160238.png";
import img5 from "./HomeAssets/devara.jpg";
import img6 from "./HomeAssets/ayyoyo.webp";
import img7 from "./HomeAssets/drangon.jpg";
import img8 from "./HomeAssets/retro.jpg";
import img9 from "./HomeAssets/ayogya.webp";
import img10 from "./HomeAssets/neek.jpg";
import img11 from "./HomeAssets/sandalee.jpg";
import img12 from "./HomeAssets/vaa.jpg";
import img13 from "./HomeAssets/jilla.jpg";
import img14 from "./HomeAssets/Screenshot 2025-03-09 160446.png";
import img15 from "./HomeAssets/megam.jpg";
// import { FaPause1 } from "react-icons/ci";

// import { FaHeadphones, FaPlus } from "react-icons/fa";
// import { NavLink, Outlet } from "react-router-dom";

const Playlists = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(new Audio());

  //!Lists of songs

  const songs = [
    {
      id: 1,
      title: "Idhazhin Oram",
      artist: "Anirudh",
      src: song1,
      image: img1,
    },
    {
      id: 2,
      title: "Pathikichu",
      artist: "Vidaamuyarchi",
      src: song2,
      image: img2,
    },
    {
      id: 3,
      title: "Amaran",
      artist: "Vennilavu Saaral",
      src: song3,
      image: img3,
    },
    {
      id: 4,
      title: "Lubber Panthu",
      artist: "Chillanjirukkiye",
      src: song4,
      image: img4,
    },
    {
      id: 5,
      title: "Devara",
      artist: "Pathavaikum",
      src: song5,
      image: img5,
    },
    {
      id: 6,
      title: "Dragon",
      artist: "Vazhithunaiye",
      src: song7,
      image: img7,
    },
    {
      id: 7,
      title: "Aadukalam",
      artist: "Ayyayo",
      src: song6,
      image: img6,
    },
    {
      id: 8,
      title: "NEEk",
      artist: "Golden Spaarow",
      src: song10,
      image: img10,
    },
    {
      id: 9,
      title: "Retro",
      artist: "Kannadi Poove",
      src: song8,
      image: img8,
    },
    {
      id: 10,
      title: "Kingston",
      artist: "Yelavalele",
      src: song14,
      image: img14,
    },
    {
      id: 11,
      title: "Once more",
      artist: "Vaa Kannama",
      src: song12,
      image: img12,
    },
    {
      id: 12,
      title: "Ayyogya",
      artist: "Kanne-Kanne",
      src: song9,
      image: img9,
    },
    {
      id: 13,
      title: "Sema",
      artist: "Sandalee",
      src: song11,
      image: img11,
    },
    {
      id: 14,
      title: "Jilla",
      artist: "Kandaangi Kandaangi",
      src: song13,
      image: img13,
    },
    {
      id: 15,
      title: "Thiruchitrambalam",
      artist: "Megam Karukatha",
      src: song15,
      image: img15,
    },
    // {
    // id:16,
    // title:"Jilla",
    // artist:"Kandaangi Kandaangi",
    // src:"./HomeAssets/Kandangi-Kandangi.mp3",
    // image:"./HomeAssets/jilla.jpg",
    // },
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
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value / 100;
  };

  return (
    <div className="w-full h-[calc(100vh-70px)] flex">
      {/* Sidebar of the home */}

      {/* Main Content of the home */}

      <div className="flex-1 p-5 overflow-y-auto bg-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-4 text-white">Trending Now</h1>
        <div className="space-y-5">
          {chunkSongs(songs, 5).map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-start gap-7 flex-wrap space-x-3 space-y-10"
            >
              {row.map((song) => (
                <div
                  key={song.id}
                  className="relative group w-[150px] h-[100px]"
                >
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
                      {/* Pause/play button */}

                      {currentSong?.id === song.id && isPlaying ? (
                        <FaPause className="h-9 w-9 bg-black bg-opacity-50  p-2 rounded-full" />
                      ) : (
                        <FaPlay className="h-9 w-9 bg-black bg-opacity-50 e p-2 rounded-full" />
                      )}
                    </button>
                  </div>
                  <p className="text-center mt-0.5">{song.artist}</p>
                  <p className="text-center mt-0.5 text-[15px] text-[#5f70cc]">
                    {song.title}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div className="p-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <a
                  href="/home"
                  className="hover:text-cyan-300"
                >
                  Home
                </a>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <a
                  href="https://www.jiosaavn.com/featured-playlists/tamil"
                  className="hover:text-cyan-300"
                >
                  Tamil Songs Playlist
                </a>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-100 hover:text-cyan-300">
                  New Releases
                </span>
              </li>
            </ol>
          </nav>

          <div className="details p-6 text-white">
            <div className="flex flex-wrap text-xs text-white">
              {[
                {
                  title: "Top Tamil Artists",
                  items: [
                    "Da'Juan",
                    "Dajubilus",
                    "Dakaboom",
                    "Dakesis",
                    "Dmitrii Prosukov",
                    "Enemy Infestation",
                    "Jose Baptista Ferreira",
                    "Dos",
                    "The Year Ends In",
                    "Arson",
                    "Z A K",
                    "Frat Nox",
                  ],
                },
                {
                  title: "Top Tamil Actors",
                  items: [
                    "Raghubir R Yadav",
                    "Furqan Merchant",
                    "Shoib Nikash Shah",
                    "Chandrakant Dutta",
                    "Radhika Mehrotra",
                    "New Tamil Releases",
                    "Featured Tamil Playlists",
                    "Weekly Top Songs",
                    "Top Artists",
                    "Top Charts",
                    "Top Tamil Radios",
                  ],
                },
                {
                  title: "Top Tamil Albums",
                  items: [
                    "Aasa Kooda from Think Indie",
                    "Dragon Golden Sparrow",
                    "Sithira Puthiri from Think Indie",
                    "Kannada Prove (From 'Retro')",
                    "Yedi (From 'Nilavuku En Mel Ennadi Kobam')",
                    "Vidaamuyarchi",
                    "Adai Penne (Duet)",
                    "Devara Part 1 - Tamil",
                  ],
                },
                {
                  title: "Company",
                  items: [
                    "About Us",
                    "Culture",
                    "Blog",
                    "Jobs",
                    "Press",
                    "Advertise",
                    "Terms & Privacy",
                    "Help & Support",
                    "Grievances",
                    "JioSaavn Artist Insights",
                    "JioSaavn YourCast",
                  ],
                },
                {
                  title: "Top Tamil Playlist",
                  items: [
                    "Tamil 1990s",
                    "Tamil 2010s",
                    "Tamil 1980s",
                    "Tamil 2000s",
                    "Tamil 1960s",
                    "Tamil 1970s",
                    "Tamil Hit Songs",
                    "Tamil India Superhits Top 50",
                    "Sad Love - Tamil",
                    "Top Kuthu - Tamil",
                  ],
                },
              ].map(({ title, items }, index) => (
                <div key={index} className="w-1/5 flex flex-col space-y-0">
                  <h3 className="font-semibold text-cyan-500 mb-2 uppercase text-xs">
                    {title}
                  </h3>
                  <ol className="flex flex-col space-y-0">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
          <br></br>
          <br></br>
        </div>
      </div>

      {/* Music Player Footer */}
     

     
    </div>
  );
};

export default Playlists;
