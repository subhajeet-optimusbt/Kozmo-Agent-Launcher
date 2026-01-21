import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import GradientBackground from "./GradientBackground";
import RenewalHeader from "./RenewalsHeader";
import LauncherModal from "../launcher/LauncherModal";

export default function RenewalsLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative px-6 py-2">
      <GradientBackground />

      <RenewalHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateRequest={() =>
          navigate("/renewals/CreateNewRequest")
        }
        onOpenLauncher={() => setLauncherOpen(true)}
      />

      <main className="mt-2">
        <Outlet context={{ activeTab }} />
      </main>

      <LauncherModal
        launcherOpen={launcherOpen}
        setLauncherOpen={setLauncherOpen}
      />
    </div>
  );
}
