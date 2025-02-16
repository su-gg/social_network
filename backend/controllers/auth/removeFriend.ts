import User from "../../models/user";

export const removeFriend = async (req: any, res: any) => {
  const { friendUsername } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ message: "Ami non trouvé." });
    }

    const friendIndex = user.friends.indexOf(friend._id);
    if (friendIndex === -1) {
      return res.status(400).json({ message: "Cet utilisateur n'est pas dans votre liste d'amis." });
    }

    user.friends.splice(friendIndex, 1);
    await user.save();

    res.json({ message: "Ami supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};