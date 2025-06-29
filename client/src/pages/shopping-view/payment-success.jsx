import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const formData  = useSelector(state => state.codOrders)
  console.log("form data in success", formData)
  
  function handleViewDetails() {
    navigate("/account")
  }

  return (
    <>
      <Card className="h-auto w-4/5 md:w-1/3 mx-auto border-2 border-gray-300 mt-4 md:mt-8 p-6   md:rounded-lg shadow-lg bg-white relative mb-2">
        <CardContent className="flex flex-col items-center gap-3">
          <div className="text-2xl md:text-3xl font-semibold text-green-600 mb-4">Payment Successful!</div>
          <div className="text-md md:text-lg font-light text-gray-600 mb-4 md:mb-6 px-2">
            Thank you for your purchase. Your payment was successfully processed.
          </div>
          <div className="text-sm text-gray-500 mb-4 font-extralight ">
            <strong>Order Summary:</strong><br />
            
            { formData?.formData?.cartItem && formData?.formData?.cartItem.length > 0  
            ?
             formData.formData.cartItem.map((item) => 
              <>
              - Items: {item.quantity}x {item.title} <br/>
              
              - Total: {item.price} <br/>
              </>
            ) : 
            null
          }<br />
            
            <span className='font-light' >- Delivery Time: 2-5 business days</span>
          </div>
          <div className="text-sm tracking-tighter text-gray-500 mb-4 w-full px-4 mt-6">
            Need help? Customer support at stylemeofficial.np@gmail.com
          </div>
          <Button 
            onClick={handleViewDetails} 
            className="absolute bottom-2 w-32 p-2 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200">
            View Details
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default PaymentSuccessPage