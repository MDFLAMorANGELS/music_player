import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import React from "react";
import { IoTimeOutline } from "react-icons/io5";
import {Spinner} from "@nextui-org/react";



const spotifyApi = new SpotifyWebApi();

export default function Playlist({ onTrackSelect }) {
  const { playlistId } = useParams(); // Récupérer l'ID de la playlist à partir de l'URL
  const [loadedPlaylistId, setLoadedPlaylistId] = useState(null); // État pour stocker l'ID de la playlist chargée
  const [playlist, setPlaylist] = useState(null); // État pour stocker les informations sur la playlist
  const [playlistTracks, setPlaylistTracks] = useState([]); // État pour stocker les morceaux de la playlist

  useEffect(() => { // Mettre à jour loadedPlaylistId avec playlistId de l'URL
    if (playlistId) {
      setLoadedPlaylistId(playlistId);
    }
  }, [playlistId]);

  useEffect(() => { // Charger les informations sur la playlist lorsque loadedPlaylistId change
    if (!loadedPlaylistId) return;

    spotifyApi
      .getPlaylist(loadedPlaylistId)
      .then((playlist) => {
        setPlaylist(playlist);
        return spotifyApi.getPlaylistTracks(loadedPlaylistId);
      })
      .then((response) => {
        setPlaylistTracks(response.items);
        console.log(response.items);
      })
      .catch((error) => {
        console.error("Failed to fetch playlist:", error);
      });
  }, [loadedPlaylistId]);

  function formatDuration(duration_ms) { //calcule du temps des tracks(ms)
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  }

  const loadTrack = (trackUri) => {
    onTrackSelect(trackUri);
  }

  return (
    <div className="flex flex-col font-semibold justify-center items-start text-white sm:p-7">
      <div>
        <p className="text-xl py-2 ">Playlist</p>
        {playlist ? (
          <>
            <h2 className=" text-5xl sm:text-6xl text-green-500">
              {playlist.name}
            </h2>
            <p className="text-md  text-right">
            {Math.min(playlist.tracks.total, 100)} tracks
            </p>
          </>
        ) : (
          <Spinner color="secondary" label="Loading..." labelColor="success" size="md"/>
        )}
      </div>
      <ul className="flex flex-col mt-12 w-full bg-black p-3 sm:p-5 sm:rounded-lg bg-opacity-45 mb-40">
        <li className="flex items-center justify-center gap-2 p-2 sm:p-4 rounded">
          <p>#</p>
          <p className="titre ml-20 w-4/6 sm:w-2/6">Titre</p>
          <p className="album w-3/6 hidden sm:block">Album</p>
          <IoTimeOutline className="size-6" />
        </li>
        {playlistTracks.length > 0 ? (
          playlistTracks.map((track, index) => (
            <React.Fragment key={track.track.id}>
              <li onClick={() => loadTrack(track?.track.uri)} className="flex items-center justify-center gap-2 p-2 sm:p-4 rounded hover:bg-green-500 hover:bg-opacity-75 hover:cursor-pointer  hover:text-black transition-all">
                <p className="w-8 mr-1">{index + 1}</p>
                {track.track.album.images.length > 0 ? (
                  <img
                    className="rounded w-12 h-12"
                    src={track.track.album.images[0].url}
                    alt="image de l'album"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                )}
                <p className="font-normal w-4/6 sm:w-2/6">{track.track.name}</p>
                <p className="font-normal w-3/6 hidden sm:block">{track.track.album.name}</p>
                <p className="font-normal w-5">{formatDuration(track.track.duration_ms)}</p>
              </li>
            </React.Fragment>
          ))
        ) : (
          <Spinner color="secondary" label="Loading..." labelColor="success" size="lg"/>
        )}
      </ul>
    </div>
  );
}
