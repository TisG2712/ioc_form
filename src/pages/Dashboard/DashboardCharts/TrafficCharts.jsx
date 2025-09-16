import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Cell,
} from "recharts";

// Dữ liệu demo giao thông với nhiều trường hơn
const data = [
  {
    month: "Tháng 1",
    accidents: 120,
    deaths: 15,
    injuries: 85,
    trafficViolations: 320,
    averageSeverity: 3.2,
  },
  {
    month: "Tháng 2",
    accidents: 98,
    deaths: 10,
    injuries: 70,
    trafficViolations: 280,
    averageSeverity: 2.8,
  },
  {
    month: "Tháng 3",
    accidents: 150,
    deaths: 20,
    injuries: 110,
    trafficViolations: 450,
    averageSeverity: 4.1,
  },
  {
    month: "Tháng 4",
    accidents: 130,
    deaths: 18,
    injuries: 95,
    trafficViolations: 380,
    averageSeverity: 3.5,
  },
  {
    month: "Tháng 5",
    accidents: 170,
    deaths: 25,
    injuries: 130,
    trafficViolations: 520,
    averageSeverity: 4.5,
  },
  {
    month: "Tháng 6",
    accidents: 140,
    deaths: 19,
    injuries: 105,
    trafficViolations: 410,
    averageSeverity: 3.7,
  },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "5px",
            color: "#333",
            borderBottom: "1px solid #eee",
            paddingBottom: "5px",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`traffic-item-${entry.name || index}`}
            style={{
              color: entry.color,
              margin: "3px 0",
            }}
          >
            {entry.name}: <strong>{entry.value}</strong>
            {entry.dataKey === "averageSeverity" ? " điểm" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrafficChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
        style={{
          fontFamily: "Arial, sans-serif",
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="month"
          tick={{
            fontSize: 12,
            fill: "#555",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={{ stroke: "#ccc" }}
        />
        <YAxis
          yAxisId="left"
          label={{
            value: "Số lượng",
            angle: -90,
            position: "insideLeft",
            style: {
              textAnchor: "middle",
              fontSize: 12,
              fontWeight: "bold",
              fill: "#555",
              fontFamily: "Arial, sans-serif",
            },
          }}
          tick={{
            fontSize: 11,
            fill: "#555",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={{ stroke: "#ccc" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: "Mức độ nghiêm trọng",
            angle: -90,
            position: "insideRight",
            style: {
              textAnchor: "middle",
              fontSize: 12,
              fontWeight: "bold",
              fill: "#555",
              fontFamily: "Arial, sans-serif",
            },
          }}
          tick={{
            fontSize: 11,
            fill: "#555",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={{ stroke: "#ccc" }}
          domain={[0, 5]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            paddingTop: "10px",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
          }}
        />

        {/* Biểu đồ cột cho số vụ tai nạn */}
        <Bar
          yAxisId="left"
          dataKey="accidents"
          barSize={30}
          name="Số vụ tai nạn"
          fill="#4ade80"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.accidents > 140 ? "#ef4444" : "#4ade80"}
            />
          ))}
        </Bar>

        {/* Biểu đồ cột cho số người bị thương */}
        <Bar
          yAxisId="left"
          dataKey="injuries"
          barSize={30}
          name="Số người bị thương"
          fill="#3b82f6"
        />

        {/* Biểu đồ cột cho số vi phạm giao thông (thu nhỏ hơn) */}
        <Bar
          yAxisId="left"
          dataKey="trafficViolations"
          barSize={15}
          name="Số vi phạm GT"
          fill="#94a3b8"
        />

        {/* Biểu đồ đường cho số tử vong */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="deaths"
          stroke="#f87171"
          strokeWidth={3}
          name="Số tử vong"
          dot={{
            fill: "#f87171",
            strokeWidth: 2,
            r: 5,
            stroke: "#fff",
          }}
          activeDot={{ r: 7, fill: "#ef4444" }}
        />

        {/* Biểu đồ đường cho mức độ nghiêm trọng trung bình */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="averageSeverity"
          stroke="#8b5cf6"
          strokeWidth={2}
          strokeDasharray="3 3"
          name="Mức độ nghiêm trọng TB"
          dot={{
            fill: "#8b5cf6",
            strokeWidth: 2,
            r: 4,
            stroke: "#fff",
          }}
          activeDot={{ r: 6, fill: "#7c3aed" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TrafficChart;
