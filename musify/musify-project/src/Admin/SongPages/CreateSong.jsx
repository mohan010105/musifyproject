import { useState } from "react";
import { useSongs } from "../../Contex/SongContext";

const CreateSong = () => {
  const { addSong } = useSongs();

  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    cover: "",
    audio: "",
  });
  const [coverPreview, setCoverPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "cover") setCoverPreview(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.artist || !form.audio) {
      alert("Please fill required fields: Title, Artist and Audio");
      return;
    }

    addSong({
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
    });

    alert("Song added successfully!");

    setForm({ title: "", artist: "", album: "", genre: "", cover: "", audio: "" });
    setCoverPreview("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-4">Create Song</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm text-gray-300">Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Artist <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="artist"
            placeholder="Artist Name"
            value={form.artist}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Album</label>
            <input
              type="text"
              name="album"
              placeholder="Album Name"
              value={form.album}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Genre</label>
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={form.genre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="text-sm text-gray-300">Cover Image URL</label>
            <input
              type="text"
              name="cover"
              placeholder="https://.../cover.jpg"
              value={form.cover}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {coverPreview ? (
              <div className="mt-3">
                <p className="text-xs text-gray-300 mb-2">Cover preview:</p>
                <img src={coverPreview} alt="cover preview" className="w-32 h-32 object-cover rounded shadow" onError={(e)=>e.currentTarget.style.display='none'} />
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm text-gray-300">Audio File URL <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="audio"
              placeholder="https://.../song.mp3"
              value={form.audio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-2">Paste a publicly accessible audio URL or add later.</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium shadow"
          >
            Add Song
          </button>

          <button
            type="button"
            onClick={() => { setForm({ title: "", artist: "", album: "", genre: "", cover: "", audio: "" }); setCoverPreview(""); }}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-gray-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSong;
