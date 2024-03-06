import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Playlist from "./Playlist";
import Profile from "./Profile";
import Play from "./Play";
import Search from "./Search";
import Param from "./Param";
import Player from "../components/Player";
import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";

const spotifyApi = new SpotifyWebApi();



export default function Home() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");



  useEffect(() => {
    const token = localStorage.getItem("token")
    setToken(token)
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then((user) => {
        setUser(user);
      });
    }
    console.log(token);

  },[token])



  return (
    <>
      <Sidebar user={user} />
        <Routes>
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/play" element={<Play />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/param" element={<Param />} />
        </Routes>
      <Player />
    </>
  );
}
