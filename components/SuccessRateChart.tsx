"use client";

import { type FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SuccessRateData } from "@/lib/stats";

interface SuccessRateChartProps {
  data: SuccessRateData[];
}

export const SuccessRateChart: FC<SuccessRateChartProps> = ({ data }) => {
  return (
    <section aria-labelledby="success-rate-title">
      <h2 id="success-rate-title" className="text-lg font-semibold text-gray-900 mb-4">
        Success Rate by Year (%)
      </h2>
      <div className="w-full h-72 sm:h-80" role="img" aria-label="Line chart showing SpaceX launch success rate percentage by year">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              domain={[0, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: number | string | ReadonlyArray<number | string> | undefined) => [
                value != null ? `${String(value)}%` : "–",
                "Success Rate",
              ]}
              contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              name="Success Rate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
