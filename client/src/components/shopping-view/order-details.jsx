

import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'




const ShoppingOrderDetailsView = ({orderDetails}) => {
    console.log("orderDetails in shop", orderDetails)
    const { user } = useSelector(state=> state.auth)
  return (
    <DialogContent >
    <div className="grid gap-6">
        <div className="grid gap-2">
            
            <div className="flex justify-between items-center mt-6">
                <p className="font-medium">Order Id</p>
                <Label>{orderDetails?.userId}</Label>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="font-medium">Order Date</p>
                <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="font-medium">Payment Method</p>
                <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="font-medium">Payment Status</p>
                <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="font-medium">Order Status</p>
                <Label>
                <Badge
                        className={`px-[8px] py-[2px] ${
                             orderDetails?.orderStatus === "confirmed" ? "bg-green-500" : orderDetails?.orderStatus === "rejected" ? "bg-red-600" : "bg-black"
                        }`}
                      >
                        
                    {orderDetails?.orderStatus}
                      </Badge>
                      </Label>
            </div>

        </div>
        <Separator/>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <div className="font-medium">Order Details</div>
            </div>
            <ul className='grid gap-3'>
                {
                    orderDetails?.cartItem && orderDetails?.cartItem.length > 0 ?
                    orderDetails?.cartItem.map((item)=> <li className='flex items-center justify-between'>
                        <span>{item.title}</span>
                        <span>x {item.quantity}</span>
                        <span>{item.price}</span>
                    </li>
                    ) : null
    
                }
                
            </ul>
        </div>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <div className="font-medium">Shipping Details</div>
                  <div className="grid gap-0.5 text-muted-foreground">
                    <span>{orderDetails?.addressInfo?.fullName}</span>
                    <span>{orderDetails?.addressInfo?.address}</span>
                    <span>{orderDetails?.addressInfo?.city}</span>
                    <span>{orderDetails?.addressInfo?.nearest_landmark}</span>
                    <span>{orderDetails?.addressInfo?.phone}</span>
                  </div>
            </div>
        </div>
        
    </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsView