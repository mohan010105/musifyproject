import React, { useState } from "react";
import toast from "react-hot-toast";
import { DB } from "../../Backend/Firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateAlbum = () => {
  let [albumdetails, setAlbumDetails] = useState({
    title: "",
    lang: "",
    albumtype: "",
    description: "",
    daterelease: "",
    numberofsongs: "",
    starcast: "",
    director: "",
    songs: [],
    Thumbnail: "",
  });

  //NOw lets us destructre
  let {
    title,
    lang,
    albumtype,
    description,
    daterelease,
    numberofsongs,
    starcast,
    director,
    Thumbnail,
  } = albumdetails;

  let [songdetails, setSongDetails] = useState([
    {
      songTitle: "",
      songSingers: "",
      songMusicDirectors: "",
      songThumbnail: "",
      songAudio: "",
    },
  ]);

  //!Handle Change
  function handleChange(e) {
    setAlbumDetails({ ...albumdetails, [e.target.name]: e.target.value });
  }
  //!Handle Thumbnail
  function handleThumbnailChange(e) {
    let file = e.target.files[0];
    setAlbumDetails({
      ...albumdetails,
      Thumbnail: file,
    });
  }

  //!Handle songChange
  function handleSongChange(e, index) {
    let name = e.target.name;
    let value = e.target.value;
    let newSongdata = [...songdetails];
    newSongdata[index][name] = value;
    setSongDetails(newSongdata);
  }

  //!Handle handleSongFileChange

  function handleSongFileChange(e, index) {
    let file = e.target.files[0];
    let name = e.target.name;
    let newSongfile = [...songdetails];
    newSongfile[index][name] = file;
    setSongDetails(newSongfile);
  }

  //* Handlesubmit
  async function handlesubmit(e) {
    e.preventDefault();

    try {
      let AlbumThumbnailresult = "";
      if (Thumbnail) {
        //!step1 : convert into to the binary data

        let AlbumData = new FormData();
        AlbumData.append("file", Thumbnail);
        AlbumData.append("upload_preset", "music_musify");
        AlbumData.append("cloud_name", "dkmxj2jfa");

        let AlbumResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dkmxj2jfa/image/upload",
          {
            method: "POST",
            body: AlbumData,
          }
        );

        AlbumThumbnailresult = await AlbumResponse.json();
        console.log(AlbumThumbnailresult.url);
      }


       let songData = [];


      await Promise.all(
         songdetails.map(async (song, index) => {

          let songThumbnailUrl = ''
          if (song.songThumbnail) {
            //! step1 :convert to binary
            let songThumbnailData = new FormData();
            songThumbnailData.append("file", song.songThumbnail);
            songThumbnailData.append("upload_preset", "music_musify");
            songThumbnailData.append("cloud_name", "dkmxj2jfa");

            let songThumbnailResponse = await fetch(
              "https://api.cloudinary.com/v1_1/dkmxj2jfa/upload",
              {
                method: "POST",
                body: songThumbnailData,
              }
            );

            let songThumbnailresult = await songThumbnailResponse.json();
            songThumbnailUrl = songThumbnailresult.url;
            console.log(songThumbnailUrl);
          }

          let songObjectData = {}
          if (song.songAudio) {
            //! step1 :convert to binary
            let songAudioData = new FormData();
            songAudioData.append("file", song.songAudio);
            songAudioData.append("upload_preset", "music_musify");
            songAudioData.append("cloud_name", "dkmxj2jfa");

            let songAudioResponse = await fetch(
              "https://api.cloudinary.com/v1_1/dkmxj2jfa/upload",
              {
                method: "POST",
                body: songAudioData,
              }
            );

            let songAudioresult = await songAudioResponse.json();
            let songAudioUrl = songAudioresult.url;
            console.log(songAudioresult);

            songObjectData = {
              id: songAudioresult.asset_id,
              url: songAudioresult.url,
              duration: (() => {
                const seconds = Math.floor(songAudioresult.duration);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes}:${remainingSeconds
                  .toString()
                  .padStart(2, "0")}`;
              })(),
              size: (songAudioresult.bytes / (1024 * 1024)).toFixed(2) + " MB",
            };
          }

          songData.push(
            {
              ...songObjectData,

              songTitle:song.songTitle,
              songSingers:song.songSingers,
              songMusicDirectors:song.songMusicDirectors,
              songThumbnail:songThumbnailUrl,
            }
          )
        })
      )


      let payload={
        ...albumdetails,
        songs:songData,
        Thumbnail:AlbumThumbnailresult.url || ""
      }

      let AlbumCollection = collection(DB,"music_musify");
      await addDoc(AlbumCollection,payload);
      toast.success("Album created successfully😁")

      console.log(payload);

    } catch (err) {
      console.log(err.message);
    }




  }

  function AddSongs(){
    setSongDetails(
     [
      ...songdetails,
      {
        songTitle: "",
        songSingers: "",
        songMusicDirectors: "",
        songThumbnail: "",
        songAudio: "",
      },
     ]
    )
   }

  function removesongs(index){
     let newSongs = songdetails.filter((song,i)=> index !== i)
    setSongDetails(newSongs)
    }

  return (
    <section className="w-full   flex  items-center pt-5 flex-col">
      <header>
        <h1 className="text-3xl text-purple-600 font-bold mb-4">
          Update Profile
        </h1>
      </header>
      <main>
        <form
          action=""
          className="bg-slate-950 p-5 w-[70vw]  rounded"
          onSubmit={handlesubmit}
        >
          <section>
            <div className="flex gap-3 mb-3 bg-slate-900 p-3 rounded-md">
              {/* //!first row */}
              <div className="py-2 w-1/3 flex flex-col">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  id="title"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                  onChange={handleChange}
                />
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="lang"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Language:
                </label>
                <input
                  type="text"
                  name="lang"
                  value={lang}
                  onChange={handleChange}
                  id="lang"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="albumType"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Album Type:
                </label>
                <input
                  type="text"
                  value={albumtype}
                  onChange={handleChange}
                  name="albumtype"
                  id="albumType"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
            </div>

            <div className="flex gap-3 mb-3  bg-slate-900 p-3 rounded-md">
              {/* //!Second row */}
              <div className="py-2 w-1/3 flex flex-col">
                <label
                  htmlFor="daterelease"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Date Release:
                </label>
                <input
                  type="date"
                  name="daterelease"
                  value={daterelease}
                  onChange={handleChange}
                  id="daterelease"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="director"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Director:
                </label>
                <input
                  type="director"
                  name="director"
                  value={director}
                  onChange={handleChange}
                  id="state"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="starcast"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Starcast:
                </label>
                <input
                  type="starcast"
                  name="starcast"
                  value={starcast}
                  onChange={handleChange}
                  id="state"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
            </div>

            <div className="flex gap-3 mb-3 bg-slate-900 p-3 rounded-md">
              {/* //!Third row */}
              <div className="py-2 w-1/3 flex flex-col">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Description :
                </label>

                <textarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={handleChange}
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white "
                  rows={1}
                ></textarea>
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="numberofsongs"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  No of Songs:
                </label>
                <input
                  type="text"
                  name="numberofsongs"
                  value={numberofsongs}
                  onChange={handleChange}
                  id="numberofsongs"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
              <div className="py-2 flex  w-1/3 flex-col">
                <label
                  htmlFor="Thumbnail"
                  className="text-sm font-medium leading-5 tracking-wider text-gray-100 "
                >
                  Thumbnail:
                </label>
                <input
                  type="file"
                  name="Thumbnail"
                  onChange={handleThumbnailChange}
                  id="Thumbnail"
                  className=" p-2 rounded-sm text-white border-gray-500 border outline-none  placeholder:text-white  "
                />
              </div>
            </div>
          </section>

          <h1 className="text-2xl font-bold text-white text-center my-3">
            Add Songs
          </h1>
          {songdetails.map((song, index) => {
            return (
              <section
                key={index}
                className="w-full text-white bg-slate-700 p-7 flex flex-col gap-10 rounded-md"
              >
                <div className="flex gap-15">
                  <div className="flex flex-col w-1/3">
                    <label htmlFor="songTitle">Song Title:</label>
                    <input
                      type="text"
                      id="songTitle"
                      name="songTitle"
                      value={song.songTitle}
                      onChange={(e) => handleSongChange(e, index)}
                      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none "
                    />
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label htmlFor="songSingers">Song Singers:</label>
                    <input
                      type="text"
                      id="songSingers"
                      name="songSingers"
                      value={song.songSingers}
                      onChange={(e) => handleSongChange(e, index)}
                      className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none "
                    />
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label htmlFor="songMusicDirectors">Music Directors:</label>
                    <input
                      type="text"
                      id="songMusicDirectors"
                      name="songMusicDirectors"
                      value={song.songMusicDirectors}
                      onChange={(e) => handleSongChange(e, index)}
                      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none "
                    />
                  </div>
                </div>

                <div className="flex gap-20">
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="songThumbnail">Song Thumbnail:</label>
                    <input
                      accept="image/*"
                      type="file"
                      id="songThumbnail"
                      name="songThumbnail"
                      onChange={(e) => handleSongFileChange(e, index)}
                      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none "
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor="songAudio">Song Audio:</label>
                    <input
                      accept="audio/*"
                      type="file"
                      id="songAudio"
                      name="songAudio"
                      onChange={(e) => handleSongFileChange(e, index)}
                      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none "
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                    <button
                    type="button"
                     onClick={AddSongs}
                     className="px-3 py-2 bg-green-600 rounded-md">
                      Add song
                    </button>


                    {
                      index>=1 && <button
                      type="button"
                       onClick={()=>removesongs(index)}
                       className="px-3 py-2 bg-red-600 rounded-md">
                        Remove song
                      </button>
                    }
                </div>
              </section>
            );
          })}

          <div className="pt-4 text-center">
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-green-600">
              CreateAlbum
            </button>
          </div>
        </form>
      </main>
    </section>
  );
};

export default CreateAlbum;