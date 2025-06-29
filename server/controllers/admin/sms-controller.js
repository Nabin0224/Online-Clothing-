const Sms = require("../../models/Sms");
const axios = require("axios");

const auth_token = process.env.AUTH_TOKEN;

const sendSms = async (req, res) => {
  try {
    const { to, text } = req.body;
    console.log(to, text)
    if (!to || !text) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required!",
      });
    }
    const response = await axios.post(
      "https://sms.aakashsms.com/sms/v4/send-user",
      {to, text},
      {
        headers: {
          "auth-token": auth_token,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    const sms = new Sms({to, text});
    await sms.save();
    return res.status(200).json({
        success: true,
        message: "SMS sent successfully",
        data: response.data,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: error.message,
    });
  }
};

module.exports = { sendSms }