// / model Transaction {
//   id                String            @id @default(uuid())
//   type              Transactiontype
//   description       String?
//   date              DateTime
//   category          String
//   reciepturl        String?
//   isRecurring       Boolean           @default(false)
//   recurringinterval RecurringInteval?
//   nextRecurringDate DateTime?
//   lastProcessed     DateTime?
//   Status            TransactionStatus @default(COMPLETED)
//   userId            String
//   user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
//   accountId         String
//   acoount           Account           @relation(fields: [accountId], references: [id], onDelete: Cascade)
//   createdAt         DateTime          @default(now())
//   updatedAt         DateTime          @updatedAt
// }

import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reciepturl: {
    type: String
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', ""],
    required : false
    // adjust based on your RecurringInteval enum
  },
  amount: {
    type: Number,
    required: true
  },

  nextRecurringDate: {
    type: Date
  },
  lastProcessed: {
    type: Date
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'], // adjust based on your TransactionStatus enum
    default: 'COMPLETED'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
// export default Transaction