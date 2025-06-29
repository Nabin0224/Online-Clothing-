const Subscribe = require("../../models/Subscribe");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return (
        res.status(400).
        json({
          success: false,
          message: "Email is not present",
        })
      );
    }

    const existingEmail = await Subscribe.findOne({ email: email });

    if (existingEmail) {
      return res.status(200).json({
        success: false,
        message: "You are Already subscribed to us  😊",
      });
    }

    const newSubscriber = new Subscribe({
      email,
    });

    await newSubscriber.save();

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
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
  subscribe,
};
