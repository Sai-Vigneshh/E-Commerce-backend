const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const Procuct = require("../models/Product");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verfyToken");
const Product = require("../models/Product");
//Create
router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct=new Procuct(req.body)
    try{
        const saveProduct=await newProduct.save()
        res.status(200).json(saveProduct)
    }catch(err){
        res.status(500).json(err)
    }
})
// Update User
router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
  try {

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isAdmin: true } },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete User
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Get Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Procuct.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Get All Products
router.get("/",  async (req, res) => {
  const query1 = req.query.new;
  const qCategory=req.query.category
  try {
    let products;
    if(query1){
        products=await Product.find().sort({createdAt:-1}).limit(5)
    }else if(qCategory){
      products=await Product.find({
        categorries:{
            $in:[qCategory],
        },
    })  
    }else{
        products=await Product.find()
    }
    res.status(200).json(products)
    
}catch(err){
    res.status(500).json(err)
}});



module.exports = router;
