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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.artist || !form.audio) {
      alert("Please fill required fields");
      return;
    }

    addSong({
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
    });

    alert("Song added successfully!");

    setForm({
      title: "",
      artist: "",
      album: "",
      genre: "",
      cover: "",
      audio: "",
    });
  };

  return (
    <div className="admin-page">
      <h2>Create Song</h2>

      <form onSubmit={handleSubmit} className="song-form">
        <input
          type="text"
          name="title"
          placeholder="Song Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="artist"
          placeholder="Artist Name"
          value={form.artist}
          onChange={handleChange}
        />

        <input
          type="text"
          name="album"
          placeholder="Album Name"
          value={form.album}
          onChange={handleChange}
        />

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        />

        <input
          type="text"
          name="cover"
          placeholder="Cover Image URL"
          value={form.cover}
          onChange={handleChange}
        />

        <input
          type="text"
          name="audio"
          placeholder="Audio File URL"
          value={form.audio}
          onChange={handleChange}
        />

        <button type="submit">Add Song</button>
      </form>
    </div>
  );
};

export default CreateSong;
