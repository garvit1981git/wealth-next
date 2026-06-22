import { z } from "zod";

const AccountSchema = z.object({
  accountname: z
    .string()
    .min(1, "Please enter account name")
    .trim(),

  type: z.enum(["Current", "Savings", "Personal"], {
    required_error: "Select an account type",
  }),

  balance: z
    // Zod doesn’t have z.int(), use z.number() instead
    .coerce.number({
      required_error: "Enter account balance",
      invalid_type_error: "Balance must be a number",
    })
    .min(1, "Balance must be at least 1"),

  isDefault: z.boolean().default(false),
});



const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your name")
    .trim(),
  Email: z.email().trim(),
  Password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .trim(),
});
const signinschema = z.object({
  name: z
    .string()
    .min(1, "Please enter your name")
    .trim(),
  Password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")
    .trim(),
});

const TransactionSchema = z.object({
  type: z.enum(["Income", "Expense"]),
  amount: z.coerce.number(),
  description: z.string().optional(),
  date: z.coerce.date({ required_error: "Date is required" }),
  accountId: z.string().min(1, "Account is required"),
  user: z.string().min(1, "user is required"),
  category: z.string().min(1, "Category is required"),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isRecurring && !data.recurringInterval) {
    ctx.addIssue({
      code: z.custom,
      message: "Recurring interval is required for recurring transactions",
      path: ["recurringInterval"],
    });
  }
})
 const savingsGoalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(50, "Goal name is too long"),
  targetAmount: z
    .preprocess((val) => parseFloat(val), z.number().positive("Target amount must be greater than 0")),
  durationMonths: z
    .preprocess((val) => parseInt(val, 10), z.number().int().positive("Duration must be at least 1 month")),
  accountId: z
    .string()
    .min(1, "Please select an account for initial funding setup"),
  initialFunding: z
    .preprocess((val) => (val === "" ? 0 : parseFloat(val)), z.number().min(0, "Initial funding cannot be negative"))
    .default(0),
});
let amountAllocationSchema = z.object({
  goalId: z.string().min(1, "Please select a target savings goal"),
  amount: z
    .preprocess(
      (val) => (val === "" ? undefined : parseFloat(val)),
      z.number({ required_error: "Amount is required" })
        .positive("Allocation amount must be greater than 0")
    ),
});
let createTransferSchema = (sourceBalance) => 
  z.object({
    targetAccountId: z.string().min(1, "Please select a destination account"),
    amount: z
      .preprocess(
        (val) => (val === "" ? undefined : parseFloat(val)),
        z.number({ required_error: "Transfer amount is required" })
          .positive("Amount must be greater than 0")
      )
      .refine((val) => val <= sourceBalance, {
        message: `Insufficient funds. Max available: ₹${sourceBalance.toLocaleString("en-IN")}`,
      }),
  });
export { AccountSchema };
export { UserSchema };
export { TransactionSchema };
export { signinschema };
export { savingsGoalSchema };
export { amountAllocationSchema };
export { createTransferSchema };
