import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Post {
  _id: string;
  content: string;
  photoUrl?: string;
}

//const API_URL = "http://localhost:3010/api/auth";
const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com";


const ProfileContent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postMessage, setPostMessage] = useState<string>("");
  const [postPhoto, setPostPhoto] = useState<string>("");
  const [userFirstName, setUserFirstName] = useState<string>("");
 

  console.log("Api url utilisée : " , `${API_URL}/me`);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      console.log("token :  " + token);

      const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      console.log("data user : " + data);
      setUserFirstName(data.firstName);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur :", error);
    }
  };

 
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/posts`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des posts :", error);
    }
  };

  const createPost = async (post: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      setPosts([data, ...posts]);
    } catch (error) {
      console.error("Erreur lors du chargement des posts :", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postMessage.trim() === "" && postPhoto.trim() === "") return;
    const newPost: Post = { _id: Date.now().toString(), content: postMessage, photoUrl: postPhoto || undefined };
    setPostMessage("");
    setPostPhoto("");
    createPost(newPost);
  };


  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };


  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);

  return (
    <div className="card p-4 shadow-lg" style={{ backgroundColor: '#ffebee' }}>
      <h2 className="text-center" style={{ color: '#d81b60' }}>Welcome {userFirstName ? capitalizeFirstLetter(userFirstName) : "User"} 👋</h2>
      <form onSubmit={handlePostSubmit} className="mb-3">
        <textarea className="form-control mb-2" value={postMessage} onChange={(e) => setPostMessage(e.target.value)} placeholder="Tap your message..." rows={3} style={{ borderColor: '#e91e63' }} />
        <input type="text" className="form-control mb-2" value={postPhoto} onChange={(e) => setPostPhoto(e.target.value)} placeholder="Photo URL (optional)" style={{ borderColor: '#e91e63' }} />
        <button type="submit" className="btn w-100" style={{ backgroundColor: '#e91e63', color: 'white' }}>Post</button>
      </form>
      <h3>Posts</h3>
      {posts.length === 0 ? <p>No post.</p> : (
        <ul className="list-group">
          {posts.map((post) => (
            <li key={post._id} className="list-group-item bg-white shadow-sm">
              {post.content && <p>{post.content}</p>}
              {post.photoUrl && <img src={post.photoUrl} alt="Post" className="img-fluid" />}
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => deletePost(post._id)}  
                style={{ backgroundColor: '#e91e63', color: 'white' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    
    </div>
  );
};

export default ProfileContent;
