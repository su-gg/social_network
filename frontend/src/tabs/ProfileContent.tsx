import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Post {
  id: number;
  message: string;
  photoUrl?: string;
}

const ProfileContent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postMessage, setPostMessage] = useState<string>("");
  const [postPhoto, setPostPhoto] = useState<string>("");

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
    const newPost: Post = { id: Date.now(), message: postMessage, photoUrl: postPhoto || undefined };
    setPosts([newPost, ...posts]);
    setPostMessage("");
    setPostPhoto("");
  };

  return (
    <div className="card p-4 shadow-lg" style={{ backgroundColor: '#ffebee' }}>
      <h2 className="text-center" style={{ color: '#d81b60' }}>Welcome 👋</h2>
      <form onSubmit={handlePostSubmit} className="mb-3">
        <textarea className="form-control mb-2" value={postMessage} onChange={(e) => setPostMessage(e.target.value)} placeholder="Tap your message..." rows={3} style={{ borderColor: '#e91e63' }} />
        <input type="text" className="form-control mb-2" value={postPhoto} onChange={(e) => setPostPhoto(e.target.value)} placeholder="Photo URL (optional)" style={{ borderColor: '#e91e63' }} />
        <button type="submit" className="btn w-100" style={{ backgroundColor: '#e91e63', color: 'white' }}>Post</button>
      </form>
      <h3>Posts</h3>
      {posts.length === 0 ? <p>No post.</p> : (
        <ul className="list-group">
          {posts.map((post) => (
            <li key={post.id} className="list-group-item bg-white shadow-sm">
              {post.message && <p>{post.message}</p>}
              {post.photoUrl && <img src={post.photoUrl} alt="Post" className="img-fluid" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileContent;
