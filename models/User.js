import mongoose from "mongoose";

// model User {
//   id          String        @id @default(uuid())
//   clerkUserId String        @unique
//   name        String
//   email       String        @unique
//   imageUrl    String?
//   accounts    Account[]
//   Transaction Transaction[]
//   budget      budget[]
//   createdAt   DateTime      @default(now())
//   updatedAt   DateTime      @updatedAt
// }

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // prevents password from being returned in queries
    },

    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],

    Transaction: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],

    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
    },
    Theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);
let User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
