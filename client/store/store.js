import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import adminProductSlice from '../store/admin/product-slice'
import shoppingProductSlice from '../store/shop/product-slice/index'
import shoppingCartSlice from './shop/cart-slice/index'
import shoppingAddressSlice from './shop/address-slice/index'
import shoppingOrderSlice from './shop/order-slice/index'
import adminOrderSlice from './admin/order-slice/index'
import shoppingSearchSlice from './shop/search-slice/index'
import esewaOrderSlice from './shop/esewa-slice/createorder'
import featureImageSlice from './common/index'
import codOrderSlice from './cod-slice/index'
import customOrderSlice from "./admin/order-slice/custom-order/index"
import adminOrdersDataSlice from "./admin/data-slice/index"
import adminSmsSlice from "./admin/sms-slice/index"
// import googleAuthReducer from './google-auth/index'

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductSlice,
    shoppingProducts: shoppingProductSlice,
    shoppingCart: shoppingCartSlice,
    shoppingAddress: shoppingAddressSlice,
    shoppingOrders: shoppingOrderSlice,
    esewaOrders : esewaOrderSlice,
    codOrders: codOrderSlice,
    adminOrders: adminOrderSlice,
    adminCustomOrders: customOrderSlice,
    shoppingSearch: shoppingSearchSlice,
    featureImage : featureImageSlice,
    ordersData : adminOrdersDataSlice,
    sms : adminSmsSlice,


    // googleAuth: googleAuthReducer
  },
});

export default store;
