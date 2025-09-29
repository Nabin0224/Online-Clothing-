const CodOrder = require("../../models/CodOrder");
const CustomerOrder = require("../../models/CustomOrder");
const axios = require("axios");
require("dotenv").config();

const getAllOrdersFromCargo = async (req, res) => {
  try {
    let page = 1;
    let allOrdersList = [];
    let hasMore = true;

    console.log("reached in try of cargo");


    while (hasMore) {
      const getAllOrders = await axios.get(
        `https://domestic.namastecargonepal.com/api/vendor/orders?page=${page}`,

        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CARGO_TOKEN}`,
          },
          maxBodyLength: Infinity,
        }
      );
      const { data, meta } = getAllOrders.data;
      console.log("data", data)
      allOrdersList = [...allOrdersList, ...data];
      if (meta.current_page < meta.last_page) {
        page++;
      } else {
        hasMore = false;
      }
      console.log("hasmore",hasMore)
    }
    console.log("console in backend cargo try", allOrdersList.length);

    // retriving 



    res.status(200).json({
      success: true,
      data: allOrdersList,
      message: "Data fetch successfully from Cargo",
    });
  } catch (error) {
    console.log("errror in cargo", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

module.exports = { getAllOrdersFromCargo };
