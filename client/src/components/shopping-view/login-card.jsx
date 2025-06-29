import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { checkGoogleAuth, loginUser, registerUser } from "../../../store/auth-slice/index";



export default function AuthPopup({isLogin, setIsLogin, triggerButton}) {
  // const { user } = useSelector(state => state.auth)
  const [isStart, setIsStart] = useState(false)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);



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

  
  // custom login 
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    !isLogin
      ? dispatch(registerUser(data)).then((data) => {
        
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
            duration: 2000,
          });
          setTimeout(() => {
            dispatch(
              loginUser({email:data?.payload?.user?.email, password:data?.payload?.user?.password}),
            ).then((data) => {
              if (data?.payload?.success) {
                toast({ title: data.payload.message, duration: 2000, });
              } 
              else {
                toast({ title: "Auto login failed!", variant: "destructive", duration: 2000, });
              }
            });
          }, 1500);
          
          } else {
            toast({
              title: data?.payload?.message,
              variant: "destructive",
              duration: 2000,
            });
          }
        })
      : dispatch(loginUser(data)).then((data) => {
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
        });
  };

  return (
    
     
        <>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              {isLogin ? "Login to Your Account" : "Create an Account"}
            </DialogTitle>

          </DialogHeader>

          {/* Google Sign-In Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-4 border-b-2"
            onClick={()=> handleGoogleLogin()}
          >
            <FcGoogle size={20} /> Continue with Google
          </Button>

          {/* <div className="relative text-center">
            <span className="bg-white px-2 text-sm text-gray-500">or</span>
          </div> */}

          {/* Email & Password Fields */}
          {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder="Username"
                type="text"
                {...register("username", {
                  required: { value: true, message: "This field is required" },
                  minLength: { value: 4, message: "Minimum length must be 4" },
                })}
              />
            )}
            <Input
              placeholder="Email"
              type="email"
              {...register("email", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 7, message: "Minimum length is 7" },
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}
            <Input
              placeholder="Password"
              type="password"
              {...register("password", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 4, message: "Minimum lenght is 4" },
                maxLength: { value: 10, message: "Maximum lenght is 10" },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)
                
              }
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p> */}
     
    </>
  );
}
