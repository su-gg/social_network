import User from "../../models/user";

export const listFriends = async (req: any, res: any) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate("friends", "username firstName lastName");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error("Erreur lors de la récupération des amis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
