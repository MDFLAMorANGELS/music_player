import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";
import Play from "./pages/Play";
import Search from "./pages/Search";


export default function App() {
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = hash
      .substring(1)
      .split("&")
      .find((elem) => elem.startsWith("access_token"));

    if (token) {
      token = token.split("=")[1];
      localStorage.setItem("token", token);
      // Nettoyer l'URL après avoir sauvé le token
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
    // Indiquer que la vérification du token est terminée
    setIsTokenChecked(true);
  }, [isTokenChecked]);

  return (
    <>
      <BrowserRouter>
        {isTokenChecked && <NavigateIfToken />}
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path="/play" element={<Play />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function NavigateIfToken() {
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Redirige l'utilisateur vers la page principale s'il y a déjà un token
    } else {
      // Si aucun token n'est trouvé, rediriger vers /auth
      navigate("/auth");
    }
  }, [navigate]);

  return null;
}
