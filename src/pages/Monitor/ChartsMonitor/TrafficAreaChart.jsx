// import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// function TrafficAreaChart() {
//   const data = [
//     { month: "Tháng 1", traffic_accidents: 24, crowd_gathering: 18 },
//     { month: "Tháng 2", traffic_accidents: 31, crowd_gathering: 22 },
//     { month: "Tháng 3", traffic_accidents: 28, crowd_gathering: 25 },
//     { month: "Tháng 4", traffic_accidents: 35, crowd_gathering: 30 },
//     { month: "Tháng 5", traffic_accidents: 42, crowd_gathering: 35 },
//     { month: "Tháng 6", traffic_accidents: 38, crowd_gathering: 32 },
//   ];

//   return (
//     <div className="bg-grey/50 backdrop-blur-3xl rounded-xl p-4 w-full h-60 border border-gray-300 max-h-[170px]">
//       {/* <h2 className="text-center font-semibold mb-4 text-gray-800 text-lg">
//         Giao thông - 6 tháng đầu năm 2025
//       </h2> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart
//           data={data}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//           <XAxis dataKey="month" tick={{ fontSize: "12px" }} />
//           <YAxis
//             tick={{ fontSize: "12px" }}
//             label={{
//               value: "Số vụ",
//               angle: -90,
//               position: "insideLeft",
//               fontSize: 12,
//               offset: -5,
//             }}
//           />
//           <Tooltip
//             formatter={(value, name) => {
//               if (name === "traffic_accidents")
//                 return [value, "Tai nạn giao thông"];
//               if (name === "crowd_gathering") return [value, "Tụ tập đám đông"];
//               return [value, name];
//             }}
//             contentStyle={{
//               fontSize: "14px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//           />
//           <Legend
//             wrapperStyle={{
//               fontSize: "12px",
//               paddingTop: "10px",
//             }}
//             formatter={(value) => {
//               if (value === "traffic_accidents") return "Tai nạn giao thông";
//               if (value === "crowd_gathering") return "Tụ tập đám đông";
//               return value;
//             }}
//           />
//           <Area
//             type="monotone"
//             dataKey="traffic_accidents"
//             stackId="1"
//             stroke="#ff4d4f"
//             fill="#ff4d4f"
//             fillOpacity={0.6}
//             name="Tai nạn giao thông"
//           />
//           <Area
//             type="monotone"
//             dataKey="crowd_gathering"
//             stackId="1"
//             stroke="#1890ff"
//             fill="#1890ff"
//             fillOpacity={0.6}
//             name="Tụ tập đám đông"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default TrafficAreaChart;
