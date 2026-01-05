import { useState } from "react";
import { useSongs } from "../../Contex/SongContext";

const CreateSong = () => {
  const { addSong } = useSongs();

  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    category: "newreleases",
    image: "",
    audio: "",
  });
  const [coverPreview, setCoverPreview] = useState("");
  const [coverObjectUrl, setCoverObjectUrl] = useState(null);
  const [audioObjectUrl, setAudioObjectUrl] = useState(null);
  const [audioName, setAudioName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setCoverPreview(value);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (name === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setCoverPreview(dataUrl);
        setForm((prev) => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }

    if (name === 'audio') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setAudioName(file.name || 'audio');
        setForm((prev) => ({ ...prev, audio: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
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
      source: 'admin',
      createdAt: new Date().toISOString(),
    });

    alert("Song added successfully!");

    // Note: Keeping object URLs alive for the session to allow playback and image display
    // They will be cleaned up when the page is reloaded or closed

    setForm({ title: "", artist: "", album: "", genre: "", category: "newreleases", image: "", audio: "" });
    setCoverPreview("");
    setAudioName("");
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <label className="text-sm text-gray-300">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newreleases">Select</option>
              <option value="newreleases">New Releases</option>
              <option value="topcharts">Top Charts</option>
              <option value="playlists">Playlists</option>
              {/* <option value="podcasts">Podcasts</option> */}
              <option value="radio">Radio</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="text-sm text-gray-300">Cover Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-200 file:bg-slate-700 file:px-3 file:py-1 file:rounded file:border-0 file:text-sm"
            />

            {coverPreview ? (
              <div className="mt-3">
                <p className="text-xs text-gray-300 mb-2">Cover preview:</p>
                <img src={coverPreview} alt="cover preview" className="w-32 h-32 object-cover rounded shadow" onError={(e)=>e.currentTarget.style.display='none'} />
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm text-gray-300">Audio File <span className="text-red-400">*</span></label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-200 file:bg-slate-700 file:px-3 file:py-1 file:rounded file:border-0 file:text-sm"
            />
            {audioName ? <p className="text-xs text-gray-300 mt-2">Selected: {audioName}</p> : <p className="text-xs text-gray-400 mt-2">Choose an audio file (mp3, wav).</p>}
            {form.audio ? (
              <audio controls src={form.audio} className="mt-2 w-full" />
            ) : null}
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
            onClick={() => { setForm({ title: "", artist: "", album: "", genre: "", category: "newreleases", image: "", audio: "" }); setCoverPreview(""); }}
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
