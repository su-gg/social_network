import User from "../../models/user";

export const getUserSuggestions = async (req: any, res: any) => {
  try {
    const userId = req.user._id;

    const users = await User.find({
      _id: { $ne: userId }, 
      statusVisibility: { $in: ['fullname', 'username'] } 
    }).select('username firstName lastName statusVisibility');

    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};





