const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    
    userId: String,
    fullName: String,
    address: String,
    city: String,
    nearest_landmark: String,
    phone: String,
    deliveryCharge: Number

},
{
    timestamps: true
});

module.exports = mongoose.model('Address', AddressSchema);