// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// function HealthcareChart() {
//   const data = [
//     { year: "2019", disease_cases: 1245, referrals: 312 },
//     { year: "2020", disease_cases: 1876, referrals: 468 },
//     { year: "2021", disease_cases: 2453, referrals: 689 },
//     { year: "2022", disease_cases: 1987, referrals: 542 },
//     { year: "2023", disease_cases: 1765, referrals: 487 },
//     { year: "2024", disease_cases: 1568, referrals: 423 },
//   ];

//   return (
//     <div className="bg-grey/50 backdrop-blur-3xl rounded-xl p-1 w-full h-50 border border-gray-300 mb-3 max-h-[170px]">
//       {/* <h2 className="text-center font-semibold mb-2 text-gray-700 text-sm mt-2">
//         Dịch bệnh và Chuyển tuyến (2019-2024)
//       </h2> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={data}
//           margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="year" tick={{ fontSize: "10px" }} />
//           <YAxis tick={{ fontSize: "10px" }} />
//           <Tooltip contentStyle={{ fontSize: "12px" }} />
//           <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
//           <Bar
//             dataKey="disease_cases"
//             fill="#ef4444"
//             barSize={20}
//             radius={[5, 5, 0, 0]}
//             name="Số ca dịch bệnh"
//           />
//           <Bar
//             dataKey="referrals"
//             fill="#3b82f6"
//             barSize={20}
//             radius={[5, 5, 0, 0]}
//             name="Số ca chuyển tuyến"
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default HealthcareChart;
