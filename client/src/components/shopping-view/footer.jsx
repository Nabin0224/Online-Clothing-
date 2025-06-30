import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Mail, Phone } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { toast,  useToast } from "@/hooks/use-toast";
import { Store_Name } from "../../utils/constants/storeConstants";


const ShoppingFooter = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? {
            category: [menuItem.id],
          }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${menuItem.id}`))
      : setTimeout(() => {
          navigate(menuItem.path);
        }, 1000);
  }
  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue) {
      setMessage("Please enter your email!");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/subscribe/getSubscribed`, {
        email: inputValue,
      });
      console.log("response of subscribe", response)
      if (response?.data?.success) {
        toast({
          title: response?.data?.message,
          duration: 2000,
        });
        setInputValue("");
      } else{
        toast({
          title : response?.data?.message,
          duration: 2000
        })
      }
    } catch (error) {
      console.error("Subscribe error", error);
    }
  };

  return (
    <div className="flex flex-col w-full  bg-black max-h-full border-t">
      <div className="h-[30%] flex flex-col md:flex-row w-full justify-between gap-2 ">
        <h1 className="text-white/90 font-semibold md:font-thin text-4xl md:text-6xl  mx-auto md:mx-16 tracking-widest my-4 md:my-12 ">
          {Store_Name}
        </h1>
        <div className="w-full md:w-1/2 relative flex  justify-center">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <span>
              <Input
                type="email"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="focus:outline focus:outline-4 focus:outline-blue-500 text-white md:absolute md:bottom-8 md:right-24 w-full md:w-[75%] md:h-10"
              />
            </span>
            <span>
              <Button
              
                variant="outline"
                type="submit"
                className=" w-full  md:w-[25%] md:absolute md:bottom-8 md:right-10 md:rounded-none md:h-10"
              >
                SUBSCRIBE
              </Button>
            </span>
          </form>
        </div>
      </div>
      <Separator className="w-[90%] md:w-[95%] mx-auto opacity-65 mb-4 mt-4" />
      <div className="grid sm:grid-cols-1 md:grid-cols-4  gap-8 md:gap-4 h-full mx-8 md:mt-6 md:mx-8">
        <div className="text-white flex flex-col gap-3">
          <h3 className="text-2xl font-light mb-1 md:mb-2">Get Connected</h3>
          <div className="flex gap-2 mx-4 text-white/80 cursor-pointer text-xs md:text-sm">
            <span>
              <Phone />
            </span>
            <p className="font-light">9864782899</p>
          </div>
          <div className="flex gap-2 mx-4 text-white/80">
            <span>
              <Mail />
            </span>
            <p className="font-light text-xs md:text-sm">
              stylemeofficial.np@gmail.com
            </p>
          </div>
        </div>
        <div className="text-white flex flex-col gap-3">
          <h3 className="text-2xl font-light mb-1  md:mb-2">Quick Links</h3>
          <div className="flex gap-2 mx-4 text-white/80 text-xs">
            <p className="font-light md:text-sm">{Store_Name}</p>
          </div>
          <div className="flex gap-2 mx-4 text-white/80 text-xs">
            <p className="font-light md:text-sm">Contact Us</p>
          </div>
        </div>
        <div className="text-white flex flex-col gap-3 cursor-pointer">
          <h3 className="text-2xl font-light mb:1 md:mb-2">Shop Now</h3>
          {shoppingViewHeaderMenuItems.map((menuItem) => (
            <div className="flex gap-2 mx-4 text-white/80 text-xs md:text-sm">
              <p
                onClick={() => handleNavigate(menuItem)}
                key={menuItem.id}
                className="font-light"
              >
                {menuItem.label}
              </p>
            </div>
          ))}
        </div>
        <div className="text-white flex flex-col gap-3 cursor-pointer">
          <h3 className="text-2xl font-light nb:1 md:mb-2">Legals</h3>
          {/* <div className="flex gap-2 mx-4 text-white/80">
            <p className="font-light text-xs md:text-sm">Privacy Policy</p>
          </div>
          <div className="flex gap-2 mx-4 text-white/80">
            <p className="font-light text-xs md:text-sm">Shipping Policy</p>
          </div> */}
          <div className="flex gap-2 mx-4 text-white/80"
          onClick={() => navigate("/legal")

          }
          >
            <p className="font-light text-xs md:text-sm">
              Exchange and Refunds
            </p>
          </div>
          {/* <div className="flex gap-2 mx-4 text-white/80">
            <p className="font-light text-xs md:text-sm">
              Terms and Conditions
            </p>
          </div> */}
        </div>
      </div>
      <Separator className="w-[90%] md:w-[95%] mx-auto opacity-75 mt-4 mb-1" />
      <div className="text-white/80 w-full">
        <p className=" text-center mx-auto md:mx-[525px] font-extralight text-xs">
          COPYRIGHT © 2025 {Store_Name} | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default ShoppingFooter;
