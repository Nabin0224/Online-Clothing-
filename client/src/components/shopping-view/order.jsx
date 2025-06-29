import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from "../../../store/shop/order-slice/index";
import { Badge } from "../ui/badge";
import { getAllOrdersByUserOfEsewa, getOrderDetailsOfEsewa, resetOrderDetailsOfEsewa } from "../../../store/shop/esewa-slice/createorder";
import { getAllOrdersByUserOfCod, getOrderDetailsOfCod } from "../../../store/cod-slice/index";

const ShoppingOrders = () => {
  const { orderList, orderDetails } = useSelector(
    (state) => state.shoppingOrders
  );
  const { orderListOfEsewa, orderDetailsOfEsewa} = useSelector(state => state.esewaOrders) //eSewa
  const { orderListOfCod, orderDetailsOfCod } = useSelector(state => state.codOrders)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {

    dispatch(getOrderDetails(getId));
  }

  function handleFetchOrderDetailsOfEsewa(getId) {
    // console.log(getId, "ui")
    // dispatch(getAllOrdersByUserOfEsewa(user?.id)); 
    dispatch(getOrderDetailsOfEsewa(getId))
    
  }
  function handleFetchOrderDetailsOfCod(getId) {
    
    // dispatch(getAllOrdersByUserOfEsewa(user?.id)); 
    dispatch(getOrderDetailsOfCod(getId))
    
  }

  useEffect(() => {
    if (orderDetails || orderDetailsOfEsewa || orderDetailsOfCod) {
      setOpenDetailsDialog(true);
    } else {
      setOpenDetailsDialog(false);
    }
  }, [orderDetails, orderDetailsOfEsewa, orderDetailsOfCod]);

  useEffect(() => {
    if(user?.id)
    dispatch(getAllOrdersByUser(user?.id));
  }, [user?.id, dispatch]);

  useEffect(() => {
    if(user?.id)
 
    dispatch(getAllOrdersByUserOfEsewa(user?.id));
  }, [user?.id, dispatch]);

  useEffect(() => {
    if(user?.id)
    dispatch(getAllOrdersByUserOfCod(user?.id));
  }, [user?.id, dispatch]);

  


  

  const orders = [...orderList, ...orderListOfEsewa, ...orderListOfCod].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  

  const AllOrderDetials = orderDetails || orderDetailsOfEsewa || orderDetailsOfCod


  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0
              ? orders.map((item) => (
                  <TableRow >
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                       <Badge
                                     className={`py-1 px-3 ${
                                       item?.orderStatus === "confirmed"
                                         ? "bg-green-500"
                                         : item?.orderStatus === "rejected"
                                         ? "bg-red-600"
                                         : "bg-black"
                                     }`}
                                   >
                                     {item?.orderStatus}
                                   </Badge>
                    </TableCell>
                    <TableCell>{item.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                          dispatch(resetOrderDetailsOfEsewa())
                        }}
                      >
                        <Button
                          onClick={
                          
                            
                            () => { item?.paymentMethod === "eSewa" ?  handleFetchOrderDetailsOfEsewa(item?._id) :   item?.paymentMethod === "cod" ? handleFetchOrderDetailsOfCod(item?._id)   : handleFetchOrderDetails(item?._id) } 
                          
                        }
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={AllOrderDetials} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;

