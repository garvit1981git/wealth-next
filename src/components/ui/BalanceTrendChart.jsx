"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import GetAccountBalanceTrend from "@/app/actions/GetAccountBalanceTrend";

const RANGES = [30, 60, 90];

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

const BalanceTrendChart = ({ accountId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        const trendData = await GetAccountBalanceTrend(accountId, days);
        setData(trendData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (accountId) fetchTrend();
  }, [accountId, days]);

  const metrics = useMemo(() => {
    if (!data || data.length < 2) return null;
    const start = data[0].balance;
    const end = data[data.length - 1].balance;
    const diff = end - start;
    const pct = start === 0 ? 0 : (diff / start) * 100;
    return {
      diff: Math.abs(diff),
      pct: Math.abs(pct),
      isPositive: diff >= 0,
      current: end,
    };
  }, [data]);

  return (
    <section className="border border-cardBorder rounded-2xl  p-3 shadow-sm ">
      {/* Header */}
      <header className="flex  gap-6 flex-col sm:items-start sm:justify-between">
        <div className="space-y-3 flex justify-between w-full">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mainBg text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
              <Wallet className="h-4 w-4" />
            </span>
            <h2 className="text-xs sm:text-sm md:text-lg font-semibold tracking-tight text-primaryText">
              Balance Horizon
            </h2>
          </div>
          {/* Range toggle */}
 <div
          role="tablist"
          aria-label="Time range"
          className="inline-flex self-start rounded-full border border-slate-200 bg-slate-100/60 p-1 dark:border-slate-700 dark:bg-slate-800/60"
        >
          {RANGES.map((d) => {
            const active = days === d;
            return (
              <button
                key={d}
                role="tab"
                aria-selected={active}
                onClick={() => setDays(d)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {d}D
              </button>
            );
          })}
        </div>
        </div>
          {!loading && metrics && (
            <div className="space-y-1.5 flex gap-3 justify-between w-full">
              <p className="text-xs sm:text-sm md:text-lg font-semibold tracking-tight tabular-nums text-primaryText">
                ₹{metrics.current.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-3 justify-between ">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                    metrics.isPositive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                  }`}
                >
                  {metrics.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {metrics.pct.toFixed(1)}%
                </span>
                <span className="text-xs text-primaryText">
                  {metrics.isPositive ? "+" : "−"}₹
                  {metrics.diff.toLocaleString("en-IN")} over the last {days} days
                </span>
              </div>
            </div>
          )}

        
       
      </header>

      {/* Chart */}
      <div className="mt-8 h-[260px] w-full ">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Calculating balance timeline…
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Not enough history to show a trend yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                tick={{ fontSize: 11, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                tick={{ fontSize: 9, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v) =>
                  v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                }
                domain={["auto", "auto"]}
              />
              <Tooltip
                content={<TrendTooltip />}
                cursor={{
                  stroke: "#14b8a6",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#14b8a6"
                strokeWidth={2.5}
                fill="url(#balanceFill)"
                activeDot={{
                  r: 5,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  fill: "#14b8a6",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default BalanceTrendChart;
