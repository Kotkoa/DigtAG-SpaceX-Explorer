"use client";

import { type FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyLaunchData } from "@/lib/stats";

interface LaunchesPerYearChartProps {
  data: YearlyLaunchData[];
}

export const LaunchesPerYearChart: FC<LaunchesPerYearChartProps> = ({ data }) => {
  return (
    <section aria-labelledby="launches-per-year-title">
      <h2 id="launches-per-year-title" className="text-lg font-semibold text-gray-900 mb-4">
        Launches per Year
      </h2>
      <div className="w-full h-72 sm:h-80" role="img" aria-label="Bar chart showing SpaceX launches per year, split by successful and failed launches">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid #e5e7eb" }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              formatter={(rawValue: string | number) => {
                if (rawValue === "successful") return "Successful";
                if (rawValue === "failed") return "Failed";
                return String(rawValue);
              }}
            />
            <Bar dataKey="successful" name="successful" stackId="launches" fill="#22c55e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="failed" name="failed" stackId="launches" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
