const  Address  = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const {fullName, address, city, nearest_landmark, phone, userId, deliveryCharge } = req.body;
    console.log(req.body, "body")
    if (!userId || !fullName || !address || !city || !nearest_landmark || !phone || !deliveryCharge) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data!",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      fullName,
      address,
      city,
      nearest_landmark,
      phone,
      deliveryCharge,
    });

    await newlyCreatedAddress.save();

    return res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      error: error.message
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if(!userId){
        return res.status(400).json({
            success: true,
            message: "UserId is required!"
        })
    }

    const addressList = await Address.find({userId});
    return res.status(200).json({
        success: true,
        data: addressList
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body

    if(!userId || !addressId) {
        return res.status(400).json({
            success: false,
            message: "UserId and AddressId are required !"
        })
    }

    const address = await Address.findOneAndUpdate({
        _id: addressId, userId
    }, formData, {new: true})

    if(!address) {
        return res.status(404).json({
            success: false,
            message: "Address not found"
        })
    }
     
    return res.status(200).json({
        success: true,
        data: address,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      errror: error.message
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    
    if(!userId || !addressId) {
        return res.status(400).json({
            success: false,
            message: "User and address is required!"
        })
    }

    const address = await Address.findOneAndDelete({_id: addressId, userId})
    
    if(!address) {
        return res.status(404).json({
            success: false,
            message: "Address not found!"
        })
    }

  
     return res.status(200).json({
        success: true,
        message: "Address Deleted Successfully ",
        
    })
     
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      error : error.message
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
