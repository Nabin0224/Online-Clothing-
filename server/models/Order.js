const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  guestId: { type: String, required: false },
  cartId: String,
  cartItem: [
    {
      productId: String,
      title: String,
      image: [],
      price: String,
      quantity: Number
    },
  ],
  addressInfo: {
    fullName: String,
    addressId: String,
    address: String,
    city: String,
    nearest_landmark: String,
    phone: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount : Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
  orderId: String

});

module.exports = mongoose.model('Order', OrderSchema);