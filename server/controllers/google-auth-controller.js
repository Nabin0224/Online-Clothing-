// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// require("dotenv").config(); // Load environment variables

// // Google OAuth Redirect
// const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// // Google OAuth Callback
// const googleAuthCallback = (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({ success: false, message: "Authentication failed" });
//     }

//     // Log the user in
//     req.login(user, { session: false }, (loginErr) => {
//       if (loginErr) {
//         return next(loginErr);
//       }

//       // Generate JWT Token
//       const token = jwt.sign(
//         { id: user.id },
//        "CLIENT_SECRET_KEY", 
//         { expiresIn: "60m" }
//       );

//       // Set JWT Token as HTTP-only Cookie
//       res.cookie("token", token, { httpOnly: true })
//         .json({
//           success: true,
//           message: "Logged in successfully",
//           token, // Optional: return token in response
//         });
//     });
//   })
// };

// const checkGoogleAuth = async(req, res)=> {
//   try {
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//        message: error.message,
//     })
//   }
// }



// // Logout
// const logout = (req, res) => {
//   res.clearCookie("token").status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

// module.exports = {
//   googleAuth,
//   googleAuthCallback,
//   logout,
// };