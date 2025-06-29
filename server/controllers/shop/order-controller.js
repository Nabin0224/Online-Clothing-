require('dotenv').config();
const paypal = require('../../helpers/paypal')
const Order = require("../../models/Order")
const Cart = require("../../models/Cart")
const Product = require("../../models/products")
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItem,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      totalAmount,
      cartId
    } = req.body;
    console.log(req.body, "orderbody")

    const create_payment_json = {
         intent : 'sale',
         payer : {
            payment_method : 'paypal'
         },
         redirect_urls: {
            return_url : `${process.env.CLIENT_BASE_URL}/paypal-return`,
            cancel_url : `${process.env.CLIENT_BASE_URL}/paypal-cancel`
         },
         transactions: [
            {
                item_list : {
                    items : cartItem.map(item => ({
                        name : item.title,
                        sku : item.productId,
                        price: item.price.toFixed(2),
                        currency : 'USD',
                        quantity : item.quantity
                    }))
                },
                amount : {
                    currency : 'USD',
                    total : totalAmount.toFixed(2)
                },
                description: 'description'
            }
         ]
    }

    paypal.payment.create(create_payment_json, async(error, paymentInfo )=> {
        if(error){
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Errror occured while creating paypal payment',
                error: error.message
            })
        } else{
            const newlyCreatedOrder = new Order( { 
                userId,
      cartItem,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      totalAmount,
      cartId
            })
            await newlyCreatedOrder.save();
            const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;
            res.status(201).json({
                success: true,
                approvalURL,
                orderId: newlyCreatedOrder._id
            })
        }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: error.message,
    });
  }
};
const capturePayment = async (req, res) => {

  try {
    const {
     payerId, paymentId, orderId
    } = req.body

    console.log(orderId, "orderId in backend");

    // finding order id in database
    const order = await Order.findById(orderId)

    if(!order){
      return res.status(404).json({
        success: false,
        message: "Order not found!"
      })
    }
    // editing database
    order.paymentStatus = "paid"
    order.orderStatus = "confirmed"
    order.paymentId = paymentId;
    order.payerId = payerId;
    
    // managing out of stock feature 
    for(let item of order.cartItem) {
         let product = await Product.findById(item.productId)

         if(!product) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for this product ${product.title}`
          })
         }

         product.totalStock -= item.quantity;
        await product.save();
    }
    

    const getCart = order.cartId;
    await Cart.findByIdAndDelete(getCart)
    
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
      data: order
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: error.message
    });
  }
};

const getAllOrdersByUser = async(req, res)=> {
try {
  const { userId } = req.params;
  const orders = await Order.find({userId})  // returns array of orders present in the database 

  if(orders.length < 0 ) {
    return res.status(404).json({
      success: false,
      message: "No orders found!"
    })
  }
  res.status(200).json({
    success: true,
    data: orders,
  })
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Some error occured",
    error: error.message,
  })
}
}

const getOrderDetails = async(req, res)=> {
  try{
  const {id} = req.params;

  const order = await Order.findById(id)
  if(!order){
    return res.status(404).json({
      success: false,
       message: "No order found!"
    })
  }
  console.log("order details in shop")
    return res.status(200).json({
      success: true,
      data: order
    })
  
  }catch(error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured",
      error: error.message 
    })
  }
}


module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails,
}