const mongoose = require("mongoose");

const EsewaOrderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    transaction_uuid: {    // required for signature
        type: String,
        required: true,
        unique: true,
    },
    addressInfo: {
        fullName: String,
        addressId: String,
        address: String,
        city: String,
        nearest_landmark: String,
        phone: String,
    },
    
    cartItem: [
        {
            productId: String,
            title: String,
            image: [],
            price: String,
            quantity: Number,
        }
    ],
    
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: String, 
    orderDate: String,
    orderUpdatedDate: String,
    orderId: String,
    ref_id: String, // from esewa 
    
},
{timestamps: true}
)

module.exports = mongoose.model("EsewaOrder", EsewaOrderSchema);