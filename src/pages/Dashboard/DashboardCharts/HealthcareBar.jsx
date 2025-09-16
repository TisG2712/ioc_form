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
  LabelList,
  Cell,
} from "recharts";

// Dữ liệu demo với nhiều trường hơn
const data = [
  {
    department: "Nhi",
    patients: 120,
    doctors: 15,
    beds: 80,
    occupancyRate: 85,
    avgStay: 4.5,
  },
  {
    department: "Tim mạch",
    patients: 90,
    doctors: 12,
    beds: 60,
    occupancyRate: 92,
    avgStay: 6.2,
  },
  {
    department: "Ngoại",
    patients: 150,
    doctors: 20,
    beds: 100,
    occupancyRate: 95,
    avgStay: 7.8,
  },
  {
    department: "Sản",
    patients: 110,
    doctors: 14,
    beds: 70,
    occupancyRate: 88,
    avgStay: 3.2,
  },
  {
    department: "Ung bướu",
    patients: 80,
    doctors: 10,
    beds: 50,
    occupancyRate: 78,
    avgStay: 10.5,
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
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#1e40af",
            borderBottom: "2px solid #60a5fa",
            paddingBottom: "5px",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`healthcare-item-${entry.name || index}`}
            style={{
              color: entry.color,
              margin: "5px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{entry.name}:</span>
            <strong
              style={{
                backgroundColor: index === 0 ? "#eff6ff" : "#f8fafc",
                padding: "2px 8px",
                borderRadius: "4px",
                marginLeft: "10px",
              }}
            >
              {entry.value}
              {entry.dataKey === "occupancyRate" ? "%" : ""}
              {entry.dataKey === "avgStay" ? " ngày" : ""}
            </strong>
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
        gap: "20px",
        marginTop: "15px",
        flexWrap: "wrap",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`healthcare-div-${entry.name || index}`}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
            color: "#374151",
          }}
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: entry.color,
              marginRight: "5px",
              borderRadius: "3px",
            }}
          ></div>
          {entry.value}
        </div>
      ))}
    </div>
  );
};

const HealthcareBar = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
        style={{
          fontFamily: "Arial, sans-serif",
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          vertical={false}
        />
        <XAxis
          dataKey="department"
          tick={{
            fontSize: 13,
            fill: "#374151",
            fontFamily: "Arial, sans-serif",
            fontWeight: 600,
          }}
          axisLine={{ stroke: "#d1d5db" }}
          tickLine={{ stroke: "#d1d5db" }}
        />
        <YAxis
          tick={{
            fontSize: 12,
            fill: "#6b7280",
            fontFamily: "Arial, sans-serif",
          }}
          axisLine={{ stroke: "#d1d5db" }}
          tickLine={{ stroke: "#d1d5db" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        {/* Cột chính cho số bệnh nhân */}
        <Bar
          dataKey="patients"
          name="Số bệnh nhân"
          radius={[8, 8, 0, 0]}
          barSize={50}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.patients > 100 ? "#3b82f6" : "#60a5fa"}
            />
          ))}
          <LabelList
            dataKey="patients"
            position="top"
            fill="#1e40af"
            fontSize={12}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={8}
          />
        </Bar>

        {/* Cột phụ cho số bác sĩ */}
        <Bar
          dataKey="doctors"
          name="Số bác sĩ"
          radius={[4, 4, 0, 0]}
          barSize={30}
          fill="#10b981"
        >
          <LabelList
            dataKey="doctors"
            position="top"
            fill="#047857"
            fontSize={11}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            offset={5}
          />
        </Bar>

        {/* Cột phụ cho số giường bệnh */}
        <Bar
          dataKey="beds"
          name="Số giường bệnh"
          radius={[4, 4, 0, 0]}
          barSize={30}
          fill="#f59e0b"
        >
          <LabelList
            dataKey="beds"
            position="top"
            fill="#b45309"
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

export default HealthcareBar;
