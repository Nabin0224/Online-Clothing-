const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  guestId: {
    type: String,
    required: false
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  nearest_landmark: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  deliveryCharge: {
    type: Number,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Address", AddressSchema);