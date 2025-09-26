import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import QRCode from "react-qr-code";
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
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Search,
  Trash2,
} from "lucide-react";
import {
  deleteCustomOrder,
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
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import axios from "axios";
import { getSearchOrders } from "../../../store/shop/search-slice/index";
import { Input } from "../ui/input";

const AdminOrdersView = () => {
  const [isOrderDispatched, setIsOrderDispatched] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { searchResults, searchOrders } = useSelector(
    (state) => state.shoppingSearch
  );
  const [search, setSearch] = useState("");
  const [cargoOrders, setCargoOrders] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderList, orderDetails, totalPages } = useSelector(
    (state) => state.adminOrders
  );

  // fetch cargo orders
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/cargoOrders/get`)
      .then((response) => {
        setCargoOrders(response.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin(currentPage));
  }, [dispatch, currentPage]);

  const handleFetchOrderDetails = async (getId) => {
    sessionStorage.setItem("orderDetailsId", getId);
    await dispatch(getOrderDetailsForAdmin(getId));
  };

  const handleBulkStatusChange = async () => {
    if (selectedOrders.length === 0) {
      toast({ title: "No orders selected", duration: 2000 });
      return;
    }

    const updatePromises = selectedOrders.map((id) =>
      dispatch(getUpdatedOrderStatus({ id, status: "dispatched" }))
    );

    Promise.all(updatePromises).then((responses) => {
      const success = responses.every((res) => res?.payload?.success);
      if (success) {
        toast({
          title: "All selected orders dispatched successfully",
          duration: 2000,
        });
        dispatch(getAllOrdersForAdmin());
      } else {
        toast({ title: "Failed to update some orders", duration: 2000 });
      }
    });
  };

  const handleOrderStatusChange = (id, status) => {
    dispatch(getUpdatedOrderStatus({ id, status })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Order Status Updated successfully", duration: 2000 });
        dispatch(getAllOrdersForAdmin());
      }
    });
  };

  const handleDeleteCustomOrder = async (id) => {
    dispatch(deleteCustomOrder(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersForAdmin());
        toast({ title: "Order deleted successfully", duration: 2000 });
      }
    });
  };

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const handleBulkPrint = useReactToPrint({ contentRef });

  const [selectAll, setSelectAll] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orderList.map((order) => order?._id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (getId, event, index) => {
    let updatedSelectedOrders = [...selectedOrders];

    if (event.shiftKey && lastChecked !== null) {
      const start = Math.min(lastChecked, index);
      const end = Math.max(lastChecked, index);
      const idsInRange = orderList.slice(start, end + 1).map((o) => o._id);

      if (selectedOrders.includes(getId)) {
        updatedSelectedOrders = updatedSelectedOrders.filter(
          (id) => !idsInRange.includes(id)
        );
      } else {
        updatedSelectedOrders = Array.from(
          new Set([...updatedSelectedOrders, ...idsInRange])
        );
      }
    } else {
      if (updatedSelectedOrders.includes(getId)) {
        updatedSelectedOrders = updatedSelectedOrders.filter(
          (id) => id !== getId
        );
      } else {
        updatedSelectedOrders.push(getId);
      }
    }
    setSelectedOrders(updatedSelectedOrders);
    setLastChecked(index);
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
      dispatch(getSearchOrders(search));
    } catch (error) {
      console.log(error.message);
    }
  };

  // normalize phone numbers
  const normalizePhone = (phone) => {
    if (!phone) return "";
    let str = String(phone).trim();
    if (str.startsWith("+977")) {
      str = str.slice(4);
    }
    return str;
  };

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
        <form onSubmit={handleSubmit} className="w-full max-w-md mt-2">
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

        <Button className="mt-2" onClick={handleBulkPrint}>
          Print All
        </Button>
      </div>

      <Tabs defaultValue="Website Order" className="relative">
        <TabsList>
          <TabsTrigger value="Website Order">Website Order</TabsTrigger>
          <TabsTrigger value="Custom Order">Custom Order</TabsTrigger>
        </TabsList>

        <TabsContent value="Website Order">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="mb-4 md:mb-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Cargo Status</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(searchOrders && searchOrders.length > 0
                    ? searchOrders
                    : orderList
                  )?.map((item, index) => {
                    // match cargo order by phone
                    const matchedOrder = cargoOrders?.find((order) => {
                      const cargoPhone = normalizePhone(order?.receiver_phone);
                      const itemPhone = normalizePhone(item?.addressInfo?.phone);
                      return cargoPhone === itemPhone;
                    });

                    const statusText =
                      matchedOrder?.latest_status || "No Status";
                    const statusColor =
                      statusText.toLowerCase() === "delivered"
                        ? "bg-green-500"
                        : "bg-red-500";

                    return (
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
                          {item?.orderDate?.split(",")[0]}{" "}
                          <span className="text-muted-foreground">
                            {item?.orderDate?.split(",")[1]}
                          </span>
                        </TableCell>

                        <TableCell>
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
                        </TableCell>

                        <TableCell>
                          <Badge className={`py-1 px-3 ${statusColor}`}>
                            {statusText}
                          </Badge>
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
                            onOpenChange={() => setOpenDetailsDialog(false)}
                          >
                            <AdminOrderDetailsView orderDetails={orderDetails} />
                          </Dialog>

                          <Button
                            onClick={() => {
                              setOpenDetailsDialog(false);
                              handleFetchOrderDetails(item?._id);
                              setTimeout(() => handlePrint(), 0);
                            }}
                          >
                            Print
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() =>
                              navigate(`/admin/createorder/${item?._id}`)
                            }
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
                                  Order will be permanently deleted from
                                  database!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteCustomOrder(item?._id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-4">
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
        </TabsContent>

        <TabsContent value="Custom Order"> Blank </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrdersView;