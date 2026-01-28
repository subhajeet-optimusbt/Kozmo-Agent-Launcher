// import { useState } from "react";
// import { Button, Input, Tooltip, Select, Divider } from "antd";
// import { LayoutGrid, List, CreditCard } from "lucide-react";

// import { CONTRACTS } from "../../../constants/apps";
// import type { Contract } from "../../../constants/apps";
// import { useContractsPagination } from "../../../hooks/pagination";

// import ContractTableView from "../../../components/contract/ContractTableView";
// import ContractListView from "../../../components/contract/ContractListView";
// import ContractCardView from "../../../components/contract/ContractCardView";
// import ContractPreviewDrawer from "../../../components/contract/ContractPreviewDrawer";
// import PaginationControl from "../../../components/PaginationControl";

// type View = "table" | "list" | "card";

// export default function ContractsPage() {
//   const [view, setView] = useState<View>("table");
//   const [activeContract, setActiveContract] = useState<Contract | null>(null);

//   const { paginatedData, page, pageSize, total, setPage, setPageSize } =
//     useContractsPagination(CONTRACTS);

//   return (
//     <div className="space-y-4">
//       {/* TOP TOOLBAR */}
//       <div className="flex items-center justify-between gap-6">
//         {/* Left: Search */}
//         <Input.Search
//           placeholder="Search contracts, counterparties, clauses…"
//           className="w-[340px]"
//           allowClear
//         />

//         {/* Middle: Page size selector */}
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <span>Rows</span>
//           <Select
//             value={pageSize}
//             className="w-[90px]"
//             onChange={(s) => {
//               setPageSize(s);
//               setPage(1);
//             }}
//             options={[
//               { value: 10, label: "10" },
//               { value: 12, label: "12" },
//               { value: 20, label: "20" },
//             ]}
//           />
//         </div>

//         {/* Right: View switch */}
//         <Button.Group className="shadow-sm rounded-xl overflow-hidden">
//           <Tooltip title="Table view">
//             <Button
//               type={view === "table" ? "primary" : "default"}
//               onClick={() => setView("table")}
//               className="flex items-center gap-2 px-4"
//             >
//               <LayoutGrid size={16} />
//               <span className="text-sm font-medium">Table</span>
//             </Button>
//           </Tooltip>

//           <Tooltip title="List view">
//             <Button
//               type={view === "list" ? "primary" : "default"}
//               onClick={() => setView("list")}
//               className="flex items-center gap-2 px-4"
//             >
//               <List size={16} />
//               <span className="text-sm font-medium">List</span>
//             </Button>
//           </Tooltip>

//           <Tooltip title="Card view">
//             <Button
//               type={view === "card" ? "primary" : "default"}
//               onClick={() => setView("card")}
//               className="flex items-center gap-2 px-4"
//             >
//               <CreditCard size={16} />
//               <span className="text-sm font-medium">Card</span>
//             </Button>
//           </Tooltip>
//         </Button.Group>
//       </div>

//       <Divider className="my-2" />

//       {/* CONTENT */}
//       {view === "table" && (
//         <ContractTableView data={paginatedData} onSelect={setActiveContract} />
//       )}

//       {view === "list" && (
//         <ContractListView data={paginatedData} onSelect={setActiveContract} />
//       )}

//       {view === "card" && (
//         <ContractCardView data={paginatedData} onSelect={setActiveContract} />
//       )}

//       {/* BOTTOM PAGINATION */}
//       <PaginationControl
//         page={page}
//         pageSize={pageSize}
//         total={total}
//         onPageChange={setPage}
//       />

//       <ContractPreviewDrawer
//         contract={activeContract}
//         onClose={() => setActiveContract(null)}
//       />
//     </div>
//   );
// }
