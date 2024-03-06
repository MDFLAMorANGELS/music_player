import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FaSpotify } from "react-icons/fa";

function Auth() {
  const [, setToken] = useState(localStorage.getItem("token"));

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:5173/";
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
    <div className="flex flex-col justify-center items-center">
      <Button className="text-lg font-semibold" size="lg" color="success" onClick={loginSpotify}>Connect to Spotify <FaSpotify className="size-12" /></Button>
      <p className="text-red-500 font-semibold opacity-80">*Application nécessite un compte spotify prenium</p>
    </div>
  );
}

export default Auth;
