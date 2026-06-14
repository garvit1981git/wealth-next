import mongoose from "mongoose";
// model budget {
//   id            String    @id @default(uuid())
//   Amount        Decimal
//   LastAlertSent DateTime?
//   userId        String
//   user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt
// }

let BudgetSchema = new mongoose.Schema({
  Amount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  LastAlertSent: { type: Date },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
