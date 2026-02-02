import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomeLayout from "./components/layout/Home/HomeLayout";
import ContractsLayout from "./components/layout/Contracts/ContractsLayout";
import RenewalsLayout from "./components/layout/Renewals/RenewalsLayout";
import IntakeLayout from "./components/layout/Intake/IntakeLayout";
import Intake from "./pages/Intake/IntakePage";
import IntakeRequestForm from "./pages/Intake/IntakeRequestForm";
import DocumentLayout from "./components/layout/Documents/DocumentLayout";
import Document from "./pages/Documents/DocumentPage";
import DocumentForm from "./pages/Documents/DocumentRequestForm";
import Dashboard from "./pages/Home";
import Contracts from "./pages/Contract/ContractsPage";
import ContractsTableDetails from "./pages/Contract/ContractsTableDetails";
import NewContractForm from "./pages/Contract/NewContractForm";
import NewRequestForm from "./pages/Contract/NewContractForm";
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
            <Route path="/Home" element={<Dashboard />} />
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
            <Route path="/renewals/CreateNewRequest" element={<NewRequestForm/>} />
          </Route>

          {/* Intake */}
            <Route element={<IntakeLayout />}>
            <Route path="/intake" element={<Intake />} />
            <Route path="/intake/CreateNewRequestIntake" element={<IntakeRequestForm/>} />
          </Route>
              <Route element={<DocumentLayout />}>
            <Route path="/documents" element={<Document />} />
            <Route path="/document/CreateNewDocument" element={<DocumentForm/>} />
          </Route>

        </Route>

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </BrowserRouter>
  );
}
