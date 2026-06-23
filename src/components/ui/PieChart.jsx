"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GetTransactionsOfSelectedAcc from "@/app/actions/GetTransactionsOfSelectedAcc";
import { defaultCategories } from "../../../data/categary";
// import { defaultCategories } from "@/app/constants/categories"; // Update this path to match your files!

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to dynamically locate category configurations
const getCategoryConfig = (categoryName) => {
  const match = defaultCategories.find(
    (c) =>
      c.name.toLowerCase() === categoryName.toLowerCase() ||
      c.id.toLowerCase() === categoryName.toLowerCase(),
  );
  return match || { color: "#94a3b8", name: categoryName }; // Slate-400 fallback
};

const PieChart = ({ userid, setacc, acc }) => {
  const [chartData, setChartData] = useState(null);
  const [rawGroupedData, setRawGroupedData] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await GetTransactionsOfSelectedAcc(userid, acc);
      if (!res || res.length === 0) {
        setChartData(null);
        return;
      }

      // 1. Group transactions by category name/id & accumulate values
      const grouped = {};
      let total = 0;
      res.forEach((t) => {
        const amount = Math.abs(t.amount);
        grouped[t.category] = (grouped[t.category] || 0) + amount;
        total += amount;
      });

      setRawGroupedData(grouped);
      setTotalExpense(total);

      // 2. Map dynamic data keys to find their intended system colors
      const labels = Object.keys(grouped);
      const colors = labels.map((label) => getCategoryConfig(label).color);

      setChartData({
        labels: labels.map((label) => getCategoryConfig(label).name),
        datasets: [
          {
            data: Object.values(grouped),
            backgroundColor: colors, // Uses your perfect Tailwind hex colors!
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 12,
            cutout: "75%",
            borderRadius: 6,
          },
        ],
      });
    };

    load();
  }, [userid, acc]);

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 font-medium">
        No EXPENSE transaction data found for this account.
      </div>
    );
  }

  return (
    <div className="max-w-[300px] text-primaryText mx-auto p-3 rounded-3xl shadow-xl transition-all duration-300">
      <h3 className="text-xs sm:text-sm md:text-lg font-semibold  text-center mb-6 tracking-tight text-primaryText">
        Expense Distribution
      </h3>

      {/* Chart Canvas & Center Visual Stack */}
      <div className="relative w-45 h-45 mx-auto mb-6">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false, // Clean setup using native custom layout grid below
              },
              tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                padding: 12,
                titleFont: { size: 12, weight: "bold" },
                bodyFont: { size: 11 },
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: (ctx) => {
                    const value = ctx.raw;
                    const percent = ((value / totalExpense) * 100).toFixed(1);
                    return ` ${percent}% (₹${value.toLocaleString()})`;
                  },
                },
              },
            },
          }}
        />
        {/* Absolute Centered Total readout */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <span className="text-xs sm:text-sm md:text-lg font-medium text-primaryText uppercase tracking-wider">
            Total Spent
          </span>
          <span className="text-sm md:text-lg font-bold text-primaryText mt-0.5">
            ₹
            {totalExpense.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Custom matching Legend items Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-20 overflow-y-auto  custom-scrollbar mt-4">
        {Object.keys(rawGroupedData).map((categoryKey) => {
          const value = rawGroupedData[categoryKey];
          const percentage = ((value / totalExpense) * 100).toFixed(0);
          const config = getCategoryConfig(categoryKey);

          return (
          <div
  key={categoryKey}
  className="flex items-center justify-between px-3 py-1.5 w-fit rounded-full transition-colors"
  // Adds '26' to the hex code, which is 15% opacity in hex
  style={{ backgroundColor: `${config.color}26` }}
>
  <div className="flex items-center space-x-2">
    {/* Text uses the full solid color */}
    <span 
      className="text-xs md:text-sm text-primaryText font-medium truncate capitalize"
      // style={{ color: config.color }}
    >
      {config.name}
    </span>
  </div>
  
  <span 
    className="text-[10px] text-primaryText md:text-xs font-bold ml-2"
    // style={{ color: config.color }}
  >
    {percentage}%
  </span>
</div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
