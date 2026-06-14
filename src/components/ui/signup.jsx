"use client";

import { useForm } from "react-hook-form";
import { Button } from "./button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@/lib/formschema";
import { SignInServeraction } from "@/app/actions/SignInServeraction";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

const SignupC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: { name: "", Email: "", Password: "" },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    await SignInServeraction(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          {/* Subtle Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full" />

          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 transform rotate-12">
            <ShieldCheck className="text-white -rotate-12" size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Join wealth
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Secure your financial future today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User
                className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                {...register("name")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Enter name"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                {...register("Email")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="name@email.com"
              />
            </div>
            {errors.Email && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.Email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="password"
                {...register("Password")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.Password && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.Password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Create Free Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupC;
