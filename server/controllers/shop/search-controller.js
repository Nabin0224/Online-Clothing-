const CodOrder = require('../../models/CodOrder');
const CustomOrder = require('../../models/CustomOrder');
const Product = require('../../models/products')

const searchProducts = async(req, res)=> {
    try {

        const { keyword } = req.params;

        if(!keyword || typeof keyword !== "string") {
            return res.status(404).json({
                success: false,
                message: "keyword is required and must be string!"
            })
        }

        const regEx = new RegExp(keyword, "i");

        const createSearchQuery = {
            $or : [
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx},
            ]
        }

        const searchResults = await Product.find(createSearchQuery);
        
        return res.status(200).json({
            success: true,
             data: searchResults
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occured",
            error: error.message,
        })
    }
}

const searchOrders = async(req, res) => {
    try {
    const {search} = req.params;
    console.log(req.params , "params insearch")
        if(!search) {
             return res.status(400).json({
                success: false,
                message: "search query is required!",
             })
        }
        const regEx = new RegExp(search, "i");

        const createSearchQuery ={
            $or : [
                { "addressInfo.fullName": regEx },
        { "addressInfo.address": regEx },
        { "addressInfo.city": regEx },
        { "addressInfo.nearest_landmark": regEx },
        { "addressInfo.phone": search }
                
            ]
        }
  // Perform both queries simultaneously
  const codOrders = await CodOrder.find(createSearchQuery);
  const customOrders = await CustomOrder.find(createSearchQuery);

  // Combine both results into one array
  const searchResults = [...codOrders, ...customOrders];

 return res.status(200).json({
    success: true,
    data: searchResults
 })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
            error: error.message
        })
    }
}
module.exports = {
    searchProducts,
    searchOrders,
}