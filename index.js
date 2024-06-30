require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute=require("./routes/cart")
const orderRoute=require("./routes/order")
const path = require('path');

mongoose
  .connect(process.env.PASS)
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
