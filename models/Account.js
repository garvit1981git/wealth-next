import mongoose from "mongoose";



// model Account {
//   id          String        @id @default(uuid())
//   accountname String
//   type        AccountType
//   balance     Decimal       @default(0)
//   isDefault   Boolean       @default(false)
//   userId      String
//   user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
//   createdAt   DateTime      @default(now())
//   updatedAt   DateTime      @updatedAt
//   Transaction Transaction[]
// }



const AccountSchema = new mongoose.Schema(
  {

    accountname: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Savings", "Current", "Personal"], // Replace with your Prisma AccountType values
      required: true,
    },

    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Transaction: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);
export default Account;
