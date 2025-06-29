import React from "react";
import acc from "../../assets/category/accountImage/acc.jpg";
import { Tabs, TabsList } from "@radix-ui/react-tabs";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/order";

const ShoppingAccount = () => {
  return (
    <div className="flex flex-col">
      <div className="relative w-full md:h-[350px] object-cover overflow-hiddenn hidden">
        <img
          src={acc}
          alt=""
          width={"1600"}
          height={"300"}
          style={{ aspectRatio: "1600/450" }}
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-lg">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders"> <ShoppingOrders/> </TabsContent>
            <TabsContent value="address"> <Address/> </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
