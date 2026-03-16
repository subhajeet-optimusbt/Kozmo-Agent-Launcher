import { useState } from "react";
import { Outlet } from "react-router-dom";
import GradientBackground from "../GradientBackground";
import DocumentHeader from "./DocumentHeader";
import LauncherModal from "../../launcher/LauncherModal";

export default function ContractsLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [launcherOpen, setLauncherOpen] = useState(false);

  return (
    <div className="min-h-screen relative px-6 py-2" style={{ zIndex: 1 }}>
      <GradientBackground />

      <div style={{ position: "relative", zIndex: 10 }}>
        <DocumentHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenLauncher={() => setLauncherOpen(true)}
        />

        <main className="mt-2">
          <Outlet context={{ activeTab }} />
        </main>
      </div>

      <LauncherModal
        launcherOpen={launcherOpen}
        setLauncherOpen={setLauncherOpen}
      />
    </div>
  );
}
