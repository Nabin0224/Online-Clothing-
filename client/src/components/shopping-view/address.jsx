import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "@/pages/common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "../../../store/shop/address-slice/index";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

// ✅ utility: get or create guestId
function getOrCreateGuestId() {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}

const Address = ({ setCurrentSelectedAddressInfo, selectedId }) => {
  const initialAddressFormData = {
    fullName: "",
    city: "",
    address: "",
    nearest_landmark: "",
    phone: "",
    deliveryCharge: "",
  };

  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, SetCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shoppingAddress);
  const { toast } = useToast();

  const guestId = !user?.id ? getOrCreateGuestId() : null;

  // add/edit address
  function handleManageAddress(event) {
    event.preventDefault();

    if (currentEditedId === null && addressList.length >= 2) {
      toast({
        title: "Max 2 addresses can be added!",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editAddress({
          userId: user?.id,
          guestId,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress({ userId: user?.id, guestId }));
          setFormData(initialAddressFormData);
          SetCurrentEditedId(null);
        }
      });
    } else {
      dispatch(
        addNewAddress({ userId: user?.id, guestId, formData })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress({ userId: user?.id, guestId })).then(
            (res) => {
              const latest = res.payload.data;
              const lastAddress = latest?.[latest.length - 1];
              if (lastAddress) {
                setCurrentSelectedAddressInfo(lastAddress);
              }
            }
          );
          setFormData(initialAddressFormData);
        }
      });
    }
  }

  function isFormValid() {
    return Object.values(formData).every(
      (value) => value && value.toString().trim() !== ""
    );
  }

  // delete address
  function handleDeleteAddress(address) {
    dispatch(
      deleteAddress({
        userId: user?.id,
        guestId,
        addressId: address._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress({ userId: user?.id, guestId }));
      }
    });
  }

  // edit address
  function handleEditAddress(address) {
    SetCurrentEditedId(address?._id);
    setFormData({
      fullName: address?.fullName,
      address: address?.address,
      city: address?.city,
      nearest_landmark: address?.nearest_landmark,
      phone: address?.phone,
      deliveryCharge: address?.deliveryCharge,
    });
  }

  useEffect(() => {
    dispatch(fetchAllAddress({ userId: user?.id, guestId }));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList?.length > 0 &&
          addressList.map((addressItem) => (
            <AddressCard
              key={addressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={addressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddressInfo={setCurrentSelectedAddressInfo}
            />
          ))}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`${
          currentEditedId === null && selectedId !== null ? "hidden" : "block"
        }`}
      >
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Save" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
