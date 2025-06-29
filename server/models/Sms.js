const mongoose = require("mongoose");

const SmsSchema = new mongoose.Schema(
  {
    to: {
      type: [String],
      required: true,
    },
    text: {
      type: [String],
      require: true
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Sms", SmsSchema);
