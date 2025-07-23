// // Select elements
// const audioPlayer = document.getElementById("audioPlayer");
// const playPauseBtn = document.getElementById("playPauseBtn");
// const playPauseIcon = document.getElementById("playPauseIcon");
// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");
// const volumeControl = document.getElementById("volumeControl");
// const shuffleBtn = document.getElementById("shuffleBtn");
// const repeatBtn = document.getElementById("repeatBtn");
// const timeDisplay = document.getElementById("timeDisplay");

// // Playlist (you can add more songs)
// const playlist = ["./Paththavaikkum.mp3", "./Adiye-MassTamilan.fm.mp3"];
// let currentTrack = 0;

// // Function to play/pause music

// if (playPauseBtn) {
//   playPauseBtn.addEventListener("click", () => {
//       console.log("Play button clicked");  // ✅ Debug: Check if button works

//     if (!audioPlayer.src) {
//         audioPlayer.src = playlist[currentTrack]; // Set initial song
//         console.log("Setting source to:", audioPlayer.src);
//     }

//     if (audioPlayer.paused) {
//         console.log("Playing audio");
//         audioPlayer.play()
//             .then(() => console.log("Audio is playing..."))
//             .catch(error => console.error("Error:", error));
//         playPauseIcon.classList.replace("fa-play", "fa-pause");
//     } else {
//         console.log("Pausing audio");
//         audioPlayer.pause();
//         playPauseIcon.classList.replace("fa-pause", "fa-play");
//     }
// });

// // Function to change track
// nextBtn.addEventListener("click", () => {
//     console.log("Next button clicked");
//     currentTrack = (currentTrack + 1) % playlist.length;
//     audioPlayer.src = playlist[currentTrack];
//     audioPlayer.play();
//     playPauseIcon.classList.replace("fa-play", "fa-pause");
//     console.log("Playing next song:", playlist[currentTrack]);
// });

// // Function to go back to previous track
// prevBtn.addEventListener("click", () => {
//     console.log("Previous button clicked");
//     currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
//     audioPlayer.src = playlist[currentTrack];
//     audioPlayer.play();
//     playPauseIcon.classList.replace("fa-play", "fa-pause");
//     console.log("Playing previous song:", playlist[currentTrack]);
// });

// // Volume control
// volumeControl.addEventListener("input", (e) => {
//     audioPlayer.volume = e.target.value / 100;
//     console.log("Volume changed to:", audioPlayer.volume);
// });

// // Shuffle button functionality
// shuffleBtn.addEventListener("click", () => {
//     console.log("Shuffle button clicked");
//     currentTrack = Math.floor(Math.random() * playlist.length);
//     audioPlayer.src = playlist[currentTrack];
//     audioPlayer.play();
//     playPauseIcon.classList.replace("fa-play", "fa-pause");
//     console.log("Shuffled to:", playlist[currentTrack]);
// });

// // Repeat button functionality
// repeatBtn.addEventListener("click", () => {
//     console.log("Repeat button clicked");
//     audioPlayer.loop = !audioPlayer.loop;
//     console.log("Repeat mode:", audioPlayer.loop ? "ON" : "OFF");
// });

// // Time Display Update
// audioPlayer.addEventListener("timeupdate", () => {
//     const currentTime = Math.floor(audioPlayer.currentTime);
//     const duration = Math.floor(audioPlayer.duration);
//     timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
// });

// // Format time (mm:ss)
// function formatTime(seconds) {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
// }
// }