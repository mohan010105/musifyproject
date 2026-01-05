import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { _Auth, DB } from "../Backend/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Menu = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(_Auth, async (userInfo) => {
      if (userInfo && userInfo.emailVerified) {
        setUser(userInfo);
        await fetchUserRole(userInfo.email);
      } else {
        setUser(null);
        setRole("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (email) => {
    try {
      const q = query(collection(DB, "profiles"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setRole(userData.role || "user");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    _Auth.signOut();
  };

  function AuthenticatedUser() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const startLogout = () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        handleLogout();
        setIsLoggingOut(false);
      }, 500);
    };

    return (
      <>
        {role === "admin" && (
          <li>
            <NavLink to="/admin" className="px-3 py-2 hover:bg-blue-800 rounded-md flex">
              <h1>Admin</h1>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/profile" className="px-3 py-2 hover:bg-blue-800 rounded-md flex gap-2">
            <h1>{user?.displayName || "User"}</h1>
            <img
              src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"}
              alt=""
              className="h-[40px] w-[40px] rounded-full"
            />
          </NavLink>
        </li>
        <li>
          <button
            className="relative px-4 py-2 text-white font-bold rounded-md flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-800 active:scale-95"
            onClick={startLogout}
          >
            <FaUser className="mr-2" size={18} />
            <NavLink to="/home">Logout</NavLink>
            <FaSignOutAlt size={18} />
          </button>
        </li>
      </>
    );
  }

  function AnonymousUser() {
    return (
      <>
        <li>
          <NavLink to="/login" className="px-3 py-2 hover:bg-blue-800 rounded-md flex">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className="px-3 py-2 hover:bg-blue-800 rounded-md flex">
            Register
          </NavLink>
        </li>
      </>
    );
  }

  return (
    <ul className="flex gap-5 text-[17px]">
      <li>
        <NavLink to="/home" className="px-3 py-2 hover:bg-blue-800 rounded-md flex">
          Home
        </NavLink>
      </li>
      {/* <li>
        <NavLink to="/classical" className="px-3 py-2 hover:bg-blue-800 rounded-md flex">
          Classical
        </NavLink>
      </li> */}
      {user ? <AuthenticatedUser /> : <AnonymousUser />}
    </ul>
  );
};

export default Menu;