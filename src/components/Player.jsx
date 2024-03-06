import { useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";
import { BsVolumeOffFill } from "react-icons/bs";
import { BsVolumeUpFill } from "react-icons/bs";
import { TbPlayerSkipForward } from "react-icons/tb";
import { TbPlayerSkipBack } from "react-icons/tb";
import { PiPlayPause } from "react-icons/pi";

function Player() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [token, setToken] = useState("");
  const [volume, setVolumes] = useState(0.1);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  


  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setToken(getToken);

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    // Cette fonction sera appelée pour initialiser le lecteur
    function initializePlayer() {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: volume,
      });

      // Event listeners
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id); // Sauvegardez l'ID de l'appareil pour une utilisation ultérieure
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );
        }
      });

      setPlayer(spotifyPlayer);
    }
  }, [token]);



  const play = (spotifyUri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotifyUri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to play track");
          setIsTrackPlaying(false);
        } else {
          setIsTrackPlaying(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const handlePlayMusic = () => {
    const spotifyUri = "spotify:track:5wZETLL0HqalpiF0G3Zv6b";
    play(spotifyUri);
  };

  const togglePlay = () => {
    if (!isTrackPlaying) {
      handlePlayMusic(); 
    } else if (player) {
      player.togglePlay(); 
    }
  };

  const previousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const handleVolumeChange = (volume) => {
    setVolumes(volume);
    if (player) {
      player.setVolume(volume);
    }
  };


  return (
    <div className="player flex w-full py-8 rounded-t bg-green-600 justify-evenly items-center fixed bottom-0 left-0">
       <div className="flex w-full justify-evenly items-center lg:max-w-2xl">
        {/* Removed the standalone Start button, as togglePlay now handles initial play */}
        <button onClick={() => previousTrack()}>
          <TbPlayerSkipBack className="size-6 hover:scale-110 transition-all" />
        </button>
        <button onClick={togglePlay} className="flex">
          <PiPlayPause className="size-7 hover:scale-110 transition-all" />
        </button>
        <button onClick={() => nextTrack()}>
          <TbPlayerSkipForward className="size-6 hover:scale-110 transition-all" />
        </button>
        <div className="flex justify-center items-center w-1/4">
          <BsVolumeOffFill className="size-7 mx-2" />
          <Slider
            color="secondary"
            step={0.05}
            maxValue={1}
            minValue={0}
            defaultValue={volume}
            aria-label="volume"
            className="slider"
            onChangeEnd={handleVolumeChange}
            size="md"
          />
          <BsVolumeUpFill className="size-7 mx-2" />
        </div>
      </div>
    </div>
  );
}

export default Player;
