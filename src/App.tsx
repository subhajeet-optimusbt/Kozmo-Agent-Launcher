import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomeLayout from "./components/layout/HomeLayout";
import ContractsLayout from "./components/layout/ContractsLayout";
import RenewalsLayout from "./components/layout/RenewalsLayout";

import Dashboard from "./pages/Home";
import Contracts from "./pages/Contract/ContractsPage";
import ContractsTableDetails from "./pages/Contract/ContractsTableDetails";
import NewContractForm from "./pages/Contract/NewContractForm";
import Renewals from "./pages/Renewals/RenewalsPage";
import SignupPage from "./pages/auth/signuppage";
import Login from "./pages/auth/loginpage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= PROTECTED APP ================= */}
        <Route element={<ProtectedRoute />}>
          
          {/* Home */}
          <Route element={<HomeLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Contracts */}
          <Route element={<ContractsLayout />}>
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/contracts/:id" element={<ContractsTableDetails />} />
            <Route
              path="/contracts/CreateNewContract"
              element={<NewContractForm />}
            />
          </Route>

          {/* Renewals */}
          <Route element={<RenewalsLayout />}>
            <Route path="/renewals" element={<Renewals />} />
          </Route>

        </Route>

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </BrowserRouter>
  );
}
