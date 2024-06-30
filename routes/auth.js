const router=require("express").Router();
const User =require("../models/User");
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken")
//REGISTRATION
router.post("/register", async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });  
try{
    const savedUser=await newUser.save();
    res.status(201).json(savedUser)
}catch(err){
    res.status(500).json(err);
}
}); 
//LOGINPAGE
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json("Wrong username or password");
      }
  
      // Decrypt stored password and compare with input password
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      ).toString(CryptoJS.enc.Utf8);
  
      if (decryptedPassword !== password) {
        return res.status(401).json("Wrong username or password");
      }
  
      // Generate JWT token
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );
  
      // Send user details and access token in response
      const { password: userPassword, ...userWithoutPassword } = user._doc;
      res.status(200).json({ ...userWithoutPassword, accessToken });
    } catch (err) {
      // Handle internal server error
      console.error("Login error:", err);
      res.status(500).json("Internal server error");
    }
  });
module.exports=router