import React, { useEffect, useState } from "react";
import { DB } from "./Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MyAccount = () => {
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">My Account</h1>

      {profile ? (
        <div className="p-4 bg-gray-700 rounded-lg mb-4">
          <form className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm">First Name</label>
              <input type="text" value={profile.firstName || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Last Name</label>
              <input type="text" value={profile.lastName || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Gender</label>
              <input type="text" value={profile.gender || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="text" value={profile.email || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Date of Birth</label>
              <input type="text" value={profile.dateOfBirth || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Age</label>
              <input type="text" value={profile.age || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Languages</label>
              <input type="text" value={profile.languages || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div className="col-span-3">
              <label className="block text-sm">Address</label>
              <input type="text" value={profile.address || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">City</label>
              <input type="text" value={profile.city || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">State</label>
              <input type="text" value={profile.state || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
            <div>
              <label className="block text-sm">Country</label>
              <input type="text" value={profile.country || ""} className="p-2 w-full rounded bg-gray-600 text-white" readOnly />
            </div>
          </form>
        </div>
      ) : (
        <p className="text-center">No profile found. Please add a profile first.</p>
      )}

      <div className="text-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          onClick={() => (window.location.href = "/profile/addprofile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
