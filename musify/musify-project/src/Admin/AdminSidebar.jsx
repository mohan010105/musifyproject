import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserEdit, FaPodcast, FaCreditCard } from "react-icons/fa";
import { MdLibraryMusic, MdAddBox } from "react-icons/md";

const AdminSidebar = () => {
  return (
    <aside className="w-60 h-full bg-slate-900 text-white p-5 flex flex-col space-y-4 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <h2 className="text-xl font-bold">ADMIN PANEL</h2>
      <nav className="space-y-5">
        <NavLink to="createalbum" className="cursor-pointer hover:text-gray-400 flex items-center">
          <MdLibraryMusic className="mr-2 text-blue-400" /> Create Album
        </NavLink>
        <NavLink to="createsong" className="cursor-pointer hover:text-gray-400 flex items-center">
          <MdAddBox className="mr-2 text-green-400" /> Create Song
        </NavLink>
        <NavLink to="editalbum" className="cursor-pointer hover:text-gray-400 flex items-center">
          <FaUserEdit className="mr-2 text-yellow-400" /> Edit Album
        </NavLink>
        <NavLink to="createpodcast" className="cursor-pointer hover:text-gray-400 flex items-center">
          <FaPodcast className="mr-2 text-purple-400" /> Create Podcast
        </NavLink>
        <NavLink to="paymentdashboard" className="cursor-pointer hover:text-gray-400 flex items-center">
          <FaCreditCard className="mr-2 text-red-400" /> Payment Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
