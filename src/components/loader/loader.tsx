import React from "react";

const DashboardLoader:React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">

      <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>

      <div className="grid grid-cols-4 gap-6">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 bg-slate-200 rounded-2xl"
          />
        ))}

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="h-64 bg-slate-200 rounded-2xl"></div>

        <div className="h-64 bg-slate-200 rounded-2xl"></div>

      </div>

    </div>
  );
};

export default DashboardLoader;