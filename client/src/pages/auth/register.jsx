import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { saveFormData } from "../../../store/form-slice/index";
import {checkGoogleAuth, registerUser} from "../../../store/auth-slice/index";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";


const AuthRegister = () => {
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
    formState: { errors },
  } = useForm();
  
  const {toast} = useToast();

  const navigate = useNavigate();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 

  const onSubmit = async (data) => {
    
        dispatch(registerUser(data)).then((data) => {

          
          if(data?.payload?.success) 
            {
              toast({
                title: data?.payload?.message,
                duration: 2000,
                

                

              }) 
              navigate('/auth/login')
            }  else{
              toast({
                title: data?.payload?.message,
                variant: 'destructive',
                duration: 2000,
              })

            }
        })
        }
    

  return (
    <div className="regForm w-2/3 mx-auto text-center max-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
        Sign up for an account
      </h1>
<p className="mb-2 mt-1 text-sm text-gray-800">
  Already have an account?{" "}
  <Link
    className="font-semibold underline text-slate-500 transition-all duration-300 hover:text-slate-800 hover:underline"
    to="/auth/login"
  >
    Login
  </Link>
</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
                      <Button
                                  variant="outline"
                                  className="w-full flex items-center justify-center gap-2 mt-6 border-b-2"
                                  onClick={(e)=>{
                                    e.preventDefault();
                                    handleGoogleLogin()
                                  }}
                                >
                                  <FcGoogle size={20} /> Continue with Google
                                </Button>
                      
                                {/* <div className="relative text-center">
                                  <span className=" bg-white px-2 text-sm text-gray-500 ">or</span>
                                </div> */}
          {/* <input
            className="border-2 border-black/75 rounded-md"
            type="text"
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "This field is required" },
              minLength: { value: 4, message: "Minimum length must be 4" },
            })}
          />
          {errors.username && <span>{errors.username.message}</span>} */}

          {/* <input
            className="border-2 border-black/75 rounded-md"
            type="text"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "This field is required" },
              minLength: { value: 7, message: "Min length is 7" },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}

          <input
            className="border-2 border-black/75 rounded-md"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "This field is required" },
              minLength: { value: 4, message: "Min length is 4" },
              maxLength: { value: 10, message: "Max length is 10" },
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}

          <input
            className="w-full border-2 rounded-lg bg-black text-white mx-auto"
            type="submit"
            value="Sign Up"
          /> */}
        </div>
      </form>
    </div>
  );
};


export default AuthRegister;