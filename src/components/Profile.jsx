const Profile = ({ user }) => {
    if (!user) {
      return <div>Loading...</div>;
    }
    console.log(user);
    // Déterminer l'URL de l'image de profil ou la première lettre du nom d'utilisateur
    let imageUrl;
    if (user.images && user.images.length > 0) {
      imageUrl = user.images[0].url;
    } else {
      // Si aucune image de profil n'est disponible, utiliser la première lettre du nom d'utilisateur
      imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.display_name)}&size=100`;
    }
  
    return (
      <div>
        <h2>Your Profile</h2>
        <h3>{user.display_name}</h3>
        <img src={imageUrl} alt="profile" style={{ width: 100, height: 100 }} />
        <p>{user.email}</p>
        <p>Followers: {user.followers.total}</p>
      </div>
    );
  };
  
  export default Profile;