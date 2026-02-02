import { useState } from "react";
import { Outlet } from "react-router-dom";
import GradientBackground from "../GradientBackground";
import Header from "./Header";
import LauncherModal from "../../launcher/LauncherModal";

export default function AppLayout() {
  const [launcherOpen, setLauncherOpen] = useState(false);

  return (
    <div className="min-h-screen relative font-sans text-gray-900 px-6 py-2">
      <GradientBackground />

      <Header onOpenLauncher={() => setLauncherOpen(true)} />

      <main className="mt-2">
        <Outlet />
      </main>

      <LauncherModal
        launcherOpen={launcherOpen}
        setLauncherOpen={setLauncherOpen}
      />
    </div>
  );
}
