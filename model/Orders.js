const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product_title: {
    type: String,
    trim: true,
    required: [true, "Please add a product title"],
  },
  details: {
    type: String,
    required: [true, "Please add a description"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  price: Number,
  size: Number,
  state: String,
  productID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Orders", OrderSchema);
