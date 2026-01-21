// import { Tabs, Button } from "antd";
// import { LayoutDashboard, FileText, Activity, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import RenewalsDashboard from "./tabs/RenewalsDashboard";
// import RenewalsTable from "./tabs/RenewalsTable";
// import RenewalsJobsPanel from "./tabs/RenewalsJobsPanel";

// export default function ContractsPage() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       {/* Header / Card */}
//       <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4">
//         {/* Subtle top gradient accent */}
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

//         <div className="flex flex-col gap-1 mx-4 my-4">
//           <h1 className="text-2xl font-black tracking-tight text-gray-900">
//             Contract Agent
//           </h1>
//           <p className="text-sm text-gray-500">
//             Monitor risk, manage contracts, and track execution health.
//           </p>
//         </div>

//         <Tabs
//           defaultActiveKey="dashboard"
//           className="kozmo-tabs"
//           tabBarStyle={{
//             padding: "0 16px",
//             marginBottom: 0,
//           }}
//           // Extra content placed at the right end of the tab bar
//           tabBarExtraContent={
//             <div className="flex items-center gap-3 pr-4">
//               <Button
//                 onClick={() => navigate("/contracts/CreateNewContract")}
//                 aria-label="Create Contract Form"
//                 className="flex items-center gap-2 rounded-full px-4 py-2 border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
//                 type="default"
//                 size="middle"
//                 // remove default antd styles that conflict on some themes
//                 style={{ borderColor: "transparent" }}
//                 title="Create Contract Form"
//               >
//                 <Plus size={14} />
//                 <span className="font-semibold">Create New Contract</span>
//               </Button>
//             </div>
//           }
//           items={[
//             {
//               key: "dashboard",
//               label: (
//                 <div className="group relative flex items-center gap-2 px-1 py-2">
//                   <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-all duration-200">
//                     <LayoutDashboard size={16} className="text-emerald-600" />
//                   </div>
//                   <span className="font-semibold">Dashboard</span>
//                 </div>
//               ),
//               children: (
//                 <div className="p-6">
//                   <RenewalsDashboard />
//                 </div>
//               ),
//             },
//             {
//               key: "renewals",
//               label: (
//                 <div className="group relative flex items-center gap-2 px-1 py-2">
//                   <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-all duration-200">
//                     <FileText size={16} className="text-blue-600" />
//                   </div>
//                   <span className="font-semibold">Renewals</span>
//                 </div>
//               ),
//               children: (
//                 <div className="p-6">
//                   <RenewalsTable />
//                 </div>
//               ),
//             },
//             {
//               key: "jobs",
//               label: (
//                 <div className="group relative flex items-center gap-2 px-1 py-2">
//                   <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-all duration-200">
//                     <Activity size={16} className="text-purple-600" />
//                   </div>
//                   <span className="font-semibold">Jobs</span>
//                 </div>
//               ),
//               children: (
//                 <div className="p-6">
//                   <RenewalsJobsPanel />
//                 </div>
//               ),
//             },
//           ]}
//         />
//       </div>
//     </div>
//   );
// }

// import React from 'react'

const RenewalsPage = () => {
  return (
    <div>RenewalsPage</div>
  )
}

export default RenewalsPage