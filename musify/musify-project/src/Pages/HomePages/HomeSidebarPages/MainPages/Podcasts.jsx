import { FaPlay } from "react-icons/fa";
import { useSongs } from "../../../../Contex/SongContext";

const Podcasts = () => {
  const { podcasts, playSong } = useSongs();

  if (!podcasts.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No podcasts available
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-5 gap-6 text-white">
      {podcasts.map((podcast) => (
        <div key={podcast.id} className="bg-gray-900 p-3 rounded">
          <img
            src={podcast.image || "/default-podcast.jpg"}
            className="w-full h-36 object-cover rounded mb-2"
            alt={podcast.title}
          />

          <h4 className="font-semibold">{podcast.title}</h4>
          <p className="text-sm text-gray-400">{podcast.creator}</p>

          <button
            onClick={() => playSong(podcast)}
            className="mt-2 flex items-center gap-2 text-green-400"
          >
            <FaPlay /> Play
          </button>
        </div>
      ))}
    </div>
  );
};

export default Podcasts;
