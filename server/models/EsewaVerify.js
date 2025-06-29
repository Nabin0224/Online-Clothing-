const mongoose = require("mongoose");

const VerifyEsewaSchema = new mongoose.Schema({
 status : String,
 ref_id : String,
 total_amount : String,
 transaction_uuid : String,
}
,
{ timestamps : true })

module.exports = mongoose.model("VerifyEsewaOrder", VerifyEsewaSchema)