const Order = require("../../models/Order");
const EsewaOrder = require("../../models/EsewaOrder");
const CodOrder = require("../../models/CodOrder");
const CustomerOrder = require("../../models/CustomOrder");

const getAllOrdersofAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 ; // get the number of page
    const limit = 50;
    const skip = (page - 1 ) * limit; // calucating how many orders to skip

    const paypalorders = await Order.find({}).sort({ createdAt: -1 });
    const esewaorders = await EsewaOrder.find({}).sort({ createdAt: -1 });
    const codorders = await CodOrder.find({}).sort({ createdAt: -1 });
    const customorders = await CustomerOrder.find({}).sort({ createdAt: -1 });
    // returns array of orders present in the database

    if (
      paypalorders.length === 0 &&
      esewaorders.length === 0 &&
      codorders.length === 0 &&
      customorders.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No admin orders found!",
      });
    }

    // merging all orders and sort them by createdAt descending 
    const orders = [
      ...paypalorders,
      ...esewaorders,
      ...codorders,
      ...customorders,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    //Getting total number of orders

    // const total number of orders 
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders/limit);

    //  applying panigation
    const panigatedOrders = orders.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data: panigatedOrders,
      totalOrders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured",
      error: error.message,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order =
      (await Order.findById(id)) ||
      (await EsewaOrder.findById(id)) ||
      (await CodOrder.findById(id)) ||
      (await CustomerOrder.findById(id));
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order details found in paypal!",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Id or status is required!",
      });
    }
    console.log(id, status, "order update status info");

    // Find the order in all models
    let order = await Order.findById(id);
    let model = Order;

    if (!order) {
      order = await EsewaOrder.findById(id);
      model = EsewaOrder;
    }
    if (!order) {
      order = await CodOrder.findById(id);
      model = CodOrder;
    }
    if (!order) {
      order = await CustomerOrder.findById(id);
      model = CustomerOrder;
    }

    await model.findByIdAndUpdate(id, { orderStatus: status }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Order status updated in all successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrdersofAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
