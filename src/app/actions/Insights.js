'use server'

import { GoogleGenAI, Type } from '@google/genai'; 
import { Resend } from 'resend';
import { InsightsEmail } from '@/components/ui/Email';
import Mongoosedb from '@/lib/mongoose';
import Budget from '../../../models/Budget';
import Transaction from '../../../models/Transaction';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
console.log("these are th key ", process.env.GEMINI_API_KEY)
export async function generateAndEmailInsights(userId, userEmail) {
  try {
    // Ensure DB connection is established
    await Mongoosedb();

    // 1. Fetch Budgets (Fixed Mongoose syntax: .find instead of .findMany)
    const monthlyBudgets = await Budget.find({ userId });

    // Calculate start of current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // 2. Aggregate current spending (Fixed Mongoose syntax using Aggregate pipeline)
    const currentSpending = await Transaction.aggregate([
      {
        $match: {
          userId: userId, // Ensure types match (e.g., wrap in Types.ObjectId if needed)
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Format the data for the AI prompt
    const profileContext = {
      daysRemainingInMonth: 30 - new Date().getDate(),
      budgets: monthlyBudgets.map(b => ({ category: b.category, limit: b.amount })),
      actualSpending: currentSpending.map(s => ({ category: s._id, spent: s.totalAmount || 0 }))
    };

    // 3. Generate Insights via AI (Using Structured Outputs for 100% reliable JSON parsing)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this user's monthly spending data: ${JSON.stringify(profileContext)}. Generate 2 to 3 personalized, highly actionable financial insights or alerts.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['warning', 'tip', 'success'] },
              message: { type: Type.STRING },
              actionableStep: { type: Type.STRING }
            },
            required: ['type', 'message', 'actionableStep'],
          }
        }
      }
    });

    // Safely parse guaranteed JSON string
    const insights = JSON.parse(response.text);

    // 4. Send Email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Financial Tracker <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Your Automated Financial Insights Are Ready 📈',
      react: InsightsEmail({ insights }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Insights sent successfully to your email!" };
  } catch (error) {
    console.error("Action failed:", error);
    return { success: false, error: "Failed to generate or send insights." };
  }
}