import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut, ScanQrCode } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { logOut } from "../../../store/auth-slice/index";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Dispatch logout action
    await dispatch(logOut());

    // Redirect to the login or register page
    navigate("/");
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 ">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="logout flex flex-1 justify-end gap-4">
          <ScanQrCode size={35} onClick={() => navigate("/admin/scanqrcode")} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="inline-flex px-4 py-3 rounded-md text-sm font-medium">
                <LogOut />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-semibold text-xl mb-2">
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground text-sm">
                  
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-500 text-white hover:bg-gray-700 rounded-sm p-1 mr-1">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 rounded-sm p-1"
                  onClick={handleLogout}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
