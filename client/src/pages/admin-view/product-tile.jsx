import { Button } from "@/components/ui/button";

import  { Card, CardContent, CardFooter }  from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function AdminProductTile({ product, handleDelete }) {
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="">
        <img
          src= {product.image[0]}
          alt={product.title} 
          className="w-full h-[300px] object-cover rounded-t-lg"
        />
      </div>
      <CardContent >
        <h2 className="text-xl font-bold mb-2">{product.title}</h2>
        <div className="flex justify-between mb-2 items-center">
          <span
            className={`${
              product?.salePrice > 0 && "line-through"
            } text-lg font-semibold text-primary`}
          >
            ₹{product.price}
          </span>
          <span className="text-lg font-semibold text-primary">
            ₹{product.salePrice}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button 
        onClick={() =>
          navigate(`/admin/addproduct/edit/${product._id}`, { state: { product } })
        }
        >Edit</Button>
        <Button onClick={()=>{
          handleDelete(product?._id)
        }}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
