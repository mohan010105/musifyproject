import { useSongs } from "../../Contex/SongContext";
import { FaPlay } from "react-icons/fa";

const History = () => {
  const { history, playSong } = useSongs();

  if (!history.length) {
    return <p className="text-white p-5">No listening history yet</p>;
  }

  return (
    <div className="p-5 text-white">
      <h2 className="text-2xl font-bold mb-4">📜 Listening History</h2>

      {history.map((song) => (
        <div
          key={song.id}
          className="flex items-center justify-between p-3 mb-2 bg-gray-800 rounded"
        >
          <div>
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>

          <button
            onClick={() => playSong(song)}
            className="bg-green-500 p-2 rounded-full"
          >
            <FaPlay />
          </button>
        </div>
      ))}
    </div>
  );
};

export default History;
