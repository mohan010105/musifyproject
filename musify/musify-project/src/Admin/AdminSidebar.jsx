import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
// import { IoSettingsOutline } from "react-icons/io5";
// import { TbLockPassword } from "react-icons/tb";

const AdminSidebar = () => {
  return (
    <aside className="w-75 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Portal</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <NavLink 
              to="/admin/createalbum" 
              className={({ isActive }) => 
                `flex items-center gap-2 p-3 rounded-lg transition-all ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <MdLibraryMusic />
              <span>Create Album</span>
            </NavLink>
         </li>
         <li>
            <NavLink 
              to="/admin/editalbum" 
              className={({ isActive }) => 
                `flex items-center gap-2 p-3 rounded-lg transition-all ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <FaUserEdit />
              <span>Edit Album</span>
            </NavLink>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;