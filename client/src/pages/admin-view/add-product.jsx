import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
} from "../../../store/admin/product-slice";
import ProductImageUpload from "./image-upload";
import CommonForm from "../common/form";
import { Button } from "@/components/ui/button";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";

// Initial form data
const initialFormData = {
  image: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  colors: [],
};

const AddProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.productItem) {
      setFormData(state.productItem);
      setUploadedImageUrls(state.productItem.image || []);
    }
  }, [id, state]);
  

  function handleSubmitProduct (event) {
    event.preventDefault();
    console.log("formData in add product", formData)
    if (id) {
      const updatedFormData = {
        ...formData,
        image: [...uploadedImageUrls], // Ensure uploaded images are correctly added
        totalStock: formData.colors.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      };

      
      

       dispatch(editProduct({ id, formData: updatedFormData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          navigate("/admin/products");
          toast({
            title: "Product updated successfully",
            duration: 1500,
          });
          setFormData(initialFormData);
        }
      });
    } else {
      const updatedFormData = {
        ...formData,
        image: [...uploadedImageUrls], // Ensure uploaded images are included
        totalStock: formData.colors.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      };
      console.log("updatedFormData", updatedFormData)
      dispatch(addNewProduct(updatedFormData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setImageFiles([]);
          setUploadedImageUrls([]);
          setFormData(initialFormData);
          navigate("/admin/products")
          toast({
            title: "Product Successfully added",
            duration: 1500,
          });
        }
      });
    }
  }


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit Product" : "Add New Product"}
      </h1>
      <ProductImageUpload
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        uploadedImageUrls={uploadedImageUrls}
        setUploadedImageUrls={setUploadedImageUrls}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
      />
      <div className="py-6">
        <CommonForm
          formData={formData}
          setFormData={setFormData}
          formControls={addProductFormElements}
          buttonText={id ? "Save" : "Add"}
          onSubmit={handleSubmitProduct}
          
        />
      </div>
      <Button variant="outline" onClick={() => navigate("/admin/products")}>
        Cancel
      </Button>
    </div>
  );
};

export default AddProduct;
