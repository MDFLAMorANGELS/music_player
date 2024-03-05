import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";

export default function Param() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="flex justify-center items-center">
      <Button onClick={logout} color="danger" variant="shadow" size="lg">
        Déconnexion
      </Button>
    </div>
  );
}
