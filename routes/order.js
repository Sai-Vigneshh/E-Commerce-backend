const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verfyToken");

//Create
router.post("/",verifyTokenAndAuthorization,async(req,res)=>{
    const newOrder=new Order(req.body)
    try{
        const saveOrder=await newOrder.save()
        res.status(200).json(saveOrder)
    }catch(err){
        res.status(500).json(err)
    }
})
// Update User
router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
  try {

    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Cart
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Get Cart
router.get("/find/:userid", async (req, res) => {
  try {
    const  order= await order.find({userId:req.params.userid});

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const orders=await Order.find();
        res.status(200).json(orders)
    }catch(err){
       res.status(500).json(err)      
    }
})
//GEt ,OMTH;Y INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
