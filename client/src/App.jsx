import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingHome from "./pages/shopping-view/home";
import CheckAuth from "./pages/common/check-auth";
import UnAuthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/auth-slice/index";
import PayPalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import EsewaReturnPage from "./pages/shopping-view/esewa-return";
import PaypalCancelPage from "./pages/shopping-view/payment-cancel";
import PaymentCancelPage from "./pages/shopping-view/payment-cancel";
import SearchPage from "./pages/shopping-view/search";
import ScrollToTop from "./config/scroll";
import ProductDetailsPage from "./pages/shopping-view/product-details";
import CreateCustomOrder from "./pages/admin-view/createorder";
import AddProduct from "./pages/admin-view/add-product";
// import QrCode from "./components/admin-view/generateqrcode";
import QRCodeScanner from "./components/admin-view/scanqrcod";
import QrCodeDetails from "./components/admin-view/qrcodedetails";
import Legal from "./pages/shopping-view/legal";
import { ROUTES } from "./utils/constants/keyConstants";

const App = () => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-2xl font-bold content-center">Loading...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col">
        <Routes>
          <Route
            path={ROUTES.AUTH}
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path={ROUTES.LOGIN} element={<AuthLogin />} />
            <Route path={ROUTES.REGISTER} element={<AuthRegister />} />
          </Route>

          <Route
            path={ROUTES.ADMIN}
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrders />} />
            <Route path={ROUTES.CREATE_ORDER} element={<CreateCustomOrder />} />
            <Route path={ROUTES.ADD_PRODUCT} element={<AddProduct />} />
            <Route path={ROUTES.ADD_PRODUCT_EDIT} element={<AddProduct />} />
            {/* <Route path="qrcode" element={<QrCode/>} /> */}
            <Route path={ROUTES.SCAN_QR_CODE} element={<QRCodeScanner />} />
            <Route path={ROUTES.QR_CODE_DETAIL} element={<QrCodeDetails />} />
          </Route>

          <Route path={ROUTES.HOME} element={<ShoppingLayout />}>
            <Route
              path={ROUTES.ACCOUNT}
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingAccount />
                </CheckAuth>
              }
            />
           
            <Route
              path={ROUTES.CHECKOUT}
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingCheckout />
                </CheckAuth>
              }
            />
            <Route path={ROUTES.LISTING} element={<ShoppingListing />} />
            <Route path={ROUTES.HOME} element={<ShoppingHome />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailsPage />} />
            <Route path={ROUTES.PAYPAL_RETURN} element={<PayPalReturnPage />} />
            <Route path={ROUTES.ESEWA_RETURN} element={<EsewaReturnPage />} />
            <Route path={ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccessPage />} /> 
            <Route path={ROUTES.PAYMENT_CANCEL} element={<PaymentCancelPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.LEGAL} element={<Legal/>} />
          </Route>

          <Route path={ROUTES.UNAUTH} element={<UnAuthPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
