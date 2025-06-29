import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect } from "react";
import { sortOptions } from "@/config/index";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice/index";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProducttile from "./product-tile";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductDetailsDialogue from "./product-details";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice/index";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsPage from "./product-details";

function ShoppingListing() {
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );

  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialouge, setOpenDetailsDialouge] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { toast } = useToast();
 
  const categorySearchParams = searchParams.get("category");

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (key && value && Array.isArray(value) && value.length > 0) {
        const paramsValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`);
      }
    }
    return queryParams.join("&");
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    if (!getSectionId || !getCurrentOption) return;

    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    cpyFilters = Object.fromEntries(
      Object.entries(cpyFilters).filter(
        ([key, value]) => key && value.length > 0
      )
    );

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if(!user) {
      toast({
        title: "Please Login to procedd",
        variant: "destructive"
      })
      return;
    }
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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => key && value.length > 0
        )
      );
      dispatch(
        fetchAllFilteredProducts({
          filterParams: sanitizedFilters,
          sortParams: sort,
        })
      );
    }
  }, [dispatch, sort, filters]);

 

  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <div className="hidden md:block">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>
      <div className="bg-background w-full rounded-lg shadow-lg">
        <div className="p-4 border-b flex item-center justify-between">
          <h2 className="text-sm  md:text-lg font-extrabold">All Products</h2>
          <div className="flex item-center gap-4 justify-center">
            <div className="hidden md:block text-sm font-extralight text-muted-foreground content-center">
              {productList.length} Products
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDown size="icon" /> Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 p-4 md:p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProducttile
                  handleGetProductDetails={handleGetProductDetails}
                  key={productItem.title}
                  setOpen={setOpenDetailsDialouge}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
