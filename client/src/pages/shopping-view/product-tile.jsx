import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 👈 import

const ShoppingProducttile = ({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  setOpen,
  direction = -100, // optional prop for zig-zag animation
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: direction }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
        <div
          onClick={() => {
            handleGetProductDetails(product?._id);
            navigate(`/product-detail/${product._id}`);
            setOpen(true);
          }}
        >
          <div className="relative">
            <img
              src={product?.image[0]}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
              loading="lazy"
            />
            {product?.totalStock === 0 ? (
              <Badge className="absolute top-[2px] left-[2px] bg-red-400 hover:bg-red-600">
                Out of Stock
              </Badge>
            ) : product?.totalStock <= 10 ? (
              <Badge className="absolute top-[2px] left-[2px] bg-red-400 hover:bg-red-600">
                {`Only ${product.totalStock} left`}
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge className="absolute top-[2px] left-[2px] bg-red-400 hover:bg-red-600">
                Sale
              </Badge>
            ) : null}
          </div>

          <CardContent className="p-2 md:p-4">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              {product?.title}
            </h2>
            <div className="flex justify-between items-center md:mb-2">
              <span className="text-sm text-muted-foreground">
                {product?.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {product?.brand}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1 md:mb-2">
              <span
                className={`${
                  product?.salePrice > 0 && "line-through"
                } text-sm md:text-lg font-semibold text-primary`}
              >
                ₹{product?.price}
              </span>
              {product?.salePrice > 0 && (
                <span className="text-sm md:text-lg font-semibold text-primary">
                  ₹{product?.salePrice}
                </span>
              )}
            </div>
          </CardContent>
        </div>

        <CardFooter className="relative w-full flex justify-center h-10">
          {product?.totalStock === 0 ? (
            <Button className="opacity-40 cursor-not-allowed absolute bottom-1 w-[90%] flex-grow">
              Out of Stock
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleAddtoCart(product?._id, product?.totalStock)
              }
              className="absolute bottom-1 w-[90%] flex-grow"
            >
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ShoppingProducttile;