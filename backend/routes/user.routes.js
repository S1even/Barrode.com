const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer();


router.get("/me", requireAuth, userController.getMe);

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);


router.get("/logout", (req, res) => {
  try {
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          console.error('Erreur lors de la déconnexion Passport:', err);
        }
      });
    }
    
    // Nettoye le cookie JWT avec toutes les options possibles
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
      path: "/"
    };
    
    // Supprime le cookie avec différentes configurations pour s'assurer qu'il soit supprimé
    res.clearCookie('jwt', cookieOptions);
    res.clearCookie('jwt', { path: '/' });
    res.clearCookie('jwt', { 
      domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
      path: '/' 
    });
    
    // Détruire la session si elle existe
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Erreur lors de la destruction de la session:', err);
        }
      });
    }
    
    // Ajout des headers pour empêcher la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    

    console.log("Déconnexion réussie pour l'utilisateur");
    res.status(200).json({ 
      message: "Déconnexion réussie",
      success: true 
    });
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    
    // En cas d'erreur
    res.clearCookie('jwt', { path: '/' });
    res.clearCookie('jwt');
    
    res.status(500).json({ 
      message: "Erreur lors de la déconnexion", 
      error: error.message 
    });
  }
});

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", requireAuth, userController.follow);
router.patch("/unfollow/:id", requireAuth, userController.unfollow);

// upload
router.post('/upload', requireAuth, upload.single('file'), uploadController.profilUpload);

module.exports = router;