"use client";
import { redirect, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { AccountSchema } from "@/lib/formschema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CreateAccount from "@/app/actions/createAccount";
const CreateAccountDrawer = ({ children }) => {
  // console.log("user at create ", user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      accountname: "",
      type: "",
      balance: 0,
      isDefault: false,
    },
  });

  const [open, setOpen] = React.useState(false);
  const [loading, setloading] = React.useState(false);

  const router = useRouter();
  const onSubmit = async (data) => {
    setloading(true);

    const res = await CreateAccount(data);
    setloading(false);
    setOpen(false);
    // Hard reload the page
    window.location.reload();
    // router.push("/dashboard")
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="z-50 bg-mainBg">
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
          <DrawerDescription>Fill in account details below.</DrawerDescription>
        </DrawerHeader>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 ">
          {/* Account Name */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="accname"
              className="text-sm bg-mainBg font-medium text-gray-700"
            >
              Account Name
            </label>
            <input
              type="text"
              id="accname"
              placeholder="Enter account name"
              {...register("accountname")}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                `}
            />
            {errors.accountname && (
              <p className="text-sm text-red-500">
                {errors.accountname.message}{" "}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="accountType"
              className="text-sm font-medium text-gray-700"
            >
              Select Account Type
            </label>

            <Select onValueChange={(value) => setValue("type", value)}>
              <SelectTrigger
                id="accountType"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <SelectValue placeholder="Choose account type..." />
              </SelectTrigger>
              <SelectContent className="bg-mainBg">
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Initial Balance */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="balance"
              className="text-sm font-medium text-gray-700"
            >
              Initial Balance
            </label>
            <input
              type="number"
              step="0.01"
              id="balance"
              placeholder="Enter initial balance"
              {...register("balance")}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                  `}
            />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
          </div>

          {/* isDefault */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700"
            >
              Set as Default Account?
            </label>

            <Select
              onValueChange={(value) =>
                setValue("isDefault", value === "true" ? true : false)
              }
            >
              <SelectTrigger
                id="isDefault"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent className="bg-mainBg">
                <SelectGroup>
                  <SelectLabel>Default</SelectLabel>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DrawerFooter>
            <Button
              type="submit"
              className="bg-blue-600 text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {/* spinner */}
              {loading ? "Creating..." : "Create"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
