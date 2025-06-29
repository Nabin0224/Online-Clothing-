

require('dotenv').config()
const EsewaOrder = require("../../models/EsewaOrder");
const VerifyEsewaOrder = require("../../models/EsewaVerify");
const crypto = require("crypto"); // from hashing
const { v4: uuidv4 } = require("uuid"); // for unique transaction_uuid
const axios = require("axios");
const Cart = require('../../models/Cart')
const Product = require("../../models/products")

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const SUCCESS_URL =  process.env.SUCCESS_URL;
const FAIL_URL = process.env.FAIL_URL;
const PRODUCT_CODE = process.env.PRODUCT_CODE;

// generating signature using sha256
function handleGenerateSignature(message) {
  const signature = crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
  return signature;
}

// Creating order initiation
const createEsewaOrder = async (req, res) => {
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
      totalAmount,
      cartId,
      
     } = req.body;
     
console.log("formData in esewa", req.body)
    let transaction_uuid = uuidv4();

    
    const order = new EsewaOrder( { 
          userId,
          cartItem,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate,
          orderUpdateDate,
          totalAmount,
          cartId,
          transaction_uuid : transaction_uuid
                })
              
   
    await order.save();

    const signed_field_names = "total_amount,transaction_uuid,product_code";
    const stringToSign = `total_amount=${totalAmount},transaction_uuid=${order?.transaction_uuid},product_code=${PRODUCT_CODE}`;
    const signature = handleGenerateSignature(stringToSign);

    const formData = {
      amount: order.totalAmount,
      tax_amount: "0",
      total_amount: order.totalAmount,
      transaction_uuid: order?.transaction_uuid,
      product_code: PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: SUCCESS_URL,
      failure_url: FAIL_URL,
      signed_field_names: signed_field_names,
      signature: signature,
    };
    
    return res.status(200).json({
      success: true,
      message: "Initiated Successfully",
      data: formData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured",
      error: error.message,
    });
  }
};

const captureEsewaOrder = async (req, res) => {
  try {
    const { encodedData, cartId } = req.body;

    if (encodedData) {
      // Parse JSON-fomatted String into JavaScript object
      const parsedData = JSON.parse(encodedData);
      console.log(parsedData, "parsedData");

      if (parsedData.status !== "COMPLETE") {
        return res.status(400).json({
          success: false,
          message: "Status not completed",
        });
      }
      const message = parsedData.signed_field_names
        .split(",")
        .map((field) => `${field}=${parsedData[field] || ""}`)
        .join(",");
      console.log(message, "message");
      const generatedSignature = handleGenerateSignature(message);
      console.log(generatedSignature, "signature our");

      
      
      if (generatedSignature !== parsedData.signature) {
        console.log("signture not matched");
        return res.status(400).json({
          message: "integrity error",
        });
      }
    } else {
      
      const order = await EsewaOrder.findOne().sort({ _id: -1 });

      console.log("Signature matched");
       res.status(200).json({
        success: true,
        message: "Data integrity maintained",
        orderId: order._id,
      });

    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured",
      error: error.message,
    });
  }
};

const verifyEsewaPayment = async (req, res) => {
  try {
    const transaction = await EsewaOrder.findOne().sort({ _id: -1 }); // finding the lastest created document in the collection
    console.log("reached in verify ok")
    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "uuid not found!",
      });
    }

    //managing out of stock and cart quantity decrease
 console.log("transaction in verify", transaction)
    for(let item of transaction.cartItem) {
    let product = await Product.findById(item.productId)
    }


    const transaction_uuid = transaction?.transaction_uuid;
    
    // eSewa API call 
    const response = await axios.get(`
      https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${PRODUCT_CODE}&total_amount=${transaction?.totalAmount}&transaction_uuid=${transaction_uuid}
 `);
    console.log(response.data, "esewa response");

    if(!response.data || response?.data?.status !== "COMPLETE") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed!"
      })
    }
    // Extracting relevant data from response 
    const { ref_id, status } = response.data;

    transaction.ref_id = ref_id;
    transaction.orderStatus = status;
    transaction.paymentStatus = "paid"



    //managing out of stock feature
 
     for (let item of order.cartItem) {
       let product = await Product.findById(item.productId);
 
       if (!product) {
         return res.status(404).json({
           success: false,
           messsage: `Not enough stock for this product ${product.title}`,
         });
       }
 
       for (let colorItem of product.colors) {
         if (colorItem.code === item.color) {
           if (colorItem.quantity < item.quantity) {
             return res.status(400).json({
               success: false,
               message: `Not enought stock for ${product.title} in color ${item.color}`,
             });
           }
           colorItem.quantity -= item.quantity;
         }
       }
 
       //   Recalculation totalStock
 
       product.totalStock = product.colors.reduce(
         (sum, c) => sum + c.quantity,
         0
       );
 
       product.markModified("colors");
 
       await product.save();
     }
 
        // deleting the cart item after order is placed 
        const getCart = transaction.cartId;
        await Cart.findByIdAndDelete(getCart);
    
    //Saving the updated document
    await transaction.save()

    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: error.message,
    });
  }
};
 
const getAllOrdersByUser = async(req, res)=> {
 try {
  const { userId } = req.params;
  const order = await EsewaOrder.find({userId});



 
  if(order.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Order not found in getAllOrdersByUser of esewa!",
    })
  }

  return res.status(200).json({
    success: true,
    data: order
  })
}
  
 catch (error) {
  
  res.status(500).json({
    success: false,
    message: "Some error occured!",
    error : error.message,
  })
 }
}

const getOrderDetails = async(req,res) => {
 try {

  const {id} = req.params;
  console.log(id, id)
  
  const order = await EsewaOrder.findById(id);

  if(!order){
    return res.status(400).json({
      success: false,
      message: "No order found for Details of esewa !"
    })
  }
  console.log(order, "orderdetailsofuser")

  return res.status(200).json({
    success: true,
    data: order
  })
  
 


 } catch (error) {
  return res.status(500).json({
    success: false,
    error: error.message,
  })
 }
 }

module.exports = {
  createEsewaOrder,
  captureEsewaOrder,
  verifyEsewaPayment,
  getAllOrdersByUser,
  getOrderDetails,
};
