import { useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";
import { BsVolumeOffFill, BsVolumeUpFill } from "react-icons/bs";
import { TbPlayerSkipForward, TbPlayerSkipBack } from "react-icons/tb";
import { PiPlayPause } from "react-icons/pi";

function Player({ playlistUri, trackUri }) {

  const [player, setPlayer] = useState(null); // État du lecteur Spotify
  const [deviceId, setDeviceId] = useState(null); // ID du périphérique de lecture
  const [token, setToken] = useState(""); // Jeton d'authentification Spotify
  const [volume, setVolumes] = useState(0.1); // Volume audio
  const [isTrackPlaying, setIsTrackPlaying] = useState(false); // État de lecture de la piste actuelle
  const [currentTrack, setCurrentTrack] = useState(null); // Informations sur la piste actuelle
  const [trackDuration, setTrackDuration] = useState(0); // Durée totale de la piste
  const [elapsedTime, setElapsedTime] = useState(0); // Temps écoulé depuis le début de la piste
  const [currentTrackId, setCurrentTrackId] = useState(null); // ID de la piste actuelle
  const [isSimpleTrackPlaying, setIsSimpleTrackPlaying] = useState(false); // État pour suivre si une simple piste est en cours de lecture


  // Utiliser useEffect pour écouter les événements player_state_changed
  useEffect(() => {
    if (!player) return;

    player.addListener("player_state_changed", (state) => {
      if (!state || !state.track_window || !state.track_window.current_track) return;
  
      const { paused, position, duration } = state;
  
      // Vérifier si la piste est terminée
      if (!paused && position === 0 && duration === 0) {
        setIsTrackPlaying(false);
        setElapsedTime(0)
      }
      else {
        setIsTrackPlaying(!paused);
      }
  
      const newTrackId = state.track_window.current_track.id; // Obtenir l'ID de la nouvelle piste
  
      // Vérifier si la piste a changé
      if (currentTrackId !== newTrackId) {
        setCurrentTrackId(newTrackId);
        setElapsedTime(0);
      }
    });

    // Écouter l'événement player_state_changed pour mettre à jour les informations sur la piste actuelle
    player.addListener("player_state_changed", (state) => {

      const { track_window, paused } = state;

      // Mettre à jour les informations sur la piste actuelle
      setCurrentTrack({
        name: track_window.current_track.name,
        artist: track_window.current_track.artists[0].name,
        paused: paused,
        image: track_window.current_track.album.images[1].url,
      });
      // Mettre à jour la durée totale de la piste
      setTrackDuration(track_window.current_track.duration_ms);
    });
    if (isTrackPlaying) {
      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
      
        let current_track = state.track_window.current_track;
      
        console.log('Currently Playing', current_track);
      });
    }

    // Retirer les écouteurs d'événements lors du démontage du composant
    return () => {
      player.removeListener("player_state_changed");
    };

  }, [player, elapsedTime]);

  // Utiliser useEffect pour gérer la progression du temps écoulé
  useEffect(() => {
    let intervalId;

    // Mettre à jour le temps écoulé à intervalles réguliers lorsque la piste est en lecture
    if (isTrackPlaying) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [isTrackPlaying]);

  // Utiliser useEffect pour réinitialiser le temps écoulé lorsque la piste se termine
  useEffect(() => {
    if (elapsedTime > trackDuration) {
      setElapsedTime(trackDuration); // Mettre à jour le temps écoulé à la durée totale de la piste
    }
  }, [elapsedTime, trackDuration]);

  // Utiliser useEffect pour initialiser le lecteur Spotify et obtenir le jeton d'authentification
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setToken(getToken);

    // Initialiser le lecteur Spotify une fois que le SDK Web Playback est prêt
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
        // localStorage.removeItem("token");
        // location.reload();
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log("The Web Playback SDK successfully connected to Spotify!"); 
        }
      });

      setPlayer(spotifyPlayer);
    }
  }, [token]);

  // Fonction pour démarrer la lecture d'une piste ou d'une liste de lecture
  const play = (spotifyUri) => {

    const isPlaylist = spotifyUri.includes("playlist");
    let body;

    // Créer le corps de la requête en fonction du type de URI Spotify
    if (isPlaylist) {
      body = JSON.stringify({ context_uri: spotifyUri });
    } else {
      body = JSON.stringify({ uris: [spotifyUri] });
    }

    // Envoyer une requête pour démarrer la lecture sur le périphérique spécifié
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
          setIsTrackPlaying(false); // Mettre à jour l'état de lecture de la piste
        } else {
          setIsTrackPlaying(true);
        }
      })
      .catch((err) => console.error(err));
  };

  // Utiliser useEffect pour démarrer la lecture lorsque l'URI de la liste de lecture est fourni
  useEffect(() => {
    if (playlistUri) {
      play(playlistUri);
      setIsSimpleTrackPlaying(false); // Mettre à jour l'état de lecture de simple piste
    }
  }, [playlistUri]);

  useEffect(() => {
    if (trackUri) {
      play(trackUri);
      setIsSimpleTrackPlaying(true); // Mettre à jour l'état de lecture de simple piste
    }
  }, [trackUri]);

  // Fonction pour basculer la lecture/pause
  const togglePlay = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsTrackPlaying(!isTrackPlaying); // Mettre à jour l'état de lecture de la piste
      });
    }
  };

  // Fonction pour passer à la piste précédente
  const previousTrack = () => {
    if (player) {
      player.previousTrack();
      setElapsedTime(0);
    }
  };

  // Fonction pour passer à la piste suivante
  const nextTrack = () => {
    if (player) {
      player.nextTrack();
      setElapsedTime(0);
    }
  };

  // Fonction pour gérer le changement de volume
  const handleVolumeChange = (volume) => {
    setVolumes(volume); 
    if (player) {
      player.setVolume(volume); // Définir le volume du lecteur Spotify
    }
  };

  // Fonction pour formater la durée de la piste au format MM:SS
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  };

  // Calculer le pourcentage de progression de la piste
  const progressPercentage = (elapsedTime / trackDuration) * 100 || 0;

  // Fonction pour gérer le changement de progression de la piste
  const handleProgressChange = (newValue) => {
    const newElapsedTime = (newValue / 100) * trackDuration;
    setElapsedTime(newElapsedTime); // Mettre à jour le temps écoulé basé sur la nouvelle valeur de la barre
    if (player) {
      player.seek(newElapsedTime).then(() => {
      }).catch(error => {
        console.error("Erreur lors du saut à la nouvelle position", error); 
      });
    }
  };

  // Utiliser useEffect pour réinitialiser le temps écoulé lorsque la piste se termine
  useEffect(() => {
    if (elapsedTime > trackDuration) {
      setElapsedTime(0);
    }
  }, [elapsedTime]);

  return (
    <div className="player flex w-full py-3 rounded-t bg-green-600 justify-center items-center fixed bottom-0 left-0 z-10">
      {currentTrack && (
        <img src={currentTrack.image} alt="image de l album en cours" className=" rounded-lg mx-2 sm:mx-6 md:scale-110"/>
      )}
      <div className="flex flex-col justify-center items-center w-full">
      {currentTrack && (
        <div className="current-track">
          <p className="text-center p-1 font-semibold text-lg">{currentTrack.name} : {currentTrack.artist}</p>
          {trackDuration > 0 && (
            <p className="text-center p-1 font-semibold text-lg">
              {formatDuration(elapsedTime)} / {formatDuration(trackDuration)}
            </p>
          )}
        </div>
      )}
      <div className="w-full flex justify-evenly items-center p-1 my-2">
      <button onClick={() => previousTrack()} disabled={!isTrackPlaying || isSimpleTrackPlaying}>
          <TbPlayerSkipBack className="size-6 hover:scale-110 transition-all" />
        </button>
        <button onClick={togglePlay} className="flex">
          <PiPlayPause className="size-7 hover:scale-110 transition-all" />
        </button>
        <button onClick={() => nextTrack()} disabled={!isTrackPlaying || isSimpleTrackPlaying}>
          <TbPlayerSkipForward className="size-6 hover:scale-110 transition-all" />
        </button>
        <div className=" justify-center items-center w-1/3 hidden sm:flex">
          <BsVolumeOffFill className="size-7 mx-2" />
          <Slider
            color="secondary"
            step={0.05}
            maxValue={1}
            minValue={0}
            defaultValue={volume}
            aria-label="volume"
            className="slider w-full md:max-w-40"
            onChangeEnd={handleVolumeChange}
            size="md"
            radius="lg"
          />
          <BsVolumeUpFill className="size-7 mx-2" />
        </div>
      </div>
      {/* Barre de progression de la piste */}
      {currentTrack && (
        <Slider
          color="foreground"
          value={progressPercentage}
          onChange={handleProgressChange}
          aria-label="progress"
          size="md"
          className=" opacity-90 w-2/3"
          isDisabled
        />
      )}
      </div>
    </div>
  );
}

export default Player;
