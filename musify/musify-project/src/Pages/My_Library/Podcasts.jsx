import React, { useRef, useState } from 'react';

const samplePodcasts = [
  {
    id: 1,
    title: 'Tech Trends Weekly',
    host: 'Ava Johnson',
    duration: '32:14',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    image: 'https://picsum.photos/seed/pod1/120/120',
  },
  {
    id: 2,
    title: 'History Deep Dive',
    host: 'Marcus Lee',
    duration: '45:02',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    image: 'https://picsum.photos/seed/pod2/120/120',
  },
  {
    id: 3,
    title: 'Mindful Minutes',
    host: 'Sofia Reyes',
    duration: '18:50',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    image: 'https://picsum.photos/seed/pod3/120/120',
  },
];

const Podcasts = () => {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const togglePlay = (pod) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (current && current.id === pod.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      setCurrent(pod);
      audio.src = pod.src;
      audio.play();
      setIsPlaying(true);
    }
  };

  const toggleSubscribe = (id) => {
    setSubscriptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Podcasts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samplePodcasts.map((pod) => (
          <div key={pod.id} className="flex items-center gap-4 bg-gray-800 p-4 rounded">
            <img src={pod.image} alt="pod" className="w-20 h-20 rounded" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{pod.title}</h3>
                  <p className="text-sm text-gray-300">{pod.host} • {pod.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlay(pod)}
                    className="px-3 py-1 bg-indigo-600 rounded"
                  >
                    {current && current.id === pod.id && isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={() => toggleSubscribe(pod.id)}
                    className="px-3 py-1 bg-gray-700 rounded"
                  >
                    {subscriptions.includes(pod.id) ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default Podcasts;
