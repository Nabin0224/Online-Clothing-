import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import React, { useEffect, useState } from "react";
import {
  addToCart,
  fetchCartItems,
  updateCartQuantity,
} from "../../../store/shop/cart-slice/index";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../../store/shop/product-slice/index";
import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import AuthPopup from "../../components/shopping-view/login-card";
import { AlertDialogContent } from "@/components/ui/alert-dialog";
import { Sheet } from "@/components/ui/sheet";
import UserCartWrapper from "../../components/shopping-view/cart-wrapper";

const ProductDetailsPage = () => {
  const [openMobileCartSheet, setOpenMobileCartSheet] = useState(false);
    const [openCartSheet, setOpenCartSheet] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = useParams();

  const { user } = useSelector((state) => state.auth);
  const { formData } = useSelector((state) => state.esewaOrders);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const [cartColor, setCartColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleCheckLogin = () => {
    if (!user) {
      toast({
        title: "Please Login to proceed Add to Cart!",
        variant: "destructive",
        duration: 2000,
      });
      setIsLogin(false);
    } else {
      setIsLogin(true);
      setShowAuthPopup(true);
    }
  };

  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const [count, setCount] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const cartItemDetails =
    cartItems?.items?.find(
      (item) =>
        item?.productId == productDetails?._id && item.color === selectedColor
    ) ?? null;

  useEffect(() => {
    if (productDetails?.image && productDetails.image.length > 0) {
      setCurrentImageIndex(0); // Reset index when product changes
    }
  }, [productDetails]);

  console.log("productDetals", productDetails);
  console.log("cartItems in product details", cartItems)
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [user, productId]);

  useEffect(() => {
    dispatch(fetchProductDetails(productId.id));
  }, [user, productId]);
  useEffect(() => {
    if (cartItemDetails) {
      setCount(cartItemDetails.quantity);
    }
  }, [cartItemDetails]);

  // const cartItem = cartItems?.items?.find((item) => item?.productId === productDetails?._id);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let finalQuantity = count > 1 ? count : 1;
    let getCartItems = cartItems?.items || [];
    console.log("CartItems", cartItems);

    // check if the product with same color is present or not

    // Check if the product is already in the cart
    const existingCartItem = getCartItems.find(
      (item) =>
        item.productId === getCurrentProductId && item.color === selectedColor
    );
    console.log("selectedColor", selectedColor)

    if (existingCartItem) {
      const updatedQuantity = finalQuantity; // Instead of adding, directly replace it

      if (updatedQuantity > getTotalStock) {
        toast({
          title: `Only ${getTotalStock} items can be added for this product`,
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCurrentProductId,
          color: selectedColor, // update quanity of the same color
          quantity: updatedQuantity,
        })
      ).then(() => {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Cart updated successfully",
          duration: 2000,
        });
      });
    } else {
      // **NEW ENTRY CHECK**: Ensure quantity does not exceed stock
      if (finalQuantity > getTotalStock) {
        toast({
          title: `Only ${getTotalStock} items are available in stock`,
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      // If the item does not exist, add it normally
      if (!selectedColor) {
        toast({
          title: "Please choose a color!",
          variant: "destructive",
          duration: 1500,
        });
      }
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: finalQuantity,
          color: selectedColor,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product Added to the Cart",
            duration: 2000,
          });
        }
      });
    }
  }

  function handleCartQuantity(getCartItem, typeofAction) {
    if (!selectedColor) {
      toast({ title: "Please select a color first!", variant: "destructive" });
      return;
    }

    const cartItemWithColor = cartItems?.items?.find(
      (item) =>
        item.productId === getCartItem?.productId &&
        item.color === getCartItem.color // Ensure correct color is used
    );

    if (!cartItemWithColor) return;

    let updatedQuantity =
      typeofAction === "plus"
        ? cartItemWithColor.quantity + 1
        : cartItemWithColor.quantity - 1;

    if (updatedQuantity < 1) return;

    const productInList = productList.find(
      (item) => item._id === getCartItem?.productId
    );

    if (productInList && updatedQuantity > productInList.totalStock) {
      toast({
        title: `Only ${productInList.totalStock} items available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        color: selectedColor,
        quantity: updatedQuantity,
      })
    ).then(() => dispatch(fetchCartItems(user?.id)));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-2 min-w-fit m-1 p-1 md:p-2 md:m-2 h-full">
      <div className="relative rounded-lg m-1 p-1  h-full  md:p-8 flex-col gap-2">
        {productDetails?.image && productDetails?.image.length > 0 && (
          <img
            src={productDetails?.image[currentImageIndex]}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-[4/5] h-auto object-center object-cover"
          />
        )}
        <div className="flex gap-2 mt-2 overflow-auto">
          {productDetails?.image && productDetails?.image.length > 0
            ? productDetails?.image.map((item, index) => (
                <img
                  onClick={() => setCurrentImageIndex(index)}
                  key={index}
                  src={item}
                  alt={productDetails?.title}
                  width={100}
                  height={50}
                  className={`aspect-square rounded-sm object-center object-cover transition-all duration-200 ${
                    currentImageIndex === index
                      ? "scale-110 border-blue-500 "
                      : ""
                  } `}
                />
              ))
            : null}
        </div>
      </div>
      <div className=" m-1 p-1 Productdetails relative flex flex-col md:p-8">
        <div className="">
          <h1 className="text-2xl md:text-4xl  font-[300] stroke-none  mb-4 md:mb-12">
            {productDetails?.title}
          </h1>
          <p className="text-sm font-extralight text-black/70 md:text-2xl mb-4 md:mb-5">
            {productDetails?.description}
          </p>
        </div>
        <div className="flex items-center gap-6 mb-6 md:mb-8">
          <p
            className={`text-center text-sm md:text-2xl font-normal text-muted-foreground ${
              productDetails?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            ₹ {productDetails?.price}
          </p>
          {productDetails?.salePrice > 0 ? (
            <p className="text-lg md:text-2xl font-normal text-primary opacity-80 ">
              {" "}
              ₹ {productDetails?.salePrice}
            </p>
          ) : null}
        </div>
        <div className="Color mb-6 md:mb-6">
          <h2>Color : </h2>
          <div>
            <div className="flex gap-2 mt-3">
              {productDetails?.colors?.map((color) => (
                <button
                  key={color.colorName}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color.colorName
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => {
                    setSelectedColor(color.colorName);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="Quantity  md:mb-6">
          <h2>Quantity :</h2>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {/* Minus button */}

          <Button
            onClick={() => {
              if (!cartItemDetails) {
                setCount(count - 1);
              } else {
                handleCartQuantity(cartItemDetails, "minus");
              }
            }}
            variant="outline"
            className="h-6 w-6 rounded-sm"
            size="icon"
            // disabled={ cartItemDetails?.quantity ===1  || count === 1}
            disabled={
              cartItemDetails?.quantity <= 1 || (!cartItemDetails && count <= 1)
            }
          >
            <Minus className="w-4 h-4" strokeWidth={0.8} />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className=" font-extralight md:font-semibold text-sm mt-1">
            {cartItemDetails?.quantity ?? count}
          </span>

          {/* Plus button?\ */}
          <Button
            onClick={() => {
              if (!cartItemDetails) {
                setCount(count + 1);
              } else {
                handleCartQuantity(cartItemDetails, "plus");
              }
            }}
            variant="outline"
            className="h-6 w-6 rounded-sm"
            size="icon"
          >
            <Plus style={{ width: "12px", height: "12px" }} strokeWidth={0.8} />
            <span className="sr-only">Increase</span>
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full mt-6 mb-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-thin text-md md:text-2xl text-black/60 tracking-wide  hover:no-underline focus:no-underline">
              Shipping Policy
            </AccordionTrigger>
            <AccordionContent>
              <p className="font-extraligh text-muted-foreground text-md md:text-lg">
                See our exchange and refund policy in legal section
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator className="w-full bg-black/20" />

        <div className="md:bottom-8 w-full mx-auto mb-2">
  {productDetails?.totalStock === 0 && (
    <Button className="w-full opacity-60 cursor-not-allowed bg-[#E5E5E5]">
      Out of Stock
    </Button>
  )}

  {productDetails?.totalStock !== 0 && !user && (
    <Dialog open={showAuthPopup} onOpenChange={setShowAuthPopup}>
      <DialogTrigger asChild>
       
        <Button
          variant="secondary"
          onClick={() => {
            toast({
              title: "Please login to add items to cart!",
              variant: "destructive",
            });
            setIsLogin(false);
            setShowAuthPopup(true);
          }}
          className="w-full rounded-sm"
        >
          Add to Cart
        </Button>
       
      </DialogTrigger>
      <DialogContent className="max-w-[90%] md:max-w-md">
        <AuthPopup isLogin={isLogin} setIsLogin={setIsLogin} />
      </DialogContent>
    </Dialog>
  )}

  {productDetails?.totalStock !== 0 && user && (
     <Sheet
     open={openCartSheet}
     onOpenChange={()=> {
       setOpenCartSheet(false);
       setOpenMobileCartSheet(false);
     }}
     >
    <Button
      variant="secondary"
      onClick={() =>
      {  handleAddtoCart(productDetails?._id, productDetails?.totalStock)
        selectedColor &&  setOpenCartSheet(true)
      }
      }
      className="w-full rounded-sm"
    >
      Add to Cart
    </Button>
    <UserCartWrapper
              cartItems={
                cartItems && cartItems.items && cartItems.items.length > 0
                  ? cartItems.items
                  : []
              }
              setOpenCartSheet={setOpenCartSheet}
              setOpenMobileCartSheet={setOpenMobileCartSheet}
            />
        </Sheet>
  )}
</div>

        <div className="md:bottom-8 w-full mx-auto ">
          {productDetails?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed hidden">
              Out of Stock
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleAddtoCart(productDetails?._id, productDetails?.totalStock)
              }
              className="w-full rounded-sm hidden"
            >
              Buy now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;