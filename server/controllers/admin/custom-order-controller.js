const CodOrder = require("../../models/CodOrder");
const CustomOrder = require("../../models/CustomOrder");
const EsewaOrder = require("../../models/EsewaOrder");
const { findById } = require("../../models/Order");
const Product = require("../../models/products");

const createOrder = async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("formData in create order", formData)
    if (!formData) {
      return res.status(404).json({
        success: false,
        message: "formData is empty or undefined!",
      });
    }

    console.log("formData in custom order creation", formData);

    const order = new CustomOrder(formData);

    //managing out of stock feature
    for (let item of order.cartItem) {
      console.log('entered in first loop')
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found in database!",
        });
      }
      for (let colorItem of product.colors) {
        if (colorItem.colorName === item.color) {
          if (colorItem.quantity < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough stock for ${product.title}`,
            });
          }

          colorItem.quantity -= item.quantity;
        }
      }
      // Recalculating the total stock of the product
      product.totalStock = product.colors.reduce(
        (sum, c) => sum + c.quantity,
        0
      );
      console.log("saving database in create order")
      product.markModified("colors");
      await product.save();
    }

    await order.save();
    return res.status(200).json({
      success: true,
      message: "Custom order Successfully created!",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some error occured in creating custom order",
      error: error.message,
    });
  }
};
const getAllCustomOrders = async (req, res) => {
  try {
    const order = await CustomOrder.find();

    return res.status(200).json({
      success: true,
      message: "Custom order Successfully fetched!",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some error occured in fetching custom order",
      error: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id in req params of update custom order", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is not present",
      });
    }

    const findOrder = await CustomOrder.findById(id);
    if (!findOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const {
      address,
      city,
      delivery_charge,
      discount_amount,
      email,
      fullName,
      nearest_landmark,
      paymentStatus,
      phone,
    } = req.body;
    const updateData = req.body.formattedData || req.body;

    for (let key in updateData) {
      if (updateData[key] !== undefined) {
        findOrder[key] = updateData[key];
      }
    }

    findOrder.address = address || findOrder.address;
    findOrder.city = city || findOrder.city;
    findOrder.delivery_charge = delivery_charge || findOrder.delivery_charge;
    findOrder.discount_amount = discount_amount || findOrder.discount_amount;
    findOrder.email = email || findOrder.email;
    findOrder.fullName = fullName || findOrder.fullName;
    findOrder.nearest_landmark = nearest_landmark || findOrder.nearest_landmark;
    findOrder.paymentStatus = paymentStatus || findOrder.paymentStatus;
    findOrder.phone = phone || findOrder.phone;

    await findOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order edited successfully",
      data: findOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured in updating custom order",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is requried to delete order",
      });
    }

    const order = await CustomOrder.findByIdAndDelete(id) || await EsewaOrder.findByIdAndDelete(id) || await CodOrder.findByIdAndDelete(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      messaage: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Some error occured in deleting custom order",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("params and rbody", req.params, req.bd);
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Id or status not present!",
      });
    }

    const updatedOrder = await CustomOrder.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OrderStatus updated successfully",
      data: updateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured!",
      errro: error.message,
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllCustomOrders,
  updateOrderStatus,
};
