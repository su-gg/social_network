import React, { useState } from "react";

interface Post {
  id: number;
  message: string;
  photoUrl?: string;
}

const Profile: React.FC = () => {
  // État pour la navigation entre les onglets
  const [activeTab, setActiveTab] = useState<string>("profil");

  // États pour le profil (publication de messages et photos)
  const [posts, setPosts] = useState<Post[]>([]);
  const [postMessage, setPostMessage] = useState<string>("");
  const [postPhoto, setPostPhoto] = useState<string>("");

  // État pour l'onglet Admin (visibilité du profil)
  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);

  // État pour l'onglet Messagerie
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  // Données simulées pour l'Espace Chat (amis connectés)
  const friends = ["Alice", "Bob", "Charlie", "David"];

  // Gestion de la publication dans l'onglet Profil
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postMessage.trim() === "" && postPhoto.trim() === "") return;
    const newPost: Post = {
      id: Date.now(),
      message: postMessage,
      photoUrl: postPhoto ? postPhoto : undefined,
    };
    setPosts([newPost, ...posts]);
    setPostMessage("");
    setPostPhoto("");
  };

  // Gestion de l'envoi d'un message dans l'onglet Messagerie
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Mon espace</h1>
      {/* Barre de navigation pour les onglets */}
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("profil")}>Profil</button>
        <button onClick={() => setActiveTab("admin")}>Admin</button>
        <button onClick={() => setActiveTab("chat")}>Espace Chat</button>
        <button onClick={() => setActiveTab("messagerie")}>Messagerie</button>
      </nav>

      {/* Contenu en fonction de l'onglet actif */}
      {activeTab === "profil" && (
        <div>
          <h2>Votre Profil</h2>
          <p>Ici, vous pouvez poster des messages et des photos qui seront visibles sur votre profil.</p>
          <form onSubmit={handlePostSubmit} style={{ marginBottom: "20px" }}>
            <textarea
              value={postMessage}
              onChange={(e) => setPostMessage(e.target.value)}
              placeholder="Votre message..."
              rows={4}
              cols={50}
              style={{ display: "block", marginBottom: "10px" }}
            />
            <input
              type="text"
              value={postPhoto}
              onChange={(e) => setPostPhoto(e.target.value)}
              placeholder="URL de la photo (optionnel)"
              style={{ display: "block", marginBottom: "10px", width: "300px" }}
            />
            <button type="submit">Poster</button>
          </form>
          <h3>Publications</h3>
          {posts.length === 0 ? (
            <p>Aucune publication.</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                  {post.message && <p>{post.message}</p>}
                  {post.photoUrl && (
                    <img src={post.photoUrl} alt="Publication" style={{ maxWidth: "200px" }} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "admin" && (
        <div>
          <h2>Admin</h2>
          <p>Choisissez la visibilité de votre profil :</p>
          <div>
            <label>
              <input
                type="radio"
                name="visibility"
                checked={isProfilePublic}
                onChange={() => setIsProfilePublic(true)}
              />
              Public
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="visibility"
                checked={!isProfilePublic}
                onChange={() => setIsProfilePublic(false)}
              />
              Privé
            </label>
          </div>
          <p>
            Votre profil est actuellement <strong>{isProfilePublic ? "public" : "privé"}</strong>.
          </p>
        </div>
      )}

      {activeTab === "chat" && (
        <div>
          <h2>Espace Chat</h2>
          <p>Amis connectés :</p>
          <ul>
            {friends.map((friend, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {friend}{" "}
                <button onClick={() => alert(`Conversation lancée avec ${friend}`)}>
                  Démarrer conversation
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "messagerie" && (
        <div>
          <h2>Messagerie</h2>
          <form onSubmit={handleSendMessage} style={{ marginBottom: "20px" }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez un nouveau message..."
              rows={4}
              cols={50}
              style={{ display: "block", marginBottom: "10px" }}
            />
            <button type="submit">Envoyer</button>
          </form>
          <h3>Messages envoyés</h3>
          {messages.length === 0 ? (
            <p>Aucun message envoyé.</p>
          ) : (
            <ul>
              {messages.map((msg, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
