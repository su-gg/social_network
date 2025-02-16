import User from "../../models/user";

export const removeFriend = async (req: any, res: any) => {
  const { friendId } = req.body; 
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const friend = await User.findById(friendId); 
    if (!friend) {
      return res.status(404).json({ message: "Ami non trouvé." });
    }

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Cet utilisateur n'est pas dans votre liste d'amis." });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: "Ami supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
