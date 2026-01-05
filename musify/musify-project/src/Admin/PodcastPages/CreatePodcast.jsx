import { useState } from "react";
import { useSongs } from "../../Contex/SongContext";

const CreatePodcast = () => {
  const { addPodcast } = useSongs();

  const [form, setForm] = useState({
    title: "",
    creator: "",
    image: null,
    audio: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setForm({ ...form, [name]: dataUrl });

        if (name === 'image') {
          setImagePreview(dataUrl);
        } else if (name === 'audio') {
          setAudioPreview(file.name);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.audio) {
      alert("Title and audio file are required");
      return;
    }

    const podcastWithId = { 
      ...form,
      id: Date.now().toString(),
      type: "podcast"
    };

    addPodcast(podcastWithId);

    setForm({
      title: "",
      creator: "",
      image: null,
      audio: null,
    });
    setImagePreview("");
    setAudioPreview("");

    alert("Podcast added successfully");
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Add Podcast</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          name="title"
          placeholder="Podcast Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded"
          required
        />

        <input
          name="creator"
          placeholder="Creator"
          value={form.creator}
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 rounded"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-900 rounded"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audio File</label>
          <input
            type="file"
            name="audio"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-900 rounded"
            required
          />
          {audioPreview && (
            <p className="mt-2 text-sm text-gray-400">Selected: {audioPreview}</p>
          )}
        </div>

        <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
          Add Podcast
        </button>
      </form>
    </div>
  );
};

export default CreatePodcast;