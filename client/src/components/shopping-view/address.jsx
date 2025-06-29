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
import { current } from "@reduxjs/toolkit";
import { useToast } from "@/hooks/use-toast";


const Address = ({setCurrentSelectedAddressInfo, selectedId}) => {
 
  const initialAddressFormData = {
    fullName: "",
    city: "",
    address: "",
    nearest_landmark: "",
    phone: "",
    deliveryCharge: ""
  };
  
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shoppingAddress);
  const [currentEditedId, SetCurrentEditedId] = useState(null);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if(currentEditedId === null)
 {   if( addressList.length >= 2 ){
    toast({
      title: "Max 2 addresses can be added!",
      variant: "destructive",
      duration: 2000,
    })
    return;
  }
}
  
    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id));
            setFormData(initialAddressFormData);
            SetCurrentEditedId(null);
            
          }
        })
      :  dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id)).then((data)=> {
              const latest = data.payload.data;
              const lastAddress = latest?.[latest.length-1];
              console.log("payload", latest)
              if(latest) {
                setCurrentSelectedAddressInfo(lastAddress);
              }
            })
            setFormData(initialAddressFormData);
          }
        });
  }

  function isFormValid() {
    return Object.values(formData).every(
      (value) => value && value.toString().trim() !== ""
    );
  }

  function handleDeleteAddress(getCurrentAddressId) {
    dispatch(
      deleteAddress({ userId: user.id, addressId: getCurrentAddressId._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
      }
    });
  }

  function handleEditAddress(getCurrentAddressId) {
    SetCurrentEditedId(getCurrentAddressId?._id);
    setFormData({
      ...formData,
      fullName: getCurrentAddressId?.fullName,
      address: getCurrentAddressId?.address,
      city: getCurrentAddressId?.city,
      nearest_landmark: getCurrentAddressId?.nearest_landmark,
      phone: getCurrentAddressId?.phone,
    });
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid grid- cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((addressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={addressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddressInfo={setCurrentSelectedAddressInfo}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {/* {" "}
          {currentEditedId !== null ? "Edit Address" : "Add New Address"} */}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${currentEditedId === null && selectedId !== null ? 'hidden' : 'block'}`}>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Save" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
          // setCurrentSelectedAddressInfo={setCurrentSelectedAddressInfo}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
