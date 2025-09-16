import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from "recharts";

// Dữ liệu với nhiều trường hơn
const data = [
  {
    month: "Tháng 1",
    security: 25,
    traffic: 40,
    emergency: 15,
    publicSafety: 32,
    avgResponseTime: 8.5,
  },
  {
    month: "Tháng 2",
    security: 20,
    traffic: 35,
    emergency: 12,
    publicSafety: 28,
    avgResponseTime: 7.2,
  },
  {
    month: "Tháng 3",
    security: 30,
    traffic: 50,
    emergency: 18,
    publicSafety: 40,
    avgResponseTime: 9.8,
  },
  {
    month: "Tháng 4",
    security: 22,
    traffic: 38,
    emergency: 14,
    publicSafety: 30,
    avgResponseTime: 7.9,
  },
  {
    month: "Tháng 5",
    security: 28,
    traffic: 45,
    emergency: 16,
    publicSafety: 36,
    avgResponseTime: 8.3,
  },
  {
    month: "Tháng 6",
    security: 18,
    traffic: 30,
    emergency: 10,
    publicSafety: 25,
    avgResponseTime: 6.5,
  },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#1e293b",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "6px",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`security-item-${entry.name || index}`}
            style={{
              color: entry.color,
              margin: "4px 0",
              fontSize: "13px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{entry.name}:</span>
            <span
              style={{
                fontWeight: "bold",
                backgroundColor: "#f8fafc",
                padding: "2px 8px",
                borderRadius: "4px",
                marginLeft: "10px",
              }}
            >
              {entry.value}
              {entry.dataKey === "avgResponseTime" ? " phút" : ""}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend
const CustomLegend = ({ payload }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "15px",
        flexWrap: "wrap",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`security-div-${entry.name || index}`}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
            color: "#475569",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: entry.color,
              marginRight: "6px",
              borderRadius: "3px",
            }}
          ></div>
          {entry.value}
        </div>
      ))}
    </div>
  );
};

const SecurityTrafficBar = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 25, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{
            fontSize: 12,
            fill: "#475569",
            fontFamily: "Arial, sans-serif",
            fontWeight: 500,
          }}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tick={{
            fontSize: 11,
            fill: "#64748b",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        {/* Cột cho sự cố an ninh */}
        <Bar
          dataKey="security"
          name="Sự cố an ninh"
          radius={[4, 4, 0, 0]}
          barSize={25}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-security-${index}`}
              fill={entry.security > 25 ? "#ef4444" : "#f87171"}
            />
          ))}
          <LabelList
            dataKey="security"
            position="top"
            fill="#b91c1c"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>

        {/* Cột cho sự cố giao thông */}
        <Bar
          dataKey="traffic"
          name="Sự cố giao thông"
          radius={[4, 4, 0, 0]}
          barSize={25}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-traffic-${index}`}
              fill={entry.traffic > 40 ? "#f59e0b" : "#fbbf24"}
            />
          ))}
          <LabelList
            dataKey="traffic"
            position="top"
            fill="#b45309"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>

        {/* Cột cho sự cố khẩn cấp */}
        <Bar
          dataKey="emergency"
          name="Sự cố khẩn cấp"
          radius={[4, 4, 0, 0]}
          barSize={25}
          fill="#60a5fa"
        >
          <LabelList
            dataKey="emergency"
            position="top"
            fill="#1d4ed8"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>

        {/* Cột cho an toàn công cộng */}
        <Bar
          dataKey="publicSafety"
          name="An toàn công cộng"
          radius={[4, 4, 0, 0]}
          barSize={25}
          fill="#34d399"
        >
          <LabelList
            dataKey="publicSafety"
            position="top"
            fill="#047857"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SecurityTrafficBar;
