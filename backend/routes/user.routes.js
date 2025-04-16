const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require("../middleware/auth.middleware"); // Modification ici
const multer = require("multer");
const upload = multer();

// Route protégée avec le bon middleware
router.get("/me", requireAuth, userController.getMe); // Correction ici

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", requireAuth, userController.follow); // Ajout de la protection
router.patch("/unfollow/:id", requireAuth, userController.unfollow); // Ajout de la protection

// upload
router.post('/upload', requireAuth, upload.single('file'), uploadController.profilUpload); // Ajout de la protection

module.exports = router;