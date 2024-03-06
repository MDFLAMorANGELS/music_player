import { BsCollectionPlay } from "react-icons/bs";
import { BsMusicNoteList } from "react-icons/bs";
import { BsSearchHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import {Avatar} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";
import { useEffect  } from "react";


export default function Sidebar({ user }) {

  const navigate = useNavigate();

  useEffect(() => {
    
    console.log(user);

  }, [user])
  
  console.log(user);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className=" bg-slate-300 hover:w-48 transition-all md:gap-y-unit-xl">
      <Link
        to={"/profile"}
        className="hover:bg-slate-200 px-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <Avatar isBordered className="my-5 min-h-10" color="success" src={user?.images?.[1]?.url} />
        <h2 className="text-black font-semibold">{user?.display_name}</h2>
      </Link>
      <Link
        to={"/playlist"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsCollectionPlay className=" size-10 fill-black  transition-all rounded  hover:scale-105" />
        <p className=" text-black font-semibold text-center">Playlist</p>
      </Link>
      <Link
        to={"/play"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsMusicNoteList className=" size-10 fill-black  transition-all rounded  hover:scale-105 p-1" />
        <p className=" text-black font-semibold text-center">Play</p>
      </Link>
      <Link
        to={"/search"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsSearchHeart className=" size-10 fill-black  transition-all rounded  hover:scale-105 p-1" />
        <p className=" text-black font-semibold text-center">Search</p>
      </Link>
      <Link
        onClick={logout}
        to={"/auth"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <MdExitToApp  className=" size-10 fill-black  transition-all rounded  hover:scale-105 p-1 " />
        <p className=" text-black font-semibold text-center">Leave</p>
      </Link>
    </nav>
  );
}
