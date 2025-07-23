import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DB } from "./SidebarPages/Firebase";

const ProfileContainer = () => {
  const [profile, setProfile] = useState(null);
    const [userEmail, setUserEmail] = useState("");
  
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email);
        } else {
          setUserEmail("");
        }
      });
    }, []);
  
    useEffect(() => {
      const fetchProfile = async () => {
        if (!userEmail) return;
  
        try {
          const q = query(collection(DB, "profiles"), where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            setProfile(querySnapshot.docs[0].data());
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
  
      fetchProfile();
    }, [userEmail]);
  
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
  return (
    <div className="w-full h-[calc(100vh-70px)] flex bg-slate-8x00 overflow-auto">
     
 
    <ProfileSidebar username={`${profile?.firstName} ${profile?.lastName}`} />   {/* //Use $ to give the space between the first and last name */}

   

 
      <div className="flex-1 bg-slate-800 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileContainer;
