// require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartProductsRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopEsewaOrderRouter = require("./routes/shop/esewa-order-routes");
const shopCodOrderRouter = require("./routes/shop/cod-order-routes");
const shopSubscribeRouter = require('./routes/shop/subscribe')
const adminOrderRouter = require("./routes/admin/order-routes");
const searchRouter = require("./routes/shop/search-routes");
const commonFeatureRouter = require("./routes/common/feature");
const googleauthRouter = require("./routes/google-auth-routes")
const adminCustomOrderRouter = require('./routes/admin/custom-order-routes')
const adminDataRouter = require('./controllers/admin/data')
const adminSmsRouter = require("./routes/admin/sms-routes")
const adminOrderCheckRouter = require("./routes/admin/double-order")
const app = express();
const authRouter = require("./routes/auth-routes");
const PORT = process.env.PORT || 3002;
const passport = require("passport");
const session = require("express-session");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTION) // Remove deprecated options
  .then(() => console.log("MongoDB connected successfully"))
  .catch((e) => console.error("MongoDB connection error:", e));


// mongoose
//   .connect(process.env.CONNECTION, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 30000,
//      // Increase timeout duration
//   })
//   .then(() => console.log("MongoDb connected successfully"))
//   .catch((e) => console.log("Error:", e));

app.use(cookieParser());
app.use(bodyParser.json());


app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    
  })
);

app.use(
  session({ secret: "secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())

app.use("/api/auth", authRouter);
app.use("/", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api", authRouter);
app.use("/api/shop/cart", shopCartProductsRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/esewaorder", shopEsewaOrderRouter);
app.use("/api/shop/codorder", shopCodOrderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/customorders", adminCustomOrderRouter);
app.use("/api/admin/ordersdata", adminDataRouter);
app.use("/api/admin/check", adminOrderCheckRouter);
app.use("/api/admin/sms", adminSmsRouter);
app.use("/api/shop/search", searchRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/google", googleauthRouter);
app.use('/api/shop/subscribe', shopSubscribeRouter);

app.listen(PORT, () => {
  console.log(`Server running successfully at ${PORT}`);
});


