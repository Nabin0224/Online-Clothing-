const mongoose = require('mongoose');

const CustomOrderSchema = new mongoose.Schema({
    userId: String,
    
    addressInfo: {
        fullName: String,
        addressId: String,
        address: String,
        city: String,
        nearest_landmark : String,
        phone: String,
    },
    cartItem: [
        {
            productId: String,
            title: String,
            image: [],
            price: String,
            quantity: String,
            color: String
        }
    ],
    orderStatus: String,
    paymentMethod: String, 
    paymentStatus: String,
    totalAmount: Number,
    orderDate: String
},
{timestamps: true})

module.exports = mongoose.model("CustomOrder", CustomOrderSchema);