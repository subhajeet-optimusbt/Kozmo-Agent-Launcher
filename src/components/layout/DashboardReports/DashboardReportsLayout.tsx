import { useState } from "react";
import { Outlet } from "react-router-dom";
import GradientBackground from "../GradientBackground";
import DashboardReportsHeader from "./DashboardReportsHeader";
import LauncherModal from "../../launcher/LauncherModal";

export default function ContractsLayout() {
  const [launcherOpen, setLauncherOpen] = useState(false);

  return (
    <div className="min-h-screen relative px-6 py-2" style={{ zIndex: 1 }}>
      <GradientBackground />

      <div style={{ position: "relative", zIndex: 10 }}>
        <DashboardReportsHeader
          onOpenLauncher={() => setLauncherOpen(true)}
        />

        <main className="mt-2">
          <Outlet />
        </main>
      </div>

      <LauncherModal
        launcherOpen={launcherOpen}
        setLauncherOpen={setLauncherOpen}
      />
    </div>
  );
}
