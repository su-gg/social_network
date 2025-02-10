import React, { useEffect, useState } from "react";

interface Post {
  id: number;
  message: string;
  photoUrl?: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profil");

  const [posts, setPosts] = useState<Post[]>([]);
  const [postMessage, setPostMessage] = useState<string>("");
  const [postPhoto, setPostPhoto] = useState<string>("");

  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);

  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const friends = ["Alice", "Bob", "Charlie", "David"];

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts)) {
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postMessage.trim() === "" && postPhoto.trim() === "") return;
    
    const newPost: Post = {
      id: Date.now(),
      message: postMessage,
      photoUrl: postPhoto || undefined,
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts)); 

    setPostMessage("");
    setPostPhoto("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>My world - to change</h1>
  
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("profil")}>Profile</button>
        <button onClick={() => setActiveTab("admin")}>Admin</button>
        <button onClick={() => setActiveTab("chat")}>Chat</button>
        <button onClick={() => setActiveTab("messagerie")}>Messages</button>
      </nav>

      {activeTab === "profil" && (
        <div>
          <h2>Welcome, 👋</h2>
          <p>Post images or messages which will be visible on your profile.</p>
          <form onSubmit={handlePostSubmit} style={{ marginBottom: "20px" }}>
            <textarea
              value={postMessage}
              onChange={(e) => setPostMessage(e.target.value)}
              placeholder="Tap your message..."
              rows={4}
              cols={50}
            />
            <input
              type="text"
              value={postPhoto}
              onChange={(e) => setPostPhoto(e.target.value)}
              placeholder="URL de la photo (optionnel)"
              style={{ display: "block", marginBottom: "10px", width: "300px" }}
            />
            <button type="submit">Post</button>
          </form>
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <p>No post.</p>
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
