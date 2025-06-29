import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddressInfo,
  selectedId,
}) => {
  
  return (
    <Card
    onClick={
      setCurrentSelectedAddressInfo
      ? () => setCurrentSelectedAddressInfo(addressInfo)
      : null
    }
    className={`cursor-pointer ${selectedId?._id === addressInfo?._id ? 'border-blue-300 border-[2px]' : 'border-black' } `}
    >
      <CardContent className="grid gap-4 mt-2">
        <Label>Full Name: {addressInfo?.fullName}</Label>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Nearest Landmark: {addressInfo?.nearest_landmark}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
