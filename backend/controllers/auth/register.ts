import User from "../../models/user";
import bcrypt from "bcryptjs";

export const register = async (req: any, res: any) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingUser) {
      const errors = [];

      if (existingUser.email === email) {
        errors.push({ field: "email", message: "Email already used" });
      }
      if (existingUser.username === username) {
        errors.push({ field: "username", message: "Username already used" });
      }
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword });

    await newUser.save();

    //const transporter = createTransporter(email);
    //if (!transporter) {
    //  return res.status(400).json({ message: "Fournisseur email non supporté" });
    //}

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Bienvenue sur notre réseau social !",
      text: `Bonjour ${firstName},\n\nMerci de vous être inscrit sur notre plateforme !`,
    };

    //await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Utilisateur créé avec succès et email envoyé !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};