import React from "react";
import bannerOne from "../../assets/banner1.jpg";
import bannerFour from "../../assets/banner4.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { categoriesWithImage } from "../../config/index";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProducttile from "./product-tile";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice/index";
import { useNavigate } from "react-router-dom";
import { getFeatureImages } from "../../../store/common/index";
import ShoppingHeader from "@/components/shopping-view/header";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice/index";
import { useToast } from "@/hooks/use-toast";

export const ShoppingHome = () => {
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { featureImagesList } = useSelector((state)=> state.featureImage)

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} items can be added for this product`,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product Added to the Cart!",
          duration: 1500,
        });
      }
    });
  }
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }


  

  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filter");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/listing`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featureImagesList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featureImagesList.length]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: {} }));
  }, []);

  console.log(productList);
  useEffect(() => {
    dispatch(getFeatureImages());
  }, []);
  console.log("featureImage List", featureImagesList)

  return (
    <div className="flex flex-col min-h-screen">
      {/* <ShoppingHeader/> */}
      <div className="relative w-full h-[700px] overflow-hidden">
        {featureImagesList && featureImagesList.length > 0
          ? featureImagesList?.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`absolute w-full object-cover h-full top-0 left-0 transition-opacity duration-1000 
              ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))
          : null}
       
      </div>

   

      <section className="New arrivals py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Hottest 🔥</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-6">
            {productList && productList.length > 0
              ? productList.map((item) => (
                  <ShoppingProducttile
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      {/* <section className=" shopByCategory py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Shop by category
          </h2>
          <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 sm:h-[750px] md:h-[400px]"
          >
            {categoriesWithImage.map((item) => (
              <Card
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer hover:shadow-xl transition-shadow"
              >
                <img
                  key={item.id}
                  src={item.image}
                  className="object-cover w-full h-[300px] rounded-t-lg"
                />
                <CardContent className="flex flex-col justify-center p-6">
                  <span className="text-2xl font-semibold text-center">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default ShoppingHome;
