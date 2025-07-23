import React, { useState, useEffect } from "react";
import { DB } from "./Firebase";
import { collection, getDocs, addDoc, updateDoc, query, where, doc } from "firebase/firestore";

const AddProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    dateOfBirth: "",
    age: "",
    languages: "",
    address: "",
    city: "",
    state: "",
    country: "",
    role: "user",
  });

  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!formData.email) return;
      try {
        const q = query(collection(DB, "profiles"), where("email", "==", formData.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const profileDoc = querySnapshot.docs[0];
          setProfileId(profileDoc.id);
          setFormData({ ...profileDoc.data(), role: "user" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      role: "user",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (profileId) {
        await updateDoc(doc(DB, "profiles", profileId), { ...formData, role: "user" });
        alert("Profile updated successfully");
      } else {
        const docRef = await addDoc(collection(DB, "profiles"), { ...formData, role: "user" });
        setProfileId(docRef.id);
        alert("Profile added successfully");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Languages</label>
            <input type="text" name="languages" value={formData.languages} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg" disabled={loading}>
            {loading ? "Processing..." : profileId ? "Update Profile" : "Add Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProfile;