import React, { useEffect, useState } from "react";
import img from "../../assets/category/accountImage/acc.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "../../../store/shop/order-slice/index";
import { useToast } from "@/hooks/use-toast";
import { createEsewaOrder } from "../../../store/shop/esewa-slice/createorder";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@radix-ui/react-accordion";
import esewa from "../../../src/assets/logo/esewa.png"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createCodOrder } from "../../../store/cod-slice/index";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from   "@/components/ui/alert-dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { sendSms } from "../../../store/admin/sms-slice/index";
import { fetchAllAddress } from "../../../store/shop/address-slice/index";
import { Store_Name } from "../../utils/constants/storeConstants";

const ShoppingCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shoppingOrders);
  const [currentSelectedAddressInfo, setCurrentSelectedAddressInfo] =
    useState(null);
  const [isPayPalPaymentStart, setIsPaypalPaymentStart] = useState(false);
  const [isEsewaPaymentStart, setIsEsewaPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.esewaOrders);

 console.log("current selected", currentSelectedAddressInfo)
  const alwaysOpenItems = ["item-1"];
  const [openItems, setOpenItems] = useState(alwaysOpenItems);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState("");
  useEffect(() => {
    // Open the accordion when the component mounts (first render)
    setIsOpen("item-1");
  });

  //logic for total amount in cart
  const orderDate = new Date();
  const nepalTime = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(orderDate);
  
  console.log(nepalTime); // Output: "2025-04-02"

  useEffect(() => {
      
    dispatch(fetchAllAddress(user?.id)).then((data)=> {
     console.log("data in useeffect", data)
     const list = data?.payload?.data;
     if(list && list.length > 0 && !currentSelectedAddressInfo) {
       setCurrentSelectedAddressInfo(list[0]);
     }
    })
   }, [dispatch, user?.id]);
   


  const totalCartAmount =
    cartItems?.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
      console.log("totalCartAmount", totalCartAmount)

  //function to handle paypal payment
  function handleInitiatePaypalPayment() {
    if (cartItems.length == 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    if (currentSelectedAddressInfo === null) {
      toast({
        title: "Please select one address to proceed!",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItem: cartItems?.items?.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem.salePrice
            : singleCartItem?.price,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        fullName: currentSelectedAddressInfo?.fullName,
        addressId: currentSelectedAddressInfo?._id,
        address: currentSelectedAddressInfo?.address,
        city: currentSelectedAddressInfo?.city,
        nearest_landmark: currentSelectedAddressInfo?.nearest_landmark,
        phone: currentSelectedAddressInfo?.phone,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      orderDate: nepalTime,
      orderUpdateDate: nepalTime,
      paymentId: "",
      payerId: "",
      totalAmount: totalCartAmount,
    };

    setIsPaypalPaymentStart(true);

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaypalPaymentStart(false);
      }
    });
  }

  // redirecting to paypal
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  //<-------------------------------------------------------------------->

  // handling esewa payment initiation

  async function handleInitiateEsewaPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    if (currentSelectedAddressInfo === null) {
      toast({
        title: "Please select one address to proceed!",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setIsEsewaPaymentStart(true);

    try {
      const orderData = {
        cartItem: cartItems?.items?.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          price:
            singleCartItem?.salePrice > 0
              ? singleCartItem.salePrice
              : singleCartItem?.price,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          quantity: singleCartItem?.quantity,
        })),
        userId: user.id,
        cartId: cartItems?._id,
        orderDate: nepalTime,
        orderUpdateDate: nepalTime,
        addressInfo: {
          fullName: currentSelectedAddressInfo?.fullName,
          addressId: currentSelectedAddressInfo?._id,
          address: currentSelectedAddressInfo?.address,
          city: currentSelectedAddressInfo?.city,
          nearest_landmark: currentSelectedAddressInfo?.nearest_landmark,
          phone: currentSelectedAddressInfo?.phone,
        },
        orderStatus: "pending",
        paymentMethod: "eSewa",
        paymentStatus: "pending",
        totalAmount: totalCartAmount.toString(),
      };
      const { payload } = await dispatch(createEsewaOrder(orderData));
      setIsEsewaPaymentStart(false);

      if (payload) {
        sendEsewaPayment(payload); // Only call if payload exists
      }
    } catch (error) {
      console.error("eSewa dispatch error", error);
    }
  }

  const sendEsewaPayment = (formData) => {
    const {
      amount,
      failure_url,
      product_code,
      product_delivery_charge,
      product_service_charge,
      signature,
      signed_field_names,
      success_url,
      tax_amount,
      total_amount,
      transaction_uuid,
    } = formData;

    // eSewa’s API requires payment details to be submitted via an HTML form using a POST request instead of sending JSON via axios.post().
    // That’s why we create a form dynamically in JavaScript.
    // Create the form and submit it

    const form = document.createElement("form");
    form.method = "POST";
    form.type = "text";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    // Append input fields to the form
    const fields = {
      amount,
      failure_url,
      product_code,
      product_delivery_charge,
      product_service_charge,
      signature,
      signed_field_names,
      success_url,
      tax_amount,
      total_amount,
      transaction_uuid,
    };

    // Create hidden inputs for each field and append them to the form
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Append the form to the document body and submit it
    document.body.appendChild(form);

    form.submit();
  };

  //<-------------------------------------------------------------------->

  // Cod initialization
  
  function handleCodPayment() {
    if (cartItems.length == 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    if (currentSelectedAddressInfo === null) {
      toast({
        title: "Please select one address to proceed!",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setIsLoading(true);
    console.log("cartItems in checkout", cartItems )
    const orderData = {
      cartItem: cartItems?.items?.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem.salePrice
            : singleCartItem?.price,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        quantity: singleCartItem?.quantity,
        color: singleCartItem?.color
      })),
      userId: user.id,
      cartId: cartItems?._id,
      orderDate: nepalTime,
      orderUpdateDate: nepalTime,
      addressInfo: {
        fullName: currentSelectedAddressInfo?.fullName,
        addressId: currentSelectedAddressInfo?._id,
        address: currentSelectedAddressInfo?.address,
        city: currentSelectedAddressInfo?.city,
        nearest_landmark: currentSelectedAddressInfo?.nearest_landmark,
        phone: currentSelectedAddressInfo?.phone,
      },
      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "cod",
      totalAmount: totalCartAmount + currentSelectedAddressInfo?.deliveryCharge
    };
    console.log("orderdata", orderData)
    const fullName = orderData?.addressInfo?.fullName;
    const firstName = fullName.split(" ")[0].toUpperCase();
    console.log("firstName", firstName)
    console.log("totala", orderData.totalAmount)
    setTimeout(() => {
      dispatch(createCodOrder(orderData)).then((data)=> {
        if(data.payload.success) {
          dispatch(sendSms({to: [orderData?.addressInfo?.phone], text:[`Dear ${firstName}, Thanks for your order at ${Store_Name}.Your order is confirmed and being processed. Reach us at stylemeofficial.com.`]}))
        }
      })
      navigate("/payment-success");
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="flex flex-col relative">
      {/* Show Skeleton if isLoading is true */}

      <div className="relative h-[150px] md:h-[200px] w-full overflow-hidden bg-black flex flex-col">
        <h1 className="text-white md:h-[25%] md:w-1/2 mx-auto text-center text-3xl md:text-4xl mt-4">
          Checkout Page
        </h1>
        <Separator className=" w-[50%] md:w-[35%] mx-auto opacity-65" />
        <p className="text-xs text-white/70 tracking-widest md:w-1/2 mx-auto text-center mt-2">
          Please review your item details carefully
        </p>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-[4fr_5fr] gap-5 mt-5 p-5 h-full">
        <div className=" md:sticky md:top-0 md:h-fit">
          <Accordion type="single" collapsible value={isOpen}>
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-[#F0F0F0] text-2xl md:text-3xl tracking-wide font-thin m-2 px-4">
                Cart Items
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 bg-[#F0F0F0] m-2 px-4">
                  {cartItems && cartItems.items
                    ? cartItems?.items?.map((item) => (
                        <UserCartItemsContent key={item.id} cartItem={item} />
                      ))
                    : null}
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-semibold">Rs{totalCartAmount}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-col">
          <Accordion type="multiple" value={["item-1"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger className=" bg-[#D0D0D0]  text-2xl md:text-3xl tracking-widest font-thin m-2 px-2">
                Billing Details
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <Address
                  setCurrentSelectedAddressInfo={setCurrentSelectedAddressInfo}
                  selectedId={currentSelectedAddressInfo}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible value={isOpen}>
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-[#D0D0D0] text-2xl md:text-3xl tracking-wide font-thin m-2 px-4">
                Payment Methods
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 w-full flex h-[100px] justify-around">
                  {/* <Button
                    onClick={handleInitiatePaypalPayment}
                    className={` w-full bg-[#F0F0F0]/80 text-black {${isPayPalPaymentStart} ? bg-[#F0F0F0]/50 :  bg-[#F0F0F0]}`}
                    disabled={isPayPalPaymentStart}
                  >
                    {isPayPalPaymentStart
                      ? "Payment Processing..."
                      : " Checkout with Paypal"}
                  </Button> */}

                  {/* <Button
                    onClick={handleInitiateEsewaPayment}
                    variant="outline"
                    className={`hover:scale-105 transition-all duration-200 w-2/3 h-[80px] m-4  bg-[#F0F0F0]/80 text-black ${isEsewaPaymentStart} ? bg-[#F0F0F0]/20 :  bg-[#F0F0F0] text-muted-foreground`}
                    disabled={isEsewaPaymentStart}
                  >
                    {isEsewaPaymentStart
                      ? "Payment Processing..."
                      : <img className="w-1/3" src={esewa}></img>}
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button
                  variant="outline"
                    
                    className={`hover:scale-105 transition-all duration-200 w-full h-[80px] m-4 text-black ${
                      isLoading ? "bg-[#F0F0F0]/90" : "bg-[#F0F0F0]"
                    } relative`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
                    ) : (
                      <h1 className=" font-semibold text-xl md:text-2xl text-green-600">Cash on Delivery</h1>
                    )}
                  </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Click Proceed to place order</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className="font-xs md:font-sm">Review your items to avoid exchanges😊</AlertDialogDescription>
                        <AlertDialogFooter>
                        <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-300 rounded-sm p-1" >Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCodPayment} className="bg-green-500 text-white hover:bg-green-300 rounded-sm p-1 mr-1" >Proceed</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                 
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
