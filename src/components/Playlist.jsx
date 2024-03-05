const Playlist = ({ playlists }) => {
  // Afficher un message de chargement si les playlists ne sont pas encore chargées
  if (!playlists) {
    return <div>Loading...</div>;
  }

  // Afficher un message si l'utilisateur n'a pas de playlists
  if (playlists.items.length === 0) {
    return <div>You have no playlists.</div>;
  }

  // Affichage des playlists
  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.items.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
