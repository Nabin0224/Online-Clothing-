import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import UserCartItemsContent from './cart-items-content';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@radix-ui/react-dropdown-menu';

const UserCartWrapper = ({cartItems, setOpenCartSheet, setOpenMobileCartSheet}) => {
    const  navigate = useNavigate();
    
    
    const totalCartAmount = 
    cartItems && cartItems.length > 0 ? 
    cartItems.reduce(
        (sum, currentItem) => 
             sum + (
        currentItem?.salePrice >  0 ? currentItem.salePrice : currentItem?.price
    ) * currentItem?.quantity, 0  )
    : 0


  return <SheetContent className = "w-2/3" >
        <SheetHeader>
            
            <SheetTitle>
                Your Cart
            </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
        <Separator className=" h-[1px] bg-black/35 mt-10"/>
        {
            cartItems && cartItems?.length > 0 ? 
            cartItems?.map((item) => <UserCartItemsContent  cartItem= {item}/> ) : null
        }
        </div>
        <Separator className=" h-[1px] bg-black/35 mt-14"/>
        <div className="mt-8 space-y-4">
            <div className="flex justify-between">
            <span className='font-bold'>Total</span>
            <span className="font-semibold">Rs{totalCartAmount}</span>
            </div>
        </div>
        <Button onClick={()=>{ navigate('/checkout'); setOpenCartSheet(false); setOpenMobileCartSheet(false)}} className="w-full mt-8 ">Checkout</Button>
        
    </SheetContent>
    
  
    
}

export default UserCartWrapper;