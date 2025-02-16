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
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("../models/post"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }
        const posts = yield post_1.default.find({ userId }).populate("userId", "name username");
        res.status(200).json(posts);
    }
    catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { content } = req.body;
        const userId = req.user.id;
        if (!content) {
            return res.status(400).json({ message: "Le contenu ne peut pas être vide." });
        }
        const newPost = new post_1.default({ userId, content });
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (err) {
        console.error("Erreur lors de la création du post :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "ID de post invalide" });
        }
        console.log("Tentative de suppression du post avec l'ID :", postId);
        const deletedPost = yield post_1.default.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.status(200).json({ message: "Post supprimé avec succès" });
    }
    catch (err) {
        console.error("Erreur serveur lors de la suppression du post :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}));
exports.default = router;
