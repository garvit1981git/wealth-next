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

export { AccountSchema };
export { UserSchema };
export { TransactionSchema };
export { signinschema };
