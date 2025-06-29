const CodOrder = require("../../models/CodOrder");
const CustomOrder = require("../../models/CustomOrder");
const EsewaOrder = require("../../models/EsewaOrder");

const  checkDoubleOrder = async(req, res) => {

   try {
    const { phone } = req.body;
    console.log("phone", phone)

    if(!req.body) {
        return res.status(400).json({
            success: false,
            message: "Number is required to check!",

        })
    }

    const existingOrder = await CodOrder.findOne({"addressInfo.phone" : phone}) || await CustomOrder.findOne({"addressInfo.phone": phone}) || await EsewaOrder.findOne({"addressInfo.phone": phone})
    console.log("existingOrder", existingOrder)

    if(existingOrder) {
        return res.status(200).json({
            success: true,
            message: "Order with this number already exist in database",
            exists: true,
        })
    }else{
        return res.status(200).json({
             success: true,
             message: "Order with this numner doesnot exist in database",
             exists: false
        })
    }
   } catch (error) {
    
    return res.status(500).json({
        success: false,
        message: "Some error occured",
        error : error.message,
    })
   }

}


module.exports = checkDoubleOrder;