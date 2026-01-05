import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaList,
  FaChartLine,
  FaHeadphones,
  FaPlus,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { useSongs } from "../Contex/SongContext";
import { useSubscription } from "../Contex/SubscriptionContext";
import FooterPlayer from "../components/FooterPlayer";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

/* ---------- HELPER ---------- */
const chunkSongs = (arr, size) => {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

const Home = () => {
  const ctx = useSongs();
  const { userData } = useSubscription();
  const canAccessPremiumContent = userData.subscriptionPlan === 'Premium' || userData.isAdmin === true;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const songs = ctx.songs.filter(song => (song.category === 'newreleases' || song.category === 'playlists') && song.type !== 'podcast') || [];

  return (
    <div className="w-full h-[calc(100vh-70px)] flex">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="w-60 bg-gray-900 text-white p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold">BROWSE</h2>

        <NavLink to="/home/newreleases" className="hover:text-gray-400">
          🔥 New Releases
        </NavLink>

        <NavLink to="/home/topcharts" className="flex items-center hover:text-gray-400">
          <FaChartLine className="mr-2 text-orange-400" /> Top Charts
        </NavLink>

        <NavLink to="/home/playlists" className="flex items-center hover:text-gray-400">
          <FaList className="mr-2 text-yellow-400" /> Top Playlists
        </NavLink>

        {canAccessPremiumContent && (
          <>
            <NavLink to="/home/podcasts" className="flex items-center hover:text-gray-400">
              <FaHeadphones className="mr-2 text-blue-400" /> Podcasts
            </NavLink>

            <NavLink to="/home/radio" className="hover:text-gray-400">
              📻 Radio
            </NavLink>
          </>
        )}

        <h2 className="text-xl font-bold mt-6">MY LIBRARY</h2>
        <NavLink to="/home/history">📜 History</NavLink>
        <NavLink to="/home/liked">🎵 Liked Songs</NavLink>
        <NavLink to="/home/playlists">📀 My Playlists</NavLink>
        {/* <NavLink to="/home/mypodcasts">🎧 Podcasts</NavLink> */}
        <NavLink to="/home/artists">🎤 Artists</NavLink>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 px-4 py-2 rounded-lg mt-4 flex items-center hover:bg-green-600"
        >
          <FaPlus className="mr-2" /> Add New Playlist
        </button>
      </aside>

      {/* ---------- CONTENT ---------- */}
      <main className="flex-1 p-5 bg-slate-800 text-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Trending Now</h1>

        {chunkSongs(songs, 5).map((row, idx) => (
          <div key={idx} className="flex gap-6 mb-8 flex-wrap">
            {row.map((song) => (
              <div key={song.id} className="w-[150px]">
                <div className="relative group">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-[100px] rounded-lg"
                  />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        if (ctx.currentSong?.id === song.id && ctx.isPlaying) {
                          ctx.togglePlayPause();
                        } else {
                          ctx.playSong(song);
                        }
                      }}
                      className="bg-black bg-opacity-50 p-2 rounded-full"
                    >
                      {ctx.currentSong?.id === song.id && ctx.isPlaying ? (
                        <FaPause />
                      ) : (
                        <FaPlay />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm mt-1">{song.artist}</p>
                <p className="text-sm text-[#5f70cc]">{song.title}</p>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* ---------- GLOBAL PLAYER ---------- */}
      <FooterPlayer />

      {/* ---------- CREATE PLAYLIST MODAL ---------- */}
      {isModalOpen && (
        <CreatePlaylistModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Home;
