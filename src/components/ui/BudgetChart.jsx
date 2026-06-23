"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import GetMonthlyOverview from "@/app/actions/IncomeExpenseSavings";
// import GetMonthlyOverview from "@/app/actions/IncomeExpenseSavings";

// 1. FIXED: Moved CustomTooltip OUTSIDE the main component to prevent render loops
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pureBg border border-cardBorder p-3 rounded-xl shadow-lg">
        <p className="font-bold text-primaryText mb-2">{label} Overview</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-secondaryText capitalize">{entry.name}:</span>
            <span className="text-primaryText font-mono tracking-tight">
              ₹{entry.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BudgetChart = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const overviewData = await GetMonthlyOverview(userId);

        // 2. DEBUGGING: Check your browser console!
        // If this logs an empty array [], the issue is in your Server Action, not the chart.
        console.log("Chart Data Received:", overviewData);

        if (overviewData && Array.isArray(overviewData)) {
          setData(overviewData);
        } else {
          setData([]); // Fallback to empty array to prevent Recharts crash
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchChartData();
  }, [userId]);

  return (
    <div className="bg-mainBg border border-cardBorder rounded-2xl p-6 sm:p-6 shadow-sm flex flex-col h-[380px] w-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm sm:text-xl font-bold text-primaryText font-serif tracking-tight">
            Budget
          </h2>
        </div>
        <button className="p-2 hover:bg-accentLight/10 rounded-lg transition-colors group cursor-pointer">
          <ArrowUpRight className="w-5 h-5 text-primaryText group-hover:text-accentLight transition-colors" />
        </button>
      </div>

      {/* Recharts Render Canvas */}
      <div className="flex-1 w-full h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-secondaryText">
            Aggregating ledger data...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-secondaryText">
            No transaction data found for this year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: 8, bottom: 0 }}
              barSize={40}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "primaryText", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "primaryText", fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: "20px",
                
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#a1a1aa",
                }}
              />

              {/* Note: In a stacked chart, adding radius to every bar creates gaps between them. 
                  If it looks disjointed, remove the radius from Income and Expense! */}
              <Bar
                dataKey="Income"
                stackId="a"
                fill="#a78bfa"
                radius={[6, 6, 6, 6]}
              />
              <Bar
                dataKey="Expense"
                stackId="a"
                fill="#f9a8d4"
                radius={[6, 6, 6,6]}
              />
              <Bar
                dataKey="Saving"
                stackId="a"
                fill="#38bdf8"
                radius={[6, 6, 6, 6]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;
