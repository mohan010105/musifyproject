import { NavLink } from "react-router-dom";
import { FaChartLine, FaList, FaHeadphones, FaPlus } from "react-icons/fa";
import { useSubscription } from "../../Contex/SubscriptionContext";

const HomeSidebar = () => {
  const { userData } = useSubscription();
  const canAccessPremiumContent = userData.subscriptionPlan === 'Premium' || userData.isAdmin === true;

  return (
    <aside className="w-60 h-full bg-gray-900 text-white p-5 flex flex-col space-y-4 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <h2 className="text-xl font-bold">BROWSE</h2>
      <nav className="space-y-5">
        <p>
          <NavLink to="newreleases" className="cursor-pointer hover:text-gray-400">🔥 New Releases</NavLink>
        </p>
        <NavLink to="topcharts" className="cursor-pointer hover:text-gray-400 flex items-center">
          <FaChartLine className="mr-2 text-orange-400" /> Top Charts
        </NavLink>
        <NavLink to="playlists" className="cursor-pointer hover:text-gray-400 flex items-center">
          <FaList className="mr-2 text-yellow-400" /> Top Playlists
        </NavLink>
        {canAccessPremiumContent && (
          <>
            <NavLink to="podcasts" className="cursor-pointer hover:text-gray-400 flex items-center">
              <FaHeadphones className="mr-2 text-blue-400" /> Podcasts
            </NavLink>
            <p>
              <NavLink to="radio" className="cursor-pointer hover:text-gray-400">📻 Radio</NavLink>
            </p>
          </>
        )}
        <h2 className="text-xl font-bold mt-4">MY LIBRARY</h2>
        <p className="cursor-pointer hover:text-gray-400">📜 History</p>
        <p className="cursor-pointer hover:text-gray-400">🎵 Liked Songs</p>
        <p className="cursor-pointer hover:text-gray-400">📀 Albums</p>
        <p className="cursor-pointer hover:text-gray-400">🎧 Podcasts</p>
        <p className="cursor-pointer hover:text-gray-400">🎤 Artists</p>
        <button className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 flex items-center">
          <FaPlus className="mr-2" /> Add New Playlist
        </button>
      </nav>
    </aside>
  );
};

export default HomeSidebar;
