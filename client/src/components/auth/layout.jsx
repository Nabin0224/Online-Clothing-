import { Store_Name } from "../../utils/constants/storeConstants";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex justify-center items-center bg-black w-1/2">
        <div className="max-w-md text-center ">
          <h1 className="text-white text-4xl font-extrabold tracking-normal">
           Hey! Welcome to<br/>{Store_Name}
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
       </div>
    </div>
  );
};

export default AuthLayout;
