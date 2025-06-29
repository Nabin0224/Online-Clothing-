import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import { captureOrder } from '../../../store/shop/order-slice/index';

const PayPalReturnPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID"); 

    useEffect(() => {
      if(paymentId && payerId) {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"))
        
        dispatch(captureOrder({payerId, paymentId, orderId})).then((data)=> {
          if(data?.payload?.success){
            sessionStorage.removeItem('currentOrderId')
            window.location.href = '/payment-success'
          }
        })
      }
      
    }, [payerId, payerId, dispatch])
    
    return (
    <div className='text-3xl content-center'>Processing Payment....Please wait!</div>
  )
}

export default PayPalReturnPage