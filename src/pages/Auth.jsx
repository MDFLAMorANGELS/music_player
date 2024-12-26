import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FaSpotify } from "react-icons/fa";

function Auth() {
  const [, setToken] = useState(localStorage.getItem("token"));

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = "https://music-player-taupe-rho.vercel.app"; //http://localhost:5173/
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = ["streaming", "user-read-email", "user-read-private"];
  const SCOPE_URL_PARAM = SCOPES.join("%20");

  const loginSpotify = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE_URL_PARAM}`;
  };

  useEffect(() => {
    const hash = window.location.hash;
    let tokenFromUrl = null;

    if (hash) {
      tokenFromUrl = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        setToken(tokenFromUrl);
        window.location.hash = ""; // Nettoyer l'URL après extraction
      }
    }
  }, []);

  return (
    <section className="flex h-[100vh] justify-around items-center flex-col ml-[-70px] md:m-0">
      <h1 className="text-3xl text-gray-200 p-2">Music Player by Mdflamorangels❤️</h1>
      <div className="flex flex-col items-center">
        <Button className="text-lg font-semibold w-2/3" size="lg" color="success" onClick={loginSpotify}>Connect to Spotify <FaSpotify className="size-12" /></Button>
        <p className="text-red-500 font-semibold opacity-100">*Application nécessite un compte spotify prenium</p>
      </div>
      <div className="text-white text-lg font-semibold bg-red-950 p-5 presentation md:mr-[70px] xl:mr-0 xl:w-2/3 rounded-xl shadow-sm">
        <p className="text-xl mb-3">🎵 Présentation de l'application <span>Music Player</span> 🎵 </p>
        <p className="">Découvrez notre nouvelle application web, conçue pour enrichir votre expérience musicale en utilisant la puissance de l'API Spotify et son Player SDK intégré ! Avec cette application, vous pouvez :</p>
        <ul className="list-disc pl-5 my-3">
          <li>Diffuser vos playlists favorites directement depuis Spotify.</li>
          <li>Naviguer facilement entre vos albums, artistes et morceaux préférés.</li>
          <li>Profiter d'une interface intuitive et élégante, adaptée à vos besoins.</li>
        </ul>
        <p className=" mb-3">Cependant, cette application est exclusivement disponible pour les utilisateurs disposant d'un abonnement Spotify Premium. En effet, l'accès au Player SDK de Spotify nécessite cette condition pour garantir une expérience fluide et sans interruption.</p>
        <p className="text-xl mb-3">🔒 Pourquoi Spotify Premium ?</p>
        <p>L'abonnement Premium permet de bénéficier des fonctionnalités avancées de l'application, notamment :</p>
        <ul className="list-disc pl-5 my-3">
          <li>L'absence de publicités.</li>
          <li>La lecture en haute qualité.</li>
          <li>Le contrôle total sur vos morceaux, y compris les sauts illimités.</li>
        </ul>
      </div>
    </section>
  );
}

export default Auth;
