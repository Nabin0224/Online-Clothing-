import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, resetSearchResult } from "../../../store/shop/search-slice/index";
import { useSearchParams } from "react-router-dom";
import ShoppingProducttile from "./product-tile";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "../../../store/shop/cart-slice/index";
import ProductDetailsDialogue from "./product-details";
import { fetchProductDetails } from "../../../store/shop/product-slice";

const SearchPage = () => {
 const [openDetailsDialouge, setOpenDetailsDialouge] = useState(false);
 const [open, setopen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shoppingSearch);
  const { productDetails } = useSelector(state=> state.shoppingProducts)
  const { cartItems } = useSelector(state=> state.shoppingCart)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 0) {
      const handler = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
    }, 1000);
    return () => clearTimeout(handler);
} else {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(resetSearchResult()) 
    }
    
  }, [keyword]);
  

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
     
      
     
  
      let getCartItems = cartItems.items || [];
      if(getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId);
         
        if(indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if(getQuantity +1 > getTotalStock){
            toast({
              title: `Only ${getQuantity} items can be added for this product`,
              variant: "destructive",
              duration: 2000,
            })
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
            duration: 2000,
          });
        }
      });
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
      }

  return (
    <div className="container mx-auto md:px-6 px-4 py-8 min-h-[60vh]">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search Products"
          />
        </div>
      </div>
      <div className="">search results</div>
      { 
        !searchResults.length &&  <h1 className="text-2xl font-bold">No items found</h1>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {
            
            searchResults.map(item=> <ShoppingProducttile handleGetProductDetails={handleGetProductDetails} handleAddtoCart={handleAddtoCart} product={item} setOpen={setOpenDetailsDialouge} />)
        }
      </div>
     
    </div>
  );
};

export default SearchPage;
