"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_1 = __importDefault(require("../../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.default({ firstName, lastName, username, email, password: hashedPassword });
        yield newUser.save();
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
    }
    catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});
exports.register = register;
