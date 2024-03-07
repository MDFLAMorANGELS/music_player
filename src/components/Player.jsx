import { useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";
import { BsVolumeOffFill } from "react-icons/bs";
import { BsVolumeUpFill } from "react-icons/bs";
import { TbPlayerSkipForward } from "react-icons/tb";
import { TbPlayerSkipBack } from "react-icons/tb";
import { PiPlayPause } from "react-icons/pi";

function Player({playlistUri}) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [token, setToken] = useState("");
  const [volume, setVolumes] = useState(0.1);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Utiliser useEffect pour écouter les événements player_state_changed
  useEffect(() => {
    if (!player) return;

    // Écouter l'événement player_state_changed
    player.addListener('player_state_changed', state => {
      // Extraire les informations pertinentes de l'état de lecture
      const { track_window, paused } = state;

      // Mettre à jour l'état avec les informations de la piste en cours de lecture
      setCurrentTrack({
        name: track_window.current_track.name,
        artist: track_window.current_track.artists[0].name,
        paused: paused
      });
    });

    // Retirer les écouteurs d'événements lors du démontage du composant
    return () => {
      player.removeListener('player_state_changed');
    };
  }, [player]);


  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setToken(getToken);

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

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
        setDeviceId(device_id);
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
    console.log(spotifyUri);
  
    const isPlaylist = spotifyUri.includes("playlist");
    let body;
  
    if (isPlaylist) {
      body = JSON.stringify({ context_uri: spotifyUri });
    } else {
      body = JSON.stringify({ uris: [spotifyUri] });
    }
  
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: body,
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

  useEffect(() => {
    if (playlistUri) {
      play(playlistUri);
    }
  }, [playlistUri]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsTrackPlaying(!isTrackPlaying);
      });
    }
  };
  
  // Adjust handlePlayMusic to not call togglePlay unless necessary
  const handlePlayMusic = (spotifyUri) => {
    if (!isTrackPlaying) {
      play(spotifyUri);
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
    <div className="player flex w-full py-8 rounded-t bg-green-600 justify-evenly items-center fixed bottom-0 left-0 z-10">
       <div className="flex w-full justify-evenly items-center lg:max-w-2xl">
       {currentTrack && (
      <div className="current-track">
        <p>Titre : {currentTrack.name}</p>
        <p>Artiste : {currentTrack.artist}</p>
        <p>{currentTrack.paused ? 'Paused' : 'Playing'}</p>
      </div>
    )}
        <button onClick={() => previousTrack()}>
          <TbPlayerSkipBack className="size-6 hover:scale-110 transition-all" />
        </button>
        <button onClick={togglePlay} className="flex">
          <PiPlayPause className="size-7 hover:scale-110 transition-all" />
        </button>
        <button onClick={() => nextTrack()}>
          <TbPlayerSkipForward className="size-6 hover:scale-110 transition-all" />
        </button>
        <div className=" justify-center items-center w-1/4 hidden sm:flex">
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
