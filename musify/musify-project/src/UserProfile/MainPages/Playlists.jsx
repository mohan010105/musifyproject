import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useSongs } from "../../Contex/SongContext";

const chunkSongs = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const resolveImage = (p) => {
  if (!p) return '/default-song.jpg';
  try {
    if (p.startsWith('/')) return p;
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    const parts = p.split('/');
    const name = parts[parts.length - 1];
    return `/images/${name}`;
  } catch (e) { return '/default-song.jpg'; }
};

const Playlists = () => {
  const ctx = useSongs();
  const songs = ctx.filteredSongs || ctx.songs || [];
    
    // {
    //   id: 5,
    //   title: "Devara",
    //   artist: "Pathavaikum",
    //   src: song5,
    //   image: img5,
    // },
    // {
    //   id: 6,
    //   title: "Dragon",
    //   artist: "Vazhithunaiye",
    //   src: song7,
    //   image: img7,
    // },
    // {
    //   id: 7,
    //   title: "Aadukalam",
    //   artist: "Ayyayo",
    //   src: song6,
    //   image: img6,
    // },
    // {
    //   id: 8,
    //   title: "NEEk",
    //   artist: "Golden Spaarow",
    //   src: song10,
    //   image: img10,
    // },
    // {
    //   id: 9,
    //   title: "Retro",
    //   artist: "Kannadi Poove",
    //   src: song8,
    //   image: img8,
    // },
    // {
    //   id: 10,
    //   title: "Kingston",
    //   artist: "Yelavalele",
    //   src: song14,
    //   image: img14,
    // },
    // {
    //   id: 11,
    return (
      <div className="w-full h-[calc(100vh-70px)] flex">
        <div className="flex-1 p-5 overflow-y-auto bg-slate-800 text-white">
          <h1 className="text-3xl font-bold mb-4 text-white">Playlists</h1>
          <div className="space-y-5">
            {chunkSongs(songs, 5).map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-start gap-7 flex-wrap space-x-3 space-y-10">
                {row.map((song) => (
                  <div key={song.id} className="relative group w-[150px] h-[100px]">
                    <img src={resolveImage(song.image)} alt={song.title} className="w-full h-full rounded-lg transition-opacity duration-300 group-hover:opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-black bg-opacity-50 text-white p-2 rounded-full" onClick={() => {
                        if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                          ctx.togglePlayPause();
                        } else {
                          ctx.playSong(song);
                        }
                      }}>
                        {ctx.currentSong?.id === song.id && ctx.isPlaying ? <FaPause className="h-9 w-9 p-2 rounded-full" /> : <FaPlay className="h-9 w-9 p-2 rounded-full" />}
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
      </div>
    );
  };

export default Playlists;
