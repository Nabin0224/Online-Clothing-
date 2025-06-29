import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchAllProducts,
} from "../../../store/admin/product-slice/index";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";

const AdminProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const [productToDelete, setProductToDelete] = useState(null);

  function handleDelete() {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
        }
      });
      setProductToDelete(null);
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => navigate("/admin/addproduct")}>
          Add New Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Total Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-left">
          {productList && productList.length > 0 ? (
            productList.map((productItem, index) => (
              <TableRow key={productItem._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={productItem?.image[0]}
                    alt="Product"
                    className="h-12 w-12 object-cover"
                  />
                </TableCell>
                <TableCell>{productItem?.title}</TableCell>
                <TableCell>{productItem?.price}</TableCell>
                <TableCell>{productItem?.salePrice}</TableCell>
                <TableCell>{productItem?.totalStock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600"
                      onClick={() =>
                        navigate(`/admin/addproduct/edit/${productItem?._id}`, {
                          state: { productItem },
                        })
                      }
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setProductToDelete(productItem._id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-semibold text-xl mb-2" >
                            Are you sure you want to delete this product?
                          </AlertDialogTitle >
                          <AlertDialogDescription className="text-muted-foreground text-sm">
                            This action cannoted be undone. Product will be
                            permanently deleted from database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-500 text-white hover:bg-gray-700 rounded-sm p-1 mr-1"
                            onClick={() => setProductToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction  className="bg-red-600 text-white hover:bg-red-700 rounded-sm p-1" onClick={handleDelete}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" className="text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default AdminProducts;
