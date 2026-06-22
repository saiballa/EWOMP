import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";

const DashboardLayoutPage: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen bg-slate-100">
  <Sidebar />

  <div className="flex-1 min-w-0 overflow-auto">
    <main className="flex-1
      min-w-0
      p-3
      md:p-4
      pt-16
      md:pt-4">
      <Outlet />
    </main>
  </div>
</div>
    </>
  );
};

export default DashboardLayoutPage;
