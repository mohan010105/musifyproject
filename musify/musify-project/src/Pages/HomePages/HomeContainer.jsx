import React, { useEffect, useState } from 'react';
import { FaPause, FaPlay } from "react-icons/fa";
import { FaHeadphones, FaPlus } from "react-icons/fa";
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSongs } from '../../Contex/SongContext';
import { useSubscription } from '../../Contex/SubscriptionContext';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import { AnimatePresence, motion } from 'framer-motion';

const HomeContainer = () => {
  const ctx = useSongs();
  const { userData } = useSubscription();
  const canAccessPremiumContent = userData.subscriptionPlan === 'Premium' || userData.isAdmin === true;
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  // Add songs to context on mount
  useEffect(() => {
    const MANUAL_SONGS = [
      { id: 1, title: 'Idhazhin Oram', artist: 'Anirudh', audio: '/audio/Idhazhin Oram (The Innocence of Love) - Anirudh Ravichander,.mp3', image: '/src/Pages/src/3.jpg', source: 'home', category: 'newreleases', type: 'song' },
      { id: 2, title: 'Pathikichu', artist: 'Vidaamuyarchi', audio: '/audio/Pathikichu.mp3', image: '/src/Pages/src/ak.jpg', source: 'home', category: 'topcharts', type: 'song' },
      { id: 3, title: 'Amaran', artist: 'Vennilavu Saaral', audio: '/audio/Vennilavu Saaral.mp3', image: '/src/Pages/src/Amaran.jpg', source: 'home', category: 'newreleases', type: 'song' },
      { id: 5, title: 'Lubber Panthu', artist: 'Chillanjirukkiye', audio: '/audio/Chillanjirukkiye.mp3', image: '/src/Pages/src/Screenshot 2025-03-09 160238.png', source: 'home', category: 'topcharts', type: 'song' },
      { id: 6, title: 'Devara', artist: 'Pathavaikum', audio: '/audio/Paththavaikkum.mp3', image: '/src/Pages/src/devara.jpg', source: 'home', category: 'newreleases', type: 'song' },
      { id: 4, title: 'Dragon', artist: 'Vazhithunaiye', audio: '/audio/Vazhithunaiye.mp3', image: '/src/Pages/src/drangon.jpg', source: 'home', category: 'topcharts', type: 'song' },
      { id: 7, title: 'Aadukalam', artist: 'Ayyayo', audio: '/audio/Ayyayo - G.V. Prakash Kumar, S. P. Balasubrahmanyam, S.P.B.mp3', image: '/src/Pages/src/ayyoyo.webp', source: 'home', category: 'newreleases', type: 'song' },
      { id: 8, title: 'NEEk', artist: 'Golden Spaarow', audio: '/audio/Golden-Sparrow-MassTamilan.dev.mp3', image: '/src/Pages/src/neek.jpg', source: 'home', category: 'topcharts', type: 'song' },
      { id: 9, title: 'Retro', artist: 'Kannadi Poove', audio: '/audio/Kannadi-Poove-MassTamilan.dev.mp3', image: '/src/Pages/src/retro.jpg', source: 'home', category: 'newreleases', type: 'song' },
      { id: 10, title: 'Kingston', artist: 'Yelavalele', audio: '/audio/Yelavalele.mp3', image: '/src/Pages/src/Screenshot 2025-03-09 160446.png', source: 'home', category: 'topcharts', type: 'song' },
      { id: 11, title: 'Dragon', artist: 'Matinaru Orutharu', audio: '/audio/Matikuranu Orutharu', image: '/src/Pages/src/drangon.jpg', source: 'home', category: 'topcharts', type: 'song' },
      // { id: 11, title: 'Once more', artist: 'Vaa Kannamaa'},
    ];

    if (!ctx.songs?.some((s) => s.source === "home")) {
      ctx.addSongs(MANUAL_SONGS);
    }
  }, [ctx]);

  const songs = ctx.songs || [];

  const chunkSongs = (songsArray, size) => {
    let chunkedArray = [];
    for (let i = 0; i < songsArray.length; i += size) {
      chunkedArray.push(songsArray.slice(i, i + size));
    }
    return chunkedArray;
  };

  return (
    <div className="w-full h-[calc(100vh-70px)] flex">
      {/* Sidebar of the home */}
      <aside className="w-60 h-full bg-gray-900 text-white p-5 flex flex-col space-y-4 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <h2 className="text-xl font-bold">BROWSE</h2>
        <nav className="space-y-5">
          <NavLink to="newreleases" className="cursor-pointer hover:text-gray-400 items-center block">
            🔥 New Releases
          </NavLink>
          <NavLink to="topcharts" className="cursor-pointer hover:text-gray-400 flex items-center">
            📊 Top Charts
          </NavLink>
          <NavLink to="playlists" className="cursor-pointer hover:text-gray-400 flex items-center">
            📋 Top Playlists
          </NavLink>
          {canAccessPremiumContent && (
            <>
              <NavLink to="podcasts" className="cursor-pointer hover:text-gray-400 flex items-center">
                <FaHeadphones className="mr-2 text-blue-400" /> Podcasts
              </NavLink>
              <NavLink to="radio" className="cursor-pointer hover:text-gray-400 block">
                📻 Radio
              </NavLink>
            </>
          )}
          <br/>
          <h2 className="text-xl font-bold">MY LIBRARY</h2>
          <NavLink to="history" className="cursor-pointer hover:text-gray-400 block">📜 History</NavLink>
          <NavLink to="liked" className="cursor-pointer hover:text-gray-400 block">🎵 Liked Songs</NavLink>
          <NavLink to="albums" className="cursor-pointer hover:text-gray-400 block">📀 My Playlists</NavLink>
          <NavLink to="mypodcasts" className="cursor-pointer hover:text-gray-400 block">🎧 Podcasts</NavLink>
          <NavLink to="artists" className="cursor-pointer hover:text-gray-400 block">🎤 Artists</NavLink>
          <button className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 flex items-center" onClick={() => setShowModal(true)}>
            <FaPlus className="mr-2" /> Add New Playlist
          </button>
          <br />
          <br />
        </nav>
      </aside>

      {/* Main Content of the home */}
      <div className="flex-1 overflow-y-auto bg-slate-800 text-white">
        <Outlet />
      </div>

      {/* Playlist Modal */}
      {showModal && (
        <CreatePlaylistModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default HomeContainer;
