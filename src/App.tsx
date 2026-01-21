import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeLayout from "./components/layout/HomeLayout";
import ContractsLayout from "./components/layout/ContractsLayout";
import RenewalsLayout from "./components/layout/RenewalsLayout";

import Dashboard from "./pages/Home";
import Contracts from "./pages/Contract/ContractsPage";
import ContractsTableDetails from "./pages/Contract/ContractsTableDetails";
import NewContractForm from "./pages/Contract/NewContractForm";
import Renewals from "./pages/Renewals/RenewalsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Contracts */}
        <Route element={<ContractsLayout />}>
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/:id" element={<ContractsTableDetails />} />
          <Route path="/contracts/CreateNewContract" element={<NewContractForm />} />
        </Route>

        {/* Renewals */}
        <Route element={<RenewalsLayout />}>
          <Route path="/renewals" element={<Renewals />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
