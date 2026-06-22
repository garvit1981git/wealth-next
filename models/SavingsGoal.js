import mongoose from "mongoose";

const SavingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },               // e.g., "Bike"
  targetAmount: { type: Number, required: true },       // e.g., 100000
  currentAmount: { type: Number, default: 0 },          // e.g., 25000
  durationMonths: { type: Number, required: true },     // e.g., 10
  startDate: { type: Date, default: Date.now },
  
  // Track this month's custom localized contributions
  thisMonthContribution: { type: Number, default: 0 },
  lastMonthResetDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const SavingsGoal = mongoose.models.SavingsGoal || mongoose.model("SavingsGoal", SavingsGoalSchema);