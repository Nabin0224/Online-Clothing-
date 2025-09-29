const Cart = require("../../models/Cart");
const Product = require("../../models/products");

const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity, color } = req.body;
    console.log("cartItem",req.body)

    if ((!userId && !guestId) || !productId || !color || quantity <= 0)
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ guestId });
    }
    if (!cart) {
      cart = new Cart({ userId: userId || undefined, guestId: guestId || undefined, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.color == color
    );
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity, color });
    } else {
      cart.items[findCurrentProductIndex].quantity = quantity;
    }
    
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { guestId } = req.query;
    
    if ((!userId || userId === "undefined") && !guestId) {
      return res.status(404).json({
        success: false,
        messsage: "User Id or Guest Id is mandatory!",
      });
    }
    const findFilter = userId && userId !== "undefined" ? { userId } : { guestId };
    const cart = await Cart.findOne(findFilter).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      color: item.color
    }));
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItems = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity, color } = req.body;

    if ((!userId && !guestId) || !productId ||  !color || quantity <= 0)
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    const cart = await Cart.findOne(userId ? { userId } : { guestId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.color === color 
    );

    if (findCurrentProductIndex === -1) {
       return res.status(404).
        json({
          success: false,
          message: "Cart item not present!",
        });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found!",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      color: item.color
    }));
    res.status(200).json({
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { guestId } = req.query;
    if ((!userId && !guestId) || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }
    const cart = await Cart.findOne(userId ? { userId } : { guestId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not present!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found!",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,   
    }));
    res.status(200).json({
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
};
