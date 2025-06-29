const CodOrder = require("../../models/CodOrder.js");
const CustomOrder = require("../../models/CustomOrder.js");
const EsewaOrder = require("../../models/EsewaOrder.js");
const express = require("express");

const router = express.Router();

router.get("/daily", async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Function to get daily orders from a collection
    const getDailyOrders = async (model) => {
      return model.aggregate([
        { $match: { createdAt: { $gte: lastMonth } } }, // Filter last month orders
        {
          $addFields: {
            nepalTime: {
              $dateAdd: {
                startDate: "$createdAt",
                unit: "hour",
                amount: 5,
              },
            },
          },
        },
        {
          $addFields: {
            nepalTime: {
              $dateAdd: {
                startDate: "$nepalTime",
                unit: "minute",
                amount: 45,
              },
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$nepalTime" },
              month: { $month: "$nepalTime" },
              day: { $dayOfMonth: "$nepalTime" },
            },
            total: { $sum: 1 }, // Count orders
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            total: 1,
          },
        },
        { $sort: { date: 1 } }, // Ensure sorting by date
      ]);
    };

    // Fetch orders from all collections
    const [codOrders, customOrders, esewaOrders] = await Promise.all([
      getDailyOrders(CodOrder),
      getDailyOrders(CustomOrder),
      getDailyOrders(EsewaOrder),
    ]);

    // Merging data from all three collections
    const combinedData = {};

    const mergeOrders = (orders) => {
      orders.forEach(({ date, total }) => {
        const dayKey = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
        if (!combinedData[dayKey]) combinedData[dayKey] = { date: dayKey, totalOrders: 0 };
        combinedData[dayKey].totalOrders += total;
      });
    };

    mergeOrders(codOrders);
    mergeOrders(customOrders);
    mergeOrders(esewaOrders);

    // Convert object to sorted array
    const finalData = Object.values(combinedData).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
