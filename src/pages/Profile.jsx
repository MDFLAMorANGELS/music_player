import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { CiPlay1 } from "react-icons/ci";


export default function Profile({ user, userPlaylists, onPlaylistSelect }) {
  console.log(userPlaylists);

  const loadPlaylist = (playlistUri) => {
    console.log(playlistUri);
    onPlaylistSelect(playlistUri);

  }

  return (
    <div className="flex flex-col justify-center items-start">
      <div>
        <p className="text-xl py-2 text-white font-semibold">Profile</p>
        <h2 className="text-6xl font-semibold text-green-500">
          {user?.display_name}
        </h2>
        <p className="text-md text-white font-semibold text-right">
          Follow {user?.followers.total}
        </p>
      </div>
      <div className="mt-12 mb-24 w-full">
      <p className="text-xl py-2 text-white font-semibold">Playlist</p>
        <ul className="flex md:justify-start justify-center items-center gap-10 flex-wrap my-2">
          {userPlaylists?.items?.slice().reverse().map((playlist) => (
            <Card
              isFooterBlurred
              radius="lg"
              className="border-none"
              key={playlist.id}
            >
              <Image
                alt="Playlist image"
                className="object-cover"
                height={250}
                src={playlist?.images[0]?.url || "https://www.svgrepo.com/show/346881/file-unknow.svg"}
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
                >
                  {playlist?.name}
                </Button>
              </CardFooter>
            </Card>
          )) || <li>No playlists found</li>}
        </ul>
      </div>
    </div>
  );
}
