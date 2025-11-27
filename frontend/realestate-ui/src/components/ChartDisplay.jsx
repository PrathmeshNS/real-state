// src/components/ChartDisplay.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

const ChartDisplay = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card card-custom p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <Activity className="text-primary" size={24} />
          <h5 className="mb-0 fw-bold">Price vs Demand Trends</h5>
        </div>
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center gap-1">
            <span
              className="d-inline-block rounded-circle bg-primary"
              style={{ width: 10, height: 10 }}
            ></span>
            <small className="fw-bold text-muted">Price</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span
              className="d-inline-block rounded-circle bg-success"
              style={{ width: 10, height: 10 }}
            ></span>
            <small className="fw-bold text-muted">Demand</small>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e9ecef"
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: "#6c757d", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6c757d", fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6c757d", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#212529", fontWeight: "bold" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#0d6efd",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="demand"
              stroke="#198754"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#198754",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDisplay;
