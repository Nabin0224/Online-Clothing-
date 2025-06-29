import React from "react";
import { DialogContent } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const CustomProduct = ({ productList, setItems, items, setOpenProductDialog }) => {
  console.log("productList in custom product", productList)
  
  function handleCheckedChange(item, selectedColor) {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item._id && i.color === selectedColor.colorName
      );

      if (existingItem) {
        return prevItems.filter(
          (i) => !(i.productId === item._id && i.color === selectedColor.colorName)
        );
      } else {
        return [
          ...prevItems,
          {
            productId: item._id,
            title: item.title,
            image: item.image,
            price: item.price,
            quantity: 1,
            color: selectedColor.colorName,
          },
        ];
      }
    });
  }

  return (
    <div>
      <DialogContent className="">
      <h1 className="font-bold text-xl text-center" >All Products</h1>
      <Separator className=" bg-black opacity-25 mb-3"></Separator>
        <div className="relative grid grid-cols-[1fr_2fr] gap-6 overflow-y-auto max-h-[400px] mb-14">

          {productList && productList.length
            ? productList.map((item) => (
                <React.Fragment key={item._id}>
                  <div className="flex relative gap-2">
                    <img
                      className="overflow-hidden aspect-square"
                      height={70}
                      width={50}
                      src={item.image[0]}
                      alt={item.title}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <div className="flex gap-3 items-center">
                      {item.colors.map((colorItem) => {
                        const isChecked = items.some(
                          (i) => i.productId === item._id && i.color === colorItem.colorName
                        );

                        return (
                          <div key={colorItem.colorName} className="w-full">
                            <Checkbox
                              className="mt-4 mr-1"
                              checked={isChecked}
                              onCheckedChange={() => handleCheckedChange(item, colorItem)}
                            />
                            {colorItem.colorName}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ))
            : null}
        </div>
        <Separator className="absolute bottom-14 bg-black opacity-25 "></Separator>
        <Button
          className="absolute bottom-3 right-4 h-8 w-16"
          onClick={() => setOpenProductDialog(false)}
        >
          Save
        </Button>
      </DialogContent>
    </div>
  );
};

export default CustomProduct;