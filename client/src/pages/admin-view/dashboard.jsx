import React, { useEffect, useState } from "react";
import ProductTmageUpload from "./image-upload";
import {
  Bluetooth,
  PackageCheck,
  TrendingDownIcon,
  TrendingUp,
  TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatureImages,
  deleteFeatureImages,
  getFeatureImages,
} from "../../../store/common/index";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Chart from "./chart";
import { fetchDailyOrders } from "../../../store/admin/data-slice/index";

const AdminDashboard = () => {
  const {
      orderList,
      orderDetails,
      resetOrderDetails,
      totalOrders,
      totalPages,
    } = useSelector((state) => state.adminOrders);
  const { featureImagesList } = useSelector((state) => state.featureImage);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  // const [currentEditedId, setCurrentEditedId] = useState(null);
  const { dailyOrders } = useSelector((state) => state.ordersData);

  const dispatch = useDispatch();

  function handleUpload() {
    dispatch(addFeatureImages(uploadedImageUrls)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFiles([]);
        setUploadedImageUrls([]);
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchDailyOrders());
  }, [dispatch]);

  const orders =
    dailyOrders && dailyOrders?.length > 0
      ? dailyOrders[dailyOrders.length - 1]
      : 0;

  const totalOrder = orders.totalOrders;
  console.log("totalOrder", totalOrder);

  function handleDeleteImage(id) {
    dispatch(deleteFeatureImages(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Feature image deleted",
          variant: "destructive",
          duration: "1500",
        });
      }
    });
  }

  const lastTwoDays = dailyOrders && dailyOrders.slice(-2);
  console.log(lastTwoDays, "last");
  const percent =
    lastTwoDays && lastTwoDays.length > 0
      ? (lastTwoDays[1]?.totalOrders - lastTwoDays[0]?.totalOrders) *
        (lastTwoDays[0]?.totalOrders / 100)
      : 0;
  console.log(percent);
  const growthColorClass = percent < 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="flex flex-col min-h-screen overflow-auto p-1 m-1 md:p-4 md:m-4 max-w-screen-xl mx-auto ">
      <div className="mb-8">
        <h1 className="text-center font-semibold md:font-bold text-2xl md:text-3xl">
          Order Summary
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Total Orders Box */}
          <div className="bg-blue-100 shadow-md rounded-lg p-6 text-center text-gray-800 flex flex-col items-center hover:scale-105 hover:shadow-lg transition-all duration-300">
            <PackageCheck size={40} className="text-blue-500 mb-2" />
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-4xl font-bold">{totalOrder}</p>
          </div>
          
          {/* Growth Box */}
          <div className="bg-gray-100 shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300">
            {/* Trending Icon */}
            <TrendingUpIcon
              size={40}
              className={`${growthColorClass} mx-auto mb-2`}
            />

            <h2 className="text-lg font-semibold">Growth</h2>

            <div className="flex items-center justify-center gap-2">
              {/* Arrow Icon for Growth */}
              {percent >= 0 ? (
                <TrendingUp size={24} className={growthColorClass} />
              ) : (
                <TrendingDownIcon size={24} className="text-red-500" />
              )}

              {/* Percentage Change */}
              <p className={`text-3xl font-bold ${growthColorClass}`}>
                {percent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-8"></Separator>
      <div className="Analytics">
        <h1 className="font-semibold md:bold text-xl md:text-2xl h-full text-center">
          Analytics
        </h1>
        <Chart />
      </div>
      <Separator className="m-8"></Separator>
      <div className="min-w-full">
        <h1 className="font-semibold md:font-bold  text-xl md:text-3xl text-center mb-4">
          Feature Banner
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-10 p-2 border-b min-h-[220px]">
          <div className="flex gap-4 mt-5 flex-wrap">
            {featureImagesList && featureImagesList.length > 0
              ? featureImagesList.map((item) => (
                  <div className="relative">
                    <img
                      src={item?.image}
                      className="w-full h-[150px] md:h-[200px] object-cover rounded-t-lg aspect-square"
                    />
                    <Button
                      className="mt-1 h-8"
                      variant="destructive"
                      onClick={() => handleDeleteImage(item?._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              : null}
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 border-l-2 px-4 md:px-6 w-full max-w-xs md:max-w-md ">
              <ProductTmageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
              />
            </div>
            <div className="flex items-center">
              <Button
                onClick={() => handleUpload()}
                className=" w-full sm: w2/3 md:w-1/2 ld:w-1/3 mx-auto"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
