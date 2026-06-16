import { useState } from "react";
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

let Chart = ({ Transactions }) => {
  let [range, setrange] = useState("1M");
  let sortedtransactions = Transactions.sort((a, b) => {
    let avalue = new Date(a.date);
    let bvalue = new Date(b.date);
    return avalue - bvalue;
  });
  let filteredtransactions = sortedtransactions.filter((t) => {
    let now = new Date();
    if (range == "1W") {
      let oneWeekBefore = new Date(now);
      oneWeekBefore.setDate(now.getDate() - 7);
      return new Date(t.date) > oneWeekBefore;
    }
    if (range == "1M") {
      let oneMonthBefore = new Date(now);
      oneMonthBefore.setDate(now.getDate() - 30);
      return new Date(t.date) > oneMonthBefore;
    }
    if (range == "3M") {
      let threeMonthBefore = new Date(now);
      threeMonthBefore.setDate(now.getDate() - 90);
      return new Date(t.date) > threeMonthBefore;
    }
    if (range == "6M") {
      let sixMonthBefore = new Date(now);
      sixMonthBefore.setDate(now.getDate() - 180);
      return new Date(t.date) > sixMonthBefore;
    }
    if (range == "1YR") {
      let oneyearBefore = new Date(now);
      oneyearBefore.setDate(now.getDate() - 365);
      return new Date(t.date) > oneyearBefore;
    }
    if (range == "ALL") {
      return true;
    }
    return;
  });
  const grouped = {};

  filteredtransactions.forEach((t) => {
    const key = new Date(t.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    if (!grouped[key]) {
      grouped[key] = { name: key, income: 0, expense: 0 };
    }

    if (t.type === "Income") grouped[key].income += t.amount;
    if (t.type === "Expense") grouped[key].expense += t.amount;
  });
  const data = Object.values(grouped);

  let allincomearr = filteredtransactions.map((t) =>
    t.type == "Income" ? t.amount : -t.amount,
  );
  let income = filteredtransactions.map((t) => t.type == "Income" && t.amount);
  let expense = filteredtransactions.map(
    (t) => t.type == "Expense" && -t.amount,
  );
  let net = allincomearr.reduce((total, n) => total + n, 0);
  let incomesum = income.reduce((total, n) => total + n, 0);
  let expensesum = expense.reduce((total, n) => total + n, 0);

  // let allranges = ["1W", "1M", "3M", "6M", "1YR", "ALL"];
  let handlerange = (e) => {
    // console.log(e);
    setrange(e);
  };
  return (
    <div className="w-full sm:p-6 space-y-6">
      {/* Header */}
      <div className=" flex items-center justify-between">
        <h2 className=" sm:text-xl font-semibold text-primaryText">
          Income vs Expense
        </h2>

        <Select value={range} onValueChange={handlerange}>
          <SelectTrigger className="w-35 sm:w-45 bg-mainBg shadow-sm">
            <SelectValue placeholder="Set Range" />
          </SelectTrigger>
          <SelectContent className="w-35 sm:w-45 bg-mainBg shadow-sm">
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="1W">1 Week</SelectItem>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="3M">3 Month</SelectItem>
            <SelectItem value="6M">6 Month</SelectItem>
            <SelectItem value="1YR">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-mainBg p-4 text-center shadow-sm">
          <p className="text-sm text-secondaryText">Income</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ₹ {incomesum.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-mainBg p-4 text-center shadow-sm">
          <p className="text-sm text-secondaryText">Net</p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              net >= 0 ? "text-green-600" : "text-red-700"
            }`}
          >
            ₹ {net.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-mainBg p-4 text-center shadow-sm">
          <p className="text-sm text-secondaryText">Expense</p>
          <p className="mt-1 text-2xl font-semibold text-red-700">
            ₹ {expensesum.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart card */}
      <div className="rounded-xl bg-mainBg p-4 shadow-sm ">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            barGap={10}
          >
            <CartesianGrid stroke="#1f1f23"  />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `₹ ${value}`} 
              cursor={{ fill: '#27272a', opacity: 0.3 }}
              />
            <Legend />
            <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#dc2626" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
