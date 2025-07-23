import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DB } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditAlbum = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState({
    AlbumTitle: "",
    albumDate: "",
    albumStarcast: "",
    albumDescription: "",
    albumLang: "",
    albumType: "",
    Thumbnail: "",
    SongsCounts: "",
    Songs: "",
  });

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumRef = doc(DB, "albums", id);
        const albumSnap = await getDoc(albumRef);
        if (albumSnap.exists()) {
          setAlbumData(albumSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };
    fetchAlbum();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbumData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const albumRef = doc(DB, "albums", id);
      await updateDoc(albumRef, albumData);
      alert("Album updated successfully");
    } catch (error) {
      console.error("Error updating album:", error);
      alert("Error updating album. Check console for details.");
    }
  };

  useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Album</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Album Title</label>
            <input type="text" name="AlbumTitle" value={albumData.AlbumTitle} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Album Date</label>
            <input type="date" name="albumDate" value={albumData.albumDate} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Starcast</label>
            <input type="text" name="albumStarcast" value={albumData.albumStarcast} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm">Description</label>
            <textarea name="albumDescription" value={albumData.albumDescription} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Language</label>
            <input type="text" name="albumLang" value={albumData.albumLang} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Album Type</label>
            <input type="text" name="albumType" value={albumData.albumType} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Thumbnail</label>
            <input type="text" name="Thumbnail" value={albumData.Thumbnail} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Song Counts</label>
            <input type="text" name="SongsCounts" value={albumData.SongsCounts} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
          <div>
            <label className="block text-sm">Songs</label>
            <input type="number" name="Songs" value={albumData.Songs} onChange={handleChange} className="p-2 w-full rounded bg-gray-700 text-white" required />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Update Album
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlbum;