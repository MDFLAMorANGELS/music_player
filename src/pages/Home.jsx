import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Playlist from "./Playlist";
import Profile from "./Profile";
import Play from "./Play";
import Search from "./Search";
import Player from "../components/Player";
import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";

const spotifyApi = new SpotifyWebApi();


export default function Home() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [loadPlaylist, setLoadPlaylist]= useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token")
    setToken(token)
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then((user) => {
        setUser(user);
      });
    }
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getUserPlaylists()
      .then(function(data) {
        setUserPlaylists(data)
        // console.log('User playlists', data);
      }, function(err) {
        console.error(err);
      });
    }

  },[token])

  const handlePlaylistSelect = (playlistUri) => {
    console.log("Playlist sélectionnée:", playlistUri);
    setLoadPlaylist(playlistUri);
  };

  return (
    <>
      <Sidebar user={user} />
        <Routes>
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/play" element={<Play />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile"  element={<Profile user={user} userPlaylists={userPlaylists} onPlaylistSelect={handlePlaylistSelect}/>} />
        </Routes>
      <Player playlistUri={loadPlaylist} />
    </>
  );
}
