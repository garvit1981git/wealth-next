import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const IncomeExpenseChart = ({ data, range, onRangeChange }) => {
  return (
    <div className="rounded-xl bg-mainBg p-4 shadow-sm border border-neutral-800">
      <div className="w-auto h-auto sm:p-6 space-y-6">
        {/* Header Control Panel */}
        <div className="flex items-center justify-between">
          <h2 className="sm:text-xl font-semibold text-primaryText">
            Income vs Expense
          </h2>

          <Select value={range} onValueChange={onRangeChange}>
            <SelectTrigger className="w-35 sm:w-45 bg-mainBg shadow-sm">
              <SelectValue placeholder="Set Range" />
            </SelectTrigger>
            <SelectContent className="w-35 sm:w-45 bg-mainBg shadow-sm">
              <SelectItem value="ALL">All Time</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1YR">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bar Chart Graphics */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            barGap={5}
          >
            <CartesianGrid stroke="#1f1f23" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a3a3a3" }} />
            <YAxis tick={{ fontSize: 12, fill: "#a3a3a3" }} />
            <Tooltip
              formatter={(value) => `₹ ${value}`}
              cursor={{ fill: "#27272a", opacity: 0.3 }}
            />
            <Legend />
            <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#dc2626" radius={[6, 6, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;