"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Icons from "lucide-react";
import { Button } from "./button"; // Adjust path to your UI components
import { Input } from "./input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";
import { signinschema } from "@/lib/formschema";
import Link from "next/link";
import SignUpServerAction from "@/app/actions/signup";
import { Router, useRouter } from "next/navigation";

const Signinc = () => {
  let router = useRouter();
  const {
    register,
    handleSubmit,
    setError, // Add this
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signinschema),
    defaultValues: {
      name: "",
      Password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    let res = await SignUpServerAction(data);
    console.log(res);
    // Add your sign-in logic here
    if (!res.success) {
      setError("Password", {
        type: "manual",
        message: "Invalid name or password",
      });

      // Optional: Also highlight the name field in red
      setError("name", {
        type: "manual",
        message: "", // Leave message empty if you only want the text under password
      });
    }
    // Router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 shadow-2xl border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Icons.ShieldCheck className="text-white" size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Username
              </label>
              <div className="relative">
                <Icons.User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className={`pl-10 h-12 bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.name ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Icons.Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  type="password"
                  {...register("Password")}
                  placeholder="••••••••"
                  className={`pl-10 h-12 bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.Password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.Password && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.Password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icons.Loader2 className="mr-2 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <span className="relative px-4 bg-transparent text-sm text-gray-400">
              New here?
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 h-11 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Link href="/sign-Up">create account </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signinc;
