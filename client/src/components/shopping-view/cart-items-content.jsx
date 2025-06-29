import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  deleteCartItems,
  updateCartQuantity,
} from "../../../store/shop/cart-slice/index";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  // const { cartItem } = useSelector(state => state.shoppingCart);
  const { productList } = useSelector((state) => state.shoppingProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  

  function handleDeleteCartItem(getCartItem) {
    
    dispatch(
      deleteCartItems({ userId: user?.id, productId: getCartItem.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item deleted successfully",
          // duration: 1500,
        });
      }
    });
  }
console.log("cartIte in cart", cartItem)
console.log("color in productList", productList)
  function handleCartQuantity(getCartItem, typeofAction) {
    const updatedQuantity =
      typeofAction === "plus"
        ? getCartItem?.quantity + 1
        : getCartItem?.quantity - 1;
  
    // If the action is "plus", make sure there's enough stock
    if (typeofAction === "plus") {
      const getCurrentProductIndex = productList.findIndex(
        (item) => item._id === getCartItem?.productId 
      );
      if (getCurrentProductIndex !== -1) {
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        if (updatedQuantity > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} items can be added`,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
      }
    }
  
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: updatedQuantity,
        color: getCartItem?.color
      })
    );
  }

  return (
    <div className="flex md:gap-1 items-center space-x-2 md:space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className=" w-24 h-[68px]  rounded-sm object-cover"
      />
      <div className="flex-1">
        <h3 className="font-normal md:font-bold">{cartItem?.title}</h3>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            onClick={() => handleCartQuantity(cartItem, "minus")}
            variant="outline"
            className="h-6 w-6 rounded-sm"
            size="icon"
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="w-4 h-4"  strokeWidth={0.8}/>
            <span className="sr-only">Decrease</span>
          </Button>
          <span className=" font-extralight md:font-semibold text-sm mt-1">
            {cartItem?.quantity}
          </span>
          <Button
            onClick={() => handleCartQuantity(cartItem, "plus")}
            variant="outline"
            className="h-6 w-6 rounded-sm"
            size="icon"
          >
            <Plus  style={{width: "12px", height: "12px"}} 
            strokeWidth={0.8}/>
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center">
        <p className="font-extralight text-xs">Color:</p>
      
        <div className='w-3 h-3 rounded-full' style ={{backgroundColor: cartItem?.color }}>
        </div>
        </div>
      
        <p className="text-sm md:text-md font-extralight">
          Rs
          {(
            (cartItem?.salePrice > 0
              ? cartItem?.salePrice
              : cartItem?.price) * cartItem?.quantity
          ).toFixed(0)}
        </p>
        <Trash  
          onClick={() => handleDeleteCartItem(cartItem)}
          className="mt-1 cursor-pointer w-5 "
          strokeWidth={0.9}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;