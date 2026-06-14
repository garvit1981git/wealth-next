"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function ScanGivenReceipt(file) {
  try {
    
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Using Gemini 2.5 Flash - standard for speed/OCR in late 2025
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      
      generationConfig: {
        responseMimeType: "application/json", // Forces the model to output valid JSON
      }
    });
    
    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
"type" : type (type of transaction it can be Expense or Income)
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;
    
    const result = await model.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    const response = await result.response;
    const data = JSON.parse(response.text());

    return {
      type: data.type,
      amount: Number(data.amount) || 0,
      date: data.date ? new Date(data.date) : new Date(),
      description: data.description || "",
      merchantName: data.merchantName || "",
      category: data.category || "General",
    };
  } catch (e) {
    console.error("Receipt scan error:", e.message);
    return {};
  }
}