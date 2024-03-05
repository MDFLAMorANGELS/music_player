import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Playlist from "./Playlist";
import Profile from "./Profile";
import Play from "./Play";
import Search from "./Search";
import Param from "./Param";
import Player from "../components/Player";

export default function Home() {
  return (
    <>
      <Sidebar />
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
