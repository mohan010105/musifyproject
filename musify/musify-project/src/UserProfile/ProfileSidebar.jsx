import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { _Auth, DB } from "./SidebarPages/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MyGarage } from "../Contex/AuthContex";

const ProfileSidebar = ({ username }) => {
  const navigate = useNavigate();
  let {authUser}=useContext(MyGarage)
  const [profilePic, setProfilePic] = useState("");
console.log(profilePic?.photoURL)
useEffect(()=>{setProfilePic(authUser?.photoURL)},[authUser?.photoURL])
  return (
    <section className="w-1/4 h-[calc(100vh-70px)] bg-slate-600">
      <div className="w-full h-1/4 bg-slate-900 flex flex-col justify-center items-center font-bold">
        <img src={profilePic} className="w-20 h-20 rounded-full" alt="profile" />
        <h1 className="text-white text-2xl font-bold mt-2">{username}</h1>
      </div>

      <div className="p-4 text-white">
        <div
          onClick={() => navigate("myaccount")}
          className="text-lg font-semibold flex items-center mb-4 hover:bg-slate-700 rounded-md p-2 cursor-pointer"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="myaccount" className="w-6 h-6 mr-2" />
          My Account
        </div>

        <div
          onClick={() => navigate("addprofile")}
          className="text-lg font-semibold flex items-center mb-4 hover:bg-slate-700 rounded-md p-2 cursor-pointer"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="addprofile" className="w-6 h-6 mr-2" />
          Add Profile
        </div>

        <div
          onClick={() => navigate("changepassword")}
          className="text-lg font-semibold flex items-center mb-4 hover:bg-slate-700 rounded-md p-2 cursor-pointer"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="changepassword" className="w-6 h-6 mr-2" />
          Change Password
        </div>

        <div
          onClick={() => navigate("uploadphoto")}
          className="text-lg font-semibold flex items-center mb-4 hover:bg-slate-700 rounded-md p-2 cursor-pointer"
        >
          <MdOutlineAddAPhoto className="w-6 h-6 mr-2 text-black" />
          Upload Photo
        </div>

        <div
          onClick={() => navigate("settings")}
          className="text-lg font-semibold flex items-center mb-4 hover:bg-slate-700 rounded-md p-2 cursor-pointer"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" alt="settings" className="w-6 h-6 mr-2" />
          Settings
        </div>
      </div>
    </section>
  );
};

export default ProfileSidebar;
