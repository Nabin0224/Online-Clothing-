const {
  registerUser,
  getRegister,
  loginUser,
  authMiddleware,
  logoutUser,
} = require("../controllers/auth-controller");

const express = require("express");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  console.log(user)
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user
  });
});
router.get("/", getRegister);


module.exports = router;
