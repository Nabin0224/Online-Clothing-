import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { QRCode } from "react-qr-code"; // Correct import

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
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  getUpdatedOrderStatus,
} from "../../../store/admin/order-slice/index";
import AdminOrderDetailsView from "./order-details";
import { useReactToPrint } from "react-to-print";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowDown,
  ArrowDownNarrowWide,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Delete,
  DeleteIcon,
  Edit,
  LucideDelete,
  Search,
  Trash2,
} from "lucide-react";
import {
  deleteCustomOrder,
  updateCustomOrderStatus,
} from "../../../store/admin/order-slice/custom-order/index";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import {
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { getSearchOrders } from "../../../store/shop/search-slice/index";
import { Input } from "../ui/input";
import { Store_Name } from "../../utils/constants/storeConstants";

const AdminOrdersView = () => {
  const [isOrderDispatched, setIsOrderDispatched] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]); // For bulk print
  const { searchResults, searchOrders } = useSelector(
    (state) => state.shoppingSearch
  );
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    orderList,
    orderDetails,
    resetOrderDetails,
    totalOrders,
    totalPages,
  } = useSelector((state) => state.adminOrders);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(
    (getId) => {
      dispatch(getAllOrdersForAdmin(currentPage));
      dispatch(getOrderDetailsForAdmin(getId));
    },
    [dispatch, currentPage]
  );

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, []);

  const handleFetchOrderDetails = async (getId) => {
    sessionStorage.setItem("orderDetailsId", getId);
    await dispatch(getOrderDetailsForAdmin(getId));
  };

  const handleBulkStatusChange = async () => {
    if (selectedOrders.length === 0) {
      toast({ title: "No orders selected", duration: 2000 });
      return;
    }

    // Dispatch status update for each selected order
    const updatePromises = selectedOrders.map((id) =>
      dispatch(getUpdatedOrderStatus({ id, status: "dispatched" }))
    );

    // Wait for all updates to complete
    Promise.all(updatePromises).then((responses) => {
      const success = responses.every((res) => res?.payload?.success);
      if (success) {
        toast({
          title: "All selected orders dispatched successfully",
          duration: 2000,
        });
        dispatch(getAllOrdersForAdmin()); // Refresh order list
      } else {
        toast({ title: "Failed to update some orders", duration: 2000 });
      }
    });
  };

  // handle order status

  const handleOrderStatusChange = (id, status) => {
    dispatch(getUpdatedOrderStatus({ id, status: status })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Order Status Updated successfully",
          duration: 2000,
        });
        dispatch(getAllOrdersForAdmin());
      }
    });
  };

  // handle delete custom order?

  const handleDeleteCustomOrder = async (id) => {
    dispatch(deleteCustomOrder(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersForAdmin());
        toast({
          title: "Order deleted successfully",
          duration: 2000,
        });
      }
    });
  };

  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  // Bulk Print using reactToPrint
  const handleBulkPrint = useReactToPrint({
    contentRef,
  });

  const handleUpdateCustomOrder = async () => {};

  const BulkPrintableContent = ({ selectedOrders, orderList }, ref) => {
    const selectedOrderDetails = orderList.filter((order) =>
      selectedOrders.includes(order._id)
    );
    console.log("selectedOrderDetails", selectedOrderDetails);
    console.log("selectedOrderDetails", selectedOrderDetails);
    return (
      <div ref={contentRef} className="bg-white print:w-full">
        {selectedOrderDetails.length > 0 ? (
          selectedOrderDetails.map((order) => (
            <div
              key={order._id}
              className="w-full h-[100vh] p-12 flex flex-col justify-between border print:border-0 print:shadow-none print:page-break"
              style={{ pageBreakAfter: "always" }} // Ensures a new page for each order
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="text-5xl font-bold">{Store_Name}</h1>
                <h2 className="text-2xl font-semibold">Kathmandu</h2>
                <h2 className="text-2xl font-semibold">9864782899</h2>
              </div>

              {/* Order Information */}
              <div className="flex justify-between text-xl">
                <div>
                  <p className="font-medium text-2xl">Order Date:</p>
                  <p>{order?.orderDate?.split("T")[0]}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-4xl">COD Amount:</p>
                  <p className="text-4xl font-bold text-green-600">
                    {(order.paymentStatus && order.paymentStatus === "cod") ||
                    order.paymentStatus === "partially_paid"
                      ? `Rs ${order.totalAmount}`
                      : "PAID"}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Shipping Info & QR Code */}
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h3 className="font-medium text-4xl mb-6">Shipping Info</h3>
                  <p className="text-3xl mb-1">{order.addressInfo?.fullName}</p>
                  <p className="text-3xl mb-1">{order.addressInfo?.address}</p>
                  <p className="text-3xl mb-1">{order.addressInfo?.city}</p>
                  <p className="text-3xl mb-1">{order.addressInfo?.phone}</p>
                </div>
                <div className="flex justify-end">
                  <QRCode
                    value={`${window.location.origin}/admin/qrcodedetail/${order._id}`}
                    size={200}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Order Details */}
              <div>
                <h3 className="font-medium text-4xl mb-4">Order Details</h3>
                <table className="w-full border-collapse border text-left text-xl">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 border-r">Item</th>
                      <th className="p-4 border-r text-center">Quantity</th>
                      <th className="p-4 text-center">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItem?.map((item) => (
                      <tr key={item.title} className="border-b">
                        <td className="p-4 border-r text-2xl">{item.title}</td>
                        <td className="p-4 border-r text-center text-2xl">
                          {item.quantity}
                        </td>
                        <td className="p-4 text-center">{item.color}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl font-medium">
            No orders selected for printing.
          </p>
        )}
      </div>
    );
  };
  console.log("orderlsot", orderList);

  const [selectAll, setSelectAll] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  //handle select and deselect all

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]); //Deselect all orders
    } else {
      setSelectedOrders(orderList.map((order) => order?._id)); //Select all orders
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (getId, event, index) => {
    console.log("event", event.shiftKey);
    console.log("index", index);
    console.log("lastchecked", lastChecked);
    let updatedSelectedOrders = [...selectedOrders];
    console.log("updatedchecked before", updatedSelectedOrders);

    if (event.shiftKey && lastChecked !== null) {
      console.log("shift key pressed and lastchecked not null");
      const start = Math.min(lastChecked, index); // finding starting range
      const end = Math.max(lastChecked, index); // finding ending range

      // Get all order IDs within the range
      const idsInRange = orderList
        .slice(start, end + 1)
        .map((order) => order._id);
      console.log("idsInrange ok", idsInRange);

      // If the clicked item was already selected, deselect the range
      if (selectedOrders.includes(getId)) {
        updatedSelectedOrders = updatedSelectedOrders.filter(
          (id) => !idsInRange.includes(id)
        );
      } else {
        // Otherwise, select the range
        updatedSelectedOrders = Array.from(
          new Set([...updatedSelectedOrders, ...idsInRange])
        );
      }
    } else {
      console.log("shift key NOt pressed and lastchecked Is null");
      // Toggle single checkbox selection
      if (updatedSelectedOrders.includes(getId)) {
        updatedSelectedOrders = updatedSelectedOrders.filter(
          (id) => id !== getId
        );
      } else {
        updatedSelectedOrders.push(getId);
      }
    }
    console.log("updatedcheck afer", updatedSelectedOrders);
    setSelectedOrders(updatedSelectedOrders);
    setLastChecked(index); // Set the last checked index
  };

  useEffect(() => {
    if (orderList.length > 0) {
      setSelectAll(selectedOrders.length === orderList.length);
    }
  }, [selectedOrders, orderList]);

  const handleChange = async (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(getSearchOrders(search)).then((data) => {
        if (data.payload.success) {
          console.log(data.payload.message);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log("searchOrders", searchOrders);
  return (
    <div className="flex flex-col gap-2">
      <div className="createOrder flex justify-between">
        <Button
          className="bg-purple-600"
          onClick={() => navigate(`/admin/createorder`)}
        >
          Create Order
        </Button>
        <Button className="bg-green-600" onClick={handleBulkStatusChange}>
          Dispatch Orders
        </Button>
      </div>
      <div className="flex justify-between">
      <form onSubmit={handleSubmit} className="w-full max-w-md  mt-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by customer name, order ID, or phone..."
            value={search}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 bg-purple-600 text-white hover:bg-purple-700"
          >
            Search
          </Button>
        </div>
      </form>
     
        <Button className="mt-2" onClick={handleBulkPrint}>Print All</Button>
      </div>

      <Tabs defaultValue="Website Order" className="relative">
        <TabsList>
          <TabsTrigger value="Website Order">Website Order</TabsTrigger>
          <TabsTrigger value="Custom Order">Custom Order</TabsTrigger>
        </TabsList>
        <TabsContent value="Website Order">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="mb-4 md:mb-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input
                        className="shadow-md"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      ></input>
                    </TableHead>

                    <TableHead>Customer Name</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(searchOrders && searchOrders.length > 0
                    ? searchOrders
                    : orderList
                  )?.map((item, index) => (
                    <TableRow key={item?._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(item?._id)}
                          onClick={(event) =>
                            handleCheckboxChange(item?._id, event, index)
                          }
                        />
                      </TableCell>
                      <TableCell>{item?.addressInfo?.fullName}</TableCell>
                      <TableCell>
                        <span className="mr-3">
                          {" "}
                          {item?.orderDate?.split(",")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {item?.orderDate?.split(",")[1]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 md:gap-2">
                          <Badge
                            className={`py-1 px-3 ${
                              item?.orderStatus === "dispatched"
                                ? "bg-green-500"
                                : item?.orderStatus === "pending"
                                ? "bg-gray-400"
                                : "bg-black"
                            }`}
                          >
                            {item?.orderStatus}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <ChevronDown />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOrderStatusChange(
                                    item?._id,
                                    "dispatched"
                                  )
                                }
                              >
                                dispatched
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOrderStatusChange(item?._id, "pending")
                                }
                              >
                                pending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                      <TableCell>{item?.totalAmount}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          onClick={() => {
                            setOpenDetailsDialog(true);
                            handleFetchOrderDetails(item?._id);
                          }}
                        >
                          View Details
                        </Button>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            // dispatch(resetOrderDetails());
                          }}
                        >
                          <div>
                            <AdminOrderDetailsView
                              orderDetails={orderDetails}
                            />
                          </div>
                        </Dialog>
                        <Button
                          onClick={() => {
                            setOpenDetailsDialog(false);
                            handleFetchOrderDetails(item?._id);

                            setTimeout(() => handlePrint(), 0); // Ensure order details are loaded before printing
                          }}
                        >
                          Print
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleUpdateCustomOrder(item?._id);
                            navigate(`/admin/createorder/${item?._id}`);
                          }}
                        >
                          <Edit />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure to delete order?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-red-500">
                                order will be permanently deleted form database!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-500 text-white hover:bg-gray-700 rounded-sm p-1 mr-1">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700 rounded-sm p-1"
                                onClick={() => {
                                  handleDeleteCustomOrder(item?._id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex gap-4 absolute bottom-1 left-7">
                <Button
                  className="bg-green-600"
                  onClick={handleBulkStatusChange}
                >
                  Dispatch Orders
                </Button>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-4 absolute bottom-1 right-1">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <ChevronLeft /> Previous
                </Button>
                <span className="text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next <ChevronRight />
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* <div className="hidden">
        <PrintableContent contentRef={contentRef} />
      </div> */}
          <div className="hidden">
            <BulkPrintableContent
              contentRef={contentRef}
              selectedOrders={selectedOrders}
              orderList={orderList}
            />
          </div>
        </TabsContent>
        <TabsContent value="Custom Order"> Blank </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrdersView;
