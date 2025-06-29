import React, { useEffect } from 'react'
import { captureEsewaPayment, verifyEsewaPayment } from "../../../store/shop/esewa-slice/createorder";
import { useDispatch, useSelector } from 'react-redux';

const EsewaReturnPage = () => {

    const searchParams = new URLSearchParams(window.location.search);
    const encodedData = searchParams.get("data");
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.shoppingCart)
    
    console.log(encodedData,"encoded data")

    useEffect(() => {
        if(!encodedData) return ; 
      try {
        const decodedData = atob(encodedData);

         console.log("Decoded Data:", decodedData);

  
        dispatch(captureEsewaPayment({decodedData, cartId : cartItems?._id }))
          .then((response) => {
            console.log("Capture Payment Response:", response);
            
          })
          .catch((error) => {
            console.error("Error capturing payment:", error);
          }).then(()=>{
            dispatch(verifyEsewaPayment()).then((data)=>{
               if(data?.payload?.success){
                console.log(data?.payload)
                console.log(data, "final sucess")
               }
            })
          })
      } catch (error) {
        console.error("Error decoding data:", error);
      }
      }
    
    , [])
    
  return (
    <div className='text-3xl'>Processing Esewa Payment..... Please wait for a moment!</div>
  )
}

export default EsewaReturnPage