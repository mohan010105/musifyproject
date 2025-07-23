import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { MyGarage } from "../../Contex/AuthContex";

const Uploadphoto = () => {
  let { authUser } = useContext(MyGarage);
  let [photofile, setPhotoFile] = useState(null);
  let [photopreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate(); 

  function handleChangefile(e) {
    let file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      let previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!photofile) {
      toast.error("Please select an image to upload");
      return;
    }

    let data = new FormData();
    data.append("file", photofile);
    data.append("upload_preset", "musify"); // Your Cloudinary preset
    data.append("cloud_name", "dfobbhtrx"); // Your Cloudinary cloud name

    try {
      let response = await fetch(
        "https://api.cloudinary.com/v1_1/dfobbhtrx/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      let result = await response.json();
      if (!result.secure_url) {
        toast.error("Failed to upload image to Cloudinary");
        return;
      }

      let imageUrl = result.secure_url;

      if (authUser) {
        await updateProfile(authUser, {
          photoURL: imageUrl,
        });

        await authUser.reload(); // Refresh user data

        toast.success("Photo uploaded successfully!");
        window.location.assign("/profile/myaccount");    // Navigate to profile page
      } else {
        toast.error("User not found, please log in again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed, try again.");
    }
  }

  return (
    <section className="w-full h-[calc(100vh-70px)] bg-slate-800 flex flex-col items-center">
      <header>
        <h1 className="mt-34 text-3xl text-purple-300 font-bold tracking-wider">
          Upload Photo
        </h1>
      </header>
      <main>
        <form
          className="w-[400px] bg-slate-900 border-b-2 mt-4 p-5 border-slate-900 rounded-2xl"
          onSubmit={handleSubmit}
        >
          <div className="py-2">
            <label
              htmlFor="file"
              className="text-white font-bold tracking-widest"
            >
              Upload Photo Here!
            </label>

            {photopreview && (
              <img
                src={photopreview}
                alt="Preview"
                className="rounded-full m-auto w-[180px] h-[180px] p-2"
              />
            )}
            <input
              id="file"
              type="file"
              className="w-full border rounded border-slate-300 placeholder:text-white focus:outline-0 px-3 py-2 text-white file:px-3 file:py-1 file:bg-slate-500 file:rounded-md"
              name="uploadPhoto"
              onChange={handleChangefile}
            />
          </div>

          <div>
            <button className="w-full bg-purple-600 p-2 mt-2 text-white">
              Upload
            </button>
          </div>
          {/* <div className="text-white flex justify-center gap-2 my-2">
            <NavLink to="myaccount" className="hover:text-blue-400 underline">
              Back to account
            </NavLink> */}
          {/* </div> */}
        </form>
      </main>
    </section>
  );
};

export default Uploadphoto;
