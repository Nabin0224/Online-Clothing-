const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();


const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleUser = require("../models/googleUser");
const dotenv = require("dotenv");


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_BASE_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(process.env.SERVER_BASE_URL)
        let user = await GoogleUser.findOne({ googleId: profile.id });

        if (!user) {
          user = new GoogleUser({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
          
          await user.save();
        }
         

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await GoogleUser.findById(id);
  done(null, user);
});



// Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),

  

);


// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL, session: true}),
  async(req, res) => {
    
    try {
        console.log("Reached callback");

          if(!req.user) {
            return res.status(401).json({
              success: false,
              message: "Authentication failed!"
            })
          }
          console.log("Authenticated Google Id: ", req.user.googleId)
        
          // Fetch the authenticated user explicitly form DB

          const user = await GoogleUser.findOne({ googleId: req.user.googleId});

          if(!user) {
            return res.status(404).json({
              success: false,
              message: "User not found!",
            })
          }

          console.log("Storing userId in cookie", user._id);

          //Storing user Id in a secure cookie 

          res.cookie("googleUserId", user._id.toString(), {
            httpOnly: true,
            secure: true,
            sameSite : "None",
            // domain: ".stylemeofficial.com"
            
          })
  
       
          // Redirect user to frontend
          res.redirect(`${process.env.FRONTEND_URL}/`);
        
    } catch (error) {
        console.log("error in call back is ", error.message);
        res.status(500).json({
            success: false
        })
        
    }
   
  }
);
// // Check authentication
// const authMiddleware = (req, res, next) => {
//   const token = req.cookies.token; // Extract JWT from cookies

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized user!" });
//   }

//   try {
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded; // Attach decoded user to request
//     next();
//   } catch (error) {
//     return res.status(403).json({ success: false, message: "Invalid token!" });
//   }
// };



router.get("/checkGoogleAuth", async(req, res) => {
  try {
    
     const userId = req.cookies.googleUserId;
     console.log(req.cookies);
     console.log("userID in checkgoogleauth", userId);


    if(!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      })
    }
  
const user = await GoogleUser.findById(userId);
   
   
    // Generate JWT token
    const token = jwt.sign({ 
      id: user._id ,
      email: user.email,
      role: user.role || "user",
      userName: user.username,


    }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });  

    // Set token in cookies
   
    // Send user response
    console.log("token for google", token)
    console.log("username", user.username)
  
    res.cookie('token', token, { httpOnly: true, secure: true }).json({
        success: true,
        message: "Loggined in successfully",
        user: {
            email: user.email,
            role: user.role || "user",
            id: user._id,
            userName: user.username,
            avatar: user.avatar,
        },    
      });  

    
  } catch (error) {  
    return res.status(500).json({
      success: false,
      message: error.message,
    })  
  }  
})  


// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("googleUserId");
  req.logout(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;
