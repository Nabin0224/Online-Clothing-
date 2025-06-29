import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Links } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkGoogleAuth, loginUser } from "../../../store/auth-slice/index"

import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const AuthLogin = () => {

const [isStart, setIsStart] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();


useEffect(() => {
  if (localStorage.getItem("oauthStarted")) {
    dispatch(checkGoogleAuth());
    localStorage.removeItem("oauthStarted"); // Cleanup after check
  }
}, [dispatch]);
 
  
  // };
  function handleGoogleLogin() {
    localStorage.setItem("oauthStarted", "true"); // Mark that OAuth started
    window.location.href = `${import.meta.env.VITE_API_URL}/api/google/google`;
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const {toast} = useToast();
  const onSubmit = (data) => {

  dispatch(loginUser(data)).then((data) => {
    
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          duration: 2000,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  )}
      
  

  return (
    <div className="logForm w-2/3 mx-auto max-h-screen">
      <div className="text-center">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-bold tracking-tight text-center">
          Create a New Account
        </h1>
        <p className="mb-2 mt-1 text-sm text-gray-800">
  Don't have an account?{" "}
  <Link
    className="font-semibold underline text-slate-500 transition-all duration-300 hover:text-slate-800 hover:underline"
    to="/auth/register"
  >
    Sign Up
  </Link>
</p>
{/* 
        <p className="mb-2 mt-1 font-light">
          Don't have an account
          <Link className="font-medium hover:underline" to="/auth/register">
            {" "}
            Register
          </Link>
        </p> */}
        <form onSubmit={handleSubmit(onSubmit)} action="">
          <div className="flex flex-col gap-3 relative">
            <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2  mt-6 border-b-2"
                        onClick={(e)=>{
                          e.preventDefault();
                          handleGoogleLogin()
                        }}
                      >
                        <FcGoogle size={20} /> Continue with Google
                      </Button>
            
                      {/* <div className="relative text-center">
                        <span className=" bg-white px-2 text-sm text-gray-500 ">or</span>
                      </div>
            <input
              className="border-2 border-black/75 rounded-md"
              type="email"
              placeholder="email"
              {...register("email", {
                required: { value: true, message: "This filed is required" },
                minLength: { value: 7, message: "Minimum length is 7" },
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}

            <input
              className="border-2 border-black/75 rounded-md"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 4, message: "Minimum lenght is 4" },
                maxLength: { value: 10, message: "Maximum lenght is 10" },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
            <input
              className="w-full border-2 rounded-lg bg-black text-white mx-auto"
              type="submit"
              value="Login"
            /> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
