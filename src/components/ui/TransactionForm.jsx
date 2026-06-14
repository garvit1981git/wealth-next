"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema } from "@/lib/formschema"; // adjust path
import { z } from "zod";
import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary"; // adjust path
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTransaction from "@/app/actions/CreateTransaction";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import AiRecieptScan from "./AiRecieptScan";

let TransactionForm = ({ user, acc, transactions }) => {
  // console.log(user,acc,"form")
  const isEditMode = transactions._id ? true : false; // true if editing
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      type: "",
      amount: "",
      description: "",
      date: "",
      accountId: "",
      user: "",
      category: "",
      isRecurring: false,
      recurringInterval: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      setValue("user", user._id, { shouldValidate: true });
    }
  }, [user]);
  const onSubmit = async (data) => {
    try {
      const editId = isEditMode ? transactions._id : null;
      console.log("editing");
      await CreateTransaction(data, editId);
      // The redirect happens inside the Server Action,
      // but you can add a toast message here if you want.
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  let HandleScanComplete = (scannedData) => {
    if (!scannedData) return;
    // Map scanned data to form fields
    setValue("type", scannedData.type || "Expense", { shouldValidate: true });
    setValue("amount", scannedData.amount || "", { shouldValidate: true });
    setValue("description", scannedData.description || "", {
      shouldValidate: true,
    });
    setValue(
      "date",
      scannedData.date ? scannedData.date.toISOString().split("T")[0] : "",
      { shouldValidate: true },
    );
    setValue("category", scannedData.category || "", { shouldValidate: true });
  };
  useEffect(() => {
    if (transactions && Object.keys(transactions).length > 0) {
      setValue("type", transactions.type || "", { shouldValidate: true });
      setValue("amount", transactions.amount || "", { shouldValidate: true });
      setValue("description", transactions.description || "", {
        shouldValidate: true,
      });
      setValue("accountId", transactions.accountId || "", {
        shouldValidate: true,
      });
      setValue("user", transactions.user || "", { shouldValidate: true });
      // Date formatting (Crucial for <input type="date">)
      if (transactions.date) {
        const dateStr = new Date(transactions.date).toISOString().split("T")[0];
        setValue("date", dateStr);
      }

      // Category Fix
      const catValue = transactions.category || "";
      setTimeout(() => {
        setValue("category", catValue, { shouldValidate: true });
      }, 0);

      console.log(catValue);
      setValue("isRecurring", transactions.isRecurring || false, {
        shouldValidate: true,
      });
      setValue("recurringInterval", transactions.recurringInterval || "", {
        shouldValidate: true,
      });
      // let selectedCategory = watch("category"); // get current category value
    }
  }, [transactions]);
  let selectedCategory = watch("category"); // get current category value
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* AI RECIEPT SACAN */}

      <AiRecieptScan onscancomplete={HandleScanComplete} />

      {/* Type */}
      <div>
        <label className="block mb-1">Type</label>
        <select
          {...register("type")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        >
          <option value="">Select</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1">Description</label>
        <input
          type="text"
          {...register("description")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1">Date</label>
        <input
          type="date"
          {...register("date")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        />
        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}
      </div>

      {/* Account */}
      <div>
        <label className="block mb-1">Account</label>

        <select
          {...register("accountId")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        >
          <option value="">Select</option>

          {acc?.map((item) => {
            // console.log("this is item", item);
            return (
              <option key={item._id} value={item._id}>
                {`${item.accountname}(${Number(
                  item.balance?.$numberDecimal,
                ).toFixed(2)} ) `}
              </option>
            );
          })}
        </select>

        {errors.accountId && (
          <p className="text-red-500 text-sm">{errors.accountId.message}</p>
        )}
      </div>

      {/* Category */}

      <div>
        <label className="block mb-1">Category</label>
        value
        <Select
          value={selectedCategory || ""}
          onValueChange={(v) =>
            setValue("category", v, { shouldValidate: true })
          }
          className=" border-cardBorder bg-mainBg text-primaryText w-full rounded"
        >
          <SelectTrigger className="w-full  p-2 rounded">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {defaultCategories.map((cat) => {
              const Icon = Icons[cat.icon];

              return (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center  border-cardBorder bg-mainBg text-primaryText gap-4  rounded transition-colors duration-200"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {cat.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Recurring */}
      <div>
        <label className="block mb-1">Recurring</label>
        <select
          value={watch("isRecurring") ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value === "true";
            setValue("isRecurring", val, { shouldValidate: true });

            if (!val) {
              setValue("recurringInterval", "", { shouldValidate: true });
            }
          }}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>

      {/* Recurring Interval */}

      <div>
        <label className="block mb-1">Recurring Interval</label>
        <select
          {...register("recurringInterval")}
          className=" border-cardBorder bg-mainBg text-primaryText p-2 w-full rounded"
        >
          <option value="">select</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
        {errors.recurringInterval && (
          <p className="text-red-500 text-sm">
            {errors.recurringInterval.message}
          </p>
        )}
      </div>
      {/* <div className="w-full  bg-red-500"> */}
      <button
        type="submit"
        className="bg-accentLight hover:bg-accentDark font-medium w-[30%] block text-primaryText m-auto px-4 py-2 rounded"
      >
        {isEditMode ? "Update" : "Save"}
      </button>
      {/* </div> */}
    </form>
  );
};

export default TransactionForm;
