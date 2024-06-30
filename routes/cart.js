const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verfyToken");

//Create
router.post("/",verifyTokenAndAuthorization,async(req,res)=>{
    const newCart=new Cart(req.body)
    try{
        const saveCart=await newCart.save()
        res.status(200).json(saveCart)
    }catch(err){
        res.status(500).json(err)
    }
})
// Update User
router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
  try {

    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Get Cart
router.get("/find/:userid", async (req, res) => {
  try {
    const cart = await Cart.find({userId:req.params.userid});

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const carts=await Cart.find();
        res.status(200).json(carts)
    }catch(err){
       res.status(500).json(err)      
    }
})


module.exports = router;
