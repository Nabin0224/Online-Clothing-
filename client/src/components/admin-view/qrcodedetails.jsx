import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsForAdmin } from "../../../store/admin/order-slice/index";
import { Separator } from "../ui/separator";
import { useParams } from "react-router-dom";

const QrCodeDetails = () => {
  const dispatch = useDispatch();
  const { orderDetails } = useSelector((state) => state.adminOrders);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailsForAdmin(id));
    }
  }, [dispatch, id]);

  console.log("orderDetails in qr", orderDetails);

  if (!orderDetails) {
    return <p>No order details found.</p>;
  }

  return (
    <div className="">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <ul className="grid gap-3">
            {orderDetails.cartItem && orderDetails.cartItem.length > 0 ? (
              orderDetails.cartItem.map((item) => (
                <li key={item.title} className="flex flex-col gap-2">
                  <span className="mb-16">
                    <img src={item.image[0]} alt={item.title} />
                  </span>
                  <div className="font-medium text-xl mb-2">Order Details</div>
                  <span>{item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Color: {item.color}</span>
                </li>
              ))
            ) : (
              <p>No items in the cart.</p>
            )}
          </ul>
        </div>
        <Separator className="bg-black/30 mb-8" />
        <div className="grid">
          <div className="font-medium text-xl mb-4">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground items-center">
            <span>{orderDetails.addressInfo?.fullName}</span>
            <span>{orderDetails.addressInfo?.address}</span>
            <span>{orderDetails.addressInfo?.city}</span>
            <span>{orderDetails.addressInfo?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeDetails;