"use server";

import Mongoosedb from "@/lib/mongoose";
import { SavingsGoal } from "../../../models/SavingsGoal";

let GetAllGoalList = async (userid) => {
  try {
    if (!userid) return { goals: [], completedGoalNames: [] };
    
    await Mongoosedb();
    
    // 1. Fetch raw documents
    let allgoals = await SavingsGoal.find({ userId: userid }).lean();
    
    const now = new Date();
    const completedGoalNames = [];

    // 2. Map and verify transitions or completions dynamically
    const processedGoals = await Promise.all(
      allgoals.map(async (goal) => {
        
        // Check if the goal target has been fully achieved
        if (goal.currentAmount >= goal.targetAmount) {
          completedGoalNames.push(goal.name);
          
          // REMOVE FROM DATABASE: Permanently drop the completed document
          await SavingsGoal.findByIdAndDelete(goal._id);
          
          // Return null so we can filter this goal out of the active list
          return null;
        }

        const lastReset = goal.lastMonthResetDate ? new Date(goal.lastMonthResetDate) : now;
        
        // Check if the calendar month or calendar year has advanced
        const isNewMonth = 
          now.getMonth() !== lastReset.getMonth() || 
          now.getFullYear() !== lastReset.getFullYear();

        if (isNewMonth) {
          await SavingsGoal.findByIdAndUpdate(goal._id, {
            $set: {
              thisMonthContribution: 0,
              lastMonthResetDate: now
            }
          });

          return {
            ...goal,
            thisMonthContribution: 0,
            lastMonthResetDate: now.toISOString()
          };
        }

        return goal;
      })
    );

    // 3. Clean up the array to completely strip out the null (deleted) items
    const activeGoals = processedGoals.filter((goal) => goal !== null);

    console.log(`Processed goals. Active: ${activeGoals.length}, Deleted/Completed: ${completedGoalNames.length}`);
    
    return {
      goals: JSON.parse(JSON.stringify(activeGoals)),
      completedGoalNames: completedGoalNames
    };

  } catch (error) {
    console.error("Pipeline failure inside GetAllGoalList:", error);
    return { goals: [], completedGoalNames: [] };
  }
};

export default GetAllGoalList;