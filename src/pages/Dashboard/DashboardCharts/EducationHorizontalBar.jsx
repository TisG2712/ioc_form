import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

// Dữ liệu với nhiều trường hơn
const data = [
  { level: "Tiểu học", excellent: 320, good: 450, average: 200, poor: 30 },
  { level: "THCS", excellent: 280, good: 380, average: 250, poor: 40 },
  { level: "THPT", excellent: 200, good: 320, average: 300, poor: 60 },
  { level: "Đại học", excellent: 150, good: 280, average: 350, poor: 70 },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#333",
            borderBottom: "1px solid #eee",
            paddingBottom: "5px",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`education-item-${entry.name || index}`}
            style={{
              color: entry.color,
              margin: "3px 0",
              fontSize: "13px",
            }}
          >
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EducationHorizontalBar = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
          stroke="#eaeaea"
        />
        <XAxis
          type="number"
          tick={{
            fontSize: 12,
            fill: "#555",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={{ stroke: "#ccc" }}
        />
        <YAxis
          dataKey="level"
          type="category"
          tick={{
            fontSize: 13,
            fill: "#333",
            fontWeight: "600",
            fontFamily: "Arial, sans-serif",
          }}
          width={80}
          axisLine={{ stroke: "#ccc" }}
          tickLine={{ stroke: "#ccc" }}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Cột cho học sinh giỏi */}
        <Bar dataKey="excellent" barSize={20} radius={[0, 4, 4, 0]} name="Giỏi">
          {data.map((entry, index) => (
            <Cell
              key={`cell-excellent-${index}`}
              fill={index % 2 === 0 ? "#34d399" : "#10b981"}
            />
          ))}
          <LabelList
            dataKey="excellent"
            position="right"
            fill="#047857"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>

        {/* Cột cho học sinh khá */}
        <Bar dataKey="good" barSize={20} radius={[0, 4, 4, 0]} name="Khá">
          {data.map((entry, index) => (
            <Cell
              key={`cell-good-${index}`}
              fill={index % 2 === 0 ? "#60a5fa" : "#3b82f6"}
            />
          ))}
        </Bar>

        {/* Cột cho học sinh trung bình */}
        <Bar
          dataKey="average"
          barSize={20}
          radius={[0, 4, 4, 0]}
          name="Trung bình"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-average-${index}`}
              fill={index % 2 === 0 ? "#fbbf24" : "#f59e0b"}
            />
          ))}
        </Bar>

        {/* Cột cho học sinh yếu */}
        <Bar dataKey="poor" barSize={20} radius={[0, 4, 4, 0]} name="Yếu">
          {data.map((entry, index) => (
            <Cell
              key={`cell-poor-${index}`}
              fill={index % 2 === 0 ? "#f87171" : "#ef4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EducationHorizontalBar;
