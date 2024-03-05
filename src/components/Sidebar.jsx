import { BsCollectionPlay } from "react-icons/bs";
import { BsMusicNoteList } from "react-icons/bs";
import { BsSearchHeart } from "react-icons/bs";
import { BsGear } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className=" bg-slate-300">
      <Link
        to={"/playlist"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsCollectionPlay className=" size-12 fill-black hover:fill-green-600 transition-all rounded  hover:scale-105" />
        <p className=" text-black font-semibold text-center">Playlist</p>
      </Link>
      <Link
        to={"/play"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsMusicNoteList className=" size-12 fill-black hover:fill-red-600 transition-all rounded  hover:scale-105 p-1" />
        <p className=" text-black font-semibold text-center">Play</p>
      </Link>
      <Link
        to={"/search"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsSearchHeart className=" size-12 fill-black hover:fill-blue-600 transition-all rounded  hover:scale-105 p-1" />
        <p className=" text-black font-semibold text-center">Search</p>
      </Link>
      <Link
        to={"/profile"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full"
      >
        <BsFillPersonFill className=" size-12 fill-black hover:fill-purple-600 transition-all rounded  hover:scale-105 p-1" />
        <p className=" text-black font-semibold text-center">Profile</p>
      </Link>
      <Link
        to={"/param"}
        className="hover:bg-slate-200 p-3 rounded hover:shadow flex flex-col justify-center items-center w-full mt-10"
      >
        <BsGear className=" size-12 fill-black hover:fill-red-600 transition-all rounded  hover:scale-105 p-1 " />
        <p className=" text-black font-semibold text-center">Param</p>
      </Link>
    </nav>
  );
}
