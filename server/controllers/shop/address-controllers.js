const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { fullName, address, city, nearest_landmark, phone, userId, guestId, deliveryCharge } = req.body;
    console.log("address Data", req.body)

    if ((!userId && !guestId) || !fullName || !address || !city || !phone || !deliveryCharge) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data!",
      });
    }

    const newlyCreatedAddress = new Address({
      userId: userId || undefined,
      guestId: guestId || undefined,
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
      error: error.message,
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { guestId } = req.query;

    if ((!userId || userId === "undefined") && !guestId) {
      return res.status(400).json({
        success: false,
        message: "UserId or GuestId is required!",
      });
    }

    const filter = userId && userId !== "undefined" ? { userId } : { guestId };
    const addressList = await Address.find(filter);

    return res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      error: error.message,
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { guestId } = req.query;
    const formData = req.body;

    if ((!userId || userId === "undefined") && !guestId) {
      return res.status(400).json({
        success: false,
        message: "UserId or GuestId is required!",
      });
    }

    const filter = userId && userId !== "undefined" ? { _id: addressId, userId } : { _id: addressId, guestId };
    const address = await Address.findOneAndUpdate(filter, formData, { new: true });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      error: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const { guestId } = req.query;

    if ((!userId || userId === "undefined") && !guestId) {
      return res.status(400).json({
        success: false,
        message: "UserId or GuestId is required!",
      });
    }

    const filter = userId && userId !== "undefined" ? { _id: addressId, userId } : { _id: addressId, guestId };
    const address = await Address.findOneAndDelete(filter);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some Error occurred",
      error: error.message,
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};