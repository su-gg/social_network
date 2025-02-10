import express from "express";
import Post from "../models/post";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name username");
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/",async (req: any, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;  

    if (!content) {
      return res.status(400).json({ message: "Le contenu ne peut pas être vide." });
    }

    const newPost = new Post({ userId, content });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Erreur lors de la création du post :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du post :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
