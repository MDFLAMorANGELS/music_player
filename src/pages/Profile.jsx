import { Card, CardFooter, Image, Button, Skeleton } from "@nextui-org/react";
import { CiPlay1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


export default function Profile({ user, userPlaylists, onPlaylistSelect }) {

  //console.log(userPlaylists);
  const navigate = useNavigate();


  const loadPlaylist = (playlistUri) => {
    //console.log(playlistUri);
    onPlaylistSelect(playlistUri);
  }

  const navToPlaylist = (playlistUri) => {
    const playlistId = playlistUri.split(":")[2]; // Récupérer l'identifiant de la playlist de l'URI
    navigate(`/playlist/${playlistId}`);
  }

  return (
    <div className="flex flex-col justify-center items-start sm:p-7">
      <div>
        <p className="text-xl py-2 text-white font-semibold">Profile</p>
        <h2 className=" text-5xl sm:text-6xl font-semibold text-green-500">
          {user?.display_name}
        </h2>
        <p className="text-md text-white font-semibold text-right">
          Follow {user?.followers.total}
        </p>
      </div>
      <div className="mt-8 w-full mb-48 md:mb-34">
      <p className="text-xl py-2 text-white font-semibold">Playlist</p>
        <ul className="flex xl:justify-start justify-center items-center gap-5 sm:gap-10 flex-wrap my-2">
          {userPlaylists?.items?.slice().reverse().map((playlist) => (
            <Card
              isFooterBlurred
              radius="lg"
              className="v"
              key={playlist.id}
            >
              <Image
                alt="Playlist image"
                className="object-cover"
                height={250}
                src={(playlist.images && playlist.images.length > 0) ? playlist.images[0].url : "https://www.svgrepo.com/show/346881/file-unknow.svg"}
                width={250}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <button onClick={() => loadPlaylist(playlist?.uri)} className="w-1/4"><CiPlay1 className="size-7 hover:scale-110 hover:bg-green-600 p-1 rounded-lg fill-white transition-all "/></button>
                <Button
                  className="text-tiny text-white bg-black/20 w-3/4"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                  onClick={() => navToPlaylist(playlist.uri)} // Utilisez la fonction loadPlaylist directement
                  >
                  {playlist?.name}
                </Button>
              </CardFooter>
            </Card>
          )) || <Card  className="w-[250px] h-[250px] border-none space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">  
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>}
        </ul>
      </div>
    </div>
  );
}
